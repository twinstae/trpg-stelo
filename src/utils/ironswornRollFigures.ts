/**
 * 철의 맹세 규칙서의 주사위·트랙 그림을 HTML·SVG로 펼친다. PDF를 마크다운으로 옮기면서
 * 그림이 빠졌으므로, 대역 원고에는 그림의 값만 태그 한 줄로 적고 모양은 여기서 만든다.
 *
 * 판정 띠(「긴 플레이 예시」): 액션 주사위 + 능력치 + 수정치 = 합, 도전 주사위 둘과 ✓/✕
 *   <iw-roll action="3" stat="wits" stat-value="1" adds="1" challenge="5 7"></iw-roll>
 *   <iw-roll progress="8" challenge="7 3"></iw-roll>
 *   <iw-roll plain action="3" stat-value="2" adds="1"></iw-roll>   (밝은 바탕, 도전 주사위 없이 액션 점수까지)
 *
 * 1장 설명 그림
 *   <iw-dice-intro challenge="4 8" action="3"></iw-dice-intro>     도전 주사위 둘과 액션 주사위
 *   <iw-compare score="6" challenge="4 8"></iw-compare>             액션 점수를 도전 주사위와 견주기
 *   <iw-match face="5"></iw-match>                                  눈 맞음(5 = 5)
 *   <iw-burn track="+7 +6 +5 +4" mark="+6" challenge="5 8"></iw-burn>  모멘텀 불태우기
 *   <iw-negative track="-2 -3 -4 -5" mark="-4" action="4"></iw-negative> 부정 모멘텀
 *   <iw-progress ticks="0"></iw-progress>                           진행 트랙(틱 0–40)
 *   <iw-ranks></iw-ranks>                                           도전 등급별 진척 표시
 *   <iw-progress-roll ticks="26" challenge="4 6"></iw-progress-roll> 진행 점수와 도전 주사위
 *
 * 글 안에 넣는 낱개(다른 HTML 블록 안에서 쓴다)
 *   <iw-marks value="hit miss"></iw-marks>   ✓/✕ 동그라미
 *   <iw-d10 face="80" tone="light"></iw-d10>  도전·오라클 주사위 하나
 *
 * 도전 주사위의 10은 책처럼 "0"으로 적는다. ✓/✕와 결과(강한 성공·약한 성공·실패)는
 * 값에서 계산하므로 원고에 따로 적지 않는다. 스타일은 `src/pages/ko/ironsworn/[slug].astro`.
 */

export type RollLang = 'en' | 'ko';

const STAT_LABEL: Record<string, Record<RollLang, string>> = {
  stat: { en: 'Stat', ko: '능력치' },
  edge: { en: 'Edge', ko: '기민' },
  heart: { en: 'Heart', ko: '심지' },
  iron: { en: 'Iron', ko: '강철' },
  shadow: { en: 'Shadow', ko: '그림자' },
  wits: { en: 'Wits', ko: '지혜' },
  health: { en: 'Health', ko: '건강' },
  spirit: { en: 'Spirit', ko: '정신' },
  supply: { en: 'Supply', ko: '보급' },
};

type Outcome = 'strong' | 'weak' | 'miss';

const TEXT = {
  en: {
    adds: 'Adds',
    progress: 'Progress',
    action: 'Action die',
    actionScore: 'Action score',
    challenge: 'challenge dice',
    challengeLabel: 'Challenge dice',
    actionLabel: 'Action die',
    compareTo: 'Compare to',
    greater: 'Greater than',
    notGreater: '<strong>NOT</strong> greater than',
    momentumTrack: 'Momentum track',
    mayCancel: 'You <strong>may</strong> cancel this die.',
    mustCancel: 'You <strong>must</strong> cancel this die.',
    progressScore: 'Progress score',
    progressTrack: 'Progress track',
    ranks: [
      ['Troublesome', 'mark 3 progress'],
      ['Dangerous', 'mark 2 progress'],
      ['Formidable', 'mark 1 progress'],
      ['Extreme', 'mark 2 ticks'],
      ['Epic', 'mark 1 tick'],
    ],
    outcome: { strong: 'strong hit', weak: 'weak hit', miss: 'miss' } as Record<Outcome, string>,
    hit: 'hit',
    miss: 'miss',
  },
  ko: {
    adds: '수정치',
    progress: '진척',
    action: '액션 주사위',
    actionScore: '액션 점수',
    challenge: '도전 주사위',
    challengeLabel: '도전 주사위',
    actionLabel: '액션 주사위',
    compareTo: '견주기',
    greater: '더 큼',
    notGreater: '더 크지 <strong>않음</strong>',
    momentumTrack: '모멘텀 트랙',
    mayCancel: '이 주사위를 무를 <strong>수 있습니다</strong>.',
    mustCancel: '이 주사위를 <strong>무효로 해야 합니다</strong>.',
    progressScore: '진행 점수',
    progressTrack: '진행 트랙',
    ranks: [
      ['성가신', '진척 3 표시'],
      ['위험한', '진척 2 표시'],
      ['막강한', '진척 1 표시'],
      ['극한', '틱 2 표시'],
      ['서사', '틱 1 표시'],
    ],
    outcome: { strong: '강한 성공', weak: '약한 성공', miss: '실패' } as Record<Outcome, string>,
    hit: '적중',
    miss: '빗나감',
  },
} satisfies Record<RollLang, unknown>;

