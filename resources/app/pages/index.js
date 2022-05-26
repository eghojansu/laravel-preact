import Router from 'preact-router'
import { useContext } from '../context'
import HomePage from './home'
import NotFoundPage from './404'
import DashboardPage from './dashboard'

export default () => {
  const { setActivePath, history } = useContext()
  const handleChange = e => setActivePath(e.url)

  return (
    <Router history={history} onChange={handleChange}>
      <HomePage path="/" />
      <DashboardPage path="/dashboard/:pages*" />
      <NotFoundPage default />
    </Router>
  )
}
