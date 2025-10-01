"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Mail,
  QrCode,
  Sparkles,
  XCircle,
} from "lucide-react";

import { saveBusiness, type SettingsFormState } from "./actions";

type SettingsFormProps = {
  initialState: SettingsFormState;
};

const fallbackState: SettingsFormState = {
  status: "idle",
};

export function SettingsForm({ initialState }: SettingsFormProps) {
  const [state, formAction] = useActionState(saveBusiness, initialState ?? fallbackState);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const currentState = state ?? fallbackState;
  const currentName = currentState.name ?? initialState.name ?? "";
  const currentEmail = currentState.email ?? initialState.email ?? "";
  const currentSlug = currentState.slug ?? initialState.slug ?? "";
  const currentQrSvg = currentState.qrSvg ?? initialState.qrSvg;
  const currentFeedbackUrl = currentState.feedbackUrl ?? initialState.feedbackUrl;

  useEffect(() => {
    if (!copied && !downloaded) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setCopied(false);
      setDownloaded(false);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [copied, downloaded]);

  async function handleCopyLink() {
    if (!currentFeedbackUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(currentFeedbackUrl);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy link", error);
    }
  }

  function handleDownload() {
    if (!currentQrSvg) {
      return;
    }

    try {
      const blob = new Blob([currentQrSvg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${currentSlug || "syncback-qr"}.svg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setDownloaded(true);
    } catch (error) {
      console.error("Failed to download QR code", error);
    }
  }

  return (
    <section className="relative isolate overflow-hidden rounded-[36px] border border-white/70 bg-white/90 p-6 shadow-2xl backdrop-blur sm:p-10">
      <div className="absolute -left-12 top-16 h-32 w-32 rounded-full bg-gradient-to-br from-sky-400/30 to-blue-500/10 blur-3xl" />
      <div className="absolute -right-14 bottom-20 h-36 w-36 rounded-full bg-gradient-to-tr from-emerald-400/30 to-emerald-500/10 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_0.85fr)] lg:items-start">
        <div className="space-y-8">
          <header className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-600">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Guided setup
            </span>
            <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
              Tell us who you are and where to send glowing reviews
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Once saved we lock in your unique link, render a crisp QR code, and email every new response to the inbox you choose.
            </p>
          </header>

          {currentState.status === "success" && currentState.message ? (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-700">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" aria-hidden />
              <p className="text-sm font-medium">{currentState.message}</p>
            </div>
          ) : currentState.status === "error" && currentState.message ? (
            <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-600">
              <XCircle className="h-5 w-5 flex-shrink-0" aria-hidden />
              <p className="text-sm font-medium">{currentState.message}</p>
            </div>
          ) : null}

          <form action={formAction} className="space-y-7">
            <input type="hidden" name="slug" value={currentSlug} />

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-900">
                Business name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ex. Wildflower Café"
                defaultValue={currentName}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                required
              />
              <p className="text-xs text-slate-500">
                We&rsquo;ll use this to personalise your QR card and public feedback page.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900">
                Notification email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" aria-hidden />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hello@yourbusiness.com"
                  defaultValue={currentEmail}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-10 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  required
                />
              </div>
              <p className="text-xs text-slate-500">
                We&rsquo;ll send new feedback alerts here instantly.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                You&rsquo;ll be able to refresh your QR any time after saving.
              </p>
              <SubmitButton />
            </div>
          </form>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-slate-100 bg-slate-50/80 p-6 shadow-inner">
          <div className="absolute -top-12 left-16 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute -bottom-14 right-6 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-6">
            <div className="rounded-3xl bg-white/90 p-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Your QR preview
              </p>
              <div className="mt-4 flex flex-col items-center justify-center gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  {currentQrSvg ? (
                    <div
                      className="h-44 w-44"
                      aria-label="Generated QR code"
                      dangerouslySetInnerHTML={{ __html: currentQrSvg }}
                    />
                  ) : (
                    <div className="flex h-44 w-44 flex-col items-center justify-center gap-2 text-center text-slate-400">
                      <QrCode className="h-8 w-8" aria-hidden />
                      <p className="text-xs font-medium">Save to generate your QR</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!currentQrSvg}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400/60"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    {downloaded ? "Saved!" : "Download SVG"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    disabled={!currentFeedbackUrl}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                  >
                    <Copy className="h-4 w-4" aria-hidden />
                    {copied ? "Link copied" : "Copy feedback link"}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Live link
              </p>
              <p className="mt-2 break-all text-sm font-medium text-slate-900">
                {currentFeedbackUrl ?? "Your link will appear here after saving"}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Share this link on receipts, emails, or digital signage to collect feedback without the QR.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-sky-300"
      disabled={pending}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ArrowRight className="h-4 w-4" aria-hidden />}
      {pending ? "Saving" : "Save & generate QR"}
    </button>
  );
}
