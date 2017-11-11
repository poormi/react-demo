import {
	normalize,
	schema,
	Schema
} from 'normalizr'
import fetch from 'isomorphic-fetch'
import * as _ from 'lodash'
import {
	funnelData as chartData
} from '../../mock'
const API_ROOT = require('../config.js').servers.proxy
const URL_LOGIN = ''

type fetchPromise = 
	Promise<object> |
	Promise<never> |
	object

const _fetchWithTimeout = (requestPromise: fetchPromise, timeout:number = 30000): fetchPromise => {
	let timeoutAction = null
	const timerPromise = new Promise((resolve, reject) => {
		timeoutAction = () => {
			reject('请求超时')
		}
	})
	setTimeout(() => {
		timeoutAction()
	}, timeout)

	return Promise.race([requestPromise, timerPromise])
}

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (endpoint:string, schema: Schema): fetchPromise => {
	const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

	return fetch(fullUrl, {
			credentials: "include"
		})
		.then(response =>
			response.json().then(json => {
				if (json.code == 0) {
					if (schema) {
						let r = json.result,
							key
						const data = normalize(r, schema)
						if (_.isEmpty(data.result)) { //make sure schema has a return
							const result = _.values(schema)[0]
							if (Array.isArray(result)) {
								key = result[0]['key']
							} else {
								key = result['key']
							}
							return Object.assign({}, {
								result: {
									[key]: []
								}
							})
						}
						return Object.assign({}, data)
					} else {
						return json.result //just return what it returned without schema
					}
				} else if (json.code == 99) {
					window.location.href = json.loginUrl || URL_LOGIN //authorized info has expired and need to login
					return Promise.reject(json)
				} else {
					return Promise.reject(json) //catch the other exceptions
				}
			})
		)
}

const menuSchema: schema.Entity = new schema.Entity('menus', {}, {
	idAttribute: "menuId"
})
const channelSchema = {
	'getDataApit': new schema.Array(menuSchema)
}

export const Schemas = {
	MENU_ARRAY: [menuSchema],
	CHANNEL_ARRAY: channelSchema,
	DEPT_FUNNEL_ARRAY: {
		"web/getFlow": [channelSchema]
	}
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API'

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
	const callAPI = action[CALL_API]
	if (typeof callAPI === 'undefined') {
		return next(action)
	}

	let {
		endpoint
	} = callAPI
	const {
		schema,
		type,
		params
	} = callAPI

	if (typeof endpoint === 'function') {
		endpoint = endpoint(store.getState())
	}

	if (typeof endpoint !== 'string') {
		throw new Error('Specify a string endpoint URL.')
	}

	if (params != void 0)
		endpoint = `${endpoint}?req=${JSON.stringify(params)}`

	const actionWith = (data):object => {
		const finalAction = Object.assign({}, action, data)
		delete finalAction[CALL_API]
		return finalAction
	}

	const [requestType, successType, failureType] = type
	next(actionWith({
		type: requestType
	}))

	return (<Promise<object|never>>callApi(endpoint, schema)).then(
		response => next(actionWith({
			response,
			...callAPI,
			type: successType
		})),
		error => next(actionWith({
			type: failureType,
			error: error.desc || 'Something bad happened'
		}))
	)
}