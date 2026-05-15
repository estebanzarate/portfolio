function StatCard({ label, value, sub, colorClass }) {
  return (
    <div className={`flex flex-col px-5 py-3 rounded-lg bg-surface2 border ${colorClass} min-w-[80px]`}>
      <span className="text-2xl font-bold text-light">{value}</span>
      <span className="text-xs text-secondary mt-0.5">{label}</span>
      {sub && <span className="text-xs text-secondary mt-0.5">{sub}</span>}
    </div>
  )
}

export default StatCard