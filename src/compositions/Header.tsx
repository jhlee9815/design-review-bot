import { Icon } from '../components/Icon'

type HeaderVariant = 'BackTitle' | 'TitleActions' | 'BackTitleNoAction'

interface HeaderProps {
  variant?: HeaderVariant
  title?: string
}

const FAMILY_MANAGEMENT_TITLE =
  /* figma:text id="header.family-management" node="18:11405,79:11391" */ 'Family Management'

const DEFAULT_TITLES: Record<HeaderVariant, string> = {
  BackTitle: FAMILY_MANAGEMENT_TITLE,
  TitleActions: /* figma:text id="header.parent-s-home-hub" node="18:11410" */ "Parent's Home Hub",
  BackTitleNoAction: FAMILY_MANAGEMENT_TITLE,
}

export function Header({
  variant = /* figma:prop id="header.variant" node="18:11416" prop="variant" transform="pascal-compact" */ 'BackTitle',
  title,
}: HeaderProps) {
  const resolvedTitle = title ?? DEFAULT_TITLES[variant]

  return (
    <div style={{
      width: '390px',
      height: '56px',
      paddingLeft: '20px',
      paddingRight: '20px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      background: 'var(--background-modal)',
      boxSizing: 'border-box',
    }}>
      {variant === 'BackTitle' && (
        <>
          <Icon name="ArrowLeft" size={24} color="var(--text-primary)" />
          <span style={{
            flex: 1,
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            {resolvedTitle}
          </span>
          <Icon name="User" size={24} color="var(--text-primary)" />
        </>
      )}

      {variant === 'TitleActions' && (
        <>
          <span style={{
            flex: 1,
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            {resolvedTitle}
          </span>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
            <Icon name="Bell" size={24} color="var(--text-primary)" />
            <Icon name="Settings" size={24} color="var(--text-primary)" />
          </div>
        </>
      )}

      {variant === 'BackTitleNoAction' && (
        <>
          <Icon name="ArrowLeft" size={24} color="var(--text-primary)" />
          <span style={{
            flex: 1,
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            {resolvedTitle}
          </span>
          {/* Placeholder to balance the left icon */}
          <div style={{ width: '24px', height: '24px' }} />
        </>
      )}
    </div>
  )
}
