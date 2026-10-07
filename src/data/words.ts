export type WordCategory = "it" | "onomatopoeia" | "daily" | "other";

export interface WordItem {
  id: string;
  word: string;
  reading: string;
  category: WordCategory;
  categoryLabel: string;
  meaning: string;
  charCount: number;
  source?: "curated" | "sudachi";
}

export const CATEGORY_LABELS: Record<WordCategory, string> = {
  it: "IT・就活",
  onomatopoeia: "オノマトペ",
  daily: "日常語",
  other: "その他・スラング",
};

export const AVAILABLE_CHARS = ["サ", "ポ", "ー", "タ", "ズ"] as const;
export type AvailableChar = (typeof AVAILABLE_CHARS)[number];

// サ・ポ・ー・タ・ズ の文字のみで構成される大規模抽出辞書データ (SudachiDict + 手動キュレーション)
export const WORDS_DATA: WordItem[] = [
  {
    id: "word-1",
    word: "サポーターズ",
    reading: "さぽーたーず",
    category: "it",
    categoryLabel: "IT・就活",
    meaning:
      "ITエンジニア・学生向け就活支援サービス。技育祭の主催！",
    charCount: 6,
    source: "curated",
  },
  {
    id: "word-17",
    word: "サーサーサー",
    reading: "さーさーさー",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "激しい雨や風、流れる音が重なる様子。",
    charCount: 6,
    source: "curated",
  },
  {
    id: "word-11",
    word: "ポタポタポタ",
    reading: "ぽたぽたぽた",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "しずくが連続して滴り落ちる様子を表す音。",
    charCount: 6,
    source: "curated",
  },
  {
    id: "word-33",
    word: "サササササ",
    reading: "さささささ",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "非常に小気味よく素早く動く様子。",
    charCount: 5,
    source: "sudachi",
  },
  {
    id: "word-2",
    word: "サポーター",
    reading: "さぽーたー",
    category: "it",
    categoryLabel: "IT・就活",
    meaning:
      "支援者",
    charCount: 5,
    source: "curated",
  },
  {
    id: "word-43",
    word: "タタタタタ",
    reading: "たたたたた",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "激しい足音の擬音。",
    charCount: 5,
    source: "sudachi",
  },
  {
    id: "word-12",
    word: "ポタポター",
    reading: "ぽたぽたー",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "水滴が長めに垂れ落ちていく余韻のある様子。",
    charCount: 5,
    source: "curated",
  },
  {
    id: "word-47",
    word: "サポーズ",
    reading: "さぽーず",
    category: "daily",
    categoryLabel: "日常語",
    meaning: "Suppose (仮定する)",
    charCount: 4,
    source: "sudachi",
  },
  {
    id: "word-16",
    word: "サーサー",
    reading: "さーさー",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "雨が絶え間なく降る音や、静かに風が吹き渡る音。",
    charCount: 4,
    source: "curated",
  },
  {
    id: "word-37",
    word: "ズタズタ",
    reading: "ずたずた",
    category: "daily",
    categoryLabel: "日常語",
    meaning: "細かく裂けたり傷ついたりするさま。",
    charCount: 4,
    source: "sudachi",
  },
  {
    id: "word-19",
    word: "ズーズー",
    reading: "ずーずー",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "遠慮がないさま（図々しい）、または勢いよくすする音。",
    charCount: 4,
    source: "curated",
  },
  {
    id: "word-14",
    word: "タポタポ",
    reading: "たぽたぽ",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "水や液体が容器の中でたゆたう音・たっぷり入っている様子。",
    charCount: 4,
    source: "curated",
  },
  {
    id: "word-21",
    word: "ターター",
    reading: "たーたー",
    category: "other",
    categoryLabel: "その他・スラング",
    meaning: "軽快に歩く・走る様子、またはバイバイ（幼児語のta-ta）。",
    charCount: 4,
    source: "curated",
  },
  {
    id: "word-10",
    word: "ポタポタ",
    reading: "ぽたぽた",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "しずくが垂れ落ちる音。「ポタポタ焼き」でもおなじみ。",
    charCount: 4,
    source: "curated",
  },
  {
    id: "word-6",
    word: "ポーター",
    reading: "ぽーたー",
    category: "daily",
    categoryLabel: "日常語",
    meaning: "荷物運搬人、駅やホテルでの案内係。鞄ブランドでも有名。",
    charCount: 4,
    source: "curated",
  },
  {
    id: "word-22",
    word: "ポーポー",
    reading: "ぽーぽー",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "汽笛の音やハトなどの鳥の鳴き声。",
    charCount: 4,
    source: "curated",
  },
  {
    id: "word-32",
    word: "サササ",
    reading: "さささ",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "素早く静かに身を隠したり移動する様子。",
    charCount: 3,
    source: "sudachi",
  },
  {
    id: "word-34",
    word: "ササー",
    reading: "ささー",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "状態や音を表す言葉 (副詞/*)。",
    charCount: 3,
    source: "sudachi",
  },
  {
    id: "word-30",
    word: "サーズ",
    reading: "さーず",
    category: "daily",
    categoryLabel: "日常語",
    meaning: "SARS（重症急性呼吸器症候群）。",
    charCount: 3,
    source: "sudachi",
  },
  {
    id: "word-20",
    word: "ズサー",
    reading: "ずさー",
    category: "other",
    categoryLabel: "その他・スラング",
    meaning: "勢いよく滑り込む・スライディングするときの擬音。",
    charCount: 3,
    source: "curated",
  },
  {
    id: "word-36",
    word: "ズズズ",
    reading: "ずずず",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "麺類やお茶を勢いよくすする音。",
    charCount: 3,
    source: "sudachi",
  },
  {
    id: "word-42",
    word: "タタタ",
    reading: "たたた",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "小走りで軽快に走る足音。",
    charCount: 3,
    source: "sudachi",
  },
  {
    id: "word-50",
    word: "タター",
    reading: "たたー",
    category: "daily",
    categoryLabel: "オノマトペ",
    meaning: "オノマトペ",
    charCount: 3,
    source: "sudachi",
  },
  {
    id: "word-53",
    word: "ポター",
    reading: "ぽたー",
    category: "daily",
    categoryLabel: "オノマトペ",
    meaning: "オノマトペ",
    charCount: 3,
    source: "sudachi",
  },
  {
    id: "word-45",
    word: "ポポポ",
    reading: "ぽぽぽ",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "オノマトペ",
    charCount: 3,
    source: "sudachi",
  },
  {
    id: "word-54",
    word: "ポポー",
    reading: "ぽぽー",
    category: "daily",
    categoryLabel: "オノマトペ",
    meaning: "オノマトペ",
    charCount: 3,
    source: "sudachi",
  },
  {
    id: "word-8",
    word: "ポーズ",
    reading: "ぽーず",
    category: "daily",
    categoryLabel: "日常語",
    meaning:
      "写真撮影などの姿勢（pose）、または動画や音楽の一時停止（pause）。",
    charCount: 3,
    source: "curated",
  },
  {
    id: "word-9",
    word: "ポーツ",
    reading: "ぽーつ",
    category: "daily",
    categoryLabel: "日常語",
    meaning: "港湾（ports）、またはネットワークの通信ポート郡。",
    charCount: 3,
    source: "curated",
  },
  {
    id: "word-31",
    word: "ササ",
    reading: "ささ",
    category: "daily",
    categoryLabel: "日常語",
    meaning: "笹。イネ科タケ亜科の植物。",
    charCount: 2,
    source: "sudachi",
  },
  {
    id: "word-23",
    word: "サタ",
    reading: "さた",
    category: "daily",
    categoryLabel: "日常語",
    meaning: "沙汰（ご無沙汰、音沙汰、表沙汰など）。",
    charCount: 2,
    source: "curated",
  },
  {
    id: "word-5",
    word: "サポ",
    reading: "さぽ",
    category: "it",
    categoryLabel: "日常語",
    meaning: "サポートの略",
    charCount: 2,
    source: "curated",
  },
  {
    id: "word-18",
    word: "サー",
    reading: "さー",
    category: "daily",
    categoryLabel: "日常語",
    meaning: "敬称（Sir）、またはさっと動く音・同意の掛け声（さあ）、オノマトペ。",
    charCount: 2,
    source: "curated",
  },
  {
    id: "word-56",
    word: "ズサ",
    reading: "ずさ",
    category: "daily",
    categoryLabel: "オノマトペ",
    meaning: "オノマトペ",
    charCount: 2,
    source: "sudachi",
  },
  {
    id: "word-35",
    word: "ズズ",
    reading: "ずず",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "お茶やすすり物を一気に飲む音（ズズッと）。",
    charCount: 2,
    source: "sudachi",
  },
  {
    id: "word-38",
    word: "ズポ",
    reading: "ずぽ",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "状態や音を表す言葉 (副詞/*)。",
    charCount: 2,
    source: "sudachi",
  },
  {
    id: "word-24",
    word: "ズー",
    reading: "ずー",
    category: "daily",
    categoryLabel: "日常語",
    meaning: "動物園（ZOO）、またはズーッと続く持続音。",
    charCount: 2,
    source: "curated",
  },
  {
    id: "word-28",
    word: "タズ",
    reading: "たず",
    category: "other",
    categoryLabel: "その他・スラング",
    meaning: "TAZZ",
    charCount: 2,
    source: "curated",
  },
  {
    id: "word-40",
    word: "タタ",
    reading: "たた",
    category: "daily",
    categoryLabel: "オノマトペ",
    meaning: "オノマトペ",
    charCount: 2,
    source: "sudachi",
  },
  {
    id: "word-15",
    word: "タポ",
    reading: "たぽ",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "水やたるみが揺れる軽い音。",
    charCount: 2,
    source: "curated",
  },
  {
    id: "word-26",
    word: "ター",
    reading: "たー",
    category: "daily",
    categoryLabel: "日常語",
    meaning: "叫び声や気合いの掛け声。",
    charCount: 2,
    source: "curated",
  },
  {
    id: "word-13",
    word: "ポタ",
    reading: "ぽた",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "一滴の水が落ちる音。",
    charCount: 2,
    source: "curated",
  },
  {
    id: "word-44",
    word: "ポポ",
    reading: "ぽぽ",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "汽車やハトなどの可愛らしい鳴き声・音。",
    charCount: 2,
    source: "sudachi",
  },
  {
    id: "word-25",
    word: "ポー",
    reading: "ぽー",
    category: "onomatopoeia",
    categoryLabel: "オノマトペ",
    meaning: "汽笛やハトの鳴き声。顔が赤くなる様子（ポーッとする）。",
    charCount: 2,
    source: "curated",
  },
];

