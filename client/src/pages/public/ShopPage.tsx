// src/pages/public/ShopPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useFilter } from "@/hooks";
import {
  setCategory,
  setSortBy,
  setSearchQuery,
  setRating,
  resetFilters,
} from "@/redux/filterSlice";
import type { FilterState } from "@/types";
import { useGetBooksQuery } from "@/services/booksApi";
import BookCard from "@/components/ui/BookCard";
import { categories } from "@/data/books";

const PAGE_SIZE = 12;

/* ─────────────────────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────────────────────── */

/** SVG star row used in rating filter */
const Stars = ({ count }: { count: number }) => (
  <span className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 16 16"
        className={`w-3.5 h-3.5 ${
          i < count
            ? "fill-amber-400 text-amber-400"
            : "fill-[var(--border)] text-[var(--border)]"
        }`}
      >
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
      </svg>
    ))}
  </span>
);

/** Animated skeleton placeholder card */
const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)]">
    <div className="aspect-[3/4] bg-[var(--bg-tertiary)] animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-3.5 rounded-full bg-[var(--bg-tertiary)] animate-pulse w-4/5" />
      <div className="h-3   rounded-full bg-[var(--bg-tertiary)] animate-pulse w-3/5" />
      <div className="h-3   rounded-full bg-[var(--bg-tertiary)] animate-pulse w-1/4 mt-3" />
    </div>
  </div>
);

/** Red error banner — shows the backend `detail` message */
const ErrorBanner = ({
  onRetry,
  message,
}: {
  onRetry: () => void;
  message?: string;
}) => (
  <div
    role="alert"
    aria-live="assertive"
    className="rounded-2xl border border-red-300/40 bg-red-500/[0.07] px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <span className="shrink-0 w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center text-red-500">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          Failed to load books
        </p>
        <p className="text-xs text-red-500/80 mt-0.5 break-words">
          {message ??
            "Something went wrong while fetching the catalogue. Check your connection and try again."}
        </p>
      </div>
    </div>
    <button
      onClick={onRetry}
      className="shrink-0 text-xs font-semibold px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 active:scale-[0.97] text-white transition-all duration-150"
    >
      Try again
    </button>
  </div>
);

/** Empty state — no results for the current filters */
const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-3xl select-none">
      📭
    </div>
    <div>
      <p className="text-lg font-semibold text-[var(--text-primary)]">No books found</p>
      <p className="text-sm text-[var(--text-muted)] mt-1 max-w-xs">
        No titles match your current filters. Try broadening your search or clearing all
        filters.
      </p>
    </div>
    <button
      onClick={onReset}
      className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-[var(--accent)] text-white hover:opacity-90 active:scale-[0.97] transition-all duration-150"
    >
      Clear all filters
    </button>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Pagination
───────────────────────────────────────────────────────────────────────────── */
interface PaginationProps {
  currentPage:  number;
  totalPages:   number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  /**
   * Build the visible page array.
   * Always includes: 1, last, current ± 1 neighbour.
   * Gaps between non-contiguous runs are represented as `null`.
   */
  const getPages = (): (number | null)[] => {
    const delta = 1;
    const inner: number[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      inner.push(i);
    }

    const result: (number | null)[] = [];

    // Leading section
    if (inner[0] > 2) result.push(1, null);
    else              result.push(1);

    result.push(...inner);

    // Trailing section
    const last = inner[inner.length - 1];
    if (last < totalPages - 1) result.push(null, totalPages);
    else                       result.push(totalPages);

    return result;
  };

  const pages = getPages();

  const base     = "min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center select-none";
  const active   = "bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent)]/30 scale-105";
  const inactive = "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]";
  const disabled = "text-[var(--text-muted)] opacity-40 cursor-not-allowed";

