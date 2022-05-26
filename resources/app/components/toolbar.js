import clsx from 'clsx'
import { startCase } from 'lodash'

const ToolbarButtonContent = ({
  processing,
  iconStart,
  iconEnd,
  text,
  id,
}) => {
  const label = false === text ? '' : (
    text || startCase(id)
  )

  return (
    <>
      {!processing && iconStart && <i class={clsx(`bi-${iconStart}`, label && 'me-2')}></i>}
      {processing && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
      {processing ? 'Please wait...' : label}
      {!processing && iconEnd && <i class={clsx(`bi-${iconEnd}`, label && 'ms-2')}></i>}
    </>
  )
}
const ToolbarButtonDropdownItem = ({
  item: {
    id,
    separator,
    text,
    iconStart,
    iconEnd,
    processing,
  },
  onClick,
}) => {
  const sep = undefined === separator ? id?.startsWith('--sep') : separator

  return (
    <li>
      {sep ? (
        <hr class="dropdown-divider" />
      ) : (
        <a class="dropdown-item" href="#" onClick={onClick}>
          <ToolbarButtonContent
            processing={processing}
            iconStart={iconStart}
            iconEnd={iconEnd}
            text={text}
            id={id} />
        </a>
      )}
    </li>
  )
}
const ToolbarButton = ({
  item: {
    id,
    text,
    iconStart,
    iconEnd,
    end,
    split,
    processing,
    items,
    btn = 'secondary',
    ...item
  },
  onClick,
}) => {
  const cls = clsx('btn', `btn-${btn}`)
  const parent = {
    ...item,
    text,
    iconStart,
    iconEnd,
    end,
    split,
    processing,
    items,
    btn,
    id,
  }
  const handleClick = event => onClick && onClick({
    item: parent,
    event,
  })
  const handleDropdownItem = item => event => onClick({
    event,
    parent,
    item,
  })

  if (items?.length > 0) {
    return (
      <div class="btn-group" role="group">
        {split && (
          <button type="button" class={cls} onClick={handleClick}>
            <ToolbarButtonContent
              processing={processing}
              iconStart={iconStart}
              iconEnd={iconEnd}
              text={text}
              id={id} />
          </button>
        )}
        <button type="button" class={clsx(cls, 'dropdown-toggle', split && 'dropdown-toggle-split')} data-bs-toggle="dropdown" aria-expanded="false">
          {split ? (
            <span class="visually-hidden">Toggle Dropdown</span>
          ) : (
            <ToolbarButtonContent
              processing={processing}
              iconStart={iconStart}
              iconEnd={iconEnd}
              text={text}
              id={id} />
          )}
        </button>
        <ul class={clsx('dropdown-menu', end && 'dropdown-menu-end')}>
          {items.map(item => (
            <ToolbarButtonDropdownItem
              key={item.id}
              item={item}
              onClick={handleDropdownItem(item)} />
          ))}
        </ul>
      </div>
    )
  }

  return (
    <button type="button" class={cls} onClick={handleClick}>
      <ToolbarButtonContent
        processing={processing}
        iconStart={iconStart}
        iconEnd={iconEnd}
        text={text}
        id={id} />
    </button>
  )
}
const Toolbar = ({
  title = 'Action toolbar',
  class: cls,
  items,
  size,
  onClick,
}) => {
  return (
    <div class={clsx('btn-group', size && `btn-group-${size}`, cls)} role="group" aria-label={title}>
      {items.map(item => (
        <ToolbarButton
          key={item.id}
          item={item}
          onClick={onClick} />
      ))}
    </div>
  )
}

export default Toolbar
