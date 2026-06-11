import { useState } from 'react'
import { Bodol } from '@/components/mascot'
import { useAuth, type OAuthProvider } from '@/lib/auth'
import styles from './Login.module.css'

export function Login() {
  const { signIn } = useAuth()
  const [pending, setPending] = useState<OAuthProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSignIn(provider: OAuthProvider) {
    setError(null)
    setPending(provider)
    try {
      await signIn(provider)
      // 성공 시 OAuth 리다이렉트로 페이지를 떠나므로 이후 코드는 실행되지 않음
    } catch (e) {
      setError(e instanceof Error ? e.message : '로그인에 실패했어요. 다시 시도해 주세요.')
      setPending(null)
    }
  }

  return (
    <div className={styles.login}>
      <Bodol size={150} title="같이볼래 보돌이" />
      <h1>
        같이볼래<span>?</span>
      </h1>
      <p className={styles.sub}>
        혼자 보는 드라마,
        <br />
        오늘부터 같이 보는 기분
      </p>

      <button
        className={`${styles.sso} ${styles.kakao}`}
        onClick={() => handleSignIn('kakao')}
        disabled={pending !== null}
      >
        <span className={styles.markKakao}>K</span>
        {pending === 'kakao' ? '카카오 연결 중…' : '카카오로 3초만에 시작'}
      </button>

      {/* Google 로그인: Provider 셋업 후 아래 주석 해제
      <button
        className={`${styles.sso} ${styles.google}`}
        onClick={() => handleSignIn('google')}
        disabled={pending !== null}
      >
        <span className={styles.markGoogle}>G</span>
        {pending === 'google' ? 'Google 연결 중…' : 'Google로 시작하기'}
      </button>
      */}

      {error ? <p className={styles.error}>{error}</p> : null}

      <p className={styles.terms}>
        시작하면 이용약관과 개인정보처리방침에
        <br />
        동의하는 것으로 간주돼요
      </p>
    </div>
  )
}
