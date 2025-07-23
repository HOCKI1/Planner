/**
 * Утилиты для работы с аутентификацией админ панели
 */

/**
 * Проверяет, аутентифицирован ли пользователь
 * @returns {boolean} true если пользователь аутентифицирован
 */
export function isAuthenticated() {
  try {
    const sessionData = localStorage.getItem('adminSession')
    if (!sessionData) return false

    const session = JSON.parse(sessionData)
    const now = Date.now()

    // Проверяем валидность сессии
    return session.isAuthenticated && (now - session.loginTime) < session.timeout
  } catch (error) {
    console.error('Ошибка при проверке аутентификации:', error)
    return false
  }
}

/**
 * Очищает сессию пользователя
 */
export function clearSession() {
  localStorage.removeItem('adminSession')
}

/**
 * Получает данные текущей сессии
 * @returns {object|null} данные сессии или null
 */
export function getSessionData() {
  try {
    const sessionData = localStorage.getItem('adminSession')
    return sessionData ? JSON.parse(sessionData) : null
  } catch (error) {
    console.error('Ошибка при получении данных сессии:', error)
    return null
  }
}

/**
 * Проверяет учетные данные пользователя
 * @param {string} username - логин
 * @param {string} password - пароль
 * @returns {Promise<boolean>} результат проверки
 */
export async function validateCredentials(username, password) {
  try {
    const response = await fetch('/admin-config.json')
    const config = await response.json()
    
    return username === config.admin.username && password === config.admin.password
  } catch (error) {
    console.error('Ошибка при проверке учетных данных:', error)
    return false
  }
}

/**
 * Создает новую сессию
 * @param {number} timeout - время жизни сессии в миллисекундах
 */
export function createSession(timeout = 3600000) {
  const sessionData = {
    isAuthenticated: true,
    loginTime: Date.now(),
    timeout
  }
  localStorage.setItem('adminSession', JSON.stringify(sessionData))
}