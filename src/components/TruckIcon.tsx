type TruckMarkProps = {
  width?: number
  height?: number
  viewBox?: string
  color?: string
  wheel?: string
}

export function TruckMark({
  width = 18,
  height = 18,
  viewBox = '0 0 32 32',
  color = '#ff8900',
  wheel = '#0b2f50',
}: TruckMarkProps) {
  return (
    <svg width={width} height={height} viewBox={viewBox} fill="none" aria-hidden="true">
      <rect x="2" y="19" width="21" height="4" rx="1.6" fill={color} />
      <path
        d="M22 19v-5.4c0-1.5 1-2.6 2.5-2.6h2.6c1.4 0 2.6 1 3 2.3L31 19h-9Z"
        fill={color}
      />
      <rect x="24.2" y="13.4" width="3.8" height="2.6" rx="0.6" fill="#ffffff" opacity="0.9" />
      <path d="M5 19l1.6-4.3h6.2L15.4 19H5Z" fill={wheel} opacity="0.92" />
      <path d="M8 14.7h4.4l.7 1.5H7.3l.7-1.5Z" fill="#ffffff" opacity="0.85" />
      <circle cx="8.2" cy="24" r="3" fill={wheel} stroke={color} strokeWidth="1.4" />
      <circle cx="8.2" cy="24" r="1.1" fill={color} />
      <circle cx="25" cy="24" r="3" fill={wheel} stroke={color} strokeWidth="1.4" />
      <circle cx="25" cy="24" r="1.1" fill={color} />
    </svg>
  )
}

export function FlatbedMark({
  width = 24,
  height = 18,
  viewBox = '0 0 32 24',
  color = '#ff8900',
  wheel = '#0b2f50',
}: TruckMarkProps) {
  return (
    <svg width={width} height={height} viewBox={viewBox} fill="none" aria-hidden="true">
      <rect x="1" y="13" width="18" height="4" rx="1.5" fill={color} />
      <path
        d="M19 13V8.6c0-1.2.9-2.2 2.2-2.2h3.4c1.2 0 2.3.8 2.7 2L29 13h-10Z"
        fill={color}
      />
      <rect x="21.4" y="8.4" width="3.9" height="2.4" rx="0.6" fill="#ffffff" opacity="0.9" />
      <path d="M4 13l1.4-3.7h5.4L12.6 13H4Z" fill={wheel} opacity="0.92" />
      <path d="M6.6 9.7h4l.6 1.3H6l.6-1.3Z" fill="#ffffff" opacity="0.85" />
      <circle cx="7" cy="18.4" r="3" fill={wheel} stroke={color} strokeWidth="1.4" />
      <circle cx="7" cy="18.4" r="1.1" fill={color} />
      <circle cx="23.2" cy="18.4" r="3" fill={wheel} stroke={color} strokeWidth="1.4" />
      <circle cx="23.2" cy="18.4" r="1.1" fill={color} />
    </svg>
  )
}

export function TowTruckIllustration({
  width = 220,
  height = 120,
}: {
  width?: number
  height?: number
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 240 130" fill="none" aria-hidden="true">
      <ellipse cx="120" cy="112" rx="104" ry="10" fill="#0b2f50" opacity="0.08" />
      <path d="M4 104h232" stroke="#dbe5ee" strokeWidth="2" strokeDasharray="10 8" />
      <rect x="30" y="78" width="128" height="16" rx="5" fill="#0b2f50" />
      <path
        d="M150 78V52c0-8 5.5-13 13-13h18c8 0 14 5 16.5 13L204 78h-54Z"
        fill="#0b2f50"
      />
      <rect x="166" y="51" width="22" height="14" rx="3" fill="#cfe9f6" />
      <path d="M46 78l9-24h38l13 24H46Z" fill="#ff8900" />
      <path d="M64 58h22l4 8H59l5-8Z" fill="#ffffff" opacity="0.9" />
      <rect x="176" y="70" width="12" height="5" rx="2" fill="#ff8900" />
      <circle cx="66" cy="98" r="15" fill="#102a43" />
      <circle cx="66" cy="98" r="6" fill="#eaf0f6" />
      <circle cx="170" cy="98" r="15" fill="#102a43" />
      <circle cx="170" cy="98" r="6" fill="#eaf0f6" />
      <circle cx="214" cy="98" r="15" fill="#102a43" />
      <circle cx="214" cy="98" r="6" fill="#eaf0f6" />
      <circle cx="205" cy="34" r="12" fill="#159879" />
      <path d="M199 34l4 4 8-8" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
