const SubtitleToggle = ({ subtitles, selected, onSelect }) => {
  return (
    <div className="relative">
      <select
        value={selected?.value || 'fa'}
        onChange={(e) => {
          const subtitle = subtitles.find((s) => s.value === e.target.value)
          onSelect(subtitle)
        }}
        className="appearance-none bg-gray-800 text-gray-300 text-sm px-3 py-1 pr-8 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {subtitles.map((sub) => (
          <option key={sub.value} value={sub.value}>
            {sub.label}
          </option>
        ))}
      </select>
      <svg
        className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

export default SubtitleToggle
