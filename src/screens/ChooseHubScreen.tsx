import { StatusBar } from '../components/StatusBar'
import { Icon } from '../components/Icon'

const HUBS = [
  { name: 'Living Room Mirror', role: 'OWNER' },
  { name: 'BedRoom Hub', role: 'MEMBER' },
  { name: "Parent's Home Hub", role: 'MEMBER' },
]

export function ChooseHubScreen() {
  return (
    <div style={{
      width: '390px',
      height: '780px',
      background: 'var(--background-modal)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <StatusBar />
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        height: '50px',
        paddingLeft: '12px',
        paddingRight: '16px',
        paddingTop: '8px',
        paddingBottom: '8px',
        boxSizing: 'border-box',
        flexShrink: 0,
        width: '100%',
      }}>
        <button style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '24px', height: '24px', background: 'none', border: 'none',
          cursor: 'pointer', padding: 0, flexShrink: 0,
        }}>
          <Icon name="ArrowLeft" size={24} color="var(--text-primary)" />
        </button>
        <div style={{ flex: 1, opacity: 0 }} />
      </div>
      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        paddingTop: '8px',
        paddingBottom: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            Choose your Home Hub
          </h2>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Select a device to continue.
          </p>
        </div>
        {/* Hub list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.3 }}>Hub List</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {HUBS.map((hub) => (
              <div
                key={hub.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: 'var(--background-card)',
                  borderRadius: '16px',
                  boxShadow: '0px 0px 2px rgba(0,0,0,0.1)',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                {/* Left: icon + text */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--button-primary-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon name="Home" size={24} color="var(--button-secondary-default)" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
                      {hub.name}
                    </span>
                    <span style={{
                      display: 'inline-block',
                      alignSelf: 'flex-start',
                      backgroundColor: 'var(--border-default)',
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      paddingTop: '2px',
                      paddingBottom: '2px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      whiteSpace: 'nowrap',
                    }}>{hub.role}</span>
                  </div>
                </div>
                {/* Right: chevron */}
                <Icon name="ChevronRight" size={20} color="var(--text-pressed)" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Toast */}
      <div style={{
        position: 'absolute',
        top: '47px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(10,10,10,0.9)',
        borderRadius: '9999px',
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingTop: '8px',
        paddingBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        whiteSpace: 'nowrap',
      }}>
        <Icon name="Check" size={20} color="var(--button-secondary-default)" />
        <span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--button-secondary-default)', lineHeight: 1.4 }}>You're all set!</span>
      </div>
    </div>
  )
}
