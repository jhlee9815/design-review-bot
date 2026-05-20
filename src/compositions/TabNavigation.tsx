const TABS = [
  /* figma:text id="tabNavigation.all" node="20:11388" */ 'All',
  /* figma:text id="tabNavigation.my-family" node="20:11391" */ 'My Family',
  /* figma:text id="tabNavigation.guests" node="20:11393" */ 'Guests',
] as const

type TabName = (typeof TABS)[number]

interface TabNavigationProps {
  activeTab?: TabName
  onTabChange?: (tab: TabName) => void
}

export function TabNavigation({ activeTab = TABS[0], onTabChange }: TabNavigationProps) {
  return (
    <div style={{
      width: '390px',
      height: '44px',
      display: 'flex',
      flexDirection: 'row',
      background: 'var(--background-modal)',
      boxSizing: 'border-box',
    }}>
      {TABS.map((tab) => {
        const isActive = tab === activeTab
        return (
          <button
            key={tab}
            onClick={() => onTabChange?.(tab)}
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 500,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--primary-accent)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              boxSizing: 'border-box',
            }}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
