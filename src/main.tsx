import { StrictMode, useState, useRef, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Welcome from './Welcome.tsx'

// Import music file so Vite can bundle it with a hashed path
import bgMusic from './assets/music/BIG SHOT - Traditional Japanese Version.mp3'

function Root() {
  const [showApp, setShowApp] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Called by Welcome's "Masuk" button — start music and show app
  const handleEnter = useCallback(() => {
    // Create audio on first user gesture (required by browsers)
    if (!audioRef.current) {
      const audio = new Audio(bgMusic)
      audio.loop = true
      audio.volume = 0.5
      audioRef.current = audio
    }
    audioRef.current.play().then(() => {
      setIsPlaying(true)
    }).catch(() => {
      // Autoplay blocked — still show app, music just won't play
      setIsPlaying(false)
    })
    setShowApp(true)
  }, [])

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }, [isPlaying])

  return (
    <>
      {!showApp && <Welcome onEnter={handleEnter} />}
      {showApp && (
        <App isPlaying={isPlaying} onToggleMusic={toggleMusic} />
      )}
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
