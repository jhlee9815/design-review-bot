import { StatusBar } from '../components/StatusBar'

function UnoHomeLogo() {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline', gap: 0 }}>
      <span style={{
        fontSize: '36px',
        fontWeight: 800,
        color: 'var(--text-primary)',
        letterSpacing: '-0.03em',
        fontFamily: '"Noto Sans KR", sans-serif',
        lineHeight: 1,
      }}>UN</span>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <span style={{
          fontSize: '36px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          fontFamily: '"Noto Sans KR", sans-serif',
          lineHeight: 1,
        }}>O</span>
        {/* Decorative dot above the O */}
        <span style={{
          position: 'absolute',
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: 'var(--text-primary)',
          display: 'block',
        }} />
      </span>
      <span style={{
        fontSize: '36px',
        fontWeight: 800,
        color: 'var(--text-primary)',
        letterSpacing: '-0.03em',
        fontFamily: '"Noto Sans KR", sans-serif',
        lineHeight: 1,
        marginLeft: '12px',
      }}> HOME</span>
    </div>
  )
}

export function SplashScreen() {
  return (
    <div style={{
      width: '390px',
      height: '780px',
      background: 'var(--background-modal)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      <StatusBar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: '160px',
        paddingBottom: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box',
      }}>
        {/* Logo + subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <UnoHomeLogo />
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Connect with your space<br />
            Experience the seamless integration
          </p>
        </div>
        {/* Login button */}
        <div style={{
          backgroundColor: 'var(--button-primary-default)',
          height: '56px',
          borderRadius: '16px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}>
          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--button-secondary-default)', lineHeight: 1.3 }}>Login</span>
        </div>
      </div>
    </div>
  )
}
