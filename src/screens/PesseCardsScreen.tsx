/**
 * PesseCardsScreen — Apple-inspired fintech demo.
 * Apple-inspired only. Not official Apple Design System. Not affiliated with Apple Inc.
 */

const phone: React.CSSProperties = {
  width: 390, height: 844,
  background: 'var(--apple-color-white)',
  borderRadius: 40,
  fontFamily: 'var(--apple-font-text)',
  color: 'var(--apple-color-near-black)',
  display: 'flex', flexDirection: 'column',
  paddingTop: 24, paddingBottom: 24, gap: 16,
  overflow: 'hidden',
}

interface CardProps {
  surface: 'blue' | 'dark' | 'white'
  name: string
  balance: string
  lastFour: string
  isMain?: boolean
}

function PesseCard({ surface, name, balance, lastFour, isMain }: CardProps) {
  const bg = surface === 'blue' ? 'var(--apple-color-blue)'
           : surface === 'dark' ? 'var(--apple-color-near-black)'
           : 'var(--apple-color-white)'
  const text = surface === 'white' ? 'var(--apple-color-near-black)' : 'var(--apple-color-white)'
  const wmColor = surface === 'white' ? 'var(--apple-color-near-black)' : 'var(--apple-color-white)'
  const border = surface === 'white' ? '1px solid var(--apple-color-overlay-light)' : 'none'
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      padding: '16px 18px', borderRadius: 'var(--apple-radius-large)',
      background: bg, color: text, border,
      height: 168, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{ position: 'absolute', left: 90, top: 80, fontSize: 60, fontWeight: 700, color: wmColor, opacity: 0.22, letterSpacing: -2 }}>Pesse</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>{name}</span>
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>VISA</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>{balance}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: surface === 'white' ? 'var(--apple-color-black-48)' : text }}>•••• {lastFour}</span>
        {isMain && (
          <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', padding: '5px 12px', borderRadius: 'var(--apple-radius-pill)', background: 'var(--apple-color-white)', color: 'var(--apple-color-blue)', fontSize: 11, fontWeight: 600 }}>
            <span>✓</span><span>Main card</span>
          </span>
        )}
      </div>
    </div>
  )
}

export function PesseCardsScreen() {
  return (
    <div style={phone}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
        <span style={{ fontSize: 18, fontWeight: 600 }}>Select Card</span>
        <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', padding: '8px 14px', borderRadius: 'var(--apple-radius-pill)', border: '1px solid var(--apple-color-overlay-light)', fontSize: 12, fontWeight: 600 }}>
          <span>+</span><span>New card</span>
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 24px' }}>
        <PesseCard surface="blue" name="Linda Srikandi" balance="$112,411" lastFour="2451" isMain />
        <PesseCard surface="dark" name="Linda Srikandi" balance="$112,411" lastFour="0095" />
        <PesseCard surface="white" name="Linda Srikandi" balance="$12,000" lastFour="1122" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 24px 0' }}>
        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', padding: '10px 18px', borderRadius: 'var(--apple-radius-pill)', background: 'var(--apple-color-near-black)', color: 'var(--apple-color-white)', fontSize: 13, fontWeight: 600 }}>
          <span>✕</span><span>Close</span>
        </span>
      </div>
    </div>
  )
}
