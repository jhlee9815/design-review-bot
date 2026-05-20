/**
 * PesseSendScreen — Apple-inspired fintech demo.
 * Apple-inspired only. Not official Apple Design System. Not affiliated with Apple Inc.
 *
 * Contains a figma:text marker on the primary CTA so the pipeline can demo
 * auto-apply when the corresponding Figma text node changes.
 */

const phone: React.CSSProperties = {
  width: 390, height: 844,
  background: 'var(--apple-color-white)',
  borderRadius: 40,
  fontFamily: 'var(--apple-font-text)',
  color: 'var(--apple-color-near-black)',
  display: 'flex', flexDirection: 'column',
  paddingTop: 24, paddingBottom: 24, gap: 18,
  overflow: 'hidden',
}

const PESSE_SEND_CTA = /* figma:text id="pesse.send.cta" node="10:62" */ 'Send money'

export function PesseSendScreen() {
  return (
    <div style={phone}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, border: '1px solid var(--apple-color-overlay-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600 }}>←</div>
        <span style={{ fontSize: 17, fontWeight: 600 }}>Send money</span>
        <div style={{ width: 32, height: 32, borderRadius: 16, border: '1px solid var(--apple-color-overlay-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--apple-color-black-48)' }}>?</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 20px 0' }}>
        <span style={{ fontSize: 12, color: 'var(--apple-color-black-48)' }}>Send to</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--apple-color-light-gray)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Syaiful Rijal</span>
              <span style={{ fontSize: 11, color: 'var(--apple-color-black-48)' }}>8921362190</span>
            </div>
          </div>
          <span style={{ padding: '7px 14px', border: '1px solid var(--apple-color-overlay-light)', borderRadius: 'var(--apple-radius-pill)', fontSize: 11, fontWeight: 600 }}>Change</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, padding: '10px 20px' }}>
        <span style={{ fontSize: 56, fontWeight: 700, letterSpacing: -2 }}>$19</span>
        <span style={{ width: 2, height: 44, background: 'var(--apple-color-blue)' }} />
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, border: '1px solid var(--apple-color-overlay-light)', borderRadius: 'var(--apple-radius-comfortable)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 44, height: 28, background: 'var(--apple-color-blue)', borderRadius: 'var(--apple-radius-standard)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Linda's card</span>
              <span style={{ fontSize: 11, color: 'var(--apple-color-black-48)' }}>Balance $521,098.31</span>
            </div>
          </div>
          <span style={{ padding: '7px 14px', border: '1px solid var(--apple-color-overlay-light)', borderRadius: 'var(--apple-radius-pill)', fontSize: 11, fontWeight: 600 }}>Change</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 20px' }}>
        {[['1','2','3'],['4','5','6'],['7','8','9'],['000','0','⌫']].map((rowKeys, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 8 }}>
            {rowKeys.map(k => {
              const active = k === '9'
              return (
                <div key={k} style={{ flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--apple-radius-pill)', background: active ? 'var(--apple-color-blue)' : 'var(--apple-color-light-gray)', color: active ? 'var(--apple-color-white)' : 'var(--apple-color-near-black)', fontSize: k === '000' ? 14 : (k === '⌫' ? 16 : 18), fontWeight: 600 }}>{k}</div>
              )
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 0', borderRadius: 'var(--apple-radius-pill)', background: 'var(--apple-color-near-black)', color: 'var(--apple-color-white)', fontSize: 15, fontWeight: 600 }}>
          {PESSE_SEND_CTA}
        </div>
      </div>
    </div>
  )
}
