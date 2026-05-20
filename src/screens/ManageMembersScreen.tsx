import { Header } from '../compositions/Header'
import { ListItem } from '../compositions/ListItem'

export function ManageMembersScreen() {
  return (
    <div style={{
      width: '390px',
      background: 'var(--background-secondary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
    }}>
      <Header variant="BackTitleNoAction" title="Manage Members" />

      {/* Member list */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0' }}>
        <ListItem
          state="Default"
          name="Charles (Me)"
          email="charles@example.com"
          badge="admin"
          initials="C"
          avatarState="active"
        />
        <ListItem
          state="SwipeDelete"
          name="Sarah"
          email="sarah.j@example.com"
          badge="member"
          initials="S"
        />
        <ListItem
          state="Default"
          name="Olive"
          email="olive@example.com"
          badge="member"
          initials="O"
        />
      </div>
    </div>
  )
}
