import { createContext } from 'preact'
import { useState, useContext as useContextBase, useMemo, useEffect } from 'preact/hooks'
import { createHashHistory } from 'history'
import axios from 'axios'
import { confirm, Toast } from './lib/alert'
import FormLogin from './components/form-login'

const AppContext = createContext()

/** @type {import('./d').useContext} */
export const useContext = () => useContextBase(AppContext)

export const withContext = Component => props => {
  const ctx = useContext()

  if (!ctx) {
    throw Error('Context in Non Context?')
  }

  if (!ctx.authorized) {
    return <FormLogin login={ctx.login} />
  }

  return <Component ctx={ctx} {...props} />
}

export default ({ children }) => {
  const app = window.app || { name: 'EApps' }
  const [user, userSet] = useState(app.user)
  const [menu, menuSet] = useState()
  const [activePath, activePathSet] = useState('')
  const authorized = useMemo(() => user && user.name, [user])
  const requestController = new AbortController()
  const history = createHashHistory()
  const request = (() => {
    const req = axios.create({
      withCredentials: true,
      signal: requestController.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    req.interceptors.response.use(
      response => {
        const { success = true, message, data, errors } = response.data || {}

        return {
          success,
          data,
          errors,
          response,
          message: message || response.statusText,
        }
      },
      error => {
        const { success = false, message, data, errors } = error.response.data || {}

        return Promise.resolve({
          success,
          data,
          errors,
          error,
          message: message || error.response.statusText,
        })
      },
    )

    return req
  })()
  const requestC = (config, controlGroup) => {
    const control = controlGroup || new AbortController()
    const result = request({ ...config, signal: control.signal })
    const abort = (reason) => control.abort(reason)

    return { result, control, abort }
  }
  const login = async (payload, onError = result => null) => {
    const result = await request.post('/api/login', payload)

    if (result.success && result.data) {
      userSet(result.data)
    } else {
      onError(result)
    }
  }
  const logout = async () => {
    const { isConfirmed, value: { message: title } = {} } = await confirm(
      () => request.post('/api/logout'),
    )

    if (isConfirmed) {
      userSet(null)

      Toast.fire({
        title,
        icon: 'info',
      })
    }
  }
  const loadMenu = async force => {
    if (menu && !force) {
      return
    }

    const { data } = await request('/api/menu', {
      params: {
        groups: ['db', 'ac'],
      },
    })

    menuSet(data)
  }
  const setActivePath = path => activePathSet(path)
  const value = {
    app,
    user,
    menu,
    authorized,
    request,
    requestController,
    activePath,
    history,
    requestC,
    setActivePath,
    login,
    logout,
    loadMenu,
  }

  useEffect(() => {
    const handleClick = ev => {
      if ('A' === ev.target.nodeName) {
          if ('logout' === ev.target.dataset.confirm) {
            ev.preventDefault()
            ev.stopPropagation()
            logout()
          }
      }
    }

    request('/sanctum/csrf-cookie')
    document.addEventListener('click', handleClick)

    return () => {
      requestController.abort('refreshing app')
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <AppContext.Provider
      value={value}
      children={children}
      />
  )
}
