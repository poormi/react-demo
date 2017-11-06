import * as React from 'react'
import PropTypes from 'prop-types'
import {
	connect
} from 'react-redux'
import {
	loadMenu,
	loadUser
} from '../redux/actions'
import Menu from '../components/common/Menu'
import User from '../components/common/User'
import map from 'lodash/map'

const loadData = props => {
	props.loadMenu()
	props.loadUser()
}

interface Props {
	user: object,
	navs: Array<{
		menuId: number|string,
		parentId?: number|string,
		name: string,
		link: string,
		subMenu: object[]
	}>,
	loadMenu: () => any, 
	loadUser: () => any 
}

class Header extends React.Component<Props, { user: { userName: '用户' }, navs: any[] }> {
	componentWillMount(){
		//loadData(this.props)
	}

	render() {
		const {
			user,
			navs
		} = this.props
		return <div className="rt-header">
			<div className="wrap">
				<Menu items={navs} />
				<User user={user} />
			</div>
		</div>
	}
}

const mapStateToProps = (state: any, ownProps: any): object => {
	const {
		result: {
			menus = []
		},
		userState
	} = state
	let navs = []
	if(Array.isArray(menus)) navs = menus
	else navs = map(menus, (m, i) => m)
	 
	return {
		...userState,
		navs
	}
}

export default connect(mapStateToProps, {
	loadMenu,
	loadUser
})(Header)
