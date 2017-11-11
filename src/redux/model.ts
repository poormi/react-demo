export type menu = {
	menuId: number|string,
	parentId?: number|string,
	name: string,
	link: string,
	subMenu: object[]
}

export interface stateProps {
	user: {
		userName: string
	},
	menus: Array<menu>,
	[otherState: string]: any
}

import {stateProps} from '../redux/model'

export declare interface mapStateToProps<T extends stateProps>{
	handler(state: stateProps, ownProps: T): T
}