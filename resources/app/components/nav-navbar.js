import clsx from 'clsx'
import { trimEnd, trimStart } from 'lodash'

const NavLink = ({
  item: { url, icon, label, menuid: id, attrs },
  dropdown,
  base,
  parent,
  activeUrl,
}) => {
  const href = url ? trimEnd(`#${base}/${trimStart(url || '', '/')}`, '/') : '#'
  const active = activeUrl === href.slice(1)
  const props = {
    ...(attrs || {}),
    id,
    href,
    class: clsx(
      attrs?.class,
      dropdown ? 'dropdown-item' : 'nav-link',
      parent && 'dropdown-toggle',
      active && 'active',
    ),
    'aria-current': active ? 'page' : null,
    ...(parent ? {
      href: '#',
      role: 'button',
      'data-bs-toggle': 'dropdown',
      'aria-expanded': 'false',
    } : {}),
  }

  return (
    <a {...props}>{icon && <i class={`bi-${icon}`}></i>} {label}</a>
  )
}
const NavItemDropdown = ({ item, base, activeUrl }) => {
  if ('--sep' === item.label) {
    return (
      <li><hr class="dropdown-divider" /></li>
    )
  }

  return (
    <li>
      <NavLink
        item={item}
        base={base}
        activeUrl={activeUrl}
        dropdown={true}
        parent={false} />
    </li>
  )
}
const NavItem = ({
  item: { items, ...item },
  base,
  activeUrl,
  end,
}) => {
  const hasChildren = items?.length > 0

  return (
    <li class={clsx('nav-item', hasChildren && 'dropdown')}>
      <NavLink item={item} base={base} activeUrl={activeUrl} parent={hasChildren} />
      {hasChildren && (
        <ul class={clsx('dropdown-menu', end && 'dropdown-menu-end')} aria-labelledby={item.id}>
          {items.map(item => (
            <NavItemDropdown
              key={item.id}
              item={item}
              base={base}
              activeUrl={activeUrl} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default ({
  items,
  end,
  base = '',
  activeUrl,
}) => (
  <ul class={clsx('navbar-nav mb-2 mb-lg-0', end && 'ms-auto')}>
    {items.map(item => (
      <NavItem
        key={item.id}
        item={item}
        base={base}
        activeUrl={activeUrl}
        end={end} />
    ))}
  </ul>
)
