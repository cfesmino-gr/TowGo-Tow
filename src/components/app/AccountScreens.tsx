import { useEffect, useRef, useState } from 'react'
import type {
  AppNotification,
  AppScreen,
  ChatMessage,
  Conversation,
  FaqItem,
  PaymentMethod,
  Provider,
  Trip,
  UserProfile,
  Vehicle,
  VehicleType,
} from '../../types'
import { formatPeso, initialsOf } from '../../lib/format'
import { ABOUT_FACTS, FAQS, SUPPORT_FAQS } from '../../lib/data'
import { TruckMark } from '../TruckIcon'
import { Icon, Logo, PageHeader, PasswordField } from './Shared'

function serviceName(service: Trip['service']): string {
  if (service === 'towing') return 'Towing'
  if (service === 'battery') return 'Battery Jump'
  if (service === 'tire') return 'Flat Tire'
  return 'Fuel Delivery'
}

export function ProfileScreen({
  user,
  requestCount,
  vehicleCount,
  onGo,
  onSignOut,
}: {
  user: UserProfile
  requestCount: number
  vehicleCount: number
  onGo: (screen: AppScreen) => void
  onSignOut: () => void
}) {
  const menu = [
    { icon: 'clipboard-list', label: 'My Requests', target: 'requests' },
    { icon: 'credit-card', label: 'Payment Methods', target: 'payments' },
    { icon: 'car', label: 'Vehicle Information', target: 'vehicles' },
    { icon: 'bell', label: 'Notifications', target: 'notifications' },
    { icon: 'help-circle', label: 'Help & Support', target: 'support' },
    { icon: 'settings', label: 'Settings', target: 'settings' },
    { icon: 'user-circle', label: 'Edit Profile', target: 'personal' },
  ] as const

  return (
    <div className="tg-screen tg-profile-screen">
      <div className="tg-profile-head">
        <div>
          <span className="tg-section-kicker">TowGo member</span>
          <h1>Profile</h1>
        </div>
        <button type="button" className="tg-icon-btn" onClick={() => onGo('settings')} aria-label="Open settings">
          <Icon name="settings" size={19} />
        </button>
      </div>
      <section className="tg-profile-card">
        <div className="tg-profile-avatar">
          {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.initials}
          <button type="button" className="tg-avatar-edit" onClick={() => onGo('personal')} aria-label="Edit profile photo">
            <Icon name="pencil" size={11} />
          </button>
        </div>
        <div className="tg-profile-copy">
          <h2>{user.name}</h2>
          <span>{user.phone}</span>
          <span>{user.email}</span>
          <span className="tg-verified">
            <Icon name="rosette-check" size={13} />
            Verified member
          </span>
        </div>
      </section>
      <div className="tg-stat-grid">
        <div className="tg-stat">
          <strong>{requestCount}</strong>
          <span>Requests</span>
        </div>
        <div className="tg-stat">
          <strong>{vehicleCount}</strong>
          <span>Vehicles</span>
        </div>
        <div className="tg-stat">
          <strong>{user.rating}</strong>
          <span>Rating</span>
        </div>
      </div>
      <section className="tg-menu-card">
        {menu.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={`tg-menu-row${index < menu.length - 1 ? ' bordered' : ''}`}
            onClick={() => onGo(item.target)}
          >
            <span className="tg-menu-icon">
              <Icon name={item.icon} size={18} />
            </span>
            <span className="tg-menu-label">{item.label}</span>
            <Icon name="chevron-right" size={17} />
          </button>
        ))}
      </section>
      <button type="button" className="tg-signout" onClick={onSignOut}>
        <Icon name="logout" size={17} />
        Log Out
      </button>
      <p className="tg-profile-since">TowGo member since 2024 · Roadside Assistance – Fast. Safe. Nearby.</p>
    </div>
  )
}

export function PersonalScreen({
  user,
  onBack,
  onSave,
}: {
  user: UserProfile
  onBack: () => void
  onSave: (user: UserProfile) => void
}) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [address, setAddress] = useState(user.address)
  const [avatar, setAvatar] = useState(user.avatar)
  const fileRef = useRef<HTMLInputElement>(null)
  const valid = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && phone.trim().length > 5

  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="Personal Information" subtitle="Keep your details up to date" onBack={onBack} />
      <div className="tg-personal-avatar">
        <span className="tg-profile-avatar">
          {avatar ? <img src={avatar} alt={name} /> : initialsOf(name)}
        </span>
        <button type="button" className="tg-text-btn" onClick={() => fileRef.current?.click()}>
          <Icon name="camera" size={14} />
          Change photo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) setAvatar(URL.createObjectURL(file))
            event.target.value = ''
          }}
        />
      </div>
      <div className="tg-form-card">
        <label className="tg-field">
          <span className="tg-label">Full name</span>
          <input className="tg-input" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="tg-field">
          <span className="tg-label">Email address</span>
          <input className="tg-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="tg-field">
          <span className="tg-label">Phone number</span>
          <input className="tg-input" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </label>
        <label className="tg-field">
          <span className="tg-label">Home address</span>
          <input className="tg-input" value={address} onChange={(event) => setAddress(event.target.value)} />
        </label>
      </div>
      <button
        type="button"
        className="tg-btn tg-btn-primary tg-btn-block"
        disabled={!valid}
        onClick={() =>
          onSave({
            ...user,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
            initials: initialsOf(name.trim()),
            avatar,
          })
        }
      >
        Save Changes
      </button>
    </div>
  )
}

