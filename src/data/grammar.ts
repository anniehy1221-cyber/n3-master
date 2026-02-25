export type GrammarItem = {
  id: string;
  title: string;
  pattern: string;
  meaningZh: string;
  explanationZh: string;
  exampleJa: string;
  exampleZh: string;
};

export const grammarItems: GrammarItem[] = [
  {
    id: "g1",
    title: "〜ようになる",
    pattern: "動詞辞書形／ない形 + ようになる",
    meaningZh: "变得……，开始……",
    explanationZh:
      "表示能力或习惯的变化，逐渐变成某种状态。常用于表示“从不会到会”的变化。",
    exampleJa: "毎日練習して、漢字が読めるようになりました。",
    exampleZh: "每天练习，现在已经能读汉字了。",
  },
  {
    id: "g2",
    title: "〜ところだ",
    pattern: "動詞辞書形／ている／た形 + ところだ",
    meaningZh: "正要…… / 正在…… / 刚刚……",
    explanationZh:
      "表示动作的时间阶段。辞書形：正要做；ている：正在做；た形：刚做完。",
    exampleJa: "今から出かけるところです。",
    exampleZh: "正要出门。",
  },
  {
    id: "g3",
    title: "〜ても",
    pattern: "動詞て形／い形くて／な形で／名詞で + も",
    meaningZh: "即使……也……",
    explanationZh: "表示让步，前项成立也不会影响后项的结果。",
    exampleJa: "雨が降っても、試合は続けます。",
    exampleZh: "即使下雨，比赛也会继续。",
  },
  {
    id: "g4",
    title: "〜はずだ",
    pattern: "普通形 + はずだ（な形・名詞：だ→の）",
    meaningZh: "照理说……，应该……",
    explanationZh: "基于某种客观依据进行推测，带有说话人的确信。",
    exampleJa: "彼は日本に長く住んでいたから、日本語が上手なはずだ。",
    exampleZh: "他在日本住了很久，按理说日语应该很好。",
  },
  {
    id: "g5",
    title: "〜ようにする",
    pattern: "動詞辞書形／ない形 + ようにする",
    meaningZh: "尽量……，注意……",
    explanationZh:
      "表示自己有意识地努力，使某个行为成为习惯。常和“毎日・できるだけ”等一起使用。",
    exampleJa: "健康のために、毎日歩くようにしています。",
    exampleZh: "为了健康，我尽量每天步行。",
  },
];

