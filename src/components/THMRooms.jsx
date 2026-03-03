import { useState, useMemo } from 'react'
import useLanguage from '../hooks/useLanguage'
import translations from '../data/translations'
import roomsData from '../data/rooms.json'

const difficultyColor = {
  easy: 'text-success border-success/40 bg-success/10',
  medium: 'text-warning border-warning/40 bg-warning/10',
  hard: 'text-danger border-danger/40 bg-danger/10',
  info: 'text-info border-info/40 bg-info/10',
}

const typeColor = {
  walkthrough: 'text-primary border-primary/40 bg-primary/10',
  challenge: 'text-warning border-warning/40 bg-warning/10',
}

const ITEMS_PER_PAGE = 20

function StatCard({ label, value, colorClass }) {
  return (
    <div className={`flex flex-col items-center justify-center px-5 py-3 rounded-lg bg-surface2 border ${colorClass} min-w-[80px]`}>
      <span className="text-2xl font-bold text-light">{value}</span>
      <span className="text-xs text-secondary mt-0.5">{label}</span>
    </div>
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

  const diffList = ['All', 'easy', 'medium', 'hard', 'info']
  const typeList = ['All', 'walkthrough', 'challenge']
  const doneList = ['All', 'completed', 'incomplete']

  const filtered = useMemo(() => {
    return rooms.filter(r => {
      const matchDiff = filterDiff === 'All' || r.difficulty === filterDiff
      const matchType = filterType === 'All' || r.type === filterType
      const matchDone = filterDone === 'All' || (filterDone === 'completed' ? r.completed : !r.completed)
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase())
      return matchDiff && matchType && matchDone && matchSearch
    })
  }, [rooms, filterDiff, filterType, filterDone, search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function resetPage(setter) {
    return (val) => { setter(val); setPage(1) }
  }

  return (
    <section id="thm" className="flex flex-col gap-6 scroll-mt-20">

      <div className="border-l-4 border-danger pl-4">
        <h2 className="text-2xl font-bold text-light">TryHackMe <span className="text-danger">Rooms</span></h2>
        <p className="text-secondary text-sm mt-1">
          {t.subtitle}: {new Date(roomsData.last_updated).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US')}
        </p>
      </div>

      {/* Stats globales */}
      <div className="flex flex-wrap gap-3">
        <StatCard label={t.total} value={statistics.total_rooms} colorClass="border-surface2" />
        <StatCard label={t.completed} value={statistics.completed} colorClass="border-success/40" />
        <StatCard label={t.percentage} value={`${statistics.completion_percentage}%`} colorClass="border-info/40" />
      </div>

      {/* Stats por dificultad */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(statistics.by_difficulty).map(([diff, count]) => (
          <StatCard
            key={diff}
            label={diff.charAt(0).toUpperCase() + diff.slice(1)}
            value={count}
            colorClass={difficultyColor[diff]?.split(' ')[1] ?? 'border-surface2'}
          />
        ))}
        {Object.entries(statistics.by_type).map(([type, count]) => (
          <StatCard
            key={type}
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            value={count}
            colorClass={typeColor[type]?.split(' ')[1] ?? 'border-surface2'}
          />
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-light placeholder-secondary focus:outline-none focus:border-primary text-sm"
        />
        <select
          value={filterDiff}
          onChange={e => resetPage(setFilterDiff)(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-secondary focus:outline-none focus:border-primary text-sm"
        >
          {diffList.map(d => (
            <option key={d} value={d}>
              {d === 'All' ? t.allDiff : d.charAt(0).toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={e => resetPage(setFilterType)(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-secondary focus:outline-none focus:border-primary text-sm"
        >
          {typeList.map(t_ => (
            <option key={t_} value={t_}>
              {t_ === 'All' ? t.allType : t_.charAt(0).toUpperCase() + t_.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filterDone}
          onChange={e => resetPage(setFilterDone)(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface2 border border-surface2 text-secondary focus:outline-none focus:border-primary text-sm"
        >
          <option value="All">{t.allStatus}</option>
          <option value="completed">{t.completedFilter}</option>
          <option value="incomplete">{t.incompleteFilter}</option>
        </select>
      </div>

      <p className="text-secondary text-sm">{filtered.length} {t.found}</p>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-surface2">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface2 text-secondary uppercase text-xs tracking-wider">
              <th className="px-4 py-3 text-left">{t.name}</th>
              <th className="px-4 py-3 text-left">{t.difficulty}</th>
              <th className="px-4 py-3 text-left">{t.type}</th>
              <th className="px-4 py-3 text-center">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((r, i) => (
              <tr
                key={r.id}
                className={`border-t border-surface2 hover:bg-surface2/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/30'}`}
              >
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
                  {r.completed
                    ? <span className="text-success font-bold">✓</span>
                    : <span className="text-secondary">✗</span>}
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

    </section>
  )
}

export default THMRooms