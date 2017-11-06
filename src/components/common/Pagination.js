import React, {
	Component
} from 'react'
import PropTypes from 'prop-types'
const classNames = require('classnames')
require('css/pagination')

export default class Pagination extends Component {
	static propTypes = {
		className: PropTypes.string,
		total: PropTypes.number,
		pageSize: PropTypes.string,
		edgeNum: PropTypes.string,
		middleNum: PropTypes.string,
		curPage: PropTypes.string,
		onJump: PropTypes.func
	}

	static defaultProps = {
		total: 0,
		edgeNum: '2',
		middleNum: '3',
		pageSize: '10',
		onJump: () => {}
	}

	state = {
		curPage: this.props.curPage || 1,
		pageNum: Math.ceil(this.props.total / this.props.pageSize) || 1,
	}

	jump = (pn) => {
		if (isNaN(parseInt(pn))) return;
		const {
			total,
			pageSize
		} = this.props, maxPn = Math.ceil(this.props.total / this.props.pageSize) || 1
		let pNum = parseInt(pn)
		pNum = pNum > maxPn ? maxPn : pNum <= 0 ? 1 : pNum
		this.setState({
			curPage: pNum
		})
		this.props.onJump(pNum)
	}

	prev = () => {
		let {
			curPage
		} = this.state
		if (curPage > 1) {
			curPage = parseInt(curPage) - 1
			this.setState({
				curPage: curPage
			})
			this.props.onJump(curPage)
		}
	}

	next = () => {
		const {
			total,
			pageSize
		} = this.props,
			pageNum = Math.ceil(total / pageSize)
		let {
			curPage
		} = this.state
		if (curPage < pageNum) {
			curPage = parseInt(curPage) + 1
			this.setState({
				curPage: curPage
			})
			this.props.onJump(curPage)
		}
	}

	renderPage = (i, pn) => {
		const {
			edgeNum
		} = this.props, {
				curPage
			} = this.state,
			edgeLen = parseInt(edgeNum), cp = parseInt(curPage)
		if (i == cp || i == cp + 1 || i == cp - 1 || i <= edgeLen || i > pn - edgeLen) {
			return <a href="javascript:;" className={classNames("pn",{"cur": cp==i})} key={i} onClick={()=>this.jump(i)}>{i}</a>
		} else if (1 == cp && (i == edgeLen + 1 || i == pn - edgeLen)) {
			return '...'
		} else if ((cp - 1 > edgeLen + 1 || cp == 1) && i == edgeLen + 1) {
			return '...'
		} else if (cp + 1 < pn - edgeLen && i == pn - edgeLen) {
			return '...'
		}
	}

	render() {
		const {
			total,
			pageSize,
			className
		} = this.props, pageNumber = Math.ceil(total / pageSize), {
			curPage
		} = this.state
		let h = []
		for (let i = 1; i <= pageNumber; i++) {
			h.push(i)
		}
		return (<div className={classNames("pagination",className)}>
			<a href="javascript:;" className={classNames("prev",{"disable": curPage<2})} onClick={this.prev}>上一页</a>
			<div className="pn-wrap ml5 mr5">{ h.map(i=>this.renderPage(i,pageNumber)) }</div>
			<a href="javascript:;" className={classNames("next",{"disable": curPage>=pageNumber})} onClick={this.next}>下一页</a>
			<div className="ml20 jump-wrap">
				向第
				<input ref="input" className="input ml5 mr5 tc" type="text" />页
				<button className="ml10 button" onClick={()=>this.jump(this.refs.input.value)}>跳转</button>
			</div>
		</div>)
	}
}