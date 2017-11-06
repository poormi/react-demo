import React from 'react'
import PropTypes from 'prop-types'

const User = ({
	user
}) => {
	const {
		userName,
		logoutUrl
	} = user

	return (
		<div className="quit fr">
		您好，{userName}。 <a href={logoutUrl} className="q-btn">退出</a>
	</div>
	)
}

User.PropTypes = {
	user: PropTypes.shape({
		name: PropTypes.string,
		logoutUrl: PropTypes.string
	}).isRequired,
}

export default User