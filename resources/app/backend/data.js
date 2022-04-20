export const menus = [
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
    path: '/login',
    label: 'Login',
    icon: 'box-arrow-in-right',
    roles: ['guest']
  },
  {
    path: '#',
    label: 'Logout',
    icon: 'box-arrow-right',
    roles: ['user'],
    payload: {"data-logout": true}
  },
]
