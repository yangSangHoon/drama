import { Bodol } from '@/components/mascot'
import styles from './LoadingScreen.module.css'

/** 전체 화면 로딩 (보돌이가 통통 튀는 중) */
export function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.bounce}>
        <Bodol size={84} title="로딩 중" />
      </div>
      {message ? <p className={styles.msg}>{message}</p> : null}
    </div>
  )
}
