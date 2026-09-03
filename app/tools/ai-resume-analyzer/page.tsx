"use client";

import {
  type ChangeEvent,
  useRef,
  useState,
} from "react";

type ExperienceLevel =
  | "Entry Level"
  | "Mid Level"
  | "Senior"
  | "Manager"
  | "Executive";

type ResumeAnalysis = {
  overallScore: number;
  atsScore: number;
  keywordScore: number;
  readabilityScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  experienceFeedback: string;
  skillsFeedback: string;
  formattingFeedback: string;
  topActions: string[];
};

export default function AIResumeAnalyzerPage() {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [targetRole, setTargetRole] =
    useState("");

  const [
    experienceLevel,
    setExperienceLevel,
  ] =
    useState<ExperienceLevel>(
      "Mid Level"
    );

  const [
    jobDescription,
    setJobDescription,
  ] = useState("");

  const [
    result,
    setResult,
  ] =
    useState<ResumeAnalysis | null>(
      null
    );

  const [
    analyzedFileName,
    setAnalyzedFileName,
  ] = useState("");

  const [
    extractedCharacters,
    setExtractedCharacters,
  ] = useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const experienceLevels: ExperienceLevel[] =
    [
      "Entry Level",
      "Mid Level",
      "Senior",
      "Manager",
      "Executive",
    ];

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setError("");
    setResult(null);

    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const fileName =
      selectedFile.name.toLowerCase();

    const allowed =
      fileName.endsWith(".pdf") ||
      fileName.endsWith(".docx");

    if (!allowed) {
      setFile(null);

      setError(
        "Only PDF and DOCX resume files are supported."
      );

      event.target.value = "";
      return;
    }

    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {
      setFile(null);

      setError(
        "Resume file must be 5 MB or smaller."
      );

      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    setAnalyzedFileName("");
    setExtractedCharacters(0);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeResume =
    async () => {
      setError("");
      setCopied(false);

      if (!file) {
        setError(
          "Please upload your resume first."
        );
        return;
      }

      if (!targetRole.trim()) {
        setError(
          "Please enter the target job role."
        );
        return;
      }

      setLoading(true);
      setResult(null);

      try {
        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "targetRole",
          targetRole.trim()
        );

        formData.append(
          "experienceLevel",
          experienceLevel
        );

        formData.append(
          "jobDescription",
          jobDescription.trim()
        );

        const response =
          await fetch(
            "/api/ai/resume-analyze",
            {
              method: "POST",
              body: formData,
            }
          );

        let data;

        try {
          data =
            await response.json();
        } catch {
          throw new Error(
            "The server returned an invalid response."
          );
        }

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ||
              "Unable to analyze the resume."
          );
        }

        const analysis =
          data.result ||
          data.analysis;

        if (
          !analysis ||
          typeof analysis !==
            "object"
        ) {
          throw new Error(
            "The AI did not return a valid resume analysis."
          );
        }

        setResult(analysis);

        setAnalyzedFileName(
          data.fileName ||
            data.resume?.name ||
            file.name
        );

        setExtractedCharacters(
          typeof data.extractedCharacters ===
            "number"
            ? data.extractedCharacters
            : 0
        );
      } catch (error: unknown) {
        let message =
          "Unable to analyze the resume right now. Please try again.";

        if (
          error instanceof Error &&
          error.message
        ) {
          message =
            error.message;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

  const reportText = () => {
    if (!result) return "";

    return `
TOOLVORAA AI RESUME ANALYSIS

Overall Score: ${result.overallScore}/100
ATS Score: ${result.atsScore}/100
Keyword Score: ${result.keywordScore}/100
Readability Score: ${result.readabilityScore}/100

SUMMARY
${result.summary}

STRENGTHS
${result.strengths
  .map(
    (item, index) =>
      `${index + 1}. ${item}`
  )
  .join("\n")}

AREAS TO IMPROVE
${result.improvements
  .map(
    (item, index) =>
      `${index + 1}. ${item}`
  )
  .join("\n")}

MISSING / WEAK KEYWORDS
${result.missingKeywords
  .map(
    (item) => `• ${item}`
  )
  .join("\n")}

EXPERIENCE & IMPACT
${result.experienceFeedback}

SKILLS
${result.skillsFeedback}

FORMATTING & READABILITY
${result.formattingFeedback}

TOP ACTIONS
${result.topActions
  .map(
    (item, index) =>
      `${index + 1}. ${item}`
  )
  .join("\n")}
`.trim();
  };

  const copyReport = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(
        reportText()
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Unable to copy the report. Please copy it manually."
      );
    }
  };

  const clearAll = () => {
    setFile(null);
    setTargetRole("");
    setExperienceLevel(
      "Mid Level"
    );
    setJobDescription("");
    setResult(null);
    setAnalyzedFileName("");
    setExtractedCharacters(0);
    setError("");
    setCopied(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getScoreLabel = (
    score: number
  ) => {
    if (score >= 85) {
      return "Strong Resume";
    }

    if (score >= 70) {
      return "Good Foundation";
    }

    if (score >= 55) {
      return "Needs Improvement";
    }

    return "Major Improvements Needed";
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
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
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            ← Back to All Tools
          </a>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
            📄
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-blue-600">
            AI Career Tool
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            AI Resume Analyzer
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Upload your resume and receive AI-powered feedback on ATS readiness, keywords, readability, skills and job-role alignment.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              "Real PDF & DOCX Reading",
              "ATS Analysis",
              "Keyword Analysis",
              "Improvement Tips",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                  1
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Upload Your Resume
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Upload your resume in PDF or DOCX format.
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={
                  handleFileChange
                }
                className="hidden"
              />

              {!file ? (
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="w-full rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 px-5 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                    ↑
                  </div>

                  <p className="mt-4 font-bold text-slate-900">
                    Drop your resume here
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    or click to browse your computer
                  </p>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-500">
                    PDF or DOCX · Maximum 5 MB
                  </p>
                </button>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 px-5 py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl font-bold text-emerald-700">
                    ✓
                  </div>

                  <p className="mt-4 break-all text-sm font-bold text-slate-900">
                    {file.name}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB · Ready for analysis
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="mt-4 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    Change Resume
                  </button>

                  <button
                    type="button"
                    onClick={
                      removeFile
                    }
                    className="mt-4 block w-full text-xs font-semibold text-red-500 hover:text-red-700"
                  >
                    Remove uploaded resume
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                  2
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Target Job
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell us which role you want to optimize your resume for.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Target Job Role
                  </label>

                  <input
                    type="text"
                    value={
                      targetRole
                    }
                    onChange={(
                      event
                    ) =>
                      setTargetRole(
                        event.target.value
                      )
                    }
                    maxLength={150}
                    placeholder="e.g. Web Designer"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Experience Level
                  </label>

                  <select
                    value={
                      experienceLevel
                    }
                    onChange={(
                      event
                    ) =>
                      setExperienceLevel(
                        event.target.value as ExperienceLevel
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    {experienceLevels.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Job Description
                  </label>

                  <span className="text-xs text-slate-400">
                    Optional
                  </span>
                </div>

                <textarea
                  value={
                    jobDescription
                  }
                  onChange={(
                    event
                  ) =>
                    setJobDescription(
                      event.target.value
                    )
                  }
                  maxLength={7000}
                  rows={7}
                  placeholder="Paste the actual job description here for more accurate keyword and job-match analysis..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>
                    Adding a job description improves role-specific analysis.
                  </span>

                  <span>
                    {jobDescription.length}/7000
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                <div className="flex gap-3">
                  <div>⚠</div>

                  <div>
                    <p className="text-sm font-bold text-red-700">
                      Unable to analyze resume
                    </p>

                    <p className="mt-1 break-words text-sm leading-5 text-red-600">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={
                  analyzeResume
                }
                disabled={
                  loading
                }
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Reading & Analyzing Resume...
                  </span>
                ) : (
                  "✦ Analyze Resume"
                )}
              </button>

              <button
                type="button"
                onClick={clearAll}
                disabled={
                  loading
                }
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                      📊
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Resume Analysis
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        ATS, skills and improvement report.
                      </p>
                    </div>
                  </div>
                </div>

                {result && (
                  <button
                    type="button"
                    onClick={
                      copyReport
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-300 hover:text-blue-700"
                  >
                    {copied
                      ? "Copied ✓"
                      : "Copy Report"}
                  </button>
                )}
              </div>

              {!result ? (
                <div className="flex min-h-[720px] items-center justify-center px-8 py-12 text-center">
                  <div className="max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                      📄
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Your resume analysis will appear here
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Upload a PDF or DOCX resume and click Analyze Resume.
                    </p>

                    <div className="mt-7 rounded-xl bg-slate-50 p-4 text-left">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Best Results
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Add the actual job description to get more useful role-specific keyword feedback.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-b border-slate-100 px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      {targetRole && (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                          {targetRole}
                        </span>
                      )}

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {experienceLevel}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        Real Resume Analysis
                      </span>
                    </div>
                  </div>

                  <div className="max-h-[760px] space-y-5 overflow-y-auto p-5">
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
                      <div className="flex flex-col items-center gap-5 sm:flex-row">
                        <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-8 border-blue-100 bg-white">
                          <span className="text-3xl font-black text-blue-600">
                            {result.overallScore}
                          </span>

                          <span className="text-[9px] font-bold uppercase text-slate-400">
                            out of 100
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                            Overall Resume Score
                          </p>

                          <h3 className="mt-2 text-xl font-black text-slate-950">
                            {getScoreLabel(
                              result.overallScore
                            )}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {result.summary}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <ScoreCard
                        label="ATS Score"
                        score={
                          result.atsScore
                        }
                      />

                      <ScoreCard
                        label="Keywords"
                        score={
                          result.keywordScore
                        }
                      />

                      <ScoreCard
                        label="Readability"
                        score={
                          result.readabilityScore
                        }
                      />
                    </div>

                    <ReportList
                      title="Resume Strengths"
                      icon="✓"
                      items={
                        result.strengths
                      }
                      variant="good"
                    />

                    <ReportList
                      title="Areas to Improve"
                      icon="!"
                      items={
                        result.improvements
                      }
                      variant="warning"
                    />

                    {result.missingKeywords.length > 0 && (
                      <div className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-sm">
                            🔑
                          </div>

                          <h3 className="font-bold text-slate-900">
                            Missing / Weak Keywords
                          </h3>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {result.missingKeywords.map(
                            (item, index) => (
                              <span
                                key={`${item}-${index}`}
                                className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700"
                              >
                                {item}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <FeedbackCard
                      title="Experience & Impact"
                      icon="💼"
                      text={
                        result.experienceFeedback
                      }
                    />

                    <FeedbackCard
                      title="Skills Section"
                      icon="🧩"
                      text={
                        result.skillsFeedback
                      }
                    />

                    <FeedbackCard
                      title="Formatting & Readability"
                      icon="📑"
                      text={
                        result.formattingFeedback
                      }
                    />

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm">
                          🎯
                        </div>

                        <h3 className="font-bold text-slate-900">
                          Top 5 Actions
                        </h3>
                      </div>

                      <div className="mt-4 space-y-3">
                        {result.topActions.map(
                          (item, index) => (
                            <div
                              key={`${item}-${index}`}
                              className="flex gap-3"
                            >
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-black text-blue-600">
                                {index + 1}
                              </div>

                              <p className="text-sm leading-6 text-slate-600">
                                {item}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {(analyzedFileName ||
                      extractedCharacters > 0) && (
                      <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-400">
                        Analyzed: {analyzedFileName}
                        {extractedCharacters > 0 &&
                          ` · ${extractedCharacters.toLocaleString()} readable characters extracted`}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200 bg-slate-50 p-4">
                    <button
                      type="button"
                      onClick={
                        copyReport
                      }
                      className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      {copied
                        ? "Copied ✓"
                        : "Copy Full Report"}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-bold text-amber-800">
                ⚠ Review AI suggestions
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                AI feedback can contain mistakes. Verify recommendations before changing or submitting your resume.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 ToolVoraa. All rights reserved.</p>

          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-blue-600">
              Privacy
            </a>

            <a href="/terms" className="hover:text-blue-600">
              Terms
            </a>

            <a href="/contact" className="hover:text-blue-600">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ScoreCard({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-slate-500">
          {label}
        </p>

        <span className="text-sm font-black text-slate-900">
          {score}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${Math.max(
              0,
              Math.min(100, score)
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

function ReportList({
  title,
  icon,
  items,
  variant,
}: {
  title: string;
  icon: string;
  items: string[];
  variant: "good" | "warning";
}) {
  const iconClasses =
    variant === "good"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black ${iconClasses}`}
        >
          {icon}
        </div>

        <h3 className="font-bold text-slate-900">
          {title}
        </h3>
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map(
            (item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex gap-3 text-sm leading-6 text-slate-600"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                <span>{item}</span>
              </li>
            )
          )}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          No specific items were returned.
        </p>
      )}
    </div>
  );
}

function FeedbackCard({
  title,
  icon,
  text,
}: {
  title: string;
  icon: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm">
          {icon}
        </div>

        <h3 className="font-bold text-slate-900">
          {title}
        </h3>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        {text}
      </p>
    </div>
  );
}