import React from 'react'

export type OTPState = 'empty' | 'focused' | 'filled' | 'error' | 'error+focused'

const CELL_STYLE: Record<OTPState, React.CSSProperties> = {
  'empty':         { border: '1px solid var(--border-default)',        boxShadow: 'none' },
  'focused':       { border: '1.4px solid var(--border-accent)',        boxShadow: 'var(--shadow-focus)' },
  'filled':        { border: '1.4px solid var(--border-accent)',        boxShadow: 'none' },
  'error':         { border: '1.4px solid var(--system-error-subtle)', boxShadow: 'none' },
  'error+focused': { border: '2px solid var(--system-error-primary)',  boxShadow: 'var(--shadow-error)' },
}

const DEFAULT_CELL_VALUE =
  /* figma:text id="otpGroup.0" node="139:11393,139:11395,139:11397,147:11393,147:11395" */ '0'

function OTPCell({ value, state }: { value?: string; state: OTPState }) {
  const isVisible = state === 'filled' || state === 'error'
  return (
    <div style={{
      width: '50px',
      height: '56px',
      borderRadius: '12px',
      background: 'var(--background-modal)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: 700,
      color: isVisible ? 'var(--text-primary)' : 'transparent',
      ...CELL_STYLE[state],
    }}>
      {value ?? DEFAULT_CELL_VALUE}
    </div>
  )
}

interface OTPGroupProps {
  label?: string
  showLabel?: boolean
  timer?: string
  showTimer?: boolean
  cells?: string[]
  cellState?: OTPState
  subText?: string
  showSubText?: boolean
}

export function OTPGroup({
  label = 'Verification Code',
  showLabel = true,
  timer = '03:00',
  showTimer = true,
  cells = ['4', '8', '2', '1', '9', '2'],
  cellState = /* figma:prop id="otpGroup.state" node="139:11398" prop="cellState" transform="lower" */ 'filled',
  subText,
  showSubText = false,
}: OTPGroupProps) {
  const isError = cellState === 'error' || cellState === 'error+focused'
  const subTextColor = isError ? 'var(--status-caution-text)' : 'var(--status-good-text)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '350px', padding: '8px 0', gap: '8px' }}>
      {(showLabel || showTimer) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
          {showLabel && (
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
          )}
          {showTimer && (
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{timer}</span>
          )}
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {cells.map((v, i) => (
          <OTPCell key={i} value={v} state={cellState} />
        ))}
      </div>
      {showSubText && subText && (
        <p style={{ margin: 0, fontSize: '12px', lineHeight: '16px', color: subTextColor, padding: '0 2px' }}>
          {subText}
        </p>
      )}
    </div>
  )
}
