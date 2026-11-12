import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import type { DispatchRequest } from '../types'
import { TruckMark } from './TruckIcon'

type Screen = 'jobs' | 'photos' | 'active' | 'earn'

function requestFrameScroll() {
  document.getElementById('phone-screen')?.scrollTo({ top: 0 })
}

export function DriverApp({ request }: { request: DispatchRequest }) {
  const { t } = useI18n()
  const [screen, setScreen] = useState<Screen>('jobs')
  const [photos, setPhotos] = useState<boolean[]>(Array(6).fill(false))
  const [online, setOnline] = useState(true)
  const [today, setToday] = useState(127)

  useEffect(() => {
    requestFrameScroll()
  }, [screen])

  const captured = photos.filter(Boolean).length
  const photoLabels = [t.ph_front, t.ph_rear, t.ph_drv, t.ph_pass, t.ph_dash, t.ph_ovr]
  const truckName =
    request.truck === 'Flatbed'
      ? t.tk_flat_name
      : request.truck === 'Hook & lift'
        ? t.tk_hook_name
        : request.truck === 'Heavy duty'
          ? t.tk_heavy_name
          : request.truck

  function snap(index: number) {
    setPhotos((current) => current.map((value, i) => (i === index ? true : value)))
  }

  function finishJob() {
    setToday((value) => value + request.earn)
    setPhotos(Array(6).fill(false))
    setScreen('jobs')
  }

  return (
    <>
      <div className="drv-hdr">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <TruckMark width={14} height={14} />
              <span style={{ fontSize: 17, fontWeight: 600, color: 'white' }}>
                Tow<span style={{ color: '#4ade80' }}>Go</span>{' '}
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
                  {t.d_driver}
                </span>
              </span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
              Andris K. · Toyota Hilux
            </div>
          </div>
          <div className="drv-toggle" onClick={() => setOnline((value) => !value)}>
            <div
              className="drv-tog-dot"
              style={{
                background: online ? '#4ade80' : '#888',
                animation: online ? 'pulse 2s infinite' : 'none',
              }}
            />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>
              {online ? t.d_online : t.d_offline}
            </span>
          </div>
        </div>
        <div className="drv-earn-grid">
          <div className="drv-earn-box">
            <div className="drv-earn-val">€{today}</div>
            <div className="drv-earn-lbl">{t.d_today}</div>
          </div>
          <div className="drv-earn-box">
            <div className="drv-earn-val">6</div>
            <div className="drv-earn-lbl">{t.d_jobs_label}</div>
          </div>
          <div className="drv-earn-box">
            <div className="drv-earn-val">4.9★</div>
            <div className="drv-earn-lbl">{t.d_rating_label}</div>
          </div>
        </div>
        <div className="drv-plan-pill">
          <i className="ti ti-star" style={{ fontSize: 10, color: '#4ade80' }} />
          <span className="drv-plan-txt">{t.d_plan_pro}</span>
        </div>
      </div>

      {screen === 'jobs' && (
        <div className="app-screen active" style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 3, marginTop: 2 }}>
            {t.d_incoming}
          </div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 12 }}>{t.d_tap}</div>
          <div className="drv-job-card new" onClick={() => setScreen('photos')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
              <div className="drv-job-svc">
                <TruckMark width={18} height={18} wheel="#fff" />
                <span>{t.d_towing}</span> <span className="badge-new">{t.d_new}</span>
                {request.accident && (
                  <span
                    style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '2px 7px',
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    <i className="ti ti-alert-triangle" style={{ fontSize: 10 }} /> {t.d_accident}
                  </span>
                )}
              </div>
              <div className="drv-job-earn">+€{request.earn}</div>
            </div>
            <div className="drv-job-row">
              <i className="ti ti-map-pin" style={{ fontSize: 12 }} /> {t.d_job1_addr}
            </div>
            <div className="drv-job-row">
              <i className="ti ti-truck" style={{ fontSize: 12 }} /> <span>{t.d_truck_req}</span>{' '}
              <span style={{ fontWeight: 600, color: '#111' }}>{truckName}</span>
            </div>
            <div className="drv-job-row">
              <i className="ti ti-building" style={{ fontSize: 12 }} />{' '}
              <span style={{ color: '#3b82f6' }}>{t.d_balta}</span>
            </div>
            {request.note && (
              <div
                style={{
                  marginTop: 6,
                  padding: '7px 9px',
                  background: '#f8f9fa',
                  borderRadius: 7,
                  fontSize: 11,
                  color: '#555',
                  display: 'flex',
                  gap: 6,
                }}
              >
                <i className="ti ti-note" style={{ fontSize: 13, color: '#888', flexShrink: 0, marginTop: 1 }} />
                <span>{request.note}</span>
              </div>
            )}
            <div className="drv-job-actions">
              <button
                type="button"
                className="drv-btn-acc"
                onClick={(event) => {
                  event.stopPropagation()
                  setScreen('photos')
                }}
              >
                {t.d_accept}
              </button>
              <button type="button" className="drv-btn-dec" onClick={(event) => event.stopPropagation()}>
                {t.d_decline}
              </button>
            </div>
          </div>
          <div className="drv-job-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
              <div className="drv-job-svc">
                <i className="ti ti-bolt" style={{ fontSize: 14, color: '#4ade80' }} />{' '}
                <span>{t.d_battery}</span>
              </div>
              <div className="drv-job-earn">+€28</div>
            </div>
            <div className="drv-job-row">
              <i className="ti ti-map-pin" style={{ fontSize: 12 }} /> {t.d_job2_addr}
            </div>
            <div className="drv-job-row">
              <i className="ti ti-user" style={{ fontSize: 12 }} /> <span>{t.d_direct}</span>
            </div>
            <div className="drv-job-actions">
              <button type="button" className="drv-btn-acc" onClick={() => setScreen('photos')}>
                {t.d_accept2}
              </button>
              <button type="button" className="drv-btn-dec">
                {t.d_decline2}
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === 'photos' && (
        <div className="app-screen active" style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 3, marginTop: 2 }}>
            {t.d_doc}
          </div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>{t.d_req_photos}</div>
          <div
            style={{
              height: 3,
              background: '#f1f3f5',
              borderRadius: 2,
              marginBottom: 10,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: '#4ade80',
                borderRadius: 2,
                transition: 'width 0.4s',
                width: `${(captured / 6) * 100}%`,
              }}
            />
          </div>
          <div className="drv-photo-grid">
            {photoLabels.map((label, index) => (
              <div
                key={label}
                className={`drv-ps${photos[index] ? ' done' : ''}`}
                onClick={() => snap(index)}
              >
                <i
                  className={`ti ${photos[index] ? 'ti-check' : 'ti-camera'}`}
                  style={{ fontSize: 18, color: photos[index] ? '#16a34a' : '#888' }}
                />
                <div className="drv-ps-lbl">{label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>
            <span style={{ color: '#111', fontWeight: 600 }}>{captured}</span>/6 {t.d_captured}
          </div>
          <button
            type="button"
            className="app-btn-p"
            disabled={captured < 6}
            onClick={() => setScreen('active')}
          >
            {t.d_start}
          </button>
          <button type="button" className="app-btn-s" onClick={() => setScreen('jobs')}>
            {t.d_back}
          </button>
        </div>
      )}

      {screen === 'active' && (
        <div className="app-screen active" style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 2, marginTop: 2 }}>
            {t.d_in_prog}
          </div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>{t.d_tow_balta}</div>
          {request.accident && (
            <div
              style={{
                border: '0.5px solid #fde68a',
                background: '#fffbeb',
                borderRadius: 10,
                padding: '9px 11px',
                marginBottom: 10,
                fontSize: 11,
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
              }}
            >
              <i className="ti ti-alert-triangle" style={{ fontSize: 14 }} />{' '}
              <span>{t.d_acc_flag}</span>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '0.5px solid #e5e7eb',
              borderRadius: 10,
              padding: 11,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#1a1a2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4ade80',
                fontSize: 12,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              MR
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>Maris R.</div>
              <div style={{ fontSize: 11, color: '#888' }}>{t.d_car_grey}</div>
              <div style={{ fontSize: 10, color: '#3b82f6', marginTop: 2 }}>{t.d_ref}: BLT-2026-441</div>
            </div>
            <button
              type="button"
              aria-label={t.d_call}
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: '#1a1a2e',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <i className="ti ti-phone" style={{ fontSize: 12, color: '#4ade80' }} />
            </button>
          </div>
          {request.note && (
            <div
              style={{
                border: '0.5px solid #e5e7eb',
                borderRadius: 10,
                padding: '10px 11px',
                marginBottom: 10,
                fontSize: 12,
                color: '#555',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: 600,
                  color: '#111',
                  marginBottom: 3,
                }}
              >
                <i className="ti ti-note" style={{ fontSize: 13, color: '#888' }} />{' '}
                <span>{t.d_customer_note}</span>
              </div>
              <div>{request.note}</div>
            </div>
          )}
          <div style={{ border: '0.5px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
            <div
              style={{
                padding: '8px 11px',
                borderBottom: '0.5px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'rgba(74,222,128,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i className="ti ti-check" style={{ fontSize: 11, color: '#16a34a' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{t.d_step1}</div>
                <div style={{ fontSize: 10, color: '#888' }}>{t.d_photos_confirmed}</div>
              </div>
            </div>
            <div
              style={{
                padding: '8px 11px',
                borderBottom: '0.5px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#1a1a2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i className="ti ti-navigation" style={{ fontSize: 11, color: '#4ade80' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{t.d_step2}</div>
                <div style={{ fontSize: 10, color: '#888' }}>{t.d_km_dest}</div>
              </div>
            </div>
            <div
              style={{
                padding: '8px 11px',
                borderBottom: '0.5px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#f1f3f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 11,
                  color: '#888',
                  fontWeight: 600,
                }}
              >
                3
              </div>
              <div style={{ fontSize: 12, color: '#111' }}>{t.d_step3}</div>
            </div>
            <div style={{ padding: '8px 11px', display: 'flex', alignItems: 'center', gap: 9 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#f1f3f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 11,
                  color: '#888',
                  fontWeight: 600,
                }}
              >
                4
              </div>
              <div style={{ fontSize: 12, color: '#111' }}>{t.d_step4}</div>
            </div>
          </div>
          <button type="button" className="app-btn-p" onClick={finishJob}>
            {t.d_deliver}
          </button>
        </div>
      )}

      {screen === 'earn' && (
        <div className="app-screen active" style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 3, marginTop: 2 }}>
            {t.d_earnings}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12, marginTop: 10 }}>
            <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 11 }}>
              <div style={{ fontSize: 11, color: '#888' }}>{t.d_week}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#111', marginTop: 2 }}>€641</div>
            </div>
            <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 11 }}>
              <div style={{ fontSize: 11, color: '#888' }}>{t.d_month}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#111', marginTop: 2 }}>€2,180</div>
            </div>
          </div>
          <div style={{ border: '0.5px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
            <div
              style={{
                padding: '8px 12px',
                fontSize: 10,
                fontWeight: 600,
                color: '#888',
                borderBottom: '0.5px solid #e5e7eb',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {t.d_recent}
            </div>
            <div
              style={{
                padding: '8px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '0.5px solid #e5e7eb',
              }}
            >
              <span style={{ fontSize: 12, color: '#888' }}>{t.c_today_jobs}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>+€{today}</span>
            </div>
            <div
              style={{
                padding: '8px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '0.5px solid #e5e7eb',
              }}
            >
              <span style={{ fontSize: 12, color: '#888' }}>{t.d_pay1}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>+€108</span>
            </div>
            <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#888' }}>{t.d_pay2}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>+€156</span>
            </div>
          </div>
        </div>
      )}

      <div className="app-nav">
        {[
          { key: 'jobs', icon: 'ti-list', label: t.dn_jobs },
          { key: 'active', icon: 'ti-navigation', label: t.dn_active },
          { key: 'earn', icon: 'ti-wallet', label: t.dn_earn },
        ].map((item) => (
          <div
            key={item.key}
            className={`app-nav-item${screen === item.key ? ' active' : ''}`}
            onClick={() => setScreen(item.key as Screen)}
          >
            <i className={`ti ${item.icon}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
