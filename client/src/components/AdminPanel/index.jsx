import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  IconArrowLeft,
  IconFolder,
  IconChartBar,
  IconSettings,
  IconLayoutSidebar,
  IconDeviceFloppy,
  IconTrashX,
  IconRefresh,
  IconLogout
} from '@tabler/icons-react'
import Categories from './Categories'
import Sections from './Sections'
import LoginForm from './LoginForm'

// Импорт утилит для работы с локальным хранилищем
import { saveAdminData, loadAdminData, resetAdminData } from '../../utils/db'

import { useStore } from '../../state'
import styles from './AdminPanel.module.css'

export default function AdminPanel() {
  // Состояние аутентификации
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Локальное состояние для текущей активной секции
  const [activeSection, setActiveSection] = useState('sections')

  // Получаем категории и секции из глобального состояния + сеттеры
  const { categories, sections, setCategories, setSections, loadInitialData } = useStore()

  // Проверка аутентификации при загрузке компонента
  useEffect(() => {
    checkAuthentication()
  }, [])

  // Автоматическая синхронизация при успешной аутентификации
  useEffect(() => {
    if (isAuthenticated) {
      handleAutoSync()
    }
  }, [isAuthenticated])

  const checkAuthentication = () => {
    try {
      const sessionData = localStorage.getItem('adminSession')
      if (sessionData) {
        const session = JSON.parse(sessionData)
        const now = Date.now()

        // Проверка, не истекла ли сессия
        if (session.isAuthenticated && (now - session.loginTime) < session.timeout) {
          setIsAuthenticated(true)
        } else {
          // Сессия истекла
          localStorage.removeItem('adminSession')
          setIsAuthenticated(false)
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке аутентификации:', error)
      setIsAuthenticated(false)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleLogin = (success) => {
    setIsAuthenticated(success)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    setIsAuthenticated(false)
    toast.info('Вы вышли из системы')
  }

  // Автоматическая синхронизация при входе
  const handleAutoSync = async () => {
    try {
      toast.info('Синхронизация данных...')
      await loadInitialData()
      toast.success('Данные синхронизированы с data.json')
    } catch (error) {
      console.error('Ошибка автоматической синхронизации:', error)
      toast.error('Ошибка при синхронизации данных')
    }
  }

  const loadSavedData = async () => {
    try {
      const savedData = await loadAdminData();
      if (savedData) {
        if (savedData.categories) setCategories(savedData.categories);
        if (savedData.sections) setSections(savedData.sections);
        toast.success('Локальные настройки загружены');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Ошибка загрузки локальных настроек');
    }
  };

  // Обработчик сохранения текущих настроек
  const handleSave = async () => {
    try {
      await saveAdminData({
        categories,
        sections
      });
      toast.success('Настройки сохранены локально');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Ошибка сохранения настроек');
    }
  }

  // Обработчик сброса настроек
  const handleReset = async () => {
    if (window.confirm('Вы уверены, что хотите сбросить все настройки? Это действие нельзя отменить.')) {
      try {
        await resetAdminData();
        window.location.reload();
      } catch (error) {
        console.error('Error resetting settings:', error);
        toast.error('Ошибка сброса настроек');
      }
    }
  }

  // Обработчик синхронизации с data.json
  const handleSyncFromJson = async () => {
    try {
      await loadInitialData();
      toast.success('Данные синхронизированы с data.json!');
    } catch (error) {
      console.error('Error syncing from data.json:', error);
      toast.error('Ошибка синхронизации с data.json');
    }
  }

  // сохранение данных в файл через сервер
  const saveDataToServer = async () => {
    try {
      const jsonData = { categories, sections };

      const response = await fetch('/api/save_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Server response:', result);

      toast.success('Настройки сохранены на сервер!');

      // После успешного сохранения на сервер, также сохраняем локально
      await handleSave();

    } catch (error) {
      console.error('Error saving to server:', error);
      toast.error('Ошибка сохранения на сервер');
    }
  }

  // Показываем загрузку во время проверки аутентификации
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка доступа...</p>
        </div>
      </div>
    )
  }

  // Показываем форму входа, если не аутентифицирован
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className={styles.container}>
      {/* Сайдбар с навигацией */}
      <div className={styles.leftpanel}>
        <div className={styles.sidebarHeader}>
          {/* Кнопка "назад" в планировщик */}
          <Link to="/" className={styles.backButton}>
            <IconArrowLeft size={20} />
            Назад к планировщику
          </Link>
        </div>

        {/* Навигация по разделам админки */}
        <div className={styles.sidebarNav}>
          <button
            className={`${styles.navButton} ${activeSection === 'sections' ? styles.active : ''}`}
            onClick={() => setActiveSection('sections')}
          >
            <IconLayoutSidebar size={20} />
            Секции
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'categories' ? styles.active : ''}`}
            onClick={() => setActiveSection('categories')}
          >
            <IconFolder size={20} />
            Категории
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'statistics' ? styles.active : ''}`}
            onClick={() => setActiveSection('statistics')}
          >
            <IconChartBar size={20} />
            Статистика
          </button>
          <button
            className={`${styles.navButton} ${activeSection === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            <IconSettings size={20} />
            Настройки
          </button>
        </div>

        {/* Кнопки управления */}
        <div className="mt-auto p-4 space-y-2">
          <button
            onClick={handleSyncFromJson}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <IconRefresh size={20} />
            Синхронизация
          </button>
          <button
            onClick={loadSavedData}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <IconDeviceFloppy size={20} />
            Загрузить локальные
          </button>
          <button
            onClick={saveDataToServer}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <IconDeviceFloppy size={20} />
            Сохранить на сервер
          </button>
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <IconDeviceFloppy size={20} />
            Сохранить локально
          </button>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <IconTrashX size={20} />
            Сбросить настройки
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <IconLogout size={20} />
            Выйти
          </button>
        </div>
      </div>

      {/* Основная область контента в зависимости от выбранного раздела */}
      <div className={styles.mainContent}>
        {activeSection === 'sections' && <Sections />}
        {activeSection === 'categories' && <Categories />}
        {/* Статистика и настройки можно реализовать позже */}
        {activeSection === 'statistics' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-600">Статистика</h2>
            <p className="text-gray-500 mt-4">Скоро будет доступно...</p>
          </div>
        )}
        {activeSection === 'settings' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-600">Настройки</h2>
            <p className="text-gray-500 mt-4">Скоро будет доступно...</p>
          </div>
        )}
      </div>
    </div>
  )
}