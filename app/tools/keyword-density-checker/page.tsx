"use client";

import { useMemo, useState } from "react";

type KeywordItem = {
  word: string;
  count: number;
  density: number;
};

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "that",
  "this",
  "with",
  "from",
  "your",
  "you",
  "are",
  "was",
  "were",
  "have",
  "has",
  "had",
  "will",
  "would",
  "could",
  "should",
  "into",
  "about",
  "there",
  "their",
  "they",
  "them",
  "then",
  "than",
  "what",
  "when",
  "where",
  "which",
  "while",
  "also",
  "more",
  "some",
  "such",
  "only",
  "very",
  "just",
  "online",
  "your",
  "our",
  "its",
  "not",
  "but",
  "can",
  "all",
  "any",
  "how",
  "why",
  "who",
  "use",
  "using",
  "used",
  "a",
  "an",
  "in",
  "on",
  "at",
  "to",
  "of",
  "is",
  "it",
  "be",
  "as",
  "or",
  "by",
  "we",
  "i",
  "he",
  "she",
  "his",
  "her",
  "my",
  "me",
]);

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWords(text: string) {
  const normalized = normalizeText(text);

  if (!normalized) {
    return [];
  }

  return normalized.split(/\s+/).filter(Boolean);
}

function formatNumber(value: number) {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2);
}

