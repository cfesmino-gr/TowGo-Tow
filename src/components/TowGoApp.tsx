import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  AppNotification,
  AppScreen,
  ChatMessage,
  Conversation,
  PaymentMethod,
  PhotoAttachment,
  ProblemTypeKey,
  Provider,
  ServiceKey,
  Trip,
  TripStage,
  TruckKey,
  UserProfile,
  Vehicle,
  VehicleType,
} from '../types'
import {
  CONVERSATIONS,
  FAQS,
  NOTIFICATIONS,
  PAYMENT_METHODS,
  PROBLEM_TYPES,
  PROVIDERS,
  SEED_TRIPS,
  SERVICES,
  USER,
  VEHICLES,
} from '../lib/data'
import {
  AboutScreen,
  CallScreen,
  ChatScreen,
  EmailScreen,
  FaqDetailScreen,
  FaqScreen,
  LanguageScreen,
  LocationAccessScreen,
  MessagesScreen,
  NotificationsScreen,
  PasswordScreen,
  PaymentsScreen,
  PersonalScreen,
  PrivacyScreen,
  ProfileScreen,
  RequestsScreen,
  SettingsScreen,
  SupportScreen,
  VehicleFormScreen,
  VehiclesScreen,
  type SettingToggles,
} from './app/AccountScreens'
import {
  CompleteScreen,
  HomeScreen,
  PhotosScreen,
  RatingScreen,
  ReceiptScreen,
  RequestScreen,
  TrackingScreen,
  TrucksScreen,
} from './app/BookingScreens'
import { BottomNav, Icon, Logo, StatusBar, Toast, type NavTab } from './app/Shared'
import { TruckMark } from './TruckIcon'
import { supabase } from '../lib/supabaseClient'
import { useSupabaseConnection } from '../lib/useSupabaseConnection'

const NAV_SCREENS: AppScreen[] = ['home', 'requests', 'messages', 'profile']
const SUPPORT_PHONE = '+63 2 8888 2468'

let tripSequence = 4821
function nextTripIdentity() {
  tripSequence += 1
  return { id: `trip-${tripSequence}`, ref: `TG-${tripSequence}` }
}

function seedChats(): Record<string, ChatMessage[]> {
  return {
    driver: [
      { id: 1, from: 'them', text: 'Hi Dante! This is Miguel from TowPro Services. I’m on my way to your location.', time: '9:38' },
      { id: 2, from: 'them', text: 'I’m near the corner of Quezon Blvd. Please turn on your hazards.', time: '9:40' },
      { id: 3, from: 'me', text: 'Got it, hazards are on. Thank you!', time: '9:41' },
    ],
    support: [
      { id: 1, from: 'them', text: 'Hi Dante, you’re chatting with TowGo Support. How can we help you today?', time: '9:31' },
    ],
    quicktow: [
      { id: 1, from: 'them', text: 'Your receipt for TG-2398 is ready. Thank you for choosing QuickTow PH!', time: 'Yesterday' },
    ],
    dispatcher: [
      { id: 1, from: 'them', text: 'Thanks for choosing Road Rescue! Let us know if you need anything else.', time: 'Yesterday' },
    ],
  }
}

function serviceLabel(key: ServiceKey): string {
  return SERVICES.find((service) => service.id === key)?.label ?? 'Towing'
}

function problemLabel(key: ProblemTypeKey): string {
  return PROBLEM_TYPES.find((problem) => problem.id === key)?.label ?? 'Other'
}

function truckLabel(key: TruckKey): string {
  if (key === 'flatbed') return 'Flatbed tow'
  if (key === 'hook') return 'Hook & chain'
  return 'Heavy-duty recovery'
}

function fareFor(service: ServiceKey, provider: Provider): number {
  if (service === 'towing') return provider.price
  const base = SERVICES.find((item) => item.id === service)?.base ?? 450
  return base + 250
}

