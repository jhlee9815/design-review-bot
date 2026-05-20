import { Header } from '../compositions/Header'
import { NotificationListItem } from '../compositions/NotificationListItem'

export function NotificationsScreen() {
  return (
    <div style={{
      width: '390px',
      background: 'var(--background-modal)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
    }}>
      <Header variant="BackTitleNoAction" title="Notifications" />

      <div style={{ padding: '16px 20px 8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Requests</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 20px 20px' }}>
        <NotificationListItem
          variant="actions"
          title="Group Invitation"
          time="2 mins ago"
          subtext="Invited by mom@gmail.com to join Mom's House"
        />
        <NotificationListItem
          variant="confirmed"
          title="Group Invitation"
          time="1 hr ago"
          subtext="Invited by mom@gmail.com to join Mom's House"
        />
        <NotificationListItem
          variant="status-text"
          title="Group Invitation"
          time="2 hr ago"
          subtext="Invited by mom@gmail.com to join Mom's House"
          statusText="Invitation declined"
        />
        <NotificationListItem
          variant="status-text"
          title="Group invitation declined"
          time="1 day ago"
          subtext="Invited by mom@gmail.com to join Mom's House"
          statusText="Invitation declined"
        />
        <NotificationListItem
          variant="none"
          title="Group invitation declined"
          time="2 day ago"
          subtext="Invited by mom@gmail.com to join Mom's House"
        />
      </div>
    </div>
  )
}
