import { useState } from 'react'
import { BodolAvatar } from '@/components/mascot'
import {
  BODOL_COLORS,
  BODOL_EXPRESSIONS,
  BODOL_COLOR_LABEL,
  BODOL_EXPRESSION_LABEL,
  DEFAULT_COLOR,
  DEFAULT_EXPRESSION,
  type BodolColor,
  type BodolExpression,
} from '@/components/mascot/types'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui'
import styles from './ProfileSetup.module.css'

const NICKNAME_MAX = 10

export function ProfileSetup() {
  const { createProfile, signOut } = useAuth()

  const [expression, setExpression] = useState<BodolExpression>(DEFAULT_EXPRESSION)
  const [color, setColor] = useState<BodolColor>(DEFAULT_COLOR)
  const [nickname, setNickname] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trimmed = nickname.trim()
  const valid = trimmed.length > 0 && trimmed.length <= NICKNAME_MAX

  async function handleSubmit() {
    if (!valid || submitting) return
    setError(null)
    setSubmitting(true)
    try {
      await createProfile({ nickname: trimmed, avatar_expression: expression, avatar_color: color })
      // 성공 시 AuthProvider 의 profile 이 채워지며 라우터가 홈으로 보냄
    } catch (e) {
      setError(e instanceof Error ? e.message : '프로필 저장에 실패했어요.')
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.profile}>
      <h2>
        드라마 친구들에게
        <br />
        <span>어떻게 보일까요?</span>
      </h2>
      <p className={styles.desc}>표정과 컬러를 골라 내 보돌이를 만들어요</p>

      <div className={styles.avatarPick}>
        <div className={styles.avatarBig}>
          <BodolAvatar size={72} expression={expression} color={color} />
        </div>
      </div>

      <div className={styles.label}>표정</div>
      <div className={styles.exprGrid}>
        {BODOL_EXPRESSIONS.map((e) => (
          <button
            key={e}
            type="button"
            className={`${styles.dot} ${expression === e ? styles.sel : ''}`}
            onClick={() => setExpression(e)}
            aria-pressed={expression === e}
            aria-label={BODOL_EXPRESSION_LABEL[e]}
            title={BODOL_EXPRESSION_LABEL[e]}
          >
            <BodolAvatar size={38} expression={e} color={color} />
          </button>
        ))}
      </div>

      <div className={styles.label}>컬러</div>
      <div className={styles.colorGrid}>
        {BODOL_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            className={`${styles.dot} ${color === c ? styles.sel : ''}`}
            onClick={() => setColor(c)}
            aria-pressed={color === c}
            aria-label={BODOL_COLOR_LABEL[c]}
            title={BODOL_COLOR_LABEL[c]}
          >
            <BodolAvatar size={38} expression={expression} color={c} />
          </button>
        ))}
      </div>

      <div className={styles.label}>닉네임</div>
      <div className={styles.inputWrap}>
        <input
          className={styles.input}
          value={nickname}
          onChange={(e) => setNickname(e.target.value.slice(0, NICKNAME_MAX))}
          placeholder="밤샘여우"
          maxLength={NICKNAME_MAX}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit()
          }}
        />
        <span className={styles.count}>
          {trimmed.length}/{NICKNAME_MAX}
        </span>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.footer}>
        <Button size="lg" block disabled={!valid || submitting} onClick={handleSubmit}>
          {submitting ? '저장 중…' : '시작하기'}
        </Button>
        <button type="button" className={styles.signout} onClick={() => signOut()}>
          다른 계정으로 로그인
        </button>
      </div>
    </div>
  )
}
