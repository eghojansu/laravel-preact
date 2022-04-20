import clsx from 'clsx'

export const PrimaryButton = ({
  link,
  size,
  class: cls,
  loading,
  disabled,
  loadingText = 'Please wait...',
  text = 'Save',
  color = 'primary',
  ...props
}) => {
  const label = loading ? (
    <>
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      {loadingText}
    </>
  ) : text
  const clss = clsx(
    'btn',
    color && `btn-${color}`,
    size && `btn-${size}`,
    link && (disabled || loading) && 'disabled',
    cls,
  )

  if (link) {
    return <a role="button" class={clss} {...props}>{label}</a>
  }

  return <button class={clss} disabled={disabled || loading} {...props}>{label}</button>
}
