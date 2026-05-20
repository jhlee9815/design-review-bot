import { Modal } from '../compositions/Modal'

export function SuccessModalScreen() {
  return (
    <div style={{
      position: 'relative',
      width: '390px',
      height: '600px',
      background: 'var(--background-secondary)',
      fontFamily: 'var(--font-sans)',
      overflow: 'hidden',
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(23, 23, 23, 0.6)',
      }} />

      {/* Modal container */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Modal
          type="Success"
          title="Name Updated!"
          description="Your home name has been successfully updated."
        />
      </div>
    </div>
  )
}
