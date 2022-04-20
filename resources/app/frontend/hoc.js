import { route } from 'preact-router'
import { useAppContext } from './context'
import { FormLogin } from '../components/form'

export const withAppContext = (Page, { guards, redirect } = {}) => props => {
  props.app = useAppContext()

  if (guards && !props.app.allowed(...guards)) {
    if (redirect) {
      route(redirect, true)

      return null
    }

    return <FormLogin onLogin={props.app.login} />
  }

  return <Page {...props} />
}
