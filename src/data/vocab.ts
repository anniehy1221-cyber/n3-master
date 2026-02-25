export type VocabItem = {
  id: string;
  kanji: string;
  kana: string;
  meaningZh: string;
  exampleJa: string;
  exampleZh: string;
};

// Mock data based on N3-level vocabulary; later can be replaced with parsed PDF.
export const vocabItems: VocabItem[] = [
  {
    id: "v1",
    kanji: "経験",
    kana: "けいけん",
    meaningZh: "经验",
    exampleJa: "日本で働いた経験があります。",
    exampleZh: "我有在日本工作的经验。",
  },
  {
    id: "v2",
    kanji: "残念",
    kana: "ざんねん",
    meaningZh: "遗憾，可惜",
    exampleJa: "試験に落ちてしまって残念です。",
    exampleZh: "考试没通过，真是遗憾。",
  },
  {
    id: "v3",
    kanji: "原因",
    kana: "げんいん",
    meaningZh: "原因",
    exampleJa: "事故の原因を調べています。",
    exampleZh: "正在调查事故的原因。",
  },
  {
    id: "v4",
    kanji: "相談",
    kana: "そうだん",
    meaningZh: "商量，咨询",
    exampleJa: "分からないことがあれば先生に相談してください。",
    exampleZh: "如果有不明白的地方，请和老师商量。",
  },
  {
    id: "v5",
    kanji: "場合",
    kana: "ばあい",
    meaningZh: "场合，情况",
    exampleJa: "雨の場合は中止します。",
    exampleZh: "如果下雨，就取消。",
  },
];

