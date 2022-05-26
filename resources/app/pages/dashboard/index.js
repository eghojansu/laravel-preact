import Router from 'preact-router'
import RoutePage from 'preact-async-route'
import { useEffect, useRef } from 'preact/hooks'
import { trimStart } from 'lodash'
import { withContext } from '../../context'
import { LoadingFull } from '../../components/alert'
import NavNavbar from '../../components/nav-navbar'
import NavTree from '../../components/nav-tree'
import NotFoundPage from './404'
import HomePage from './home'

const basePath = '/dashboard'
const path = path => basePath + (path ? `/${trimStart(path, '/')}` : '')
const loadModule = name => module => module[name || 'default']

export default withContext(({
  ctx: {
    app,
    menu,
    activePath,
    loadMenu,
  },
}) => {
  const offcanvas = useRef()

  useEffect(() => {
    const handleClick = ev => {
      if (ev.target.closest('.offcanvas-body')) {
        if (!offcanvas.current) {
          offcanvas.current = bootstrap.Offcanvas.getInstance(ev.target.closest('.offcanvas'))
        }

        if (!ev.target.closest('[data-bs-toggle]')) {
          offcanvas.current.toggle()
        }
      }
    }

    loadMenu()

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  if (!menu) {
    return <LoadingFull />
  }

  return (
    <div>
      <header class="main-header navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <nav class="container-fluid">
          <button class="navbar-toggler d-block me-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#sideMenu" aria-controls="sideMenu" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <a class="navbar-brand" href="/">{app.name}</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <NavNavbar base={basePath} activeUrl={activePath} items={menu.ac} end={true} />
          </div>
        </nav>
      </header>
      <nav class="offcanvas offcanvas-start" tabindex="-1" id="sideMenu" aria-labelledby="sideMenuLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="sideMenuLabel">{app.name}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body px-0">
          <NavTree base={basePath} activeUrl={activePath} items={menu.db} />
        </div>
      </nav>
      <main class="main-content p-3">
        <Router>
          <HomePage path={path()} />
          <RoutePage path={path('adm/user')} getComponent={() => import('./adm/user').then(loadModule())} />
          <NotFoundPage default />
        </Router>
      </main>
    </div>
  )
})
