import { useState, useMemo } from "react";
import useLanguage from "../hooks/useLanguage";
import translations from "../data/translations";
import sherlocksData from "../data/sherlocks.json";
import writeupsData from "../data/writeups.json";
import StatCard from "./ui/StatCard";
import StatsBanner from "./ui/StatsBanner";
import EmptyState from "./ui/EmptyState";

const difficultyColor = {
  "Very Easy": "text-[#9b00ff] border-[#9b00ff]/40 bg-[#9b00ff]/10",
  Easy: "text-[#85c341] border-[#85c341]/40 bg-[#85c341]/10",
  Medium: "text-[#ffa62b] border-[#ffa62b]/40 bg-[#ffa62b]/10",
  Hard: "text-[#ff0000] border-[#ff0000]/40 bg-[#ff0000]/10",
  Insane: "text-[#c0c0c0] border-[#c0c0c0]/40 bg-[#c0c0c0]/10",
};

const ITEMS_PER_PAGE = 20;
const paginationBtn =
  "px-3 py-1.5 rounded bg-surface2 text-secondary text-sm transition-colors cursor-pointer hover:text-light disabled:opacity-30 disabled:cursor-not-allowed";
const selectClass =
  "cursor-pointer px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-secondary focus:outline-none focus:border-primary text-sm";

function SortIcon({ sortKey, col, sortDir }) {
  if (sortKey !== col)
    return <span className="ml-1 text-secondary opacity-40">↕</span>;
  return (
    <span className="ml-1 text-primary">{sortDir === "asc" ? "↑" : "↓"}</span>
  );
}

function ProgressBar({ value }) {
  const color =
    value === 100 ? "bg-success" : value > 0 ? "bg-primary" : "bg-surface2";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-surface2 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-secondary w-8 text-right shrink-0">
        {value}%
      </span>
    </div>
  );
}

function WriteupLink({ url, label }) {
  if (!url) return <span className="text-secondary text-xs">—</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
    >
      {label}
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}

