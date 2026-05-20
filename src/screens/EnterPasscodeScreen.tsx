import { StatusBar } from '../components/StatusBar'
import { Icon } from '../components/Icon'

type Variant = 'empty' | 'filled' | 'error'

interface EnterPasscodeScreenProps {
  variant?: Variant
}

const VARIANT_CELLS: Record<Variant, string[]> = {
  empty: ['', '', '', '', '', ''],
  filled: ['4', '8', '2', '2', '2', '2'],
  error: ['4', '8', '2', '8', '8', '8'],
}

export function EnterPasscodeScreen({ variant = 'empty' }: EnterPasscodeScreenProps) {
  const cells = VARIANT_CELLS[variant]
  const isError = variant === 'error'

  return (
    <div style={{
      width: '390px',
      height: '780px',
      background: 'var(--background-modal)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8px',
        paddingBottom: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        {/* Top: title + input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
          {/* Title + subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              Enter Passcode
            </h2>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Enter your passcode to continue
            </p>
          </div>
          {/* Passcode input */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '8px',
              paddingBottom: '8px',
              width: '100%',
            }}>
              {/* Label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '8px',
                paddingBottom: '8px',
                width: '100%',
              }}>
                <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>Passcode</span>
              </div>
              {/* Cells + error msg */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', paddingTop: '8px', paddingBottom: '8px', width: '100%' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
                  {cells.map((digit, i) => (
                    <div
                      key={i}
                      style={{
                        flex: '1 0 0',
                        height: '56px',
                        borderRadius: '12px',
                        border: isError ? '1.4px solid var(--system-error-primary)' : `1px solid var(--border-default)`,
                        backgroundColor: isError ? 'var(--system-error-subtle)' : 'transparent',
                        boxShadow: isError ? 'var(--shadow-error)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                        minWidth: 0,
                      }}
                    >
                      {digit && (
                        <span style={{
                          fontSize: '20px',
                          fontWeight: 600,
                          color: isError ? 'var(--system-error-primary)' : 'var(--text-primary)',
                          lineHeight: 1.4,
                          textAlign: 'center',
                        }}>{digit}</span>
                      )}
                    </div>
                  ))}
                </div>
                {isError ? (
                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: '8px', paddingBottom: '8px', width: '100%' }}>
                    <span style={{ flex: 1, fontSize: '12px', fontWeight: 500, color: '#b91c1c', lineHeight: 1.4, minWidth: 0 }}>
                      Passcodes do not match
                    </span>
                  </div>
                ) : (
                  <div style={{ height: '33px' }} />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom: Forgot Passcode */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ paddingTop: '16px', paddingBottom: '16px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#737373',
              textDecoration: 'underline',
              textDecorationSkipInk: 'none',
              lineHeight: 1.3,
              cursor: 'pointer',
            }}>Forgot Passcode?</span>
          </div>
        </div>
      </div>
    </div>
  );
}
