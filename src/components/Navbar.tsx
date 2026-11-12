import { languages, useI18n } from '../i18n'
import { TruckMark } from './TruckIcon'

function scrollToDemo() {
  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
}

export function Navbar() {
  const { lang, t, setLang } = useI18n()

  return (
    <nav>
      <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="logo-mark">
          <TruckMark width={18} height={14} viewBox="0 0 32 24" />
        </div>
        <div className="logo-txt">
          Tow<span>Go</span>
        </div>
      </div>
      <div className="nav-links">
        <a href="#services">{t.nav_svc}</a>
        <a href="#how">{t.nav_how}</a>
        <a href="#drivers">{t.nav_drv}</a>
        <a href="#insurance">{t.nav_ins}</a>
        <a href="#coverage">{t.nav_cov}</a>
      </div>
      <div className="nav-right">
        <div className="lang-sw">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`lang-btn${lang === l.code ? ' active' : ''}`}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button type="button" className="btn-out" onClick={scrollToDemo}>
          {t.nav_signin}
        </button>
        <button type="button" className="btn-dk" onClick={scrollToDemo}>
          {t.nav_getapp}
        </button>
      </div>
    </nav>
  )
}
