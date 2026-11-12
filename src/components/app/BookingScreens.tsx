import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  PhotoAttachment,
  ProblemType,
  ProblemTypeKey,
  Provider,
  ServiceKey,
  Trip,
  TripStage,
  Vehicle,
  VehicleType,
} from '../../types'
import { formatPeso } from '../../lib/format'
import { SERVICES } from '../../lib/data'
import { TruckMark, TowTruckIllustration } from '../TruckIcon'
import { Icon, Logo, MapCanvas, PageHeader, StarRating } from './Shared'

const PLATFORM_FEE = 50

function serviceLabel(key: ServiceKey): string {
  return SERVICES.find((service) => service.id === key)?.label ?? 'Towing'
}

function providerNamed(providers: Provider[], id: string): string {
  return providers.find((provider) => provider.id === id)?.name ?? 'TowGo Partner'
}

export function HomeScreen({
  location,
  activeTrip,
  activeProvider,
  selectedVehicle,
  recentTrips,
  providers,
  onSearchLocation,
  onRequest,
  onTrack,
  onProfile,
  onMessages,
  onNotifications,
  onRequests,
  onVehicles,
  onMapProvider,
}: {
  location: string
  activeTrip?: Trip
  activeProvider?: Provider
  selectedVehicle?: Vehicle
  recentTrips: Trip[]
  providers: Provider[]
  onSearchLocation: (value: string) => void
  onRequest: () => void
  onTrack: () => void
  onProfile: () => void
  onMessages: () => void
  onNotifications: () => void
  onRequests: () => void
  onVehicles: () => void
  onMapProvider: (id: string) => void
}) {
  const [search, setSearch] = useState(location)
  return (
    <div className="tg-screen tg-home">
      <div className="tg-home-top">
        <button type="button" className="tg-avatar" onClick={onProfile} aria-label="Open profile">
          DC
          <span className="tg-avatar-dot" />
        </button>
        <div className="tg-home-hello">
          <span className="tg-greeting">Hi, Dante 👋</span>
          <span className="tg-subtitle">Need towing assistance?</span>
        </div>
        <button type="button" className="tg-icon-btn tg-notify" onClick={onNotifications} aria-label="Notifications">
          <Icon name="bell" size={19} />
          <span className="tg-notify-dot" />
        </button>
        <button type="button" className="tg-icon-btn tg-notify" onClick={onMessages} aria-label="Messages">
          <Icon name="message-circle" size={19} />
        </button>
      </div>

      <form
        className="tg-search"
        onSubmit={(event) => {
          event.preventDefault()
          onSearchLocation(search.trim() || location)
        }}
      >
        <Icon name="map-pin" size={17} />
        <input
          value={search}
          placeholder="Search location"
          aria-label="Search your location"
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit" className="tg-search-btn" aria-label="Use my location">
          <Icon name="current-location" size={16} />
        </button>
      </form>

      {activeTrip ? (
        <button type="button" className="tg-active-card" onClick={onTrack}>
          <span className="tg-active-icon">
            <Icon name="navigation" size={20} />
          </span>
          <span className="tg-active-copy">
            <span className="tg-active-label">Active request</span>
            <strong>Track your tow truck</strong>
            <span>
              {activeProvider?.name ?? 'TowGo Partner'} · arriving in {activeProvider?.etaMinutes ?? 8} min
            </span>
          </span>
          <span className="tg-active-eta">
            {activeProvider?.etaMinutes ?? 8}
            <small>min</small>
          </span>
          <Icon name="chevron-right" size={18} />
        </button>
      ) : null}

      <div className="tg-map-card">
        <MapCanvas variant="home" height={180} providers={providers} onProviderClick={onMapProvider} />
        <div className="tg-map-card-foot">
          <span className="tg-map-live">
            <span className="tg-live-dot" />
            12 tow trucks in Poblacion
          </span>
          <span className="tg-map-drivers">
            <TruckMark width={14} height={14} color="#0b2f50" wheel="#ff8900" />
            Tap a truck to view provider
          </span>
        </div>
      </div>

      <button type="button" className="tg-car-problem" onClick={onRequest}>
        <span className="tg-car-problem-icon">
          <Icon name="car" size={26} />
        </span>
        <span className="tg-car-problem-copy">
          <strong>Car Problem</strong>
          <span>Engine, flat tire, battery, accident & more</span>
        </span>
        <span className="tg-car-problem-arrow">
          <Icon name="arrow-right" size={18} />
        </span>
      </button>

      <button type="button" className="tg-btn tg-btn-accent tg-btn-block tg-find-tow" onClick={onRequest}>
        <TruckMark width={18} height={18} color="#0b2f50" wheel="#ff8900" />
        Find a Tow Truck
      </button>

      <div className="tg-vehicle-mini">
        <span className="tg-vehicle-mini-icon">
          <Icon name="car" size={20} />
        </span>
        <span>
          <small>My vehicle</small>
          <strong>{selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'Toyota Corolla Altis'}</strong>
        </span>
        <span className="tg-plate">{selectedVehicle?.plate ?? 'MDC 4821'}</span>
        <button type="button" className="tg-text-btn" onClick={onVehicles}>
          Change
        </button>
      </div>

      <div className="tg-section-head">
        <div>
          <span className="tg-section-kicker">Activity</span>
          <h3>Recent Requests</h3>
        </div>
        <button type="button" className="tg-text-btn" onClick={onRequests}>
          View all
          <Icon name="arrow-right" size={14} />
        </button>
      </div>

      <div className="tg-recent-list">
        {recentTrips.slice(0, 2).map((trip) => (
          <button key={trip.id} type="button" className="tg-recent-item" onClick={onRequests}>
            <span className={`tg-trip-icon status-${trip.status}`}>
              <Icon
                name={trip.service === 'battery' ? 'bolt' : trip.service === 'tire' ? 'tool' : 'truck'}
                size={18}
              />
            </span>
            <span className="tg-recent-copy">
              <strong>{serviceLabel(trip.service)}</strong>
              <span>
                {providerNamed(providers, trip.providerId)} · {trip.date}
              </span>
            </span>
            <span className="tg-recent-side">
              <strong>{formatPeso(trip.price)}</strong>
              <small>{trip.status === 'cancelled' ? 'Cancelled' : 'Completed'}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function RequestScreen({
  problems,
  selectedProblem,
  onProblem,
  vehicles,
  selectedVehicle,
  vehicleType,
  onVehicleType,
  location,
  onLocation,
  photos,
  onAddPhotos,
  onRemovePhoto,
  onBack,
  onFind,
}: {
  problems: ProblemType[]
  selectedProblem: ProblemType
  onProblem: (id: ProblemTypeKey) => void
  vehicles: Vehicle[]
  selectedVehicle?: Vehicle
  vehicleType: VehicleType
  onVehicleType: (type: VehicleType) => void
  location: string
  onLocation: (value: string) => void
  photos: PhotoAttachment[]
  onAddPhotos: (files: FileList | null) => void
  onRemovePhoto: (id: string) => void
  onBack: () => void
  onFind: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const estimated = selectedProblem.service === 'towing' ? 1350 : (SERVICES.find((s) => s.id === selectedProblem.service)?.base ?? 450) + 250
  const vehicle = selectedVehicle ?? vehicles[0]

  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="Request Towing" subtitle="Tell us what happened" onBack={onBack} />
      <p className="tg-page-lead">
        Pick your vehicle type and the problem you are facing. We will match you with the nearest available tow truck.
      </p>

      <section className="tg-card tg-card-pad">
        <div className="tg-card-title-row">
          <span className="tg-card-title">Vehicle type</span>
          <span className="tg-muted">Sedan, Van or SUV</span>
        </div>
        <div className="tg-select-wrap">
          <Icon name="car" size={17} />
          <select
            className="tg-input tg-select"
            value={vehicleType}
            aria-label="Vehicle type"
            onChange={(event) => onVehicleType(event.target.value as VehicleType)}
          >
            <option value="Sedan">Sedan</option>
            <option value="Van">Van</option>
            <option value="SUV">SUV</option>
          </select>
          <Icon name="chevron-down" size={16} className="tg-select-caret" />
        </div>
        {vehicle ? (
          <div className="tg-vehicle-row">
            <span className="tg-vehicle-art">
              <Icon name="car" size={28} />
            </span>
            <div>
              <strong>
                {vehicle.make} {vehicle.model}
              </strong>
              <span>
                {vehicle.year} · {vehicle.color} · {vehicle.type}
              </span>
            </div>
            <span className="tg-plate">{vehicle.plate}</span>
          </div>
        ) : null}
      </section>

      <section className="tg-card tg-card-pad tg-problem-section">
        <div className="tg-card-title-row">
          <span className="tg-card-title">What is the problem?</span>
          <span className="tg-muted">Select one</span>
        </div>
        <div className="tg-problem-grid">
          {problems.map((problem) => (
            <button
              key={problem.id}
              type="button"
              className={`tg-problem-card tone-${problem.id}${selectedProblem.id === problem.id ? ' active' : ''}`}
              onClick={() => onProblem(problem.id)}
            >
              <span className="tg-problem-icon">
                <Icon name={problem.icon} size={19} />
              </span>
              <strong>{problem.label}</strong>
              <small>{problem.hint}</small>
              {selectedProblem.id === problem.id ? (
                <span className="tg-problem-check">
                  <Icon name="check" size={11} />
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </section>

      <section className="tg-card tg-card-pad">
        <div className="tg-card-title-row">
          <span className="tg-card-title">Photos (optional)</span>
          <span className="tg-muted">{photos.length} added</span>
        </div>
        <div className="tg-upload-grid">
          {photos.map((photo) => (
            <span key={photo.id} className="tg-photo-thumb">
              <img src={photo.url} alt={photo.name} />
              <button type="button" onClick={() => onRemovePhoto(photo.id)} aria-label="Remove photo">
                <Icon name="x" size={11} />
              </button>
            </span>
          ))}
          <button type="button" className="tg-upload-add" onClick={() => fileRef.current?.click()}>
            <Icon name="camera-plus" size={22} />
            <span>Add Photo</span>
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            onAddPhotos(event.target.files)
            event.target.value = ''
          }}
        />
      </section>

      <section className="tg-card tg-card-pad">
        <div className="tg-card-title-row">
          <span className="tg-card-title">Current location</span>
          <button type="button" className="tg-text-btn" onClick={() => onLocation('Quezon Boulevard, Poblacion, Kidapawan City')}>
            Use current
          </button>
        </div>
        <span className="tg-input-wrap">
          <Icon name="map-pin" size={17} />
          <input
            className="tg-input"
            value={location}
            placeholder="Enter your current location"
            onChange={(event) => onLocation(event.target.value)}
          />
        </span>
      </section>

      <div className="tg-sticky-action">
        <div className="tg-sticky-total">
          <span>Estimated fare</span>
          <strong>from {formatPeso(estimated)}</strong>
        </div>
        <button type="button" className="tg-btn tg-btn-primary" onClick={onFind}>
          Find Tow Truck
          <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </div>
  )
}

export function TrucksScreen({
  providers,
  location,
  onBack,
  onRequest,
  initialSelectedId,
}: {
  providers: Provider[]
  location: string
  onBack: () => void
  onRequest: (id: string) => void
  initialSelectedId?: string
}) {
  const [sort, setSort] = useState<'nearest' | 'cheapest' | 'rating'>('nearest')
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const cardRefs = useRef<Record<string, HTMLElement | null>>({})
  const activeSelectedId = selectedId ?? initialSelectedId
  const sorted = useMemo(
    () =>
      [...providers].sort((a, b) => {
        if (sort === 'cheapest') return a.price - b.price
        if (sort === 'rating') return Number(b.rating) - Number(a.rating)
        return a.etaMinutes - b.etaMinutes
      }),
    [providers, sort],
  )

  useEffect(() => {
    if (!initialSelectedId) return
    const timer = window.setTimeout(() => {
      cardRefs.current[initialSelectedId]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
    return () => window.clearTimeout(timer)
  }, [initialSelectedId])

  function selectProvider(id: string) {
    setSelectedId(id)
    window.requestAnimationFrame(() => {
      cardRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  return (
    <div className="tg-screen tg-subpage tg-trucks-screen">
      <PageHeader title="Nearby Tow Trucks" subtitle={`${providers.length} providers near ${location.split(',')[0]}`} onBack={onBack} />
      <div className="tg-filter-row">
        <button
          type="button"
          className={`tg-filter${sort === 'nearest' ? ' active' : ''}`}
          onClick={() => setSort('nearest')}
        >
          Nearest
        </button>
        <button
          type="button"
          className={`tg-filter${sort === 'cheapest' ? ' active' : ''}`}
          onClick={() => setSort('cheapest')}
        >
          Cheapest
        </button>
        <button
          type="button"
          className={`tg-filter${sort === 'rating' ? ' active' : ''}`}
          onClick={() => setSort('rating')}
        >
          Top rated
        </button>
      </div>

      <div className="tg-trucks-map">
        <MapCanvas
          variant="trucks"
          height={210}
          label="Available near you"
          providers={sorted}
          selectedProviderId={activeSelectedId}
          onProviderClick={selectProvider}
        />
      </div>

      <div className="tg-truck-list">
        {sorted.map((provider) => (
          <article
            key={provider.id}
            ref={(element) => {
              cardRefs.current[provider.id] = element
            }}
            className={`tg-truck-card tg-provider-card tone-${provider.tone}${activeSelectedId === provider.id ? ' is-selected' : ''}`}
            aria-current={activeSelectedId === provider.id ? 'true' : undefined}
          >
            <span className={`tg-truck-card-icon tg-provider-logo tone-${provider.tone}`}>
              <span>{provider.initials}</span>
            </span>
            <div className="tg-truck-card-copy">
              <span className="tg-truck-name-row">
                <strong>{provider.name}</strong>
                {provider.badge ? <em>{provider.badge}</em> : null}
              </span>
              <span className="tg-truck-meta">
                <Icon name="star-filled" size={12} /> {provider.rating} ({provider.reviews} reviews)
              </span>
              <span className="tg-truck-eta">
                <Icon name="map-pin" size={12} /> {provider.distance} away · {provider.eta}
              </span>
              <span className="tg-truck-eta">
                <Icon name="truck" size={12} /> {provider.meta}
              </span>
            </div>
            <div className="tg-truck-card-price">
              <strong>{formatPeso(provider.price)}</strong>
              <small>est. fare</small>
              <button type="button" className="tg-btn tg-btn-accent tg-request-btn" onClick={() => onRequest(provider.id)}>
                Request
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export function TrackingScreen({
  provider,
  stage,
  eta,
  serviceLabel: service,
  problemLabel,
  onBack,
  onCancel,
  onMessage,
  onCall,
  onComplete,
  onReceipt,
  onPhotos,
}: {
  provider: Provider
  stage: TripStage
  eta: number
  serviceLabel: string
  problemLabel: string
  onBack: () => void
  onCancel: () => void
  onMessage: () => void
  onCall: () => void
  onComplete: () => void
  onReceipt: () => void
  onPhotos: () => void
}) {
  const stageIndex = stage === 'enroute' ? 1 : stage === 'arrived' ? 2 : stage === 'working' ? 2 : 3
  const stageTitle =
    stage === 'enroute'
      ? 'Tow Truck is on the way'
      : stage === 'arrived'
        ? 'Your driver has arrived'
        : stage === 'working'
          ? 'Towing in progress'
          : 'Service completed'
  const stageSub =
    stage === 'enroute'
      ? `${provider.driverName} is heading to your location.`
      : stage === 'arrived'
        ? `${provider.driverName} is ready to load your vehicle.`
        : stage === 'working'
          ? 'Your vehicle is being secured and transported.'
          : 'Your vehicle was delivered safely.'

  const steps = [
    'Request confirmed',
    stage === 'enroute' ? 'Driver en route' : 'Driver arrived',
    'Vehicle loaded',
    'Delivered safely',
  ]

  return (
    <div className="tg-screen tg-subpage tg-tracking-screen">
      <PageHeader title={`Tracking · ${provider.name}`} subtitle={stageTitle} onBack={onBack} />
      <div className="tg-tracking-map">
        <MapCanvas variant="tracking" height={280} />
        <div className="tg-eta-float">
          <span className="tg-live-dot" />
          <span>{stage === 'complete' ? 'All done' : 'Arriving in'}</span>
          <strong>
            {stage === 'complete' ? '0' : eta}
            <small>min</small>
          </strong>
        </div>
        <span className="tg-map-ref">Ref · TG-4821</span>
      </div>

      <div className="tg-sheet tg-tracking-sheet">
        <div className="tg-sheet-grab" aria-hidden="true" />
        <div className="tg-tracking-title">
          <div>
            <span className="tg-section-kicker">Your driver</span>
            <h2>{stageTitle}</h2>
            <p>{stageSub}</p>
          </div>
          <span className={`tg-status-pill stage-${stage}`}>
            {service} · {problemLabel}
          </span>
        </div>

        <div className="tg-driver-card">
          <span className="tg-driver-avatar">{provider.driverInitials}</span>
          <div className="tg-driver-copy">
            <strong>{provider.driverName}</strong>
            <span>
              {provider.vehicle} · {provider.plate}
            </span>
            <span className="tg-driver-rating">
              <Icon name="star-filled" size={12} /> {provider.driverRating} · Verified driver
            </span>
            <span className="tg-driver-provider">{provider.name}</span>
          </div>
          <div className="tg-driver-actions">
            <button type="button" className="tg-round-btn" onClick={onMessage} aria-label="Message driver">
              <Icon name="message-circle" size={17} />
            </button>
            <button type="button" className="tg-round-btn dark" onClick={onCall} aria-label="Call driver">
              <Icon name="phone" size={16} />
            </button>
          </div>
        </div>

        <div className="tg-track-actions">
          <button type="button" className="tg-btn tg-btn-primary" onClick={onCall}>
            <Icon name="phone" size={16} />
            Call Driver
          </button>
          <button type="button" className="tg-btn tg-btn-soft" onClick={onMessage}>
            <Icon name="message-circle" size={16} />
            Message
          </button>
        </div>

        <button type="button" className="tg-photo-strip" onClick={onPhotos}>
          <span className="tg-photo-strip-art">
            <span />
            <span />
            <span />
          </span>
          <span>
            <strong>Vehicle photos</strong>
            <small>Add photos to protect your vehicle</small>
          </span>
          <Icon name="chevron-right" size={18} />
        </button>

        <div className="tg-progress">
          <div className="tg-progress-fill" style={{ width: `${stageIndex * 33 + 8}%` }} />
        </div>

        <div className="tg-timeline">
          {steps.map((label, index) => {
            const done = index < stageIndex
            const active = index === stageIndex
            return (
              <div key={label} className={`tg-timeline-row${done ? ' done' : ''}${active ? ' active' : ''}`}>
                <span className="tg-timeline-dot">{done ? <Icon name="check" size={11} /> : index + 1}</span>
                <span>
                  <strong>{label}</strong>
                  {index === 1 && stage === 'enroute' ? <small>~{eta} min</small> : null}
                  {index === 2 && stage === 'working' ? <small>In progress now</small> : null}
                  {index === 3 && stage === 'complete' ? <small>Charged to your payment method</small> : null}
                </span>
              </div>
            )
          })}
        </div>

        {stage === 'complete' ? (
          <div className="tg-complete-actions">
            <button type="button" className="tg-btn tg-btn-primary" onClick={onComplete}>
              Service Completed
              <Icon name="arrow-right" size={16} />
            </button>
            <button type="button" className="tg-btn tg-btn-soft" onClick={onReceipt}>
              <Icon name="receipt" size={16} />
              View Receipt
            </button>
          </div>
        ) : (
          <button type="button" className="tg-btn tg-btn-ghost tg-btn-block" onClick={onCancel}>
            <Icon name="x" size={15} />
            Cancel Request
          </button>
        )}
      </div>
    </div>
  )
}

export function PhotosScreen({
  photos,
  onAddPhotos,
  onRemovePhoto,
  onBack,
  onDone,
}: {
  photos: PhotoAttachment[]
  onAddPhotos: (files: FileList | null) => void
  onRemovePhoto: (id: string) => void
  onBack: () => void
  onDone: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const slots = ['Front view', 'Rear view', 'Driver side', 'Passenger side', 'Dashboard', 'Overview']

  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="Vehicle Photos" subtitle="Select photos of your vehicle" onBack={onBack} />
      <div className="tg-photo-gallery">
        {photos.map((photo) => (
          <div key={photo.id} className="tg-photo-tile tg-photo-uploaded">
            <img src={photo.url} alt={photo.name} />
            <span>{photo.name}</span>
            <button type="button" className="tg-photo-remove" onClick={() => onRemovePhoto(photo.id)} aria-label="Remove photo">
              <Icon name="x" size={12} />
            </button>
          </div>
        ))}
        {slots.map((label, index) => (
          <button
            key={label}
            type="button"
            className={`tg-photo-tile photo-${index + 1} tg-photo-empty`}
            onClick={() => fileRef.current?.click()}
          >
            <span className="tg-photo-car">
              <Icon name={index === 4 ? 'dashboard' : 'camera'} size={26} />
            </span>
            <span>{label}</span>
            <Icon name="plus" size={14} />
          </button>
        ))}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          onAddPhotos(event.target.files)
          event.target.value = ''
        }}
      />
      <button type="button" className="tg-btn tg-btn-primary tg-btn-block" onClick={() => fileRef.current?.click()}>
        <Icon name="camera-plus" size={17} />
        Add Photo
      </button>
      <div className="tg-note-card">
        <Icon name="shield-check" size={20} />
        <p>Photos are shared only with your assigned driver and help protect your vehicle during towing.</p>
      </div>
      <button type="button" className="tg-btn tg-btn-primary tg-btn-block" onClick={onDone}>
        Done
      </button>
    </div>
  )
}

export function CompleteScreen({
  trip,
  provider,
  serviceLabel: service,
  truckLabel,
  onReceipt,
  onRate,
  onHome,
}: {
  trip: Trip
  provider: Provider
  serviceLabel: string
  truckLabel: string
  onReceipt: () => void
  onRate: () => void
  onHome: () => void
}) {
  const fee = Math.max(trip.price - PLATFORM_FEE, 0)
  return (
    <div className="tg-screen tg-subpage tg-complete-screen">
      <div className="tg-success">
        <span className="tg-success-icon">
          <Icon name="check" size={34} />
        </span>
        <span className="tg-success-rings" aria-hidden="true" />
      </div>
      <h1 className="tg-complete-title">Service Completed!</h1>
      <p className="tg-complete-sub">Your vehicle has been delivered safely to your destination.</p>

      <div className="tg-complete-truck">
        <TowTruckIllustration width={220} height={120} />
      </div>

      <section className="tg-card tg-card-pad tg-summary-card">
        <div className="tg-summary-head">
          <span className="tg-summary-icon">
            <TruckMark width={22} height={22} color="#0b2f50" wheel="#ff8900" />
          </span>
          <div>
            <strong>{provider.name}</strong>
            <span>{service} · {truckLabel}</span>
          </div>
          <span className="tg-paid-pill">Paid</span>
        </div>
        <div className="tg-summary-line">
          <span>Driver</span>
          <strong>{provider.driverName}</strong>
        </div>
        <div className="tg-summary-line">
          <span>Towing fee</span>
          <strong>{formatPeso(fee)}</strong>
        </div>
        <div className="tg-summary-line">
          <span>Distance</span>
          <strong>{trip.distance}</strong>
        </div>
        <div className="tg-summary-total">
          <span>Total</span>
          <strong>{formatPeso(trip.price)}</strong>
        </div>
      </section>

      <div className="tg-complete-actions">
        <button type="button" className="tg-btn tg-btn-primary" onClick={onReceipt}>
          <Icon name="receipt" size={17} />
          View Receipt
        </button>
        <button type="button" className="tg-btn tg-btn-soft" onClick={onRate}>
          <Icon name="star" size={17} />
          Rate Your Experience
        </button>
        <button type="button" className="tg-text-btn tg-center-btn" onClick={onHome}>
          Back to Home
        </button>
      </div>
    </div>
  )
}

export function ReceiptScreen({
  trip,
  provider,
  serviceLabel: service,
  truckLabel,
  paymentLabel = 'Visa ···· 4821',
  onBack,
  onRate,
  onHome,
}: {
  trip: Trip
  provider: Provider
  serviceLabel: string
  truckLabel: string
  paymentLabel?: string
  onBack: () => void
  onRate: () => void
  onHome: () => void
}) {
  const fee = Math.max(trip.price - PLATFORM_FEE, 0)
  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="Service Receipt" onBack={onBack} />
      <div className="tg-receipt-brand">
        <div className="tg-receipt-logo">
          <TruckMark width={30} height={30} color="#0b2f50" wheel="#ff8900" />
          <span>
            {provider.name}
          </span>
        </div>
        <span className="tg-paid-pill">Service completed</span>
      </div>
      <div className="tg-receipt-meta">
        <span>
          <small>Receipt number</small>
          <strong>{trip.ref}</strong>
        </span>
        <span>
          <small>Date</small>
          <strong>{trip.date}</strong>
        </span>
      </div>
      <div className="tg-receipt-amount">
        <span>Total amount</span>
        <strong>{formatPeso(trip.price)}</strong>
      </div>
      <section className="tg-card tg-card-pad">
        <div className="tg-receipt-line">
          <span>Provider</span>
          <strong>{provider.name}</strong>
        </div>
        <div className="tg-receipt-line">
          <span>Customer</span>
          <strong>{trip.customer}</strong>
        </div>
        <div className="tg-receipt-line">
          <span>Service type</span>
          <strong>{service}</strong>
        </div>
        <div className="tg-receipt-line">
          <span>Vehicle</span>
          <strong>{truckLabel}</strong>
        </div>
        <div className="tg-receipt-line">
          <span>Location</span>
          <strong>{trip.location}</strong>
        </div>
        <div className="tg-receipt-line">
          <span>Distance</span>
          <strong>{trip.distance}</strong>
        </div>
        <div className="tg-receipt-divider" />
        <div className="tg-receipt-line">
          <span>Towing fee</span>
          <strong>{formatPeso(fee)}</strong>
        </div>
        <div className="tg-receipt-line">
          <span>Service fee</span>
          <strong>{formatPeso(PLATFORM_FEE)}</strong>
        </div>
        <div className="tg-receipt-line total">
          <span>Total</span>
          <strong>{formatPeso(trip.price)}</strong>
        </div>
      </section>
      <div className="tg-payment-method">
        <span className="tg-payment-icon">
          <Icon name="credit-card" size={20} />
        </span>
        <span>
          <small>Payment method</small>
          <strong>{paymentLabel}</strong>
        </span>
        <span className="tg-payment-default">Default</span>
      </div>
      <div className="tg-receipt-actions">
        <button type="button" className="tg-btn tg-btn-primary" onClick={onRate}>
          <Icon name="star" size={17} />
          Rate Your Experience
        </button>
        <button type="button" className="tg-btn tg-btn-soft" onClick={onHome}>
          <Icon name="home" size={17} />
          Back to Home
        </button>
      </div>
    </div>
  )
}

export function RatingScreen({
  submitted,
  rating,
  comment,
  provider,
  onRating,
  onComment,
  onSubmit,
  onSkip,
  onHome,
}: {
  submitted: boolean
  rating: number
  comment: string
  provider: Provider
  onRating: (value: number) => void
  onComment: (value: string) => void
  onSubmit: () => void
  onSkip: () => void
  onHome: () => void
}) {
  if (submitted) {
    return (
      <div className="tg-screen tg-subpage tg-rating-submitted">
        <div className="tg-success">
          <span className="tg-success-icon">
            <Icon name="star-filled" size={32} />
          </span>
          <span className="tg-success-rings" aria-hidden="true" />
        </div>
        <h1 className="tg-complete-title">Thank you!</h1>
        <p className="tg-complete-sub">Your feedback helps us keep every tow safe and on time.</p>
        <div className="tg-rating-recap">
          <StarRating value={rating} size={28} />
        </div>
        <button type="button" className="tg-btn tg-btn-primary tg-btn-block" onClick={onHome}>
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="Rate your experience" subtitle="Your feedback matters" onBack={onSkip} />
      <div className="tg-rating-logo">
        <Logo />
      </div>
      <div className="tg-rating-driver">
        <span className="tg-driver-avatar large">{provider.driverInitials}</span>
        <strong>{provider.driverName}</strong>
        <span>{provider.name} · {provider.vehicle}</span>
      </div>
      <div className="tg-rating-panel">
        <span className="tg-rating-question">How was the service?</span>
        <StarRating value={rating} onChange={onRating} size={42} />
      </div>
      <div className="tg-field">
        <span className="tg-label">Write a review (optional)</span>
        <textarea
          className="tg-textarea"
          value={comment}
          placeholder="Tell us about your experience"
          onChange={(event) => onComment(event.target.value)}
        />
      </div>
      <button type="button" className="tg-btn tg-btn-primary tg-btn-block" disabled={rating === 0} onClick={onSubmit}>
        Submit Review
      </button>
      <button type="button" className="tg-text-btn tg-center-btn" onClick={onSkip}>
        Skip for now
      </button>
    </div>
  )
}
