"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  SearchIcon,
  Star,
} from "lucide-react";
import { getLocalTimeZone } from "@internationalized/date";
import type { DateRange } from "react-aria-components";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BasicModal from "@/components/smoothui/ui/BasicModal";
import { RangeCalendar } from "@/components/ui/calendar-rac";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const timeZone = getLocalTimeZone();
const rangeLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "select" | "range";
    filterPlaceholder?: string;
  }
}

export type FeedbackEntry = {
  id: string;
  receivedAt: string;
  feedback: string;
  rating: number;
};

const ratingBadgeStyle = (rating: number) => {
  const clampedRating = Math.max(0, Math.min(5, rating));
  const hue = (clampedRating / 5) * 120;

  return {
    backgroundColor: `hsla(${hue}, 100%, 92%, 1)`,
    color: `hsl(${hue}, 100%, 22%)`,
    borderColor: `hsla(${hue}, 100%, 70%, 0.6)`,
  } as const;
};

const columns: ColumnDef<FeedbackEntry>[] = [
  {
    header: "Date",
    accessorKey: "receivedAt",
    cell: ({ row }) => {
      const timestamp = row.getValue<string>("receivedAt");
      return (
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {dateFormatter.format(new Date(timestamp))}
        </span>
      );
    },
    filterFn: (row, columnId, value) => {
      const range = value as DateRange | undefined;
      if (!range || !range.start) {
        return true;
      }

      const { start, end } = range;
      const rowDate = new Date(row.getValue<string>(columnId));
      const startDate = start.toDate(timeZone);
      const endDate = (end ?? start).toDate(timeZone);
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);

      return rowDate >= startDate && rowDate <= endOfDay;
    },
    sortingFn: (a, b, columnId) => {
      const aValue = new Date(a.getValue<string>(columnId)).getTime();
      const bValue = new Date(b.getValue<string>(columnId)).getTime();
      return aValue === bValue ? 0 : aValue > bValue ? 1 : -1;
    },
    meta: {
      filterVariant: "range",
    },
  },
  {
    header: "Feedback",
    accessorKey: "feedback",
    cell: ({ row }) => (
      <p className="text-sm text-slate-700 dark:text-slate-200">{row.getValue("feedback")}</p>
    ),
    meta: {
      filterVariant: "text",
      filterPlaceholder: "Search feedback",
    },
  },
  {
    header: "Rating",
    accessorKey: "rating",
    cell: ({ row }) => {
      const rating = row.getValue<number>("rating");
      return (
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold"
            style={ratingBadgeStyle(rating)}
          >
            {rating.toFixed(1)}
          </span>
          <StarRating rating={rating} variant="compact" />
        </div>
      );
    },
    sortingFn: (a, b, columnId) => {
      const aValue = a.getValue<number>(columnId);
      const bValue = b.getValue<number>(columnId);
      return aValue === bValue ? 0 : aValue > bValue ? 1 : -1;
    },
    filterFn: (row, columnId, value) => {
      if (!value) {
        return true;
      }

      const rating = row.getValue<number>(columnId);
      return rating.toFixed(1) === value;
    },
    meta: {
      filterVariant: "select",
    },
  },
];

type RecentFeedbackTableProps = {
  feedback: FeedbackEntry[];
};

