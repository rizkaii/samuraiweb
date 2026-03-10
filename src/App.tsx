import { useRef, useState, useEffect, useCallback } from 'react'
import Blog from './Blog'
import './Blog.css'
import logo from './assets/logo.png'
import person from './assets/person.png'
import person2 from './assets/person2.png'
import katana from './assets/katana.png'
import videoThumb from './assets/tumbnail.webp'
import Particles from './Particles'
import bg from './assets/dojo.jpg'
import './App.css'

// ─── Spotlight Configuration ──────────────────────────────────────────
const LERP = 0.08   // 0.04 = very cinematic slow, 0.15 = snappy
const RADIUS = 160    // px — inner solid reveal radius
const SOFT_EDGE = 220    // px — soft fade-out radius (must be > RADIUS)
const OPACITY = 0.92   // max opacity of the reveal image

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

// ─── PersonSpotlight component ─────────────────────────────────────────
function PersonSpotlight() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLImageElement>(null)

  // Current/target positions stored in refs — no setState = no re-renders during animation
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)

  const [isHovered, setIsHovered] = useState(false)
  const isHoveredRef = useRef(false)

  // Apply CSS variables directly to DOM — zero re-render cost
  const applyPosition = useCallback((x: number, y: number) => {
    const wrap = wrapRef.current
    const reveal = revealRef.current
    if (!wrap || !reveal) return

    const mask = `radial-gradient(
      ellipse ${RADIUS}px ${RADIUS * 0.95}px at ${x}px ${y}px,
      black 0%,
      black 38%,
      rgba(0,0,0,0.85) 55%,
      rgba(0,0,0,0.4)  68%,
      transparent ${SOFT_EDGE / RADIUS * 100}%
    )`

    reveal.style.webkitMaskImage = mask
    reveal.style.maskImage = mask
  }, [])

  // RAF animation loop — LERP towards target each frame
  const animate = useCallback(() => {
    const cx = lerp(current.current.x, target.current.x, LERP)
    const cy = lerp(current.current.y, target.current.y, LERP)
    current.current = { x: cx, y: cy }
    applyPosition(cx, cy)

    if (isHoveredRef.current) {
      rafId.current = requestAnimationFrame(animate)
    }
  }, [applyPosition])

  const getRelPos = (e: React.MouseEvent) => {
    const r = wrapRef.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { x, y } = getRelPos(e)
    target.current = { x, y }
  }, [])

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    const { x, y } = getRelPos(e)
    // Snap current position to entry point so no initial "fly-in"
    target.current = { x, y }
    current.current = { x, y }
    isHoveredRef.current = true
    setIsHovered(true)
    rafId.current = requestAnimationFrame(animate)
  }, [animate])

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false
    setIsHovered(false)
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
  }, [])

  // Clean up animation frame on unmount
  useEffect(() => () => {
    if (rafId.current !== null) cancelAnimationFrame(rafId.current)
  }, [])

  return (
    <div className="hero__person">
      <div
        ref={wrapRef}
        className="person-wrap"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* BASE — person.png — always visible, sets container width */}
        <img
          src={person}
          alt="Samurai figure"
          className="person-img--base"
        />

        {/* REVEAL — person2.png — masked by soft radial gradient */}
        <img
          ref={revealRef}
          src={person2}
          alt="Samurai figure reveal"
          className={`person-img--reveal ${isHovered ? 'is-active' : ''}`}
          style={{ opacity: isHovered ? OPACITY : 0 }}
        />
      </div>
    </div>
  )
}

// ─── App ───────────────────────────────────────────────────────────────
interface AppProps {
  isPlaying: boolean
  onToggleMusic: () => void
}

