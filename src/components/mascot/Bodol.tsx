import { BodolFace } from './BodolFace'
import { DEFAULT_EXPRESSION, type BodolExpression } from './types'

export interface BodolProps {
  /** 몸통 색 (기본 코랄 #FF6B57 — 로고용) */
  bodyColor?: string
  expression?: BodolExpression
  /** 픽셀 크기 (정사각형). 기본 100 */
  size?: number
  className?: string
  title?: string
}

const INK = '#3B3037'

/**
 * 보돌이 마스코트 (말랑한 TV 캐릭터, 전신).
 * 로고 · 로그인 · 빈 화면(empty state) · 로딩에 사용.
 * 시안 watch-together-design.html 의 #bodol <defs> 를 컴포넌트화.
 */
export function Bodol({
  bodyColor = '#FF6B57',
  expression = DEFAULT_EXPRESSION,
  size = 100,
  className,
  title,
}: BodolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}

      {/* 안테나 */}
      <line x1="38" y1="22" x2="28" y2="6" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <line x1="62" y1="22" x2="72" y2="6" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle cx="27" cy="5" r="5" fill="#FFD66B" />
      <circle cx="73" cy="5" r="5" fill="#FFD66B" />

      {/* 몸통 */}
      <rect x="8" y="20" width="84" height="68" rx="22" fill={bodyColor} />

      {/* 화면(얼굴 영역) */}
      <rect x="17" y="29" width="66" height="50" rx="15" fill="#FFF9F2" />

      {/* 표정 */}
      <BodolFace expression={expression} />

      {/* 발 */}
      <rect x="26" y="86" width="10" height="9" rx="5" fill={bodyColor} />
      <rect x="64" y="86" width="10" height="9" rx="5" fill={bodyColor} />
    </svg>
  )
}
