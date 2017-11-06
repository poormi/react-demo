import * as React from 'react'
import {
	connect
} from 'react-redux'

import Header from './Header'
import Footer from './Footer'
require('css/main')

interface Props { loading: boolean }

class App extends React.Component<Props, {}> {
	render(){
		const {
			children,
			loading
		} = this.props

		return <div>
			<Header />
			{children}
			<Footer />
			{ loading && <div className="no-data dialog">加载中.</div>}
		</div>
	}
}

export default connect(state => ({
	loading: state.loading
}),{})(App)
