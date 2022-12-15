function count(text: string, regex: RegExp): number {
  let result = 0;
  for (const c of text) {
    if (regex.test(c)) {
      result += 1;
    }
  }
  return result;
}

function calcRatio(rawText: string): { koCount: number; enCount: number; total: number; percent: number; } {
  const start = rawText.indexOf('---', 10) + 3;
  const text = rawText.slice(start).trim()
    .replace(/\([^)]+\)/g, '')
    .replace(/d[0-9]/g, '')
    .replace(/([0-9]m|[0-9]km)/g, '')
    .replace(/(PC|NPC|GM|SF)/g, '')
    .replace(/<[^>]+>/g, '');
  const koRegex = /[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]/;
  const enRegex = /[a-zA-Z]/

  const koCount = count(text, koRegex) * 2
  const enCount = count(text, enRegex)
  // console.log(text.match(/[a-zA-Z]+/g)?.join(''))
  const total = koCount + enCount;
  const percent = Math.floor(koCount / total * 100)
  return {
    koCount,
    enCount,
    total,
    percent
  };
}

function _sum(items: number[]): number {
  let result = 0;
  for (const item of items){
    result += item;
  }
  return result;
}

function sum<T extends number>(items: T[]): number;
function sum<T>(items: T[], getNumber: (a:T) => number): number;
function sum<T>(items: T[], getNumber?: (a:T) => number): number {
  if (getNumber === undefined){
    return _sum(items as number[]);
  }
  return _sum(items.map(item => getNumber(item)));
}

export async function count_ko_en_ratio(): Promise<number> {
  // const file_name_list = []
  // for await (const entry of Deno.readDir('./src/pages/ko/cypher-open')) {
  //   if (entry.isFile) {
  //     file_name_list.push(entry.name);
  //   }
  // }
  const file_name_list = [
    'introduction.md',
    'how-to-play.md',
    'creating-your-character.md',
    'character-types.md',
    'character-flavor.md',
    'character-descriptors.md',
    'character-focus.md',
    'character-abilities.md',
    'equipment.md',
    'rules-of-the-game.md',
    'genres.md',
    'creatures.md',
    'cyphers.md',
    'running-the-cypher-system.md'
  ]

  const text_list = await Promise.all(file_name_list.map(name => Deno.readTextFile('./src/pages/ko/cypher-open/' + name)))
  const result_list = text_list.map(text => calcRatio(text));
  file_name_list.forEach((name, i) => {
    const { koCount, total, percent } = result_list[i];
    console.log(name.padEnd(32, ' ') + `${koCount} / ${total.toString().padStart(6, ' ')}`.padStart(16, ' ')+' = '+`${percent}%`.padStart(4, ' '))
  })

  const koCountSum = sum(result_list, r => r.koCount);
  const totalSum = sum(result_list, r => r.total);
  console.log(`\nall ${koCountSum} / ${totalSum} = ${(koCountSum / totalSum * 100).toFixed(2)}%`)
  return 0;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  count_ko_en_ratio();
}
