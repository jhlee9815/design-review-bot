interface SwitchProps {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}

export function Switch({ checked, onChange, disabled = false }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      style={{
        width: '44px',
        height: '26px',
        borderRadius: '9999px',
        background: checked ? '#0a0a0a' : '#d4d4d4',
        border: 'none',
        padding: 0,
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 120ms cubic-bezier(0.2,0,0,1)',
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          width: '20px',
          height: '20px',
          borderRadius: '9999px',
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 120ms cubic-bezier(0.2,0,0,1)',
        }}
      />
    </button>
  )
}
