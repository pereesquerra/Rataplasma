import { Navigate } from 'react-router-dom'
import { getUser } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const user = getUser()
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}
