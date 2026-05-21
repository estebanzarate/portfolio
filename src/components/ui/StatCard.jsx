function StatCard({ label, value, sub, colorClass, onClick, active }) {
  const base = `flex flex-col px-5 py-3 rounded-lg bg-surface2 border border-surface2 min-w-[80px] transition-colors`
  const interactive = onClick
    ? `cursor-pointer hover:border-primary/50 ${active ? 'border-primary/70 bg-primary/10' : ''}`
    : ''

  return (
    <div className={`${base} ${interactive}`} onClick={onClick}>
      <span className="text-2xl font-bold text-light">{value}</span>
      <span className="text-xs text-secondary mt-0.5">{label}</span>
      {sub && <span className="text-xs text-secondary mt-0.5">{sub}</span>}
    </div>
  )
}

export default StatCard