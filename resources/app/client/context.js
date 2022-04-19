import { createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export const AppContext = createContext({})
export const AppUse = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('Not in AppContext')
  }

  return context
}
export const AppProvider = ({ children }) => {
  const [loading, loadingSet] = useState(true)
  const [currentPath, currentPathSet] = useState('/')
  const initializing = async () => {
    loadingSet(false)
  }

  const value = {
    app: _env,
    loading,
    currentPath,
    currentPathSet,
  }

  useEffect(() => {
    initializing()
  }, [])

  return <AppContext.Provider value={value} children={children} />
}
