import store from './store'
import { Provider } from 'react-redux'
import AppContainer from './AppContainer'

const App = () => {
	return (
		<Provider store={store}>
			<AppContainer />
		</Provider>
	)
}

export default App