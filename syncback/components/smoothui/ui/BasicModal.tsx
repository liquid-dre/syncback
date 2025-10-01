"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg";

type BasicModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: ReactNode;
  className?: string;
};

const sizeMap: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

export default function BasicModal({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  className,
}: BasicModalProps) {
  const [mounted, setMounted] = useState(false);
  const headingId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const content = useMemo(() => {
    if (!isOpen) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          aria-hidden="true"
          className="absolute inset-0 cursor-pointer"
          onClick={onClose}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? headingId : undefined}
          className={cn(
            "relative z-10 w-full origin-center overflow-hidden rounded-[32px] border border-white/60 bg-white/95 backdrop-blur-xl shadow-[0_40px_80px_-40px_rgba(15,23,42,0.45)] transition duration-200",
            sizeMap[size],
            className,
          )}
        >
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-white/40 via-white/60 to-slate-100/80" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 p-8">
            {title ? (
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p
                    id={headingId}
                    className="text-lg font-semibold tracking-tight text-slate-900"
                  >
                    {title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-500 shadow-sm transition hover:-translate-y-[1px] hover:border-slate-300 hover:text-slate-900 hover:shadow"
                  aria-label="Close dialog"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : null}
            {children}
          </div>
        </div>
      </div>
    );
  }, [children, className, headingId, isOpen, onClose, size, title]);

  if (!mounted) {
    return null;
  }

  return createPortal(content, document.body);
}
