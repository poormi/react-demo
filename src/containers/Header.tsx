import * as React from 'react'
import PropTypes from 'prop-types'
import {
	connect
} from 'react-redux'
import {
	loadMenu,
	loadUser
} from '../redux/actions'
import {
	stateProps,
	mapStateToProps
} from '../redux/model'
import Menu from '../components/common/Menu'
import User from '../components/common/User'
import map from 'lodash/map'

const loadData = props => {
	props.loadMenu()
	props.loadUser()
}

interface headerProps extends stateProps{
	loadMenu?: () => any, 
	loadUser?: () => any 
}

class Header extends React.Component<headerProps> {
	componentWillMount(){
		//loadData(this.props)
	}

	render() {
		const {
			user,
			menus
		} = this.props
		return <div className="rt-header">
			<div className="wrap">
				<Menu items={menus} />
				<User user={user} />
			</div>
		</div>
	}
}

class headerMap implements mapStateToProps<headerProps>{
	 handler(state: stateProps, ownProps: headerProps): headerProps {
		const {
			result: {
				menus:ms = [] 
			},
			userState
		} = state
		let menus = []
		if(Array.isArray(ms)) menus = ms
		else menus = map(ms, (m, i) => m)
		 
		return {
			...userState,
			menus
		}
	}
}

const mapState = new headerMap()

export default connect(mapState.handler, {
	loadMenu,
	loadUser
})(Header)
