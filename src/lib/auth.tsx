import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Profile } from './database.types'
import type { BodolColor, BodolExpression } from '@/components/mascot/types'

export type OAuthProvider = 'google' | 'kakao'

export interface ProfileDraft {
  nickname: string
  avatar_expression: BodolExpression
  avatar_color: BodolColor
}

interface AuthContextValue {
  /** 초기 세션 + 프로필 로딩 중 여부 */
  loading: boolean
  session: Session | null
  user: User | null
  /** 프로필 미설정 시 null (→ 온보딩 필요) */
  profile: Profile | null
  signIn: (provider: OAuthProvider) => Promise<void>
  signOut: () => Promise<void>
  /** 온보딩에서 프로필 최초 생성 */
  createProfile: (draft: ProfileDraft) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('[auth] 프로필 조회 실패:', error.message)
    return null
  }
  return (data as Profile) ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    let active = true

    // 1) 현재 세션 확인 + 프로필 로드
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      const s = data.session
      setSession(s)
      if (s?.user) {
        setProfile(await fetchProfile(s.user.id))
      }
      if (active) setLoading(false)
    })

    // 2) 로그인/로그아웃 변화 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (!active) return
      setSession(s)
      if (s?.user) {
        setProfile(await fetchProfile(s.user.id))
      } else {
        setProfile(null)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (provider: OAuthProvider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }, [])

  const createProfile = useCallback(
    async (draft: ProfileDraft) => {
      const userId = session?.user?.id
      if (!userId) throw new Error('로그인 세션이 없습니다.')

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          nickname: draft.nickname,
          avatar_expression: draft.avatar_expression,
          avatar_color: draft.avatar_color,
        })
        .select()
        .single()

      if (error) throw error
      setProfile(data as Profile)
    },
    [session],
  )

  const value: AuthContextValue = {
    loading,
    session,
    user: session?.user ?? null,
    profile,
    signIn,
    signOut,
    createProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth 는 AuthProvider 안에서만 사용할 수 있습니다.')
  return ctx
}
