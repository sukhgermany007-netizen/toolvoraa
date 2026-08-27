import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://YOUR-DOMAIN.com";

  const routes = [
    "",
    "/tools/all",

    // Legal Pages
    "/privacy",
    "/terms",
    "/contact",

    // Business & AI Tools
    "/tools/business-name-generator",
    "/tools/invoice-generator",
    "/tools/quotation-generator",
    "/tools/profit-calculator",
    "/tools/business-expense-tracker",
    "/tools/break-even-calculator",
    "/tools/discount-calculator",
    "/tools/markup-calculator",

    // Calculators
    "/tools/age-calculator",
    "/tools/emi-calculator",
    "/tools/gst-calculator",
    "/tools/percentage-calculator",
    "/tools/credit-card-payoff-calculator",
    "/tools/loan-eligibility-calculator",
    "/tools/investment-return-calculator",
    "/tools/sip-calculator",
    "/tools/salary-calculator",

    // Image Tools
    "/tools/background-remover",
    "/tools/image-compressor",
    "/tools/image-converter",
    "/tools/image-cropper",
    "/tools/image-resizer",
    "/tools/image-rotator",
    "/tools/image-to-pdf",
    "/tools/image-to-text",
    "/tools/image-watermark",

    // PDF Tools
    "/tools/jpg-to-pdf",
    "/tools/pdf-compressor",
    "/tools/pdf-cropper",
    "/tools/pdf-extract-pages",
    "/tools/pdf-merge",
    "/tools/pdf-metadata",
    "/tools/pdf-ocr",
    "/tools/pdf-organizer",
    "/tools/pdf-page-number",
    "/tools/pdf-protect",
    "/tools/pdf-rotator",
    "/tools/pdf-splitter",
    "/tools/pdf-text-extractor",
    "/tools/pdf-to-jpg",
    "/tools/pdf-unlock",
    "/tools/pdf-watermark",

    // SEO & Developer Tools
    "/tools/keyword-density-checker",
    "/tools/robots-txt-generator",
    "/tools/schema-markup-generator",
    "/tools/seo-meta-tag-generator",
    "/tools/serp-preview",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/tools/all"
          ? 0.9
          : route === "/privacy" ||
              route === "/terms" ||
              route === "/contact"
            ? 0.5
            : 0.8,
  }));
}