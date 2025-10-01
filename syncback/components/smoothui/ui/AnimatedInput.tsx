"use client";

import * as React from "react";
import clsx from "clsx";

export type AnimatedInputProps = {
  label: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  helperText?: string;
  textarea?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
} & {
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange"
> &
  Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "defaultValue" | "onChange"
  >;

type InputElement = HTMLInputElement | HTMLTextAreaElement;

type AnimatedInputElement = HTMLInputElement | HTMLTextAreaElement;

const AnimatedInput = React.forwardRef<AnimatedInputElement, AnimatedInputProps>(
  (
    {
      label,
      icon,
      containerClassName,
      helperText,
      textarea,
      value,
      defaultValue,
      onValueChange,
      onChange,
      id,
      className,
      ...rest
    },
    forwardedRef,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const [isFocused, setIsFocused] = React.useState(false);
    const mergedRef = React.useCallback(
      (node: InputElement | null) => {
        if (!node) return;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    const currentValue = isControlled ? value ?? "" : internalValue;

    React.useEffect(() => {
      if (!isControlled && defaultValue !== undefined) {
        setInternalValue(defaultValue);
      }
    }, [defaultValue, isControlled]);

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<InputElement>) => {
        if (!isControlled) {
          setInternalValue(event.target.value);
        }
        onValueChange?.(event.target.value);
        onChange?.(event);
      },
      [isControlled, onChange, onValueChange],
    );

    const showFloatingLabel = isFocused || currentValue.length > 0;
    const LabelComponent = (
      <label
        htmlFor={inputId}
        className={clsx(
          "pointer-events-none absolute left-4 text-base text-slate-400 transition-all duration-200",
          textarea ? "top-4" : "top-1/2 -translate-y-1/2",
          showFloatingLabel &&
            "-top-2 left-3 bg-white/90 px-1 text-xs font-medium text-sky-500",
        )}
      >
        {label}
      </label>
    );

    const inputClasses = clsx(
      "w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-base text-slate-900 shadow-sm transition-all duration-200",
      "focus:border-sky-400 focus:bg-white focus:shadow-lg focus:outline-none",
      icon ? "pl-12" : "pl-4",
      textarea ? "py-4" : "py-3",
      className,
    );

    return (
      <div className={clsx("relative", containerClassName)}>
        <div className="relative">
          {icon ? (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </span>
          ) : null}
          {textarea ? (
            <textarea
              id={inputId}
              ref={mergedRef as React.Ref<HTMLTextAreaElement>}
              value={currentValue}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={clsx(inputClasses, "resize-none leading-6")}
              {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              id={inputId}
              ref={mergedRef as React.Ref<HTMLInputElement>}
              value={currentValue}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={inputClasses}
              {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {LabelComponent}
          <span
            className={clsx(
              "pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-opacity duration-200",
              isFocused ? "opacity-100 shadow-[0_0_0_4px_rgba(56,189,248,0.15)]" : "opacity-0",
            )}
          />
        </div>
        {helperText ? (
          <p className="mt-2 text-sm text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

AnimatedInput.displayName = "AnimatedInput";

export default AnimatedInput;
