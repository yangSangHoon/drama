import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'
import { LoadingScreen } from '@/components/ui'
import { Login } from '@/pages/Login'
import { ProfileSetup } from '@/pages/ProfileSetup'
import { Home } from '@/pages/Home'
import { DesignSystem } from '@/pages/DesignSystem'

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

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !authed ? <Login /> : <Navigate to={onboarded ? '/' : '/onboarding'} replace />
        }
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
      <Route
        path="/"
        element={
          !authed ? (
            <Navigate to="/login" replace />
          ) : !onboarded ? (
            <Navigate to="/onboarding" replace />
          ) : (
            <Home />
          )
        }
      />

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
