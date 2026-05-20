import { type ReactNode, type CSSProperties } from 'react'

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'body'
  | 'body-strong'
  | 'small'
  | 'small-strong'
  | 'caption'

type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'danger' | 'disabled'

type TextAs = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'label'

interface TextProps {
  variant?: TextVariant
  color?: TextColor
  as?: TextAs
  children: ReactNode
  style?: CSSProperties
}

const VARIANT_STYLES: Record<TextVariant, CSSProperties> = {
  'h1':           { fontWeight: 700, fontSize: '24px', lineHeight: 1.3 },
  'h2':           { fontWeight: 700, fontSize: '20px', lineHeight: 1.3 },
  'h3':           { fontWeight: 700, fontSize: '18px', lineHeight: 1.3 },
  'title':        { fontWeight: 700, fontSize: '20px', lineHeight: 1.4 },
  'body':         { fontWeight: 400, fontSize: '16px', lineHeight: 1.5 },
  'body-strong':  { fontWeight: 700, fontSize: '16px', lineHeight: 1.5 },
  'small':        { fontWeight: 400, fontSize: '14px', lineHeight: 1.4 },
  'small-strong': { fontWeight: 500, fontSize: '14px', lineHeight: 1.4 },
  'caption':      { fontWeight: 500, fontSize: '12px', lineHeight: 1.4 },
}

const COLOR_MAP: Record<TextColor, string> = {
  primary:   'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  tertiary:  'var(--text-disabled)',
  inverse:   'var(--button-secondary-default)',
  danger:    'var(--system-error-primary)',
  disabled:  'var(--text-disabled)',
}

export function Text({
  variant = 'body',
  color = 'primary',
  as: Tag = 'p',
  children,
  style,
}: TextProps) {
  return (
    <Tag
      style={{
        margin: 0,
        padding: 0,
        fontFamily: 'var(--font-sans)',
        color: COLOR_MAP[color],
        ...VARIANT_STYLES[variant],
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
