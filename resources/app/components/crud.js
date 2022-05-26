import clsx from 'clsx'
import { snakeCase, startCase } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { useContext } from '../context'
import { confirm, notify } from '../lib/alert'
import { FormGrid } from './form'
import NavTab from './nav-tab'

const DATA_ID = 'data'
const CREATE_ID = 'create'

const isCheckbox = type => ['radio', 'checkbox'].includes(type)
const renderLabel = (field, setup) => 'string' === typeof setup ? setup : (setup && 'label' in setup ? setup?.label : startCase(field))
const renderData = ({ field, value, item, setup, toolbars }) => {
  const { render, type } = setup || {}
  const handleClick = toolbar => ev => toolbar.onClick && toolbar.onClick({ toolbar, field, value, item }, ev)

  if (render) {
    return render({ value, item })
  }

  if (type === 'toolbars' && toolbars) {
    return (
      <div class="btn-group btn-group-sm" role="group" aria-label="Row controls">
        {toolbars.map(toolbar => (
          <button type="button" class={clsx('btn', `btn-${toolbar.btn || 'secondary'}`, toolbar.class)} onClick={handleClick(toolbar)}>
            {toolbar.icon && <i class={clsx(`bi-${toolbar.icon}`, toolbar.label && 'me-1')}></i>} {toolbar.label}
          </button>
        ))}
      </div>
    )
  }

  return value
}

const ElRow = ({ keys, item, fields, toolbars }) => {
  return (
    <tr>
      {keys.map(field => <td key={field}>{renderData({ field, item, toolbars, setup: fields[field], value: item[field] })}</td>)}
    </tr>
  )
}
const CrudToolbar = ({ onCreate, onClick, toolbars }) => (
  <div class="btn-group" role="group" aria-label="Crud toolbars">
    {toolbars && toolbars.map(toolbar => (
      <button type="button" class={`btn btn-outline-${toolbar.color || 'secondary'}`} onClick={ev => onClick(toolbar, ev)}>
        {toolbar.icon && <i class={`bi-${toolbar.icon} me-1`}></i>} {toolbar.label}
      </button>
    ))}
    {onCreate && (
      <button type="button" class="btn btn-outline-primary" onClick={onCreate}>
        <i class="bi-plus-circle me-1"></i> New
      </button>
    )}
  </div>
)
const CrudTable = ({ pkey, keys, fields, items, toolbars }) => (
  <div>
    <table class="table table-striped table-hover table-bordered">
      <thead>
        <tr>
          {keys.map(key => (<th key={key}>{renderLabel(key, fields[key])}</th>))}
        </tr>
      </thead>
      <tbody class="table-group-divider">
        {items?.map(item => (<ElRow key={item[pkey]} fields={fields} item={item} keys={keys} toolbars={toolbars} />))}
        {items?.length <= 0 && <tr><td colspan={keys.length}><em>No data available</em></td></tr>}
      </tbody>
    </table>
  </div>
)

