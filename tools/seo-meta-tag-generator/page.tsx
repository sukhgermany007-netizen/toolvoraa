"use client";

import { useMemo, useState } from "react";

export default function SeoMetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [language, setLanguage] = useState("en");
  const [copied, setCopied] = useState(false);

  const titleLength = title.length;
  const descriptionLength = description.length;

  function escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const generatedCode = useMemo(() => {
    const safeTitle = escapeHtml(title || "Your Page Title");
    const safeDescription = escapeHtml(
      description || "Your page description"
    );

    const lines: string[] = [
      "<!-- Basic SEO Meta Tags -->",
      `<title>${safeTitle}</title>`,
      `<meta name="description" content="${safeDescription}" />`,
    ];

    if (keywords.trim()) {
      lines.push(
        `<meta name="keywords" content="${escapeHtml(keywords)}" />`
      );
    }

    if (author.trim()) {
      lines.push(
        `<meta name="author" content="${escapeHtml(author)}" />`
      );
    }

    lines.push(
      `<meta name="robots" content="${escapeHtml(robots)}" />`,
      `<meta name="language" content="${escapeHtml(language)}" />`
    );

    if (url.trim()) {
      lines.push(
        `<link rel="canonical" href="${escapeHtml(url)}" />`
      );
    }

    lines.push(
      "",
      "<!-- Open Graph / Facebook -->",
      `<meta property="og:title" content="${safeTitle}" />`,
      `<meta property="og:description" content="${safeDescription}" />`,
      `<meta property="og:type" content="website" />`
    );

    if (url.trim()) {
      lines.push(
        `<meta property="og:url" content="${escapeHtml(url)}" />`
      );
    }

    if (imageUrl.trim()) {
      lines.push(
        `<meta property="og:image" content="${escapeHtml(
          imageUrl
        )}" />`
      );
    }

    lines.push(
      "",
      "<!-- Twitter Card -->",
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${safeTitle}" />`,
      `<meta name="twitter:description" content="${safeDescription}" />`
    );

    if (imageUrl.trim()) {
      lines.push(
        `<meta name="twitter:image" content="${escapeHtml(
          imageUrl
        )}" />`
      );
    }

    return lines.join("\n");
  }, [
    title,
    description,
    keywords,
    author,
    url,
    imageUrl,
    robots,
    language,
  ]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Unable to copy code. Please copy it manually.");
    }
  }

  function downloadCode() {
    const html = `<!DOCTYPE html>
<html lang="${language}">
<head>
${generatedCode}
</head>
<body>

</body>
</html>`;

    const blob = new Blob([html], {
      type: "text/html;charset=utf-8",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "seo-meta-tags.html";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
  }

  function clearAll() {
    setTitle("");
    setDescription("");
    setKeywords("");
    setAuthor("");
    setUrl("");
    setImageUrl("");
    setRobots("index, follow");
    setLanguage("en");
    setCopied(false);
  }

  const titleStatus =
    titleLength === 0
      ? "Recommended: 50–60 characters"
      : titleLength <= 60
      ? "Good title length"
      : "Title is longer than recommended";

  const descriptionStatus =
    descriptionLength === 0
      ? "Recommended: 150–160 characters"
      : descriptionLength <= 160
      ? "Good description length"
      : "Description is longer than recommended";

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <div className="badge">SEO TOOL</div>

          <h1>SEO Meta Tag Generator</h1>

          <p>
            Generate SEO-friendly meta tags, Open Graph tags and
            Twitter Card tags for your website.
          </p>
        </header>

        <section className="grid">
          {/* LEFT SIDE */}

          <div className="card">
            <div className="cardHeader">
              <h2>Website Information</h2>

              <button
                type="button"
                className="clearButton"
                onClick={clearAll}
              >
                Clear
              </button>
            </div>

            <label>
              Page Title <span className="required">*</span>
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Best Online Tools - ToolHub AI"
            />

            <div className="counter">
              <span>{titleStatus}</span>
              <span>{titleLength}/60</span>
            </div>

            <label>
              Meta Description <span className="required">*</span>
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short and attractive description of your webpage..."
              rows={5}
            />

            <div className="counter">
              <span>{descriptionStatus}</span>
              <span>{descriptionLength}/160</span>
            </div>

            <label>Keywords</label>

            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="seo tools, online tools, free tools"
            />

            <label>Author</label>

            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name or company"
            />

            <label>Website URL</label>

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page"
            />

            <label>Social Share Image URL</label>

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />

            <div className="twoColumns">
              <div>
                <label>Robots</label>

                <select
                  value={robots}
                  onChange={(e) => setRobots(e.target.value)}
                >
                  <option value="index, follow">
                    Index, Follow
                  </option>

                  <option value="noindex, follow">
                    Noindex, Follow
                  </option>

                  <option value="index, nofollow">
                    Index, Nofollow
                  </option>

                  <option value="noindex, nofollow">
                    Noindex, Nofollow
                  </option>
                </select>
              </div>

              <div>
                <label>Language</label>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="pa">Punjabi</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="card">
            <div className="cardHeader">
              <h2>Generated Meta Tags</h2>

              <div className="actions">
                <button
                  type="button"
                  className="secondaryButton"
                  onClick={copyCode}
                >
                  {copied ? "Copied!" : "Copy Code"}
                </button>

                <button
                  type="button"
                  className="primaryButton"
                  onClick={downloadCode}
                >
                  Download HTML
                </button>
              </div>
            </div>

            <div className="codeBox">
              <pre>{generatedCode}</pre>
            </div>

            <div className="preview">
              <h3>Google Search Preview</h3>

              <div className="googlePreview">
                <div className="previewUrl">
                  {url || "https://example.com"}
                </div>

                <div className="previewTitle">
                  {title || "Your Page Title"}
                </div>

                <div className="previewDescription">
                  {description ||
                    "Your page description will appear here in Google search results."}
                </div>
              </div>
            </div>

            <div className="tips">
              <h3>SEO Tips</h3>

              <ul>
                <li>
                  Keep your page title around 50–60 characters.
                </li>

                <li>
                  Keep your meta description around 150–160 characters.
                </li>

                <li>
                  Write unique titles and descriptions for every
                  important page.
                </li>

                <li>
                  Use your main keyword naturally in the title and
                  description.
                </li>

                <li>
                  Use a relevant social sharing image for better
                  social previews.
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
          padding: 40px 20px 70px;
          color: #172033;
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
          max-width: 700px;
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
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 22px;
        }

        .cardHeader h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 750;
        }

        label {
          display: block;
          margin: 17px 0 8px;
          font-size: 14px;
          font-weight: 650;
          color: #344054;
        }

        .required {
          color: #e11d48;
          margin-left: 3px;
        }

        input,
        textarea,
        select {
          width: 100%;
          border: 1px solid #d0d5dd;
          border-radius: 10px;
          padding: 12px 13px;
          font-size: 14px;
          outline: none;
          background: #ffffff;
          color: #101828;
          transition:
            border 0.2s,
            box-shadow 0.2s;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #5b7cfa;
          box-shadow:
            0 0 0 3px rgba(91, 124, 250, 0.12);
        }

        textarea {
          resize: vertical;
          min-height: 120px;
        }

        .counter {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 6px;
          font-size: 12px;
          color: #667085;
        }

        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .clearButton,
        .secondaryButton,
        .primaryButton {
          border: none;
          border-radius: 9px;
          padding: 10px 14px;
          cursor: pointer;
          font-weight: 650;
          font-size: 13px;
        }

        .clearButton {
          background: #f2f4f7;
          color: #475467;
        }

        .clearButton:hover {
          background: #e4e7ec;
        }

        .actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .secondaryButton {
          background: #eef2ff;
          color: #3b5bdb;
        }

        .primaryButton {
          background: #3158c7;
          color: white;
        }

        .primaryButton:hover {
          background: #2548aa;
        }

        .codeBox {
          background: #101828;
          border-radius: 12px;
          padding: 18px;
          min-height: 420px;
          overflow: auto;
        }

        .codeBox pre {
          margin: 0;
          color: #e6edf3;
          font-family: Consolas, Monaco, monospace;
          font-size: 12px;
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .preview {
          margin-top: 24px;
        }

        .preview h3,
        .tips h3 {
          margin: 0 0 12px;
          font-size: 16px;
        }

        .googlePreview {
          border: 1px solid #e4e7ec;
          border-radius: 12px;
          padding: 18px;
          background: #ffffff;
        }

        .previewUrl {
          color: #202124;
          font-size: 13px;
          margin-bottom: 5px;
          word-break: break-all;
        }

        .previewTitle {
          color: #1a0dab;
          font-size: 20px;
          line-height: 1.35;
          margin-bottom: 5px;
        }

        .previewDescription {
          color: #4d5156;
          font-size: 14px;
          line-height: 1.55;
        }

        .tips {
          margin-top: 24px;
          padding: 17px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
        }

        .tips ul {
          margin: 0;
          padding-left: 20px;
          color: #667085;
          font-size: 13px;
          line-height: 1.8;
        }

        @media (max-width: 850px) {
          .grid {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 30px;
          }
        }

        @media (max-width: 520px) {
          .page {
            padding: 25px 12px 50px;
          }

          .card {
            padding: 18px;
            border-radius: 14px;
          }

          .cardHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .twoColumns {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .actions {
            width: 100%;
          }

          .secondaryButton,
          .primaryButton {
            flex: 1;
          }
        }
      `}</style>
    </main>
  );
}