import { store, persistor } from './store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import AppContainer from './AppContainer'
import Toast from './components/Toast'
import '../global.css'

const App = () => {
	return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<AppContainer />
					<Toast />
				</PersistGate>
			</Provider>
	)
}

export default App
