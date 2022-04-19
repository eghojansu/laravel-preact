import { AppUse } from './context'
import { FormLogin } from './components/form'

export const withContext = (Page, { guards } = {}) => props => {
  props.app = AppUse()

  if (guards && !props.app.allow(...guards)) {
    return <FormLogin onLogin={props.app.login} />
  }

  return <Page {...props} />
}
