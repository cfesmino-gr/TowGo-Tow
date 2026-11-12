import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import type { DispatchRequest } from '../types'
import { FlatbedMark, TruckMark } from './TruckIcon'

type ServiceId = 'Towing' | 'Battery jump' | 'Tire change' | 'Fuel delivery'
type Screen = 'home' | 'truck' | 'confirm' | 'track' | 'complete' | 'hist' | 'prof'
type Stage = 'enroute' | 'arrived' | 'complete'
type Trip = { id: number; icon: string; name: string; date: string; price: number }

const EARNINGS: Record<string, number> = { Flatbed: 72, 'Hook & lift': 68, 'Heavy duty': 95 }

function requestFrameScroll() {
  document.getElementById('phone-screen')?.scrollTo({ top: 0 })
}

export function CustomerApp({ onRequest }: { onRequest: (request: DispatchRequest) => void }) {
  const { t } = useI18n()
  const [screen, setScreen] = useState<Screen>('home')
  const [service, setService] = useState<ServiceId | null>(null)
  const [truck, setTruck] = useState('Flatbed')
  const [accident, setAccident] = useState(false)
  const [accidentChips, setAccidentChips] = useState<string[]>([])
  const [insurance, setInsurance] = useState(false)
  const [insCompany, setInsCompany] = useState('Balta Insurance')
  const [policy, setPolicy] = useState('')
  const [note, setNote] = useState('')
  const [eta, setEta] = useState(8)
  const [stage, setStage] = useState<Stage>('enroute')
  const [rating, setRating] = useState(0)
  const [newTrips, setNewTrips] = useState<Trip[]>([])
  const [tripId, setTripId] = useState(0)
  const [activeNav, setActiveNav] = useState('home')

  const services: { id: ServiceId; name: string; price: string; base: number }[] = [
    { id: 'Towing', name: t.svc_tow, price: t.c_price_tow, base: 85 },
    { id: 'Battery jump', name: t.svc_bat, price: t.c_price_bat, base: 35 },
    { id: 'Tire change', name: t.svc_tyr, price: t.c_price_tyr, base: 45 },
    { id: 'Fuel delivery', name: t.svc_fue, price: t.c_price_fue, base: 30 },
  ]

  const trucks = [
    {
      id: 'Flatbed',
      name: t.tk_flat_name,
      meta: t.tk_flat_meta,
      price: 89,
      eta: t.tk_eta_flat,
      badge: t.tk_rec,
      tone: 'green',
    },
    {
      id: 'Hook & lift',
      name: t.tk_hook_name,
      meta: t.tk_hook_meta,
      price: 83,
      eta: t.tk_eta_hook,
      badge: '',
      tone: 'green',
    },
    {
      id: 'Heavy duty',
      name: t.tk_heavy_name,
      meta: t.tk_heavy_meta,
      price: 115,
      eta: t.tk_eta_heavy,
      badge: t.tk_plus15,
      tone: 'red',
    },
  ]

  const selectedService = services.find((s) => s.id === service)
  const selectedTruck = trucks.find((tr) => tr.id === truck) ?? trucks[0]
  const isTowing = service === 'Towing'
  const basePrice = isTowing ? selectedTruck.price : (selectedService?.base ?? 0)
  const total = insurance && isTowing ? 4 : basePrice + 4
  const serviceName = selectedService?.name ?? ''
  const progress =
    stage === 'complete' ? 100 : stage === 'arrived' ? 75 : Math.min(25 + (8 - eta) * 9, 55)

  useEffect(() => {
    requestFrameScroll()
  }, [screen])

  useEffect(() => {
    if (screen !== 'track') return
    if (stage === 'enroute' && eta > 1) {
      const timer = window.setTimeout(() => setEta((value) => value - 1), 1500)
      return () => window.clearTimeout(timer)
    }
    if (stage === 'enroute') {
      const timer = window.setTimeout(() => setStage('arrived'), 600)
      return () => window.clearTimeout(timer)
    }
    if (stage === 'arrived') {
      const timer = window.setTimeout(() => setStage('complete'), 2200)
      return () => window.clearTimeout(timer)
    }
  }, [screen, stage, eta])

  function resetCustomer() {
    setService(null)
    setTruck('Flatbed')
    setAccident(false)
    setAccidentChips([])
    setInsurance(false)
    setInsCompany('Balta Insurance')
    setPolicy('')
    setNote('')
    setEta(8)
    setStage('enroute')
    setRating(0)
  }

  function pickService(id: ServiceId) {
    setService(id)
    if (id === 'Towing') {
      setScreen('truck')
    } else {
      setScreen('confirm')
    }
  }

  function toggleAccident() {
    const next = !accident
    setAccident(next)
    if (next && truck === 'Hook & lift') setTruck('Flatbed')
    if (!next) setAccidentChips([])
  }

  function appendNote(text: string) {
    setNote((value) => {
      if (value.length === 0) return text
      if (!value.endsWith(' ') && !value.endsWith('\n')) return `${value}. ${text}`
      return value + text
    })
  }

  function toggleAccidentChip(chip: string) {
    if (accidentChips.includes(chip)) {
      setAccidentChips(accidentChips.filter((item) => item !== chip))
      setNote((value) => value.replace(`. ${chip}`, '').replace(chip, ''))
    } else {
      setAccidentChips([...accidentChips, chip])
      appendNote(chip)
    }
  }

  function openConfirm() {
    setScreen('confirm')
  }

  function backFromConfirm() {
    setScreen(isTowing ? 'truck' : 'home')
  }

  function requestDriver() {
    if (isTowing) {
      onRequest({ truck, accident, note: note.trim(), earn: EARNINGS[truck] ?? 72 })
    }
    setEta(8)
    setStage('enroute')
    setScreen('track')
  }

  function cancelRequest() {
    resetCustomer()
    setActiveNav('home')
    setScreen('home')
  }

  function finishTrip() {
    const nextId = tripId + 1
    setTripId(nextId)
    setNewTrips((trips) => [
      {
        id: nextId,
        icon:
          service === 'Battery jump'
            ? '⚡'
            : service === 'Tire change'
              ? '🔧'
              : service === 'Fuel delivery'
                ? '⛽'
                : '🚛',
        name: serviceName,
        date: t.c_just_now,
        price: total,
      },
      ...trips,
    ])
    resetCustomer()
    setActiveNav('hist')
    setScreen('hist')
  }

  const navigation = [
    { key: 'home', target: 'home', icon: 'ti-home', label: t.nav_home },
    { key: 'hist', target: 'hist', icon: 'ti-history', label: t.nav_trips },
    { key: 'chat', target: 'prof', icon: 'ti-message-circle', label: t.nav_sup },
    { key: 'prof', target: 'prof', icon: 'ti-user', label: t.nav_profile },
  ] as const
  const navActive =
    screen === 'home' || screen === 'hist' ? screen : screen === 'prof' ? activeNav : ''

  const step2Label = stage === 'enroute' ? t.c_step2 : t.c_step2_arrived
  const step2Sub =
    stage === 'enroute' ? `~${eta} ${t.c_min_short}` : stage === 'arrived' ? t.c_on_site : ''
  const step3Sub = stage === 'arrived' ? t.c_in_progress_now : stage === 'complete' ? t.c_32min : ''
  const step4Sub = stage === 'complete' ? `€${total} ${t.c_charged}` : ''
  const trackTitle =
    stage === 'enroute' ? t.c_on_way : stage === 'arrived' ? t.c_service_prog : t.c_all_done
  const trackSub =
    stage === 'enroute'
      ? t.c_tracking
      : stage === 'arrived'
        ? t.c_andris_working
        : t.c_payment_processed

  const trips = [
    { id: -1, icon: '🚛', name: t.svc_tow, date: t.c_trip1_date, price: 89 },
    { id: -2, icon: '⚡', name: t.svc_bat, date: t.c_trip2_date, price: 39 },
    { id: -3, icon: '🔧', name: t.svc_tyr, date: t.c_trip3_date, price: 49 },
  ]

  return (
    <>
      <div className="app-hdr">
        <div className="app-hdr-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <TruckMark width={14} height={14} />
            <div className="app-logo">
              Tow<span>Go</span>
            </div>
          </div>
          <span
            style={{
              background: 'rgba(74,222,128,0.15)',
              color: '#4ade80',
              fontSize: 11,
              padding: '3px 8px',
              borderRadius: 6,
              fontWeight: 600,
            }}
            >
            {t.app_live}
          </span>
        </div>
        <div className="app-tagline">{t.app_tagline}</div>
        <div className="app-status">
          <div className="app-dot" />
          <span className="app-status-txt">{t.app_status}</span>
        </div>
      </div>

      {screen === 'home' && (
        <div className="app-screen active" style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 4, marginTop: 2 }}>
            {t.c_what}
          </div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 12 }}>{t.c_select}</div>
          <div className="app-svc-grid">
            {services.map((item) => (
              <div
                key={item.id}
                className={`app-svc-card${service === item.id ? ' sel' : ''}`}
                onClick={() => pickService(item.id)}
              >
                <div className="app-svc-icon">
                  {item.id === 'Towing' ? (
                    <TruckMark width={32} height={32} color="#111" wheel="#fff" />
                  ) : item.id === 'Battery jump' ? (
                    '⚡'
                  ) : item.id === 'Tire change' ? (
                    '🔧'
                  ) : (
                    '⛽'
                  )}
                </div>
                <div className="app-svc-name">{item.name}</div>
                <div className="app-svc-price">{item.price}</div>
              </div>
            ))}
          </div>
          <div className="app-map">
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}
              viewBox="0 0 300 110"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id="g1" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path
                    d="M30 0L0 0 0 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="300" height="110" fill="url(#g1)" />
            </svg>
            <div className="app-map-ring" />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-60%)',
                fontSize: 22,
              }}
            >
              📍
            </div>
          </div>
          <div className="app-loc">
            <div className="app-loc-ic">
              <i className="ti ti-current-location" style={{ fontSize: 16, color: '#4ade80' }} />
            </div>
            <div>
              <div className="app-loc-lbl">{t.loc_lbl}</div>
              <div className="app-loc-val">{t.c_address}</div>
            </div>
            <i className="ti ti-chevron-right" style={{ marginLeft: 'auto', color: '#aaa' }} />
          </div>
        </div>
      )}

      {screen === 'truck' && (
        <div className="app-screen active" style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 3, marginTop: 2 }}>
            {t.c_truck_title}
          </div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 12 }}>{t.c_truck_sub}</div>

          <div
            className={`acc-toggle${accident ? ' on' : ''}`}
            onClick={toggleAccident}
          >
            <div className="acc-row">
              <div className="acc-icon">
                <i
                  className="ti ti-alert-triangle"
                  style={{ fontSize: 16, color: accident ? '#4ade80' : '#888' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{t.c_acc_title}</div>
                <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{t.c_acc_sub}</div>
              </div>
              <div className={`acc-switch${accident ? ' on' : ''}`}>
                <div className="acc-knob" />
              </div>
            </div>
            <div className={`acc-extra${accident ? ' show' : ''}`}>
              <div
                style={{
                  fontSize: 11,
                  color: '#b45309',
                  display: 'flex',
                  gap: 6,
                  marginBottom: 9,
                  lineHeight: 1.5,
                }}
              >
                <i
                  className="ti ti-info-circle"
                  style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}
                />
                <span>{t.c_acc_info}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[t.chip1, t.chip2, t.chip3, t.chip4].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className={`acc-chip${accidentChips.includes(chip) ? ' on' : ''}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleAccidentChip(chip)
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`acc-toggle${insurance ? ' ins-on' : ''}`} onClick={() => setInsurance((v) => !v)}>
            <div className="acc-row">
              <div className="acc-icon">
                <i className="ti ti-building" style={{ fontSize: 16, color: insurance ? '#4ade80' : '#888' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{t.c_ins_title}</div>
                <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{t.c_ins_sub}</div>
              </div>
              <div className={`acc-switch${insurance ? ' on' : ''}`}>
                <div className="acc-knob" />
              </div>
            </div>
            <div className={`acc-extra${insurance ? ' show' : ''}`}>
              <div
                style={{
                  fontSize: 11,
                  color: '#1e40af',
                  display: 'flex',
                  gap: 6,
                  marginBottom: 9,
                  lineHeight: 1.5,
                }}
              >
                <i
                  className="ti ti-info-circle"
                  style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}
                />
                <span>{t.c_ins_info}</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: '#888', marginBottom: 4 }}>{t.c_ins_company}</div>
                <select
                  value={insCompany}
                  onChange={(event) => setInsCompany(event.target.value)}
                  onClick={(event) => event.stopPropagation()}
                  style={{
                    width: '100%',
                    border: '0.5px solid #e5e7eb',
                    borderRadius: 8,
                    padding: '8px 10px',
                    fontSize: 12,
                    color: '#111',
                    background: '#fff',
                  }}
                >
                  <option value="Balta Insurance">Balta Insurance</option>
                  <option value="ERGO Latvia">ERGO Latvia</option>
                  <option value="BTA Insurance">BTA Insurance</option>
                  <option value="Other">{t.c_ins_other}</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#888', marginBottom: 4 }}>{t.c_ins_policy}</div>
                <input
                  type="text"
                  value={policy}
                  placeholder={t.c_policy_ph}
                  onChange={(event) => setPolicy(event.target.value)}
                  onClick={(event) => event.stopPropagation()}
                  style={{
                    width: '100%',
                    border: '0.5px solid #e5e7eb',
                    borderRadius: 8,
                    padding: '8px 10px',
                    fontSize: 12,
                    color: '#111',
                    background: '#fff',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 600, color: '#111', marginBottom: 8 }}>
            {t.c_avail_trucks}
          </div>
          {trucks
            .filter((item) => !(accident && item.id === 'Hook & lift'))
            .map((item) => (
              <div
                key={item.id}
                className={`truck-card${truck === item.id ? ' sel' : ''}`}
                onClick={() => setTruck(item.id)}
              >
                <div
                  className="truck-ic"
                  style={item.tone === 'red' ? { background: '#fee2e2' } : undefined}
                >
                  {item.id === 'Hook & lift' ? (
                    <TruckMark width={22} height={22} viewBox="0 0 32 32" wheel="#fff" />
                  ) : (
                    <FlatbedMark
                      width={24}
                      height={18}
                      color={item.tone === 'red' ? '#dc2626' : '#4ade80'}
                      wheel={item.tone === 'red' ? '#fee2e2' : '#1a1a2e'}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>
                    <span>{item.name}</span>{' '}
                    {item.badge && (
                      <span
                        className="badge-new"
                        style={item.tone === 'red' ? { background: '#fef3c7', color: '#92400e' } : undefined}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{item.meta}</div>
                  <div style={{ fontSize: 10, color: '#16a34a', marginTop: 2 }}>
                    <i className="ti ti-clock" style={{ fontSize: 11 }} /> {item.eta}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>€{item.price}</div>
                  <div style={{ fontSize: 9, color: '#888' }}>{t.tk_est}</div>
                </div>
              </div>
            ))}

          <div style={{ marginTop: 6, marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#111', marginBottom: 6 }}>
              {t.c_note_label} <span style={{ fontWeight: 400, color: '#888' }}>{t.c_note_opt}</span>
            </div>
            <textarea
              value={note}
              maxLength={200}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t.c_note_ph}
              style={{
                width: '100%',
                border: `0.5px solid ${accident ? '#f59e0b' : '#e5e7eb'}`,
                borderRadius: 10,
                padding: '10px 11px',
                fontSize: 12,
                color: '#111',
                background: '#fff',
                resize: 'none',
                minHeight: 58,
              }}
            />
            <div style={{ fontSize: 9, color: '#888', textAlign: 'right', marginTop: 3 }}>
              {note.length}/200
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {[t.nchip1, t.nchip2, t.nchip3, t.nchip4].map((chip) => (
                <button key={chip} type="button" className="note-chip" onClick={() => appendNote(chip)}>
                  {chip}
                </button>
              ))}
            </div>
          </div>
          <div className="acc-disclaimer" style={{ display: accident ? 'flex' : 'none' }}>
            <i className="ti ti-info-circle" style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }} />
            <span>{t.c_disclaimer}</span>
          </div>

          <button type="button" className="app-btn-p" onClick={openConfirm}>
            {t.c_continue_truck} {selectedTruck.name} →
          </button>
          <button type="button" className="app-btn-s" onClick={() => setScreen('home')}>
            {t.c_back_svc}
          </button>
        </div>
      )}

      {screen === 'confirm' && (
        <div className="app-screen active" style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 3, marginTop: 2 }}>
            {t.c_confirm_title}
          </div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 12 }}>
            {isTowing
              ? `${serviceName} · ${selectedTruck.name} · ${t.c_address_short}`
              : `${serviceName} · ${t.c_address_short}`}
          </div>
          {(service === 'Battery jump' || service === 'Fuel delivery') && (
            <div
              style={{
                border: '0.5px solid #e5e7eb',
                background: '#f8f9fa',
                borderRadius: 10,
                padding: '10px 11px',
                marginBottom: 10,
                fontSize: 11,
                color: '#555',
                display: 'flex',
                gap: 7,
              }}
            >
              <i className="ti ti-info-circle" style={{ fontSize: 14, color: '#888', flexShrink: 0, marginTop: 1 }} />
              <span>{service === 'Battery jump' ? t.c_disc_battery : t.c_disc_fuel}</span>
            </div>
          )}
          <div style={{ border: '0.5px solid #e5e7eb', borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div className="app-confirm-row">
              <span style={{ fontSize: 12, color: '#888' }}>{t.c_svc}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{serviceName}</span>
            </div>
            {isTowing && (
              <div className="app-confirm-row">
                <span style={{ fontSize: 12, color: '#888' }}>{t.c_truck_type}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{selectedTruck.name}</span>
              </div>
            )}
            <div className="app-confirm-row">
              <span style={{ fontSize: 12, color: '#888' }}>
                {insurance && isTowing ? t.c_base_billed : t.c_base}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>€{basePrice}</span>
            </div>
            <div className="app-confirm-row">
              <span style={{ fontSize: 12, color: '#888' }}>{t.c_platform}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>€4</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 9 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>
                {insurance && isTowing ? t.c_you_pay : t.c_total}
              </span>
              <span style={{ fontSize: 17, fontWeight: 600, color: '#111' }}>€{total}</span>
            </div>
          </div>
          {insurance && isTowing && (
            <div
              style={{
                border: '0.5px solid #bfdbfe',
                background: '#eff6ff',
                borderRadius: 10,
                padding: '10px 11px',
                marginBottom: 10,
                fontSize: 11,
                color: '#1e40af',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, marginBottom: 3 }}>
                <i className="ti ti-building" style={{ fontSize: 13 }} /> <span>{t.c_ins_flagged}</span>
              </div>
              <div style={{ opacity: 0.85 }}>
                {insCompany} · {t.c_ins_policy_lbl} {policy.trim() || '—'} · €{selectedTruck.price}{' '}
                {t.c_ins_billed_to}
              </div>
            </div>
          )}
          {accident && isTowing && (
            <div
              style={{
                border: '0.5px solid #fde68a',
                background: '#fffbeb',
                borderRadius: 10,
                padding: '10px 11px',
                marginBottom: 10,
                fontSize: 11,
                color: '#92400e',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, marginBottom: 3 }}>
                <i className="ti ti-alert-triangle" style={{ fontSize: 13 }} />{' '}
                <span>{t.c_acc_flagged}</span>
              </div>
              <div style={{ opacity: 0.85 }}>{note.trim() || t.d_no_details}</div>
            </div>
          )}
          {isTowing && note.trim() && !accident && (
            <div
              style={{
                border: '0.5px solid #e5e7eb',
                borderRadius: 10,
                padding: '10px 11px',
                marginBottom: 10,
                fontSize: 11,
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
                <span>{t.c_note_to_driver}</span>
              </div>
              <div>{note.trim()}</div>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: '0.5px solid #e5e7eb',
              borderRadius: 10,
              padding: 11,
              marginBottom: 10,
            }}
          >
            <i className="ti ti-credit-card" style={{ fontSize: 17, color: '#888' }} />
            <span style={{ fontSize: 12, color: '#111', flex: 1 }}>Visa ···· 4821</span>
            <span
              style={{
                background: '#dbeafe',
                color: '#1e40af',
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: 6,
              }}
            >
              {t.c_default}
            </span>
          </div>
          <button type="button" className="app-btn-p" onClick={requestDriver}>
            {t.c_req_drv}
          </button>
          <button type="button" className="app-btn-s" onClick={backFromConfirm}>
            {t.c_back}
          </button>
        </div>
      )}

      {screen === 'track' && (
        <div className="app-screen active" style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 2, marginTop: 2 }}>
            {trackTitle}
          </div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>{trackSub}</div>
          <div className="app-driver-card">
            <div className="app-drv-av">AK</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Andris K.</div>
              <div style={{ fontSize: 11, color: '#888' }}>Toyota Hilux · AB-1234</div>
              <div style={{ fontSize: 11, color: '#111', marginTop: 2 }}>
                <span style={{ color: '#4ade80' }}>★★★★★</span> 4.9
              </div>
            </div>
            {stage === 'enroute' && (
              <div className="app-eta-box">
                <div className="app-eta-num">{eta}</div>
                <div className="app-eta-lbl">{t.c_min}</div>
              </div>
            )}
          </div>
          <div className="app-map" style={{ height: 90 }}>
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}
              viewBox="0 0 300 90"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id="g2" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path
                    d="M30 0L0 0 0 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="300" height="90" fill="url(#g2)" />
              <path
                d="M40,70 Q110,35 155,45 Q200,55 250,18"
                stroke="#4ade80"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,3"
              />
              <circle cx="40" cy="70" r="5" fill="#4ade80" />
              <circle cx="250" cy="18" r="5" fill="#4ade80" opacity="0.5" />
            </svg>
          </div>
          <div className="app-prog" style={{ marginTop: 10 }}>
            <div className="app-prog-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="app-step">
            <div className="app-step-dot done">
              <i className="ti ti-check" style={{ fontSize: 11 }} />
            </div>
            <div>
              <div className="app-step-lbl">{t.c_step1}</div>
            </div>
          </div>
          <div className="app-step">
            <div className={`app-step-dot ${stage === 'enroute' ? 'act' : 'done'}`}>
              {stage === 'enroute' ? (
                <i className="ti ti-navigation" style={{ fontSize: 11 }} />
              ) : (
                <i className="ti ti-check" style={{ fontSize: 11 }} />
              )}
            </div>
            <div>
              <div className="app-step-lbl">{step2Label}</div>
              {step2Sub && <div className="app-step-sub">{step2Sub}</div>}
            </div>
          </div>
          <div className="app-step">
            <div className={`app-step-dot ${stage === 'arrived' ? 'act' : stage === 'complete' ? 'done' : 'pend'}`}>
              {stage === 'arrived' ? (
                <i className="ti ti-tool" style={{ fontSize: 11 }} />
              ) : stage === 'complete' ? (
                <i className="ti ti-check" style={{ fontSize: 11 }} />
              ) : (
                '3'
              )}
            </div>
            <div>
              <div className="app-step-lbl">{t.c_step3}</div>
              {step3Sub && <div className="app-step-sub">{step3Sub}</div>}
            </div>
          </div>
          <div className="app-step">
            <div className={`app-step-dot ${stage === 'complete' ? 'done' : 'pend'}`}>
              {stage === 'complete' ? <i className="ti ti-check" style={{ fontSize: 11 }} /> : '4'}
            </div>
            <div>
              <div className="app-step-lbl">{t.c_step4}</div>
              {step4Sub && <div className="app-step-sub">{step4Sub}</div>}
            </div>
          </div>
          {stage !== 'complete' && (
            <button type="button" className="app-btn-s" onClick={cancelRequest}>
              {t.c_cancel}
            </button>
          )}
          {stage === 'complete' && (
            <button type="button" className="app-btn-p" onClick={() => setScreen('complete')}>
              {t.c_view_receipt}
            </button>
          )}
        </div>
      )}

      {screen === 'complete' && (
        <div className="app-screen active" style={{ flex: 1 }}>
          <div style={{ textAlign: 'center', padding: '6px 0 2px' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
              }}
            >
              <i className="ti ti-check" style={{ fontSize: 24, color: '#16a34a' }} />
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#111', textAlign: 'center', marginBottom: 2 }}>
            {t.c_done_title}
          </div>
          <div style={{ fontSize: 11, color: '#888', textAlign: 'center', marginBottom: 12 }}>
            {t.c_done_sub}
          </div>
          <div style={{ border: '0.5px solid #e5e7eb', borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <div className="app-confirm-row">
              <span style={{ fontSize: 12, color: '#888' }}>{t.c_svc}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{serviceName}</span>
            </div>
            {isTowing && (
              <div className="app-confirm-row">
                <span style={{ fontSize: 12, color: '#888' }}>{t.c_truck_type}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{selectedTruck.name}</span>
              </div>
            )}
            <div className="app-confirm-row">
              <span style={{ fontSize: 12, color: '#888' }}>{t.c_driver}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>Andris K.</span>
            </div>
            <div className="app-confirm-row">
              <span style={{ fontSize: 12, color: '#888' }}>{t.c_duration}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>32 {t.c_min_short}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 9 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{t.c_total_paid}</span>
              <span style={{ fontSize: 17, fontWeight: 600, color: '#111' }}>€{total}</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{t.c_rate_driver}</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', fontSize: 28 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ cursor: 'pointer', color: star <= rating ? '#4ade80' : '#e5e7eb' }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <button type="button" className="app-btn-p" onClick={finishTrip}>
            {t.c_done_btn}
          </button>
        </div>
      )}

      {screen === 'hist' && (
        <div className="app-screen active" style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 12, marginTop: 2 }}>
            {t.c_trips}
          </div>
          {newTrips.length > 0 && (
            <div
              style={{
                background: 'rgba(74,222,128,0.08)',
                border: '0.5px solid #4ade80',
                borderRadius: 8,
                padding: '8px 11px',
                marginBottom: 10,
                fontSize: 11,
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <i className="ti ti-sparkles" style={{ fontSize: 13 }} /> <span>{t.c_new_trip}</span>
            </div>
          )}
          <div>
            {[...newTrips, ...trips].map((trip) => (
              <div
                key={trip.id}
                style={{
                  border: '0.5px solid #e5e7eb',
                  borderRadius: 10,
                  padding: 11,
                  marginBottom: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>
                    {trip.icon} {trip.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#888' }}>{trip.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>€{trip.price}</div>
                  <div style={{ fontSize: 10, color: '#16a34a' }}>{t.c_done_tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {screen === 'prof' && (
        <div className="app-screen active" style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: '0.5px solid #e5e7eb',
              borderRadius: 10,
              padding: 13,
              marginBottom: 12,
              marginTop: 2,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#1a1a2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4ade80',
                fontSize: 15,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              KH
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Karim H.</div>
              <div style={{ fontSize: 11, color: '#888' }}>{t.c_profile_loc}</div>
              <div style={{ marginTop: 4 }}>
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#166534',
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 7px',
                    borderRadius: 6,
                  }}
                >
                  {t.c_verified}
                </span>
              </div>
            </div>
          </div>
          <div style={{ border: '0.5px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
            {[
              { icon: 'ti-credit-card', label: t.c_payment },
              { icon: 'ti-bell', label: t.c_notif },
              { icon: 'ti-message-circle', label: t.c_support },
            ].map((row, index) => (
              <div
                key={row.label}
                style={{
                  padding: '11px 13px',
                  borderBottom: index < 2 ? '0.5px solid #e5e7eb' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  cursor: 'pointer',
                }}
              >
                <i className={`ti ${row.icon}`} style={{ fontSize: 16, color: '#888' }} />
                <span style={{ fontSize: 12, color: '#111', flex: 1 }}>{row.label}</span>
                <i className="ti ti-chevron-right" style={{ color: '#aaa' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="app-nav">
        {navigation.map((item) => (
          <div
            key={item.key}
            className={`app-nav-item${navActive === item.key ? ' active' : ''}`}
            onClick={() => {
              setActiveNav(item.key)
              setScreen(item.target)
            }}
          >
            <i className={`ti ${item.icon}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
