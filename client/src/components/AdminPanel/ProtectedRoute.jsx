import { useEffect, useState } from 'react'
import { isAuthenticated } from '../../utils/auth'
import LoginForm from './LoginForm'

/**
 * Компонент для защиты маршрутов админ панели
 */
export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsAuth(authenticated)
      setIsChecking(false)
    }

    checkAuth()

    // Проверка аутентификации каждые 30 секунд
    const interval = setInterval(checkAuth, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleLogin = (success) => {
    setIsAuth(success)
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка доступа...</p>
        </div>
      </div>
    )
  }

  if (!isAuth) {
    return <LoginForm onLogin={handleLogin} />
  }

  return children
}