export default function KeywordDensityChecker() {
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [copied, setCopied] = useState(false);

  const analysis = useMemo(() => {
    const words = getWords(text);
    const totalWords = words.length;
    const totalCharacters = text.length;
    const charactersWithoutSpaces = text.replace(/\s/g, "").length;

    const normalizedKeyword = normalizeText(keyword);

    let keywordCount = 0;

    if (normalizedKeyword && words.length > 0) {
      const keywordWords = normalizedKeyword.split(/\s+/);

      if (keywordWords.length === 1) {
        keywordCount = words.filter(
          (word) => word === keywordWords[0]
        ).length;
      } else {
        for (
          let i = 0;
          i <= words.length - keywordWords.length;
          i++
        ) {
          const phrase = words
            .slice(i, i + keywordWords.length)
            .join(" ");

          if (phrase === normalizedKeyword) {
            keywordCount++;
          }
        }
      }
    }

    const keywordDensity =
      totalWords > 0
        ? (keywordCount / totalWords) * 100
        : 0;

    const frequencyMap = new Map<string, number>();

    words.forEach((word) => {
      if (
        word.length >= 3 &&
        !STOP_WORDS.has(word)
      ) {
        frequencyMap.set(
          word,
          (frequencyMap.get(word) || 0) + 1
        );
      }
    });

    const topKeywords: KeywordItem[] = Array.from(
      frequencyMap.entries()
    )
      .map(([word, count]) => ({
        word,
        count,
        density:
          totalWords > 0
            ? (count / totalWords) * 100
            : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    let densityStatus = "Enter a keyword to analyze.";

    if (normalizedKeyword && totalWords > 0) {
      if (keywordCount === 0) {
        densityStatus =
          "Keyword was not found in the text.";
      } else if (keywordDensity > 3) {
        densityStatus =
          "Keyword density is relatively high. Consider using the keyword more naturally.";
      } else if (keywordDensity >= 0.5) {
        densityStatus =
          "Keyword usage looks reasonable. Focus on natural, helpful content.";
      } else {
        densityStatus =
          "Keyword appears only a few times. Make sure the topic is clearly covered.";
      }
    }

    return {
      words,
      totalWords,
      totalCharacters,
      charactersWithoutSpaces,
      keywordCount,
      keywordDensity,
      topKeywords,
      densityStatus,
    };
  }, [text, keyword]);

  function clearAll() {
    setText("");
    setKeyword("");
    setCopied(false);
  }

  async function copyReport() {
    const report = [
      "KEYWORD DENSITY REPORT",
      "=======================",
      "",
      `Total Words: ${analysis.totalWords}`,
      `Total Characters: ${analysis.totalCharacters}`,
      `Characters Without Spaces: ${analysis.charactersWithoutSpaces}`,
      "",
      `Target Keyword: ${keyword || "Not specified"}`,
      `Keyword Count: ${analysis.keywordCount}`,
      `Keyword Density: ${formatNumber(
        analysis.keywordDensity
      )}%`,
      "",
      "TOP KEYWORDS",
      "------------",
      ...analysis.topKeywords.map(
        (item, index) =>
          `${index + 1}. ${item.word} - ${item.count} times (${formatNumber(
            item.density
          )}%)`
      ),
      "",
      `Status: ${analysis.densityStatus}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Unable to copy the report.");
    }
  }

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <div className="badge">SEO TOOL</div>

          <h1>Keyword Density Checker</h1>

          <p>
            Analyze keyword frequency, density and the most
            frequently used words in your content.
          </p>
        </header>

        <section className="grid">
          {/* LEFT PANEL */}

          <div className="card">
            <div className="cardHeader">
              <div>
                <h2>Content Analyzer</h2>
                <p>
                  Paste your article, webpage content or text below.
                </p>
              </div>

              <button
                type="button"
                className="clearButton"
                onClick={clearAll}
              >
                Clear
              </button>
            </div>

            <label>Content</label>

            <textarea
              className="contentInput"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your content here..."
              rows={15}
            />

            <div className="textStats">
              <span>
                {analysis.totalWords} words
              </span>

              <span>
                {analysis.totalCharacters} characters
              </span>
            </div>

            <label>Target Keyword</label>

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Example: seo tools"
            />

            <div className="keywordHelp">
              Enter one keyword or a multi-word phrase.
            </div>

            <div className="keywordResult">
              <div className="resultItem">
                <span>Keyword Count</span>
                <strong>{analysis.keywordCount}</strong>
              </div>

              <div className="resultItem">
                <span>Keyword Density</span>
                <strong>
                  {formatNumber(analysis.keywordDensity)}%
                </strong>
              </div>
            </div>

            <div className="densityStatus">
              <div className="statusTitle">
                Keyword Status
              </div>

              <p>{analysis.densityStatus}</p>
            </div>

            <button
              type="button"
              className="copyButton"
              onClick={copyReport}
            >
              {copied ? "Report Copied!" : "Copy Analysis Report"}
            </button>
          </div>

          {/* RIGHT PANEL */}

          <div className="card">
            <div className="cardHeader">
              <div>
                <h2>Content Statistics</h2>
                <p>Live analysis of your content.</p>
              </div>
            </div>

            <div className="statGrid">
              <div className="statBox">
                <span>Total Words</span>
                <strong>{analysis.totalWords}</strong>
              </div>

              <div className="statBox">
                <span>Characters</span>
                <strong>
                  {analysis.totalCharacters}
                </strong>
              </div>

              <div className="statBox">
                <span>Without Spaces</span>
                <strong>
                  {analysis.charactersWithoutSpaces}
                </strong>
              </div>

              <div className="statBox">
                <span>Target Keyword</span>
                <strong>
                  {analysis.keywordCount}
                </strong>
              </div>
            </div>

            <div className="sectionTitle">
              Top Keywords
            </div>

            {analysis.topKeywords.length === 0 ? (
              <div className="emptyState">
                <div className="emptyIcon">⌕</div>

                <h3>No keyword data yet</h3>

                <p>
                  Paste some content to see the most
                  frequently used keywords.
                </p>
              </div>
            ) : (
              <div className="tableWrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Keyword</th>
                      <th>Count</th>
                      <th>Density</th>
                    </tr>
                  </thead>

                  <tbody>
                    {analysis.topKeywords.map(
                      (item, index) => (
                        <tr key={item.word}>
                          <td>{index + 1}</td>

                          <td>
                            <strong>{item.word}</strong>
                          </td>

                          <td>{item.count}</td>

                          <td>
                            {formatNumber(item.density)}%
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="infoCard">
              <h3>How Keyword Density Works</h3>

              <p>
                Keyword density is calculated as the number
                of times a keyword appears divided by the
                total number of words, multiplied by 100.
              </p>

              <div className="formula">
                Keyword Density = (Keyword Count ÷ Total
                Words) × 100
              </div>

              <p>
                Use keywords naturally and prioritize useful,
                readable content rather than repeating the
                same keyword unnecessarily.
              </p>
            </div>

            <div className="tips">
              <h3>SEO Tips</h3>

              <ul>
                <li>
                  Write for people first, not just search
                  engines.
                </li>

                <li>
                  Avoid excessive repetition of the same
                  keyword.
                </li>

                <li>
                  Use related terms and natural variations
                  where appropriate.
                </li>

                <li>
                  Make sure your primary topic is clearly
                  covered by the content.
                </li>

                <li>
                  Keyword density alone does not determine
                  search rankings.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #f5f7fb;
          color: #172033;
          padding: 40px 20px 70px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 32px;
        }

        .badge {
          display: inline-block;
          padding: 7px 14px;
          border-radius: 999px;
          background: #e8efff;
          color: #3158c7;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        h1 {
          margin: 0;
          font-size: 38px;
          line-height: 1.15;
          font-weight: 800;
        }

        .header p {
          max-width: 720px;
          margin: 12px auto 0;
          color: #667085;
          font-size: 16px;
          line-height: 1.6;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
        }

        .cardHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
        }

        .cardHeader h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 750;
        }

        .cardHeader p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 13px;
        }

        .clearButton {
          border: none;
          border-radius: 9px;
          padding: 10px 14px;
          background: #f2f4f7;
          color: #475467;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
        }

        .clearButton:hover {
          background: #e4e7ec;
        }

        label {
          display: block;
          margin: 18px 0 8px;
          font-size: 14px;
          font-weight: 650;
          color: #344054;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid #d0d5dd;
          border-radius: 10px;
          padding: 12px 13px;
          font-size: 14px;
          color: #101828;
          background: #ffffff;
          outline: none;
          transition:
            border 0.2s,
            box-shadow 0.2s;
        }

        input:focus,
        textarea:focus {
          border-color: #5b7cfa;
          box-shadow:
            0 0 0 3px rgba(91, 124, 250, 0.12);
        }

        .contentInput {
          min-height: 300px;
          resize: vertical;
          line-height: 1.6;
        }

        .textStats {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 7px;
          color: #667085;
          font-size: 12px;
        }

        .keywordHelp {
          margin-top: 7px;
          color: #667085;
          font-size: 12px;
        }

        .keywordResult {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 20px;
        }

        .resultItem {
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #f8fafc;
        }

        .resultItem span {
          display: block;
          color: #667085;
          font-size: 12px;
          margin-bottom: 6px;
        }

        .resultItem strong {
          font-size: 24px;
        }

        .densityStatus {
          margin-top: 16px;
          padding: 15px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
        }

        .statusTitle {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .densityStatus p {
          margin: 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.6;
        }

        .copyButton {
          width: 100%;
          margin-top: 16px;
          border: none;
          border-radius: 10px;
          padding: 13px;
          background: #3158c7;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .copyButton:hover {
          background: #2548aa;
        }

        .statGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .statBox {
          padding: 17px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .statBox span {
          display: block;
          color: #667085;
          font-size: 12px;
          margin-bottom: 7px;
        }

        .statBox strong {
          font-size: 23px;
        }

        .sectionTitle {
          margin: 26px 0 12px;
          font-size: 16px;
          font-weight: 750;
        }

        .tableWrapper {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        th,
        td {
          padding: 11px 12px;
          text-align: left;
          border-bottom: 1px solid #edf0f3;
        }

        th {
          background: #f8fafc;
          color: #475467;
          font-size: 12px;
        }

        tr:last-child td {
          border-bottom: none;
        }

        td {
          color: #667085;
        }

        td strong {
          color: #172033;
        }

        .emptyState {
          padding: 35px 20px;
          text-align: center;
          border: 1px dashed #d0d5dd;
          border-radius: 12px;
          background: #fafbfc;
        }

        .emptyIcon {
          width: 44px;
          height: 44px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #eef2ff;
          color: #3158c7;
          font-size: 23px;
        }

        .emptyState h3 {
          margin: 0 0 6px;
          font-size: 15px;
        }

        .emptyState p {
          margin: 0;
          color: #667085;
          font-size: 12px;
        }

        .infoCard {
          margin-top: 22px;
          padding: 17px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
        }

        .infoCard h3 {
          margin: 0 0 9px;
          font-size: 15px;
        }

        .infoCard p {
          margin: 8px 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.7;
        }

        .formula {
          padding: 10px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          color: #3158c7;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
        }

        .tips {
          margin-top: 22px;
          padding: 17px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
        }

        .tips h3 {
          margin: 0 0 10px;
          font-size: 15px;
        }

        .tips ul {
          margin: 0;
          padding-left: 20px;
          color: #667085;
          font-size: 12px;
          line-height: 1.8;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 32px;
          }
        }

        @media (max-width: 560px) {
          .page {
            padding: 25px 12px 50px;
          }

          .card {
            padding: 18px;
            border-radius: 14px;
          }

          .cardHeader {
            flex-direction: column;
          }

          .keywordResult,
          .statGrid {
            grid-template-columns: 1fr;
          }

          .contentInput {
            min-height: 240px;
          }
        }
      `}</style>
    </main>
  );
}