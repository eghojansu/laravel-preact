import { useState } from 'preact/hooks'
import clsx from 'clsx'
import { useForm } from './form'
import { ProgressAlert } from './progress'
import { Alert } from './alert'

export default ({ login }) => {
  const [success, successSet] = useState(false)
  const form = useForm(['username', 'password', 'remember'], data => login(
    data,
    ({ success, message, errors }) => {
      successSet(success)

      form.setValue('password', '')
      form.setMessage(message)
      form.setErrors(errors || [])
    },
  ))

  return (
    <div class="d-flex min-vh-100 justify-content-center align-items-center">
      <form class="form-login text-center" method="post" onsubmit={form.handleSubmit}>
        <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

        {form.processing && <ProgressAlert />}
        {form.message && <Alert message={form.message} alert={success ? 'success' : 'danger'} />}

        <div class="form-floating">
          <input
            type="text"
            class={clsx('form-control', form.errors.username && 'is-invalid')}
            id="txtUsername"
            placeholder="Username or email"
            disabled={form.processing}
            value={form.values.username}
            oninput={form.handleChange('username')} />
          <label for="txtUsername">Username or email</label>
          {form.errors.username && <div class="invalid-feedback mb-3">{form.errors.username}</div>}
        </div>
        <div class="form-floating">
          <input
            type="password"
            class={clsx('form-control', form.errors.username && 'is-invalid')}
            id="txtPassword"
            placeholder="Password"
            disabled={form.processing}
            value={form.values.password}
            oninput={form.handleChange('password')} />
          <label for="txtPassword">Password</label>
          {form.errors.password && <div class="invalid-feedback mb-3">{form.errors.password}</div>}
        </div>

        <div class="checkbox mb-3">
          <label>
            <input
              type="checkbox"
              value="remember-me"
              disabled={form.processing}
              checked={form.checks.remember}
              onclick={form.handleChange('remember')} /> Remember me
          </label>
        </div>

        <button class="w-100 btn btn-lg btn-primary" type="submit" disabled={form.processing}>
          Sign in
        </button>
      </form>
    </div>
  )
}
