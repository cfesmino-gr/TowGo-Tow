import { useI18n } from '../i18n'
import { TruckMark } from './TruckIcon'

export function Services() {
  const { t } = useI18n()

  return (
    <section id="services">
      <div className="sec-inner">
        <div className="sec-label">{t.svc_label}</div>
        <div className="sec-title">{t.svc_title}</div>
        <div className="sec-sub">{t.svc_sub}</div>
        <div className="services-grid">
          <div className="svc-card">
            <div className="svc-icon">
              <TruckMark width={28} height={28} />
            </div>
            <div className="svc-name">{t.s_tow}</div>
            <div className="svc-price">{t.c_price_tow}</div>
          </div>
          <div className="svc-card">
            <div className="svc-icon">
              <i className="ti ti-bolt" style={{ fontSize: 24, color: '#4ade80' }} />
            </div>
            <div className="svc-name">{t.s_bat}</div>
            <div className="svc-price">{t.c_price_bat}</div>
          </div>
          <div className="svc-card">
            <div className="svc-icon">
              <i className="ti ti-tool" style={{ fontSize: 24, color: '#4ade80' }} />
            </div>
            <div className="svc-name">{t.s_tyr}</div>
            <div className="svc-price">{t.c_price_tyr}</div>
          </div>
          <div className="svc-card">
            <div className="svc-icon">
              <i className="ti ti-gas-station" style={{ fontSize: 24, color: '#4ade80' }} />
            </div>
            <div className="svc-name">{t.s_fue}</div>
            <div className="svc-price">{t.c_price_fue}</div>
          </div>
          <div className="svc-card">
            <div className="svc-icon">
              <i className="ti ti-building" style={{ fontSize: 24, color: '#4ade80' }} />
            </div>
            <div className="svc-name">{t.s_ins}</div>
            <div className="svc-price">{t.s_ins_price}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HowItWorks() {
  const { t } = useI18n()

  const steps = [
    { num: '1', title: t.how1_t, desc: t.how1_d },
    { num: '2', title: t.how2_t, desc: t.how2_d },
    { num: '3', title: t.how3_t, desc: t.how3_d },
    { num: '4', title: t.how4_t, desc: t.how4_d },
  ]

  return (
    <section id="how">
      <div className="sec-inner">
        <div className="sec-label">{t.how_label}</div>
        <div className="sec-title">{t.how_title}</div>
        <div className="steps-grid">
          {steps.map((step) => (
            <div className="step" key={step.num}>
              <div className="step-num">{step.num}</div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ForDrivers() {
  const { t } = useI18n()

  return (
    <section id="drivers">
      <div className="sec-inner">
        <div className="sec-label">{t.drv_label}</div>
        <div className="sec-title">{t.drv_title}</div>
        <div className="sec-sub">{t.drv_sub}</div>
        <div className="plans-grid">
          <div className="plan-card">
            <div className="plan-name">{t.p1_name}</div>
            <div className="plan-price">
              €0 <span>{t.per_mo}</span>
            </div>
            <div className="plan-comm">{t.p1_comm}</div>
            <ul className="plan-feats">
              <li>
                <i className="ti ti-check" /> <span>{t.pf_all}</span>
              </li>
              <li>
                <i className="ti ti-check" /> <span>{t.pf_pay}</span>
              </li>
              <li>
                <i className="ti ti-check" /> <span>{t.pf_prof}</span>
              </li>
              <li className="off">
                <i className="ti ti-x" /> <span>{t.pf_ins}</span>
              </li>
              <li className="off">
                <i className="ti ti-x" /> <span>{t.pf_pri}</span>
              </li>
            </ul>
            <button type="button" className="plan-btn">
              {t.p1_btn}
            </button>
          </div>

          <div className="plan-card featured">
            <div className="plan-pop">{t.most_pop}</div>
            <div className="plan-name">Pro</div>
            <div className="plan-price">
              €49 <span>{t.per_mo2}</span>
            </div>
            <div className="plan-comm">{t.p2_comm}</div>
            <ul className="plan-feats">
              <li>
                <i className="ti ti-check" /> <span>{t.pf_all2}</span>
              </li>
              <li>
                <i className="ti ti-check" /> <span>{t.pf_pri2}</span>
              </li>
              <li>
                <i className="ti ti-check" /> <span>{t.pf_ins2}</span>
              </li>
              <li>
                <i className="ti ti-check" /> <span>{t.pf_sup}</span>
              </li>
              <li>
                <i className="ti ti-check" /> <span>{t.pf_rep}</span>
              </li>
            </ul>
            <button type="button" className="plan-btn feat-btn">
              {t.p2_btn}
            </button>
          </div>

          <div className="plan-card">
            <div className="plan-name">Premium</div>
            <div className="plan-price">
              €99 <span>{t.per_mo3}</span>
            </div>
            <div className="plan-comm">{t.p3_comm}</div>
            <ul className="plan-feats">
              <li>
                <i className="ti ti-check" /> <span>{t.pf_pro}</span>
              </li>
              <li>
                <i className="ti ti-check" /> <span>{t.pf_top}</span>
              </li>
              <li>
                <i className="ti ti-check" /> <span>{t.pf_fleet}</span>
              </li>
              <li>
                <i className="ti ti-check" /> <span>{t.pf_mgr}</span>
              </li>
              <li>
                <i className="ti ti-check" /> <span>{t.pf_wk}</span>
              </li>
            </ul>
            <button type="button" className="plan-btn">
              {t.p3_btn}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Insurance() {
  const { t } = useI18n()

  const items = [
    { icon: 'ti-clock', title: t.ins1_t, desc: t.ins1_d },
    { icon: 'ti-camera', title: t.ins2_t, desc: t.ins2_d },
    { icon: 'ti-chart-bar', title: t.ins3_t, desc: t.ins3_d },
    { icon: 'ti-file-invoice', title: t.ins4_t, desc: t.ins4_d },
  ]

  return (
    <section id="insurance">
      <div className="sec-inner">
        <div className="sec-label">{t.ins_label}</div>
        <div className="sec-title">{t.ins_title}</div>
        <div className="sec-sub">{t.ins_sub}</div>
        <div className="ins-grid">
          {items.map((item) => (
            <div className="ins-item" key={item.title}>
              <div className="ins-ico">
                <i className={`ti ${item.icon}`} />
              </div>
              <div>
                <div className="ins-title">{item.title}</div>
                <div className="ins-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <br />
        <button type="button" className="btn-dk" style={{ padding: '12px 24px', fontSize: 14 }}>
          {t.ins_btn}
        </button>
      </div>
    </section>
  )
}

export function Coverage() {
  const { t } = useI18n()

  const countries = [
    { flag: '🇱🇻', name: t.c_lv, status: t.c_live, live: true },
    { flag: '🇬🇧', name: t.c_uk, status: t.c_soon, live: false },
    { flag: '🇪🇪', name: t.c_ee, status: t.c_soon2, live: false },
    { flag: '🇱🇹', name: t.c_lt, status: t.c_soon3, live: false },
    { flag: '🇩🇪', name: t.c_de, status: t.c_soon4, live: false },
    { flag: '🇮🇪', name: t.c_ie, status: t.c_soon5, live: false },
    { flag: '🇦🇪', name: t.c_ae, status: t.c_soon6, live: false },
    { flag: '🇸🇦', name: t.c_sa, status: t.c_soon7, live: false },
    { flag: '🇪🇬', name: t.c_eg, status: t.c_soon8, live: false },
  ]

  return (
    <section id="coverage">
      <div className="sec-inner">
        <div className="sec-label">{t.cov_label}</div>
        <div className="sec-title">{t.cov_title}</div>
        <div className="sec-sub">{t.cov_sub}</div>
        <div className="coverage-grid">
          {countries.map((country) => (
            <div className="country" key={country.name}>
              <div className="country-flag">{country.flag}</div>
              <div className="country-name">{country.name}</div>
              <div className={`country-status ${country.live ? 'c-live' : 'c-soon'}`}>
                {country.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  const { t } = useI18n()

  const reviews = [
    { initials: 'MR', name: 'Maris R.', role: t.t1_role, text: t.t1 },
    { initials: 'AK', name: 'Andris K.', role: t.t2_role, text: t.t2 },
    { initials: 'BL', name: 'Balta Insurance', role: t.t3_role, text: t.t3 },
  ]

  return (
    <section>
      <div className="sec-inner">
        <div className="sec-label">{t.rev_label}</div>
        <div className="sec-title">{t.rev_title}</div>
        <div className="testi-grid">
          {reviews.map((review) => (
            <div className="testi" key={review.initials}>
              <div className="testi-stars">★★★★★</div>
              <div className="testi-text">{review.text}</div>
              <div className="testi-author">
                <div className="testi-av">{review.initials}</div>
                <div>
                  <div className="testi-name">{review.name}</div>
                  <div className="testi-role">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Cta() {
  const { t } = useI18n()

  return (
    <div className="cta-sec">
      <h2 dangerouslySetInnerHTML={{ __html: t.cta_h }} />
      <p>{t.cta_p}</p>
      <div className="cta-btns">
        <button type="button" className="btn-cta-p">
          <i className="ti ti-brand-apple" /> <span>{t.cta_ios}</span>
        </button>
        <button type="button" className="btn-cta-p">
          <i className="ti ti-brand-google-play" /> <span>{t.cta_and}</span>
        </button>
        <button type="button" className="btn-cta-s">
          <i className="ti ti-truck" /> <span>{t.cta_drv}</span>
        </button>
      </div>
    </div>
  )
}

export function Footer() {
  const { t } = useI18n()

  return (
    <footer>
      <div className="footer-logo">
        Tow<span>Go</span>
      </div>
      <div className="footer-links">
        <a href="#about">{t.f_about}</a>
        <a href="#drivers">{t.f_drv}</a>
        <a href="#insurance">{t.f_ins}</a>
        <a href="#privacy">{t.f_priv}</a>
        <a href="#terms">{t.f_terms}</a>
        <a href="#contact">{t.f_contact}</a>
      </div>
      <div className="footer-copy">{t.f_rights}</div>
    </footer>
  )
}
