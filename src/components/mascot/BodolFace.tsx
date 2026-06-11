import type { BodolExpression } from './types'

const INK = '#3B3037'

/**
 * 보돌이 얼굴 표정 6종.
 * viewBox "0 0 100 100" 안에서 얼굴 영역(중심 ≈ 50,54)에 그려진다.
 * 시안 watch-together-design.html 의 <defs> 좌표를 그대로 옮긴 것.
 */
export function BodolFace({ expression }: { expression: BodolExpression }) {
  switch (expression) {
    case 'wink':
      return (
        <>
          <circle cx="38" cy="48" r="5" fill={INK} />
          <path d="M55 48 Q62 43 69 48" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
          <ellipse cx="28" cy="60" rx="6" ry="4" fill="#FFFFFF" opacity=".55" />
          <ellipse cx="72" cy="60" rx="6" ry="4" fill="#FFFFFF" opacity=".55" />
          <path d="M43 60 Q50 67 57 60" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )
    case 'cry':
      return (
        <>
          <path d="M32 49 Q38 44 44 49" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M56 49 Q62 44 68 49" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
          <ellipse cx="36" cy="58" rx="3.2" ry="5" fill="#8FD2FF" />
          <ellipse cx="64" cy="58" rx="3.2" ry="5" fill="#8FD2FF" />
          <path d="M43 67 Q50 61 57 67" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )
    case 'angry':
      return (
        <>
          <line x1="30" y1="40" x2="43" y2="44" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="70" y1="40" x2="57" y2="44" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="38" cy="51" r="4.6" fill={INK} />
          <circle cx="62" cy="51" r="4.6" fill={INK} />
          <path d="M43 66 Q50 61 57 66" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )
    case 'heart':
      return (
        <>
          <path
            d="M38 54 C32 49 30 44 34 41.5 C36.5 40 38 42.5 38 44 C38 42.5 39.5 40 42 41.5 C46 44 44 49 38 54 Z"
            fill="#FF4D6D"
          />
          <path
            d="M62 54 C56 49 54 44 58 41.5 C60.5 40 62 42.5 62 44 C62 42.5 63.5 40 66 41.5 C70 44 68 49 62 54 Z"
            fill="#FF4D6D"
          />
          <path d="M42 60 Q50 69 58 60" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )
    case 'surprise':
      return (
        <>
          <circle cx="38" cy="48" r="5.5" fill={INK} />
          <circle cx="62" cy="48" r="5.5" fill={INK} />
          <ellipse cx="28" cy="59" rx="6" ry="4" fill="#FFFFFF" opacity=".55" />
          <ellipse cx="72" cy="59" rx="6" ry="4" fill="#FFFFFF" opacity=".55" />
          <ellipse cx="50" cy="64" rx="5" ry="6.5" fill={INK} />
        </>
      )
    case 'smile':
    default:
      return (
        <>
          <circle cx="38" cy="48" r="5" fill={INK} />
          <circle cx="62" cy="48" r="5" fill={INK} />
          <ellipse cx="28" cy="60" rx="6" ry="4" fill="#FFFFFF" opacity=".55" />
          <ellipse cx="72" cy="60" rx="6" ry="4" fill="#FFFFFF" opacity=".55" />
          <path d="M43 60 Q50 67 57 60" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )
  }
}
