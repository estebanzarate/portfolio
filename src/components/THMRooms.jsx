import { useState, useMemo } from 'react'
import useLanguage from '../hooks/useLanguage'
import translations from '../data/translations'
import roomsData from '../data/rooms.json'
import writeupsData from '../data/writeups.json'
import StatCard from './ui/StatCard'
import StatsBanner from './ui/StatsBanner'
import EmptyState from './ui/EmptyState'

const difficultyColor = {
  easy: 'text-success border-success/40 bg-success/10',
  medium: 'text-warning border-warning/40 bg-warning/10',
  hard: 'text-danger border-danger/40 bg-danger/10',
  info: 'text-info border-info/40 bg-info/10',
}
const typeColor = {
  walkthrough: 'text-primary border-primary/40 bg-primary/10',
  challenge: 'text-secondary border-surface2 bg-surface2',
}
const ITEMS_PER_PAGE = 20
const paginationBtn = 'px-3 py-1.5 rounded bg-surface2 text-secondary text-sm transition-colors cursor-pointer hover:text-light disabled:opacity-30 disabled:cursor-not-allowed'
const selectClass = 'cursor-pointer px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-secondary focus:outline-none focus:border-primary text-sm'

function SortIcon({ sortKey, col, sortDir }) {
  if (sortKey !== col) return <span className="ml-1 text-secondary opacity-40">↕</span>
  return <span className="ml-1 text-primary">{sortDir === 'asc' ? '↑' : '↓'}</span>
}

function WriteupLink({ url, label }) {
  if (!url) return <span className="text-secondary text-xs">—</span>
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer">
      {label}
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  )
}

