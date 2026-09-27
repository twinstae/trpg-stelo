/**
 * 시트에 적은 값과 표시를 브라우저에 남겨 두는 공통 도구.
 *
 * 13시대 직업 시트에서 쓰던 방법을 그대로 옮겨 왔다. 열쇠를 요소 순서로 만들면
 * 시트 모양을 고칠 때마다 저장해 둔 값이 엉뚱한 칸으로 옮겨 간다. 그래서
 * '쪽 + 칸 이름 + 꼬리표'로 열쇠를 만든다.
 */

/** 시트 한 벌을 저장하고 되살리는 데 필요한 값. */
export interface SheetStorageOptions {
  /** 저장 열쇠의 앞머리(`iw-sheet:v1:` 처럼). 시트마다 달라야 한다. */
  prefix: string;
  /** 이 시트의 이름. 같은 페이지에 시트를 여럿 그려도 서로 덮어쓰지 않게 한다. */
  key: string;
  /** '쪽'으로 나눌 요소. 여러 장을 한 시트로 묶을 때만 준다. */
  pageSelector?: string;
  /** 칸 이름을 담은 요소. `data-sheet-section` 이 있으면 그 값을 먼저 쓴다. */
  cardSelector?: string;
}

type SheetControl = HTMLInputElement | HTMLTextAreaElement;

/** 체크 상자와 라디오는 값 대신 표시 여부를 저장한다. */
export function isToggle(control: SheetControl): control is HTMLInputElement {
  return (
    control instanceof HTMLInputElement && (control.type === 'checkbox' || control.type === 'radio')
  );
}

/** 칸 이름을 찾는다. `data-sheet-section` 이 있으면 그 값을, 없으면 첫 제목을 쓴다. */
function sectionName(control: SheetControl, cardSelector: string): string {
  const card = control.closest<HTMLElement>(cardSelector);
  if (!card) return '';
  return (
    card.dataset.sheetSection ?? card.querySelector('h2, h3, h4')?.textContent?.trim() ?? ''
  );
}

/** 컨트롤마다 안정적인 열쇠를 만든다. 꼬리표가 겹치면 같은 칸 안에서 번호를 붙인다. */
export function sheetKeys(sheet: HTMLElement, options: SheetStorageOptions): string[] {
  const pageSelector = options.pageSelector;
  const cardSelector = options.cardSelector ?? '[data-sheet-section]';
  const pages = pageSelector ? Array.from(sheet.querySelectorAll(pageSelector)) : [];
  const seen = new Map<string, number>();

  return Array.from(sheet.querySelectorAll<SheetControl>('input, textarea')).map((control) => {
    const page = pageSelector ? control.closest(pageSelector) : null;
    const label =
      control.getAttribute('aria-label') ?? control.getAttribute('name') ?? control.type;
    const base = `p${page ? pages.indexOf(page) + 1 : 0}|${sectionName(control, cardSelector)}|${label}`;
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}#${count}`;
  });
}

/** 시트에 적은 값을 되살리고, 고칠 때마다 다시 저장한다. */
export function persistSheet(sheet: HTMLElement, options: SheetStorageOptions): void {
  const storageKey = options.prefix + options.key;
  const controls = Array.from(sheet.querySelectorAll<SheetControl>('input, textarea'));
  const keys = sheetKeys(sheet, options);
  const entries = controls.map((control, index) => ({ control, key: keys[index] ?? String(index) }));

  let saved: Record<string, string | boolean> = {};
  try {
    saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Record<
      string,
      string | boolean
    >;
  } catch {
    saved = {};
  }

  entries.forEach(({ control, key }) => {
    const value = saved[key];
    if (value === undefined) return;
    if (isToggle(control)) {
      // 기본값으로 켜져 있는 칸(자산의 기본 능력)은 저장된 false 도 그대로 되살린다.
      control.checked = value === true;
    } else {
      control.value = String(value);
    }
  });

  const save = () => {
    const next: Record<string, string | boolean> = {};
    entries.forEach(({ control, key }) => {
      next[key] = isToggle(control) ? control.checked : control.value;
    });
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* 저장할 수 없는 환경(사생활 보호 모드 등)에서는 조용히 넘어간다. */
    }
  };

  sheet.addEventListener('input', save);
  sheet.addEventListener('change', save);
}

/**
 * 표시된 라디오를 다시 누르면 표시를 지울 수 있게 한다.
 *
 * 상태 트랙처럼 '값 하나만 표시하는' 묶음은 라디오로 만들면 키보드로도 다룰 수 있다.
 * 다만 한 번 표시하면 지울 수 없으니, 누르기 전 상태를 기억해 두었다가 지운다.
 *
 * 숫자를 누르면 그 숫자를 감싼 라벨로, 라벨은 다시 컨트롤로 클릭을 넘긴다. 그래서
 * 컨트롤 하나에 걸지 않고 묶음 전체에 걸어 두고, 클릭이 라벨로 왔든 컨트롤로 왔든
 * 같은 라디오를 찾아낸다. 라벨이 컨트롤을 도로 켜지 않도록 기본 동작도 막는다.
 */
export function wireClearableChoices(
  root: ParentNode,
  selector = 'input[type="radio"]',
): void {
  const container = root instanceof Document ? root.documentElement : (root as HTMLElement);
  let pressedChecked = false;
  let clearedRadio: HTMLInputElement | null = null;
  let clearedAt = 0;

  /** 클릭이 닿은 자리에서 라디오를 찾는다. 숫자를 눌러도 라벨을 거쳐 찾는다. */
  const radioFor = (target: EventTarget | null): HTMLInputElement | null => {
    if (!(target instanceof Element)) return null;
    const radio =
      target instanceof HTMLInputElement
        ? target
        : (target.closest('label')?.querySelector<HTMLInputElement>('input[type="radio"]') ?? null);
    return radio && radio.matches(selector) ? radio : null;
  };

  container.addEventListener('pointerdown', (event) => {
    pressedChecked = radioFor(event.target)?.checked ?? false;
  });

  container.addEventListener('click', (event) => {
    const radio = radioFor(event.target);
    if (!radio) return;

    if (pressedChecked) {
      event.preventDefault();
      radio.checked = false;
      pressedChecked = false;
      clearedRadio = radio;
      clearedAt = performance.now();
      // 저장기가 이 변화를 알아채도록 change 를 알린다.
      radio.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    // 라벨이 컨트롤로 넘긴 두 번째 클릭이 방금 지운 표시를 도로 켜지 않게 한다.
    if (radio === clearedRadio && performance.now() - clearedAt < 500) {
      event.preventDefault();
      radio.checked = false;
    }
  });
}
