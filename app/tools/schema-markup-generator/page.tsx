"use client";

import { useMemo, useState } from "react";

type SchemaType =
  | "Article"
  | "Product"
  | "LocalBusiness"
  | "FAQPage"
  | "Event"
  | "WebSite";

type FAQItem = {
  question: string;
  answer: string;
};

export default function SchemaMarkupGenerator() {
  const [schemaType, setSchemaType] =
    useState<SchemaType>("Article");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");

  // Product
  const [brand, setBrand] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [availability, setAvailability] =
    useState("https://schema.org/InStock");

  // Local Business
  const [businessType, setBusinessType] =
    useState("LocalBusiness");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Event
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] =
    useState("");

  // FAQ
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: "",
      answer: "",
    },
  ]);

  const [copied, setCopied] = useState(false);

  function addFAQ() {
    setFaqs([
      ...faqs,
      {
        question: "",
        answer: "",
      },
    ]);
  }

  function removeFAQ(index: number) {
    if (faqs.length === 1) {
      return;
    }

    setFaqs(faqs.filter((_, i) => i !== index));
  }

  function updateFAQ(
    index: number,
    field: keyof FAQItem,
    value: string
  ) {
    setFaqs(
      faqs.map((faq, i) =>
        i === index
          ? {
              ...faq,
              [field]: value,
            }
          : faq
      )
    );
  }

  const schemaObject = useMemo(() => {
    const base: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": schemaType,
    };

    if (schemaType === "Article") {
      return {
        ...base,
        headline: name || "Your Article Title",
        description:
          description || "Your article description",
        image: image
          ? [image]
          : ["https://example.com/image.jpg"],
        author: {
          "@type": "Person",
          name: author || "Author Name",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url || "https://example.com/article",
        },
      };
    }

    if (schemaType === "Product") {
      return {
        ...base,
        name: name || "Product Name",
        description:
          description || "Product description",
        image: image
          ? [image]
          : ["https://example.com/product.jpg"],
        brand: {
          "@type": "Brand",
          name: brand || "Brand Name",
        },
        sku: sku || "SKU-001",
        offers: {
          "@type": "Offer",
          url: url || "https://example.com/product",
          priceCurrency: currency,
          price: price || "0",
          availability,
        },
      };
    }

    if (schemaType === "LocalBusiness") {
      return {
        ...base,
        "@type": businessType || "LocalBusiness",
        name: name || "Business Name",
        description:
          description || "Business description",
        image:
          image || "https://example.com/business.jpg",
        url: url || "https://example.com",
        telephone: telephone || "+91-0000000000",
        address: {
          "@type": "PostalAddress",
          streetAddress: address || "Business Address",
          addressLocality: city || "City",
          postalCode: postalCode || "000000",
        },
      };
    }

    if (schemaType === "FAQPage") {
      const validFaqs = faqs.filter(
        (faq) =>
          faq.question.trim() &&
          faq.answer.trim()
      );

      return {
        ...base,
        mainEntity:
          validFaqs.length > 0
            ? validFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              }))
            : [
                {
                  "@type": "Question",
                  name: "Your question?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Your answer.",
                  },
                },
              ],
      };
    }

    if (schemaType === "Event") {
      return {
        ...base,
        name: name || "Event Name",
        description:
          description || "Event description",
        image: image
          ? [image]
          : ["https://example.com/event.jpg"],
        startDate:
          startDate || "2026-01-01T10:00:00+05:30",
        endDate:
          endDate || "2026-01-01T18:00:00+05:30",
        location: {
          "@type": "Place",
          name: locationName || "Event Location",
          address:
            locationAddress || "Event Address",
        },
        url: url || "https://example.com/event",
      };
    }

    return {
      ...base,
      name: name || "Website Name",
      description:
        description || "Website description",
      url: url || "https://example.com",
    };
  }, [
    schemaType,
    name,
    description,
    url,
    image,
    author,
    brand,
    sku,
    price,
    currency,
    availability,
    businessType,
    address,
    telephone,
    city,
    postalCode,
    startDate,
    endDate,
    locationName,
    locationAddress,
    faqs,
  ]);

  const generatedCode = useMemo(() => {
    return `<script type="application/ld+json">
${JSON.stringify(schemaObject, null, 2)}
</script>`;
  }, [schemaObject]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(
        generatedCode
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Unable to copy code.");
    }
  }

  function downloadCode() {
    const blob = new Blob(
      [generatedCode],
      {
        type: "application/ld+json;charset=utf-8",
      }
    );

    const downloadUrl =
      URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "schema-markup.jsonld";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
  }

  function clearAll() {
    setSchemaType("Article");
    setName("");
    setDescription("");
    setUrl("");
    setImage("");
    setAuthor("");

    setBrand("");
    setSku("");
    setPrice("");
    setCurrency("INR");
    setAvailability(
      "https://schema.org/InStock"
    );

    setBusinessType("LocalBusiness");
    setAddress("");
    setTelephone("");
    setCity("");
    setPostalCode("");

    setStartDate("");
    setEndDate("");
    setLocationName("");
    setLocationAddress("");

    setFaqs([
      {
        question: "",
        answer: "",
      },
    ]);

    setCopied(false);
  }

  return (
    <main className="page">
      <div className="container">

        <header className="header">
          <div className="badge">
            SEO TOOL
          </div>

          <h1>
            Schema Markup Generator
          </h1>

          <p>
            Generate structured data JSON-LD
            markup for your website.
          </p>
        </header>

        <section className="grid">

          {/* LEFT */}

          <div className="card">

            <div className="cardHeader">
              <div>
                <h2>
                  Schema Information
                </h2>

                <p>
                  Choose a schema type and enter
                  your information.
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

            <label>
              Schema Type
            </label>

            <select
              value={schemaType}
              onChange={(e) =>
                setSchemaType(
                  e.target.value as SchemaType
                )
              }
            >
              <option value="Article">
                Article
              </option>

              <option value="Product">
                Product
              </option>

              <option value="LocalBusiness">
                Local Business
              </option>

              <option value="FAQPage">
                FAQ Page
              </option>

              <option value="Event">
                Event
              </option>

              <option value="WebSite">
                WebSite
              </option>
            </select>

            {schemaType !== "FAQPage" && (
              <>
                <label>
                  {schemaType === "Product"
                    ? "Product Name"
                    : schemaType ===
                      "LocalBusiness"
                    ? "Business Name"
                    : schemaType === "Event"
                    ? "Event Name"
                    : "Name / Title"}
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter name or title"
                />

                <label>
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Enter a clear description..."
                  rows={5}
                />

                <label>
                  Website URL
                </label>

                <input
                  type="url"
                  value={url}
                  onChange={(e) =>
                    setUrl(e.target.value)
                  }
                  placeholder="https://example.com"
                />

                <label>
                  Image URL
                </label>

                <input
                  type="url"
                  value={image}
                  onChange={(e) =>
                    setImage(e.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </>
            )}

            {schemaType === "Article" && (
              <>
                <label>
                  Author Name
                </label>

                <input
                  type="text"
                  value={author}
                  onChange={(e) =>
                    setAuthor(e.target.value)
                  }
                  placeholder="Author name"
                />
              </>
            )}

            {schemaType === "Product" && (
              <div className="sectionBox">

                <h3>
                  Product Details
                </h3>

                <label>
                  Brand
                </label>

                <input
                  type="text"
                  value={brand}
                  onChange={(e) =>
                    setBrand(e.target.value)
                  }
                  placeholder="Brand name"
                />

                <label>
                  SKU
                </label>

                <input
                  type="text"
                  value={sku}
                  onChange={(e) =>
                    setSku(e.target.value)
                  }
                  placeholder="SKU-001"
                />

                <div className="twoColumns">

                  <div>
                    <label>
                      Price
                    </label>

                    <input
                      type="number"
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value)
                      }
                      placeholder="999"
                    />
                  </div>

                  <div>
                    <label>
                      Currency
                    </label>

                    <select
                      value={currency}
                      onChange={(e) =>
                        setCurrency(
                          e.target.value
                        )
                      }
                    >
                      <option value="INR">
                        INR
                      </option>

                      <option value="USD">
                        USD
                      </option>

                      <option value="EUR">
                        EUR
                      </option>

                      <option value="GBP">
                        GBP
                      </option>
                    </select>
                  </div>

                </div>

                <label>
                  Availability
                </label>

                <select
                  value={availability}
                  onChange={(e) =>
                    setAvailability(
                      e.target.value
                    )
                  }
                >
                  <option value="https://schema.org/InStock">
                    In Stock
                  </option>

                  <option value="https://schema.org/OutOfStock">
                    Out of Stock
                  </option>

                  <option value="https://schema.org/PreOrder">
                    Pre-Order
                  </option>
                </select>

              </div>
            )}

            {schemaType ===
              "LocalBusiness" && (
              <div className="sectionBox">

                <h3>
                  Business Details
                </h3>

                <label>
                  Business Type
                </label>

                <select
                  value={businessType}
                  onChange={(e) =>
                    setBusinessType(
                      e.target.value
                    )
                  }
                >
                  <option value="LocalBusiness">
                    Local Business
                  </option>

                  <option value="Restaurant">
                    Restaurant
                  </option>

                  <option value="Store">
                    Store
                  </option>

                  <option value="ProfessionalService">
                    Professional Service
                  </option>

                  <option value="HealthAndBeautyBusiness">
                    Health & Beauty
                  </option>
                </select>

                <label>
                  Telephone
                </label>

                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) =>
                    setTelephone(
                      e.target.value
                    )
                  }
                  placeholder="+91 9876543210"
                />

                <label>
                  Street Address
                </label>

                <input
                  type="text"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  placeholder="123 Main Street"
                />

                <div className="twoColumns">

                  <div>
                    <label>
                      City
                    </label>

                    <input
                      type="text"
                      value={city}
                      onChange={(e) =>
                        setCity(e.target.value)
                      }
                      placeholder="Patiala"
                    />
                  </div>

                  <div>
                    <label>
                      Postal Code
                    </label>

                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) =>
                        setPostalCode(
                          e.target.value
                        )
                      }
                      placeholder="147001"
                    />
                  </div>

                </div>

              </div>
            )}

            {schemaType === "FAQPage" && (
              <div className="sectionBox">

                <div className="faqHeader">
                  <h3>
                    Frequently Asked Questions
                  </h3>

                  <button
                    type="button"
                    className="addButton"
                    onClick={addFAQ}
                  >
                    + Add FAQ
                  </button>
                </div>

                {faqs.map(
                  (faq, index) => (
                    <div
                      className="faqItem"
                      key={index}
                    >
                      <div className="faqItemHeader">
                        <strong>
                          FAQ {index + 1}
                        </strong>

                        {faqs.length > 1 && (
                          <button
                            type="button"
                            className="removeButton"
                            onClick={() =>
                              removeFAQ(index)
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <label>
                        Question
                      </label>

                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) =>
                          updateFAQ(
                            index,
                            "question",
                            e.target.value
                          )
                        }
                        placeholder="What is your question?"
                      />

                      <label>
                        Answer
                      </label>

                      <textarea
                        value={faq.answer}
                        onChange={(e) =>
                          updateFAQ(
                            index,
                            "answer",
                            e.target.value
                          )
                        }
                        placeholder="Write the answer..."
                        rows={4}
                      />
                    </div>
                  )
                )}

              </div>
            )}

            {schemaType === "Event" && (
              <div className="sectionBox">

                <h3>
                  Event Details
                </h3>

                <div className="twoColumns">

                  <div>
                    <label>
                      Start Date & Time
                    </label>

                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) =>
                        setStartDate(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      End Date & Time
                    </label>

                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) =>
                        setEndDate(
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <label>
                  Location Name
                </label>

                <input
                  type="text"
                  value={locationName}
                  onChange={(e) =>
                    setLocationName(
                      e.target.value
                    )
                  }
                  placeholder="Event Hall"
                />

                <label>
                  Location Address
                </label>

                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) =>
                    setLocationAddress(
                      e.target.value
                    )
                  }
                  placeholder="Event address"
                />

              </div>
            )}

          </div>

          {/* RIGHT */}

          <div className="card">

            <div className="cardHeader">
              <div>
                <h2>
                  Generated Schema
                </h2>

                <p>
                  Copy this JSON-LD code into your webpage.
                </p>
              </div>

              <div className="actions">

                <button
                  type="button"
                  className="secondaryButton"
                  onClick={copyCode}
                >
                  {copied
                    ? "Copied!"
                    : "Copy Code"}
                </button>

                <button
                  type="button"
                  className="primaryButton"
                  onClick={downloadCode}
                >
                  Download
                </button>

              </div>
            </div>

            <div className="codeBox">
              <pre>
                {generatedCode}
              </pre>
            </div>

            <div className="previewCard">

              <div className="previewIcon">
                {"</>"}
              </div>

              <div>
                <strong>
                  {schemaType} Schema
                </strong>

                <p>
                  Structured data generated
                  successfully.
                </p>
              </div>

            </div>

            <div className="instructions">

              <h3>
                How to use
              </h3>

              <ol>
                <li>
                  Select the appropriate schema type.
                </li>

                <li>
                  Enter accurate information about
                  your page, product, business or event.
                </li>

                <li>
                  Copy the generated JSON-LD code.
                </li>

                <li>
                  Paste it inside the
                  <code>&lt;head&gt;</code> section
                  of your webpage.
                </li>

                <li>
                  Test the structured data before
                  publishing.
                </li>
              </ol>

            </div>

            <div className="tips">

              <h3>
                SEO Tips
              </h3>

              <ul>
                <li>
                  Use the schema type that accurately
                  describes your content.
                </li>

                <li>
                  Keep structured data consistent with
                  the visible content on your page.
                </li>

                <li>
                  Do not add misleading or inaccurate
                  structured data.
                </li>

                <li>
                  Validate your markup before publishing.
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
          box-shadow:
            0 8px 30px rgba(15, 23, 42, 0.06);
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

        label {
          display: block;
          margin: 17px 0 8px;
          font-size: 14px;
          font-weight: 650;
          color: #344054;
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
        }

        .clearButton,
        .secondaryButton,
        .primaryButton,
        .addButton,
        .removeButton {
          border: none;
          border-radius: 9px;
          padding: 10px 14px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 650;
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
          color: #ffffff;
        }

        .primaryButton:hover {
          background: #2548aa;
        }

        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .sectionBox {
          margin-top: 22px;
          padding: 18px;
          border: 1px solid #e5e7eb;
          border-radius: 13px;
          background: #f8fafc;
        }

        .sectionBox h3 {
          margin: 0 0 5px;
          font-size: 16px;
        }

        .faqHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .faqHeader h3 {
          margin: 0;
        }

        .addButton {
          background: #3158c7;
          color: #ffffff;
        }

        .faqItem {
          margin-top: 16px;
          padding: 16px;
          border-radius: 11px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
        }

        .faqItemHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .removeButton {
          background: #fff1f2;
          color: #be123c;
        }

        .codeBox {
          background: #101828;
          border-radius: 12px;
          padding: 18px;
          min-height: 500px;
          max-height: 620px;
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

        .previewCard {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-top: 20px;
          padding: 16px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
        }

        .previewIcon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #eef2ff;
          color: #3158c7;
          font-size: 14px;
          font-weight: 800;
        }

        .previewCard strong {
          font-size: 14px;
        }

        .previewCard p {
          margin: 4px 0 0;
          color: #667085;
          font-size: 12px;
        }

        .instructions,
        .tips {
          margin-top: 20px;
          padding: 17px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
        }

        .instructions h3,
        .tips h3 {
          margin: 0 0 10px;
          font-size: 15px;
        }

        .instructions ol,
        .tips ul {
          margin: 0;
          padding-left: 20px;
          color: #667085;
          font-size: 12px;
          line-height: 1.9;
        }

        code {
          padding: 2px 5px;
          border-radius: 4px;
          background: #ffffff;
          color: #3158c7;
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

          .faqHeader {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}