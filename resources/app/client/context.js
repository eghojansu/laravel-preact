import { createContext } from 'preact'
import { useContext, useEffect, useMemo, useState } from 'preact/hooks'

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
  const allowed = (...roles) => userRoles.some(role => roles.includes(role))
  const initializing = async () => {
    loadingSet(false)
  }

  const value = {
    app: _env,
    user,
    guest,
    loading,
    allowed,
    currentPath,
    currentPathSet,
  }

  useEffect(() => {
    initializing()
  }, [])

  return <AppContext.Provider value={value} children={children} />
}
