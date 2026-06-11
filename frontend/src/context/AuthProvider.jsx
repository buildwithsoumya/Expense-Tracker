import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import { loginUser, registerUser } from '../services/authService'

const extractToken = (data) => data?.access_token ?? data?.token ?? data?.jwt

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const handleAuthSuccess = useCallback((data) => {
    const nextToken = extractToken(data)
    if (nextToken) {
      localStorage.setItem('token', nextToken)
      setToken(nextToken)
    }
    return nextToken
  }, [])

  const login = useCallback(
    async (payload) => {
      const data = await loginUser(payload)
      handleAuthSuccess(data)
      return data
    },
    [handleAuthSuccess],
  )

  const register = useCallback(async (payload) => {
    const data = await registerUser(payload)
    handleAuthSuccess(data)
    return data
  }, [handleAuthSuccess])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: isTokenValid(token),
      isLoading: false,
      login,
      register,
      logout,
    }),
    [token, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
