"use client";

import { useMemo, useState } from "react";

export default function SerpPreview() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [activePreview, setActivePreview] = useState<"desktop" | "mobile">(
    "desktop"
  );

  const titleLength = title.length;
  const descriptionLength = description.length;

  const titleStatus = useMemo(() => {
    if (titleLength === 0) {
      return {
        text: "Enter a title",
        type: "neutral",
      };
    }

    if (titleLength >= 30 && titleLength <= 60) {
      return {
        text: "Good title length",
        type: "good",
      };
    }

    if (titleLength < 30) {
      return {
        text: "Title may be too short",
        type: "warning",
      };
    }

    return {
      text: "Title may be too long",
      type: "bad",
    };
  }, [titleLength]);

  const descriptionStatus = useMemo(() => {
    if (descriptionLength === 0) {
      return {
        text: "Enter a description",
        type: "neutral",
      };
    }

    if (descriptionLength >= 120 && descriptionLength <= 160) {
      return {
        text: "Good description length",
        type: "good",
      };
    }

    if (descriptionLength < 120) {
      return {
        text: "Description may be too short",
        type: "warning",
      };
    }

    return {
      text: "Description may be too long",
      type: "bad",
    };
  }, [descriptionLength]);

  const seoScore = useMemo(() => {
    let score = 0;

    if (titleLength >= 30 && titleLength <= 60) {
      score += 30;
    } else if (titleLength > 0) {
      score += 15;
    }

    if (descriptionLength >= 120 && descriptionLength <= 160) {
      score += 30;
    } else if (descriptionLength > 0) {
      score += 15;
    }

    if (url.trim()) {
      score += 20;
    }

    if (title.trim()) {
      score += 10;
    }

    if (description.trim()) {
      score += 10;
    }

    return score;
  }, [title, description, url, titleLength, descriptionLength]);

  function clearAll() {
    setTitle("");
    setDescription("");
    setUrl("");
    setActivePreview("desktop");
  }

  function getDisplayUrl() {
    if (!url.trim()) {
      return "https://example.com";
    }

    return url.trim();
  }

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <div className="badge">SEO TOOL</div>

          <h1>SERP Preview Tool</h1>

          <p>
            Preview how your webpage may appear in Google search results on
            desktop and mobile devices.
          </p>
        </header>

        <section className="layout">
          {/* LEFT PANEL */}

          <div className="card">
            <div className="cardHeader">
              <div>
                <h2>Search Result Information</h2>
                <p>Enter your SEO title, description and URL.</p>
              </div>

              <button
                type="button"
                className="clearButton"
                onClick={clearAll}
              >
                Clear
              </button>
            </div>

            <label>SEO Title</label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Free Online Tools - ToolHub AI"
            />

            <div className="counterRow">
              <span className={`status ${titleStatus.type}`}>
                {titleStatus.text}
              </span>

              <span>{titleLength}/60</span>
            </div>

            <label>Meta Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write an attractive description for your webpage..."
              rows={6}
            />

            <div className="counterRow">
              <span className={`status ${descriptionStatus.type}`}>
                {descriptionStatus.text}
              </span>

              <span>{descriptionLength}/160</span>
            </div>

            <label>Page URL</label>

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page"
            />

            <div className="scoreCard">
              <div>
                <span className="scoreLabel">SEO Preview Score</span>

                <strong>{seoScore}/100</strong>
              </div>

              <div className="scoreBar">
                <div
                  className="scoreProgress"
                  style={{ width: `${seoScore}%` }}
                />
              </div>

              <p>
                {seoScore >= 80
                  ? "Excellent! Your basic SERP information looks strong."
                  : seoScore >= 50
                  ? "Good start. Improve the missing SEO information."
                  : "Add your title, description and URL to improve the score."}
              </p>
            </div>

            <div className="checkList">
              <h3>SEO Checklist</h3>

              <div className={titleLength > 0 ? "check good" : "check"}>
                <span>{titleLength > 0 ? "✓" : "○"}</span>
                SEO title added
              </div>

              <div
                className={
                  titleLength >= 30 && titleLength <= 60
                    ? "check good"
                    : "check"
                }
              >
                <span>
                  {titleLength >= 30 && titleLength <= 60 ? "✓" : "○"}
                </span>
                Title length 30–60 characters
              </div>

              <div
                className={
                  descriptionLength > 0 ? "check good" : "check"
                }
              >
                <span>{descriptionLength > 0 ? "✓" : "○"}</span>
                Meta description added
              </div>

              <div
                className={
                  descriptionLength >= 120 && descriptionLength <= 160
                    ? "check good"
                    : "check"
                }
              >
                <span>
                  {descriptionLength >= 120 &&
                  descriptionLength <= 160
                    ? "✓"
                    : "○"}
                </span>
                Description length 120–160 characters
              </div>

              <div className={url.trim() ? "check good" : "check"}>
                <span>{url.trim() ? "✓" : "○"}</span>
                Page URL added
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}

          <div className="card">
            <div className="previewHeader">
              <div>
                <h2>Search Preview</h2>
                <p>Live Google-style search result preview.</p>
              </div>

              <div className="tabs">
                <button
                  type="button"
                  className={
                    activePreview === "desktop"
                      ? "tab active"
                      : "tab"
                  }
                  onClick={() => setActivePreview("desktop")}
                >
                  Desktop
                </button>

                <button
                  type="button"
                  className={
                    activePreview === "mobile"
                      ? "tab active"
                      : "tab"
                  }
                  onClick={() => setActivePreview("mobile")}
                >
                  Mobile
                </button>
              </div>
            </div>

            <div
              className={
                activePreview === "mobile"
                  ? "previewArea mobile"
                  : "previewArea"
              }
            >
              <div className="googleResult">
                <div className="googleTop">
                  <div className="googleFavicon">T</div>

                  <div>
                    <div className="siteName">ToolHub AI</div>

                    <div className="siteUrl">
                      {getDisplayUrl()}
                    </div>
                  </div>
                </div>

                <div className="resultTitle">
                  {title || "Your SEO Page Title"}
                </div>

                <div className="resultDescription">
                  {description ||
                    "Your meta description will appear here. Add a clear and attractive description to preview your Google search result."}
                </div>
              </div>
            </div>

            <div className="previewInfo">
              <div className="infoBox">
                <strong>Title</strong>
                <span>{titleLength} characters</span>
              </div>

              <div className="infoBox">
                <strong>Description</strong>
                <span>{descriptionLength} characters</span>
              </div>

              <div className="infoBox">
                <strong>Device</strong>
                <span>
                  {activePreview === "desktop"
                    ? "Desktop"
                    : "Mobile"}
                </span>
              </div>
            </div>

            <div className="tips">
              <h3>SEO Tips</h3>

              <ul>
                <li>
                  Write a unique and descriptive title for every important
                  page.
                </li>

                <li>
                  Keep the title concise and place your primary keyword
                  naturally.
                </li>

                <li>
                  Write a useful description that encourages users to click.
                </li>

                <li>
                  Avoid keyword stuffing and duplicate titles.
                </li>

                <li>
                  Always check how your result looks on both desktop and
                  mobile.
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

        .layout {
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

        .cardHeader,
        .previewHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
        }

        .cardHeader h2,
        .previewHeader h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 750;
        }

        .cardHeader p,
        .previewHeader p {
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
          box-shadow: 0 0 0 3px rgba(91, 124, 250, 0.12);
        }

        textarea {
          resize: vertical;
          min-height: 130px;
        }

        .counterRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 7px;
          font-size: 12px;
          color: #667085;
        }

        .status {
          font-weight: 600;
        }

        .status.good {
          color: #16803c;
        }

        .status.warning {
          color: #b54708;
        }

        .status.bad {
          color: #d92d20;
        }

        .status.neutral {
          color: #667085;
        }

        .scoreCard {
          margin-top: 24px;
          padding: 18px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
        }

        .scoreCard > div:first-child {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .scoreLabel {
          font-size: 14px;
          font-weight: 700;
        }

        .scoreCard strong {
          font-size: 22px;
        }

        .scoreBar {
          height: 9px;
          margin-top: 14px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .scoreProgress {
          height: 100%;
          background: #3158c7;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .scoreCard p {
          margin: 10px 0 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.5;
        }

        .checkList {
          margin-top: 24px;
          padding: 18px;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
        }

        .checkList h3 {
          margin: 0 0 14px;
          font-size: 16px;
        }

        .check {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          color: #667085;
          font-size: 13px;
        }

        .check span {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f2f4f7;
          font-size: 12px;
        }

        .check.good {
          color: #16803c;
        }

        .check.good span {
          background: #dcfce7;
        }

        .tabs {
          display: flex;
          padding: 4px;
          border-radius: 10px;
          background: #f2f4f7;
        }

        .tab {
          border: none;
          background: transparent;
          color: #667085;
          padding: 8px 12px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 650;
        }

        .tab.active {
          background: #ffffff;
          color: #3158c7;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.12);
        }

        .previewArea {
          width: 100%;
          min-height: 330px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 28px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
        }

        .previewArea.mobile {
          padding: 25px 15px;
        }

        .googleResult {
          width: 100%;
          max-width: 650px;
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #edf0f3;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.05);
        }

        .previewArea.mobile .googleResult {
          max-width: 360px;
        }

        .googleTop {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .googleFavicon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #eef2ff;
          color: #3158c7;
          font-weight: 800;
          font-size: 13px;
        }

        .siteName {
          color: #202124;
          font-size: 13px;
          font-weight: 600;
        }

        .siteUrl {
          color: #5f6368;
          font-size: 12px;
          margin-top: 2px;
          word-break: break-all;
        }

        .resultTitle {
          color: #1a0dab;
          font-size: 20px;
          line-height: 1.35;
          margin: 5px 0;
          word-break: break-word;
        }

        .previewArea.mobile .resultTitle {
          font-size: 18px;
        }

        .resultDescription {
          color: #4d5156;
          font-size: 14px;
          line-height: 1.55;
          word-break: break-word;
        }

        .previewArea.mobile .resultDescription {
          font-size: 13px;
        }

        .previewInfo {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 18px;
        }

        .infoBox {
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #ffffff;
        }

        .infoBox strong {
          display: block;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .infoBox span {
          color: #667085;
          font-size: 12px;
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
          font-size: 16px;
        }

        .tips ul {
          margin: 0;
          padding-left: 20px;
          color: #667085;
          font-size: 13px;
          line-height: 1.8;
        }

        @media (max-width: 900px) {
          .layout {
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

          .cardHeader,
          .previewHeader {
            flex-direction: column;
          }

          .previewArea {
            padding: 15px;
          }

          .previewInfo {
            grid-template-columns: 1fr;
          }

          .tabs {
            width: 100%;
          }

          .tab {
            flex: 1;
          }
        }
      `}</style>
    </main>
  );
}