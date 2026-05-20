import { Icon } from '../components/Icon'
import { Button } from '../components/Button'
import { Header } from '../compositions/Header'
import { ContextMenu } from '../compositions/ContextMenu'

export function FamilyScreen() {
  return (
    <div style={{
      width: '390px',
      background: 'var(--background-secondary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
      minHeight: '500px',
    }}>
      <Header variant="BackTitle" title="Family Management" />

      {/* Group card */}
      <div style={{
        margin: '16px 20px 0',
        background: 'var(--background-modal)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '12px',
        boxSizing: 'border-box',
      }}>
        {/* Icon circle */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '100%',
          background: 'var(--background-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon name="Users" size={20} color="var(--text-primary)" />
        </div>
        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>My Family</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>2 Members</span>
        </div>
      </div>

      {/* Context menu overlapping below card */}
      <div style={{ margin: '0 20px' }}>
        <ContextMenu />
      </div>

      {/* Bottom create button */}
      <div style={{ padding: '24px 20px', display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" size="lg" label="+ Create New Group" style={{ width: '100%', maxWidth: '335px' }} />
      </div>
    </div>
  )
}
