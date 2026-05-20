type AvatarSize = 'sm' | 'md' | 'lg'
type AvatarState = 'default' | 'active'

interface AvatarProps {
  initials?: string
  size?: AvatarSize
  state?: AvatarState
}

const SIZE_PX: Record<AvatarSize, number> = { sm: 32, md: 40, lg: 48 }
const FONT_PX: Record<AvatarSize, number> = { sm: 13, md: 16, lg: 18 }
const DEFAULT_INITIALS: Record<AvatarState, string> = {
  active: /* figma:text id="avatar.c" node="15:11387,15:11391,15:11395" */ 'C',
  default: /* figma:text id="avatar.s" node="15:11389,15:11393,15:11397" */ 'S',
}

export function Avatar({
  initials,
  size = /* figma:prop id="avatar.size" node="15:11398" prop="size" transform="lower" */ 'md',
  state = /* figma:prop id="avatar.state" node="15:11398" prop="state" transform="lower" */ 'default',
}: AvatarProps) {
  const dim = SIZE_PX[size]
  const isActive = state === 'active'

  return (
    <div style={{
      width: dim,
      height: dim,
      borderRadius: '9999px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isActive ? 'var(--button-primary-default)' : 'var(--border-card)',
      color: isActive ? 'var(--button-secondary-default)' : 'var(--text-primary)',
      fontSize: FONT_PX[size],
      fontWeight: 700,
      flexShrink: 0,
      userSelect: 'none',
    }}>
      {(initials ?? DEFAULT_INITIALS[state]).slice(0, 2).toUpperCase()}
    </div>
  )
}