export function TowGoApp() {
  const [screen, setScreen] = useState<AppScreen>('splash')
  const historyRef = useRef<AppScreen[]>([])
  const guardRef = useRef(false)
  const [user, setUser] = useState<UserProfile>(USER)
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES)
  const [selectedVehicleId, setSelectedVehicleId] = useState(VEHICLES[0].id)
  const [providers] = useState<Provider[]>(PROVIDERS)
  const [providerId, setProviderId] = useState('towpro')
  const [problemType, setProblemType] = useState<ProblemTypeKey>('engine')
  const [vehicleType, setVehicleType] = useState<VehicleType>(VEHICLES[0].type)
  const [location, setLocation] = useState(USER.address)
  const [photos, setPhotos] = useState<PhotoAttachment[]>([])
  const [stage, setStage] = useState<TripStage>('enroute')
  const [eta, setEta] = useState(8)
  const [currentTrip, setCurrentTrip] = useState<Trip>()
  const [pastTrips, setPastTrips] = useState<Trip[]>(SEED_TRIPS)
  const [receiptTrip, setReceiptTrip] = useState<Trip>()
  const [rating, setRating] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [ratingSubmitted, setRatingSubmitted] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS)
  const [activeConversationId, setActiveConversationId] = useState('driver')
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(seedChats)
  const [chatInput, setChatInput] = useState('')
  const [notifications, setNotifications] = useState<AppNotification[]>(NOTIFICATIONS)
  const [payments, setPayments] = useState<PaymentMethod[]>(PAYMENT_METHODS)
  const [selectedPaymentId, setSelectedPaymentId] = useState(PAYMENT_METHODS[2].id)
  const [toggles, setToggles] = useState<SettingToggles>({
    serviceUpdates: true,
    messageAlerts: true,
    offers: false,
  })
  const [locationMode, setLocationMode] = useState('While using the app')
  const [language, setLanguage] = useState('English')
  const [faqId, setFaqId] = useState(FAQS[0].id)
  const [vehicleForm, setVehicleForm] = useState<{ mode: 'add' | 'edit'; vehicle?: Vehicle }>()
  const [toast, setToast] = useState('')
  const [mapFocusProviderId, setMapFocusProviderId] = useState<string>()

  useSupabaseConnection()

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId)
  const selectedProblem = PROBLEM_TYPES.find((problem) => problem.id === problemType) ?? PROBLEM_TYPES[0]
  const selectedProvider = providers.find((provider) => provider.id === providerId) ?? providers[0]
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId)
  const messages = activeConversation ? chats[activeConversation.id] ?? [] : []
  const unreadCount = conversations.reduce((total, conversation) => total + conversation.unread, 0)
  const selectedPayment = payments.find((method) => method.id === selectedPaymentId) ?? payments[0]
  const paymentLabel = selectedPayment.id === 'cash' ? 'Cash' : `${selectedPayment.name} ${selectedPayment.detail}`
  const showNav = NAV_SCREENS.includes(screen)
  const activeTab: NavTab =
    screen === 'requests' ? 'requests' : screen === 'messages' ? 'messages' : screen === 'profile' ? 'profile' : 'home'

  const tripProvider = useMemo(() => {
    if (!currentTrip) return selectedProvider
    return providers.find((provider) => provider.id === currentTrip.providerId) ?? selectedProvider
  }, [currentTrip, providers, selectedProvider])

  useEffect(() => {
    if (screen !== 'splash') return
    const timer = window.setTimeout(() => setScreen('login'), 1600)
    return () => window.clearTimeout(timer)
  }, [screen])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!guardRef.current) {
      guardRef.current = true
      window.history.pushState({ tgGuard: true }, '')
    }
    const onPopState = () => {
      if (historyRef.current.length > 0) {
        const previous = historyRef.current[historyRef.current.length - 1]
        historyRef.current = historyRef.current.slice(0, -1)
        setScreen(previous)
      } else {
        window.history.pushState({ tgGuard: true }, '')
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (screen !== 'tracking' || stage === 'complete') return
    if (stage === 'enroute' && eta > 1) {
      const timer = window.setTimeout(() => setEta((value) => value - 1), 1400)
      return () => window.clearTimeout(timer)
    }
    if (stage === 'enroute') {
      const timer = window.setTimeout(() => setStage('arrived'), 700)
      return () => window.clearTimeout(timer)
    }
    if (stage === 'arrived') {
      const timer = window.setTimeout(() => setStage('working'), 4200)
      return () => window.clearTimeout(timer)
    }
    if (stage === 'working') {
      const timer = window.setTimeout(() => {
        setStage('complete')
        setCurrentTrip((trip) => (trip ? { ...trip, status: 'complete' } : trip))
      }, 5200)
      return () => window.clearTimeout(timer)
    }
  }, [screen, stage, eta])

  function go(next: AppScreen) {
    historyRef.current.push(screen)
    setScreen(next)
    window.history.pushState({ tg: true }, '')
  }

  function back() {
    if (historyRef.current.length > 0) {
      window.history.back()
      return
    }
    setScreen('home')
  }

  function navTo(target: NavTab) {
    historyRef.current = []
    setScreen(target)
  }

  function providerForTrip(trip?: Trip): Provider {
    if (!trip) return selectedProvider
    return (
      providers.find((provider) => provider.id === trip.providerId) ??
      providers.find((provider) => provider.truck === trip.truck) ??
      selectedProvider
    )
  }

  function openRequest() {
    setProblemType('engine')
    setVehicleType(selectedVehicle?.type ?? 'Sedan')
    setMapFocusProviderId(undefined)
    go('request')
  }

  function openTrucksForProvider(id: string) {
    setMapFocusProviderId(id)
    go('trucks')
  }

  function selectProblem(id: ProblemTypeKey) {
    setProblemType(id)
  }

  function selectVehicleType(type: VehicleType) {
    setVehicleType(type)
    const match = vehicles.find((vehicle) => vehicle.type === type)
    if (match) setSelectedVehicleId(match.id)
  }

  function addPhotos(files: FileList | null) {
    if (!files || files.length === 0) return
    const next = Array.from(files)
      .slice(0, 6)
      .map((file) => ({
        id: `photo-${Date.now()}-${file.name}`,
        url: URL.createObjectURL(file),
        name: file.name,
      }))
    setPhotos((prev) => [...prev, ...next].slice(0, 6))
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id))
  }

  function startRequest(provider: Provider = selectedProvider) {
    if (currentTrip) {
      setPastTrips((prev) => [
        { ...currentTrip, status: currentTrip.status === 'active' ? 'cancelled' : currentTrip.status },
        ...prev,
      ])
    }
    const service = selectedProblem.service
    const identity = nextTripIdentity()
    const trip: Trip = {
      id: identity.id,
      service,
      truck: provider.truck,
      providerId: provider.id,
      problemType,
      date: 'Just now',
      price: fareFor(service, provider),
      distance: provider.distance,
      status: 'active',
      ref: identity.ref,
      customer: user.name,
      location,
    }
    setCurrentTrip(trip)
    setProviderId(provider.id)
    setReceiptTrip(undefined)
    setRating(0)
    setRatingComment('')
    setRatingSubmitted(false)
    setStage('enroute')
    setEta(provider.etaMinutes)
    const greeting = `Hi ${user.firstName}! This is ${provider.driverName} from ${provider.name}. I'm on my way to your location.`
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === 'driver'
          ? {
              ...conversation,
              name: provider.driverName,
              initials: provider.driverInitials,
              preview: greeting,
              time: 'Now',
              unread: 0,
            }
          : conversation,
      ),
    )
    setChats((prev) => ({
      ...prev,
      driver: [{ id: tripSequence, from: 'them', text: greeting, time: 'Now' }],
    }))
    go('tracking')
  }

  function cancelRequest() {
    if (currentTrip) {
      setPastTrips((prev) => [{ ...currentTrip, status: 'cancelled' }, ...prev])
      setCurrentTrip(undefined)
    }
    setPhotos([])
    setStage('enroute')
    setEta(8)
    historyRef.current = []
    setScreen('home')
    setToast('Your request has been cancelled.')
  }

  function openReceipt(trip?: Trip) {
    setReceiptTrip(trip ?? currentTrip ?? pastTrips[0])
    go('receipt')
  }

  function openConversation(id: string) {
    setActiveConversationId(id)
    setConversations((prev) =>
      prev.map((conversation) => (conversation.id === id ? { ...conversation, unread: 0 } : conversation)),
    )
    setChats((prev) => (prev[id] ? prev : { ...prev, [id]: [] }))
    go('chat')
  }

  function sendChat(value?: string) {
    const text = (value ?? chatInput).trim()
    if (!text || !activeConversation) return
    const targetId = activeConversation.id
    setChats((prev) => ({
      ...prev,
      [targetId]: [...(prev[targetId] ?? []), { id: Date.now(), from: 'me', text, time: 'Now' }],
    }))
    setChatInput('')
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === targetId ? { ...conversation, preview: text, time: 'Now' } : conversation,
      ),
    )
    window.setTimeout(() => {
      const reply =
        targetId === 'support'
          ? 'Thanks Dante, a support specialist will join shortly.'
          : 'Thanks Dante, I’ll keep you updated on my arrival.'
      setChats((prev) => ({
        ...prev,
        [targetId]: [...(prev[targetId] ?? []), { id: Date.now() + 1, from: 'them', text: reply, time: 'Now' }],
      }))
    }, 900)
  }

  function callPhoneFor(id: string): string {
    if (id === 'driver') return tripProvider.phone
    return providers.find((provider) => provider.id === id)?.phone ?? SUPPORT_PHONE
  }

  function signOut() {
    historyRef.current = []
    setScreen('login')
  }

  function saveVehicle(vehicle: Vehicle) {
    setVehicles((prev) => {
      const exists = prev.some((item) => item.id === vehicle.id)
      return exists ? prev.map((item) => (item.id === vehicle.id ? vehicle : item)) : [...prev, vehicle]
    })
    setSelectedVehicleId(vehicle.id)
    setVehicleType(vehicle.type)
    setVehicleForm(undefined)
    setToast('Vehicle saved.')
    back()
  }

  function deleteVehicle(id: string) {
    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id))
    if (selectedVehicleId === id) {
      const next = vehicles.find((vehicle) => vehicle.id !== id)
      if (next) setSelectedVehicleId(next.id)
    }
    setToast('Vehicle removed.')
  }

  function addPayment() {
    if (payments.some((method) => method.id === 'bpi')) {
      setSelectedPaymentId('bpi')
      return
    }
    const method: PaymentMethod = {
      id: 'bpi',
      brand: 'BPI',
      name: 'BPI Online Banking',
      detail: '•••• 5521 · Linked account',
      tone: 'cyan',
    }
    setPayments((prev) => [...prev, method])
    setSelectedPaymentId(method.id)
    setToast('Payment method added.')
  }

  function openNotification(id: string) {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
    if (id === 'n1' && currentTrip) go('tracking')
    if (id === 'n3') openReceipt(pastTrips[0])
  }

  function openFaq(id: string) {
    setFaqId(id)
    go('faqDetail')
  }

  function renderScreen() {
    if (screen === 'splash') {
      return (
        <div className="tg-splash" onClick={() => setScreen('login')}>
          <StatusBar light />
          <div className="tg-splash-body">
            <div className="tg-splash-mark">
              <Logo light />
            </div>
            <h1>TowGo</h1>
            <p>Roadside help, right when you need it.</p>
            <span className="tg-splash-loader">
              <span />
              <span />
              <span />
            </span>
          </div>
          <p className="tg-splash-foot">Roadside Assistance – Fast. Safe. Nearby.</p>
        </div>
      )
    }

    if (screen === 'login') {
      return (
        <LoginScreen
          language={language}
          onLanguage={setLanguage}
          onSignIn={() => {
            historyRef.current = []
            setScreen('home')
          }}
          onForgot={() => setToast('Password reset link sent to your email.')}
        />
      )
    }

    if (screen === 'home') {
      return (
        <HomeScreen
          location={location}
          activeTrip={currentTrip?.status === 'active' ? currentTrip : undefined}
          activeProvider={currentTrip ? tripProvider : undefined}
          selectedVehicle={selectedVehicle}
          recentTrips={pastTrips}
          providers={providers}
          onSearchLocation={(value) => {
            setLocation(value)
            setToast('Location updated.')
          }}
          onRequest={openRequest}
          onTrack={() => go('tracking')}
          onProfile={() => navTo('profile')}
          onMessages={() => navTo('messages')}
          onNotifications={() => go('notifications')}
          onRequests={() => navTo('requests')}
          onVehicles={() => go('vehicles')}
          onMapProvider={openTrucksForProvider}
        />
      )
    }

    if (screen === 'request') {
      return (
        <RequestScreen
          problems={PROBLEM_TYPES}
          selectedProblem={selectedProblem}
          onProblem={selectProblem}
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          vehicleType={vehicleType}
          onVehicleType={selectVehicleType}
          location={location}
          onLocation={setLocation}
          photos={photos}
          onAddPhotos={addPhotos}
          onRemovePhoto={removePhoto}
          onBack={back}
          onFind={() => {
            setMapFocusProviderId(undefined)
            go('trucks')
          }}
        />
      )
    }

    if (screen === 'trucks') {
      return (
        <TrucksScreen
          providers={providers.filter(
            (provider) => !(problemType === 'accident' && provider.truck === 'hook'),
          )}
          location={location}
          onBack={back}
          onRequest={(id) => {
            const provider = providers.find((item) => item.id === id)
            if (provider) startRequest(provider)
          }}
          initialSelectedId={mapFocusProviderId}
        />
      )
    }

    if (screen === 'tracking') {
      return (
        <TrackingScreen
          provider={tripProvider}
          stage={stage}
          eta={eta}
          serviceLabel={serviceLabel(currentTrip?.service ?? selectedProblem.service)}
          problemLabel={problemLabel(problemType)}
          onBack={() => navTo('home')}
          onCancel={cancelRequest}
          onMessage={() => openConversation('driver')}
          onCall={() => go('call')}
          onComplete={() => go('complete')}
          onReceipt={() => openReceipt(currentTrip)}
          onPhotos={() => go('photos')}
        />
      )
    }

    if (screen === 'photos') {
      return (
        <PhotosScreen
          photos={photos}
          onAddPhotos={addPhotos}
          onRemovePhoto={removePhoto}
          onBack={back}
          onDone={back}
        />
      )
    }

    if (screen === 'complete') {
      const trip = currentTrip ?? pastTrips[0]
      return (
        <CompleteScreen
          trip={trip}
          provider={providerForTrip(trip)}
          serviceLabel={serviceLabel(trip.service)}
          truckLabel={truckLabel(trip.truck)}
          onReceipt={() => openReceipt(trip)}
          onRate={() => go('rating')}
          onHome={() => navTo('home')}
        />
      )
    }

    if (screen === 'receipt') {
      const trip = receiptTrip ?? currentTrip ?? pastTrips[0]
      return (
        <ReceiptScreen
          trip={trip}
          provider={providerForTrip(trip)}
          serviceLabel={serviceLabel(trip.service)}
          truckLabel={truckLabel(trip.truck)}
          paymentLabel={paymentLabel}
          onBack={back}
          onRate={() => go('rating')}
          onHome={() => navTo('home')}
        />
      )
    }

    if (screen === 'rating') {
      return (
        <RatingScreen
          submitted={ratingSubmitted}
          rating={rating}
          comment={ratingComment}
          provider={providerForTrip(receiptTrip ?? currentTrip ?? pastTrips[0])}
          onRating={setRating}
          onComment={setRatingComment}
          onSubmit={() => {
            setRatingSubmitted(true)
            setToast('Thanks for your feedback!')
          }}
          onSkip={() => navTo('home')}
          onHome={() => navTo('home')}
        />
      )
    }

    if (screen === 'profile') {
      return (
        <ProfileScreen
          user={user}
          requestCount={pastTrips.length + (currentTrip ? 1 : 0)}
          vehicleCount={vehicles.length}
          onGo={go}
          onSignOut={signOut}
        />
      )
    }

    if (screen === 'personal') {
      return (
        <PersonalScreen
          user={user}
          onBack={back}
          onSave={(next) => {
            setUser(next)
            setToast('Profile updated.')
            back()
          }}
        />
      )
    }

    if (screen === 'password') {
      return (
        <PasswordScreen
          onBack={back}
          onSaved={() => {
            setToast('Password changed.')
            back()
          }}
        />
      )
    }

    if (screen === 'support') {
      return (
        <SupportScreen
          onBack={back}
          onGo={(next) => {
            if (next === 'chat') {
              openConversation('support')
            } else if (next === 'call') {
              setActiveConversationId('support')
              go('call')
            } else {
              go(next)
            }
          }}
          onFaq={openFaq}
        />
      )
    }

    if (screen === 'messages') {
      return (
        <MessagesScreen
          conversations={conversations}
          onOpen={openConversation}
          onBack={() => navTo('home')}
        />
      )
    }

    if (screen === 'chat') {
      return (
        <ChatScreen
          messages={messages}
          input={chatInput}
          onInput={setChatInput}
          onSend={sendChat}
          onBack={back}
          onCall={() => go('call')}
          contactName={activeConversation?.name ?? 'TowGo Support'}
          contactSub={activeConversation?.online ? 'Online now' : 'Typically replies in a few minutes'}
          contactInitials={activeConversation?.initials ?? 'TG'}
        />
      )
    }

    if (screen === 'call') {
      return (
        <CallScreen
          onBack={back}
          contactName={activeConversation?.name ?? tripProvider.driverName}
          phone={callPhoneFor(activeConversationId)}
        />
      )
    }

    if (screen === 'email') {
      return <EmailScreen onBack={back} />
    }

    if (screen === 'vehicles') {
      return (
        <VehiclesScreen
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelect={(id) => {
            setSelectedVehicleId(id)
            const vehicle = vehicles.find((item) => item.id === id)
            if (vehicle) setVehicleType(vehicle.type)
            setToast('Vehicle selected.')
            back()
          }}
          onAdd={() => {
            setVehicleForm({ mode: 'add' })
            go('vehicleForm')
          }}
          onEdit={(vehicle) => {
            setVehicleForm({ mode: 'edit', vehicle })
            go('vehicleForm')
          }}
          onDelete={deleteVehicle}
          onBack={back}
        />
      )
    }

    if (screen === 'vehicleForm') {
      return (
        <VehicleFormScreen
          key={vehicleForm?.vehicle?.id ?? 'new-vehicle'}
          initial={vehicleForm?.vehicle}
          onBack={back}
          onSave={saveVehicle}
        />
      )
    }

    if (screen === 'requests') {
      return (
        <RequestsScreen
          requests={pastTrips}
          activeTrip={currentTrip?.status === 'active' ? currentTrip : undefined}
          providers={providers}
          onReceipt={(trip) => openReceipt(trip)}
          onTrack={() => go('tracking')}
          onNewRequest={openRequest}
        />
      )
    }

    if (screen === 'payments') {
      return (
        <PaymentsScreen
          methods={payments}
          selectedId={selectedPaymentId}
          onSelect={setSelectedPaymentId}
          onAdd={addPayment}
          onSave={() => {
            setToast('Payment preferences saved.')
            back()
          }}
          onBack={back}
        />
      )
    }

    if (screen === 'notifications') {
      return (
        <NotificationsScreen
          notifications={notifications}
          onMarkAll={() =>
            setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
          }
          onOpen={openNotification}
          onBack={back}
        />
      )
    }

    if (screen === 'settings') {
      return (
        <SettingsScreen
          toggles={toggles}
          onToggle={(key) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }))}
          locationMode={locationMode}
          language={language}
          onGo={go}
          onBack={back}
        />
      )
    }

    if (screen === 'locationAccess') {
      return (
        <LocationAccessScreen
          mode={locationMode}
          onChange={setLocationMode}
          onSave={() => {
            setToast('Location preference saved.')
            back()
          }}
          onBack={back}
        />
      )
    }

    if (screen === 'faq') {
      return <FaqScreen onBack={back} onOpen={openFaq} />
    }

    if (screen === 'faqDetail') {
      return (
        <FaqDetailScreen
          faq={FAQS.find((item) => item.id === faqId) ?? FAQS[0]}
          onBack={back}
          onOpen={setFaqId}
        />
      )
    }

    if (screen === 'language') {
      return (
        <LanguageScreen
          language={language}
          onChange={(next) => {
            setLanguage(next)
            setToast(`Language set to ${next}.`)
          }}
          onBack={back}
        />
      )
    }

    if (screen === 'privacy') {
      return <PrivacyScreen onBack={back} />
    }

    if (screen === 'about') {
      return <AboutScreen onBack={back} />
    }

    return null
  }

  return (
    <div className={`tg-root${screen === 'splash' ? ' splash-mode' : ''}`}>
      <div className={`tg-device${screen === 'splash' ? ' splash-device' : ''}`}>
        {screen !== 'splash' ? <StatusBar /> : null}
        <div className={`tg-app-body${showNav ? ' with-nav' : ''}`}>{renderScreen()}</div>
        {showNav ? <BottomNav active={activeTab} onNav={navTo} unread={unreadCount} /> : null}
        {toast ? <Toast message={toast} /> : null}
      </div>
    </div>
  )
}

