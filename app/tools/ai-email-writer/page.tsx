"use client";

import {
  type ReactNode,
  useState,
} from "react";

type EmailType =
  | "Business"
  | "Follow-up"
  | "Sales"
  | "Job"
  | "Complaint"
  | "Thank You";

type Tone =
  | "Professional"
  | "Friendly"
  | "Formal"
  | "Persuasive"
  | "Polite"
  | "Confident";

type Length =
  | "Short"
  | "Medium"
  | "Detailed";

type Language =
  | "English"
  | "Hindi"
  | "Punjabi";

const emailTypes: {
  name: EmailType;
  icon: string;
  description: string;
}[] = [
  {
    name: "Business",
    icon: "💼",
    description:
      "Professional communication",
  },
  {
    name: "Follow-up",
    icon: "↗",
    description:
      "Follow up on a conversation",
  },
  {
    name: "Sales",
    icon: "📈",
    description:
      "Sales and outreach emails",
  },
  {
    name: "Job",
    icon: "👔",
    description:
      "Job and career emails",
  },
  {
    name: "Complaint",
    icon: "⚠",
    description:
      "Formal complaint emails",
  },
  {
    name: "Thank You",
    icon: "♡",
    description:
      "Thank-you messages",
  },
];

export default function AIEmailWriterPage() {
  const [emailType, setEmailType] =
    useState<EmailType>("Business");

  const [recipient, setRecipient] =
    useState("");

  const [recipientRole, setRecipientRole] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [purpose, setPurpose] =
    useState("");

  const [keyPoints, setKeyPoints] =
    useState("");

  const [tone, setTone] =
    useState<Tone>("Professional");

  const [length, setLength] =
    useState<Length>("Medium");

  const [language, setLanguage] =
    useState<Language>("English");

  const [senderName, setSenderName] =
    useState("");

  const [
    generatedEmail,
    setGeneratedEmail,
  ] = useState("");

  const [
    generatedSubject,
    setGeneratedSubject,
  ] = useState("");

  const [copied, setCopied] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================================
     REAL AI EMAIL GENERATION
  ========================================= */

  const generateEmail = async () => {
    if (!purpose.trim()) {
      setError(
        "Please enter the purpose of your email."
      );
      return;
    }

    if (!keyPoints.trim()) {
      setError(
        "Please enter the key points you want included."
      );
      return;
    }

    setLoading(true);
    setCopied(false);
    setError("");

    try {
      const finalSubject =
        subject.trim() ||
        createSubject(
          emailType,
          purpose
        );

      const prompt = `
Write a complete professional email using the information below.

EMAIL TYPE:
${emailType}

RECIPIENT NAME:
${recipient.trim() || "Not provided"}

RECIPIENT ROLE:
${recipientRole.trim() || "Not provided"}

SUBJECT CONTEXT:
${finalSubject}

PURPOSE OF EMAIL:
${purpose.trim()}

IMPORTANT POINTS TO INCLUDE:
${keyPoints.trim()}

TONE:
${tone}

LENGTH:
${length}

LANGUAGE:
${language}

SENDER NAME:
${senderName.trim() || "Not provided"}

IMPORTANT INSTRUCTIONS:

1. Write the complete email in ${language}.
2. Use a ${tone.toLowerCase()} tone.
3. Follow the requested ${length.toLowerCase()} length.
4. Naturally include all important points supplied by the user.
5. Do not invent facts, names, prices, dates, promises, attachments or commitments.
6. Use an appropriate greeting.
7. Use a natural professional closing.
8. If the recipient name is provided, use it appropriately.
9. If the sender name is provided, include it as the signature.
10. If no sender name is provided, do not write placeholders such as "Your Name".
11. Do not include explanations before or after the email.
12. Do not include a Subject line because the subject is displayed separately.
13. Return only the finished email body.
`.trim();

      const response = await fetch(
        "/api/ai/generate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            tool: "email-writer",
            prompt,
          }),
        }
      );

      let data: {
        success?: boolean;
        text?: string;
        error?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The AI server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to generate the email."
        );
      }

      if (
        !data.text ||
        typeof data.text !== "string"
      ) {
        throw new Error(
          "AI returned an empty response."
        );
      }

      setGeneratedSubject(
        finalSubject
      );

      setGeneratedEmail(
        data.text.trim()
      );
    } catch (err) {
      console.error(
        "AI Email Writer Error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate the email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     COPY EMAIL
  ========================================= */

  const copyEmail = async () => {
    if (!generatedEmail) return;

    const completeEmail =
      `Subject: ${generatedSubject}\n\n${generatedEmail}`;

    try {
      await navigator.clipboard.writeText(
        completeEmail
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Unable to copy the email."
      );
    }
  };

  /* =========================================
     CLEAR FORM
  ========================================= */

  const clearAll = () => {
    setEmailType("Business");
    setRecipient("");
    setRecipientRole("");
    setSubject("");
    setPurpose("");
    setKeyPoints("");
    setTone("Professional");
    setLength("Medium");
    setLanguage("English");
    setSenderName("");
    setGeneratedEmail("");
    setGeneratedSubject("");
    setCopied(false);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a
            href="/"
            className="text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            Tool
            <span className="text-purple-600">
              Voraa
            </span>
          </a>

          <a
            href="/tools/all"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
          >
            ← Back to All Tools
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700">
              <span>✦</span>
              AI POWERED WRITING
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Professional AI{" "}
              <span className="text-purple-600">
                Email Writer
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Turn a few simple points
              into a clear, polished and
              professional email for work,
              sales, follow-ups,
              applications and everyday
              communication.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 sm:text-sm">
              <span>
                ✓ Multiple tones
              </span>

              <span>
                ✓ 3 languages
              </span>

              <span>
                ✓ Custom length
              </span>

              <span>
                ✓ AI powered
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <div className="grid items-start gap-7 xl:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* EMAIL TYPE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <SectionHeader
                number="1"
                title="Choose Email Type"
                description="Select what kind of email you want to create."
              />

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {emailTypes.map(
                  (item) => {
                    const active =
                      emailType ===
                      item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          setEmailType(
                            item.name
                          );
                          setError("");
                        }}
                        className={`rounded-xl border p-4 text-left transition ${
                          active
                            ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100"
                            : "border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                              active
                                ? "bg-purple-600 text-white"
                                : "bg-slate-100"
                            }`}
                          >
                            {item.icon}
                          </div>

                          <span
                            className={`text-sm font-bold ${
                              active
                                ? "text-purple-700"
                                : "text-slate-800"
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>

                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          {
                            item.description
                          }
                        </p>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* EMAIL DETAILS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <SectionHeader
                number="2"
                title="Email Details"
                description="Give the AI enough context to write a useful email."
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field
                  label="Recipient Name"
                  optional
                >
                  <input
                    value={recipient}
                    onChange={(e) =>
                      setRecipient(
                        e.target.value
                      )
                    }
                    maxLength={100}
                    placeholder="e.g. Mr. Sharma"
                    className={
                      inputClass
                    }
                  />
                </Field>

                <Field
                  label="Recipient Role"
                  optional
                >
                  <input
                    value={
                      recipientRole
                    }
                    onChange={(e) =>
                      setRecipientRole(
                        e.target.value
                      )
                    }
                    maxLength={150}
                    placeholder="e.g. Client, Manager"
                    className={
                      inputClass
                    }
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field
                    label="Subject"
                    optional
                  >
                    <input
                      value={subject}
                      onChange={(e) =>
                        setSubject(
                          e.target.value
                        )
                      }
                      maxLength={200}
                      placeholder="Leave blank to generate a subject automatically"
                      className={
                        inputClass
                      }
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Purpose of Email">
                    <textarea
                      value={purpose}
                      onChange={(e) => {
                        setPurpose(
                          e.target.value
                        );
                        setError("");
                      }}
                      rows={3}
                      maxLength={1200}
                      placeholder="Example: Request a meeting next Tuesday to discuss our new website project."
                      className={`${inputClass} resize-y`}
                    />

                    <div className="mt-2 flex items-center justify-between gap-4 text-xs text-slate-400">
                      <span>
                        Describe the
                        main goal of the
                        email.
                      </span>

                      <span>
                        {
                          purpose.length
                        }
                        /1200
                      </span>
                    </div>
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Key Points to Include">
                    <textarea
                      value={keyPoints}
                      onChange={(e) => {
                        setKeyPoints(
                          e.target.value
                        );
                        setError("");
                      }}
                      rows={6}
                      maxLength={2000}
                      placeholder={`Example:
• Project is ready for review
• Suggest Tuesday at 11 AM
• Ask for confirmation
• Mention attached quotation`}
                      className={`${inputClass} resize-y`}
                    />

                    <div className="mt-2 flex items-center justify-between gap-4 text-xs text-slate-400">
                      <span>
                        Add one point
                        per line for
                        better results.
                      </span>

                      <span>
                        {
                          keyPoints.length
                        }
                        /2000
                      </span>
                    </div>
                  </Field>
                </div>
              </div>
            </div>

            {/* STYLE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <SectionHeader
                number="3"
                title="Writing Style"
                description="Control how the final email should sound."
              />

              <div className="mt-6 space-y-6">
                <Field label="Tone">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {(
                      [
                        "Professional",
                        "Friendly",
                        "Formal",
                        "Persuasive",
                        "Polite",
                        "Confident",
                      ] as Tone[]
                    ).map(
                      (item) => (
                        <OptionButton
                          key={item}
                          active={
                            tone ===
                            item
                          }
                          onClick={() =>
                            setTone(
                              item
                            )
                          }
                        >
                          {item}
                        </OptionButton>
                      )
                    )}
                  </div>
                </Field>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Length">
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          "Short",
                          "Medium",
                          "Detailed",
                        ] as Length[]
                      ).map(
                        (item) => (
                          <OptionButton
                            key={item}
                            active={
                              length ===
                              item
                            }
                            onClick={() =>
                              setLength(
                                item
                              )
                            }
                          >
                            {
                              item
                            }
                          </OptionButton>
                        )
                      )}
                    </div>
                  </Field>

                  <Field label="Language">
                    <select
                      value={language}
                      onChange={(e) =>
                        setLanguage(
                          e.target
                            .value as Language
                        )
                      }
                      className={
                        inputClass
                      }
                    >
                      <option>
                        English
                      </option>

                      <option>
                        Hindi
                      </option>

                      <option>
                        Punjabi
                      </option>
                    </select>
                  </Field>
                </div>

                <Field
                  label="Your Name / Signature"
                  optional
                >
                  <input
                    value={senderName}
                    onChange={(e) =>
                      setSenderName(
                        e.target.value
                      )
                    }
                    maxLength={120}
                    placeholder="e.g. Sukhwinder Singh"
                    className={
                      inputClass
                    }
                  />
                </Field>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                <div className="flex gap-3">
                  <span className="text-lg">
                    ⚠
                  </span>

                  <div>
                    <p className="text-sm font-bold text-rose-800">
                      Unable to generate
                      email
                    </p>

                    <p className="mt-1 text-xs leading-5 text-rose-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={
                  generateEmail
                }
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">
                      ◌
                    </span>

                    Writing
                    Email...
                  </>
                ) : (
                  <>
                    <span>
                      ✦
                    </span>

                    Generate Email
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={clearAll}
                disabled={loading}
                className="rounded-xl border border-slate-300 bg-white px-6 py-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="xl:sticky xl:top-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* PREVIEW HEADER */}
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-sm text-purple-700">
                        ✦
                      </span>

                      <p className="font-bold text-slate-800">
                        AI Email
                        Preview
                      </p>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Review your
                      generated email
                      before sending.
                    </p>
                  </div>

                  {generatedEmail && (
                    <button
                      type="button"
                      onClick={
                        copyEmail
                      }
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-purple-300 hover:text-purple-700"
                    >
                      {copied
                        ? "✓ Copied"
                        : "Copy"}
                    </button>
                  )}
                </div>
              </div>

              {!generatedEmail &&
              !loading ? (
                <EmptyPreview />
              ) : loading ? (
                <LoadingPreview />
              ) : (
                <div>
                  {/* TOOLBAR */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-3 sm:px-6">
                    <Badge>
                      {emailType}
                    </Badge>

                    <Badge>
                      {tone}
                    </Badge>

                    <Badge>
                      {length}
                    </Badge>

                    <Badge>
                      {language}
                    </Badge>
                  </div>

                  {/* EMAIL */}
                  <div className="min-h-[520px] p-5 sm:p-7">
                    <div className="mb-6 border-b border-slate-100 pb-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Subject
                      </p>

                      <p className="mt-2 text-base font-bold leading-6 text-slate-900">
                        {
                          generatedSubject
                        }
                      </p>
                    </div>

                    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {
                        generatedEmail
                      }
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={
                          copyEmail
                        }
                        className="rounded-lg bg-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
                      >
                        {copied
                          ? "✓ Email Copied"
                          : "Copy Email"}
                      </button>

                      <button
                        type="button"
                        onClick={
                          generateEmail
                        }
                        disabled={
                          loading
                        }
                        className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-purple-300 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        ↻ Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="mt-4 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <span className="text-lg">
                🔒
              </span>

              <div>
                <p className="text-sm font-bold text-emerald-800">
                  Write with
                  confidence
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  Always review
                  generated content
                  before sending,
                  especially emails
                  containing important
                  business or personal
                  information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BENEFITS */}
        <section className="mt-14 border-t border-slate-200 pt-12">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600">
              SIMPLE &
              PRODUCTIVE
            </p>

            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Write Better Emails,
              Faster
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Designed for everyday
              professional
              communication without
              complicated prompts.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon="✦"
              title="AI-Powered Writing"
              description="Turn simple instructions and key points into a structured professional email."
            />

            <FeatureCard
              icon="🎯"
              title="Control the Style"
              description="Choose the email type, tone, length and language for your situation."
            />

            <FeatureCard
              icon="⚡"
              title="Ready in Seconds"
              description="Generate, review, regenerate and copy your email from one clean workspace."
            />
          </div>
        </section>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            ©{" "}
            {new Date().getFullYear()}{" "}
            ToolVoraa. Smart online
            tools for everyday work.
          </p>

          <div className="flex gap-5">
            <a
              href="/privacy"
              className="transition hover:text-purple-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition hover:text-purple-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="transition hover:text-purple-600"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* =========================================
   SUBJECT GENERATOR
========================================= */

function createSubject(
  type: EmailType,
  purpose: string
) {
  const cleanPurpose =
    purpose
      .trim()
      .replace(/\.$/, "");

  const shortPurpose =
    cleanPurpose.length > 65
      ? `${cleanPurpose.slice(
          0,
          62
        )}...`
      : cleanPurpose;

  if (type === "Follow-up") {
    return `Follow-up: ${shortPurpose}`;
  }

  if (type === "Sales") {
    return `Regarding ${shortPurpose}`;
  }

  if (type === "Job") {
    return `Regarding ${shortPurpose}`;
  }

  if (type === "Complaint") {
    return `Request for Resolution: ${shortPurpose}`;
  }

  if (type === "Thank You") {
    return `Thank You - ${shortPurpose}`;
  }

  return shortPurpose;
}

/* =========================================
   SHARED STYLES
========================================= */

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

/* =========================================
   COMPONENTS
========================================= */

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-sm font-black text-white">
        {number}
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  optional = false,
}: {
  label: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-slate-700">
          {label}
        </label>

        {optional && (
          <span className="text-xs text-slate-400">
            Optional
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2.5 text-xs font-bold transition sm:text-sm ${
        active
          ? "border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-100"
          : "border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:bg-purple-50"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyPreview() {
  return (
    <div className="flex min-h-[650px] items-center justify-center p-8">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 text-3xl">
          ✉
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-800">
          Your email will
          appear here
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Complete the form
          and click Generate
          Email to create your
          professional message.
        </p>

        <div className="mx-auto mt-6 max-w-xs rounded-xl bg-slate-50 p-4 text-left">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Quick Tip
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Include specific
            names, dates,
            amounts and desired
            actions in your key
            points for better
            results.
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingPreview() {
  return (
    <div className="flex min-h-[650px] items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-700">
          <span className="animate-pulse">
            ✦
          </span>
        </div>

        <p className="mt-5 font-bold text-slate-800">
          Writing your
          email...
        </p>

        <p className="mt-2 text-sm text-slate-500">
          AI is creating a
          polished draft based
          on your instructions.
        </p>
      </div>
    </div>
  );
}

function Badge({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold text-slate-500">
      {children}
    </span>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl text-purple-700">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}