export function RecentFeedbackTable({ feedback }: RecentFeedbackTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "rating",
      desc: true,
    },
  ]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackEntry | null>(
    null,
  );

  const table = useReactTable({
    data: feedback,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <div className="w-full sm:w-52">
          <Filter column={table.getColumn("feedback")!} />
        </div>
        <div className="w-full sm:w-40">
          <Filter column={table.getColumn("rating")!} />
        </div>
        <div className="w-full sm:w-40">
          <Filter column={table.getColumn("receivedAt")!} />
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="relative h-10 border-t select-none"
                  aria-sort={
                    header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : "none"
                  }
                >
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <div
                      className={cn(
                        header.column.getCanSort() &&
                          "flex h-full cursor-pointer items-center justify-between gap-2 select-none",
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      onKeyDown={(event) => {
                        if (
                          header.column.getCanSort() &&
                          (event.key === "Enter" || event.key === " ")
                        ) {
                          event.preventDefault();
                          header.column.getToggleSortingHandler()?.(event);
                        }
                      }}
                      tabIndex={header.column.getCanSort() ? 0 : undefined}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: (
                          <ChevronUpIcon
                            className="shrink-0 opacity-60"
                            size={16}
                            aria-hidden="true"
                          />
                        ),
                        desc: (
                          <ChevronDownIcon
                            className="shrink-0 opacity-60"
                            size={16}
                            aria-hidden="true"
                          />
                        ),
                      }[header.column.getIsSorted() as string] ?? (
                        <span className="size-4" aria-hidden="true" />
                      )}
                    </div>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onDoubleClick={() => setSelectedFeedback(row.original)}
                className="cursor-zoom-in"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No feedback found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedFeedback ? (
        <FeedbackDetailModal
          entry={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      ) : null}
    </div>
  );
}

