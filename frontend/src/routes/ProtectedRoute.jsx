import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Loader from '../components/Loader'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loader label="Authenticating" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
