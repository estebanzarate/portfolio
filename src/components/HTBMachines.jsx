import { useState, useMemo } from 'react'
import useLanguage from '../hooks/useLanguage'
import translations from '../data/translations'
import machinesData from '../data/machines.json'
import StatCard from './ui/StatCard'
import EmptyState from './ui/EmptyState'

const difficultyColor = {
  Easy: 'text-success border-success/40 bg-success/10',
  Medium: 'text-warning border-warning/40 bg-warning/10',
  Hard: 'text-danger border-danger/40 bg-danger/10',
  Insane: 'text-info border-info/40 bg-info/10',
}
const ITEMS_PER_PAGE = 20

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

  const filtered = useMemo(() => {
    return machines.filter(m => {
      const matchOS = filterOS === 'All' || m.os === filterOS
      const matchDiff = filterDiff === 'All' || m.difficulty === filterDiff
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
      return matchOS && matchDiff && matchSearch
    })
  }, [machines, filterOS, filterDiff, search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function handleFilterChange(setter) {
    return (val) => { setter(val); setPage(1) }
  }

  const hasData = machines.length > 0
  const hasResults = filtered.length > 0

  return (
    <section id="machines" className="flex flex-col gap-6 scroll-mt-20">
      <div className="border-l-4 border-success pl-4">
        <h2 className="text-2xl font-bold text-light">HackTheBox <span className="text-success">Machines</span></h2>
        <p className="text-secondary text-sm mt-1">
          {t.subtitle}: {new Date(machinesData.last_updated).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US')}
        </p>
      </div>

      {!hasData ? (
        <EmptyState message={t.noData} />
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <StatCard label={t.total} value={statistics.total} colorClass="border-surface2" />
            <StatCard label={t.userOwns} value={statistics.user_owns} colorClass="border-info/40" />
            <StatCard label={t.rootOwns} value={statistics.root_owns} colorClass="border-primary/40" />
            <StatCard label="Easy" value={statistics.by_difficulty.Easy ?? 0} colorClass="border-success/40" />
            <StatCard label="Medium" value={statistics.by_difficulty.Medium ?? 0} colorClass="border-warning/40" />
            <StatCard label="Hard" value={statistics.by_difficulty.Hard ?? 0} colorClass="border-danger/40" />
            <StatCard label="Insane" value={statistics.by_difficulty.Insane ?? 0} colorClass="border-info/40" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statistics.by_os).map(([os, count]) => (
              <span key={os} className="px-3 py-1 rounded-full bg-surface2 text-secondary text-xs border border-surface2">
                {os}: <span className="text-light font-medium">{count}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="flex-1 px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-light placeholder-secondary focus:outline-none focus:border-primary text-sm"
            />
            <select
              value={filterOS}
              onChange={e => handleFilterChange(setFilterOS)(e.target.value)}
              className="px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-secondary focus:outline-none focus:border-primary text-sm"
            >
              {osList.map(os => <option key={os} value={os}>{os === 'All' ? t.allOS : os}</option>)}
            </select>
            <select
              value={filterDiff}
              onChange={e => handleFilterChange(setFilterDiff)(e.target.value)}
              className="px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-secondary focus:outline-none focus:border-primary text-sm"
            >
              {diffList.map(d => <option key={d} value={d}>{d === 'All' ? t.allDiff : d}</option>)}
            </select>
          </div>
          <p className="text-secondary text-sm">{filtered.length} {t.found}</p>
          {!hasResults ? (
            <EmptyState message={t.noResults} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-surface2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface2 text-secondary uppercase text-xs tracking-wider">
                      <th className="px-4 py-3 text-left">{t.name}</th>
                      <th className="px-4 py-3 text-left">{t.os}</th>
                      <th className="px-4 py-3 text-left">{t.difficulty}</th>
                      <th className="px-4 py-3 text-center">{t.user}</th>
                      <th className="px-4 py-3 text-center">{t.root}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((m, i) => (
                      <tr
                        key={m.id}
                        className={`border-t border-surface2 hover:bg-surface2/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/30'}`}
                      >
                        <td className="px-4 py-3 text-light font-medium">{m.name}</td>
                        <td className="px-4 py-3 text-secondary">{m.os}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded border text-xs font-medium ${difficultyColor[m.difficulty]}`}>
                            {m.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {m.user_owned ? <span className="text-success font-bold">✓</span> : <span className="text-secondary">✗</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {m.root_owned ? <span className="text-success font-bold">✓</span> : <span className="text-secondary">✗</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded bg-surface2 text-secondary hover:text-light disabled:opacity-30 text-sm transition-colors"
                  >
                    {t.prev}
                  </button>
                  <span className="text-secondary text-sm">
                    <span className="text-light font-medium">{page}</span> / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded bg-surface2 text-secondary hover:text-light disabled:opacity-30 text-sm transition-colors"
                  >
                    {t.next}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}

export default HTBMachines