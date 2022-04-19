import Router from 'preact-router'
import { useEffect } from 'preact/hooks'
import { createHashHistory } from 'history'
import { withContext } from './hoc'
import Pages from './pages'

export default withContext(({ app: { loading, currentPathSet } }) => {
  const history = createHashHistory()
  const handleChange = e => currentPathSet(e.url)

  useEffect(() => {
    const ref = document.querySelector('.loading-awesome')

    if (loading) {
      ref.classList.remove('d-none')
    } else {
      ref.classList.add('d-none')
    }
  }, [loading])

  if (loading) {
    return null
  }

  return (
    <Router history={history} onChange={handleChange}>
      <Pages default />
    </Router>
  )
})
