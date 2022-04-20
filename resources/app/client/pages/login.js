import { withAppContext } from '../hoc'
import { FormLogin } from '../../components/form'

export default withAppContext(({ app: { login }}) => {
  return <FormLogin onLogin={login} />
}, { guards: ['guest'], redirect: '/' })