const collectInputError = (form, keys) => Object.fromEntries(
  keys.map(key => {
    const el = form.querySelector(`[name="${key}"]`)

    return [key, el?.validationMessage || '']
  })
)
const renderForm = ({
  data: {
    stay = true,
    clean = true,
    initialized = false,
    initials = {},
    values = {},
    checks = {},
    errors = {},
    fields,
    processing,
  },
  resource: url,
  update,
  close,
}) => {
  const keys = Object.keys(fields)
  const control = useRef()
  const form = {
    autocomplete: 'off',
    novalidate: true,
  }
  const extras = [
    {
      name: 'stay',
      type: 'checkbox',
      label: 'Close after save',
      checked: stay,
    }
  ]
  const { requestC } = useContext()
  const checkError = (errs = errors) => keys.reduce((err, key) => err || !!errs[key], false)
  const handleExtras = ({ name }, { target: { checked }}) => {
    if ('stay' === name) {
      update({ stay: !stay })
    }
  }
  const handleChange = ({ name, type }, { target: { value, validationMessage: error }}) => {
    update({
      clean: false,
      values: { ...values, [name]: value },
      errors: { ...errors, [name]: error },
      checks: { ...checks, [name]: isCheckbox(type) ? !checks[name] : false },
    })
  }
  const handleSubmit = async ev => {
    let hasError = checkError()

    if (clean) {
      const newErrors = collectInputError(ev.target, keys)

      hasError = checkError(newErrors)
      hasError && update({ errors: newErrors })
    }

    if (hasError) {
      notify('Please fix errors in form')

      return
    }

    update({ processing: true })

    const request = requestC({ method: 'post', data: values, url }, control.current)

    control.current = request.control
    const { success, message, errors: resultErrors } = await request.result

    notify(message, success)

    if (success) {
      handleReset(!stay)
    } else {
      const err = {
        processing: false,
      }

      if (resultErrors) {
        err.errors = {
          ...errors,
          ...Object.fromEntries(
            Object.keys(resultErrors).map(key => [key, resultErrors[key].join(', ')])
          )
        }
      }

      update(err)
    }
  }
  const handleReset = doClose => {
    if (doClose) {
      close()
    } else {
      update({ values: initials, clean: true, processing: false })
    }
  }
  const handleCancel = ev => {
    ev.preventDefault()

    handleReset(true)
  }
  const initialize = () => {
    if (initialized) {
      return
    }

    const initials = Object.fromEntries(keys.map(key => [key, fields[key] && 'value' in fields[key] ? fields[key].value : '']))
    const errors = Object.fromEntries(keys.map(key => [key, fields[key] && 'error' in fields[key] ? fields[key].error : '']))
    const checks = Object.fromEntries(keys.map(key => [key, fields[key] && 'checked' in fields[key] ? fields[key].checked : false]))

    update({ initialized: true, values: initials, initials, checks, errors })
  }

  useEffect(() => {
    initialize()

    return () => {
      control.current.abort()
    }
  }, [])

  return (
    <FormGrid
      form={form}
      fields={fields}
      processing={processing}
      extras={extras}
      values={values}
      checks={checks}
      errors={errors}
      onCancel={handleCancel}
      onExtras={handleExtras}
      onChange={handleChange}
      onSubmit={handleSubmit} />
  )
}
const renderView = ({
  data: {
    item,
    fields,
  },
}) => {
  const keys = Object.keys(fields).filter(key => 'toolbars' !== fields[key] )

  return (
    <div>
      {keys.map(field => field in item && (
        <div key={field} class="row mb-3 border-bottom">
          <label for={`view-${snakeCase(field)}`} class="col-sm-2 col-form-label bg-light fw-semibold">
            {renderLabel(field, fields[field])}
          </label>
          <div class="col-sm-10">
            <p class="form-control-plaintext">
              {renderData({ field, item, value: item[field], setup: fields[field] })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ({
  title,
  fields,
  creates,
  views,
  onCreate,
  onView,
  toolbars,
  rowToolbars = [],
  resource,
  pkey = 'id',
}) => {
  const { request, requestC } = useContext()
  const keys = Object.keys(fields)
  const [pgn, pgnSet] = useState()
  const [loading, loadingSet] = useState(true)
  const [page, pageSet] = useState(1)
  const [tabs, tabsSet] = useState([
    {
      id: DATA_ID,
      active: true,
      closeable: false,
      dirty: false,
    },
  ])
  const activeTab = useMemo(() => tabs.find(tab => tab.active), [tabs])
  const withRowToolbars = [
    ...rowToolbars,
    {
      id: 'view',
      btn: 'info',
      icon: 'eye',
      onClick: ({ item }, ev) => {
        ev.preventDefault()

        addTab(`view-${item[pkey]}`, id => ({
          id,
          closeable: true,
          dirty: false,
          active: true,
          data: {
            item,
            fields: views || fields,
          },
          render: onView || renderView,
        }))
      },
    },
    {
      id: 'update',
      btn: 'warning',
      icon: 'pencil',
      onClick: (args, ev) => {
        ev.preventDefault()

        console.log(args)
      },
    },
    {
      id: 'delete',
      btn: 'danger',
      icon: 'trash',
      onClick: async ({ item }, ev) => {
        ev.preventDefault()

        const { isConfirmed, value: { success, message } = {}} = await confirm(
          () => request({ method: 'DELETE', url: `${resource}/${item[pkey]}` }),
        )

        if (isConfirmed) {
          notify(message, success)
          loadingSet(success)
        }
      },
    },
  ].filter((toolbar, i, ori) => i === ori.indexOf(toolbar) && !toolbar.hide)
  const addTab = (id, createTab) => {
    const tab = tabs.find(t => t.id === id)

    if (tab) {
      activateTab(tab)
    } else {
      tabsSet(tabs => [...tabs.map(tab => ({ ...tab, active: false })), createTab(id)])
    }
  }
  const loadData = async () => {
    const { success, message, data } = await request({
      url: resource,
      params: {
        page,
      },
    })

    if (success) {
      pgnSet(data)
    } else {
      notify(message)
    }

    loadingSet(false)
  }
  const activateTab = tab => tabsSet(tabs => tabs.map(row => ({
    ...row,
    active: tab.id === row.id,
  })))
  const handleTab = (tab, ev) => {
    ev.preventDefault()
    ev.stopPropagation()

    activateTab(tab)
  }
  const handleTabClose = (tab, ev) => {
    ev?.preventDefault()
    ev?.stopPropagation()

    tabsSet(
      tabs => tabs.filter(row => row.id !== tab.id).map((row, i, tabs) => ({ ...row, active: i === tabs.length - 1 })),
    )
  }
  const handleCreate = ev => {
    ev.preventDefault()

    addTab(CREATE_ID, id => ({
      id,
      closeable: true,
      dirty: false,
      active: true,
      data: { fields: creates },
      render: onCreate || renderForm,
    }))
  }
  const handleToolbars = (toolbar, ev) => {
    console.log(toolbar)
  }
  const handleTabCloseSelf = tab => (refresh = true) => {
    loadingSet(refresh)
    handleTabClose(tab)
  }
  const handleTabUpdate = tab => data => tabsSet(tabs => tabs.map(row => {
    if (row.id != tab.id) {
      return row
    }

    return {
      ...row,
      data: {
        ...row.data,
        ...data,
      }
    }
  }))
  const renderTab = () => {
    if (activeTab?.render) {
      return activeTab.render({
        resource,
        data: activeTab.data,
        refresh: () => loadingSet(true),
        close: handleTabCloseSelf(activeTab),
        update: handleTabUpdate(activeTab),
      })
    }

    return (
      <CrudTable items={pgn?.data} keys={keys} pkey={pkey} fields={fields} toolbars={withRowToolbars} />
    )
  }

  useEffect(() => {
    loading && loadData()
  }, [loading])

  return (
    <div class="card">
      <div class="card-header">
        <div class="d-flex border-bottom pb-3">
          <h5 class="flex-grow-1">{title}</h5>
          {(creates || onCreate || toolbars) && (
            <CrudToolbar onCreate={handleCreate} onClick={handleToolbars} toolbars={toolbars} />
          )}
        </div>
        <NavTab tabs={tabs} onClick={handleTab} onClose={handleTabClose} class="mt-3" />
      </div>
      <div class="card-body">{renderTab()}</div>
    </div>
  )
}
