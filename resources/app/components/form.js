import { toChildArray } from 'preact'
import { useMemo, useState, useEffect, useRef } from 'preact/hooks'
import clsx from 'clsx'
import { PrimaryButton } from './button'
import { casePascal, caseTitle } from '../lib'

const stdInput = props => {
  if (props?.stdized) {
    return props
  }

  let {
    error,
    success,
    label,
    autofocus,
    iRef,
    ...std
  } = { ...props }

  if (!std.name) {
    throw new Error('Form field should have a name!')
  }

  if (!std.id) {
    std.id = `input${casePascal(std.name)}`
  }

  if (!label) {
    label = std.placeholder || caseTitle(std.name)
  }

  if (!std.placeholder && false !== std.placeholder) {
    std.placeholder = label
  }

  return {
    stdized: true,
    label,
    error,
    success,
    autofocus,
    iRef,
    std,
  }
}

export const FormInput = props => {
  const { iRef, autofocus, std: { class: cls, ...std } } = stdInput(props)
  const ref = iRef || useRef()

  useEffect(() => {
    autofocus && ref.current.focus()
  }, [])

  return <input class={clsx(cls, 'form-control')} ref={ref} {...std} />
}

export const FormFloat = props => {
  const stdized = stdInput(props)
  const { success, error, label, std: { class: cls, id } } = stdized
  const updated = { ...stdized, std: { ...stdized.std, class: clsx(cls, success && 'is-valid', error && 'is-invalid') }}

  return (
    <div class="form-floating">
      <FormInput {...updated} />
      <label for={id}>{label}</label>
      {success && <div class="valid-feedback text-start mb-1">{success}</div>}
      {error && <div class="invalid-feedback text-start mb-1">{error}</div>}
    </div>
  )
}

export const FormFieldLayout = ({ layout, field, ...restField }) => {
  return <FormFloat {...field} {...restField} />
}

export const FormWrapper = props => {
  const { children, fields, layout, onValid, onInvalid, onSubmitting, errors: initialErrors, ...formProps } = props
  const initial = fields.reduce((initial, { name, value = '', error }) => ({
    values: { ...initial.values, [name]: value },
    errors: { ...initial.errors, [name]: error },
  }), { values: {}, errors: {} })
  const [submitting, submittingSet] = useState(false)
  const [dirty, dirtySet] = useState(false)
  const [success, successSet] = useState(false)
  const [message, messageSet] = useState()
  const [values, valuesSet] = useState(initial.values)
  const [errors, errorsSet] = useState(initial.errors)
  const refs = fields.reduce((carry, { name }) => ({ ...carry, [name]: useRef() }), {})
  const valid = useMemo(() => fields.every(({ name }) => !errors[name]), [errors])
  const listen = ({ event: { target: { value = '', validationMessage: message } }, field: { name } }) => {
    messageSet('')
    valuesSet(values => ({ ...values, [name]: value }))
    errorsSet(errors => ({ ...errors, [name]: message }))
    dirtySet(true)
  }
  const handleCloseAlert = () => messageSet('')
  const handleSubmit = e => {
    e.preventDefault()

    if (dirty) {
      submittingSet(true)
    } else {
      errorsSet(errors => {
        const update = fields.reduce((errors, { name }) => ({
          ...errors,
          [name]: refs[name].current.validationMessage,
        }), errors)

        submittingSet(true)

        return update
      })
    }
  }
  const doSubmit = async () => {
    messageSet('')

    if (!valid) {
      submittingSet(false)
      successSet(false)
      messageSet('Please fix errors in form bellow')

      onInvalid && onInvalid(values)

      return
    }

    let result

    try {
      result = (onValid && (await onValid(values))) || {
        success: false,
        errors: {},
        message: 'Unhandled form',
      }
    } catch (e) {
      result = {
        success: false,
        errors: e.errors || {},
        message: e.message,
      }
    }

    successSet(result.success)
    messageSet(result.message)
    errorsSet(errors => fields.reduce((carry, { name }) => ({
      ...carry,
      [name]: result.errors && result.errors[name] && result.errors[name].join(', ')
    }), errors))
    submittingSet(false)
  }
  const buttons = toChildArray(children).length > 0 ? children : (
    <div>
      Auto Buttons
    </div>
  )

  useEffect(() => {
    onSubmitting && onSubmitting(submitting)
    submitting && doSubmit()
  }, [submitting])

  return (
    <form novalidate onsubmit={handleSubmit} {...formProps}>
      {message && <div class={clsx('alert', success ? 'alert-success' : 'alert-danger', 'alert-dismissible fade show')} role="alert">
        {message}
        <button onclick={handleCloseAlert} type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}
      {fields.map(field => (
        <FormFieldLayout
          layout={layout}
          iRef={refs[field.name]}
          value={values[field.name]}
          error={errors[field.name]}
          oninput={event => listen({ event, field })}
          disabled={field.disabled || submitting}
          field={field} />
      ))}
      {buttons}
    </form>
  )
}

export const FormLogin = ({ onLogin = () => null }) => {
  const [loading, loadingSet] = useState(false)
  const fields = [
    {
      name: 'email',
      type: 'email',
      autofocus: true,
      required: true,
    },
    {
      name: 'password',
      type: 'password',
      required: true,
    },
  ]

  return (
    <div class="min-vh-100 d-flex justify-content-center align-items-center">
      <div style="max-width: 330px" class="text-center">
        <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
        <FormWrapper
          autocomplete="off"
          method="post"
          onSubmitting={loadingSet}
          onValid={onLogin}
          fields={fields}>
          <PrimaryButton loading={loading} size="lg" class="w-100 mt-3" text="Sign in" />
        </FormWrapper>
      </div>
    </div>
  )
}
