import { Icon } from '../components/Icon'
import type { IconName } from '../components/Icon'

type NavTabName = 'Home' | 'Activity' | 'Moon' | 'Podcast' | 'Play'

interface BottomNavBarProps {
  activeTab?: NavTabName
  onTabChange?: (tab: NavTabName) => void
}

const NAV_TABS: { name: NavTabName; icon: IconName }[] = [
  { name: 'Home', icon: 'Home' },
  { name: 'Activity', icon: 'Activity' },
  { name: 'Moon', icon: 'Moon' },
  { name: 'Podcast', icon: 'Podcast' },
  { name: 'Play', icon: 'Play' },
]

export function BottomNavBar({ activeTab = 'Home', onTabChange }: BottomNavBarProps) {
  return (
    <div style={{
      width: '350px',
      height: '72px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--base-white)',
      borderRadius: '9999px',
      padding: '0 32px',
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
      boxSizing: 'border-box',
    }}>
      {NAV_TABS.map(({ name, icon }) => {
        const isActive = name === activeTab
        return (
          <button
            key={name}
            onClick={() => onTabChange?.(name)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isActive ? 'var(--color-neutral-900)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <Icon
              name={icon}
              size={24}
              color={isActive ? 'var(--base-white)' : 'var(--text-secondary)'}
            />
          </button>
        )
      })}
    </div>
  )
}
