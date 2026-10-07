import json
import os
import re
from sudachipy import dictionary

# ひらがなをカタカナに変換
def hira_to_kata(text: str) -> str:
    return "".join(
        chr(ord(c) + 96) if "ぁ" <= c <= "ん" else c
        for c in text
    )

def kata_to_hira(text: str) -> str:
    return "".join(
        chr(ord(c) - 96) if "ァ" <= c <= "ン" else c
        for c in text
    )

TARGET_CHARS = {"サ", "ポ", "ー", "タ", "ズ"}

# 既存の手動キュレーション辞書（説明やカテゴリの品質が高いもの）
MANUAL_WORDS = {
    "サポーターズ": {
        "reading": "さぽーたーず",
        "category": "it",
        "categoryLabel": "IT・就活",
        "meaning": "ITエンジニア・学生向け就活支援サービス。このイベントの主催！",
    },
    "サポーター": {
        "reading": "さぽーたー",
        "category": "it",
        "categoryLabel": "IT・就活",
        "meaning": "支持者、応援者、支援チーム。開発やコミュニティを支える仲間！",
    },
    "サポータズ": {
        "reading": "さぽーたず",
        "category": "it",
        "categoryLabel": "IT・就活",
        "meaning": "サポーターズの長音短縮表記。",
    },
    "サポータ": {
        "reading": "さぽーた",
        "category": "daily",
        "categoryLabel": "日常語",
        "meaning": "関節などを保護・固定する装具（サポーターの略称）。",
    },
    "サポ": {
        "reading": "さぽ",
        "category": "it",
        "categoryLabel": "IT・就活",
        "meaning": "サポートの略、またはサポーターズの略称！",
    },
    "ポーター": {
        "reading": "ぽーたー",
        "category": "daily",
        "categoryLabel": "日常語",
        "meaning": "荷物運搬人、駅やホテルでの案内係。鞄ブランドでも有名。",
    },
    "ポータ": {
        "reading": "ぽーた",
        "category": "daily",
        "categoryLabel": "日常語",
        "meaning": "ポーターの長音短縮表記。",
    },
    "ポーズ": {
        "reading": "ぽーず",
        "category": "daily",
        "categoryLabel": "日常語",
        "meaning": "写真撮影などの姿勢（pose）、または動画や音楽の一時停止（pause）。",
    },
    "ポーツ": {
        "reading": "ぽーつ",
        "category": "daily",
        "categoryLabel": "日常語",
        "meaning": "港湾（ports）、またはネットワークの通信ポート郡。",
    },
    "ポタポタ": {
        "reading": "ぽたぽた",
        "category": "onomatopoeia",
        "categoryLabel": "オノマトペ",
        "meaning": "しずくが垂れ落ちる音。「ポタポタ焼き」でもおなじみ。",
    },
    "ポタポタポタ": {
        "reading": "ぽたぽたぽた",
        "category": "onomatopoeia",
        "categoryLabel": "オノマトペ",
        "meaning": "しずくが連続して滴り落ちる様子を表す音。",
    },
    "ポタポター": {
        "reading": "ぽたぽたー",
        "category": "onomatopoeia",
        "categoryLabel": "オノマトペ",
        "meaning": "水滴が長めに垂れ落ちていく余韻のある様子。",
    },
    "ポタ": {
        "reading": "ぽた",
        "category": "onomatopoeia",
        "categoryLabel": "オノマトペ",
        "meaning": "一滴の水が落ちる音。ポタリング（自転車散歩）の略。",
    },
    "タポタポ": {
        "reading": "たぽたぽ",
        "category": "onomatopoeia",
        "categoryLabel": "オノマトペ",
        "meaning": "水や液体が容器の中でたゆたう音・たっぷり入っている様子。",
    },
    "タポ": {
        "reading": "たぽ",
        "category": "onomatopoeia",
        "categoryLabel": "オノマトペ",
        "meaning": "水やたるみが揺れる軽い音。",
    },
    "サーサー": {
        "reading": "さーさー",
        "category": "onomatopoeia",
        "categoryLabel": "オノマトペ",
        "meaning": "雨が絶え間なく降る音や、静かに風が吹き渡る音。",
    },
    "サーサーサー": {
        "reading": "さーさーさー",
        "category": "onomatopoeia",
        "categoryLabel": "オノマトペ",
        "meaning": "激しい雨や風、流れる音が重なる様子。",
    },
    "サー": {
        "reading": "さー",
        "category": "daily",
        "categoryLabel": "日常語",
        "meaning": "敬称（Sir）、またはさっと動く音・同意の掛け声（さあ）。",
    },
    "ズーズー": {
        "reading": "ずーずー",
        "category": "onomatopoeia",
        "categoryLabel": "オノマトペ",
        "meaning": "遠慮がないさま（図々しい）、または勢いよくすする音。",
    },
    "ズサー": {
        "reading": "ずさー",
        "category": "other",
        "categoryLabel": "その他・スラング",
        "meaning": "勢いよく滑り込む・スライディングするときのネット擬音。",
    },
    "ターター": {
        "reading": "たーたー",
        "category": "other",
        "categoryLabel": "その他・スラング",
        "meaning": "軽快に歩く・走る様子、またはバイバイ（幼児語のta-ta）。",
    },
    "ポーポー": {
        "reading": "ぽーぽー",
        "category": "onomatopoeia",
        "categoryLabel": "オノマトペ",
        "meaning": "汽笛の音やハトなどの鳥の鳴き声。",
    },
    "サタ": {
        "reading": "さた",
        "category": "daily",
        "categoryLabel": "日常語",
        "meaning": "沙汰（ご無沙汰、音沙汰、表沙汰など）。",
    },
    "ズー": {
        "reading": "ずー",
        "category": "daily",
        "categoryLabel": "日常語",
        "meaning": "動物園（ZOO）、またはズーッと続く持続音。",
    },
    "ポー": {
        "reading": "ぽー",
        "category": "onomatopoeia",
        "categoryLabel": "オノマトペ",
        "meaning": "汽笛やフクロウの鳴き声。顔が赤くなる様子（ポーッとする）。",
    },
    "ター": {
        "reading": "たー",
        "category": "daily",
        "categoryLabel": "日常語",
        "meaning": "叫び声や気合いの掛け声。",
    },
    "サズ": {
        "reading": "さず",
        "category": "other",
        "categoryLabel": "その他・スラング",
        "meaning": "トルコ等の伝統的な弦楽器（Saz）。",
    },
    "タズ": {
        "reading": "たず",
        "category": "other",
        "categoryLabel": "その他・スラング",
        "meaning": "キャラクター「タズ」の略称。",
    },
    "ターズ": {
        "reading": "たーず",
        "category": "other",
        "categoryLabel": "その他・スラング",
        "meaning": "「タズ」の長音表記。",
    },
}