export default function App({ isPlaying, onToggleMusic }: AppProps) {
  const [activeSection, setActiveSection] = useState<'hero' | 'blog'>('hero')
  const [transitionState, setTransitionState] = useState<'idle' | 'entering' | 'exiting'>('idle')

  const handleTransition = useCallback((target: 'hero' | 'blog') => {
    if (activeSection === target) return

    // Start entering (panels slide in)
    setTransitionState('entering')

    // After panels meet (550ms in CSS), switch content
    setTimeout(() => {
      setActiveSection(target)
      window.scrollTo(0, 0)

      // Start exiting (panels slide out)
      setTransitionState('exiting')

      // Reset after exit finishes
      setTimeout(() => {
        setTransitionState('idle')
      }, 600)
    }, 600)
  }, [activeSection])

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.8), rgba(10,10,10,0.9)), url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >

      {/* ── Katana Slash Transition Overlay ── */}
      <div className={`katana-overlay ${transitionState === 'entering' ? 'is-entering' : ''} ${transitionState === 'exiting' ? 'is-exiting' : ''}`}>
        <div className="katana-slash--top" />
        <div className="katana-slash--bottom" />
        <div className="katana-slash__line" />
        <img src={katana} alt="Katana Slice" className="katana-slice-img" />
        <div className="katana-slash__glyph">侍 SAMURAI</div>
      </div>

      {/* NAV */}
      <nav className="navbar">
        <div className="navbar__logo">
          <img src={logo} alt="Samurai" />
        </div>
        <ul className="navbar__links">
          <li>
            <a href="#blog" onClick={(e) => { e.preventDefault(); handleTransition('blog'); }}>
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>Blog</span>
            </a>
          </li>
          <li>
            <a href="#">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
              <span>News</span>
            </a>
          </li>
          <li>
            <a href="#">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 6L12 1l-10 5 10 5 10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              <span>Story</span>
            </a>
          </li>
          <li>
            <a href="#">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Profile</span>
            </a>
          </li>
        </ul>
        <button className="btn-login">Log In</button>
      </nav>

      {activeSection === 'hero' && (
        <section className="hero">
          {/* Floating particles */}
          <Particles />

          {/* LEFT */}
          <div className="hero__text">
            <h1 className="hero__title">SAMURAI</h1>
            <p className="hero__subtitle">Samurai were the hereditary military nobility and warrior caste of medieval and early-modern Japan from the 12th century until their abolition in the 1870s. They were known as the armed retainers of the daimyo (land-owning lords) and lived by a strict ethical code called Bushido ("the way of the warrior"), which emphasized honor, loyalty, discipline, and courage.</p>

            {/* ── Music Toggle Button ── */}
            <button
              className={`music-btn ${isPlaying ? 'music-btn--playing' : ''}`}
              onClick={onToggleMusic}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
              {/* Animated icon: bars when playing, note when paused */}
              <span className="music-btn__icon" aria-hidden="true">
                {isPlaying ? (
                  /* Equalizer bars animation */
                  <span className="music-bars">
                    <span className="music-bars__bar" />
                    <span className="music-bars__bar" />
                    <span className="music-bars__bar" />
                    <span className="music-bars__bar" />
                  </span>
                ) : (
                  /* Music note icon */
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                )}
              </span>
              <span className="music-btn__label">
                {isPlaying ? 'Playing' : 'Samurai Music'}
              </span>
            </button>
          </div>

          {/* CENTER */}
          <PersonSpotlight />

          {/* RIGHT */}
          <aside className="hero__sidebar">
            <div className="sidebar-block">
              <h3>About Samurai</h3>
              <p>All about history samurai</p>
            </div>
            <div className="sidebar-block">
              <h3>Samurai Topic</h3>
              <p>How samurai born in Japan</p>
            </div>
            <div className="sidebar-block">
              <h3>Samurai Trailer</h3>
              <div className="video-thumb">
                <img src={videoThumb} alt="Trailer thumbnail" />
                <div className="play-btn">
                  <span>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Scroll DOWN arrow ── */}
          <button
            className="scroll-arrow scroll-arrow--down"
            onClick={() => handleTransition('blog')}
            aria-label="Scroll to blog"
          >
            <span className="scroll-arrow__label">NEXT</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </section>
      )}

      {activeSection === 'blog' && (
        <Blog onScrollBack={() => handleTransition('hero')} />
      )}
    </div>
  )
}
