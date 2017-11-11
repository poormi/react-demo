import {
	combineReducers
} from 'redux'
import {
	routerReducer as routing
} from 'react-router-redux'
import * as ActionTypes from '../constants/ActionTypes'
import * as _ from 'lodash'
import {
	chartData
} from '../../mock'
import {
	stateProps
} from '../model'

export const initialState:stateProps = <stateProps>{
	user: {
		userName: '用户'
	},
	menus: []
}

const handleLineData = (data: object[], target: string): any[] => {
	if(!data) return []
	return data.map((v, i) => {
		return v[target]
	})
}

// Updates an entity cache in response to any action with response.entities.
const result = (state: stateProps = initialState, action): stateProps => {
	if (action.response && action.response.result) {
		return Object.assign({}, state, action.response.result)
	}

	return state
}

const userState = (state: stateProps = initialState, action): stateProps => {
	let result = action.response || {},
		target = action.params && action.params.target

	switch (action.type) {
		case ActionTypes.USER_REQUEST[1]:
			return Object.assign({}, state, result)
		default:
			return state
	}
}

// Updates error message to notify about the failed fetches.
const errorMsg = (state: stateProps = initialState, action): string | null => {
	const {
		type,
		error
	} = action

	if (error) {
		return `${type}-${error}`
	}

	return null
}

const loading = (state: stateProps = initialState, action): boolean | null=> {
	switch(action.type){
		case ActionTypes.MENU_REQUEST[1]:
			return false
		default:
			return null
	}
}

export default combineReducers({
	result,
	userState,
	errorMsg,
	loading,
	routing
})