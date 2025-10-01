"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Star } from "lucide-react";

import { submitFeedback, type SubmitFeedbackState } from "../actions";

type PublicBusiness = {
  name: string;
  slug: string;
};

const initialState: SubmitFeedbackState = { status: "idle" };

function StarVisual({ variant }: { variant: "empty" | "half" | "full" }) {
  if (variant === "full") {
    return (
      <Star
        className="pointer-events-none h-9 w-9 text-amber-400"
        strokeWidth={1.3}
        fill="currentColor"
      />
    );
  }

  if (variant === "half") {
    return (
      <span className="pointer-events-none relative inline-flex h-9 w-9 items-center justify-center text-amber-400">
        <Star className="absolute h-9 w-9 text-amber-400" strokeWidth={1.3} />
        <span className="absolute left-0 top-0 h-full w-1/2 overflow-hidden">
          <Star
            className="h-9 w-9 text-amber-400"
            strokeWidth={1.3}
            fill="currentColor"
          />
        </span>
      </span>
    );
  }

  return <Star className="pointer-events-none h-9 w-9 text-slate-300" strokeWidth={1.3} />;
}

function clampRating(value: number) {
  const step = Math.round(value * 2) / 2;
  return Math.min(5, Math.max(0.5, step));
}

type RatingSelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

function RatingSelector({ value, onChange }: RatingSelectorProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  const starVariants = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      if (displayValue >= starValue) {
        return "full" as const;
      }
      if (displayValue >= starValue - 0.5) {
        return "half" as const;
      }
      return "empty" as const;
    });
  }, [displayValue]);

  const handleChange = (next: number) => {
    const clamped = clampRating(next);
    setHoverValue(null);
    onChange(clamped);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(clampRating(value - 0.5));
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(clampRating(value + 0.5));
    }
  };

  return (
    <div
      className="group rounded-3xl border border-slate-200/80 bg-white/90 px-5 py-4 shadow-sm shadow-slate-900/5 backdrop-blur"
      role="slider"
      aria-label="Rate your visit"
      aria-valuenow={value}
      aria-valuemin={0.5}
      aria-valuemax={5}
      aria-valuetext={`${displayValue.toFixed(1)} out of 5 stars`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={() => setHoverValue(null)}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Your rating
          </span>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
            {displayValue.toFixed(1)} / 5.0
          </span>
        </div>
        <div className="flex items-center gap-2">
          {starVariants.map((variant, index) => {
            const starValue = index + 1;
            return (
              <div key={starValue} className="relative">
                <StarVisual variant={variant} />
                <button
                  type="button"
                  className="absolute left-0 top-0 h-full w-1/2"
                  aria-label={`Rate ${starValue - 0.5} stars`}
                  onMouseEnter={() => setHoverValue(starValue - 0.5)}
                  onMouseLeave={() => setHoverValue(null)}
                  onFocus={() => setHoverValue(starValue - 0.5)}
                  onBlur={() => setHoverValue(null)}
                  onClick={() => handleChange(starValue - 0.5)}
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full w-1/2"
                  aria-label={`Rate ${starValue} stars`}
                  onMouseEnter={() => setHoverValue(starValue)}
                  onMouseLeave={() => setHoverValue(null)}
                  onFocus={() => setHoverValue(starValue)}
                  onBlur={() => setHoverValue(null)}
                  onClick={() => handleChange(starValue)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type FeedbackFormProps = {
  business: PublicBusiness;
};

export default function FeedbackForm({ business }: FeedbackFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [state, formAction, isPending] = useActionState(submitFeedback, initialState);

  useEffect(() => {
    if (state.status === "success" && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  const disableSubmit = isPending || message.trim().length < 8;

  return (
    <form
      action={formAction}
      className="relative rounded-[32px] border border-white/80 bg-white/90 p-6 text-left shadow-[0_30px_60px_rgba(15,23,42,0.12)] backdrop-blur sm:p-10"
    >
      <input type="hidden" name="slug" value={business.slug} />
      <input type="hidden" name="rating" value={rating.toString()} />
      <div className="space-y-6">
        <RatingSelector value={rating} onChange={setRating} />
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="message"
              className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500"
            >
              Tell us about your visit
            </label>
            <p className="text-sm text-slate-500">
              Share a few highlights, surprises, or opportunities you spotted during your time with {business.name}.
            </p>
          </div>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="What stood out? What could be even better?"
            minLength={8}
            rows={5}
            required
            className="w-full resize-none rounded-3xl border border-slate-200/80 bg-white/95 px-5 py-4 text-base text-slate-700 shadow-sm shadow-slate-900/5 transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
          />
        </div>
        {state.status === "error" ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {state.message ?? "We couldn’t save your feedback. Please try again."}
          </div>
        ) : null}
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          We’ll share your note directly with the {business.name} team.
        </p>
        <button
          type="submit"
          disabled={disableSubmit}
          className={clsx(
            "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200",
            disableSubmit
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800",
          )}
        >
          {isPending ? "Sending feedback…" : "Send feedback"}
        </button>
      </div>
    </form>
  );
}
