import { ArrowUpDown, Grid, List } from "lucide-react";
import type { SortOption } from "@/hooks/useProductFilters";

type ViewToggleProps = {
  viewMode: "grid" | "list";
  onChange: (mode: "grid" | "list") => void;
};

export function ProductViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="flex overflow-hidden rounded-md border bg-white">
      <button
        onClick={() => onChange("grid")}
        className={`p-1.5 transition ${viewMode === "grid" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
        aria-label="Grid view"
      >
        <Grid className="size-4" />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`p-1.5 transition ${viewMode === "list" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
        aria-label="List view"
      >
        <List className="size-4" />
      </button>
    </div>
  );
}

type SortSelectProps = {
  value: string;
  onChange: (v: SortOption) => void;
  options?: { value: SortOption; label: string }[];
};

const DEFAULT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "reviews", label: "Most Reviewed" },
];

export function ProductSortSelect({ value, onChange, options = DEFAULT_OPTIONS }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <ArrowUpDown className="size-4 text-slate-400" />
      <span className="hidden text-muted-foreground sm:inline">Sort:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="cursor-pointer border-0 bg-transparent text-sm font-medium text-slate-700 outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
