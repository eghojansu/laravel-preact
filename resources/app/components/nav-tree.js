import clsx from 'clsx'
import { trimStart, trimEnd } from 'lodash'

const NavLink = ({
  item: { url, icon, label, menuid: id, attrs },
  base,
  parent,
  activeUrl,
  groupId,
}) => {
  const href = url ? trimEnd(`#${base}/${trimStart(url || '', '/')}`, '/') : '#'
  const active = activeUrl === href.slice(1)
  const props = {
    ...(attrs || {}),
    id,
    href,
    class: clsx(
      attrs?.class,
      'list-group-item list-group-item-action',
      parent && 'd-flex',
      active && 'active',
    ),
    'aria-current': active ? 'true' : null,
    ...(parent ? {
      href: `#${groupId}`,
      'data-bs-toggle': 'collapse',
      'aria-expanded': 'false',
    } : {}),
  }

  return (
    <a {...props}>
      {icon && <i class={`bi-${icon} me-3`}></i>}
      <span>{label}</span>
      {parent && <i class="bi-caret-down-fill ms-auto"></i>}
    </a>
  )
}
const NavItem = ({ item: { items, ...item }, base, activeUrl }) => {
  const hasChildren = items?.length > 0
  const groupId = `${item.menuid}-tree`

  return (
    <>
      <NavLink item={item} base={base} parent={hasChildren} groupId={groupId} activeUrl={activeUrl} />
      {hasChildren && (
        <div class={clsx('collapse', 'list-tree-child')} id={groupId}>
          <NavTree items={items} base={base} activeUrl={activeUrl} />
        </div>
      )}
    </>
  )
}

const NavTree = ({ items, base, activeUrl }) => (
  <div class="list-group list-group-flush">
    {items.map(item => <NavItem key={item.id} item={item} base={base} activeUrl={activeUrl} />)}
  </div>
)

export default NavTree
