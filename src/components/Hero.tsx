import { useI18n } from '../i18n'

function scrollToDemo() {
  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
}

export function Hero() {
  const { t } = useI18n()

  const stats = [
    { value: '4.9★', label: t.stat1 },
    { value: '8 min', label: t.stat2 },
    { value: '12k+', label: t.stat3 },
    { value: '18', label: t.stat4 },
  ]

  return (
    <div className="hero">
      <div className="hero-badge">
        <div className="live-dot" /> <span>{t.hero_badge}</span>
      </div>
      <h1 dangerouslySetInnerHTML={{ __html: t.hero_h1 }} />
      <p className="hero-sub">{t.hero_sub}</p>
      <div className="hero-btns">
        <button type="button" className="btn-hero btn-hero-p" onClick={scrollToDemo}>
          <i className="ti ti-device-mobile" /> <span>{t.hero_btn1}</span>
        </button>
        <button type="button" className="btn-hero btn-hero-s" onClick={scrollToDemo}>
          <i className="ti ti-truck" /> <span>{t.hero_btn2}</span>
        </button>
      </div>
      <div className="hero-stats">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <div className="stat-val">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
