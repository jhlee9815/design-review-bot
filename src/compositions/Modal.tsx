import { Icon } from '../components/Icon'
import { Button } from '../components/Button'

type ModalType = 'Success' | 'Danger'

interface ModalProps {
  type?: ModalType
  title?: string
  description?: string
  onClose?: () => void
  onAction?: () => void
}

const ACTION_LABELS = {
  done: /* figma:text id="modalDialog.done" node="19:11395" */ 'Done',
  delete: /* figma:text id="modalDialog.delete" node="19:11405" */ 'Delete',
}

const DEFAULT_TITLES: Record<ModalType, string> = {
  Success: /* figma:text id="modalDialog.name-updated" node="19:11392" */ 'Name Updated!',
  Danger: /* figma:text id="modalDialog.delete-home" node="19:11402" */ 'Delete Home?',
}

const DEFAULT_DESCRIPTIONS: Record<ModalType, string> = {
  Success:
    /* figma:text id="modalDialog.your-home-name-has-been-successfully-updated" node="19:11393" */ 'Your home name has been successfully updated.',
  Danger:
    /* figma:text id="modalDialog.are-you-sure-you-want-to-delete-bedroom-hub" node="19:11403" */ 'Are you sure you want to delete "Bedroom Hub"?',
}

export function Modal({
  type = /* figma:prop id="modalDialog.type" node="19:11406" prop="type" transform="pascal-compact" */ 'Success',
  title,
  description,
  onClose,
  onAction,
}: ModalProps) {
  const resolvedTitle = title ?? DEFAULT_TITLES[type]
  const resolvedDescription = description ?? DEFAULT_DESCRIPTIONS[type]

  return (
    <div style={{
      width: '335px',
      borderRadius: '20px',
      background: 'var(--background-modal)',
      padding: '24px',
      border: '1px solid var(--border-default)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    }}>
      {/* Close button */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="X" size={24} color="var(--text-primary)" />
        </button>
      </div>

      {/* Icon circle */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '9999px',
        background: type === 'Success' ? 'var(--status-good-bg)' : 'var(--status-danger-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {type === 'Success' ? (
          <Icon name="CircleCheck" size={32} color="var(--status-good-text)" />
        ) : (
          <Icon name="Trash2" size={32} color="var(--status-danger-text)" />
        )}
      </div>

      {/* Title */}
      <span style={{
        fontSize: '16px',
        fontWeight: 700,
        color: type === 'Success' ? 'var(--text-primary)' : 'var(--system-error-primary)',
        textAlign: 'center',
      }}>
        {resolvedTitle}
      </span>

      {/* Description */}
      <span style={{
        fontSize: '14px',
        color: 'var(--text-secondary)',
        textAlign: 'center',
      }}>
        {resolvedDescription}
      </span>

      {/* Action button */}
      {type === 'Success' ? (
        <Button variant="secondary" size="lg" label={ACTION_LABELS.done} onClick={onAction} />
      ) : (
        <Button variant="danger" size="lg" label={ACTION_LABELS.delete} onClick={onAction} />
      )}
    </div>
  )
}
