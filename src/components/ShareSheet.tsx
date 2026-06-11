import { useState } from 'react'
import { Link2, Check, X } from 'lucide-react'
import { kakaoAvailable, shareKakao } from '@/lib/kakao'
import styles from './ShareSheet.module.css'

export interface ShareSheetProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  link: string
}

export function ShareSheet({ open, onClose, title, description, link }: ShareSheetProps) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  async function handleCopy() {
    setError(null)
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('링크 복사에 실패했어요. 직접 복사해 주세요.')
    }
  }

  async function handleKakao() {
    setError(null)
    try {
      await shareKakao({ title, description, link })
    } catch (e) {
      setError(e instanceof Error ? e.message : '카카오 공유에 실패했어요.')
    }
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <h3>방 공유하기</h3>
          <button className={styles.close} onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewTitle}>{title}</div>
          <div className={styles.previewLink}>{link}</div>
        </div>

        <button className={styles.action} onClick={handleCopy}>
          {copied ? <Check size={18} /> : <Link2 size={18} />}
          {copied ? '링크가 복사됐어요!' : '링크 복사'}
        </button>

        {kakaoAvailable() ? (
          <button className={`${styles.action} ${styles.kakao}`} onClick={handleKakao}>
            <span className={styles.kakaoMark}>K</span>
            카카오톡으로 공유
          </button>
        ) : (
          <p className={styles.hint}>
            카카오 공유는 <code>VITE_KAKAO_JS_KEY</code> 설정 후 쓸 수 있어요. 지금은 링크 복사로
            초대해 주세요.
          </p>
        )}

        {error ? <p className={styles.error}>{error}</p> : null}
      </div>
    </div>
  )
}
