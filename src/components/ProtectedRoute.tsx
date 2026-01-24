import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const is_authenticated = useAuthStore((state) => state.is_authenticated)
  const location = useLocation()

  if (!is_authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
