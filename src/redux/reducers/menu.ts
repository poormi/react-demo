import { MENU_REQUEST } from '../constants/ActionTypes'
import {
	initialState
} from './index'
import {stateProps} from '../model'

function headerApp(state:stateProps = initialState, action) {
	switch (action.type) {
		case MENU_REQUEST[1]:
			return Object.assign({}, state, {
				menus: [
					...state.menus
				]
			})
		default:
			return state
	}
}