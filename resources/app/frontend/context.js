import { createContext } from 'preact'
import { useContext, useEffect, useMemo, useState } from 'preact/hooks'
import localforage from 'localforage'
import { createRequester } from '../lib'

export const AppContext = createContext({})
export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('Not in AppContext')
  }

  return context
}
export const AppProvider = ({ children }) => {
  const [loading, loadingSet] = useState(true)
  const [user, userSet] = useState()
  const [currentPath, currentPathSet] = useState('/')
  const guest = useMemo(() => !user, [user])
  const userRoles = useMemo(() => user ? user.roles || ['user'] : ['guest'], [user])
  const request = createRequester()
  const safeRequest = async (url, config) => {
    let result

    try {
      result = await request(url, config)
    } catch (error) {
      result = error
    }

    return result
  }
  const get = (url, params) => safeRequest(url, { params })
  const post = (url, data, config = {}) => safeRequest(url, { ...config, data, method: 'post' })
  const allowed = (...roles) => userRoles.some(role => roles.includes(role))
  const login = async credentials => {
    await get('/sanctum/csrf-cookie')

    let result = await post('/api/login', credentials)

    if (result.success) {
      try {
        await localforage.setItem('user', result.data)

        userSet(result.data)
      } catch (e) {
        result = {
          success: false,
          message: e.message || 'Session could not be commited',
        }
      }
    }

    return result
  }
  const logout = async () => {
    let result = await post('/api/logout')

    if (result.success) {
      try {
        await localforage.removeItem('user')

        userSet(null)
      } catch (e) {
        result = {
          success: false,
          message: e.message || 'Session could not be removed',
        }
      }
    }

    return result
  }
  const initializing = async () => {
    try {
      const user = await localforage.getItem('user')

      userSet(user)
    } catch (e) {
      console.log(e.message || 'Session could not be loaded')
    }

    loadingSet(false)
  }

  const value = {
    app: _env,
    user,
    guest,
    loading,
    request,
    safeRequest,
    get,
    post,
    login,
    logout,
    allowed,
    currentPath,
    currentPathSet,
  }

  useEffect(() => {
    initializing()
  }, [])

  return <AppContext.Provider value={value} children={children} />
}
