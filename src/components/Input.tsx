import { useState } from 'react'

export type InputState = 'default' | 'error'

interface InputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  helperText?: string
  state?: InputState
  disabled?: boolean
  style?: React.CSSProperties
}

export function Input({
  value,
  onChange,
  placeholder = 'Enter text',
  label,
  helperText,
  state = 'default',
  disabled = false,
  style: styleProp,
}: InputProps) {
  const [focused, setFocused] = useState(false)

  const isError = state === 'error'

  let boxShadow = 'none'
  let border = '1px solid #e5e5e5'

  if (isError && focused) {
    border = '1px solid #dc2626'
    boxShadow = '0 0 4px 3px rgba(220,38,38,0.20)'
  } else if (isError) {
    border = '1px solid #dc2626'
    boxShadow = 'none'
  } else if (focused) {
    border = '1px solid #a3a3a3'
    boxShadow = '0 0 0 3px rgba(163,163,163,0.5)'
  }

  const helperColor = isError ? '#b91c1c' : 'var(--text-secondary)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...styleProp }}>
      {label && (
        <label style={{
          fontSize: '13px',
          fontWeight: 500,
          fontFamily: 'var(--font-sans)',
          color: '#404040',
        }}>
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: '48px',
          borderRadius: '12px',
          background: 'var(--background-modal)',
          border,
          boxShadow,
          padding: '0 16px',
          fontSize: '15px',
          fontFamily: 'var(--font-sans)',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'box-shadow 0.15s, border-color 0.15s',
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.5 : 1,
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      {helperText && (
        <p style={{
          margin: 0,
          fontSize: '13px',
          fontWeight: 400,
          fontFamily: 'var(--font-sans)',
          color: helperColor,
          paddingLeft: '2px',
        }}>
          {helperText}
        </p>
      )}
    </div>
  )
}
