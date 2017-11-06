import {
	CALL_API,
	Schemas
} from '../middleware/api'

import * as ActionTypes from '../constants/ActionTypes'

const getMenu = () => ({
	[CALL_API]: {
		type: ActionTypes.MENU_REQUEST,
		endpoint: `menu`,
		schema: Schemas.MENU_ARRAY
	}
})

// Relies on Redux Thunk middleware.
export const loadMenu = () => (dispatch, getState) => {
	const {
		menus
	} = getState()
	if (!menus) {
		return dispatch(getMenu())
	} else
		return null
}

export const loadUser = () => (dispatch, getState) => {
	const {
		user
	} = getState()
	if (!user) {
		return dispatch({
			[CALL_API]: {
				type: ActionTypes.USER_REQUEST,
				endpoint: 'user'
			}
		})
	}
}