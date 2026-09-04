import { useState, useMemo, Fragment } from "react";
import useLanguage from "../hooks/useLanguage";
import translations from "../data/translations";
import academyData from "../data/academy.json";
import StatCard from "./ui/StatCard";
import StatsBanner from "./ui/StatsBanner";
import EmptyState from "./ui/EmptyState";

const ITEMS_PER_PAGE = 20;

function ProgressBar({ value, label }) {
  const color =
    value === 100 ? "bg-success" : value > 0 ? "bg-primary" : "bg-surface2";
  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="flex-1 h-1.5 rounded-full bg-surface2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span
        className="text-xs text-secondary w-8 text-right shrink-0"
        aria-hidden="true"
      >
        {value}%
      </span>
    </div>
  );
}

function SortIcon({ sortKey, col, sortDir }) {
  if (sortKey !== col)
    return <span className="ml-1 text-secondary opacity-40">↕</span>;
  return (
    <span className="ml-1 text-primary">{sortDir === "asc" ? "↑" : "↓"}</span>
  );
}

function HTBAcademy() {
  const { lang } = useLanguage();
  const t = translations[lang].academy;
  const { statistics, modules } = academyData;

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const statusList = ["All", "Completed", "In Progress", "Not Started"];
  const statusLabels = {
    All: t.all,
    Completed: t.completedFilter,
    "In Progress": t.inProgress,
    "Not Started": t.notStarted,
  };

  function handleSort(key) {
    if (sortKey === key)
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function toggleCatFilter(cat) {
    setFilterCat((prev) => (prev === cat ? "All" : cat));
    setPage(1);
  }

  const filtered = useMemo(
    () =>
      modules.filter((m) => {
        const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === "All" || m.category === filterCat;
        const matchStatus =
          filterStatus === "All"
            ? true
            : filterStatus === "Completed"
              ? m.progress === 100
              : filterStatus === "In Progress"
                ? m.progress > 0 && m.progress < 100
                : filterStatus === "Not Started"
                  ? m.progress === 0
                  : true;
        return matchSearch && matchCat && matchStatus;
      }),
    [modules, filterStatus, filterCat, search],
  );

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey],
        bv = b[sortKey];
      if (typeof av === "string")
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const hasData = modules.length > 0;
  const hasResults = filtered.length > 0;

  const bannerItems = [
    { label: t.totalModules, value: statistics.total_modules, accent: false },
    { label: t.completed, value: statistics.completed, accent: false },
    {
      label: "%",
      value: `${statistics.completion_percentage}%`,
      accent: false,
    },
  ];
  const bannerChips = Object.entries(statistics.by_category).map(
    ([cat, data]) => ({
      label: cat,
      value: `${data.completed}/${data.total}`,
      id: cat,
    }),
  );

  const paginationBtn =
    "px-3 py-1.5 rounded bg-surface2 text-secondary text-sm transition-colors cursor-pointer hover:text-light disabled:opacity-30 disabled:cursor-not-allowed";
  const selectClass =
    "cursor-pointer px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-secondary focus:outline-none focus:border-primary text-sm";
  const thClass =
    "px-4 py-3 text-left cursor-pointer hover:text-light select-none";

  const Pagination = () =>
    totalPages > 1 ? (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={paginationBtn}
        >
          {t.prev}
        </button>
        <span className="text-secondary text-sm">
          <span className="text-light font-medium">{page}</span> / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={paginationBtn}
        >
          {t.next}
        </button>
      </div>
    ) : null;

  return (
    <section id="academy" className="flex flex-col gap-6 scroll-mt-20">
      <div className="border-l-4 border-primary pl-4">
        <h2 className="text-2xl font-bold text-light">
          HackTheBox <span className="text-primary">Academy</span>
        </h2>
        <p className="text-secondary text-sm mt-1">
          {t.subtitle}:{" "}
          {new Date(academyData.last_updated).toLocaleDateString(
            lang === "es" ? "es-AR" : "en-US",
          )}
        </p>
      </div>

      {!hasData ? (
        <EmptyState message={t.noData} />
      ) : (
        <>
          <StatsBanner
            items={bannerItems}
            chips={bannerChips}
            activeChip={filterCat !== "All" ? filterCat : null}
            onChipClick={toggleCatFilter}
          />

          <div className="hidden md:flex flex-wrap gap-3">
            <StatCard
              label={t.totalModules}
              value={statistics.total_modules}
              colorClass="border-surface2"
            />
            <StatCard
              label={t.completed}
              value={statistics.completed}
              sub={t.completedSub(statistics.completion_percentage)}
              colorClass="border-surface2"
            />
          </div>

          {/* Category cards — clickable filters */}
          <div className="hidden md:flex flex-wrap gap-3">
            {Object.entries(statistics.by_category).map(([cat, data]) => (
              <div
                key={cat}
                onClick={() => toggleCatFilter(cat)}
                className={`flex flex-col px-4 py-3 rounded-lg border min-w-[160px] gap-3 cursor-pointer transition-colors
                  ${
                    filterCat === cat
                      ? "bg-primary/10 border-primary/70"
                      : "bg-surface2 border-surface2 hover:border-primary/40"
                  }`}
              >
                <div className="flex flex-col gap-1">
                  <span
                    className={`text-xs font-semibold ${filterCat === cat ? "text-primary" : "text-light"}`}
                  >
                    {cat}
                  </span>
                  <span className="text-xs text-secondary">
                    {data.completed} / {data.total} {t.modules}
                  </span>
                </div>
                <ProgressBar
                  value={data.percentage}
                  label={`${cat}: ${data.percentage}%`}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-light placeholder-secondary focus:outline-none focus:border-primary text-sm"
            />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              {statusList.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </div>
          <p className="text-secondary text-sm">
            {filtered.length} {t.found}
          </p>

          {!hasResults ? (
            <EmptyState message={t.noResults} />
          ) : (
            <>
              {/* Cards mobile */}
              <div className="flex flex-col gap-2 md:hidden">
                {paginated.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col gap-2 p-3 rounded-lg bg-surface border border-surface2"
                  >
                    <button
                      onClick={() =>
                        setExpanded((prev) => (prev === m.id ? null : m.id))
                      }
                      className="cursor-pointer flex items-center justify-between gap-2 w-full text-left"
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-light font-medium text-sm">
                          {m.name}
                        </span>
                        {m.category && (
                          <span className="text-secondary text-xs">
                            {m.category}
                          </span>
                        )}
                      </div>
                      <span
                        className="text-secondary text-xs shrink-0"
                        aria-hidden="true"
                      >
                        {expanded === m.id ? "▲" : "▼"}
                      </span>
                    </button>
                    <ProgressBar
                      value={m.progress}
                      label={`${m.name}: ${m.progress}%`}
                    />
                    {expanded === m.id && m.description && (
                      <p className="text-secondary text-xs leading-relaxed pt-1 border-t border-surface2">
                        {m.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Tabla desktop */}
              <div className="hidden md:block overflow-x-auto rounded-lg border border-surface2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface2 text-secondary uppercase text-xs tracking-wider">
                      <th
                        className={thClass}
                        onClick={() => handleSort("name")}
                      >
                        {t.module}
                        <SortIcon
                          sortKey={sortKey}
                          col="name"
                          sortDir={sortDir}
                        />
                      </th>
                      <th
                        className={thClass}
                        onClick={() => handleSort("category")}
                      >
                        {t.category}
                        <SortIcon
                          sortKey={sortKey}
                          col="category"
                          sortDir={sortDir}
                        />
                      </th>
                      <th
                        className={thClass}
                        onClick={() => handleSort("progress")}
                      >
                        {t.progress}
                        <SortIcon
                          sortKey={sortKey}
                          col="progress"
                          sortDir={sortDir}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((m, i) => (
                      <Fragment key={m.id}>
                        <tr
                          onClick={() =>
                            setExpanded((prev) => (prev === m.id ? null : m.id))
                          }
                          className={`cursor-pointer border-t border-surface2 hover:bg-surface2/50 transition-colors ${i % 2 === 0 ? "" : "bg-surface/30"}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-light font-medium">
                                {m.name}
                              </span>
                              <span
                                className="text-secondary text-xs"
                                aria-hidden="true"
                              >
                                {expanded === m.id ? "▲" : "▼"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-secondary text-xs">
                            {m.category ?? "—"}
                          </td>
                          <td className="px-4 py-3 w-48">
                            <ProgressBar
                              value={m.progress}
                              label={`${m.name}: ${m.progress}%`}
                            />
                          </td>
                        </tr>
                        {expanded === m.id && (
                          <tr
                            className={`border-t border-surface2 ${i % 2 === 0 ? "" : "bg-surface/30"}`}
                          >
                            <td
                              colSpan={3}
                              className="px-4 py-3 text-secondary text-sm leading-relaxed bg-surface2/30"
                            >
                              {m.description}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination />
            </>
          )}
        </>
      )}
    </section>
  );
}

export default HTBAcademy;