type Attrs = Record<string, string>;

const TAG_RE = /<(iw-[a-z0-9-]+)\b([^>]*)><\/\1>/g;
const ATTR_RE = /([\w-]+)(?:="([^"]*)")?/g;

function attrsOf(raw: string): Attrs {
  const attrs: Attrs = {};
  for (const [, name, value] of raw.matchAll(ATTR_RE)) attrs[name!] = value ?? '';
  return attrs;
}

function int(attrs: Attrs, name: string, tag: string): number {
  const value = Number(attrs[name]);
  if (attrs[name] === undefined || attrs[name] === '' || !Number.isInteger(value)) {
    throw new Error(`[ironsworn 그림] ${name} 값이 정수가 아닙니다: ${tag}`);
  }
  return value;
}

/** 도전 주사위 두 개. 책의 d10 눈 0은 10이다. */
function challengeOf(attrs: Attrs, tag: string): [number, number] {
  const values = (attrs.challenge ?? '').trim().split(/\s+/).map(Number);
  if (values.length !== 2 || values.some((n) => !Number.isInteger(n) || n < 0 || n > 10)) {
    throw new Error(`[ironsworn 그림] challenge는 0–9(0은 10) 두 개여야 합니다: ${tag}`);
  }
  return values.map((n) => (n === 0 ? 10 : n)) as [number, number];
}

const CROSS = `<path class="iw-die__cross" d="M4 4 L52 52 M52 4 L4 52"/>`;

/** 액션 주사위(d6). 앞면에 눈을 적은 정육면체. */
function d6(value: number, opts: { crossed?: boolean; cls?: string } = {}): string {
  return (
    `<svg class="iw-die iw-die--d6 ${opts.cls ?? ''}${opts.crossed ? ' is-crossed' : ''}" viewBox="0 0 56 56" role="img" aria-label="d6: ${value}">` +
    `<g class="iw-die__body">` +
    `<polygon points="5,16 15,6 49,6 39,16" fill="#cfcfcf"/>` +
    `<polygon points="39,16 49,6 49,41 39,51" fill="#9a9a9a"/>` +
    `<rect x="5" y="16" width="34" height="35" fill="#ececec"/>` +
    `<text x="22" y="34" text-anchor="middle" dominant-baseline="central">${value}</text>` +
    `</g>` +
    (opts.crossed ? CROSS : '') +
    `</svg>`
  );
}

const D10_TONES = {
  normal: ['#8c8c8c', '#b3b3b3', '#6f6f6f', '#999', '#dcdcdc'],
  light: ['#b8b8b8', '#d2d2d2', '#a2a2a2', '#c4c4c4', '#ededed'],
  dark: ['#5f5f5f', '#7d7d7d', '#4a4a4a', '#6a6a6a', '#a8a8a8'],
} as const;

