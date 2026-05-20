import { Icon } from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { TabNavigation } from '../compositions/TabNavigation'
import { BottomNavBar } from '../compositions/BottomNavBar'

export function HomeScreen() {
  return (
    <div style={{
      width: '390px',
      background: 'var(--background-secondary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
    }}>
      {/* Custom header */}
      <div style={{
        background: 'var(--background-modal)',
        height: '56px',
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        {/* Center: title + chevron */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Parent's Home Hub</span>
          <Icon name="ChevronDown" size={16} color="var(--text-primary)" />
        </div>
        {/* Right icons */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <Icon name="BellDot" size={24} color="var(--text-primary)" />
          <Icon name="User" size={24} color="var(--text-primary)" />
        </div>
      </div>

      {/* Family status section header */}
      <div style={{
        padding: '16px 20px 8px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--text-disabled)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          FAMILY STATUS
        </span>
        <Icon name="ChevronDown" size={16} color="var(--text-disabled)" />
      </div>

      {/* Tab navigation */}
      <TabNavigation activeTab="All" />

      {/* Avatar row */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        overflowX: 'auto',
      }}>
        {[
          { initials: 'C', label: 'Calven', state: 'active' as const, textColor: 'var(--text-primary)', fontWeight: 700 },
          { initials: 'K', label: 'Kevin', state: 'default' as const, textColor: 'var(--text-secondary)', fontWeight: 400 },
          { initials: 'M', label: 'Mike', state: 'default' as const, textColor: 'var(--text-secondary)', fontWeight: 400 },
          { initials: 'J', label: 'Jornadan', state: 'default' as const, textColor: 'var(--text-secondary)', fontWeight: 400 },
        ].map(({ initials, label, state, textColor, fontWeight }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <Avatar size="lg" state={state} initials={initials} />
            <span style={{ fontSize: '12px', color: textColor, fontWeight }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Stat cards */}
      <div style={{
        padding: '8px 20px 16px',
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
      }}>
        {/* Sleep card */}
        <div style={{
          flex: 1,
          background: 'var(--background-card)',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: 'var(--shadow-sm)',
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Icon name="Moon" size={16} color="var(--text-primary)" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Sleep</span>
          </div>
          <div>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>19.24</span>
            <br />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>hrs</span>
          </div>
        </div>

        {/* Health card */}
        <div style={{
          flex: 1,
          background: 'var(--background-card)',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: 'var(--shadow-sm)',
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Icon name="Heart" size={16} color="var(--text-primary)" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Health</span>
          </div>
          <div>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>73</span>
            <br />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/100</span>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNavBar activeTab="Home" />
    </div>
  )
}
