/** 보돌이 표정 6종 (DB: profiles.avatar_expression) */
export type BodolExpression = 'smile' | 'wink' | 'cry' | 'angry' | 'heart' | 'surprise'

/** 보돌이 아바타 컬러 5종 (DB: profiles.avatar_color) */
export type BodolColor = 'coral' | 'lavender' | 'butter' | 'mint' | 'sky'

export const BODOL_EXPRESSIONS: BodolExpression[] = [
  'smile',
  'wink',
  'cry',
  'angry',
  'heart',
  'surprise',
]

export const BODOL_COLORS: BodolColor[] = ['coral', 'lavender', 'butter', 'mint', 'sky']

/** 아바타 배경 원 컬러 (시안 기준 hex) */
export const BODOL_COLOR_HEX: Record<BodolColor, string> = {
  coral: '#FF8A77',
  lavender: '#9B8CFF',
  butter: '#FFD66B',
  mint: '#5ED5B8',
  sky: '#7FB5FF',
}

/** 표정 한글 라벨 (프로필 설정 UI 등) */
export const BODOL_EXPRESSION_LABEL: Record<BodolExpression, string> = {
  smile: '스마일',
  wink: '윙크',
  cry: '울음',
  angry: '화남',
  heart: '하트눈',
  surprise: '놀람',
}

/** 컬러 한글 라벨 */
export const BODOL_COLOR_LABEL: Record<BodolColor, string> = {
  coral: '코랄',
  lavender: '라벤더',
  butter: '버터',
  mint: '민트',
  sky: '스카이',
}

export const DEFAULT_EXPRESSION: BodolExpression = 'smile'
export const DEFAULT_COLOR: BodolColor = 'coral'
