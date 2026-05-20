import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Icon } from '../components/Icon'

type ListItemState = 'Default' | 'Selected' | 'SwipeDelete'
type BadgeVariant = 'admin' | 'member' | 'owner'

interface ListItemProps {
  state?: ListItemState
  name?: string
  email?: string
  badge?: BadgeVariant
  initials?: string
  avatarState?: 'default' | 'active'
}

const DEFAULT_AVATAR_STATE =
  /* figma:prop id="listItemMember.avatar-state" node="117:11386,117:11388,117:11390" prop="avatarState" transform="lower" */ 'default'
const DEFAULT_INITIALS =
  /* figma:text id="listItemMember.s" node="I117:11386;15:11393,I117:11388;15:11393,I117:11390;15:11393" */ 'S'
const DEFAULT_NAME =
  /* figma:text id="listItemMember.sarah" node="16:11391,16:11402,16:11414" */ 'Sarah'
const DEFAULT_EMAIL =
  /* figma:text id="listItemMember.sarah-j-example-com" node="16:11394,16:11405" */ 'sarah.j@example.com'
const DEFAULT_BADGE_LABEL =
  /* figma:text id="listItemMember.member" node="16:11393,16:11404" */ 'MEMBER'

export function ListItem({
  state = /* figma:prop id="listItemMember.state" node="16:11415" prop="state" transform="pascal-compact" */ 'Default',
  name = DEFAULT_NAME,
  email = DEFAULT_EMAIL,
  badge = 'member',
  initials = DEFAULT_INITIALS,
  avatarState = DEFAULT_AVATAR_STATE,
}: ListItemProps) {
  return (
    <div style={{
      width: '100%',
      height: '64px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '12px',
      paddingLeft: '20px',
      paddingRight: state === 'SwipeDelete' ? '0' : '20px',
      background: 'var(--background-modal)',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      {/* Left: Avatar + Text */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', flex: 1 }}>
        {/* figma:prop id="listItemMember.avatar-size" node="117:11386,117:11388,117:11390" prop="size" transform="lower" */}
        <Avatar size="md" state={avatarState} initials={initials} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{name}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{email}</span>
        </div>
      </div>

      {/* Right: indicator based on state */}
      {state === 'Default' && (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          {badge && <Badge variant={badge} label={DEFAULT_BADGE_LABEL} />}
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '9999px',
            border: '1.5px solid var(--border-default)',
            flexShrink: 0,
          }} />
        </div>
      )}

      {state === 'Selected' && (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          {badge && <Badge variant={badge} label={DEFAULT_BADGE_LABEL} />}
          <div style={{
            width: '68px',
            height: '28px',
            borderRadius: '100px',
            background: 'var(--primary-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon name="Check" size={16} color="var(--button-secondary-default)" />
          </div>
        </div>
      )}

      {state === 'SwipeDelete' && (
        <div style={{
          width: '72px',
          height: '64px',
          background: 'var(--system-error-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon name="Trash2" size={20} color="var(--button-secondary-default)" />
        </div>
      )}
    </div>
  )
}
