import { Button } from '../components/Button'

export type NotificationVariant = 'actions' | 'confirmed' | 'status-text' | 'none'

interface NotificationListItemProps {
  variant: NotificationVariant
  title: string
  time: string
  subtext: string
  onDecline?: () => void
  onAccept?: () => void
  declineLabel?: string
  acceptLabel?: string
  confirmedLabel?: string
  statusText?: string
}

const DEFAULT_TITLE =
  /* figma:text id="notificationListItem.group-invitation" node="179:11405,179:11418,179:11429,179:11440" */ 'Group Invitation'
const DEFAULT_TIME =
  /* figma:text id="notificationListItem.2-mins-ago" node="179:11406,179:11419,179:11430,179:11441" */ '2 mins ago'
const DEFAULT_SUBTEXT =
  /* figma:text id="notificationListItem.invited-by-mom-gmail-com-to-join-mom-s-house" node="179:11407,179:11420,179:11431,179:11442" */ "Invited by mom@gmail.com to join Mom's House"

const ACTION_LABELS = {
  decline: /* figma:text id="notificationListItem.decline" node="179:11410" */ 'Decline',
  accept: /* figma:text id="notificationListItem.accept" node="179:11412" */ 'Accept',
}
const DEFAULT_CONFIRMED_LABEL =
  /* figma:text id="notificationListItem.invitation-accepted" node="179:11422" */ 'Invitation Accepted'
const DEFAULT_STATUS_TEXT =
  /* figma:text id="notificationListItem.invitation-declined" node="179:11432" */ 'Invitation declined'

const SLOT_BUTTON_STYLE: React.CSSProperties = {
  height: '40px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 500,
}

export function NotificationListItem({
  variant = /* figma:prop id="notificationListItem.variant" node="179:11404" prop="variant" transform="lower" */ 'actions',
  title = DEFAULT_TITLE,
  time = DEFAULT_TIME,
  subtext = DEFAULT_SUBTEXT,
  onDecline,
  onAccept,
  declineLabel = ACTION_LABELS.decline,
  acceptLabel = ACTION_LABELS.accept,
  confirmedLabel = DEFAULT_CONFIRMED_LABEL,
  statusText = DEFAULT_STATUS_TEXT,
}: NotificationListItemProps) {
  const hasSlot = variant !== 'none'

  return (
    <div
      style={{
        width: '350px',
        boxSizing: 'border-box',
        padding: '16px',
        background: 'var(--background-secondary)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: hasSlot ? '16px' : '0',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              flex: 1,
              fontSize: '14px',
              fontWeight: 700,
              lineHeight: 1.3,
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </span>
          <span
            style={{
              width: '60px',
              textAlign: 'right',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: 1.4,
              color: 'var(--text-disabled)',
            }}
          >
            {time}
          </span>
        </div>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
          }}
        >
          {subtext}
        </span>
      </div>

      {variant === 'actions' && (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
          <Button
            variant="secondary"
            size="md"
            label={declineLabel}
            onClick={onDecline}
            style={{
              ...SLOT_BUTTON_STYLE,
              width: '153px',
              border: '1.5px solid var(--text-primary)',
            }}
          />
          <Button
            variant="primary"
            size="md"
            label={acceptLabel}
            onClick={onAccept}
            style={{ ...SLOT_BUTTON_STYLE, width: '153px' }}
          />
        </div>
      )}

      {variant === 'confirmed' && (
        <Button
          variant="ghost"
          size="md"
          disabled
          label={confirmedLabel}
          style={{
            ...SLOT_BUTTON_STYLE,
            width: '318px',
            background: '#D4D4D4',
            color: '#A3A3A3',
            opacity: 1,
            cursor: 'default',
          }}
        />
      )}

      {variant === 'status-text' && (
        <span
          style={{
            width: '318px',
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: 1.4,
            color: '#A3A3A3',
          }}
        >
          {statusText}
        </span>
      )}
    </div>
  )
}