/** 도전·오라클 주사위(d10). 윗면에 눈을 적고, 배지가 있으면 오른쪽 아래에 ✓/✕를 단다. */
function d10(
  face: number | string,
  opts: { badge?: 'hit' | 'miss'; tone?: keyof typeof D10_TONES; crossed?: boolean; cls?: string } = {},
): string {
  const shown = typeof face === 'number' ? String(face % 10) : face;
  const [ul, ur, ll, lr, top] = D10_TONES[opts.tone ?? 'normal'];
  const badge = opts.badge
    ? `<circle class="iw-die__badge" cx="44" cy="44" r="9.5"/>` +
      `<g class="iw-die__mark">${
        opts.badge === 'hit' ? `<path d="M39.2 44.4 l3.4 3.4 l6.6 -7"/>` : `<path d="M40.2 40.2 l7.6 7.6 M47.8 40.2 l-7.6 7.6"/>`
      }</g>`
    : '';
  return (
    `<svg class="iw-die iw-die--d10 ${opts.cls ?? ''}${opts.crossed ? ' is-crossed' : ''}" viewBox="0 0 56 56" role="img" aria-label="d10: ${shown}">` +
    `<g class="iw-die__body">` +
    `<polygon points="28,3 15,26 3,30" fill="${ul}"/>` +
    `<polygon points="28,3 41,26 53,30" fill="${ur}"/>` +
    `<polygon points="3,30 15,26 28,34 28,52" fill="${ll}"/>` +
    `<polygon points="53,30 41,26 28,34 28,52" fill="${lr}"/>` +
    `<polygon points="28,3 41,26 28,34 15,26" fill="${top}"/>` +
    `<text x="28" y="23" text-anchor="middle" dominant-baseline="central"${shown.length > 1 ? ' class="is-small"' : ''}>${shown}</text>` +
    `</g>` +
    badge +
    (opts.crossed ? CROSS : '') +
    `</svg>`
  );
}

/** ✓/✕ 동그라미 하나. */
function mark(kind: 'hit' | 'miss', lang: RollLang): string {
  const path = kind === 'hit' ? `<path d="M7.2 12.4 l3.2 3.2 l6.4 -7"/>` : `<path d="M8 8 l8 8 M16 8 l-8 8"/>`;
  return `<svg class="iw-mark" viewBox="0 0 24 24" role="img" aria-label="${TEXT[lang][kind]}"><circle cx="12" cy="12" r="10.5"/>${path}</svg>`;
}

/**
 * 진행 칸 하나의 틱(0–4). 책처럼 \ → / → | → — 순으로 그어 넷이면 별 모양이 된다.
 */
const TICK_PATHS = ['M3 3 L17 17', 'M17 3 L3 17', 'M10 1.5 V18.5', 'M1.5 10 H18.5'];

function boxes(ticksPerBox: number[], cls = ''): string {
  const step = 22;
  const width = ticksPerBox.length * step;
  const cells = ticksPerBox
    .map((ticks, i) => {
      const x = i * step + 1;
      const lines = TICK_PATHS.slice(0, ticks).join(' ');
      return (
        `<g transform="translate(${x} 1)"><rect class="iw-box__frame" width="20" height="20"/>` +
        (lines ? `<path class="iw-box__ticks" d="${lines}"/>` : '') +
        `</g>`
      );
    })
    .join('');
  return `<svg class="iw-boxes ${cls}" viewBox="0 0 ${width} 22" aria-hidden="true">${cells}</svg>`;
}

/** 틱 수(0–40)를 진행 칸 열 개로 나눈다. */
function trackBoxes(ticks: number): number[] {
  return Array.from({ length: 10 }, (_, i) => Math.max(0, Math.min(4, ticks - i * 4)));
}

const ARROW =
  `<svg class="iw-fig__arrow" viewBox="0 0 48 12" aria-hidden="true"><path d="M1 6 H45 M39 1 L46 6 L39 11"/></svg>`;

/** 모멘텀 트랙의 한 토막. 지금 값에는 클립을 끼운 듯 테두리를 두른다. */
function momentumTrack(values: string, marked: string, lang: RollLang): string {
  const cells = values
    .trim()
    .split(/\s+/)
    .map((value) => `<span class="iw-track__cell${value === marked ? ' is-marked' : ''}">${value}</span>`)
    .join('');
  return (
    `<span class="iw-fig__group"><span class="iw-track" role="img" aria-label="${TEXT[lang].momentumTrack} ${marked}">${cells}</span>` +
    `<span class="iw-fig__label">${TEXT[lang].momentumTrack}</span></span>`
  );
}

const srOnly = (text: string) => `<figcaption class="iw-sr">${text}</figcaption>`;

// ── 판정 띠 ──────────────────────────────────────────────

function term(label: string, value: number, cls = 'iw-roll__num'): string {
  return `<span class="iw-roll__term"><span class="iw-roll__label">${label}</span><span class="${cls}">${value}</span></span>`;
}

const op = (sign: string) => `<span class="iw-roll__op">${sign}</span>`;

