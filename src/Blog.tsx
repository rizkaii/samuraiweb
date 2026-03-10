import './Blog.css'

interface BlogPost {
  id: number
  category: string
  title: string
  excerpt: string
  readTime: string
  image: string
  featured?: boolean
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    category: 'BUSHIDO',
    title: 'The Way of the Warrior: Bushido Code Explained',
    excerpt: 'The samurai lived and died by the Bushido code — a strict ethical framework of honor, loyalty, and courage.',
    readTime: '5 min read',
    image: 'bushido',
    featured: true,
  },
  {
    id: 2,
    category: 'HISTORY',
    title: 'Rise of the Samurai Class in Feudal Japan',
    excerpt: 'How the samurai emerged as Japan\'s dominant military nobility from the 12th century onward.',
    readTime: '7 min read',
    image: 'history',
    featured: true,
  },
  {
    id: 3,
    category: 'WEAPONS',
    title: 'The Katana: Soul of the Samurai',
    excerpt: 'A deep dive into the forging, history, and spiritual significance of Japan\'s iconic blade.',
    readTime: '4 min read',
    image: 'katana',
    featured: true,
  },
  {
    id: 4,
    category: 'CULTURE',
    title: 'Zen Buddhism and the Samurai Mind',
    excerpt: 'Exploring the profound influence of Zen philosophy on samurai training and discipline.',
    readTime: '6 min read',
    image: 'zen',
  },
  {
    id: 5,
    category: 'BATTLES',
    title: 'The Last Stand at Shiroyama',
    excerpt: 'The final battle of the Satsuma Rebellion and the twilight of the samurai era.',
    readTime: '8 min read',
    image: 'battle',
  },
  {
    id: 6,
    category: 'LEGACY',
    title: 'How Samurai Culture Shaped Modern Japan',
    excerpt: 'Traces of Bushido in Japan\'s corporate ethics, martial arts, and national identity today.',
    readTime: '5 min read',
    image: 'legacy',
  },
]

// Gradient palettes per card (dark samurai theme with warm/cold accent)
const cardGradients: Record<string, string> = {
  bushido:  'linear-gradient(145deg, #1a0a00 0%, #3d1a00 50%, #5c2800 100%)',
  history:  'linear-gradient(145deg, #0a0a1a 0%, #1a1a3d 50%, #0d0d2b 100%)',
  katana:   'linear-gradient(145deg, #0a0a0a 0%, #1c1c1c 50%, #2a2a2a 100%)',
  zen:      'linear-gradient(145deg, #001a0a 0%, #003d1a 50%, #00280d 100%)',
  battle:   'linear-gradient(145deg, #1a000a 0%, #3d0014 50%, #280009 100%)',
  legacy:   'linear-gradient(145deg, #0a0a00 0%, #1a1a00 50%, #2a2806 100%)',
}

const cardAccents: Record<string, string> = {
  bushido: '#c8860a',
  history: '#4a6cf7',
  katana:  '#e0e0e0',
  zen:     '#2db87d',
  battle:  '#e04a4a',
  legacy:  '#c8c020',
}

// SVG pattern per card (subtle background decoration)
function CardPattern({ type }: { type: string }) {
  if (type === 'bushido') return (
    <svg className="card-pattern" viewBox="0 0 200 200" fill="none">
      <circle cx="150" cy="50" r="60" stroke="rgba(200,134,10,0.12)" strokeWidth="1"/>
      <circle cx="150" cy="50" r="40" stroke="rgba(200,134,10,0.08)" strokeWidth="1"/>
      <line x1="90" y1="0" x2="200" y2="120" stroke="rgba(200,134,10,0.07)" strokeWidth="1"/>
    </svg>
  )
  if (type === 'history') return (
    <svg className="card-pattern" viewBox="0 0 200 200" fill="none">
      <polygon points="100,10 190,70 190,140 100,190 10,140 10,70" stroke="rgba(74,108,247,0.12)" strokeWidth="1" fill="none"/>
      <polygon points="100,30 170,80 170,130 100,170 30,130 30,80" stroke="rgba(74,108,247,0.08)" strokeWidth="1" fill="none"/>
    </svg>
  )
  if (type === 'katana') return (
    <svg className="card-pattern" viewBox="0 0 200 200" fill="none">
      <line x1="10" y1="10" x2="190" y2="190" stroke="rgba(224,224,224,0.10)" strokeWidth="1"/>
      <line x1="10" y1="40" x2="160" y2="190" stroke="rgba(224,224,224,0.06)" strokeWidth="1"/>
      <line x1="40" y1="10" x2="190" y2="160" stroke="rgba(224,224,224,0.06)" strokeWidth="1"/>
    </svg>
  )
  return (
    <svg className="card-pattern" viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      <circle cx="100" cy="100" r="45" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
    </svg>
  )
}

interface BlogProps {
  onScrollBack: () => void
}

export default function Blog({ onScrollBack }: BlogProps) {
  const featured = blogPosts.filter(p => p.featured)
  const regular = blogPosts.filter(p => !p.featured)

  return (
    <section className="blog">
      {/* ── Scroll UP arrow ── */}
      <button
        className="scroll-arrow scroll-arrow--up"
        onClick={onScrollBack}
        aria-label="Back to hero"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
        <span className="scroll-arrow__label">Back</span>
      </button>

      {/* ── Header ── */}
      <div className="blog__header">
        <h1 className="blog__title">
          <span className="blog__title-en">Samurai</span>
          <span className="blog__title-accent">Chronicles.</span>
        </h1>
        <p className="blog__desc">Ancient stories, timeless wisdom — curated stories of Japan's legendary warrior class.</p>
      </div>

      {/* ── Featured grid (3 columns top row) ── */}
      <div className="blog__featured-grid">
        {featured.map((post, i) => (
          <article
            key={post.id}
            className={`blog-card blog-card--featured blog-card--${i === 1 ? 'tall' : 'normal'}`}
            style={{ background: cardGradients[post.image] }}
          >
            <CardPattern type={post.image} />
            <div className="blog-card__accent-line" style={{ background: cardAccents[post.image] }} />
            <div className="blog-card__content">
              <span className="blog-card__category" style={{ color: cardAccents[post.image] }}>
                {post.category}
              </span>
              <h2 className="blog-card__title">{post.title}</h2>
              <p className="blog-card__excerpt">{post.excerpt}</p>
              <button className="blog-card__btn" style={{ borderColor: cardAccents[post.image], color: cardAccents[post.image] }}>
                {post.readTime} →
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* ── Regular grid (3 columns bottom row) ── */}
      <div className="blog__grid">
        {regular.map(post => (
          <article
            key={post.id}
            className="blog-card blog-card--regular"
            style={{ background: cardGradients[post.image] }}
          >
            <CardPattern type={post.image} />
            <div className="blog-card__accent-line" style={{ background: cardAccents[post.image] }} />
            <div className="blog-card__content">
              <span className="blog-card__category" style={{ color: cardAccents[post.image] }}>
                {post.category}
              </span>
              <h2 className="blog-card__title">{post.title}</h2>
              <p className="blog-card__excerpt">{post.excerpt}</p>
              <button className="blog-card__btn" style={{ borderColor: cardAccents[post.image], color: cardAccents[post.image] }}>
                {post.readTime} →
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