# 一般的な意味マッピング（Sudachiから見つかった追加単語用）
ADDITIONAL_MEANINGS = {
    "ササ": ("ささ", "daily", "日常語", "笹（ササ）。イネ科タケ亜科の植物。"),
    "タタ": ("たた", "daily", "日常語", "多々（非常に多いこと、たくさんあること）。"),
    "ポポ": ("ぽぽ", "onomatopoeia", "オノマトペ", "汽車やハトなどの可愛らしい鳴き声・音。"),
    "タタタ": ("たたた", "onomatopoeia", "オノマトペ", "小走りで軽快に走る足音。"),
    "タタター": ("たたたー", "onomatopoeia", "オノマトペ", "駆け抜けていく足音の伸びた音。"),
    "サーズ": ("さーず", "daily", "日常語", "SARS（重症急性呼吸器症候群）。"),
    "ズタズタ": ("ずたずた", "daily", "日常語", "細かく裂けたり傷ついたりするさま（ズタズタになる）。"),
    "ポタポタ焼": ("ぽたぽたやき", "daily", "日常語", "おなじみの砂糖醤油味の煎餅菓子。"),
    "ポポポ": ("ぽぽぽ", "onomatopoeia", "オノマトペ", "ぽぽぽぽーんと広がる擬音。"),
    "ポーターズ": ("ぽーたーず", "daily", "日常語", "ポーターの複数形、または人材・港湾関連のサービス名。"),
    "ポーポ": ("ぽーぽ", "onomatopoeia", "オノマトペ", "ハトなどの鳥の鳴き声。"),
    "タタタタタ": ("たたたたた", "onomatopoeia", "オノマトペ", "機関銃や激しい足音の擬音。"),
    "サササ": ("さささ", "onomatopoeia", "オノマトペ", "素早く静かに身を隠したり移動する様子。"),
    "サササササ": ("さささささ", "onomatopoeia", "オノマトペ", "非常に小気味よく素早く動く様子。"),
    "ポポポポ": ("ぽぽぽぽ", "onomatopoeia", "オノマトペ", "鳩の群れや電報などの連続音。"),
    "タポタ": ("たぽた", "onomatopoeia", "オノマトペ", "水たまりや液体が跳ねる音。"),
    "ズズ": ("ずず", "onomatopoeia", "オノマトペ", "お茶やすすり物を一気に飲む音（ズズッと）。"),
    "ズズズ": ("ずずず", "onomatopoeia", "オノマトペ", "麺類やお茶を勢いよくすする音。"),
}

