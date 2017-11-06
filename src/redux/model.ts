export interface stateProps {
	user: {
		userName: string
	},
	menus: Array<object>,
	[otherState: string]: any
}