import { StatusBar } from '../components/StatusBar'
import { Icon } from '../components/Icon'

const MEMBERS = [
  { initial: 'C', name: 'Charles (Me)', active: true },
  { initial: 'S', name: 'Sara', active: false },
  { initial: 'M', name: 'Mike', active: false },
  { initial: 'P', name: 'Peter', active: false },
]

const SLEEP_BARS = [
  { height: 26, color: '#a3a3a3' },
  { height: 40, color: '#a3a3a3' },
  { height: 33, color: '#a3a3a3' },
  { height: 48, color: '#171717' },
  { height: 37, color: '#e5e5e5' },
  { height: 26, color: '#e5e5e5' },
  { height: 35, color: '#e5e5e5' },
]

function DonutChart({ score }: { score: number }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const filled = (score / 100) * circ
  const gap = circ - filled
  // Start from top (offset by 3/4 of circumference)
  const offset = circ * 0.25
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Track */}
      <circle cx="24" cy="24" r={r} fill="none" stroke="#e5e5e5" strokeWidth="5" />
      {/* Fill */}
      <circle
        cx="24" cy="24" r={r} fill="none"
        stroke="#262626" strokeWidth="5"
        strokeDasharray={`${filled} ${gap}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
      <text x="24" y="26.5" textAnchor="middle" fontSize="6" fill="#262626" fontWeight="500" fontFamily="sans-serif">
        Good
      </text>
    </svg>
  )
}

export function HomeHubToastScreen() {
  return (
    <div style={{
      width: '390px',
      height: '780px',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <StatusBar />

      {/* Section 1: top content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        paddingTop: '16px',
        paddingBottom: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box',
        minHeight: 0,
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', width: '100%' }}>
          {/* Invisible spacer (mirrors right icons width) */}
          <div style={{ display: 'flex', alignItems: 'center', opacity: 0, pointerEvents: 'none', flexShrink: 0 }}>
            <div style={{ padding: '6px' }}><div style={{ width: '20px', height: '20px' }} /></div>
            <div style={{ padding: '6px' }}><div style={{ width: '20px', height: '20px' }} /></div>
          </div>
          {/* Hub title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <span style={{ fontSize: '20px', fontWeight: 600, color: '#262626', lineHeight: 1.4, whiteSpace: 'nowrap' }}>
              Parent's Home Hub
            </span>
            <Icon name="ChevronDown" size={16} color="#262626" />
          </div>
          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ padding: '6px' }}>
              <Icon name="BellDot" size={20} color="var(--text-primary)" />
            </div>
            <div style={{ padding: '6px' }}>
              <Icon name="Settings" size={20} color="var(--text-primary)" />
            </div>
          </div>
        </div>

        {/* Tab section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
          {/* FAMILY STATUS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '14px', fontWeight: 400, color: '#262626', lineHeight: 1.4 }}>FAMILY STATUS</span>
              <Icon name="ChevronRight" size={14} color="#a3a3a3" />
            </div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '32px', paddingLeft: '24px', paddingRight: '24px',
                paddingTop: '6px', paddingBottom: '8px',
                borderBottom: '2px solid #262626', flexShrink: 0,
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#262626', lineHeight: 1.3, whiteSpace: 'nowrap' }}>All</span>
              </div>
              {['My Family', 'Guests'].map((tab) => (
                <div key={tab} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: '32px', paddingLeft: '24px', paddingRight: '24px',
                  paddingTop: '6px', paddingBottom: '6px', flexShrink: 0,
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#737373', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{tab}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Members */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexShrink: 0 }}>
            {MEMBERS.map(({ initial, name, active }) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', width: '83px', flexShrink: 0 }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '9999px',
                  backgroundColor: active ? '#171717' : '#f5f5f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 600, color: active ? '#ffffff' : '#737373', lineHeight: 1.4, textAlign: 'center' }}>
                    {initial}
                  </span>
                </div>
                <span style={{
                  fontSize: '14px', fontWeight: active ? 600 : 400,
                  color: active ? '#262626' : '#737373',
                  lineHeight: active ? 1.3 : 1.4,
                  textAlign: 'center', width: '84px',
                  overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: bottom white card */}
      <div style={{
        height: '457px',
        backgroundColor: '#ffffff',
        borderRadius: '32px',
        boxShadow: '0px -10px 10px rgba(0,0,0,0.08)',
        padding: '20px',
        boxSizing: 'border-box',
        flexShrink: 0,
        width: '390px',
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', width: '100%' }}>
          {/* Sleep card */}
          <div style={{
            flex: 1, height: '166px', backgroundColor: '#f5f5f5', borderRadius: '20px',
            boxShadow: '0px 0px 4px rgba(0,0,0,0.12)', padding: '20px', boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            overflow: 'hidden', minWidth: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="Moon" size={20} color="#262626" />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#262626', lineHeight: 1.3 }}>Sleep</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '24px', fontWeight: 600, color: '#262626', lineHeight: 1.35 }}>12.30</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#737373', lineHeight: 1.4 }}>hrs</span>
              </div>
              {/* Bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '44px', height: '48px', flexShrink: 0 }}>
                {SLEEP_BARS.map((bar, i) => (
                  <div key={i} style={{ width: '4px', height: `${bar.height}px`, backgroundColor: bar.color, borderRadius: '8px', flexShrink: 0 }} />
                ))}
              </div>
            </div>
          </div>

          {/* Health card */}
          <div style={{
            flex: 1, height: '166px', backgroundColor: '#f5f5f5', borderRadius: '20px',
            boxShadow: '0px 0px 4px rgba(0,0,0,0.12)', padding: '20px', boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            overflow: 'hidden', minWidth: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="HeartPulse" size={20} color="#262626" />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#262626', lineHeight: 1.3 }}>Health</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '24px', fontWeight: 600, color: '#262626', lineHeight: 1.35 }}>75</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#737373', lineHeight: 1.4 }}>/100</span>
              </div>
              <DonutChart score={75} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: '390px',
        paddingBottom: '20px', paddingTop: '8px', paddingLeft: '20px', paddingRight: '20px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          boxShadow: '0px 0px 2px rgba(0,0,0,0.1)',
          borderRadius: '9999px',
          height: '72px',
          paddingLeft: '32px',
          paddingRight: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '380px',
        }}>
          {/* Home (active) */}
          <div style={{
            width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#171717',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="Home" size={24} color="#ffffff" />
          </div>
          {/* Health */}
          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="Activity" size={24} color="#a3a3a3" />
          </div>
          {/* Sleep */}
          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="Moon" size={24} color="#a3a3a3" />
          </div>
          {/* IoT */}
          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="Podcast" size={24} color="#a3a3a3" />
          </div>
          {/* Contents */}
          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="CirclePlay" size={24} color="#a3a3a3" />
          </div>
        </div>
      </div>

      {/* Toast */}
      <div style={{
        position: 'absolute', top: '47px', left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(10,10,10,0.9)',
        borderRadius: '9999px',
        paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px',
        display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
      }}>
        <Icon name="Laugh" size={20} color="#ffffff" />
        <span style={{ fontSize: '16px', fontWeight: 400, color: '#ffffff', lineHeight: 1.4 }}>Welcome Back !</span>
      </div>
    </div>
  )
}
