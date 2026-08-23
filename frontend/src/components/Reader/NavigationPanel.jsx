import { useParams, Link } from 'react-router-dom'

const NavigationPanel = ({ chapters, currentChapterIndex, onChapterChange }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-white font-semibold">فصل‌ها</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            onClick={() => onChapterChange(index)}
            className={`w-full text-right p-3 rounded-lg mb-1 transition-colors ${
              index === currentChapterIndex
                ? 'bg-purple-600/20 text-purple-400'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="block font-medium">فصل {chapter.number}</span>
            <span className="text-sm text-gray-500">{chapter.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default NavigationPanel
