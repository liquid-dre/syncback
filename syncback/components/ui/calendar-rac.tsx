"use client";

import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  RangeCalendar as RACRangeCalendar,
  type RangeCalendarProps,
} from "react-aria-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DateValue } from "@internationalized/date";

import { cn } from "@/lib/utils";

export function RangeCalendar<T extends DateValue>(
  props: RangeCalendarProps<T>,
) {
  const { className, ...rest } = props;

  return (
    <RACRangeCalendar
      {...rest}
      className={(renderProps) =>
        cn(
          "relative flex w-full flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white/95 p-4 text-slate-900 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.4)]",
          renderProps.isInvalid && "border-rose-200",
          typeof className === "function" ? className(renderProps) : className,
        )
      }
    >
      <div className="flex items-center justify-between rounded-2xl bg-slate-50/80 px-3 py-2">
        <Button
          slot="previous"
          className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-500 transition hover:-translate-y-[1px] hover:border-slate-300 hover:text-slate-900 hover:shadow"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <Heading className="text-sm font-semibold tracking-tight text-slate-900" />
        <Button
          slot="next"
          className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-500 transition hover:-translate-y-[1px] hover:border-slate-300 hover:text-slate-900 hover:shadow"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <CalendarGrid className="w-full border-separate border-spacing-y-2 px-1 text-sm">
        <CalendarGridHeader className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
          {(day) => <CalendarHeaderCell className="pb-1 text-center">{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className={({ isSelected, isSelectionStart, isSelectionEnd, isDisabled, isOutsideMonth }) =>
                cn(
                  "relative h-10 w-10 select-none rounded-2xl text-center text-sm font-medium leading-10 transition",
                  isSelected &&
                    "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-400 text-white shadow-lg",
                  !isSelected && "text-slate-600",
                  isSelectionStart && "rounded-s-full",
                  isSelectionEnd && "rounded-e-full",
                  isDisabled && "pointer-events-none opacity-40",
                  isOutsideMonth && "text-slate-300",
                )
              }
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </RACRangeCalendar>
  );
}
