import clsx from 'clsx'
import Icon from './icon'

export const ListNav = ({ currentPath, end, label, class: cls, items = [] }) => (
  <ul class={cls} aria-label={label}>
    {items.map(item => <ListNavItem item={item} end={end} currentPath={currentPath} />)}
  </ul>
)
const ListNavItem = ({ currentPath, end, item: { path, label, icon, items = [] } = {} }) => {
  const hasChild = items?.length > 0
  const active = currentPath === path

  return (
    <li class={clsx('nav-item', hasChild && 'dropdown')}>
      <ListNavLink active={active} icon={icon} label={label} path={path} dropdown={hasChild} />
      {hasChild && (
        <ListDropdown currentPath={currentPath} items={items} label={label} end={end} />
      )}
    </li>
  )
}
const ListNavLink = ({ active, dropdown, path, label, icon }) => {
  return (
    <a
      href={path}
      class={clsx('nav-link', active && 'active', dropdown && 'dropdown-toggle')}
      aria-current={active ? 'page' : null}
      aria-expanded={dropdown ? 'false' : null}
      role={dropdown ? 'button' : null}
      data-bs-toggle={dropdown ? 'dropdown' : null}>
      {icon && <Icon icon={icon} />} {label}
    </a>
  )
}

export const ListDropdown = ({ currentPath, label, end, class: cls, items = []}) => (
  <ul class={clsx('dropdown-menu', end && 'dropdown-menu-end', cls)} aria-label={label}>
    {items.map(item => <ListDropdownItem currentPath={currentPath} item={item} />)}
  </ul>
)

const ListDropdownItem = ({ currentPath, item: { path, label, icon } = {} }) => (
  <li>
    <a
      href={path}
      class={clsx('dropdown-item', currentPath === path && 'active')}
      aria-current={currentPath === path && 'page'}>
      {icon && <Icon icon={icon} />} {label}
    </a>
  </li>
)
