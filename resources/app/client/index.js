import { render } from 'preact'
import 'bootstrap'
import { AppProvider } from './context'
import Pages from './routes'

render(<App />, document.body)

function App() {
  return (
    <AppProvider>
      <Pages />
    </AppProvider>
  )
}
