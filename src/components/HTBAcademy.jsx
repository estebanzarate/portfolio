import { useState, useMemo, Fragment } from 'react'
import useLanguage from '../hooks/useLanguage'
import translations from '../data/translations'
import academyData from '../data/academy.json'
import StatCard from './ui/StatCard'
import EmptyState from './ui/EmptyState'

const ITEMS_PER_PAGE = 20
const categoryColor = {
  Offensive: 'text-danger border-danger/40 bg-danger/10',
  Defensive: 'text-info border-info/40 bg-info/10',
  General: 'text-primary border-primary/40 bg-primary/10',
  Purple: 'text-secondary border-secondary/40 bg-secondary/10',
}

function ProgressBar({ value, label }) {
  const color =
    value === 100 ? 'bg-success' :
      value >= 50 ? 'bg-warning' :
        value > 0 ? 'bg-primary' :
          'bg-surface2'
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
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-secondary w-8 text-right" aria-hidden="true">{value}%</span>
    </div>
  )
}

function HTBAcademy() {
  const { lang } = useLanguage()
  const t = translations[lang].academy
  const { statistics, modules } = academyData
  const [filterStatus, setFilterStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState(null)

  const statusList = ['All', 'Completed', 'In Progress', 'Not Started']
  const statusLabels = {
    All: t.all,
    Completed: t.completedFilter,
    'In Progress': t.inProgress,
    'Not Started': t.notStarted,
  }

  const filtered = useMemo(() => {
    return modules.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
      const matchStatus =
        filterStatus === 'All' ? true :
          filterStatus === 'Completed' ? m.progress === 100 :
            filterStatus === 'In Progress' ? m.progress > 0 && m.progress < 100 :
              filterStatus === 'Not Started' ? m.progress === 0 : true
      return matchSearch && matchStatus
    })
  }, [modules, filterStatus, search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const hasData = modules.length > 0
  const hasResults = filtered.length > 0

  return (
    <section id="academy" className="flex flex-col gap-6 scroll-mt-20">
      <div className="border-l-4 border-primary pl-4">
        <h2 className="text-2xl font-bold text-light">HackTheBox <span className="text-primary">Academy</span></h2>
        <p className="text-secondary text-sm mt-1">
          {t.subtitle}: {new Date(academyData.last_updated).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US')}
        </p>
      </div>

      {!hasData ? (
        <EmptyState message={t.noData} />
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <StatCard label={t.totalModules} value={statistics.total_modules} colorClass="border-surface2" />
            <StatCard
              label={t.completed}
              value={statistics.completed}
              sub={t.completedSub(statistics.completion_percentage)}
              colorClass="border-success/40"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statistics.by_category).map(([cat, data]) => (
              <div
                key={cat}
                className={`flex flex-col px-4 py-3 rounded-lg bg-surface2 border min-w-[160px] gap-3 ${categoryColor[cat] ?? 'border-surface2'}`}
              >
                <div className="flex flex-col gap-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border self-start ${categoryColor[cat] ?? ''}`}>
                    {cat}
                  </span>
                  <span className="text-xs text-secondary">{data.completed} / {data.total} {t.modules}</span>
                </div>
                <ProgressBar value={data.percentage} label={`${cat}: ${data.percentage}%`} />
              </div>
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
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
              className="px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-secondary focus:outline-none focus:border-primary text-sm"
            >
              {statusList.map(s => (
                <option key={s} value={s}>{statusLabels[s]}</option>
              ))}
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
                      <th className="px-4 py-3 text-left">{t.module}</th>
                      <th className="px-4 py-3 text-left w-48">{t.progress}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((m, i) => (
                      <Fragment key={m.id}>
                        <tr
                          onClick={() => setExpanded(prev => prev === m.id ? null : m.id)}
                          className={`border-t border-surface2 hover:bg-surface2/50 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-surface/30'}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-light font-medium">{m.name}</span>
                              <span className="text-secondary text-xs" aria-hidden="true">{expanded === m.id ? '▲' : '▼'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 w-48">
                            <ProgressBar value={m.progress} label={`${m.name}: ${m.progress}%`} />
                          </td>
                        </tr>
                        {expanded === m.id && (
                          <tr className={`border-t border-surface2 ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                            <td colSpan={2} className="px-4 py-3 text-secondary text-sm leading-relaxed bg-surface2/30">
                              {m.description}
                            </td>
                          </tr>
                        )}
                      </Fragment>
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

export default HTBAcademy