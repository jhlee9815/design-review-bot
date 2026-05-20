import { Signal, Wifi, BatteryFull } from 'lucide-react'

export function StatusBar() {
  return (
    <div style={{
      display: 'flex',
      height: '44px',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 20px',
      boxSizing: 'border-box',
      flexShrink: 0,
      width: '100%',
    }}>
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        fontSize: '15px',
        color: '#262626',
        lineHeight: '22.5px',
        whiteSpace: 'nowrap',
      }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Signal size={16} color="#262626" strokeWidth={2} />
        <Wifi size={16} color="#262626" strokeWidth={2} />
        <BatteryFull size={18} color="#262626" strokeWidth={2} />
      </div>
    </div>
  )
}
