import { type ReactNode } from 'react'

type ToastVariant = 'success' | 'error'

interface ToastProps {
  message: string
  variant: ToastVariant
  icon?: ReactNode
}

const VARIANT_STYLES: Record<ToastVariant, React.CSSProperties> = {
  success: {
    background: '#0a0a0a',
    color: 'white',
  },
  error: {
    background: '#FECACA',
    color: '#B91C1C',
  },
}

const DEFAULT_ICON_COLOR: Record<ToastVariant, string> = {
  success: '#DCFCE7',
  error: '#B91C1C',
}

const DEFAULT_ICONS: Record<ToastVariant, string> = {
  success: '●',
  error: '⚠',
}

export function Toast({ message, variant, icon }: ToastProps) {
  const iconColor = DEFAULT_ICON_COLOR[variant]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        borderRadius: '12px',
        boxShadow: '0 0 16px 0 rgba(0,0,0,0.12)',
        maxWidth: '360px',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'var(--font-sans)',
        ...VARIANT_STYLES[variant],
      }}
    >
      <span style={{ color: iconColor, flexShrink: 0, fontSize: '16px', lineHeight: 1 }}>
        {icon ?? DEFAULT_ICONS[variant]}
      </span>
      <span>{message}</span>
    </div>
  )
}
