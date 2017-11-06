require("babel-polyfill")
import React from 'react'
import thunkMiddleware from 'redux-thunk'
import api from './redux/middleware/api'
import createLogger from 'redux-logger'
// AppContainer is a necessary wrapper component for HMR
import {
	AppContainer
} from 'react-hot-loader'
import {
	Provider
} from 'react-redux'
import {
	render
} from 'react-dom'
import {
	Router,
	browserHistory,
	hashHistory
} from 'react-router'
import {
	syncHistoryWithStore
} from 'react-router-redux'
import {
	createStore,
	applyMiddleware,
	compose
} from 'redux'
import reducer from './redux/reducers'
import App from './containers/App.tsx'
import {
	NodeAnalysis,
	PageBoard,
	FlowAnalysis
} from './containers'
import routes from './routes'

const loggerMiddleware = createLogger()
let middleware = applyMiddleware(
		thunkMiddleware, // let us dispatch() functions
		api,
		loggerMiddleware  // neat middleware that logs actions
	)

const store = createStore(
	reducer,
	compose(middleware, window.devToolsExtension ? window.devToolsExtension() : f => f)
)
const history = syncHistoryWithStore(hashHistory, store)

const renderDOM = Component => {
	render(<AppContainer>
		<Provider store={store}>
			<Router history={history} routes={routes(Component,history)} />		
		</Provider>
	</AppContainer>,
		document.getElementById('app'))
}

renderDOM(App);

// Hot Module Replacement API
if (module.hot) {
	module.hot.accept('./containers/App', () => {
		renderDOM(App)
	})
}