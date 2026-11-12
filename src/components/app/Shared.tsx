import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Provider } from '../../types'
import { formatPeso } from '../../lib/format'
import { TruckMark } from '../TruckIcon'

export function Icon({
  name,
  size = 18,
  className = '',
}: {
  name: string
  size?: number
  className?: string
}) {
  return <i className={`ti ti-${name} ${className}`} style={{ fontSize: size }} aria-hidden="true" />
}

export function StatusBar({ light = false }: { light?: boolean }) {
  return (
    <div className={`tg-status${light ? ' light' : ''}`}>
      <span className="tg-status-time">9:41</span>
      <span className="tg-status-icons">
        <Icon name="wifi" size={12} />
        <Icon name="signal" size={12} />
        <Icon name="battery-full" size={13} />
      </span>
    </div>
  )
}

export function Logo({ light = false, small = false }: { light?: boolean; small?: boolean }) {
  return (
    <div className={`tg-logo${light ? ' light' : ''}${small ? ' small' : ''}`}>
      <span className="tg-logo-mark">
        <TruckMark
          width={small ? 19 : 23}
          height={small ? 19 : 23}
          color={light ? '#0b2f50' : '#ffffff'}
          wheel={light ? '#ffffff' : '#ff8900'}
        />
      </span>
      <span className="tg-logo-text">
        Tow<strong>Go</strong>
      </span>
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  onBack,
  action,
}: {
  title: string
  subtitle?: string
  onBack?: () => void
  action?: ReactNode
}) {
  return (
    <header className="tg-page-head">
      <div className="tg-page-head-row">
        {onBack ? (
          <button type="button" className="tg-icon-btn" onClick={onBack} aria-label="Go back">
            <Icon name="arrow-left" size={19} />
          </button>
        ) : (
          <span className="tg-page-head-spacer" />
        )}
        <div className="tg-page-head-copy">
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {action ?? <span className="tg-page-head-spacer" />}
      </div>
    </header>
  )
}

export type NavTab = 'home' | 'requests' | 'messages' | 'profile'

export function BottomNav({
  active,
  onNav,
  unread = 0,
}: {
  active: NavTab
  onNav: (target: NavTab) => void
  unread?: number
}) {
  const items: { key: NavTab; icon: string; label: string }[] = [
    { key: 'home', icon: 'home', label: 'Home' },
    { key: 'requests', icon: 'clipboard-list', label: 'Requests' },
    { key: 'messages', icon: 'message-circle', label: 'Messages' },
    { key: 'profile', icon: 'user', label: 'Profile' },
  ]
  return (
    <nav className="tg-bottom-nav" aria-label="Main navigation">
      <div className="tg-nav-brand">
        <span className="tg-nav-brand-mark">
          <TruckMark width={22} height={22} color="#0b2f50" wheel="#ff8900" />
        </span>
        <span className="tg-nav-brand-text">
          Tow<strong>Go</strong>
        </span>
      </div>
      <div className="tg-nav-items">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`tg-nav-item${active === item.key ? ' active' : ''}`}
            onClick={() => onNav(item.key)}
          >
            <span className="tg-nav-icon">
              <Icon name={item.icon} size={20} />
              {item.key === 'messages' && unread > 0 ? (
                <span className="tg-nav-badge">{unread}</span>
              ) : null}
            </span>
            <span className="tg-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="tg-nav-foot">
        <span className="tg-nav-foot-icon">
          <Icon name="headset" size={16} />
        </span>
        <span>
          <strong>Need help?</strong>
          <small>24/7 dispatch · Kidapawan</small>
        </span>
      </div>
    </nav>
  )
}

const MAP_CENTER: L.LatLngTuple = [7.0094, 125.09]
const MAP_ZOOM = 13.5
const MAP_MARKER_BEARINGS = [35, 120, 210, 300, 75]
const MAX_MAP_PROVIDERS = 5

const TRUCK_MARKER_SVG = `<svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="2" y="19" width="20" height="4" rx="1.6" fill="#0b2f50" /><path d="M20 19h5.4l3.2 4.3V23a2 2 0 0 1-2 2H20v-6Z" fill="#0b2f50" /><path d="M22 20.5h3l2 2.5h-5v-2.5Z" fill="#ffffff" /><path d="M2 16.5h12.5l1.5-3.5H5.2a4 4 0 0 0-3.6 2.3l.4 1.2Z" fill="#ff8900" /><path d="M3 15.8h10l.8-1.8H5.4a2.5 2.5 0 0 0-2.4 1.8Z" fill="#ffffff" opacity=".85" /><circle cx="9" cy="23" r="3.4" fill="#ff8900" stroke="#0b2f50" stroke-width="2" /><circle cx="24.5" cy="23" r="3.4" fill="#ff8900" stroke="#0b2f50" stroke-width="2" /><circle cx="9" cy="23" r="1.2" fill="#0b2f50" /><circle cx="24.5" cy="23" r="1.2" fill="#0b2f50" /></svg>`

function pointAwayFrom(center: L.LatLng, distanceKm: number, bearingDegrees: number) {
  const earthRadiusKm = 6371
  const bearing = (bearingDegrees * Math.PI) / 180
  const lat1 = (center.lat * Math.PI) / 180
  const lon1 = (center.lng * Math.PI) / 180
  const angular = distanceKm / earthRadiusKm
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angular) + Math.cos(lat1) * Math.sin(angular) * Math.cos(bearing),
  )
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angular) * Math.cos(lat1),
      Math.cos(angular) - Math.sin(lat1) * Math.sin(lat2),
    )
  return L.latLng((lat2 * 180) / Math.PI, (lon2 * 180) / Math.PI)
}

