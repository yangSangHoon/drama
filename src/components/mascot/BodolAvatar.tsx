import { BodolFace } from './BodolFace'
import {
  BODOL_COLOR_HEX,
  DEFAULT_COLOR,
  DEFAULT_EXPRESSION,
  type BodolColor,
  type BodolExpression,
} from './types'

export interface BodolAvatarProps {
  expression?: BodolExpression
  color?: BodolColor
  /** 픽셀 크기 (정사각형). 기본 40 */
  size?: number
  className?: string
  title?: string
}

/**
 * 보돌이 아바타 = 컬러 원 배경 + 표정.
 * 프로필 아바타, 채팅 메시지, 참여자 목록 등에 사용.
 */
export function BodolAvatar({
  expression = DEFAULT_EXPRESSION,
  color = DEFAULT_COLOR,
  size = 40,
  className,
  title,
}: BodolAvatarProps) {
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
      <circle cx="50" cy="52" r="46" fill={BODOL_COLOR_HEX[color]} />
      <BodolFace expression={expression} />
    </svg>
  )
}
