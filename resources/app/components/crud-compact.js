import { useState, useEffect, useRef } from 'preact/hooks'
import { route } from 'preact-router'
import { startCase } from 'lodash'
import clsx from 'clsx'
import { useContext } from '../context'
import { filterUnique } from '../lib/filter'
import { confirm, notify } from '../lib/alert'
import Toolbar from './toolbar'
import NavTab, { useTab } from './nav-tab'
import { random } from '../lib/common'


const DEFAULT_KEY = '***NEW***'
const isCheck = type => [typ.radio, typ.checkbox].includes(type)
const renderLabel = (field, setup) => 'string' === typeof setup ? setup : (setup && 'label' in setup ? setup?.label : startCase(field))
const renderData = ({ value, item, setup }) => {
  const { render } = setup || {}

  if (render) {
    return render({ value, item })
  }

  return value
}
const renderActionText = (action, loaded, processing) => processing && action.texting ? action.texting : (action.text || (
  !loaded && aid.save === action.id ? 'New' : startCase(action.id)
))

const FormInputAddon = ({
  id,
  btn,
  textAddon,
  text,
  disabled,
  title = null,
  iconStart,
  iconEnd,
  onClick,
  inputSelector,
  parentSelector = '.input-group',
  ...addon
}) => {
  const ref = useRef()
  const renderContent = () => (
    <>
      {iconStart && <i class={clsx(`bi-${iconStart}`, text && 'me-2')}></i>}
      {text}
      {iconEnd && <i class={clsx(`bi-${iconEnd}`, text && 'ms-2')}></i>}
    </>
  )
  const handleClick = event => onClick && onClick(event, {
    id,
    attr: name => event.target.closest(parentSelector)?.querySelector(inputSelector)?.getAttribute(name),
    ...addon,
  })

  useEffect(() => {
    const tip = new bootstrap.Tooltip(ref.current)

    return () => {
      tip?.dispose()
    }
  })

  if (textAddon) {
    return (
      <span ref={ref} title={title} class="input-group-text" onClick={handleClick} tabindex="-1">
        {renderContent()}
      </span>
    )
  }

  return (
    <button ref={ref} title={title} class={clsx(`btn btn-outline-${btn || 'secondary'}`)} type="button" tabindex="-1" disabled={disabled} onClick={handleClick}>
      {renderContent()}
    </button>
  )
}
const FormInput = ({
  id,
  type: inputType = 'text',
  addonStart: inputAddonStart,
  addonEnd: inputAddonEnd,
  readonly: inputReadonly,
  label,
  checked,
  class: cls,
  autocomplete = 'off',
  disabled,
  success,
  error,
  plain,
  raw,
  search,
  onChange = () => null,
  onAction = () => null,
  onKeydown = () => null,
  ...field
}) => {
  const ref = useRef()
  const isCursor = typ.cursor === inputType
  const isSearch = typ.search === inputType
  const isPassword = typ.password === inputType
  const readonly = inputReadonly || plain ? true : false
  const hasValidation = success || error
  const withClass = clsx(success && 'is-valid', error && 'is-invalid', cls)
  const type = isCursor || isSearch || plain || raw ? 'text' : inputType
  const addonStart = inputAddonStart || (
    isCursor && [
      {
        id: aid.first,
        iconStart: 'chevron-double-left',
      },
      {
        id: aid.prev,
        iconStart: 'chevron-left',
      },
    ]
  )
  const addonEnd = inputAddonStart || (
    isCursor && [
      {
        id: aid.next,
        iconStart: 'chevron-right',
      },
      {
        id: aid.end,
        iconStart: 'chevron-double-right',
      },
      {
        id: aid.search,
        iconStart: 'search',
        btn: 'primary',
      },
      {
        id: aid.new,
        iconStart: 'plus-circle',
        btn: 'success',
      },
    ]
  ) || (
    isSearch && [
      {
        id: aid.search,
        iconStart: 'search',
        btn: 'primary',
        ...(search || {}),
      },
    ]
  ) || (
    isPassword && [
      {
        id: aid.view,
        iconStart: raw ? 'eye-slash' : 'eye',
      },
      {
        id: aid.password,
        iconStart: 'key',
      },
    ]
  )
  const renderValidation = () => (
    <>
      {success && <div class="valid-feedback">{success}</div>}
      {error && <div class="invalid-feedback">{error}</div>}
    </>
  )

  if (isCheck(type)) {
    return (
      <div class={clsx('form-check', hasValidation && 'has-validation')}>
        <input
          ref={ref}
          id={id}
          type={type}
          checked={checked}
          disabled={disabled}
          readonly={readonly}
          class={clsx('form-check-input', withClass)}
          onclick={onChange}
          {...field} />
        <label class="form-check-label" for={id}>{label}</label>
        {renderValidation()}
      </div>
    )
  }

  return (
    <div class={clsx((addonStart || addonEnd) && 'input-group', hasValidation && 'has-validation')}>
      {addonStart && addonStart.map(addon => (
        <FormInputAddon key={addon.id} inputSelector={`#${id}`} onClick={onAction} disabled={disabled} {...addon} />
      ))}
      <input
        ref={ref}
        id={id}
        type={type}
        class={clsx(plain ? 'form-control-plaintext' : 'form-control', withClass)}
        autocomplete={autocomplete}
        disabled={disabled}
        readonly={readonly}
        onkeydown={onKeydown}
        oninput={onChange}
        {...field} />
      {addonEnd && addonEnd.map(addon => (
        <FormInputAddon key={addon.id} inputSelector={`#${id}`} onClick={onAction} disabled={disabled} {...addon} />
      ))}
      {renderValidation()}
    </div>
  )
}
const CrudGrid = ({
  name,
  state,
  processing,
  class: gridClass,
  grid: {
    wrap,
    width = 12,
    breakpoint = 'md',
    label,
    input,
  },
  onChange,
  onKeydown,
  onAction,
}) => {
  const useClass = clsx(`col-${breakpoint ? `${breakpoint}-` : ''}${width}`, 'mb-3', gridClass)

  const renderContent = () => {
    if (input) {
      const {
        id: inputId,
        value: initialValue,
        checked: initialChecked,
        error: initialError,
        readonly: initialReadonly,
        raw: initialRaw,
        type,
        success,
        placeholder,
        disabled = null,
        ...inputProps
      } = input
      const id = inputId || `input-${name}`
      const text = label || placeholder || startCase(name)
      const hint = undefined === placeholder ? text : (placeholder || null)
      const error = undefined === state.errors[name] ? initialError : state.errors[name]
      const value = undefined === state.values[name] ? (undefined === initialValue ? '' : initialValue) : state.values[name]
      const readonly = undefined === state.readonlies[name] ? (undefined === initialReadonly ? null : initialReadonly) : state.readonlies[name]
      const checked = undefined === state.checks[name] ? (undefined === initialChecked ? null : initialChecked) : state.checks[name]
      const raw = undefined === state.raws[name] ? (undefined === initialRaw ? null : initialRaw) : state.raws[name]

      return (
        <>
          {!isCheck(type) && <label for={id} class="form-label">{text}</label>}
          <FormInput
            id={id}
            name={name}
            type={type}
            label={text}
            placeholder={hint}
            disabled={disabled || processing}
            onChange={onChange}
            onKeydown={onKeydown}
            onAction={onAction}
            success={success}
            error={error}
            value={value}
            checked={checked}
            readonly={readonly}
            raw={raw}
            {...inputProps} />
        </>
      )
    }

    return name
  }

  return (
    <>
      <div class={useClass}>
        {renderContent()}
      </div>
      {wrap && <div class="w-100 p-0 m-0"></div>}
    </>
  )
}