export function PasswordScreen({ onBack, onSaved }: { onBack: () => void; onSaved: () => void }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const mismatch = confirm.length > 0 && next !== confirm
  const tooShort = next.length > 0 && next.length < 8
  const valid = current.length > 0 && next.length >= 8 && next === confirm

  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="Change Password" subtitle="Use at least 8 characters" onBack={onBack} />
      <div className="tg-form-card">
        <PasswordField label="Current password" value={current} onChange={setCurrent} placeholder="Enter current password" />
        <PasswordField
          label="New password"
          value={next}
          onChange={setNext}
          placeholder="Enter new password"
          autoComplete="new-password"
          error={tooShort ? 'Password must be at least 8 characters.' : undefined}
        />
        <PasswordField
          label="Confirm new password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Re-enter new password"
          autoComplete="new-password"
          error={mismatch ? 'Passwords do not match.' : undefined}
        />
      </div>
      <div className="tg-note-card">
        <Icon name="shield-lock" size={20} />
        <p>Choose a strong password you have not used on other apps.</p>
      </div>
      <button type="button" className="tg-btn tg-btn-primary tg-btn-block" disabled={!valid} onClick={onSaved}>
        Change Password
      </button>
    </div>
  )
}

export function SupportScreen({
  onBack,
  onGo,
  onFaq,
}: {
  onBack: () => void
  onGo: (screen: AppScreen) => void
  onFaq: (id: string) => void
}) {
  const [openId, setOpenId] = useState<string>()

  return (
    <div className="tg-screen tg-subpage">
      <PageHeader
        title="Help & Support"
        onBack={onBack}
        action={
          <span className="tg-online-pill">
            <span className="tg-live-dot" />
            Online 24/7
          </span>
        }
      />
      <section className="tg-support-hero">
        <div>
          <h2>We are here to help</h2>
          <p>Reach our team any time, day or night.</p>
        </div>
        <span className="tg-support-art">
          <Icon name="headset" size={54} />
        </span>
      </section>
      <div className="tg-support-actions">
        <button type="button" className="tg-support-card" onClick={() => onGo('chat')}>
          <span className="tg-support-icon chat">
            <Icon name="message-chatbot" size={22} />
          </span>
          <span>
            <strong>Chat with Support</strong>
            <small>Typical reply in under 2 minutes</small>
          </span>
          <Icon name="chevron-right" size={17} />
        </button>
        <button type="button" className="tg-support-card" onClick={() => onGo('call')}>
          <span className="tg-support-icon call">
            <Icon name="phone" size={20} />
          </span>
          <span>
            <strong>Call Support</strong>
            <small>+63 2 8888 2468</small>
          </span>
          <Icon name="chevron-right" size={17} />
        </button>
        <button type="button" className="tg-support-card" onClick={() => onGo('email')}>
          <span className="tg-support-icon email">
            <Icon name="mail" size={21} />
          </span>
          <span>
            <strong>Email Support</strong>
            <small>help@towgo.ph</small>
          </span>
          <Icon name="chevron-right" size={17} />
        </button>
      </div>
      <div className="tg-faq">
        <div className="tg-section-head tg-section-head-tight">
          <h3>Frequently Asked Questions</h3>
          <button type="button" className="tg-text-btn" onClick={() => onGo('faq')}>
            View all
            <Icon name="arrow-right" size={14} />
          </button>
        </div>
        {SUPPORT_FAQS.map((faq) => {
          const open = openId === faq.id
          return (
            <div key={faq.id} className={`tg-faq-item${open ? ' open' : ''}`}>
              <button
                type="button"
                className="tg-faq-row"
                onClick={() => setOpenId(open ? undefined : faq.id)}
                aria-expanded={open}
              >
                <span>{faq.question}</span>
                <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
              </button>
              {open ? (
                <div className="tg-faq-answer">
                  <p>{faq.summary}</p>
                  <button type="button" className="tg-text-btn" onClick={() => onFaq(faq.id)}>
                    Read full answer
                    <Icon name="arrow-right" size={13} />
                  </button>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function MessagesScreen({
  conversations,
  onOpen,
  onBack,
}: {
  conversations: Conversation[]
  onOpen: (id: string) => void
  onBack: () => void
}) {
  const [query, setQuery] = useState('')
  const filtered = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(query.toLowerCase()) ||
      conversation.preview.toLowerCase().includes(query.toLowerCase()),
  )
  const current = filtered.filter((conversation) => conversation.kind === 'current')
  const earlier = filtered.filter((conversation) => conversation.kind === 'earlier')

  return (
    <div className="tg-screen tg-subpage tg-conversations-screen">
      <PageHeader title="Messages" subtitle="Chat with your driver and support" onBack={onBack} />
      <form className="tg-search tg-msg-search" onSubmit={(event) => event.preventDefault()}>
        <Icon name="search" size={17} />
        <input
          value={query}
          placeholder="Search messages"
          aria-label="Search messages"
          onChange={(event) => setQuery(event.target.value)}
        />
        {query ? (
          <button type="button" className="tg-search-btn" onClick={() => setQuery('')} aria-label="Clear search">
            <Icon name="x" size={15} />
          </button>
        ) : null}
      </form>

      {current.length > 0 ? (
        <>
          <span className="tg-list-label">Current Request</span>
          <div className="tg-conversation-list">
            {current.map((conversation) => (
              <ConversationRow key={conversation.id} conversation={conversation} onOpen={onOpen} />
            ))}
          </div>
        </>
      ) : null}

      <span className="tg-list-label">Earlier Conversations</span>
      <div className="tg-conversation-list">
        {earlier.length === 0 ? (
          <div className="tg-empty">
            <Icon name="message-off" size={30} />
            <p>No conversations match your search.</p>
          </div>
        ) : (
          earlier.map((conversation) => (
            <ConversationRow key={conversation.id} conversation={conversation} onOpen={onOpen} />
          ))
        )}
      </div>
      <div className="tg-note-card">
        <Icon name="shield-check" size={20} />
        <p>Messages are end-to-end encrypted and shared only with your provider.</p>
      </div>
    </div>
  )
}

function ConversationRow({
  conversation,
  onOpen,
}: {
  conversation: Conversation
  onOpen: (id: string) => void
}) {
  return (
    <button type="button" className="tg-conversation-card" onClick={() => onOpen(conversation.id)}>
      <span className={`tg-conversation-avatar tone-${conversation.tone}`}>{conversation.initials}</span>
      <span className="tg-conversation-copy">
        <span className="tg-conversation-top">
          <strong>{conversation.name}</strong>
          <small>{conversation.time}</small>
        </span>
        <span className="tg-conversation-preview">{conversation.preview}</span>
      </span>
      {conversation.unread > 0 ? (
        <span className="tg-conversation-count">{conversation.unread}</span>
      ) : (
        <Icon name="chevron-right" size={16} />
      )}
    </button>
  )
}

export function ChatScreen({
  messages,
  input,
  onInput,
  onSend,
  onBack,
  onCall,
  contactName,
  contactSub,
  contactInitials,
}: {
  messages: ChatMessage[]
  input: string
  onInput: (value: string) => void
  onSend: (value?: string) => void
  onBack: () => void
  onCall: () => void
  contactName: string
  contactSub: string
  contactInitials: string
}) {
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])
  const quick = ['I am on my way', 'Please call me', 'Where are you?']

  return (
    <div className="tg-screen tg-chat-screen">
      <PageHeader
        title={contactName}
        subtitle={contactSub}
        onBack={onBack}
        action={
          <button type="button" className="tg-icon-btn" onClick={onCall} aria-label="Call">
            <Icon name="phone" size={18} />
          </button>
        }
      />
      <div className="tg-chat-messages" ref={listRef}>
        <div className="tg-chat-agent">
          <span className="tg-support-icon chat">{contactInitials}</span>
          <span>{contactName}</span>
          <span className="tg-online-dot" />
        </div>
        {messages.map((message) => (
          <div key={message.id} className={`tg-bubble-row${message.from === 'me' ? ' me' : ''}`}>
            {message.from === 'them' ? <span className="tg-bubble-avatar">{contactInitials}</span> : null}
            <div className={`tg-bubble ${message.from === 'me' ? 'me' : 'support'}`}>
              {message.text}
              <small className="tg-bubble-time">{message.time}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="tg-chat-quick">
        {quick.map((item) => (
          <button key={item} type="button" className="tg-chip" onClick={() => onSend(item)}>
            {item}
          </button>
        ))}
      </div>
      <form
        className="tg-chat-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSend()
        }}
      >
        <button type="button" className="tg-icon-btn" aria-label="Attach">
          <Icon name="paperclip" size={18} />
        </button>
        <input
          className="tg-input"
          value={input}
          placeholder="Type a message"
          onChange={(event) => onInput(event.target.value)}
        />
        <button type="submit" className="tg-chat-send" aria-label="Send message">
          <Icon name="send" size={17} />
        </button>
      </form>
    </div>
  )
}

export function CallScreen({
  onBack,
  contactName,
  phone,
}: {
  onBack: () => void
  contactName: string
  phone: string
}) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  return (
    <div className="tg-screen tg-subpage tg-call-screen">
      <PageHeader title="Call" onBack={onBack} />
      <div className="tg-call-body">
        <span className="tg-call-avatar">
          <Icon name="headset" size={48} />
          <span className="tg-call-pulse" />
        </span>
        <h1>{contactName}</h1>
        <p>{phone}</p>
        <span className="tg-call-note">Calling… {clock}</span>
        <button type="button" className="tg-call-end" onClick={onBack} aria-label="End call">
          <Icon name="phone-off" size={24} />
        </button>
        <span className="tg-call-end-label">End call</span>
      </div>
    </div>
  )
}

export function EmailScreen({ onBack }: { onBack: () => void }) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  if (sent) {
    return (
      <div className="tg-screen tg-subpage tg-rating-submitted">
        <div className="tg-success">
          <span className="tg-success-icon">
            <Icon name="mail-check" size={32} />
          </span>
          <span className="tg-success-rings" aria-hidden="true" />
        </div>
        <h1 className="tg-complete-title">Message sent</h1>
        <p className="tg-complete-sub">Our support team will reply to your email within 24 hours.</p>
        <button type="button" className="tg-btn tg-btn-primary tg-btn-block" onClick={onBack}>
          Back to Support
        </button>
      </div>
    )
  }
  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="Email Support" subtitle="help@towgo.ph" onBack={onBack} />
      <div className="tg-form-card">
        <label className="tg-field">
          <span className="tg-label">Subject</span>
          <input
            className="tg-input"
            value={subject}
            placeholder="How can we help?"
            onChange={(event) => setSubject(event.target.value)}
          />
        </label>
        <label className="tg-field">
          <span className="tg-label">Message</span>
          <textarea
            className="tg-textarea"
            value={message}
            placeholder="Describe your concern"
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>
      </div>
      <button
        type="button"
        className="tg-btn tg-btn-primary tg-btn-block"
        disabled={!subject.trim() || !message.trim()}
        onClick={() => setSent(true)}
      >
        Send Email
      </button>
    </div>
  )
}

export function VehiclesScreen({
  vehicles,
  selectedVehicleId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  onBack,
}: {
  vehicles: Vehicle[]
  selectedVehicleId: string
  onSelect: (id: string) => void
  onAdd: () => void
  onEdit: (vehicle: Vehicle) => void
  onDelete: (id: string) => void
  onBack: () => void
}) {
  return (
    <div className="tg-screen tg-subpage">
      <PageHeader
        title="Vehicle Information"
        subtitle="Manage your garage"
        onBack={onBack}
        action={
          <button type="button" className="tg-icon-btn accent" onClick={onAdd} aria-label="Add vehicle">
            <Icon name="plus" size={18} />
          </button>
        }
      />
      <div className="tg-supported-types">
        <span className="tg-label">Supported vehicle types</span>
        <div className="tg-chip-row">
          {(['Sedan', 'Van', 'SUV'] as VehicleType[]).map((type) => (
            <span key={type} className="tg-chip">
              <Icon name="car" size={14} />
              {type}
            </span>
          ))}
        </div>
      </div>
      {vehicles.length === 0 ? (
        <div className="tg-empty">
          <Icon name="car-off" size={36} />
          <p>No vehicles yet. Add your first vehicle to request a tow faster.</p>
        </div>
      ) : (
        <div className="tg-vehicle-list">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className={`tg-vehicle-card${vehicle.id === selectedVehicleId ? ' selected' : ''}`}>
              <span className="tg-vehicle-card-art">
                <Icon name="car" size={42} />
              </span>
              <div className="tg-vehicle-card-copy">
                <span className="tg-vehicle-card-title">
                  <strong>{vehicle.nickname || `${vehicle.make} ${vehicle.model}`}</strong>
                  {vehicle.id === selectedVehicleId ? <em>Default</em> : null}
                </span>
                <span>
                  {vehicle.make} {vehicle.model} · {vehicle.year}
                </span>
                <span>
                  {vehicle.type} · {vehicle.color}
                </span>
                <b>{vehicle.plate}</b>
                <span className="tg-vehicle-reg">{vehicle.registration}</span>
              </div>
              <div className="tg-vehicle-card-actions">
                <button type="button" className="tg-icon-btn" onClick={() => onEdit(vehicle)} aria-label="Edit vehicle">
                  <Icon name="pencil" size={15} />
                </button>
                <button type="button" className="tg-text-btn" onClick={() => onSelect(vehicle.id)}>
                  {vehicle.id === selectedVehicleId ? 'Selected' : 'Choose'}
                </button>
                <button type="button" className="tg-text-btn danger" onClick={() => onDelete(vehicle.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button type="button" className="tg-btn tg-btn-primary tg-btn-block" onClick={onAdd}>
        <Icon name="plus" size={17} />
        Add a Vehicle
      </button>
    </div>
  )
}

export function VehicleFormScreen({
  initial,
  onBack,
  onSave,
}: {
  initial?: Vehicle
  onBack: () => void
  onSave: (vehicle: Vehicle) => void
}) {
  const [nickname, setNickname] = useState(initial?.nickname ?? '')
  const [make, setMake] = useState(initial?.make ?? '')
  const [model, setModel] = useState(initial?.model ?? '')
  const [year, setYear] = useState(initial?.year ?? '')
  const [plate, setPlate] = useState(initial?.plate ?? '')
  const [color, setColor] = useState(initial?.color ?? '')
  const [registration, setRegistration] = useState(initial?.registration ?? '')
  const [type, setType] = useState<VehicleType>(initial?.type ?? 'Sedan')
  const valid = make.trim().length > 0 && model.trim().length > 0 && plate.trim().length > 0

  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title={initial ? 'Edit Vehicle' : 'Add a Vehicle'} subtitle="Vehicle details" onBack={onBack} />
      <div className="tg-form-card">
        <label className="tg-field">
          <span className="tg-label">Nickname</span>
          <input className="tg-input" value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="My car" />
        </label>
        <div className="tg-form-grid">
          <label className="tg-field">
            <span className="tg-label">Make</span>
            <input className="tg-input" value={make} onChange={(event) => setMake(event.target.value)} placeholder="Toyota" />
          </label>
          <label className="tg-field">
            <span className="tg-label">Model</span>
            <input className="tg-input" value={model} onChange={(event) => setModel(event.target.value)} placeholder="Corolla" />
          </label>
        </div>
        <div className="tg-form-grid">
          <label className="tg-field">
            <span className="tg-label">Model year</span>
            <input className="tg-input" value={year} onChange={(event) => setYear(event.target.value)} placeholder="2021" />
          </label>
          <label className="tg-field">
            <span className="tg-label">Plate number</span>
            <input className="tg-input" value={plate} onChange={(event) => setPlate(event.target.value)} placeholder="MDC 4821" />
          </label>
        </div>
        <div className="tg-form-grid">
          <label className="tg-field">
            <span className="tg-label">Color</span>
            <input className="tg-input" value={color} onChange={(event) => setColor(event.target.value)} placeholder="Silver" />
          </label>
          <label className="tg-field">
            <span className="tg-label">Vehicle type</span>
            <select
              className="tg-input"
              value={type}
              onChange={(event) => setType(event.target.value as VehicleType)}
            >
              <option value="Sedan">Sedan</option>
              <option value="Van">Van</option>
              <option value="SUV">SUV</option>
            </select>
          </label>
        </div>
        <label className="tg-field">
          <span className="tg-label">Registration information</span>
          <input
            className="tg-input"
            value={registration}
            onChange={(event) => setRegistration(event.target.value)}
            placeholder="Registered · Valid until Mar 2027"
          />
        </label>
      </div>
      <button
        type="button"
        className="tg-btn tg-btn-primary tg-btn-block"
        disabled={!valid}
        onClick={() =>
          onSave({
            id: initial?.id ?? `vehicle-${Date.now()}`,
            nickname: nickname.trim(),
            make: make.trim(),
            model: model.trim(),
            year: year.trim() || '2021',
            plate: plate.trim(),
            color: color.trim() || 'Silver',
            type,
            registration: registration.trim() || 'Not registered',
            isDefault: initial?.isDefault,
          })
        }
      >
        Save Vehicle
      </button>
    </div>
  )
}

export function RequestsScreen({
  requests,
  activeTrip,
  providers,
  onReceipt,
  onTrack,
  onNewRequest,
}: {
  requests: Trip[]
  activeTrip?: Trip
  providers: Provider[]
  onReceipt: (trip: Trip) => void
  onTrack: () => void
  onNewRequest: () => void
}) {
  const providerName = (trip: Trip) =>
    providers.find((provider) => provider.id === trip.providerId)?.name ?? 'TowGo Partner'
  return (
    <div className="tg-screen tg-trips-screen">
      <div className="tg-profile-head">
        <div>
          <span className="tg-section-kicker">Your activity</span>
          <h1>Requests</h1>
        </div>
        <span className="tg-trip-count">{requests.length + (activeTrip ? 1 : 0)}</span>
      </div>
      {activeTrip ? (
        <button type="button" className="tg-active-trip" onClick={onTrack}>
          <span className="tg-active-icon">
            <Icon name="navigation" size={20} />
          </span>
          <span>
            <em>Active request</em>
            <strong>Tow Truck is on the way</strong>
            <small>
              {providerName(activeTrip)} · arriving in 8 min
            </small>
          </span>
          <Icon name="chevron-right" size={18} />
        </button>
      ) : (
        <button type="button" className="tg-empty-trip" onClick={onNewRequest}>
          <Icon name="route" size={22} />
          <span>No active request. Need a tow?</span>
          <Icon name="plus" size={16} />
        </button>
      )}
      <h3 className="tg-list-title">Past Requests</h3>
      <div className="tg-trip-list">
        {requests.map((trip) => (
          <div key={trip.id} className="tg-trip-card">
            <span className={`tg-trip-icon status-${trip.status}`}>
              <Icon
                name={trip.service === 'battery' ? 'bolt' : trip.service === 'tire' ? 'tool' : 'truck'}
                size={19}
              />
            </span>
            <div className="tg-trip-copy">
              <strong>{serviceName(trip.service)}</strong>
              <span>
                {providerName(trip)} · {trip.date} · {trip.ref}
              </span>
            </div>
            <div className="tg-trip-side">
              <strong>{formatPeso(trip.price)}</strong>
              <button type="button" className="tg-text-btn" onClick={() => onReceipt(trip)}>
                Receipt
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="tg-btn tg-btn-primary tg-btn-block" onClick={onNewRequest}>
        <Icon name="plus" size={17} />
        New Request
      </button>
    </div>
  )
}

export function PaymentsScreen({
  methods,
  selectedId,
  onSelect,
  onAdd,
  onSave,
  onBack,
}: {
  methods: PaymentMethod[]
  selectedId: string
  onSelect: (id: string) => void
  onAdd: () => void
  onSave: () => void
  onBack: () => void
}) {
  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="Payment Methods" subtitle="Choose how you pay" onBack={onBack} />
      <div className="tg-pay-list">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            className={`tg-pay-option${method.id === selectedId ? ' selected' : ''}`}
            onClick={() => onSelect(method.id)}
          >
            <span className={`tg-pay-brand tone-${method.tone}`}>{method.brand}</span>
            <span className="tg-pay-copy">
              <strong>{method.name}</strong>
              <small>{method.detail}</small>
            </span>
            <span className={`tg-radio${method.id === selectedId ? ' selected' : ''}`}>
              {method.id === selectedId ? <Icon name="check" size={12} /> : null}
            </span>
          </button>
        ))}
      </div>
      <button type="button" className="tg-btn tg-btn-soft tg-btn-block" onClick={onAdd}>
        <Icon name="plus" size={17} />
        Add Payment Method
      </button>
      <div className="tg-note-card">
        <Icon name="shield-lock" size={20} />
        <p>Your payment details are encrypted and never shared with towing providers.</p>
      </div>
      <button type="button" className="tg-btn tg-btn-primary tg-btn-block" onClick={onSave}>
        Save Payment Preferences
      </button>
    </div>
  )
}

export function NotificationsScreen({
  notifications,
  onMarkAll,
  onOpen,
  onBack,
}: {
  notifications: AppNotification[]
  onMarkAll: () => void
  onOpen: (id: string) => void
  onBack: () => void
}) {
  const groups: { key: AppNotification['group']; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'earlier', label: 'Earlier' },
  ]
  return (
    <div className="tg-screen tg-subpage">
      <PageHeader
        title="Notifications"
        onBack={onBack}
        action={
          <button type="button" className="tg-text-btn" onClick={onMarkAll}>
            Mark all as read
          </button>
        }
      />
      {groups.map((group) => {
        const items = notifications.filter((notification) => notification.group === group.key)
        if (items.length === 0) return null
        return (
          <div key={group.key} className="tg-notif-group">
            <span className="tg-list-label">{group.label}</span>
            <div className="tg-notif-list">
              {items.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className={`tg-notif-item${notification.read ? '' : ' unread'}`}
                  onClick={() => onOpen(notification.id)}
                >
                  <span className={`tg-notif-icon tone-${notification.tone}`}>
                    <Icon name={notification.icon} size={18} />
                  </span>
                  <span className="tg-notif-copy">
                    <strong>{notification.title}</strong>
                    <span>{notification.body}</span>
                    <small>{notification.time}</small>
                  </span>
                  {notification.read ? null : <span className="tg-notif-dot" />}
                </button>
              ))}
            </div>
          </div>
        )
      })}
      {notifications.length === 0 ? (
        <div className="tg-empty">
          <Icon name="bell-off" size={36} />
          <p>You are all caught up.</p>
        </div>
      ) : null}
    </div>
  )
}

export type SettingToggles = {
  serviceUpdates: boolean
  messageAlerts: boolean
  offers: boolean
}

export function SettingsScreen({
  toggles,
  onToggle,
  locationMode,
  language,
  onGo,
  onBack,
}: {
  toggles: SettingToggles
  onToggle: (key: keyof SettingToggles) => void
  locationMode: string
  language: string
  onGo: (screen: AppScreen) => void
  onBack: () => void
}) {
  const toggleRows: { key: keyof SettingToggles; label: string; hint: string; icon: string }[] = [
    { key: 'serviceUpdates', label: 'Service Updates', hint: 'Driver and towing status', icon: 'truck' },
    { key: 'messageAlerts', label: 'Message Alerts', hint: 'New messages from drivers', icon: 'message-circle' },
    { key: 'offers', label: 'Offers & Promotions', hint: 'Deals and partner promos', icon: 'discount' },
  ]
  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="Settings" subtitle="Manage your account and app" onBack={onBack} />

      <span className="tg-settings-title">Account</span>
      <section className="tg-menu-card">
        <button type="button" className="tg-menu-row bordered" onClick={() => onGo('personal')}>
          <span className="tg-menu-icon"><Icon name="user-circle" size={18} /></span>
          <span className="tg-menu-label">Personal Information</span>
          <Icon name="chevron-right" size={17} />
        </button>
        <button type="button" className="tg-menu-row bordered" onClick={() => onGo('password')}>
          <span className="tg-menu-icon"><Icon name="lock" size={18} /></span>
          <span className="tg-menu-label">Change Password</span>
          <Icon name="chevron-right" size={17} />
        </button>
        <button type="button" className="tg-menu-row" onClick={() => onGo('notifications')}>
          <span className="tg-menu-icon"><Icon name="bell" size={18} /></span>
          <span className="tg-menu-label">Notifications</span>
          <Icon name="chevron-right" size={17} />
        </button>
      </section>

      <span className="tg-settings-title">Notifications</span>
      <section className="tg-menu-card">
        {toggleRows.map((row, index) => (
          <button
            key={row.key}
            type="button"
            className={`tg-toggle-row${index < toggleRows.length - 1 ? ' bordered' : ''}`}
            onClick={() => onToggle(row.key)}
          >
            <span className="tg-menu-icon"><Icon name={row.icon} size={18} /></span>
            <span className="tg-toggle-copy">
              <strong>{row.label}</strong>
              <small>{row.hint}</small>
            </span>
            <span className={`tg-switch${toggles[row.key] ? ' on' : ''}`}><span /></span>
          </button>
        ))}
      </section>

      <span className="tg-settings-title">Privacy & App</span>
      <section className="tg-menu-card">
        <button type="button" className="tg-menu-row bordered" onClick={() => onGo('locationAccess')}>
          <span className="tg-menu-icon"><Icon name="map-pin" size={18} /></span>
          <span className="tg-menu-label">Location Access</span>
          <span className="tg-menu-value">{locationMode}</span>
          <Icon name="chevron-right" size={17} />
        </button>
        <button type="button" className="tg-menu-row bordered" onClick={() => onGo('privacy')}>
          <span className="tg-menu-icon"><Icon name="shield-lock" size={18} /></span>
          <span className="tg-menu-label">Privacy Policy</span>
          <Icon name="chevron-right" size={17} />
        </button>
        <button type="button" className="tg-menu-row bordered" onClick={() => onGo('language')}>
          <span className="tg-menu-icon"><Icon name="language" size={18} /></span>
          <span className="tg-menu-label">Language</span>
          <span className="tg-menu-value">{language}</span>
          <Icon name="chevron-right" size={17} />
        </button>
        <button type="button" className="tg-menu-row" onClick={() => onGo('about')}>
          <span className="tg-menu-icon"><Icon name="info-circle" size={18} /></span>
          <span className="tg-menu-label">About</span>
          <span className="tg-menu-value">v1.0.0</span>
          <Icon name="chevron-right" size={17} />
        </button>
      </section>
      <p className="tg-settings-foot">TowGo · Roadside Assistance – Fast. Safe. Nearby.</p>
    </div>
  )
}

export function LocationAccessScreen({
  mode,
  onChange,
  onSave,
  onBack,
}: {
  mode: string
  onChange: (mode: string) => void
  onSave: () => void
  onBack: () => void
}) {
  const options = [
    { id: 'while', label: 'While using the app', hint: 'Allow TowGo to use your location when the app is open.' },
    { id: 'ask', label: 'Ask next time', hint: 'We will ask again the next time you request a tow.' },
    { id: 'never', label: 'Never', hint: 'You will need to type your location manually.' },
  ]
  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="Location Access" subtitle="Manage location permission" onBack={onBack} />
      <div className="tg-location-card">
        <span className="tg-location-icon">
          <Icon name="current-location" size={24} />
        </span>
        <p>TowGo uses your location to find nearby tow trucks and share your pickup point with the driver.</p>
      </div>
      <div className="tg-radio-list">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`tg-radio-row${mode === option.label ? ' selected' : ''}`}
            onClick={() => onChange(option.label)}
          >
            <span className={`tg-radio${mode === option.label ? ' selected' : ''}`}>
              {mode === option.label ? <span /> : null}
            </span>
            <span className="tg-radio-copy">
              <strong>{option.label}</strong>
              <small>{option.hint}</small>
            </span>
          </button>
        ))}
      </div>
      <button type="button" className="tg-btn tg-btn-primary tg-btn-block" onClick={onSave}>
        Save Preferences
      </button>
    </div>
  )
}

