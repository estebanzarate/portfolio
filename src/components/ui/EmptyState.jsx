function EmptyState({ message }) {
  return (
    <div className="flex items-center justify-center py-16 rounded-lg border border-surface2">
      <p className="text-secondary text-sm">{message}</p>
    </div>
  )
}

export default EmptyState