def main():
    print("Loading SudachiDict...")
    d = dictionary.Dictionary()
    
    found_words = {}

    for entry in d.entries():
        surface = entry.surface()
        reading = entry.reading_form()
        pos = entry.part_of_speech()
        
        pos_major = pos[0]
        if pos_major in ("助詞", "助動詞", "補助記号", "記号", "接尾辞"):
            continue

        kata_surface = hira_to_kata(surface)
        kata_reading = hira_to_kata(reading)

        match_surface = set(kata_surface).issubset(TARGET_CHARS) and len(kata_surface) >= 2
        match_reading = set(kata_reading).issubset(TARGET_CHARS) and len(kata_reading) >= 2

        candidate = None
        if match_surface:
            candidate = kata_surface
        elif match_reading and pos_major in ("名詞", "副詞", "形状詞", "感動詞"):
            candidate = kata_reading

        if not candidate:
            continue

        # 長音符で始まる単語などは除外
        if candidate.startswith("ー"):
            continue

        # 重複・代表エントリの保存
        if candidate not in found_words:
            found_words[candidate] = {
                "surface": surface,
                "reading": reading,
                "pos": pos,
            }

    print(f"Extracted {len(found_words)} candidates from SudachiDict.")

    all_word_items = []
    seen_words = set()

    # 1. まず手動登録済みの高品質エントリをマージ
    idx = 1
    for w, info in MANUAL_WORDS.items():
        all_word_items.append({
            "id": f"word-{idx}",
            "word": w,
            "reading": info["reading"],
            "category": info["category"],
            "categoryLabel": info["categoryLabel"],
            "meaning": info["meaning"],
            "charCount": len(w),
            "source": "curated",
        })
        seen_words.add(w)
        idx += 1

    # 2. 追加の候補をマージ
    for w, sinfo in found_words.items():
        if w in seen_words:
            continue

        reading_hira = kata_to_hira(hira_to_kata(sinfo["reading"]))
        
        # 意味定義がある場合
        if w in ADDITIONAL_MEANINGS:
            r, cat, cat_lbl, meaning = ADDITIONAL_MEANINGS[w]
            all_word_items.append({
                "id": f"word-{idx}",
                "word": w,
                "reading": r,
                "category": cat,
                "categoryLabel": cat_lbl,
                "meaning": meaning,
                "charCount": len(w),
                "source": "sudachi",
            })
            seen_words.add(w)
            idx += 1
        else:
            # Sudachiの品詞から意味を推定
            pos_str = "/".join(sinfo["pos"][:2])
            cat = "other"
            cat_lbl = "その他・辞書語"
            if "副詞" in pos_str or "オノマトペ" in pos_str:
                cat = "onomatopoeia"
                cat_lbl = "オノマトペ"
                meaning = f"状態や音を表す言葉 ({pos_str})。"
            elif "名詞" in pos_str:
                cat = "daily"
                cat_lbl = "日常語"
                meaning = f"Sudachi辞書収録語 ({pos_str})。元表記: {sinfo['surface']}。"
            else:
                meaning = f"Sudachi辞書収録語 ({pos_str})。"

            all_word_items.append({
                "id": f"word-{idx}",
                "word": w,
                "reading": reading_hira,
                "category": cat,
                "categoryLabel": cat_lbl,
                "meaning": meaning,
                "charCount": len(w),
                "source": "sudachi",
            })
            seen_words.add(w)
            idx += 1

    # 文字数の多い順、同じ文字数なら五十音順にソート
    all_word_items.sort(key=lambda x: (-x["charCount"], x["reading"]))

    output_path = os.path.abspath("src/data/words.ts")
    print(f"Total merged words: {len(all_word_items)}")
    
    # words.ts を生成
    ts_content = f"""export type WordCategory = "it" | "onomatopoeia" | "daily" | "other";

export interface WordItem {{
  id: string;
  word: string;
  reading: string;
  category: WordCategory;
  categoryLabel: string;
  meaning: string;
  charCount: number;
  source?: "curated" | "sudachi";
}}

export const CATEGORY_LABELS: Record<WordCategory, string> = {{
  it: "IT・就活",
  onomatopoeia: "オノマトペ",
  daily: "日常語",
  other: "その他・スラング",
}};

export const AVAILABLE_CHARS = ["サ", "ポ", "ー", "タ", "ズ"] as const;
export type AvailableChar = (typeof AVAILABLE_CHARS)[number];

// サ・ポ・ー・タ・ズ の文字のみで構成される大規模抽出辞書データ (SudachiDict + 手動キュレーション)
export const WORDS_DATA: WordItem[] = {json.dumps(all_word_items, ensure_ascii=False, indent=2)};

// 文字カウントを計算するヘルパー
export function countChars(text: string): Record<AvailableChar, number> {{
  const counts: Record<AvailableChar, number> = {{
    サ: 0,
    ポ: 0,
    ー: 0,
    タ: 0,
    ズ: 0,
  }};
  for (const char of text) {{
    if (char in counts) {{
      counts[char as AvailableChar]++;
    }}
  }}
  return counts;
}}

// デフォルトの1セット所持数（「サポーターズ」1組）
export const DEFAULT_SUPPORTERS_SET: Record<AvailableChar, number> = {{
  サ: 1,
  ポ: 1,
  ー: 2,
  タ: 1,
  ズ: 1,
}};

// 単語に必要な文字と不足文字の計算
export interface WordMatchStatus {{
  wordItem: WordItem;
  required: Record<AvailableChar, number>;
  isExactMatch: boolean; // 今の手持ちで完全に作れるか
  missingCount: number; // 不足している文字の総数
  missingChars: {{ char: AvailableChar; count: number }}[]; // 不足している具体的な文字
}}

export function checkWordMatch(
  wordItem: WordItem,
  inventory: Record<AvailableChar, number>,
): WordMatchStatus {{
  const required = countChars(wordItem.word);
  let missingCount = 0;
  const missingChars: {{ char: AvailableChar; count: number }}[] = [];

  for (const char of AVAILABLE_CHARS) {{
    const need = required[char] || 0;
    const have = inventory[char] || 0;
    if (need > have) {{
      const diff = need - have;
      missingCount += diff;
      missingChars.push({{ char, count: diff }});
    }}
  }}

  return {{
    wordItem,
    required,
    isExactMatch: missingCount === 0,
    missingCount,
    missingChars,
  }};
}}
"""

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(ts_content)

    # 再現性・追跡性のために抽出元JSONも保存
    raw_json_path = os.path.abspath("src/data/dictionary_extracted.json")
    with open(raw_json_path, "w", encoding="utf-8") as f:
        json.dump(all_word_items, f, ensure_ascii=False, indent=2)

    print(f"Successfully generated {output_path} and {raw_json_path}")

if __name__ == "__main__":
    main()
