const ZoomControls = ({ zoom, onZoomChange }) => {
  const zoomIn = () => onZoomChange(Math.min(3, zoom + 0.25))
  const zoomOut = () => onZoomChange(Math.max(0.5, zoom - 0.25))
  const resetZoom = () => onZoomChange(1)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={zoomOut}
        disabled={zoom <= 0.5}
        className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 text-white p-1 rounded transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="text-gray-300 text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
      <button
        onClick={zoomIn}
        disabled={zoom >= 3}
        className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 text-white p-1 rounded transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button
        onClick={resetZoom}
        className="bg-gray-800 hover:bg-gray-700 text-white p-1 rounded transition-colors text-xs"
      >
        بازنشانی
      </button>
    </div>
  )
}

export default ZoomControls
