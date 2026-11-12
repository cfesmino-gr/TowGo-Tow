export type DispatchRequest = {
  truck: string
  accident: boolean
  note: string
  earn: number
}

export type ServiceKey = 'towing' | 'battery' | 'tire' | 'fuel'
export type TruckKey = 'flatbed' | 'hook' | 'heavy'
export type ProblemTypeKey = 'engine' | 'flat_tire' | 'battery' | 'accident' | 'other'
export type TripStage = 'enroute' | 'arrived' | 'working' | 'complete'
export type VehicleType = 'Sedan' | 'Van' | 'SUV'
export type Tone = 'mint' | 'cyan' | 'orange' | 'navy'

export type AppScreen =
  | 'splash'
  | 'login'
  | 'home'
  | 'request'
  | 'trucks'
  | 'tracking'
  | 'photos'
  | 'complete'
  | 'receipt'
  | 'rating'
  | 'profile'
  | 'personal'
  | 'password'
  | 'support'
  | 'messages'
  | 'chat'
  | 'call'
  | 'email'
  | 'vehicles'
  | 'vehicleForm'
  | 'requests'
  | 'payments'
  | 'notifications'
  | 'settings'
  | 'locationAccess'
  | 'faq'
  | 'faqDetail'
  | 'language'
  | 'privacy'
  | 'about'

export type UserProfile = {
  name: string
  firstName: string
  email: string
  phone: string
  address: string
  initials: string
  rating: string
  avatar?: string
}

export type Vehicle = {
  id: string
  nickname: string
  make: string
  model: string
  year: string
  plate: string
  color: string
  type: VehicleType
  registration: string
  isDefault?: boolean
}

export type Trip = {
  id: string
  service: ServiceKey
  truck: TruckKey
  date: string
  price: number
  distance: string
  status: 'active' | 'complete' | 'cancelled'
  ref: string
  providerId: string
  problemType: ProblemTypeKey
  customer: string
  location: string
}

export type ChatMessage = {
  id: number
  from: 'me' | 'them'
  text: string
  time: string
}

export type ServiceOption = {
  id: ServiceKey
  label: string
  price: string
  base: number
  icon: string
}

export type Provider = {
  id: string
  name: string
  initials: string
  meta: string
  price: number
  eta: string
  etaMinutes: number
  badge: string
  distance: string
  distanceKm: number
  rating: string
  reviews: number
  tone: Tone
  truck: TruckKey
  driverName: string
  driverInitials: string
  driverRating: string
  plate: string
  vehicle: string
  phone: string
}

export type ProblemType = {
  id: ProblemTypeKey
  label: string
  hint: string
  icon: string
  service: ServiceKey
}

export type Conversation = {
  id: string
  name: string
  initials: string
  preview: string
  time: string
  unread: number
  online?: boolean
  tone: Tone
  kind: 'current' | 'earlier'
}

export type PaymentMethod = {
  id: string
  brand: string
  name: string
  detail: string
  tone: Tone
}

export type AppNotification = {
  id: string
  group: 'today' | 'earlier'
  title: string
  body: string
  time: string
  read: boolean
  icon: string
  tone: Tone
}

export type FaqItem = {
  id: string
  question: string
  summary: string
  answer: string[]
  tips?: string[]
}

export type PhotoAttachment = {
  id: string
  url: string
  name: string
}
