import { useState, useMemo } from 'react'
import useLanguage from '../hooks/useLanguage'
import translations from '../data/translations'
import machinesData from '../data/machines.json'
import writeupsData from '../data/writeups.json'
import StatCard from './ui/StatCard'
import StatsBanner from './ui/StatsBanner'
import EmptyState from './ui/EmptyState'

const difficultyColor = {
  Easy: 'text-success border-success/40 bg-success/10',
  Medium: 'text-warning border-warning/40 bg-warning/10',
  Hard: 'text-danger border-danger/40 bg-danger/10',
  Insane: 'text-[#b0b8c8] border-[#b0b8c8]/40 bg-[#b0b8c8]/10',
}
const ITEMS_PER_PAGE = 20
const paginationBtn = 'px-3 py-1.5 rounded bg-surface2 text-secondary text-sm transition-colors cursor-pointer hover:text-light disabled:opacity-30 disabled:cursor-not-allowed'
const selectClass = 'cursor-pointer px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-secondary focus:outline-none focus:border-primary text-sm'

function WriteupLink({ url, label }) {
  if (!url) return <span className="text-secondary text-xs">—</span>
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
    >
      {label}
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  )
}

function HTBMachines() {
  const { lang } = useLanguage()
  const t = translations[lang].machines
  const { statistics, machines } = machinesData
  const [filterOS, setFilterOS] = useState('All')
  const [filterDiff, setFilterDiff] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const osList = ['All', ...Object.keys(statistics.by_os)]
  const diffList = ['All', 'Easy', 'Medium', 'Hard', 'Insane']

  const filtered = useMemo(() => machines.filter(m => {
    const matchOS = filterOS === 'All' || m.os === filterOS
    const matchDiff = filterDiff === 'All' || m.difficulty === filterDiff
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    return matchOS && matchDiff && matchSearch
  }), [machines, filterOS, filterDiff, search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function handleFilterChange(setter) {
    return (val) => { setter(val); setPage(1) }
  }

  const hasData = machines.length > 0
  const hasResults = filtered.length > 0

  const bannerItems = [
    { label: t.total, value: statistics.total, accent: false },
    { label: t.userOwns, value: statistics.user_owns, accent: false },
    { label: t.rootOwns, value: statistics.root_owns, accent: true },
  ]
  const bannerChips = [
    ...Object.entries(statistics.by_difficulty).map(([d, v]) => ({ label: d, value: v })),
    ...Object.entries(statistics.by_os).map(([os, v]) => ({ label: os, value: v })),
  ]

  const Pagination = () => totalPages > 1 ? (
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={paginationBtn}>{t.prev}</button>
      <span className="text-secondary text-sm"><span className="text-light font-medium">{page}</span> / {totalPages}</span>
      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={paginationBtn}>{t.next}</button>
    </div>
  ) : null

  return (
    <section id="machines" className="flex flex-col gap-6 scroll-mt-20">
      <div className="border-l-4 border-primary pl-4">
        <h2 className="text-2xl font-bold text-light">HackTheBox <span className="text-primary">Machines</span></h2>
        <p className="text-secondary text-sm mt-1">
          {t.subtitle}: {new Date(machinesData.last_updated).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US')}
        </p>
      </div>

      {!hasData ? <EmptyState message={t.noData} /> : (
        <>
          <StatsBanner items={bannerItems} chips={bannerChips} />
          <div className="hidden md:flex flex-wrap gap-3">
            <StatCard label={t.total} value={statistics.total} colorClass="border-surface2" />
            <StatCard label={t.userOwns} value={statistics.user_owns} colorClass="border-surface2" />
            <StatCard label={t.rootOwns} value={statistics.root_owns} colorClass="border-primary/40" />
            <StatCard label="Easy" value={statistics.by_difficulty.Easy ?? 0} colorClass="border-surface2" />
            <StatCard label="Medium" value={statistics.by_difficulty.Medium ?? 0} colorClass="border-surface2" />
            <StatCard label="Hard" value={statistics.by_difficulty.Hard ?? 0} colorClass="border-surface2" />
            <StatCard label="Insane" value={statistics.by_difficulty.Insane ?? 0} colorClass="border-surface2" />
          </div>
          <div className="hidden md:flex flex-wrap gap-2">
            {Object.entries(statistics.by_os).map(([os, count]) => (
              <span key={os} className="px-3 py-1 rounded-full bg-surface2 text-secondary text-xs border border-surface2">
                {os}: <span className="text-light font-medium">{count}</span>
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input type="text" placeholder={t.searchPlaceholder} value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="flex-1 px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-light placeholder-secondary focus:outline-none focus:border-primary text-sm" />
            <select value={filterOS} onChange={e => handleFilterChange(setFilterOS)(e.target.value)} className={selectClass}>
              {osList.map(os => <option key={os} value={os}>{os === 'All' ? t.allOS : os}</option>)}
            </select>
            <select value={filterDiff} onChange={e => handleFilterChange(setFilterDiff)(e.target.value)} className={selectClass}>
              {diffList.map(d => <option key={d} value={d}>{d === 'All' ? t.allDiff : d}</option>)}
            </select>
          </div>
          <p className="text-secondary text-sm">{filtered.length} {t.found}</p>

          {!hasResults ? <EmptyState message={t.noResults} /> : (
            <>
              {/* Cards mobile */}
              <div className="flex flex-col gap-2 md:hidden">
                {paginated.map(m => {
                  const writeup = writeupsData.machines[String(m.id)]?.writeup ?? null
                  return (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-surface2">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-light font-medium text-sm truncate">{m.name}</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-secondary text-xs">{m.os}</span>
                          {writeup && (
                            <WriteupLink url={writeup} label="Writeup" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className={`px-2 py-0.5 rounded border text-xs font-medium ${difficultyColor[m.difficulty]}`}>{m.difficulty}</span>
                        <span className={`text-sm font-bold ${m.user_owned ? 'text-success' : 'text-secondary'}`} title={t.user}>U</span>
                        <span className={`text-sm font-bold ${m.root_owned ? 'text-success' : 'text-secondary'}`} title={t.root}>R</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Tabla desktop */}
              <div className="hidden md:block overflow-x-auto rounded-lg border border-surface2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface2 text-secondary uppercase text-xs tracking-wider">
                      <th className="px-4 py-3 text-left">{t.name}</th>
                      <th className="px-4 py-3 text-left">{t.os}</th>
                      <th className="px-4 py-3 text-left">{t.difficulty}</th>
                      <th className="px-4 py-3 text-center">{t.user}</th>
                      <th className="px-4 py-3 text-center">{t.root}</th>
                      <th className="px-4 py-3 text-left">{t.writeup}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((m, i) => {
                      const writeup = writeupsData.machines[String(m.id)]?.writeup ?? null
                      return (
                        <tr key={m.id} className={`border-t border-surface2 hover:bg-surface2/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                          <td className="px-4 py-3 text-light font-medium">{m.name}</td>
                          <td className="px-4 py-3 text-secondary">{m.os}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded border text-xs font-medium ${difficultyColor[m.difficulty]}`}>{m.difficulty}</span></td>
                          <td className="px-4 py-3 text-center">{m.user_owned ? <span className="text-success font-bold">✓</span> : <span className="text-secondary">✗</span>}</td>
                          <td className="px-4 py-3 text-center">{m.root_owned ? <span className="text-success font-bold">✓</span> : <span className="text-secondary">✗</span>}</td>
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

export default HTBMachines