const CrudSearch = ({
  search: {
    title = 'Lookup',
    fields = {},
    resource,
    show,
  } = {},
  onSelect,
  onClose,
}) => {
  const keys = Object.keys(fields)
  const element = useRef()
  const modal = useRef()
  const { request } = useContext()
  const [processing, processingSet] = useState(true)
  const [pagination, paginationSet] = useState()
  const [search, searchSet] = useState({})
  const handleRowClick = item => event => {
    modal.current.hide()
    onSelect && onSelect({
      event,
      item,
    })
  }
  const loadResource = async () => {
    const { success, message, data } = await request(resource, {
      params: { search }
    })

    paginationSet(data)
    processingSet(false)

    if (!success) {
      notify(message)
    }
  }

  useEffect(() => {
    if (!modal.current) {
      modal.current = new bootstrap.Modal(element.current)
      element.current.addEventListener('hide.bs.modal', () => onClose && onClose())
    }

    if (show) {
      modal.current.show()
      loadResource()
    } else {
      modal.current.hide()
    }
  }, [show, resource])

  return (
    <div ref={element} class="modal fade" tabindex="-1" aria-label={title} aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  {keys.map(key => (<th key={key}>{renderLabel(key, fields[key])}</th>))}
                </tr>
              </thead>
              <tbody class="table-group-divider">
                {pagination?.data.map(item => (
                  <tr onClick={handleRowClick(item)}>
                    {keys.map(field => (
                      <td key={field}>{renderData({ field, item, setup: fields[field], value: item[field] })}</td>
                    ))}
                  </tr>
                ))}
                {(pagination?.data.length || 0) <= 0 && <tr><td colspan={keys.length}>{
                  processing ? (
                    <div class="d-flex align-items-center">
                      <div class="spinner-grow spinner-grow-sm me-3" role="status" aria-hidden="true"></div>
                      <span class="fst-italic">Please wait...</span>
                    </div>
                  ) : (<em>No data available</em>)
                }</td></tr>}
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const CrudContent = ({
  control: {
    activeTab: {
      id: tabId,
      closeable,
      searchTitle,
      crud: {
        gutter = 3,
        back,
        pkey,
        resource,
        grid,
        gridBase = {},
        actions: crudActions = [],
        actionable = true,
        postable,
        searchFields,
        history,
      } = {},
      data: {
        loadKey,
        cursor,
        processing,
        loaded,
        search,
        loading,
        dry = true,
        clean = true,
        initials = {},
        readonlies = {},
        values = {},
        checks = {},
        errors = {},
        raws = {},
      } = {}
    },
    updateTab,
    addTab,
    close: closeTab,
  },
}) => {
  const { request } = useContext()
  const root = useRef()
  const keys = Object.keys(grid || {})
  const keysInput = keys.filter(key => grid[key] && 'input' in grid[key])
  const keysCheck = keysInput.filter(key => isCheck(grid[key].input.type))
  const actions = [
    ...crudActions,
    ...(actionable && grid ? [
      {
        id: aid.save,
        btn: 'primary',
        icon: 'check-circle',
      },
      ...(postable ? [{
        id: aid.post,
        btn: 'success',
        icon: 'check2-circle',
        found: true,
        confirm: true,
      }] : []),
      {
        id: aid.delete,
        icon: 'trash',
        found: true,
        confirm: true,
      },
    ] : [])
  ].filter(filterUnique())
  const close = () => closeTab(tabId)
  const check = (errs = errors) => keysInput.reduce((err, key) => err || !!errs[key], false)
  const update = data => updateTab(tabId, data)
  const reset = extras => update({
    clean: true,
    cursor: null,
    key: null,
    loaded: null,
    values: { ...initials.values },
    checks: { ...initials.checks },
    errors: { ...initials.errors },
    readonlies: { ...initials.readonlies, [pkey]: false },
    ...(extras || {}),
  })
  const inputFocus = name => {
    const element = root.current.querySelector(`[name="${name}"]`)

    element?.focus()
  }
  const inputErrors = () => Object.fromEntries(
    keysInput.map(key => {
      const el = root.current.querySelector(`[name="${key}"]`)

      return [key, el?.validationMessage || '']
    })
  )
  const searchUpdate = (search, extras) => update({
    search: {
      show: true,
      ...search
    },
    ...(extras || {}),
  })
  const assign = (item, extra = {}) => {
    const data = {}

    if (item) {
      data.loadKey = pkey in item && item[pkey] ? item[pkey] : null
      data.values = Object.fromEntries(
        keysInput.map(key => [key, key in item ? item[key] : values[key]])
      )
      data.checks = Object.fromEntries(
        keysCheck.map(key => [key, key in item && item[key] ? true : null])
      )
      data.readonlies = { ...readonlies, [pkey]: true }
      data.loaded = item
    }

    update({ ...extra, ...data })
  }
  const loadUpdate = (cursor, loadKey, extra = {}) => reset({
    cursor,
    loadKey,
    loading: true,
    ...extra,
  })
  const load = async () => {
    const { success, message, data } = await request(resource, {
      params: {
        load: loadKey,
        cursor,
      }
    })

    assign(data, { loading: false, errors: initials.errors })

    if (!success) {
      notify(message)
    }
  }
  const handleActionDelete = async () => {
    update({ processing: true })

    const { success, message } = await request({
      method: 'delete',
      url: `${resource}/${values[pkey]}`,
    })

    if (success) {
      if (closeable) {
        close()
      } else if (back) {
        route(back)
      } else {
        reset({ processing: false })
      }
    }

    return { success, message }
  }
  const handleActionSave = async () => {
    let hasError = check()

    if (clean) {
      const newErrors = inputErrors()

      hasError = check(newErrors)
      hasError && update({ errors: newErrors })
    }

    if (hasError) {
      return { message: 'Please fix errors in form' }
    }

    update({ processing: true })

    const { success, message, errors: resultErrors = {} } = await request({
      method: loaded ? 'put' : 'post',
      data: values,
      url: `${resource}${loaded ? `/${values[pkey]}` : ''}`,
    })

    if (success) {
      if (loaded) {
        loadUpdate(aid.current, values[pkey], { processing: false })
      } else {
        reset({ processing: false })
      }

      return { success, message }
    }

    update({
      processing: false,
      errors: {
        ...errors,
        ...Object.fromEntries(
          Object.keys(resultErrors).map(key => [key, resultErrors[key].join(', ')])
        )
      },
    })
  }
  const handleAction = ({
    id,
    handle,
    confirm: actionConfirm,
  }) => async event => {
    const withConfirm = true === actionConfirm ? {} : actionConfirm
    const doAction = async () => {
      if (handle) {
        return await handle(event)
      }

      if (aid.delete === id) {
        return await handleActionDelete(event)
      }

      if (aid.save === id) {
        return await handleActionSave(event)
      }

      if (aid.post === id) {
        // TODO: handle post
        // return await handleActionSave(event, 'put')
      }

      return { message: 'Action has no handler' }
    }
    const { isConfirmed, value: { message, success } = {} } = await (
      withConfirm ? confirm(doAction, withConfirm) : new Promise(async resolve => resolve({
        isConfirmed: true,
        value: await doAction(),
      }))
    )

    if (isConfirmed && message) {
      notify(message, success)
    }
  }
  const handleInputChange = name => ({
    target: {
      value,
      validationMessage: error,
    }
  }) => {
    const isCheck = name in checks
    const checked = !isCheck || !checks[name]

    update({
      clean: false,
      values: { ...values, [name]: checked ? value : '' },
      errors: { ...errors, [name]: error },
      checks: { ...checks, ...(isCheck ? { [name]: checked } : {}) },
      loaded: name === pkey ? null : loaded,
    })
  }
  const handleInputKeydown = name => event => {
    const { type } = grid[name].input

    if (typ.textarea === type || 'Enter' !== event.key) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const currentPos = keysInput.indexOf(name)
    const focusPos = event.shiftKey ? Math.max(0, currentPos - 1) : Math.min(keysInput.length - 1, currentPos + 1)
    const isLast = currentPos === focusPos
    const nextSelector = isLast ? `.crud-control button` : `[name="${keysInput[focusPos]}"]`
    const nextElement = root.current.querySelector(nextSelector)

    if (!nextElement) {
      return
    }

    if ('BUTTON' === nextElement.nodeName) {
      nextElement.click()

      return
    }

    if (typ.cursor === type && values[name]) {
      loadUpdate(aid.current, values[name])

      return
    }

    nextElement.focus()
  }
  const handleCursorAction = name => async (event, {
    id,
    handle,
    attr,
    ...addon
  }) => {
    event.preventDefault()

    if (handle) {
      handle({ event, name, grid: grid[name], addon, update, reset })

      return
    }

    if (id === aid.new) {
      reset()
      inputFocus(keysInput[0])

      return
    }

    if (id === aid.search) {
      searchUpdate({
        id,
        resource,
        title: `Find ${searchTitle}`,
        fields: {
          ...Object.fromEntries(keysInput.map(key => [key, grid[key]])),
          ...(searchFields || {}),
        },
        ...addon
      }, { cursor: null })

      return
    }

    if (id === aid.password) {
      const len = attr('maxlength') || attr('minlength') || 8

      update({
        values: { ...values, [name]: random(len) },
        errors: { ...errors, [name]: '' },
      })

      return
    }

    if (id === aid.view) {
      update({ raws: { ...raws, [name]: !raws[name] }})

      return
    }

    if (!clean) {
      const { isConfirmed } = await confirm(null, {
        text: 'There are unsaved changes in form. If you leave before saving, your changes will be lost.',
      })

      if (!isConfirmed) {
        return
      }
    }

    loadUpdate(id.slice(id.indexOf('-') + 1), loadKey)
  }
  const handleSearchClose = () => searchUpdate({ show: false })
  const handleSearchSelect = ({ item }) => assign(item)
  const handleLoaded = () => {
    if (loaded) {
      addTab(aid.history, {
        closeable: false,
        crud: {
          gridBase: {
            width: 4
          },
          grid: {
            creat: {
              label: 'Created at',
              input: {
                plain: true,
                value: loaded.creat,
              },
            },
            updat: {
              label: 'Updated at',
              input: {
                plain: true,
                value: loaded.updat,
              },
            },
            delat: {
              label: 'Deleted at',
              input: {
                plain: true,
                value: loaded.delat,
              },
            },
          }
        }
      })
    } else {

    }
  }
  const initialize = async () => {
    if (!dry) {
      return
    }

    const initials = keysInput.reduce(
      (initials, key) => ({
        ...initials,
        values: {
          ...(initials.values || {}),
          [key]: 'value' in grid[key].input ? grid[key].input.value : (
            'type' in grid[key].input && 'cursor' === grid[key].input.type && grid[key].input.disabled ? DEFAULT_KEY : ''
          ),
        },
        errors: {
          ...(initials.errors || {}),
          [key]: 'error' in grid[key].input ? grid[key].input.error : '',
        },
        readonlies: {
          ...(initials.readonlies || {}),
          [key]: 'readonly' in grid[key].input ? grid[key].input.readonly : false,
        },
      }),
      {
        checks: keysCheck.reduce(
          (checks, key) => ({ ...checks, [key]: 'checked' in grid[key].input ? grid[key].input.checked : false }),
          {},
        ),
      },
    )

    update({
      dry: false,
      initials,
      errors: { ...initials.errors },
      values: { ...initials.values },
      checks: { ...initials.checks },
      readonlies: { ...initials.readonlies },
    })
  }

  useEffect(() => {
    initialize()
  }, [])
  useEffect(() => {
    loading && cursor && load()
  }, [loading, cursor, loadKey])

  return (
    <div ref={root} class={clsx('row', `g-${gutter}`)}>
      {keys.map(key => (
        <CrudGrid
          key={key}
          name={key}
          state={{ errors, values, checks, readonlies, raws }}
          processing={loading || processing}
          class="crud-row"
          onKeydown={handleInputKeydown(key)}
          onChange={handleInputChange(key)}
          onAction={handleCursorAction(key)}
          grid={{ ...gridBase, ...grid[key] }} />
      ))}
      {actions.length > 0 && (
        <div class="col-12 mt-3 crud-control">
          {actions.map((action, i) => (
            <button
              key={action.id}
              type={action.type || 'button'}
              class={clsx('btn', `btn-${action.btn || 'secondary'}`, i > 0 && 'ms-2')}
              disabled={loading || processing || (action.found && !loaded)}
              onClick={handleAction(action)}>
              {action.icon && !processing && <i class={clsx(`bi-${action.icon}`, 'me-1')}></i>}
              {processing && <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>}
              <span>{renderActionText(action, loaded, processing)}</span>
            </button>
          ))}
        </div>
      )}
      <CrudSearch
        search={search}
        onSelect={handleSearchSelect}
        onClose={handleSearchClose} />
    </div>
  )
}

export const aid = {
  actions: 'actions',
  current: 'current',
  delete: 'delete',
  end: 'end',
  export: 'export',
  first: 'first',
  import: 'import',
  main: 'main',
  new: 'new',
  next: 'next',
  post: 'post',
  prev: 'prev',
  save: 'save',
  search: 'search',
  password: 'password',
  view: 'view',
  history: 'history',
}
export const typ = {
  cursor: 'cursor',
  search: 'search',
  password: 'password',
  text: 'text',
  radio: 'radio',
  checkbox: 'checkbox',
  textarea: 'textarea',
}

export default ({
  title,
  toolbar: userToolbar = [],
  actionToolbar = [],
  tabs = [],
  download,
  upload,
  ...crud
}) => {
  const toolbar = [
    ...userToolbar,
    {
      id: aid.actions,
      iconStart: 'gear',
      items: [
        ...actionToolbar,
        ...(download ? [{
          id: aid.export,
          iconStart: 'download',
        }] : []),
        ...(upload ? [{
          id: aid.import,
          iconStart: 'upload',
        }] : []),
      ].filter(filterUnique())
    }
  ].filter(filterUnique())
  const toolbarHandle = ({ event, item, parent }) => {
    event.preventDefault()
    event.stopPropagation()

    notify('No action available')
  }
  const tab = useTab([
    {
      id: aid.main,
      active: true,
      closeable: false,
      searchTitle: title,
      crud,
    },
    ...tabs,
  ])

  return (
    <div class="grid-compact card">
      <div class="card-header">
        <div class="d-flex border-bottom pb-2">
          <h5>{title}</h5>
          {toolbar && (
            <Toolbar items={toolbar} onClick={toolbarHandle} class="ms-auto" />
          )}
        </div>
        <NavTab
          class="mt-3"
          tabs={tab.tabs}
          onClose={tab.onClose}
          onSelect={tab.onSelect} />
      </div>
      <div class="card-body">
        <CrudContent control={tab} />
      </div>
    </div>
  )
}
