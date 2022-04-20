import clsx from 'clsx'

export default ({ icon, class: cls }) => (
  <i class={clsx(`bi-${icon}`, cls)} />
)
