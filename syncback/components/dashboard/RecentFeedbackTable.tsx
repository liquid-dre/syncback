"use client";

import { useEffect, useId, useMemo, useState } from "react";
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
  SearchIcon,
  Star,
  XIcon,
} from "lucide-react";

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

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
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

const columns: ColumnDef<FeedbackEntry>[] = [
  {
    header: "Date",
    accessorKey: "receivedAt",
    cell: ({ row }) => {
      const timestamp = row.getValue<string>("receivedAt");
      return (
        <span className="text-sm text-slate-600">
          {dateFormatter.format(new Date(timestamp))}
        </span>
      );
    },
    sortingFn: (a, b, columnId) => {
      const aValue = new Date(a.getValue<string>(columnId)).getTime();
      const bValue = new Date(b.getValue<string>(columnId)).getTime();
      return aValue === bValue ? 0 : aValue > bValue ? 1 : -1;
    },
    meta: {
      filterVariant: "text",
      filterPlaceholder: "Search date",
    },
  },
  {
    header: "Feedback",
    accessorKey: "feedback",
    cell: ({ row }) => (
      <p className="text-sm text-slate-700">{row.getValue("feedback")}</p>
    ),
    meta: {
      filterVariant: "text",
      filterPlaceholder: "Search feedback",
    },
  },
  {
    header: "Rating",
    accessorKey: "rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
        <span>{row.getValue<number>("rating").toFixed(1)}</span>
        <span className="text-amber-500" aria-hidden="true">
          ★
        </span>
      </div>
    ),
    sortingFn: "alphanumeric",
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
      id: "receivedAt",
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
      <p className="text-center text-sm text-muted-foreground">
        Data table with filters made with {" "}
        <a
          className="underline transition-colors hover:text-foreground"
          href="https://tanstack.com/table"
          target="_blank"
          rel="noopener noreferrer"
        >
          TanStack Table
        </a>
        .
      </p>
      {selectedFeedback ? (
        <FeedbackDetailOverlay
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

  const sortedUniqueValues = useMemo(() => {
    if (filterVariant !== "select") {
      return [];
    }

    const values = Array.from(column.getFacetedUniqueValues().keys());
    return Array.from(new Set(values.map((value) => value?.toString() ?? ""))).sort(
      (a, b) => Number(a) - Number(b),
    );
  }, [column, filterVariant]);

  if (filterVariant === "select") {
    return (
      <div className="space-y-2">
        <Label htmlFor={`${id}-select`}>{columnHeader}</Label>
        <Select
          value={columnFilterValue?.toString() ?? "all"}
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : Number(value));
          }}
        >
          <SelectTrigger id={`${id}-select`}>
            <SelectValue placeholder="All" />
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
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-input`}>{columnHeader}</Label>
      <div className="relative">
        <Input
          id={`${id}-input`}
          className="peer ps-9"
          value={(columnFilterValue ?? "") as string}
          onChange={(event) => column.setFilterValue(event.target.value)}
          placeholder={
            filterPlaceholder ??
            (columnHeader ? `Search ${columnHeader.toLowerCase()}` : "Search")
          }
          type="text"
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
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

function FeedbackDetailOverlay({
  entry,
  onClose,
}: {
  entry: FeedbackEntry;
  onClose: () => void;
}) {
  useEffect(() => {
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
  }, [onClose]);

  const formattedDate = detailFormatter.format(new Date(entry.receivedAt));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-12">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-detail-heading"
        className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/40 bg-gradient-to-br from-white/95 via-white to-slate-100 p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Close feedback detail"
        >
          <XIcon className="size-4" />
        </button>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Received
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900" id="feedback-detail-heading">
                {formattedDate}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Rating
              </span>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-4 py-2">
                <span className="text-2xl font-semibold text-amber-600">
                  {entry.rating.toFixed(1)}
                </span>
                <Star className="size-5 text-amber-500" aria-hidden="true" fill="currentColor" />
              </div>
            </div>
          </div>

          <p className="text-balance text-xl leading-relaxed text-slate-700">
            {entry.feedback}
          </p>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Guest sentiment visualised
            </p>
            <div className="flex items-center gap-3">
              <StarRating rating={entry.rating} />
              <span className="text-sm font-medium text-slate-500">
                {entry.rating.toFixed(1)} of 5 stars
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const fractional = rating - fullStars;
  const hasPartial = fractional > 0 && fractional < 1;

  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => {
        if (index < fullStars) {
          return (
            <Star
              key={index}
              className="size-7 text-amber-400"
              fill="currentColor"
            />
          );
        }

        if (index === fullStars && hasPartial) {
          const fillPercentage = Math.round(fractional * 100);
          return (
            <span key={index} className="relative inline-flex">
              <Star className="size-7 text-slate-200" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star className="size-7 text-amber-400" fill="currentColor" />
              </span>
            </span>
          );
        }

        return <Star key={index} className="size-7 text-slate-200" />;
      })}
    </div>
  );
}
