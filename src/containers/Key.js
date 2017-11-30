import React, {
	Component
} from 'react'
import Card from './Card'
import {
	connect
} from 'react-redux'

import isEqual from 'lodash/isEqual'
import otherAction from '../../redux/actions/other'
import {
	fetchData
} from '../../redux/actions/index'
import {
	colors,
	tagList,
	linkMap
} from '../util.js'
import dateFormat from 'dateformat'
import map from 'lodash/map'
const classNames = require('classnames')
const other = ['1102', '1101']

const isToday = (startData) => {
	const today = dateFormat(new Date(), 'yyyy-mm-dd')
	return startData == today
}

class Key extends Component {
	state = {}

	renderTarget = (code, color) => {
		const {
			threshold
		} = this.props, t = tagList[code], link = t.link, list = !!link && link.split(','),
			value = threshold && threshold[code], 
			cardData = {
				title: t.name,
				note: t.note,
				labels: [],
				icon: t.icon,
				code: code,
				color: color
			}
		let params = this.props.params
		
		t.labels.forEach((t, i) => {
			if (!!t.isKey) {
				cardData.labels.push({
					value: t.value,
					name: t.name,
					isLess: t.isLess
				})
			}
		})
		return !list ? <Card key={code} className={t.icon} params={{...params}} cardData={cardData} ></Card> :
			<div className="pr" key={code}> 
				<Card className={t.icon} params={{...params}} cardData={cardData} ></Card>
			</div>
	}

	renderCard = () => {
		return (<div className="links-wrap">
			{
				linkMap.map((v, i) => {
					const n = v.split(',')
					return <div key={i} className={classNames("group","len-"+n.length)}>
					{
						n.map(lCode => this.renderTarget(lCode, colors[i]))
					}
					</div>
				})
			}
		</div>)
	}

	render() {
		return (<section className="content-wrap">
			<h3 className="tc pr">标题</h3>
			{this.renderCard()}
		</section>)
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.entities,
		...state.result
	}
}

export default connect(mapStateToProps, {
	...otherAction,
	fetchLinkTarget
})(Key)