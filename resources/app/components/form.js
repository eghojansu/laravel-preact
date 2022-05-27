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
    const { target: { value, type } } = e

    setValue(field, value, isCheck(type))
  }
  const handleSubmit = async e => {
    e.preventDefault()

    processingSet(true)
    await onSubmit(values, e)
    processingSet(false)
  }
  const setValue = (field, val, check) => {
    const checked = check && (field in checks) && !checks[field]
    const value = setup && field in setup && 'change' in setup[field] ? setup[field].change(val, e) : (
      check ? (checked ? val : '') : val
    )

    checksSet(checks => ({ ...checks, [field]: checked }))
    valuesSet(values => ({ ...values, [field]: value }))
  }

  return {
    values,
    checks,
    errors,
    message,
    processing,
    setValue,
    handleChange,
    handleSubmit,
    setErrors: errorsSet,
    setMessage: messageSet,
  }
}
