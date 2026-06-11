import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'
import { LoadingScreen } from '@/components/ui'
import { Login } from '@/pages/Login'
import { ProfileSetup } from '@/pages/ProfileSetup'
import { RoomList } from '@/pages/RoomList'
import { CreateRoom } from '@/pages/CreateRoom'
import { RoomPlaceholder } from '@/pages/RoomPlaceholder'
import { DesignSystem } from '@/pages/DesignSystem'
import type { ReactElement } from 'react'

/**
 * 인증 상태에 따른 라우팅.
 * - 비로그인        → /login
 * - 로그인·프로필 없음 → /onboarding
 * - 로그인·프로필 있음 → /
 */
function AppRoutes() {
  const { loading, session, profile } = useAuth()

  if (loading) return <LoadingScreen message="불러오는 중…" />

  const authed = !!session
  const onboarded = authed && !!profile

  // 로그인 + 프로필 완료 시에만 접근 가능 (아니면 적절한 단계로 보냄)
  const protect = (el: ReactElement): ReactElement => {
    if (!authed) return <Navigate to="/login" replace />
    if (!onboarded) return <Navigate to="/onboarding" replace />
    return el
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!authed ? <Login /> : <Navigate to={onboarded ? '/' : '/onboarding'} replace />}
      />
      <Route
        path="/onboarding"
        element={
          !authed ? (
            <Navigate to="/login" replace />
          ) : onboarded ? (
            <Navigate to="/" replace />
          ) : (
            <ProfileSetup />
          )
        }
      />

      <Route path="/" element={protect(<RoomList />)} />
      <Route path="/rooms/new" element={protect(<CreateRoom />)} />
      <Route path="/rooms/:id" element={protect(<RoomPlaceholder />)} />

      {/* 디자인 시스템 쇼케이스 (인증 불필요) */}
      <Route path="/design" element={<DesignSystem />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
