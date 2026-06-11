import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** 좌측 아이콘 (lucide-react 아이콘 등) */
  leftIcon?: ReactNode
  /** 폭 100% */
  block?: boolean
}

/** 알약형 기본 버튼. coral CTA가 기본. */
export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  block,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    block ? styles.block : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={cls} {...rest}>
      {leftIcon}
      {children}
    </button>
  )
}
