import clsx from 'clsx'
import { startCase } from 'lodash'

const defineId = name => `input-${name}`
const isRadio = type => ['radio', 'checkbox'].includes(type)
const FormInput = ({
  id,
  type,
  label,
  checked,
  onChange,
  class: cls,
  ...field
}) => {
  const handleChange = ev => onChange && onChange({ id, type, label, class: cls, ...field }, ev)

  if (isRadio(type)) {
    return (
      <div class="form-check">
        <input
          id={id}
          type={type}
          checked={checked}
          class={clsx(cls, 'form-check-input')}
          onclick={handleChange} {...field} />
        <label class="form-check-label" for={id}>{label}</label>
      </div>
    )
  }

  return (
    <input
      type={type}
      class={clsx('form-control', cls)}
      oninput={handleChange}
      {...field} />
  )
}
const FormGridCol = ({
  name: propName,
  wrap,
  breakpoint,
  value,
  checked,
  error,
  processing = null,
  field: {
    id: originalId,
    name: fieldName,
    value: initialValue,
    checked: initialChecked,
    error: initialError,
    class: cls,
    success,
    placeholder,
    type = 'text',
    disabled = null,
    grid: {
      label,
      wrap: gridWrap,
      breakpoint: gridBreakpoint,
      width = 12,
    } = {},
    ...field
  },
  ...props
}) => {
  const name = fieldName || propName
  const id = originalId || defineId(name)
  const text = label || placeholder || startCase(name)
  const hint = undefined === placeholder ? text : (placeholder || null)
  const bp = gridBreakpoint || breakpoint

  return (
    <>
      <div class={clsx(`col-${bp ? `${bp}-` : ''}${width}`)}>
        {!isRadio(type) && <label for={id} class="form-label">{text}</label>}
        <FormInput
          id={id}
          name={name}
          type={type}
          label={text}
          placeholder={hint}
          disabled={disabled || processing}
          value={undefined === value ? (undefined === initialValue ? '' : initialValue) : value}
          checked={undefined === checked ? (undefined === initialChecked ? false : initialChecked) : checked}
          class={clsx(success && 'is-valid', error && 'is-invalid', cls)}
          {...props}
          {...field} />
        {success && <div class="valid-feedback">{success}</div>}
        {(error || (undefined === error && initialError)) && <div class="invalid-feedback">{error || initialError}</div>}
      </div>
      {(gridWrap || wrap) && <div class="w-100 p-0 m-0"></div>}
    </>
  )
}

export const FormGrid = ({
  fields,
  wrap,
  breakpoint = 'md',
  saveText = 'Save',
  savingText = 'Saving...',
  cancelText = 'Cancel',
  gutter = 3,
  extras = [],
  values = {},
  checks = {},
  errors = {},
  processing,
  onChange,
  onCancel,
  onSubmit,
  onExtras,
  form = {},
}) => {
  const keys = Object.keys(fields)
  const handleSubmit = ev => ev.preventDefault() || (onSubmit && onSubmit(ev))
  const handleCancel = ev => onCancel && onCancel(ev)

  return (
    <form class={clsx('row', `g-${gutter}`)} method="post" onSubmit={handleSubmit} {...form}>
      {keys.map(name => (
        <FormGridCol
          key={fields[name].id || defineId(name)}
          wrap={wrap}
          name={name}
          breakpoint={breakpoint}
          processing={processing}
          checked={checks[name]}
          value={values[name]}
          error={errors[name]}
          field={fields[name]}
          onChange={onChange} />
      ))}
      <div class="w-100"></div>
      {extras.map(field => (
        <FormGridCol
          key={field.id || defineId(field.name)}
          wrap={false}
          breakpoint={breakpoint}
          processing={processing}
          checked={checks[field.name]}
          value={values[field.name]}
          error={errors[field.name]}
          field={field}
          onChange={onExtras} />
      ))}
      <div class="col-12">
        <button type="submit" class="btn btn-primary" disabled={processing}>
          {!processing && <i class="bi-check2-circle me-1"></i>}
          {processing && <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>}
          <span>{processing ? savingText : saveText}</span>
        </button>
        <button type="reset" class="btn btn-secondary ms-2" onClick={handleCancel}>
          {!processing && <i class="bi-x-circle me-1"></i>}
          <span>{cancelText}</span>
        </button>
      </div>
    </form>
  )
}
