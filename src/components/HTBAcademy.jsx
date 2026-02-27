import { useState, useMemo } from 'react'
import academyData from '../data/academy.json'

const ITEMS_PER_PAGE = 20

const categoryColor = {
  Offensive: 'text-danger border-danger/40 bg-danger/10',
  Defensive: 'text-info border-info/40 bg-info/10',
  General: 'text-primary border-primary/40 bg-primary/10',
  Purple: 'text-secondary border-secondary/40 bg-secondary/10',
}

function ProgressBar({ value }) {
  const color =
    value === 100 ? 'bg-success' :
      value >= 50 ? 'bg-warning' :
        value > 0 ? 'bg-primary' :
          'bg-surface2'

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-surface2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-secondary w-8 text-right">{value}%</span>
    </div>
  )
}

function StatCard({ label, value, sub, colorClass }) {
  return (
    <div className={`flex flex-col px-5 py-3 rounded-lg bg-surface2 border ${colorClass} min-w-[120px]`}>
      <span className="text-2xl font-bold text-light">{value}</span>
      <span className="text-xs text-secondary mt-0.5">{label}</span>
      {sub && <span className="text-xs text-secondary mt-0.5">{sub}</span>}
    </div>
  )
}

function HTBAcademy() {
  const { statistics, modules } = academyData
  const [filterStatus, setFilterStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState(null)

  const statusList = ['All', 'Completed', 'In Progress', 'Not Started']

  const filtered = useMemo(() => {
    return modules.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
      const matchStatus =
        filterStatus === 'All' ? true :
          filterStatus === 'Completed' ? m.progress === 100 :
            filterStatus === 'In Progress' ? m.progress > 0 && m.progress < 100 :
              filterStatus === 'Not Started' ? m.progress === 0 :
                true
      return matchSearch && matchStatus
    })
  }, [modules, filterStatus, search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function toggleExpanded(id) {
    setExpanded(prev => prev === id ? null : id)
  }

  return (
    <section id="academy" className="flex flex-col gap-6 scroll-mt-20">

      <div className="border-l-4 border-primary pl-4">
        <h2 className="text-2xl font-bold text-light">HackTheBox <span className="text-primary">Academy</span></h2>
        <p className="text-secondary text-sm mt-1">Actualizado: {new Date(academyData.last_updated).toLocaleDateString('es-AR')}</p>
      </div>

      {/* Stats globales */}
      <div className="flex flex-wrap gap-3">
        <StatCard
          label="Total módulos"
          value={statistics.total_modules}
          colorClass="border-surface2"
        />
        <StatCard
          label="Completados"
          value={statistics.completed}
          sub={`${statistics.completion_percentage}% del total`}
          colorClass="border-success/40"
        />
      </div>

      {/* Stats por categoría */}
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
              <span className="text-xs text-secondary">{data.completed} / {data.total} módulos</span>
            </div>
            <ProgressBar value={data.percentage} />
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar módulo..."
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
            <option key={s} value={s}>
              {s === 'All' ? 'Todos' :
                s === 'Completed' ? 'Completados' :
                  s === 'In Progress' ? 'En progreso' :
                    'Sin empezar'}
            </option>
          ))}
        </select>
      </div>

      <p className="text-secondary text-sm">{filtered.length} módulos encontrados</p>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-surface2">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface2 text-secondary uppercase text-xs tracking-wider">
              <th className="px-4 py-3 text-left">Módulo</th>
              <th className="px-4 py-3 text-left w-48">Progreso</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((m, i) => (
              <>
                <tr
                  key={m.id}
                  onClick={() => toggleExpanded(m.id)}
                  className={`border-t border-surface2 hover:bg-surface2/50 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-surface/30'}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-light font-medium">{m.name}</span>
                      <span className="text-secondary text-xs">{expanded === m.id ? '▲' : '▼'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 w-48">
                    <ProgressBar value={m.progress} />
                  </td>
                </tr>
                {expanded === m.id && (
                  <tr key={`${m.id}-desc`} className={`border-t border-surface2 ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                    <td colSpan={2} className="px-4 py-3 text-secondary text-sm leading-relaxed bg-surface2/30">
                      {m.description}
                    </td>
                  </tr>
                )}
              </>
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
            Anterior
          </button>
          <span className="text-secondary text-sm">
            <span className="text-light font-medium">{page}</span> / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded bg-surface2 text-secondary hover:text-light disabled:opacity-30 text-sm transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}

    </section>
  )
}

export default HTBAcademy