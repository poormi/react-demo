import React from 'react'
import {
	Route,
	IndexRoute
} from 'react-router'
import {
	Home,
	Detail
} from './containers'

export default (Component, history) => {
	return <Route path="/" component={Component}>
		<IndexRoute component={Home} />
		<Route path="/list/:id/:type/:date" component={Detail} >
		</Route>						
	</Route>
}