import confetti from "canvas-confetti";
import { toPng } from "html-to-image";
import {
  Check,
  Copy,
  Download,
  Info,
  Layers,
  RotateCcw,
  Share2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AVAILABLE_CHARS,
  type AvailableChar,
  CATEGORY_LABELS,
  DEFAULT_SUPPORTERS_SET,
  WORDS_DATA,
  type WordCategory,
  type WordItem,
  checkWordMatch,
} from "./data/words";

// 文字キーホルダーごとのクラス名マッピング
const CHAR_CLASS_MAP: Record<AvailableChar, string> = {
  サ: "charm-sa",
  ポ: "charm-po",
  ー: "charm-bar",
  タ: "charm-ta",
  ズ: "charm-zu",
};

export function App() {
  // 手持ちインベントリ
  const [inventory, setInventory] = useState<
    Record<AvailableChar, number>
  >({
    ...DEFAULT_SUPPORTERS_SET,
  });

  // フィルター
  const [activeTab, setActiveTab] = useState<
    "can-make" | "need-few" | "all"
  >("can-make");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | WordCategory
  >("all");

  // モーダル
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const chainPreviewRef = useRef<HTMLDivElement>(null);

  // ローカル開発時の [DEV] タイトルプレフィックス
  useEffect(() => {
    const baseTitle =
      "サポーターズ アナグラム | キーホルダー言葉ファインダー";
    if (import.meta.env.DEV) {
      document.title = `[DEV] ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, []);

  // ハプティックフィードバック
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  // 所持数の増減
  const updateCount = (char: AvailableChar, delta: number) => {
    triggerHaptic();
    setInventory((prev) => {
      const current = prev[char] || 0;
      const next = Math.max(0, Math.min(9, current + delta));
      return { ...prev, [char]: next };
    });
  };

  // プリセット適用
  const applyPreset = (preset: "default" | "reset" | "all2") => {
    triggerHaptic();
    if (preset === "default") {
      setInventory({ ...DEFAULT_SUPPORTERS_SET });
      showToast("サポーターズ1組セットにリセットしました");
    } else if (preset === "reset") {
      setInventory({ サ: 0, ポ: 0, ー: 0, タ: 0, ズ: 0 });
      showToast("すべて0個にリセットしました");
    } else if (preset === "all2") {
      setInventory({ サ: 2, ポ: 2, ー: 4, タ: 2, ズ: 2 });
      showToast("各文字を2倍セットに設定しました");
    }
  };

  const totalCount = useMemo(() => {
    return Object.values(inventory).reduce((sum, c) => sum + c, 0);
  }, [inventory]);

  // 全単語のマッチ状態
  const evaluatedWords = useMemo(() => {
    return WORDS_DATA.map((item) => checkWordMatch(item, inventory));
  }, [inventory]);

  // 各タブの該当件数
  const countsByTab = useMemo(() => {
    const canMake = evaluatedWords.filter((w) => w.isExactMatch).length;
    const needFew = evaluatedWords.filter(
      (w) => !w.isExactMatch && w.missingCount <= 2,
    ).length;
    const all = evaluatedWords.length;
    return { canMake, needFew, all };
  }, [evaluatedWords]);

  // 表示リストのフィルタリング
  const displayedWords = useMemo(() => {
    return evaluatedWords
      .filter((item) => {
        // タブフィルタ
        if (activeTab === "can-make" && !item.isExactMatch) return false;
        if (
          activeTab === "need-few" &&
          (item.isExactMatch || item.missingCount > 2)
        )
          return false;

        // カテゴリフィルタ
        if (
          selectedCategory !== "all" &&
          item.wordItem.category !== selectedCategory
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // 1. 作れるものが上
        if (a.isExactMatch && !b.isExactMatch) return -1;
        if (!a.isExactMatch && b.isExactMatch) return 1;
        // 2. 不足数が少ない順
        if (a.missingCount !== b.missingCount) {
          return a.missingCount - b.missingCount;
        }
        // 3. 文字数が多い順
        return b.wordItem.charCount - a.wordItem.charCount;
      });
  }, [evaluatedWords, activeTab, selectedCategory]);

  // 単語クリック時（モーダルオープン）
  const handleOpenWord = (item: WordItem) => {
    triggerHaptic();
    setSelectedWord(item);

    const matchStatus = evaluatedWords.find(
      (w) => w.wordItem.id === item.id,
    );
    if (matchStatus?.isExactMatch) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#ff6b35", "#ff3366", "#00b4d8", "#06d6a0", "#7209b7"],
      });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // 画像保存
  const handleSaveImage = async () => {
    if (!chainPreviewRef.current || !selectedWord) return;
    try {
      setIsGeneratingImage(true);
      const dataUrl = await toPng(chainPreviewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `supporters-${selectedWord.word}.png`;
      link.href = dataUrl;
      link.click();
      showToast("画像を保存しました！");
    } catch {
      showToast("画像の生成に失敗しました");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Xシェア
  const handleShareX = () => {
    if (!selectedWord) return;
    const matchStatus = evaluatedWords.find(
      (w) => w.wordItem.id === selectedWord.id,
    );
    const statusText = matchStatus?.isExactMatch
      ? `サポーターズのキーホルダーで「${selectedWord.word}」が作れたよ！✨`
      : `サポーターズのキーホルダーで「${selectedWord.word}」を作りたい！(あと${matchStatus?.missingCount}文字)💡`;

    const text = `${statusText}\n意味: ${selectedWord.meaning}\n\n#サポーターズ #サポーターズキーホルダー #サポーターズアナグラム`;
    const url = window.location.href;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  // クリップボードコピー
  const handleCopyText = () => {
    if (!selectedWord) return;
    navigator.clipboard.writeText(
      `サポーターズキーホルダーで「${selectedWord.word}」！`,
    );
    showToast("テキストをコピーしました！");
  };

  return (
    <div className="app-container">
      {/* ヘッダー */}
      <header className="app-header">
        <h1 className="app-title">
          <span className="highlight">サポーターズ</span>
          <span>アナグラム</span>
        </h1>
        <p className="app-subtitle">
          イベントで配られる文字キーホルダーで作れる言葉を探そう！
        </p>
      </header>

      {/* 手持ちキーホルダー管理セクション */}
      <section className="inventory-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-title">手持ちのキーホルダー</span>
            <span className="inventory-total-badge">
              計 {totalCount} 個
            </span>
          </div>
          <div className="preset-actions">
            <button
              type="button"
              className="preset-btn"
              onClick={() => applyPreset("default")}
              title="「サ・ポ・ー・タ・ー・ズ」1組"
            >
              <RotateCcw size={11} /> 1組
            </button>
            <button
              type="button"
              className="preset-btn"
              onClick={() => applyPreset("reset")}
            >
              クリア
            </button>
            <button
              type="button"
              className="preset-btn"
              onClick={() => applyPreset("all2")}
            >
              +2組
            </button>
          </div>
        </div>

        {/* 5文字のアクリルキーホルダーグリッド */}
        <div className="keychain-grid">
          {AVAILABLE_CHARS.map((char) => {
            const count = inventory[char] || 0;
            return (
              <div
                key={char}
                className={`keychain-item ${count === 0 ? "is-empty" : ""}`}
              >
                {/* 金具リング */}
                <div className="acrylic-ring" />
                {/* アクリル本体 (タップで+1) */}
                <button
                  type="button"
                  className={`acrylic-charm ${CHAR_CLASS_MAP[char]}`}
                  onClick={() => updateCount(char, 1)}
                  aria-label={`${char}を1つ増やす`}
                >
                  {char}
                </button>
                {/* 増減ステッパー */}
                <div className="count-stepper">
                  <button
                    type="button"
                    className="step-btn"
                    onClick={() => updateCount(char, -1)}
                    disabled={count <= 0}
                    aria-label={`${char}を1つ減らす`}
                  >
                    -
                  </button>
                  <span className="count-display">{count}</span>
                  <button
                    type="button"
                    className="step-btn"
                    onClick={() => updateCount(char, 1)}
                    disabled={count >= 9}
                    aria-label={`${char}を1つ増やす`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* フィルター＆タブ */}
      <section className="filter-section">
        <div className="tab-group">
          <button
            type="button"
            className={`tab-btn ${activeTab === "can-make" ? "active" : ""}`}
            onClick={() => {
              triggerHaptic();
              setActiveTab("can-make");
            }}
          >
            今作れる
            <span className="tab-count">{countsByTab.canMake}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "need-few" ? "active" : ""}`}
            onClick={() => {
              triggerHaptic();
              setActiveTab("need-few");
            }}
          >
            あと少し
            <span className="tab-count">{countsByTab.needFew}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => {
              triggerHaptic();
              setActiveTab("all");
            }}
          >
            全単語
            <span className="tab-count">{countsByTab.all}</span>
          </button>
        </div>

        {/* カテゴリチップ */}
        <div className="category-tags">
          <button
            type="button"
            className={`cat-chip ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => {
              triggerHaptic();
              setSelectedCategory("all");
            }}
          >
            すべて
          </button>
          {(Object.keys(CATEGORY_LABELS) as WordCategory[]).map((cat) => (
            <button
              type="button"
              key={cat}
              className={`cat-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => {
                triggerHaptic();
                setSelectedCategory(cat);
              }}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </section>

      {/* 言葉リスト */}
      <main className="word-list">
        {displayedWords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-title">該当する言葉がありません</p>
            <p className="empty-state-desc">
              上のキーホルダーをタップして文字を増やすか、
              <br />
              「全単語」タブを確認してみてください！
            </p>
          </div>
        ) : (
          displayedWords.map(
            ({ wordItem, isExactMatch, missingCount, missingChars }) => (
              <button
                type="button"
                key={wordItem.id}
                className={`word-card ${isExactMatch ? "can-make" : missingCount <= 2 ? "almost" : "missing"}`}
                onClick={() => handleOpenWord(wordItem)}
              >
                <div className="word-card-top">
                  <div className="word-title-wrap">
                    <span className="word-title">{wordItem.word}</span>
                    <span className="word-reading">
                      {wordItem.reading}
                    </span>
                  </div>
                  <div>
                    {isExactMatch ? (
                      <span className="status-badge complete">
                        <Check size={12} /> 作れる！
                      </span>
                    ) : missingCount <= 2 ? (
                      <span className="status-badge need-few">
                        あと {missingCount} 文字
                      </span>
                    ) : (
                      <span className="status-badge need-more">
                        あと {missingCount} 文字
                      </span>
                    )}
                  </div>
                </div>

                <p className="word-meaning">{wordItem.meaning}</p>

                <div className="word-card-footer">
                  <span className="category-pill">
                    {wordItem.categoryLabel}
                  </span>

                  {/* 不足文字案内 */}
                  {!isExactMatch && missingChars.length > 0 ? (
                    <div className="missing-hints">
                      <span>不足:</span>
                      {missingChars.map((m) => (
                        <span key={m.char} className="missing-char-chip">
                          {m.char}×{m.count}
                        </span>
                      ))}
                    </div>
                  ) : (
                    /* 構成文字のミニプレビュー */
                    <div className="mini-char-strip">
                      {Array.from(wordItem.word).map((ch, idx) => (
                        <span
                          // biome-ignore lint/suspicious/noArrayIndexKey: fixed order
                          key={idx}
                          className={`mini-char ${CHAR_CLASS_MAP[ch as AvailableChar] || ""}`}
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ),
          )
        )}
      </main>

      {/* フッター */}
      <footer className="app-footer">
        <p>サポーターズ キーホルダー言葉ファインダー</p>
      </footer>

      {/* 単語詳細＆アクキー連結モーダル */}
      {selectedWord && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedWord(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedWord(null);
          }}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content">
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedWord(null)}
              aria-label="閉じる"
            >
              <X size={18} />
            </button>

            <div className="modal-word-header">
              <h2 className="modal-word-title">{selectedWord.word}</h2>
              <p className="modal-word-reading">{selectedWord.reading}</p>
            </div>

            {/* キーホルダー連結プレビュー (画像保存対象) */}
            <div className="keychain-chain-preview" ref={chainPreviewRef}>
              {/* ナスカン金具 */}
              <div className="metal-carabiner" />
              <div className="chain-connector" />

              {/* 繋がったアクリルチャーム */}
              <div className="chain-row">
                {Array.from(selectedWord.word).map((char, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: order matters
                    key={index}
                    className="chain-charm-item"
                  >
                    <div className="acrylic-ring" />
                    <div
                      className={`chain-charm-box ${CHAR_CLASS_MAP[char as AvailableChar] || ""}`}
                    >
                      {char}
                    </div>
                  </div>
                ))}
              </div>

              <div className="chain-branding">
                <Layers size={12} /> SUPPORTERS KEYCHAIN
              </div>
            </div>

            <p className="modal-word-desc">{selectedWord.meaning}</p>

            {/* アクションボタン */}
            <div className="modal-actions">
              <button
                type="button"
                className="share-x-btn"
                onClick={handleShareX}
              >
                <Share2 size={16} /> Xでポストする
              </button>
              <div className="secondary-actions">
                <button
                  type="button"
                  className="save-image-btn"
                  onClick={handleSaveImage}
                  disabled={isGeneratingImage}
                >
                  <Download size={14} /> 画像を保存
                </button>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={handleCopyText}
                >
                  <Copy size={14} /> コピー
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* トースト通知 */}
      {toastMessage && (
        <div className="toast-notice">
          <Info size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