export function MapCanvas({
  variant = 'home',
  height = 220,
  label,
  providers = [],
  selectedProviderId,
  onProviderClick,
}: {
  variant?: 'home' | 'trucks' | 'tracking' | 'receipt'
  height?: number
  label?: string
  providers?: Provider[]
  selectedProviderId?: string
  onProviderClick?: (id: string) => void
}) {
  const showTrucks = variant === 'home' || variant === 'trucks'
  const showRoute = variant === 'tracking'
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerLayerRef = useRef<L.LayerGroup | null>(null)
  const onProviderClickRef = useRef(onProviderClick)
  const markerProviders = useMemo(() => providers.slice(0, MAX_MAP_PROVIDERS), [providers])

  useEffect(() => {
    onProviderClickRef.current = onProviderClick
  }, [onProviderClick])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const map = L.map(container, {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      zoomControl: false,
      scrollWheelZoom: false,
      zoomSnap: 0.5,
    })
    mapRef.current = map
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    markerLayerRef.current = L.layerGroup().addTo(map)

    const resize = () => map.invalidateSize()
    const frame = window.requestAnimationFrame(resize)
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    observer?.observe(container)

    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      map.remove()
      mapRef.current = null
      markerLayerRef.current = null
    }
  }, [])

  useEffect(() => {
    const layer = markerLayerRef.current
    if (!layer) return
    layer.clearLayers()
    const center = L.latLng(MAP_CENTER)

    L.marker(center, {
      icon: L.divIcon({
        className: 'tg-leaflet-user-icon',
        html: '<span class="tg-leaflet-user-ring"></span><span class="tg-leaflet-user-dot"><i class="ti ti-current-location"></i></span>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
      interactive: false,
      keyboard: false,
    }).addTo(layer)

    if (showTrucks) {
      markerProviders.forEach((provider, index) => {
        const point = pointAwayFrom(center, provider.distanceKm, MAP_MARKER_BEARINGS[index] ?? 0)
        const selected = provider.id === selectedProviderId
        const isPricePin = variant === 'trucks'
        const marker = L.marker(point, {
          icon: L.divIcon({
            className: `tg-leaflet-marker${selected ? ' is-selected' : ''}`,
            html: isPricePin
              ? `<span class="tg-leaflet-price">${formatPeso(provider.price)}</span>`
              : `<span class="tg-leaflet-truck">${TRUCK_MARKER_SVG}</span>`,
            iconSize: isPricePin ? [66, 26] : [34, 34],
            iconAnchor: isPricePin ? [33, 13] : [17, 17],
          }),
          title: `${provider.name} — ${provider.eta}`,
          alt: `${provider.name}, ${provider.eta}, ${formatPeso(provider.price)}`,
          riseOnHover: true,
        })
        marker.on('click', () => onProviderClickRef.current?.(provider.id))
        marker.addTo(layer)
      })
    }

    if (showRoute) {
      const destination = pointAwayFrom(center, 3.2, 62)
      const truckPosition = pointAwayFrom(center, 1.6, 62)
      L.polyline([center, destination], {
        color: '#ff8900',
        weight: 4,
        opacity: 0.9,
        dashArray: '8 8',
      }).addTo(layer)
      L.marker(truckPosition, {
        icon: L.divIcon({
          className: 'tg-leaflet-marker',
          html: `<span class="tg-leaflet-truck">${TRUCK_MARKER_SVG}</span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        }),
        interactive: false,
      }).addTo(layer)
    }

    return () => {
      layer.clearLayers()
    }
  }, [markerProviders, selectedProviderId, showRoute, showTrucks, variant])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const center = L.latLng(MAP_CENTER)
    const points: L.LatLng[] = [center]

    if (showTrucks) {
      markerProviders.forEach((provider, index) => {
        points.push(pointAwayFrom(center, provider.distanceKm, MAP_MARKER_BEARINGS[index] ?? 0))
      })
    }

    if (showRoute) {
      points.push(pointAwayFrom(center, 3.2, 62))
    }

    if (points.length < 2) return
    const bounds = L.latLngBounds(points)
    const frame = window.requestAnimationFrame(() => {
      map.invalidateSize()
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15, animate: false })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [markerProviders, showRoute, showTrucks])

  return (
    <div className={`tg-map tg-map-${variant}`} style={{ height }}>
      <div ref={containerRef} className="tg-map-leaflet" />
      <span className="tg-map-city">
        <Icon name="map-pin" size={10} /> Poblacion, Kidapawan City
      </span>
      {label ? <span className="tg-map-label">{label}</span> : null}
    </div>
  )
}

export function StarRating({
  value,
  onChange,
  size = 36,
}: {
  value: number
  onChange?: (value: number) => void
  size?: number
}) {
  return (
    <div className="tg-stars" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`tg-star${star <= value ? ' filled' : ''}`}
          style={{ fontSize: size }}
          onClick={() => onChange?.(star)}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
          disabled={!onChange}
        >
          <Icon name="star-filled" size={size} />
        </button>
      ))}
    </div>
  )
}

export function Toast({ message }: { message: string }) {
  return (
    <div className="tg-toast" role="status">
      <Icon name="circle-check" size={18} />
      <span>{message}</span>
    </div>
  )
}

export function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  error,
  autoComplete = 'current-password',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  autoComplete?: string
}) {
  const [visible, setVisible] = useState(false)
  return (
    <label className="tg-field">
      <span className="tg-label">{label}</span>
      <span className="tg-input-wrap tg-password-wrap">
        <Icon name="lock" size={17} />
        <input
          className="tg-input"
          type={visible ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="tg-eye"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          <Icon name={visible ? 'eye-off' : 'eye'} size={17} />
        </button>
      </span>
      {error ? <span className="tg-field-error">{error}</span> : null}
    </label>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <span className="tg-section-kicker">{children}</span>
}
