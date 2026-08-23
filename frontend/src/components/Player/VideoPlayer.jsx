import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PlayerControls from './PlayerControls'
import SubtitleToggle from './SubtitleToggle'
import QualitySelector from './QualitySelector'
import useUIStore from '../../store/useUIStore'
import { VIDEO_QUALITIES, SUBTITLE_LANGUAGES } from '../../utils/constants'

const VideoPlayer = ({ src, poster, title, episodes, currentEpisode, onEpisodeChange }) => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [selectedQuality, setSelectedQuality] = useState(VIDEO_QUALITIES[0])
  const [selectedSubtitle, setSelectedSubtitle] = useState(SUBTITLE_LANGUAGES[0])
  const { sidebarOpen } = useUIStore()

  const controlsTimeoutRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      if (onEpisodeChange && episodes && currentEpisode < episodes.length) {
        onEpisodeChange(currentEpisode + 1)
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [currentEpisode, episodes, onEpisodeChange])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  const handleSeek = (time) => {
    const video = videoRef.current
    video.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (newVolume) => {
    const video = videoRef.current
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video"
        onClick={togglePlay}
      />

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"
          >
            <div className="absolute top-0 left-0 right-0 p-4">
              <h3 className="text-white font-medium text-lg">{title}</h3>
              {episodes && (
                <p className="text-gray-300 text-sm">
                  قسمت {currentEpisode} از {episodes.length}
                </p>
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <PlayerControls
                currentTime={currentTime}
                duration={duration}
                volume={volume}
                isMuted={isMuted}
                isFullscreen={isFullscreen}
                onSeek={handleSeek}
                onVolumeChange={handleVolumeChange}
                onToggleMute={toggleMute}
                onToggleFullscreen={toggleFullscreen}
                formatTime={formatTime}
              />

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                  <QualitySelector
                    qualities={VIDEO_QUALITIES}
                    selected={selectedQuality}
                    onSelect={setSelectedQuality}
                  />
                  <SubtitleToggle
                    subtitles={SUBTITLE_LANGUAGES}
                    selected={selectedSubtitle}
                    onSelect={setSelectedSubtitle}
                  />
                </div>

                {episodes && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEpisodeChange(Math.max(1, currentEpisode - 1))}
                      disabled={currentEpisode <= 1}
                      className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-500 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      قبلی
                    </button>
                    <span className="text-gray-300 text-sm">
                      {currentEpisode} / {episodes.length}
                    </span>
                    <button
                      onClick={() => onEpisodeChange(Math.min(episodes.length, currentEpisode + 1))}
                      disabled={currentEpisode >= episodes.length}
                      className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-500 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      بعدی
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VideoPlayer
