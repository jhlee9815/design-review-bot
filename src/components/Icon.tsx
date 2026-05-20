import {
  Home, Bell, BellDot, Settings, User, UserPlus, Users,
  ChevronDown, ChevronRight, ArrowLeft, X, Trash2,
  Check, CircleCheck, CircleAlert,
  Activity, Moon, Podcast, Play, Heart, Plus, MoreVertical,
  Signal, Wifi, BatteryFull, HeartPulse, Laugh, CirclePlay,
  type LucideProps,
} from 'lucide-react'

const ICON_MAP = {
  Home, Bell, BellDot, Settings, User, UserPlus, Users,
  ChevronDown, ChevronRight, ArrowLeft, X, Trash2,
  Check, CircleCheck, CircleAlert,
  Activity, Moon, Podcast, Play, Heart, Plus, MoreVertical,
  Signal, Wifi, BatteryFull, HeartPulse, Laugh, CirclePlay,
} as const

export type IconName = keyof typeof ICON_MAP

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName
  size?: number
  color?: string
}

export function Icon({ name, size = 24, color = 'var(--text-primary)', ...rest }: IconProps) {
  const LucideIcon = ICON_MAP[name]
  return (
    <LucideIcon
      size={size}
      stroke={color}
      strokeWidth={1.5}
      fill="none"
      {...rest}
    />
  )
}