function LoginScreen({
  language,
  onLanguage,
  onSignIn,
  onForgot,
}: {
  language: string
  onLanguage: (language: string) => void
  onSignIn: () => void
  onForgot: () => void
}) {
  const [email, setEmail] = useState('dante.cruz@example.com')
  const [password, setPassword] = useState('towgo123')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authPending, setAuthPending] = useState<'' | 'google' | 'apple'>('')
  const languages = ['English', 'Filipino', 'Spanish']

  async function signInWithProvider(provider: 'google' | 'apple') {
    setAuthError('')
    setAuthPending(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    })
    if (error) {
      setAuthPending('')
      setAuthError(error.message)
      console.error(`[Auth] ${provider} sign-in failed:`, error)
    }
  }

  return (
    <div className="tg-login">
      <div className="tg-login-brand">
        <div className="tg-login-top">
          <span className="tg-login-badge">24/7 assistance</span>
        </div>
        <div className="tg-login-heading">
          <div className="tg-login-heading-logo">
            <span className="tg-login-seal" aria-hidden="true">
              <svg className="tg-login-seal-ring" viewBox="0 0 200 200">
                <defs>
                  <path
                    id="tgSealPath"
                    d="M100,100 m0,-78 a78,78 0 1,1 0,156 a78,78 0 1,1 0,-156"
                    fill="none"
                  />
                </defs>
                <text className="tg-login-seal-text">
                  <textPath href="#tgSealPath" startOffset="2%">
                    TOWGO • ROADSIDE ASSISTANCE • 24/7 •
                  </textPath>
                </text>
              </svg>
              <span className="tg-login-seal-mark">
                <TruckMark width={64} height={64} color="#0b2f50" wheel="#0b2f50" />
              </span>
            </span>
          </div>
          <span className="tg-section-kicker">Roadside Assistance – Fast. Safe. Nearby.</span>
          <h1>Welcome back</h1>
          <p>Sign in to request a tow truck in Kidapawan City.</p>
        </div>
        <ul className="tg-login-features">
          <li className="tg-login-feature">
            <span className="tg-login-feature-icon">
              <Icon name="bolt" size={15} />
            </span>
            Fast, safe roadside help
          </li>
          <li className="tg-login-feature">
            <span className="tg-login-feature-icon">
              <Icon name="truck" size={15} />
            </span>
            Vetted local tow providers
          </li>
          <li className="tg-login-feature">
            <span className="tg-login-feature-icon">
              <Icon name="shield-check" size={15} />
            </span>
            Upfront, transparent pricing
          </li>
        </ul>
      </div>
      <div className="tg-login-panel">
        <div className="tg-login-panel-head">
          <div className="tg-login-panel-logo">
            <Logo />
          </div>
          <h2>Sign in</h2>
          <p>Enter your details to continue.</p>
        </div>
        <form
          className="tg-login-form"
          onSubmit={(event) => {
            event.preventDefault()
            onSignIn()
          }}
        >
          <label className="tg-field">
            <span className="tg-label">Email address</span>
            <span className="tg-input-wrap">
              <Icon name="mail" size={17} />
              <input
                className="tg-input"
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(event) => setEmail(event.target.value)}
              />
            </span>
          </label>
          <label className="tg-field">
            <span className="tg-label">Password</span>
            <span className="tg-input-wrap">
              <Icon name="lock" size={17} />
              <input
                className="tg-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="Enter password"
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="tg-eye"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={17} />
              </button>
            </span>
          </label>
          <button type="button" className="tg-forgot" onClick={onForgot}>
            Forgot password?
          </button>
          <button type="submit" className="tg-btn tg-btn-primary tg-btn-block">
            Sign In
            <Icon name="arrow-right" size={17} />
          </button>
        </form>
        <div className="tg-divider">
          <span>or continue with</span>
        </div>
        <div className="tg-social-row">
          <button
            type="button"
            className="tg-social-btn"
            onClick={() => void signInWithProvider('google')}
            disabled={authPending !== ''}
          >
            <span className="tg-social-g">G</span>
            Google
          </button>
          <button
            type="button"
            className="tg-social-btn"
            onClick={() => void signInWithProvider('apple')}
            disabled={authPending !== ''}
          >
            <Icon name="brand-apple" size={17} />
            Apple
          </button>
        </div>
        {authError ? (
          <p className="tg-auth-error" role="alert">
            {authError}
          </p>
        ) : null}
        <p className="tg-login-new">
          New to TowGo? <button type="button" onClick={onSignIn}>Create an account</button>
        </p>
        <div className="tg-login-lang">
          {languages.map((item) => (
            <button
              key={item}
              type="button"
              className={language === item ? 'active' : ''}
              onClick={() => onLanguage(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
