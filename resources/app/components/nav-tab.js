import clsx from 'clsx'
import { startCase } from 'lodash'
import { useEffect, useRef, useState, useMemo } from 'preact/hooks'

export default ({
  class: classes,
  tabs,
  onSelect,
  onClose,
}) => {
  const ref = useRef()
  const handleSelect = tab => event => onSelect && onSelect({ event, tab })
  const handleClose = tab => event => onClose && onClose({ event, tab })

  useEffect(() => {
    const els = ref.current?.querySelectorAll('[data-bs-toggle=tooltip]')
    const tips = [...els].map(el => new bootstrap.Tooltip(el, {
      title: el.querySelector('.text-truncate').textContent,
      placement: 'bottom',
    }))

    return () => {
      tips.forEach(tip => tip.dispose())
    }
  })

  return (
    <ul ref={ref} class={clsx('nav nav-tabs card-header-tabs', classes)}>
      {tabs.map(tab => (
        <li key={tab.id} class="nav-item">
          <a data-bs-toggle="tooltip" href="#" class={clsx('nav-link', 'd-flex', tab.active && 'active')} aria-current={tab.active ? 'true' : null} onClick={handleSelect(tab)}>
            <span class="d-block text-truncate wmx-100">{tab.title || startCase(tab.id)}</span>
            {tab.closeable && <i class="bi-x-circle ms-1 text-danger" onClick={handleClose(tab)}></i>}
          </a>
        </li>
      ))}
    </ul>
  )
}

const matchTab = (id, expected = true) => find => expected === (find.id === id)

export const useTab = baseTabs => {
  const [tabs, tabsSet] = useState(baseTabs || [])
  const activeTab = useMemo(() => tabs.find(tab => tab.active) || {}, [tabs])
  const activate = tab => tabsSet(tabs => tabs.map(item => ({
    ...item,
    active: tab.id === item.id,
  })))
  const close = id => {
    const open = Math.max(0, tabs.findIndex(matchTab(id)) - 1)

    tabsSet(
      tabs => tabs.filter(matchTab(id, false)).map(
        (tab, i) => ({ ...tab, active: i === open }),
      ),
    )
  }
  const cloneTab = (id, baseTab, data = {}, override = {}) => {
    const tab = tabs.find(matchTab(id))
    const defaults = {
      closeable: true,
    }

    if (tab) {
      activate(tab)
    } else {
      tabsSet(tabs => [...tabs.map(tab => ({ ...tab, active: false })), {
        ...baseTab,
        ...defaults,
        ...override,
        id,
        data: { ...(baseTab.data || {}), ...data },
      }])
    }
  }
  const updateTab = (id, data) => tabsSet(tabs => tabs.map(tab => {
    if (id != tab.id) {
      return tab
    }

    return { ...tab, data: { ...tab.data, ...data } }
  }))
  const onSelect = ({ event, tab }) => {
    event?.preventDefault()
    event?.stopPropagation()

    activate(tab)
  }
  const onClose = ({ event, tab }) => {
    event?.preventDefault()
    event?.stopPropagation()

    close(tab)
  }

  return {
    tabs,
    activeTab,
    activate,
    close,
    cloneTab,
    updateTab,
    onSelect,
    onClose,
  }
}
