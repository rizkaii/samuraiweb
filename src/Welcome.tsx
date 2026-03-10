import { useState, useEffect } from 'react'
import logo from './assets/logo.png'
import './Welcome.css'

interface WelcomeProps {
  onEnter: () => void
}

export default function Welcome({ onEnter }: WelcomeProps) {
  // Animation phases: 'logo' → 'button' → (user clicks → fade out)
  const [phase, setPhase] = useState<'logo' | 'button' | 'exit'>('logo')

  useEffect(() => {
    // After logo animation finishes (1.8s), show the button
    const t = setTimeout(() => setPhase('button'), 1800)
    return () => clearTimeout(t)
  }, [])

  const handleEnter = () => {
    setPhase('exit')
    // Wait for fade-out transition before calling onEnter
    setTimeout(onEnter, 700)
  }

  return (
    <div className={`welcome ${phase === 'exit' ? 'welcome--exit' : ''}`}>
      {/* Background radial glow */}
      <div className="welcome__bg-glow" />

      {/* Logo — starts huge then shrinks to normal */}
      <div className={`welcome__logo-wrap ${phase !== 'logo' ? 'welcome__logo-wrap--done' : ''}`}>
        <img src={logo} alt="Samurai Logo" className="welcome__logo" />
      </div>

      {/* Enter button — fades in after logo animation */}
      <button
        className={`welcome__btn ${phase === 'button' ? 'welcome__btn--visible' : ''}`}
        onClick={handleEnter}
        aria-label="Masuk ke website"
      >
        <span className="welcome__btn-text">Explore</span>
        <span className="welcome__btn-line" />
      </button>

      {/* Subtle tagline */}
      <p className={`welcome__tagline ${phase === 'button' ? 'welcome__tagline--visible' : ''}`}>
        The Way of the Warrior
      </p>
    </div>
  )
}
