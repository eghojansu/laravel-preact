import { useState } from 'preact/hooks'

export const isCheck = type => ['checkbox', 'radio'].includes(type)
export const useForm = (fields, onSubmit = (data, e) => null, setup = {}) => {
  const isDefault = Array.isArray(fields)
  const getDefault = (field, value) => isDefault ? value : fields[field]
  const initials = (isDefault ? fields : Object.keys(fields)).reduce(
    (initials, field) => ({
      values: { ...initials.values, [field]: getDefault(field, '') },
      checks: { ...initials.checks, [field]: getDefault(field, false) },
      errors: { ...initials.errors, [field]: setup && field in setup && 'message' in setup[field] ? setup[field].message : '' },
    }),
    { values: {}, checks: {} },
  )
  const [processing, processingSet] = useState(false)
  const [message, messageSet] = useState()
  const [errors, errorsSet] = useState(initials.errors)
  const [values, valuesSet] = useState(initials.values)
  const [checks, checksSet] = useState(initials.checks)
  const handleChange = field => e => {
    const { target: { value: newValue, type } } = e
    const check = isCheck(type)
    const checked = check && (field in checks) && !checks[field]
    const value = setup && field in setup && 'change' in setup[field] ? setup[field].change(newValue, e) : (
      check ? (checked ? newValue : '') : newValue
    )

    checksSet(checks => ({ ...checks, [field]: checked }))
    valuesSet(values => ({ ...values, [field]: value }))
  }
  const handleSubmit = async e => {
    e.preventDefault()

    processingSet(true)
    await onSubmit(values, e)
    processingSet(false)
  }

  return {
    values,
    checks,
    errors,
    message,
    processing,
    handleChange,
    handleSubmit,
    setErrors: errorsSet,
    setMessage: messageSet,
  }
}
