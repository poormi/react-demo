import React, {
	Component
} from 'react'
import {
	connect
} from 'react-redux' 
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import { formatMoney } from '../util.js'
const classNames = require('classnames/dedupe')

class Card extends Component {

	state = {
		isSearching: false,
		curIndex: 0,
		back: null
	}
  
	prev = (e) => {
		if (e.className.indexOf('disabled') === -1) {
			const {
				limited
			} = this.refs,
				child = limited.children.label,
				i = parseInt(child.dataset.index)
			if (child.previousSibling) {
				this.setState({
					curIndex: i - 1
				})
			}
		} else {
			return
		}
	}

	next = (e) => {
		if (e.className.indexOf('disabled') === -1) {
			const {
				limited
			} = this.refs,
				child = limited.children.label,
				i = parseInt(child.dataset.index)
			if (child.nextSibling) {
				this.setState({
					curIndex: i + 1
				})
			}
		} else {
			return
		}
	}

	flip = isIn => {
		const {
			node,
			limited
		} = this.refs
		if (!limited) {
			node.className = classNames(node.className, {
				out: false,
				in : true
			})
			return
		}
		let front, back
		if (!isIn) {
			back = node
			front = limited
		} else {
			front = node
			back = limited
		}
		this.setState({
			back: back
		})
		front.className = classNames(front.className, {
			out: true,
			in : false
		})
		setTimeout(() => {
			this.state.back.className = classNames(
				this.state.back.className, { 
					in : true,
					out: false
				})
			}, 225)
	}

	renderlabel = (labels) => {
		const {cardData} = this.props
		let hasEmergency = [],
			html = labels.map((label, i) => {
				const labelData = this.props[label.value],
					nowData = labelData ? labelData.nowData : null,
					comData = labelData && parseFloat(labelData.comData) ? ((nowData - labelData.comData) / labelData.comData * 100 || 0).toFixed(2) : null,
					eme = nowData != void 0 && (label.isLess ? label.limited * 100 > nowData : label.limited * 100 < nowData)

				if (eme) {
					hasEmergency.push(i)
				}

				return (<div key={i} className="label-wrap">
					{labels.length>1&&<h5>{label.name}</h5>}
					<div className="label-base">
						<span className="half">{nowData!=void 0?typeof nowData=='number'?formatMoney(Math.abs(nowData),0):Math.abs(nowData)+'%':'— —'}</span>
						<span className={classNames('percent gt half',{'lt':comData&& comData<0})}>{comData!=void 0?Math.abs(comData):'— —'}</span>
					</div>
					<Chart id={label.value+cardData.} color={cardData.color} limited={Math.round(label.limited*100)} data={labelData?labelData.nowlist:[]} />
					{eme && <i className="eme"></i>}
				</div>)			
			})
		return {
			hasEmergency,
			html
		}
	}

	render() {
		const {
			className,
			cardData
		} = this.props, {
			labels
		} = cardData
		if (!cardData) return
		const cardCls = classNames("card-wrap viewport-flip", className, {
				[`tgs-${labels.length}`]: labels.length
			}),
			labelResult = this.renderlabel(labels),
			emes = labelResult.hasEmergency,
			thrCls = classNames("card limited flip", {
				"more": emes && emes.length > 1
			})
		
		return (
			<div name={"yy_"+cardData.title} className={cardCls} onMouseOver={e=>this.flip(true)} onMouseLeave={e=>this.flip(false)} onClick={e=>this.goto(e.label)}>
				<div ref="node" className={classNames("card flip", {in: !emes.length})}>
					<div className="card-title"><h4>{cardData.title}<span className="sub">{cardData.note||''}</span></h4>
					{
						labels.length == 1 && 
						<h5 className="dlb">| {labels[0].name}</h5>
					}
					</div>
					{labelResult && labelResult.html}
				</div>
				{
					emes.length ? <div ref="limited" className={thrCls}>
					{
						 emes.map((i,index) => {
							const label = labels[i], t = label.value, v = this.props[t], d = v?v.nowData:null,txt = `${label.isLess?'低于':'高于'}`
							return <div key={i} data-index={i} className="label-wrap">
								<p>{label.name} ({d!=void 0?typeof d=='number'?d:d+'%':'— —'})</p>
								<p className="mt5">{txt}设定阈值 ({Math.round(label.limited*100)}%)</p>
								<a href="javascript:;" className="btn-click mt10">查看详情</a>
							</div>
						})
					}
				</div> : ''
				}
			</div>
		)
	}
}


const mapStateToProps = (state, ownProps) => {
	const {
		cardData
	} = ownProps
	let newProps = {}
	cardData.labels.forEach(t => {
		newProps = {
			...newProps,
			[t.value]: state.result[`${cardData.}-${t.value}`]
		}
	})
	return newProps
}

export default connect(mapStateToProps, {
	
})(Card)