  const Chevron = ({ dir }: { dir: "prev" | "next" }) => (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className="w-3.5 h-3.5"
      style={dir === "next" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z" />
    </svg>
  );

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 mt-10 flex-wrap"
    >
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${base} gap-1 pr-3 ${currentPage === 1 ? disabled : inactive}`}
      >
        <Chevron dir="prev" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === null ? (
          <span
            key={`gap-${idx}`}
            aria-hidden="true"
            className="min-w-[36px] h-9 flex items-center justify-center text-[var(--text-muted)] text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`${base} ${page === currentPage ? active : inactive}`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${base} gap-1 pl-3 ${currentPage === totalPages ? disabled : inactive}`}
      >
        <span className="hidden sm:inline">Next</span>
        <Chevron dir="next" />
      </button>
    </nav>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   ShopPage
───────────────────────────────────────────────────────────────────────────── */
const ShopPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter   = useFilter();

  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter.category, filter.rating, filter.sortBy, filter.searchQuery]);

  // Close mobile drawer when viewport reaches lg breakpoint
  useEffect(() => {
    const mq      = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setSidebarOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(filter.searchQuery);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filter.searchQuery), 300);
    return () => clearTimeout(t);
  }, [filter.searchQuery]);

  const { data, isLoading, isError, error, refetch } = useGetBooksQuery({
    search:     debouncedSearch || undefined,
    category:   filter.category !== "All" ? filter.category : undefined,
    min_rating: filter.rating > 0 ? filter.rating : undefined,
    sort_by:
      filter.sortBy === "price-asc" || filter.sortBy === "price-desc"
        ? "price"
        : filter.sortBy === "rating"
        ? "rating"
        : filter.sortBy === "newest"
        ? "year"
        : undefined,
    order: filter.sortBy === "price-desc" ? "desc" : "asc",
    page:  currentPage,
    limit: PAGE_SIZE,
  });

  const totalPages = data?.total ? Math.ceil(data.total / PAGE_SIZE) : 1;

  const sortOptions: { label: string; value: FilterState["sortBy"] }[] = [
    { label: "Relevance",         value: "relevance"  },
    { label: "Price: Low → High", value: "price-asc"  },
    { label: "Price: High → Low", value: "price-desc" },
    { label: "Top Rated",         value: "rating"     },
    { label: "Newest",            value: "newest"     },
  ];

  const handleCategoryClick = useCallback(
    (cat: string) => dispatch(setCategory(cat)),
    [dispatch]
  );
  const handleRatingClick = useCallback(
    (r: number) => dispatch(setRating(r)),
    [dispatch]
  );

  // Extract backend error detail from RTK Query FetchBaseQueryError
  const errorDetail: string | undefined =
    error && "data" in error
      ? (error.data as { detail?: string })?.detail
      : undefined;

  // "No books found" from backend → friendly empty state, not red banner
  const isNotFound =
    errorDetail?.toLowerCase().includes("no books found") ?? false;

  const hasActiveFilters =
    filter.category !== "All" ||
    filter.rating > 0 ||
    filter.searchQuery.trim() !== "" ||
    filter.sortBy !== "relevance";

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Active filter chips ─────────────────────────────────────────── */
  const ActiveFilterChips = () => {
    const chips: { label: string; onRemove: () => void }[] = [];
    if (filter.category !== "All")
      chips.push({ label: filter.category, onRemove: () => dispatch(setCategory("All")) });
    if (filter.rating > 0)
      chips.push({ label: `★ ${filter.rating}+`, onRemove: () => dispatch(setRating(0)) });
    if (filter.searchQuery.trim())
      chips.push({
        label: `"${filter.searchQuery}"`,
        onRemove: () => dispatch(setSearchQuery("")),
      });

    if (!chips.length) return null;

    return (
      <div className="flex flex-wrap items-center gap-2 mt-4" role="list" aria-label="Active filters">
        <span className="text-xs text-[var(--text-muted)] font-medium">Active:</span>
        {chips.map((chip) => (
          <span
            key={chip.label}
            role="listitem"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
          >
            {chip.label}
            <button
              onClick={chip.onRemove}
              aria-label={`Remove filter: ${chip.label}`}
              className="hover:opacity-70 transition-opacity leading-none"
            >
              ✕
            </button>
          </span>
        ))}
        <button
          onClick={() => dispatch(resetFilters())}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-2 transition-colors"
        >
          Clear all
        </button>
      </div>
    );
  };

  /* ── Sidebar filter panel (shared desktop + mobile drawer) ───────── */
  const FiltersContent = () => (
    <div className="space-y-8 text-sm">

      {/* Categories */}
      <section aria-labelledby="filter-categories">
        <h3
          id="filter-categories"
          className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3"
        >
          Categories
        </h3>
        <div className="space-y-0.5" role="list">
          {categories.map((cat) => {
            const isActive = filter.category === cat;
            return (
              <button
                key={cat}
                role="listitem"
                onClick={() => handleCategoryClick(cat)}
                aria-pressed={isActive}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-150 flex items-center justify-between
                  ${isActive
                    ? "bg-[var(--accent)]/12 text-[var(--accent)] font-semibold ring-1 ring-[var(--accent)]/25"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                  }`}
              >
                <span className="truncate">{cat}</span>
                {cat === "All" && (
                  <span className="text-[10px] tabular-nums opacity-50 font-mono shrink-0 ml-2">
                    {data?.total ?? 0}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <hr className="border-[var(--border)]" />

      {/* Minimum Rating */}
      <section aria-labelledby="filter-rating">
        <h3
          id="filter-rating"
          className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3"
        >
          Minimum Rating
        </h3>
        <div className="space-y-0.5" role="list">
          {([0, 4, 4.5, 4.7] as const).map((r) => {
            const isActive = filter.rating === r;
            return (
              <button
                key={r}
                role="listitem"
                onClick={() => handleRatingClick(r)}
                aria-pressed={isActive}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-2.5
                  ${isActive
                    ? "bg-[var(--accent)]/12 text-[var(--accent)] font-semibold ring-1 ring-[var(--accent)]/25"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  }`}
              >
                {r === 0 ? (
                  <span>Any Rating</span>
                ) : (
                  <>
                    <Stars count={Math.floor(r)} />
                    <span>{r}+</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <hr className="border-[var(--border)]" />

      {/* Clear all */}
      <button
        onClick={() => dispatch(resetFilters())}
        disabled={!hasActiveFilters}
        className="w-full text-center text-xs font-semibold py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Clear All Filters
      </button>
    </div>
  );

  /* ────────────────────────────── render ──────────────────────────── */
  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <header className="mb-10">
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--text-primary)] leading-tight">
            {filter.category === "All" ? "Discover Books" : filter.category}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--text-muted)]">
            {isLoading ? (
              <span className="inline-block w-28 h-3.5 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
            ) : (
              <>
                <span className="font-semibold text-[var(--text-secondary)]">
                  {data?.total ?? 0}
                </span>{" "}
                books found
                {filter.searchQuery && (
                  <> for <span className="italic">"{filter.searchQuery}"</span></>
                )}
              </>
            )}
          </p>
          <ActiveFilterChips />
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-14">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 xl:w-64 flex-shrink-0" aria-label="Book filters">
            <div className="sticky top-28">
              <FiltersContent />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-7">

              {/* Mobile filter toggle */}
              <button
                className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all active:scale-[0.97]"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open filters"
                aria-expanded={sidebarOpen}
                aria-controls="mobile-filter-drawer"
              >
                <svg
                  viewBox="0 0 20 20" fill="none" stroke="currentColor"
                  strokeWidth={1.6} className="w-4 h-4 shrink-0"
                >
                  <path strokeLinecap="round" d="M3 5h14M6 10h8M9 15h2" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                )}
              </button>

              {/* Search */}
              <label className="flex-1 relative min-w-0">
                <span className="sr-only">Search books</span>
                <svg
                  viewBox="0 0 20 20" fill="none" stroke="currentColor"
                  strokeWidth={1.6}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none"
                >
                  <circle cx="8.5" cy="8.5" r="5.25" />
                  <path strokeLinecap="round" d="M15.25 15.25 12.5 12.5" />
                </svg>
                <input
                  type="search"
                  value={filter.searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  placeholder="Search by title, author…"
                  aria-label="Search books"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-sm placeholder-[var(--text-muted)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                />
              </label>

              {/* Sort */}
              <div className="relative shrink-0">
                <label className="sr-only" htmlFor="sort-select">Sort by</label>
                <select
                  id="sort-select"
                  value={filter.sortBy}
                  onChange={(e) =>
                    dispatch(setSortBy(e.target.value as FilterState["sortBy"]))
                  }
                  className="appearance-none w-full sm:w-auto pr-9 pl-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 cursor-pointer transition-all"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <svg
                  viewBox="0 0 16 16" fill="currentColor"
                  className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                >
                  <path d="M4.47 6.22a.75.75 0 0 1 1.06 0L8 8.69l2.47-2.47a.75.75 0 1 1 1.06 1.06L8.53 10.28a.75.75 0 0 1-1.06 0L4.47 7.28a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div
                role="status"
                aria-label="Loading books"
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6"
              >
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
                <span className="sr-only">Loading…</span>
              </div>

            ) : isError && isNotFound ? (
              <EmptyState onReset={() => dispatch(resetFilters())} />

            ) : isError ? (
              <ErrorBanner onRetry={refetch} message={errorDetail} />

            ) : !data?.data?.length ? (
              <EmptyState onReset={() => dispatch(resetFilters())} />

            ) : (
              <>
                {/* Grid */}
                <div
                  role="list"
                  aria-label="Book results"
                  className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 lg:gap-6"
                >
                  {data.data.map((book) => (
                    <div key={book.id} role="listitem">
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>

                {/* Showing X–Y of Z */}
                <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
                  Showing{" "}
                  <span className="font-semibold text-[var(--text-secondary)]">
                    {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(currentPage * PAGE_SIZE, data.total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[var(--text-secondary)]">
                    {data.total}
                  </span>{" "}
                  books
                  {filter.category !== "All" && ` in ${filter.category}`}
                </p>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        id="mobile-filter-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Book filters"
        aria-hidden={!sidebarOpen}
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* Panel */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-[min(320px,90vw)] bg-[var(--bg-primary)] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Filters</h2>
              {hasActiveFilters && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
                  Active
                </span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close filters"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.749.749 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.749.749 0 1 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            <FiltersContent />
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-[var(--border)] shrink-0">
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-full py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
            >
              {data?.total != null
                ? `Show ${data.total} result${data.total !== 1 ? "s" : ""}`
                : "Apply Filters"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;