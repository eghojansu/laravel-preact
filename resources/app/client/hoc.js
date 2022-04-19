import { useAppContext } from './context'
import { FormLogin } from './components/form'

export const withAppContext = (Page, { guards } = {}) => props => {
  props.app = useAppContext()

  if (guards && !props.app.allow(...guards)) {
    return <FormLogin onLogin={props.app.login} />
  }

  return <Page {...props} />
}
