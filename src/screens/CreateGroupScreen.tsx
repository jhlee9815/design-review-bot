import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Header } from '../compositions/Header'
import { ListItem } from '../compositions/ListItem'

export function CreateGroupScreen() {
  return (
    <div style={{
      width: '390px',
      background: 'var(--background-secondary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
    }}>
      <Header variant="BackTitleNoAction" title="Create Group" />

      {/* Form area */}
      <div style={{
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        {/* Group name */}
        <div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
            Group Name
          </span>
          <Input value="Gr0upGr0upGr0upGr0upGr0upGr0up" />
        </div>

        {/* Select members */}
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Select Members
          </span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ListItem state="Default" initials="S" name="Sarah" email="sarah.j@example.com" />
            <ListItem state="Default" initials="M" name="Mike" email="mike.j@example.com" />
            <ListItem state="Default" initials="S" name="Sarah" email="sarah.j@example.com" />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '24px 20px', display: 'flex', justifyContent: 'center' }}>
        <Button variant="primary" size="lg" label="Create" style={{ width: '100%', maxWidth: '335px' }} />
      </div>
    </div>
  )
}
