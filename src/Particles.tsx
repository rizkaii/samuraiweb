import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number      // horizontal drift
  vy: number      // upward velocity
  size: number    // radius px
  opacity: number
  maxOpacity: number
  phase: number   // twinkle phase offset
  gold: boolean   // gold ember vs white dust
  life: number    // 0→1 (born) → 1→0 (dying)
  lifeSpeed: number
}

const COUNT_DESKTOP = 90
const COUNT_MOBILE = 45

function createParticle(w: number, h: number): Particle {
  const gold = Math.random() < 0 // always white dust
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(0.2 + Math.random() * 0.5),   
    size: gold ? (0.8 + Math.random() * 1.6) : (0.4 + Math.random() * 1.2),
    opacity: 0,
    maxOpacity: gold ? (0.3 + Math.random() * 0.5) : (0.15 + Math.random() * 0.3),
    phase: Math.random() * Math.PI * 2,
    gold,
    life: 0,
    lifeSpeed: 0.002 + Math.random() * 0.004,
  }
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let w = 0, h = 0
    const particles: Particle[] = []

    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w
      canvas.height = h
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Seed initial particles spread across the full canvas
    const count = window.innerWidth < 768 ? COUNT_MOBILE : COUNT_DESKTOP
    for (let i = 0; i < count; i++) {
      const p = createParticle(w, h)
      p.life = Math.random()  // start at random life stage
      p.y = Math.random() * h
      particles.push(p)
    }

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      t++

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        // Move
        p.x += p.vx + Math.sin(t * 0.008 + p.phase) * 0.15
        p.y += p.vy
        p.life += p.lifeSpeed

        // Fade in (0→0.4) then fade out (0.4→1) based on life
        const norm = p.life < 0.4
          ? p.life / 0.4
          : 1 - (p.life - 0.4) / 0.6
        p.opacity = Math.max(0, norm * p.maxOpacity)

        // Twinkle
        const twinkle = 0.7 + 0.3 * Math.sin(t * 0.05 + p.phase)
        const finalOpacity = p.opacity * twinkle

        // Draw
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)

        if (p.gold) {
          // Gold ember with glow
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
          grd.addColorStop(0, `rgba(255,210,80,${finalOpacity})`)
          grd.addColorStop(1, `rgba(255,140,20,0)`)
          ctx.fillStyle = grd
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        } else {
          ctx.fillStyle = `rgba(255,255,255,${finalOpacity})`
        }
        ctx.fill()

        // Respawn when dead or out of bounds
        if (p.life >= 1 || p.y < -10 || p.x < -20 || p.x > w + 20) {
          particles[i] = createParticle(w, h)
          particles[i].y = h + 5  // born at bottom
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 8,   // above hero bg, below person (z-index 10)
      }}
      aria-hidden="true"
    />
  )
}
