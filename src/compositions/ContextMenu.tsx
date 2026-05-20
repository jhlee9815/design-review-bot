import { Icon } from '../components/Icon'

interface ContextMenuProps {
  onInviteToHub?: () => void
  onManageMembers?: () => void
}

const INVITE_TO_HUB_LABEL =
  /* figma:text id="contextMenu.invite-to-hub" node="20:11397" */ 'Invite to Hub'
const MANAGE_MEMBERS_LABEL =
  /* figma:text id="contextMenu.manage-members" node="20:11400" */ 'Manage Members'

export function ContextMenu({ onInviteToHub, onManageMembers }: ContextMenuProps) {
  return (
    <div style={{
      width: '200px',
      height: '112px',
      background: 'var(--background-modal)',
      borderRadius: '12px',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Invite to Hub */}
      <button
        onClick={onInviteToHub}
        style={{
          height: '56px',
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Icon name="UserPlus" size={20} color="var(--text-primary)" />
        <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{INVITE_TO_HUB_LABEL}</span>
      </button>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-default)', margin: '0' }} />

      {/* Manage Members */}
      <button
        onClick={onManageMembers}
        style={{
          height: '56px',
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Icon name="Users" size={20} color="var(--text-primary)" />
        <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{MANAGE_MEMBERS_LABEL}</span>
      </button>
    </div>
  )
}