function HTBSherlocks() {
  const { lang } = useLanguage();
  const t = translations[lang].sherlocks;
  const { statistics, sherlocks } = sherlocksData;

  const [filterDiff, setFilterDiff] = useState("All");
  const [filterCat, setFilterCat] = useState("All");
  const [filterOwned, setFilterOwned] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const diffList = ["All", "Very Easy", "Easy", "Medium", "Hard", "Insane"];
  const catList = ["All", ...Object.keys(statistics.by_category).sort()];

  function handleSort(key) {
    if (sortKey === key)
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function toggleDiffFilter(diff) {
    setFilterDiff((prev) => (prev === diff ? "All" : diff));
    setPage(1);
  }

  function handleFilterChange(setter) {
    return (val) => {
      setter(val);
      setPage(1);
    };
  }

  const filtered = useMemo(
    () =>
      sherlocks.filter((s) => {
        const matchDiff = filterDiff === "All" || s.difficulty === filterDiff;
        const matchCat = filterCat === "All" || s.category === filterCat;
        const matchOwned =
          filterOwned === "All" ||
          (filterOwned === "owned" ? s.is_owned : !s.is_owned);
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
        return matchDiff && matchCat && matchOwned && matchSearch;
      }),
    [sherlocks, filterDiff, filterCat, filterOwned, search],
  );

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      let av = a[sortKey],
        bv = b[sortKey];
      if (sortKey === "writeup") {
        av = writeupsData.sherlocks?.[String(a.id)]?.writeup ?? "";
        bv = writeupsData.sherlocks?.[String(b.id)]?.writeup ?? "";
      }
      if (typeof av === "boolean") av = av ? 1 : 0;
      if (typeof bv === "boolean") bv = bv ? 1 : 0;
      if (typeof av === "string" && typeof bv === "string")
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? (av ?? 0) - (bv ?? 0) : (bv ?? 0) - (av ?? 0);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const hasData = sherlocks.length > 0;
  const hasResults = filtered.length > 0;

  const bannerItems = [
    { label: t.total, value: statistics.total, accent: false },
    { label: t.owned, value: statistics.owned, accent: false },
  ];
  const bannerChips = ["Very Easy", "Easy", "Medium", "Hard", "Insane"]
    .filter((d) => statistics.by_difficulty[d] != null)
    .map((d) => ({
      label: d,
      value: statistics.by_difficulty[d],
      id: `diff:${d}`,
    }));

  const activeChip = filterDiff !== "All" ? `diff:${filterDiff}` : null;

  function handleBannerChip(id) {
    if (id.startsWith("diff:")) toggleDiffFilter(id.replace("diff:", ""));
  }

  const thClass =
    "px-4 py-3 text-left cursor-pointer hover:text-light select-none";
  const thClassCenter =
    "px-4 py-3 text-center cursor-pointer hover:text-light select-none";

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
    <section id="sherlocks" className="flex flex-col gap-6 scroll-mt-20">
      <div className="border-l-4 border-primary pl-4">
        <h2 className="text-2xl font-bold text-light">
          HackTheBox <span className="text-primary">Sherlocks</span>
        </h2>
        {statistics.total > 0 && (
          <p className="text-secondary text-sm mt-1">
            {t.subtitle}:{" "}
            {new Date(sherlocksData.last_updated).toLocaleDateString(
              lang === "es" ? "es-AR" : "en-US",
            )}
          </p>
        )}
      </div>

      {!hasData ? (
        <EmptyState message={t.noData} />
      ) : (
        <>
          <StatsBanner
            items={bannerItems}
            chips={bannerChips}
            activeChip={activeChip}
            onChipClick={handleBannerChip}
          />

          <div className="hidden md:flex flex-wrap gap-3">
            <StatCard
              label={t.total}
              value={statistics.total}
              colorClass="border-surface2"
            />
            <StatCard
              label={t.owned}
              value={statistics.owned}
              colorClass="border-surface2"
            />
            {["Very Easy", "Easy", "Medium", "Hard", "Insane"]
              .filter((d) => statistics.by_difficulty[d] != null)
              .map((d) => (
                <StatCard
                  key={d}
                  label={d}
                  value={statistics.by_difficulty[d]}
                  colorClass="border-surface2"
                  active={filterDiff === d}
                  onClick={() => toggleDiffFilter(d)}
                />
              ))}
          </div>
          <div className="hidden md:flex flex-wrap gap-2">
            {Object.entries(statistics.by_category)
              .sort()
              .map(([cat, count]) => (
                <span
                  key={cat}
                  onClick={() =>
                    setFilterCat((prev) => (prev === cat ? "All" : cat))
                  }
                  className={`cursor-pointer px-3 py-1 rounded-full text-xs border transition-colors
                  ${
                    filterCat === cat
                      ? "border-primary/70 bg-primary/10 text-primary"
                      : "bg-surface2 text-secondary border-surface2 hover:border-primary/40"
                  }`}
                >
                  {cat}: <span className="text-light font-medium">{count}</span>
                </span>
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
              value={filterDiff}
              onChange={(e) =>
                handleFilterChange(setFilterDiff)(e.target.value)
              }
              className={selectClass}
            >
              {diffList.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? t.allDiff : d}
                </option>
              ))}
            </select>
            <select
              value={filterCat}
              onChange={(e) => handleFilterChange(setFilterCat)(e.target.value)}
              className={selectClass}
            >
              {catList.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? t.allCat : c}
                </option>
              ))}
            </select>
            <select
              value={filterOwned}
              onChange={(e) =>
                handleFilterChange(setFilterOwned)(e.target.value)
              }
              className={selectClass}
            >
              <option value="All">{t.allOwned}</option>
              <option value="owned">{t.ownedFilter}</option>
              <option value="not_owned">{t.notOwnedFilter}</option>
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
                {paginated.map((s) => {
                  const writeup =
                    writeupsData.sherlocks?.[String(s.id)]?.writeup ?? null;
                  return (
                    <div
                      key={s.id}
                      className="flex flex-col gap-2 p-3 rounded-lg bg-surface border border-surface2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-light font-medium text-sm truncate">
                            {s.name}
                          </span>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-secondary text-xs">
                              {s.category}
                            </span>
                            {writeup && (
                              <WriteupLink url={writeup} label="Writeup" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded border text-xs font-medium ${difficultyColor[s.difficulty] ?? "text-secondary border-surface2"}`}
                          >
                            {s.difficulty}
                          </span>
                          <span
                            className={`text-sm font-bold ${s.is_owned ? "text-success" : "text-secondary"}`}
                          >
                            {s.is_owned ? "✓" : "✗"}
                          </span>
                        </div>
                      </div>
                      {s.progress > 0 && <ProgressBar value={s.progress} />}
                    </div>
                  );
                })}
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
                        {t.name}
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
                        onClick={() => handleSort("difficulty")}
                      >
                        {t.difficulty}
                        <SortIcon
                          sortKey={sortKey}
                          col="difficulty"
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
                      <th
                        className={thClassCenter}
                        onClick={() => handleSort("is_owned")}
                      >
                        {t.owned}
                        <SortIcon
                          sortKey={sortKey}
                          col="is_owned"
                          sortDir={sortDir}
                        />
                      </th>
                      <th
                        className={thClass}
                        onClick={() => handleSort("writeup")}
                      >
                        {t.writeup}
                        <SortIcon
                          sortKey={sortKey}
                          col="writeup"
                          sortDir={sortDir}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((s, i) => {
                      const writeup =
                        writeupsData.sherlocks?.[String(s.id)]?.writeup ?? null;
                      return (
                        <tr
                          key={s.id}
                          className={`border-t border-surface2 hover:bg-surface2/50 transition-colors ${i % 2 === 0 ? "" : "bg-surface/30"}`}
                        >
                          <td className="px-4 py-3 text-light font-medium">
                            {s.name}
                          </td>
                          <td className="px-4 py-3 text-secondary">
                            {s.category}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded border text-xs font-medium ${difficultyColor[s.difficulty] ?? "text-secondary border-surface2"}`}
                            >
                              {s.difficulty}
                            </span>
                          </td>
                          <td className="px-4 py-3 w-36">
                            <ProgressBar value={s.progress} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {s.is_owned ? (
                              <span className="text-success font-bold">✓</span>
                            ) : (
                              <span className="text-secondary">✗</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <WriteupLink url={writeup} label="Writeup" />
                          </td>
                        </tr>
                      );
                    })}
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

export default HTBSherlocks;