export function FaqScreen({ onBack, onOpen }: { onBack: () => void; onOpen: (id: string) => void }) {
  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="Frequently Asked Questions" subtitle="Quick answers about towing" onBack={onBack} />
      <div className="tg-faq-list">
        {FAQS.map((faq, index) => (
          <button key={faq.id} type="button" className="tg-faq-card" onClick={() => onOpen(faq.id)}>
            <span className="tg-faq-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="tg-faq-copy">
              <strong>{faq.question}</strong>
              <span>{faq.summary}</span>
            </span>
            <Icon name="chevron-right" size={17} />
          </button>
        ))}
      </div>
    </div>
  )
}

export function FaqDetailScreen({
  faq,
  onBack,
  onOpen,
}: {
  faq: FaqItem
  onBack: () => void
  onOpen: (id: string) => void
}) {
  const related = FAQS.filter((item) => item.id !== faq.id).slice(0, 2)
  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="FAQ" subtitle={faq.summary} onBack={onBack} />
      <article className="tg-faq-detail">
        <h1>{faq.question}</h1>
        {faq.answer.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {faq.tips && faq.tips.length > 0 ? (
          <div className="tg-faq-tips">
            <span className="tg-label">Helpful tips</span>
            <ul>
              {faq.tips.map((tip) => (
                <li key={tip}>
                  <Icon name="circle-check" size={15} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>
      <span className="tg-list-label">Related questions</span>
      <div className="tg-faq-list">
        {related.map((item) => (
          <button key={item.id} type="button" className="tg-faq-card" onClick={() => onOpen(item.id)}>
            <span className="tg-faq-copy">
              <strong>{item.question}</strong>
              <span>{item.summary}</span>
            </span>
            <Icon name="chevron-right" size={17} />
          </button>
        ))}
      </div>
    </div>
  )
}

export function LanguageScreen({
  language,
  onChange,
  onBack,
}: {
  language: string
  onChange: (language: string) => void
  onBack: () => void
}) {
  const languages = ['English', 'Filipino', 'Spanish']
  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="Language" subtitle="Choose your preferred language" onBack={onBack} />
      <div className="tg-language-list">
        {languages.map((item) => (
          <button
            key={item}
            type="button"
            className={`tg-language-option${language === item ? ' active' : ''}`}
            onClick={() => onChange(item)}
          >
            <span className="tg-language-badge">{item.slice(0, 2).toUpperCase()}</span>
            <span className="tg-language-name">{item}</span>
            {language === item ? (
              <span className="tg-language-check">
                <Icon name="check" size={14} />
              </span>
            ) : null}
          </button>
        ))}
      </div>
      <div className="tg-note-card">
        <Icon name="info-circle" size={20} />
        <p>Some driver messages may appear in the language chosen by your provider.</p>
      </div>
    </div>
  )
}

export function PrivacyScreen({ onBack }: { onBack: () => void }) {
  const sections = [
    {
      title: 'Information we collect',
      body: 'We collect the details you provide when creating an account, your vehicle information, request history, and the location you share when requesting roadside assistance.',
    },
    {
      title: 'How we use your information',
      body: 'Your information is used to match you with nearby towing providers, share your pickup location with your assigned driver, process payments, and improve the service.',
    },
    {
      title: 'Sharing with providers',
      body: 'We share only the details needed to complete your request, such as your name, vehicle, pickup location, and contact number, with the provider you select.',
    },
    {
      title: 'Location data',
      body: 'Location access is optional. You can change your permission any time from Settings → Location Access. We do not track your location outside an active request.',
    },
    {
      title: 'Data security',
      body: 'Payment details are tokenised and encrypted. We never store full card numbers on our servers.',
    },
    {
      title: 'Your choices',
      body: 'You can edit your profile, remove vehicles, manage notifications, or request account deletion by contacting help@towgo.ph.',
    },
  ]
  return (
    <div className="tg-screen tg-subpage tg-privacy-screen">
      <PageHeader title="Privacy Policy" subtitle="Last updated November 2026" onBack={onBack} />
      <section className="tg-privacy-intro">
        <span>
          <Icon name="shield-lock" size={22} />
        </span>
        <p>Your privacy matters. This summary explains what we collect and how we protect it.</p>
      </section>
      <div className="tg-privacy-sections">
        {sections.map((section, index) => (
          <section key={section.title} className="tg-privacy-card">
            <span className="tg-privacy-index">{String(index + 1).padStart(2, '0')}</span>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
      <button type="button" className="tg-btn tg-btn-primary tg-btn-block" onClick={onBack}>
        I Understand
      </button>
    </div>
  )
}

export function AboutScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="tg-screen tg-subpage">
      <PageHeader title="About TowGo" onBack={onBack} />
      <div className="tg-about-hero">
        <Logo />
        <p>Roadside Assistance – Fast. Safe. Nearby.</p>
        <TruckMark width={72} height={72} color="#ff8900" wheel="#0b2f50" />
      </div>
      <section className="tg-menu-card">
        {ABOUT_FACTS.map((fact, index) => (
          <div key={fact.label} className={`tg-menu-row${index < ABOUT_FACTS.length - 1 ? ' bordered' : ''}`}>
            <span className="tg-menu-label">{fact.label}</span>
            <span className="tg-menu-value">{fact.value}</span>
          </div>
        ))}
      </section>
      <div className="tg-note-card">
        <Icon name="heart" size={20} />
        <p>Built to get you moving again with verified tow operators across the Philippines.</p>
      </div>
      <p className="tg-settings-foot">© 2026 TowGo. All rights reserved.</p>
    </div>
  )
}
