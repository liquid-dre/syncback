"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SliderBaseProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
> & {
  min?: number;
  max?: number;
  step?: number;
};

export type SliderProps = SliderBaseProps & {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
};

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const initial = React.useMemo(() => {
      if (value && value.length > 0) {
        return value[0];
      }
      if (defaultValue && defaultValue.length > 0) {
        return defaultValue[0];
      }
      return min;
    }, [defaultValue, min, value]);

    const [internalValue, setInternalValue] = React.useState(initial);

    React.useEffect(() => {
      if (isControlled && value) {
        setInternalValue(value[0]);
      }
    }, [isControlled, value]);

    React.useEffect(() => {
      setInternalValue((current) => {
        if (current < min) return min;
        if (current > max) return max;
        return current;
      });
    }, [min, max]);

    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={isControlled ? value?.[0] ?? min : internalValue}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          if (!isControlled) {
            setInternalValue(nextValue);
          }
          onValueChange?.([nextValue]);
        }}
        className={cn(
          "h-2 w-full appearance-none rounded-full bg-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-colors",
          "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-slate-200",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-slate-900",
          "[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-slate-200",
          className,
        )}
        {...props}
      />
    );
  },
);

Slider.displayName = "Slider";

export { Slider };