function Filter({ column }: { column: Column<FeedbackEntry, unknown> }) {
  const id = useId();
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, filterPlaceholder } = column.columnDef.meta ?? {};
  const columnHeader =
    typeof column.columnDef.header === "string" ? column.columnDef.header : "";

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isCalendarOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (
        calendarContainerRef.current &&
        !calendarContainerRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isCalendarOpen]);

  const sortedUniqueValues = useMemo(() => {
    if (filterVariant !== "select") {
      return [];
    }

    const values = Array.from(column.getFacetedUniqueValues().keys());
    const unique = new Set(
      values
        .map((value) => {
          const numericValue =
            typeof value === "number" ? value : Number(value ?? NaN);
          return Number.isFinite(numericValue)
            ? numericValue.toFixed(1)
            : undefined;
        })
        .filter((value): value is string => Boolean(value)),
    );

    return Array.from(unique).sort((a, b) => Number(a) - Number(b));
  }, [column, filterVariant]);

  if (filterVariant === "select") {
    return (
      <div className="space-y-2">
        <Label htmlFor={`${id}-select`}>{columnHeader}</Label>
        <Select
          value={
            typeof columnFilterValue === "string"
              ? columnFilterValue
              : "all"
          }
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : value);
          }}
        >
          <SelectTrigger id={`${id}-select`} className="dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-200">
            <SelectValue placeholder="All ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ratings</SelectItem>
            {sortedUniqueValues.map((value) => (
              <SelectItem key={value} value={value}>
                {value} ★
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (filterVariant === "range") {
    const dateRangeValue = (columnFilterValue ?? null) as DateRange | null;
    const hasSelection = Boolean(dateRangeValue?.start && dateRangeValue?.end);
    const label = formatDateRangeLabel(dateRangeValue);

    return (
      <div className="space-y-2" ref={calendarContainerRef}>
        <Label htmlFor={`${id}-date-trigger`}>{columnHeader}</Label>
        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id={`${id}-date-trigger`}
              onClick={() => setIsCalendarOpen((open) => !open)}
              className={cn(
                "inline-flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-left text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-100",
                hasSelection && "text-slate-900",
              )}
            >
              <span className="inline-flex items-center gap-2">
                <CalendarIcon className="size-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                {label}
              </span>
              <ChevronDownIcon className="size-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            </button>
            {hasSelection ? (
              <button
                type="button"
                onClick={() => {
                  column.setFilterValue(undefined);
                  setIsCalendarOpen(false);
                }}
                className="inline-flex items-center rounded-xl border border-transparent bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                Clear
              </button>
            ) : null}
          </div>
          {isCalendarOpen ? (
            <div className="absolute left-0 top-full z-50 mt-2 min-w-[18rem]">
              <div className="origin-top overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/95 p-3 shadow-xl dark:border-slate-700/70 dark:bg-slate-900/90 dark:shadow-slate-900/40">
                <RangeCalendar
                  value={dateRangeValue}
                  onChange={(value) => {
                    column.setFilterValue(value ?? undefined);
                    if (value?.start && value?.end) {
                      setIsCalendarOpen(false);
                    }
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-input`}>{columnHeader}</Label>
      <div className="relative">
        <Input
          id={`${id}-input`}
          className="peer ps-9 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-200"
          value={(columnFilterValue ?? "") as string}
          onChange={(event) => column.setFilterValue(event.target.value)}
          placeholder={
            filterPlaceholder ??
            (columnHeader ? `Search ${columnHeader.toLowerCase()}` : "Search")
          }
          type="text"
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 dark:text-slate-500">
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  );
}

const detailFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatDateRangeLabel(range: DateRange | null): string {
  if (!range?.start) {
    return "Select dates";
  }

  const startDate = range.start.toDate(timeZone);

  if (!range.end) {
    return `From ${rangeLabelFormatter.format(startDate)}`;
  }

  const endDate = range.end.toDate(timeZone);
  const sameDay = startDate.toDateString() === endDate.toDateString();

  if (sameDay) {
    return rangeLabelFormatter.format(startDate);
  }

  return `${rangeLabelFormatter.format(startDate)} – ${rangeLabelFormatter.format(
    endDate,
  )}`;
}


function FeedbackDetailModal({
  entry,
  onClose,
}: {
  entry: FeedbackEntry;
  onClose: () => void;
}) {
  const formattedDate = detailFormatter.format(new Date(entry.receivedAt));

  return (
    <BasicModal
      isOpen
      onClose={onClose}
      title="Guest feedback"
      size="lg"
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              Received on
            </p>
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {formattedDate}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="space-y-1 text-left sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                Rating
              </p>
              <div className="inline-flex items-center gap-3 rounded-full border border-amber-200/70 bg-amber-50/80 px-4 py-2 shadow-inner">
                <span className="text-3xl font-semibold text-amber-600">
                  {entry.rating.toFixed(1)}
                </span>
                <Star
                  className="size-6 text-amber-500 drop-shadow-sm"
                  aria-hidden="true"
                  fill="currentColor"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <StarRating rating={entry.rating} />
              <span>{entry.rating.toFixed(1)} of 5 stars</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-inner dark:border-slate-700/70 dark:bg-slate-900/70 dark:shadow-slate-900/40">
          <p className="text-base leading-relaxed text-slate-700 dark:text-slate-200">{entry.feedback}</p>
        </div>
      </div>
    </BasicModal>
  );
}

function StarRating({
  rating,
  variant = "default",
}: {
  rating: number;
  variant?: "default" | "compact";
}) {
  const fullStars = Math.floor(rating);
  const fractional = rating - fullStars;
  const hasPartial = fractional > 0 && fractional < 1;
  const iconSize = variant === "compact" ? "size-4" : "size-6";
  const emptyIconSize = variant === "compact" ? "size-4" : "size-6";
  const gapClass = variant === "compact" ? "gap-1.5" : "gap-2";
  const emptyColor = variant === "compact" ? "text-slate-300" : "text-slate-200";

  return (
    <div className={`flex items-center ${gapClass}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => {
        if (index < fullStars) {
          return (
            <Star
              key={index}
              className={`${iconSize} text-amber-400 drop-shadow-sm`}
              fill="currentColor"
            />
          );
        }

        if (index === fullStars && hasPartial) {
          const fillPercentage = Math.round(fractional * 100);
          return (
            <span key={index} className="relative inline-flex">
              <Star className={`${emptyIconSize} ${emptyColor}`} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star
                  className={`${iconSize} text-amber-400 drop-shadow-sm`}
                  fill="currentColor"
                />
              </span>
            </span>
          );
        }

        return <Star key={index} className={`${emptyIconSize} ${emptyColor}`} />;
      })}
    </div>
  );
}

