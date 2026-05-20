/**
 * PesseHomeScreen — Apple-inspired fintech demo.
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

const row = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  display: 'flex', flexDirection: 'row', alignItems: 'center', ...extra,
})
const col = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  display: 'flex', flexDirection: 'column', ...extra,
})

export function PesseHomeScreen() {
  return (
    <div style={phone}>
      <div style={{ ...row({ justifyContent: 'space-between', padding: '0 24px' }) }}>
        <span style={{ fontSize: 22, fontWeight: 600 }}>Pesse</span>
        <div style={row({ gap: 8 })}>
          <div style={{ width: 32, height: 32, borderRadius: 16, border: '1px solid var(--apple-color-overlay-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--apple-color-black-48)', fontSize: 14 }}>?</div>
          <div style={row({ gap: 6, background: 'var(--apple-color-near-black)', color: 'var(--apple-color-white)', borderRadius: 'var(--apple-radius-pill)', padding: '8px 14px', fontSize: 13, fontWeight: 600 })}>
            <span>🎁</span><span>Rewards</span>
          </div>
        </div>
      </div>

      <div style={col({ alignItems: 'center', gap: 6, padding: '12px 24px' })}>
        <div style={row({ gap: 6, fontSize: 13, color: 'var(--apple-color-black-80)' })}>
          <span>Linda's card balance</span>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--apple-color-blue)' }} />
          <span>▼</span>
        </div>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>$521,098.31</div>
        <div style={{ background: 'var(--apple-color-light-gray)', color: 'var(--apple-color-black-48)', borderRadius: 'var(--apple-radius-pill)', padding: '6px 14px', fontSize: 11, fontWeight: 500 }}>Money hold $2,500</div>
      </div>

      <div style={row({ gap: 12, padding: '4px 24px' })}>
        {['Send', 'Receive'].map(label => (
          <div key={label} style={row({ flex: 1, justifyContent: 'center', gap: 6, padding: '14px 0', border: '1px solid var(--apple-color-overlay-light)', borderRadius: 'var(--apple-radius-pill)', background: 'var(--apple-color-white)', fontSize: 14, fontWeight: 600 })}>
            <span>{label === 'Send' ? '↗' : '↙'}</span><span>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={row({ gap: 12, padding: 14, background: 'var(--apple-color-near-black)', color: 'var(--apple-color-white)', borderRadius: 'var(--apple-radius-large)' })}>
          <div style={col({ flex: 1, gap: 4 })}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Start sending money tax free</div>
            <div style={{ fontSize: 11 }}>The best place for freelancers to receive and send money. Start saving now!</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--apple-color-white)' }} />
        </div>
      </div>

      <div style={col({ gap: 10, padding: '6px 24px' })}>
        <div style={row({ justifyContent: 'space-between' })}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Send again</span>
          <span style={{ fontSize: 12, color: 'var(--apple-color-black-48)' }}>+ Add</span>
        </div>
        <div style={row({ gap: 14 })}>
          {['S Rijal', 'Ferina C', 'Daffa T', 'Bayu S', 'Christian K'].map(n => (
            <div key={n} style={col({ alignItems: 'center', gap: 6 })}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--apple-color-light-gray)' }} />
              <span style={{ fontSize: 10, color: 'var(--apple-color-black-48)' }}>{n}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={col({ gap: 10, padding: '6px 24px' })}>
        <div style={row({ justifyContent: 'space-between' })}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>History transaction</span>
          <span style={{ fontSize: 11, color: 'var(--apple-color-black-48)' }}>see more</span>
        </div>
        {[
          { name: 'Dribbble Pro', date: 'June 28 · 00:01 AM', amount: '- $573', neg: true },
          { name: 'Syaiful Rijal', date: 'June 22 · 05:20 PM', amount: '+ $1000', neg: false },
          { name: 'Daffa Tritan', date: 'June 12 · 07:20 AM', amount: '- $200', neg: true },
        ].map(tx => (
          <div key={tx.name} style={row({ justifyContent: 'space-between' })}>
            <div style={row({ gap: 10 })}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--apple-color-light-gray)' }} />
              <div style={col({ gap: 2 })}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{tx.name}</span>
                <span style={{ fontSize: 10, color: 'var(--apple-color-black-48)' }}>{tx.date}</span>
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: tx.neg ? '#FF3B30' : 'var(--apple-color-blue)' }}>{tx.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