function THMRooms() {
  const { lang } = useLanguage()
  const t = translations[lang].thm
  const { statistics, rooms } = roomsData

  const [filterDiff, setFilterDiff] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterDone, setFilterDone] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const diffList = ['All', 'easy', 'medium', 'hard', 'info']
  const typeList = ['All', 'walkthrough', 'challenge']

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  function toggleDiffFilter(diff) {
    setFilterDiff(prev => prev === diff ? 'All' : diff)
    setPage(1)
  }

  function resetPage(setter) {
    return (val) => { setter(val); setPage(1) }
  }

  const filtered = useMemo(() => rooms.filter(r => {
    const matchDiff = filterDiff === 'All' || r.difficulty === filterDiff
    const matchType = filterType === 'All' || r.type === filterType
    const matchDone = filterDone === 'All' || (filterDone === 'completed' ? r.completed : !r.completed)
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase())
    return matchDiff && matchType && matchDone && matchSearch
  }), [rooms, filterDiff, filterType, filterDone, search])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (sortKey === 'writeup') {
        av = writeupsData.rooms[a.code]?.writeup ?? ''
        bv = writeupsData.rooms[b.code]?.writeup ?? ''
      }
      if (typeof av === 'boolean') av = av ? 1 : 0
      if (typeof bv === 'boolean') bv = bv ? 1 : 0
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return sortDir === 'asc' ? av - bv : bv - av
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const hasData = rooms.length > 0
  const hasResults = filtered.length > 0

  const bannerItems = [
    { label: t.total, value: statistics.total_rooms, accent: false },
    { label: t.completed, value: statistics.completed, accent: false },
    { label: t.percentage, value: `${statistics.completion_percentage}%`, accent: false },
  ]
  const bannerChips = Object.entries(statistics.by_difficulty).map(([diff, count]) => ({
    label: diff.charAt(0).toUpperCase() + diff.slice(1),
    value: count,
    id: diff,
  }))

  const activeChip = filterDiff !== 'All' ? filterDiff : null

  const thClass = 'px-4 py-3 text-left cursor-pointer hover:text-light select-none'
  const thClassCenter = 'px-4 py-3 text-center cursor-pointer hover:text-light select-none'

  const Pagination = () => totalPages > 1 ? (
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={paginationBtn}>{t.prev}</button>
      <span className="text-secondary text-sm"><span className="text-light font-medium">{page}</span> / {totalPages}</span>
      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={paginationBtn}>{t.next}</button>
    </div>
  ) : null

  return (
    <section id="thm" className="flex flex-col gap-6 scroll-mt-20">
      <div className="border-l-4 border-primary pl-4">
        <h2 className="text-2xl font-bold text-light">TryHackMe <span className="text-primary">Rooms</span></h2>
        <p className="text-secondary text-sm mt-1">
          {t.subtitle}: {new Date(roomsData.last_updated).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US')}
        </p>
      </div>

      {!hasData ? <EmptyState message={t.noData} /> : (
        <>
          <StatsBanner
            items={bannerItems}
            chips={bannerChips}
            activeChip={activeChip}
            onChipClick={toggleDiffFilter}
          />

          {/* Stats desktop */}
          <div className="hidden md:flex flex-wrap gap-3">
            <StatCard label={t.total} value={statistics.total_rooms} colorClass="border-surface2" />
            <StatCard label={t.completed} value={statistics.completed} colorClass="border-surface2" />
            <StatCard label={t.percentage} value={`${statistics.completion_percentage}%`} colorClass="border-surface2" />
          </div>
          <div className="hidden md:flex flex-wrap gap-3">
            {Object.entries(statistics.by_difficulty).map(([diff, count]) => (
              <StatCard
                key={diff}
                label={diff.charAt(0).toUpperCase() + diff.slice(1)}
                value={count}
                colorClass="border-surface2"
                active={filterDiff === diff}
                onClick={() => toggleDiffFilter(diff)}
              />
            ))}
            {Object.entries(statistics.by_type).map(([type, count]) => (
              <StatCard key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} value={count} colorClass="border-surface2" />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input type="text" placeholder={t.searchPlaceholder} value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="flex-1 px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-light placeholder-secondary focus:outline-none focus:border-primary text-sm" />
            <select value={filterDiff} onChange={e => resetPage(setFilterDiff)(e.target.value)} className={selectClass}>
              {diffList.map(d => <option key={d} value={d}>{d === 'All' ? t.allDiff : d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
            <select value={filterType} onChange={e => resetPage(setFilterType)(e.target.value)} className={selectClass}>
              {typeList.map(t_ => <option key={t_} value={t_}>{t_ === 'All' ? t.allType : t_.charAt(0).toUpperCase() + t_.slice(1)}</option>)}
            </select>
            <select value={filterDone} onChange={e => resetPage(setFilterDone)(e.target.value)} className={selectClass}>
              <option value="All">{t.allStatus}</option>
              <option value="completed">{t.completedFilter}</option>
              <option value="incomplete">{t.incompleteFilter}</option>
            </select>
          </div>
          <p className="text-secondary text-sm">{filtered.length} {t.found}</p>

          {!hasResults ? <EmptyState message={t.noResults} /> : (
            <>
              {/* Cards mobile */}
              <div className="flex flex-col gap-2 md:hidden">
                {paginated.map(r => {
                  const writeup = writeupsData.rooms[r.code]?.writeup ?? null
                  return (
                    <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface border border-surface2">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="text-light font-medium text-sm leading-tight">{r.title}</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded border text-xs font-medium ${difficultyColor[r.difficulty] ?? 'text-secondary border-surface2'}`}>
                            {r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)}
                          </span>
                          <span className={`px-2 py-0.5 rounded border text-xs font-medium ${typeColor[r.type] ?? 'text-secondary border-surface2'}`}>
                            {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                          </span>
                          {writeup && <WriteupLink url={writeup} label="Writeup" />}
                        </div>
                      </div>
                      <span className={`text-lg font-bold shrink-0 ${r.completed ? 'text-success' : 'text-secondary'}`}>
                        {r.completed ? '✓' : '✗'}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Tabla desktop */}
              <div className="hidden md:block overflow-x-auto rounded-lg border border-surface2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface2 text-secondary uppercase text-xs tracking-wider">
                      <th className={thClass} onClick={() => handleSort('title')}>
                        {t.name}<SortIcon sortKey={sortKey} col="title" sortDir={sortDir} />
                      </th>
                      <th className={thClass} onClick={() => handleSort('difficulty')}>
                        {t.difficulty}<SortIcon sortKey={sortKey} col="difficulty" sortDir={sortDir} />
                      </th>
                      <th className={thClass} onClick={() => handleSort('type')}>
                        {t.type}<SortIcon sortKey={sortKey} col="type" sortDir={sortDir} />
                      </th>
                      <th className={thClassCenter} onClick={() => handleSort('completed')}>
                        {t.status}<SortIcon sortKey={sortKey} col="completed" sortDir={sortDir} />
                      </th>
                      <th className={thClass} onClick={() => handleSort('writeup')}>
                        {t.writeup}<SortIcon sortKey={sortKey} col="writeup" sortDir={sortDir} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((r, i) => {
                      const writeup = writeupsData.rooms[r.code]?.writeup ?? null
                      return (
                        <tr key={r.id} className={`border-t border-surface2 hover:bg-surface2/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                          <td className="px-4 py-3 text-light font-medium">{r.title}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded border text-xs font-medium ${difficultyColor[r.difficulty] ?? 'text-secondary border-surface2'}`}>
                              {r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded border text-xs font-medium ${typeColor[r.type] ?? 'text-secondary border-surface2'}`}>
                              {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {r.completed ? <span className="text-success font-bold">✓</span> : <span className="text-secondary">✗</span>}
                          </td>
                          <td className="px-4 py-3"><WriteupLink url={writeup} label="Writeup" /></td>
                        </tr>
                      )
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
  )
}

export default THMRooms