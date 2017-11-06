import React, {
	Component
} from 'react'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'
const classNames = require('classnames')

let date = new Date()

export default class DatePicker extends Component {
	static propTypes = {
		id: PropTypes.string,
		defv: PropTypes.string.isRequired,
		maxDate: PropTypes.string,
		onpicked: PropTypes.func,
		className: PropTypes.string
	}

	static defaultProps = {
		id: 'dp_' + Math.random(),
		defv: dateFormat(date, 'yyyy-mm-dd'),
		maxDate: '%y-%M-%d'
	}

	showDatePicker = () => {
		const _props = this.props,
			_this = this;
		WdatePicker({
			el: _props.id,
			maxDate: _props.maxDate,
			isShowClear: false,
			readOnly: true,
			qsEnabled: false,
			isShowToday: false,
			isShowOK: false,
			onpicked: function() {
				this.className = this.className.replace('open', '');
				this.blur();
				_props.onpicked(this.value)
			}
		})
	}

	render() {
		const {
			id,
			defv,
			className
		} = this.props
		return (<input id={id} type="text" className={classNames("date-selector Wdate",className)}	defaultValue={defv} onClick = {this.showDatePicker} readOnly="" />)
	}
}