function renderRoll(attrs: Attrs, lang: RollLang, tag: string): string {
  const text = TEXT[lang];
  const plain = attrs.plain !== undefined;

  let score: number;
  let terms: string;
  let spoken: string;

  if (attrs.progress !== undefined) {
    score = int(attrs, 'progress', tag);
    terms = term(text.progress, score, 'iw-roll__num iw-roll__total');
    spoken = `${text.progress} ${score}`;
  } else {
    const action = int(attrs, 'action', tag);
    const statValue = int(attrs, 'stat-value', tag);
    const adds = attrs.adds === undefined ? 0 : int(attrs, 'adds', tag);
    const stat = STAT_LABEL[attrs.stat ?? 'stat'];
    if (!stat) throw new Error(`[iw-roll] 모르는 stat입니다: ${tag}`);

    // 액션 점수는 10을 넘지 않는다.
    score = Math.min(action + statValue + adds, 10);
    // 도전 주사위가 없는 설명 그림은 합 위에 「액션 점수」 이름표를 단다.
    const total =
      attrs.challenge === undefined
        ? term(text.actionScore, score, 'iw-roll__total')
        : `<span class="iw-roll__total">${score}</span>`;
    terms =
      `<span class="iw-roll__die">${d6(action, { cls: 'iw-roll__d6' })}</span>` +
      op('+') +
      term(stat[lang], statValue) +
      op('+') +
      term(text.adds, adds) +
      op('=') +
      total;
    spoken = `${text.action} ${action} + ${stat[lang]} ${statValue} + ${text.adds} ${adds} = ${score}`;
  }

  let dice = '';
  let caption = spoken;
  let outcomeAttr = '';
  if (attrs.challenge !== undefined) {
    const [c1, c2] = challengeOf(attrs, tag);
    const beaten = [score > c1, score > c2] as const;
    const hits = beaten.filter(Boolean).length;
    const outcome: Outcome = hits === 2 ? 'strong' : hits === 1 ? 'weak' : 'miss';
    // 한국어는 숫자 뒤 조사(와/과)를 피해 가운뎃점으로 잇는다.
    const faces = lang === 'ko' ? `${c1 % 10}·${c2 % 10}` : `${c1 % 10} and ${c2 % 10}`;
    caption = `${spoken}, ${text.challenge} ${faces}: ${text.outcome[outcome]}`;
    outcomeAttr = ` data-outcome="${outcome}"`;
    dice =
      `<span class="iw-roll__challenge">` +
      d10(c1, { badge: beaten[0] ? 'hit' : 'miss', cls: 'iw-roll__d10' }) +
      d10(c2, { badge: beaten[1] ? 'hit' : 'miss', cls: 'iw-roll__d10' }) +
      `</span>`;
  }

  // 마크다운 HTML 블록은 빈 줄에서 끝나므로 한 줄로 낸다.
  return (
    `<figure class="iw-roll${plain ? ' iw-roll--plain' : ''}"${outcomeAttr}>` +
    `<div class="iw-roll__band" aria-hidden="true">${terms}${dice}</div>` +
    `<figcaption class="iw-roll__caption">${caption}</figcaption>` +
    `</figure>`
  );
}

// ── 1장 설명 그림 ────────────────────────────────────────

type Renderer = (attrs: Attrs, lang: RollLang, tag: string) => string;

