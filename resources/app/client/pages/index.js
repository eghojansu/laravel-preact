import { useEffect, useState } from 'preact/hooks'
import Router from 'preact-router'
import { withAppContext } from '../hoc'
import { ListNav } from '../components/list'
import { menus } from '../data'
import HomePage from './home'
import LoginPage from './login'
import AboutPage from './about'
import NotFoundPage from './404'

export default withAppContext(({
  app: {
    app,
    guest,
    allowed,
    currentPath,
  },
}) => {
  const [items, itemsSet] = useState()
  const allowMenu = item => !item.roles || allowed(...item.roles)
  const filterMenu = menus => menus.filter(menu => (
    menu.items && menu.items.filter(filterMenu).length > 0
  ) || allowMenu(menu))

  useEffect(() => {
    itemsSet(filterMenu(menus))
  }, [guest])

  return (
    <div class="min-vh-100">
      <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">{app.name}</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mainNav">
            <ListNav
              class="navbar-nav ms-auto mb-2 mb-lg-0"
              end={true}
              items={items}
              currentPath={currentPath} />
          </div>
        </div>
      </nav>

      <div class="page-spacer px-2">
        <Router>
          <HomePage path="/" />
          <LoginPage path="/login" />
          <AboutPage path="/about" />
          <NotFoundPage default />
        </Router>
      </div>
    </div>
  )
})
