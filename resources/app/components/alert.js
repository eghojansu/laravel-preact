import clsx from 'clsx'

export const Alert = ({ heading, message, alert: alt = 'info', icon, onDismiss }) => (
  <div class={clsx('alert', alt && `alert-${alt}`, onDismiss && 'alert-dismissible fade show')} role="alert">
    {heading && <h5 class="alert-heading">{heading}</h5>}
    <div class={clsx(icon && 'd-flex align-items-center')}>
      {icon && <i class={clsx(`bi-${icon}`)}></i>}
      {message}
    </div>
    {onDismiss && <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onclick={onDismiss}></button>}
  </div>
)

export const LoadingFull = ({ message = 'Loading awesome, please wait...' }) => (
  <div class="min-vh-100 d-flex justify-content-center align-items-center">
    <div class="spinner-border text-primary me-3" role="status" aria-hidden="true"></div>
    <p>{message}</p>
  </div>
)
