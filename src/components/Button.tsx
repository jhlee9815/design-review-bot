import { type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  label?: string
  disabled?: boolean
  onClick?: () => void
  style?: React.CSSProperties
  iconOnly?: boolean
  children?: ReactNode
}

const HEIGHT: Record<ButtonSize, string> = { sm: '40px', md: '48px', lg: '56px' }
const FONT_SIZE: Record<ButtonSize, string> = { sm: '14px', md: '15px', lg: '16px' }
const RADIUS: Record<ButtonSize, string> = { sm: '12px', md: '12px', lg: '16px' }

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--button-primary-default)',
    color: 'var(--button-secondary-default)',
    border: 'none',
  },
  secondary: {
    background: 'var(--background-modal)',
    color: 'var(--text-primary)',
    border: '1.5px solid var(--border-default)',
  },
  danger: {
    background: '#fee2e2',
    color: '#b91c1c',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: 'none',
  },
}

const DEFAULT_BUTTON_LABEL =
  /* figma:text id="button.button" node="14:11387,14:11389,14:11391,14:11393" */ 'Button'

const DEFAULT_LABELS: Record<ButtonVariant, string> = {
  primary: DEFAULT_BUTTON_LABEL,
  secondary: DEFAULT_BUTTON_LABEL,
  danger: /* figma:text id="button.delete" node="14:11395,14:11397" */ 'Delete',
  ghost: /* figma:text id="button.cancel" node="14:11399,14:11401" */ 'Cancel',
}

export function Button({
  variant = /* figma:prop id="button.variant" node="14:11402" prop="variant" transform="lower" */ 'primary',
  size = /* figma:prop id="button.size" node="14:11402" prop="size" transform="lower" */ 'lg',
  label,
  disabled = false,
  onClick,
  style: styleProp,
  iconOnly = false,
  children,
}: ButtonProps) {
  const iconOnlyStyle: React.CSSProperties = iconOnly
    ? { width: '44px', height: '44px', padding: 0, borderRadius: '9999px' }
    : {}

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: iconOnly ? undefined : '335px',
        height: HEIGHT[size],
        borderRadius: RADIUS[size],
        fontSize: FONT_SIZE[size],
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.15s',
        fontFamily: 'var(--font-sans)',
        opacity: disabled ? 0.5 : 1,
        ...VARIANT_STYLES[variant],
        ...iconOnlyStyle,
        ...styleProp,
      }}
    >
      {children ?? label ?? DEFAULT_LABELS[variant]}
    </button>
  )
}
