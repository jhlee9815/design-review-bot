type BadgeVariant = 'admin' | 'member' | 'owner' | 'success' | 'danger' | 'info' | 'caution' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  label?: string
}

const VARIANT_LABELS: Record<BadgeVariant, string> = {
  admin:   /* figma:text id="badge.admin" node="15:11400" */ 'ADMIN',
  member:  /* figma:text id="badge.member" node="15:11402" */ 'MEMBER',
  owner:   /* figma:text id="badge.owner" node="86:11387" */ 'OWNER',
  success: 'Success',
  danger:  'Danger',
  info:    'Info',
  caution: 'Caution',
  default: 'Default',
}

const VARIANT_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  admin:   { background: 'var(--background-card)',   color: 'var(--text-secondary)' },
  member:  { background: 'var(--background-card)',   color: 'var(--text-secondary)' },
  owner:   { background: 'var(--border-card)', color: 'var(--text-secondary)' },
  success: { background: '#DCFCE7', color: '#15803D' },
  danger:  { background: '#FECACA', color: '#B91C1C' },
  info:    { background: '#BFDBFE', color: '#2563EB' },
  caution: { background: '#FEF08A', color: '#854D0E' },
  default: { background: '#f5f5f5', color: '#404040' },
}

export function Badge({
  variant = /* figma:prop id="badge.type" node="15:11403" prop="variant" transform="lower" */ 'member',
  label,
}: BadgeProps) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: 500,
      letterSpacing: '0.01em',
      ...VARIANT_STYLES[variant],
    }}>
      {label ?? VARIANT_LABELS[variant]}
    </span>
  )
}
