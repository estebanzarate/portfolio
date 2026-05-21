function StatsBanner({ items, chips, activeChip, onChipClick }) {
  return (
    <div className="md:hidden flex flex-col gap-2">
      <div className="flex divide-x divide-surface2 border border-surface2 rounded-lg overflow-hidden">
        {items.map(({ label, value, accent }) => (
          <div key={label} className="flex-1 flex flex-col items-center py-3 px-2 gap-0.5">
            <span className={`text-xl font-semibold ${accent ? 'text-primary' : 'text-light'}`}>
              {value}
            </span>
            <span className="text-xs text-secondary text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>
      {chips?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map(({ label, value, id }) => {
            const isActive = activeChip && activeChip === id
            return (
              <span
                key={label}
                onClick={() => onChipClick?.(id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs transition-colors
                  ${onChipClick ? 'cursor-pointer' : ''}
                  ${isActive
                    ? 'border-primary/70 bg-primary/10 text-primary'
                    : 'border-surface2 bg-surface2 text-secondary hover:border-primary/40'
                  }`}
              >
                <span>{label}</span>
                <span className="text-light font-medium">{value}</span>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StatsBanner