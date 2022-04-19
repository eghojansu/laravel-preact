import { withContext } from '../hoc'
import { ListNav } from '../components/list'

export default withContext(({
  app: {
    app,
    currentPath,
  },
}) => {
  const items = [
    {
      path: '/',
      label: 'Home',
      icon: 'house-door',
    },
    {
      path: '/about',
      label: 'About',
      icon: 'info-circle',
    },
    {
      path: '#',
      label: 'Test',
      items: [
        {
          path: '/xx',
          label: 'XXX',
        },
        {
          path: '/xxx',
          label: 'XXXX',
        },
      ],
    }
  ]

  return (
    <div class="min-vh-100">
      <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">{app.name}</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mainNav">
            <ListNav class="navbar-nav ms-auto mb-2 mb-lg-0" end={true} items={items} currentPath={currentPath} />
          </div>
        </div>
      </nav>

      <div class="page-spacer px-2">
        Content
      </div>
    </div>
  )
})