// 文字カウントを計算するヘルパー
export function countChars(text: string): Record<AvailableChar, number> {
  const counts: Record<AvailableChar, number> = {
    サ: 0,
    ポ: 0,
    ー: 0,
    タ: 0,
    ズ: 0,
  };
  for (const char of text) {
    if (char in counts) {
      counts[char as AvailableChar]++;
    }
  }
  return counts;
}

// デフォルトの1セット所持数（「サポーターズ」1組）
export const DEFAULT_SUPPORTERS_SET: Record<AvailableChar, number> = {
  サ: 1,
  ポ: 1,
  ー: 2,
  タ: 1,
  ズ: 1,
};

// 単語に必要な文字と不足文字の計算
export interface WordMatchStatus {
  wordItem: WordItem;
  required: Record<AvailableChar, number>;
  isExactMatch: boolean; // 今の手持ちで完全に作れるか
  missingCount: number; // 不足している文字の総数
  missingChars: { char: AvailableChar; count: number }[]; // 不足している具体的な文字
}

export function checkWordMatch(
  wordItem: WordItem,
  inventory: Record<AvailableChar, number>,
): WordMatchStatus {
  const required = countChars(wordItem.word);
  let missingCount = 0;
  const missingChars: { char: AvailableChar; count: number }[] = [];

  for (const char of AVAILABLE_CHARS) {
    const need = required[char] || 0;
    const have = inventory[char] || 0;
    if (need > have) {
      const diff = need - have;
      missingCount += diff;
      missingChars.push({ char, count: diff });
    }
  }

  return {
    wordItem,
    required,
    isExactMatch: missingCount === 0,
    missingCount,
    missingChars,
  };
}
