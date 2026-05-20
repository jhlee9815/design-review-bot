import { type ReactNode } from 'react'
import { Switch } from './Switch'

interface DeviceCardProps {
  icon: ReactNode
  name: string
  room: string
  state: string
  isOn: boolean
  onToggle: () => void
}

export function DeviceCard({ icon, name, room, state, isOn, onToggle }: DeviceCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '20px',
        borderRadius: '16px',
        background: isOn ? '#0a0a0a' : 'white',
        border: isOn ? 'none' : '1px solid #e5e5e5',
        boxShadow: isOn
          ? '0 0 16px 0 rgba(0,0,0,0.10)'
          : '0 0 4px 0 rgba(0,0,0,0.05)',
      }}
    >
      {/* Head: icon + switch */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: isOn ? 'rgba(255,255,255,0.12)' : '#f5f5f5',
            color: isOn ? 'white' : '#525252',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <Switch checked={isOn} onChange={onToggle} />
      </div>

      {/* Body: name, room, state */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span
          style={{
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            color: isOn ? 'white' : 'var(--text-primary)',
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'var(--font-sans)',
            color: isOn ? '#d4d4d4' : '#737373',
          }}
        >
          {room}
        </span>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 400,
            fontFamily: 'var(--font-sans)',
            color: isOn ? '#fafafa' : '#737373',
          }}
        >
          {state}
        </span>
      </div>
    </div>
  )
}
