type ChipVariant = 'default' | 'on' | 'outline'

interface ChipProps {
  label: string
  variant?: ChipVariant
  onClick?: () => void
}

const VARIANT_STYLES: Record<ChipVariant, React.CSSProperties> = {
  default: {
    background: '#f5f5f5',
    color: '#404040',
    border: 'none',
  },
  on: {
    background: '#0a0a0a',
    color: 'white',
    border: 'none',
  },
  outline: {
    background: 'white',
    color: '#404040',
    border: '1px solid #d4d4d4',
  },
}

export function Chip({ label, variant = 'default', onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        height: '32px',
        padding: '0 12px',
        borderRadius: '9999px',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: 'var(--font-sans)',
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...VARIANT_STYLES[variant],
      }}
    >
      {label}
    </button>
  )
}