const RENDERERS: Record<string, Renderer> = {
  'iw-roll': renderRoll,

  'iw-dice-intro': (attrs, lang, tag) => {
    const [c1, c2] = challengeOf(attrs, tag);
    const action = int(attrs, 'action', tag);
    const text = TEXT[lang];
    return (
      `<figure class="iw-fig">` +
      `<span class="iw-fig__group"><span class="iw-fig__dice">${d10(c1)}${d10(c2)}</span>` +
      `<span class="iw-fig__label iw-fig__bracket iw-fig__bracket--under">${text.challengeLabel}</span></span>` +
      `<span class="iw-fig__group"><span class="iw-fig__dice">${d6(action)}</span>` +
      `<span class="iw-fig__label">${text.actionLabel}</span></span>` +
      `</figure>`
    );
  },

  'iw-compare': (attrs, lang, tag) => {
    const score = int(attrs, 'score', tag);
    const challenge = challengeOf(attrs, tag);
    const text = TEXT[lang];
    const dice = challenge
      .map((face) => {
        const beaten = score > face;
        return (
          `<span class="iw-fig__die">${d10(face, { badge: beaten ? 'hit' : 'miss' })}` +
          `<span class="iw-fig__note">${beaten ? text.greater : text.notGreater}</span></span>`
        );
      })
      .join('');
    return (
      `<figure class="iw-fig">` +
      `<span class="iw-fig__group"><span class="iw-fig__label">${text.actionScore}</span><span class="iw-fig__score">${score}</span></span>` +
      `<span class="iw-fig__label iw-fig__compare">${text.compareTo}</span>` +
      `<span class="iw-fig__group"><span class="iw-fig__label iw-fig__bracket iw-fig__bracket--over">${text.challengeLabel}</span>` +
      `<span class="iw-fig__dice">${dice}</span></span>` +
      `</figure>`
    );
  },

  'iw-match': (attrs, _lang, tag) => {
    const face = int(attrs, 'face', tag);
    return `<figure class="iw-fig iw-fig--match">${d10(face)}<span class="iw-fig__equals" aria-label="=">=</span>${d10(face)}</figure>`;
  },

  'iw-burn': (attrs, lang, tag) => {
    const [c1, c2] = challengeOf(attrs, tag);
    const text = TEXT[lang];
    return (
      `<figure class="iw-fig">` +
      momentumTrack(attrs.track ?? '', attrs.mark ?? '', lang) +
      ARROW +
      `<span class="iw-fig__group"><span class="iw-fig__label iw-fig__bracket iw-fig__bracket--over">${text.challengeLabel}</span>` +
      `<span class="iw-fig__dice">` +
      `<span class="iw-fig__die">${d10(c1, { crossed: true })}<span class="iw-fig__note">${text.mayCancel}</span></span>` +
      `<span class="iw-fig__die">${d10(c2)}</span>` +
      `</span></span>` +
      `</figure>`
    );
  },

  'iw-negative': (attrs, lang, tag) => {
    const action = int(attrs, 'action', tag);
    const text = TEXT[lang];
    return (
      `<figure class="iw-fig">` +
      momentumTrack(attrs.track ?? '', attrs.mark ?? '', lang) +
      ARROW +
      `<span class="iw-fig__group"><span class="iw-fig__label">${text.actionLabel}</span>` +
      `<span class="iw-fig__die">${d6(action, { crossed: true })}<span class="iw-fig__note">${text.mustCancel}</span></span></span>` +
      `</figure>`
    );
  },

  'iw-progress': (attrs, lang, tag) => {
    const ticks = int(attrs, 'ticks', tag);
    return (
      `<figure class="iw-fig iw-fig--track">${boxes(trackBoxes(ticks), 'iw-boxes--track')}` +
      srOnly(`${TEXT[lang].progressTrack}: ${ticks}/40`) +
      `</figure>`
    );
  },

  'iw-ranks': (_attrs, lang) => {
    const counts = [[4, 4, 4], [4, 4], [4], [2], [1]];
    const items = TEXT[lang].ranks
      .map(
        ([name, rule], i) =>
          `<span class="iw-rank">${boxes(counts[i]!, 'iw-boxes--rank')}<span class="iw-rank__text"><strong>${name}</strong> ${rule}</span></span>`,
      )
      .join('');
    return `<figure class="iw-fig iw-fig--ranks">${items}</figure>`;
  },

  'iw-progress-roll': (attrs, lang, tag) => {
    const ticks = int(attrs, 'ticks', tag);
    const score = Math.floor(ticks / 4);
    const text = TEXT[lang];
    const dice = challengeOf(attrs, tag)
      .map((face) => d10(face, { badge: score > face ? 'hit' : 'miss' }))
      .join('');
    return (
      `<figure class="iw-fig iw-fig--stack">` +
      `<span class="iw-fig__row"><span class="iw-fig__label">${text.progressScore}</span><span class="iw-fig__score">${score}</span></span>` +
      boxes(trackBoxes(ticks), 'iw-boxes--track') +
      `<span class="iw-fig__row"><span class="iw-fig__label">${text.challengeLabel}</span><span class="iw-fig__dice">${dice}</span></span>` +
      `</figure>`
    );
  },

  'iw-marks': (attrs, lang) =>
    `<span class="iw-marks">${(attrs.value ?? '')
      .trim()
      .split(/\s+/)
      .map((kind) => mark(kind === 'hit' ? 'hit' : 'miss', lang))
      .join('')}</span>`,

  'iw-d10': (attrs) => {
    const tone = attrs.tone === 'light' || attrs.tone === 'dark' ? attrs.tone : 'normal';
    return d10(attrs.face ?? '', { tone });
  },
};

/** 원고의 `<iw-…></iw-…>` 태그를 그림으로 바꾼다. 모르는 태그는 빌드를 멈춘다. */
export function expandRollFigures(source: string, lang: RollLang): string {
  return source.replace(TAG_RE, (tag, name: string, raw: string) => {
    const render = RENDERERS[name];
    if (!render) throw new Error(`[ironsworn 그림] 모르는 태그입니다: ${tag}`);
    return render(attrsOf(raw), lang, tag);
  });
}
