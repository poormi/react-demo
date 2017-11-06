import React, {
	Component
} from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import without from 'lodash/without'
import find from 'lodash/find'
import findKey from 'lodash/findKey'
import findIndex from 'lodash/findIndex'
import values from 'lodash/values'
import keys from 'lodash/keys'
const classNames = require('classnames')

export default class Dropdown extends Component {
	static propTypes = {		
		id: PropTypes.string,
		className: PropTypes.string,
		options: PropTypes.shape({
			max: PropTypes.string,
			name: PropTypes.string,
			aliase: PropTypes.string,
			textName: PropTypes.string,
			valName: PropTypes.string,
			defaultValue: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.array
			]),
			onSelect: PropTypes.func,
			searchEvt: PropTypes.func
		})
	}

	state = {
		expanded: false,
		selected: null,
		ALL: 'ALL',
		dropdown: 'dropdown',
		defaultClass: 'setting',
		input: 'input',
		list: 'list',
		value: '',
		error: false,
		scrollTop: 0
	}

	static defaultProps = {
		id: 'dp_' + Math.random(),
		options: {
			textName: 'name',
			valName: 'id',
			items: [],
			max: "1",
			onSelect: () => {}
		}
	}

	componentWillMount() {
		const {
			max,
			items,
			defaultValue
		} = this.props.options
		if (max > 1) {
			let {
				selected
			} = this.state
			selected = []
			map(items, v => {
				if(v.targets){
					map(v.targets, (t, i) => {
						if (t.selected)
							selected.push(t.code)
					})
				}
			})
			this.setState({
				selected: selected
			})
		} else if(!isEmpty(items) && defaultValue){
			this.setSelected()
		}
	}

	componentDidMount() {
		document.addEventListener('click', this.hide, false)
		this.scrollTo()
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.hide, false)
	}

	componentWillReceiveProps(nextProps){
		const {
			items,
			defaultValue,
			textName,
			valName
		} = nextProps.options, selected = this.state.selected
		if(!isEmpty(items) && defaultValue && selected == void 0){
			this.setSelected(items)
		}
	}

	setSelected = (data) => {
		const {
			defaultValue,
			valName,
			textName
		} = this.props.options
		let selected, items = data || this.props.options.items
		if(Array.isArray(items)) {
			selected =  defaultValue
		}else{
			selected = find(items, item => {
				return defaultValue === item[valName] || defaultValue === item[textName]
			})
		}
		
		if(selected){
			this.setState({
				selected
			})
		}
	}

	scrollTo = () => {
		const {
			defaultValue,
			items,
			valName,
			textName
		} = this.props.options, {
			list,
			dropdown
		} = this.refs
		let index = 0
		if (defaultValue) {
			if (Array.isArray(items)) {
				index = findIndex(items, o => o == defaultValue)
			} else {
				find(items, o => {
					if (o[valName] == defaultValue || o[textName] == defaultValue) {
						return
					}
					index++
				})
			}
			list.scrollTop = (index - 1) * dropdown.clientHeight
		}
	}

	hide = (e) => {
		const event = e || event
		if (this.refs.dropdown && !this.refs.dropdown.contains(event.target)) {
			this.setState({
				expanded: false
			})
		}
	}

	toggle = () => {
		const {
			selected
		} = this.state,{
			max,
			valName,
			defaultValue
		} = this.props.options
		if(max > 1 && defaultValue){
			const arr = map(defaultValue, v => {
				return v[valName]
			})
			this.setState({
				selected: arr
			})
		}
		this.setState(preState => ({
			expanded: !preState.expanded
		}))
	}

	select = (item, expanded) => {
		const {
			valName,
			maxData,
			minData
		} = this.props.options,
			result = typeof item === 'string' ? item : item[valName]
		if (maxData && maxData < result) return
		else if (minData && minData > result) return
		this.setState({
			selected: item,
			expanded: !!expanded
		})
		this.props.options.onSelect(result, this)
	}

	setDefault = (expanded) => {
		const {
			items
		} = this.props.options
		if (items && items.length)
			this.select(items[0], expanded)
	}

	check = (item) => {
		const {
			selected = []
		} = this.state, {
			max,
			valName,
			required
		} = this.props.options
		if (selected.indexOf(item[valName]) === -1) {
			if (selected.length < max) {
				selected.push(item[valName])
				this.setState({
					selected: selected
				})
			} else {
				//提示错误
			}
		} else {
			if (item[valName] == required) {
				return;
			}
			this.setState({
				selected: without(selected, item[valName])
			})
		}

	}

	keydown = (code) => {
		if (code == 13) {
			this.search()
		}
	}

	inputChange = () => {
		this.setState({
			value: this.refs.input.value
		})
	}

	submit = () => {
		const {
			selected
		} = this.state
		if (selected.length) {
			this.props.options.onSelect(selected)
			this.setState({
				expanded: false
			})
		} else {
			//提示至少选择一项
		}

	}

	clear = () => {
		const {
			searchEvt
		} = this.props.options
		this.refs.input.value = ''
		this.setState({
			value: ''
		})
		searchEvt('')
	}

	search = () => {
		const {
			searchEvt
		} = this.props.options, {
			value
		} = this.state
		if (value != '') {
			searchEvt(value)
		} else {
			alert('请输入搜索条件')
			this.refs.input.focus()
		}
	}

	renderItemChild = (c, i) => {
		const {
			selected
		} = this.state, {
			required
		} = this.props.options
		return <dd key={i} className={classNames({'cur':selected.indexOf(c.code)!==-1,'disabled': required==c.code})} onClick={()=>this.check(c)}>
			<i></i>{c.title}
		</dd>
	}

	renderItem = (item, index) => {
		if (!item) return;
		else {
			const {
				aliase,
				textName,
				valName,
				max,
				minData,
				maxData,
				items
			} = this.props.options, {
				ALL,
				selected
			} = this.state, multi = max > 1
			let on = !index || index == ALL,
				text = item,
				value = item,
				disabled = false
			if (typeof item === 'object') {
				text = item[textName]
				value = item[valName]
			}
			if (selected) {
				if (typeof selected === 'string') {
					on = selected == text
				} else {
					on = selected[textName] == text
				}
			}else if(!Array.isArray(items)){
				const codes = keys(items)
				on = codes.indexOf(text) == 0 || codes.indexOf(value) == 0
			}
			if (maxData && maxData < value) {
				disabled = true
			} else if (minData && minData > value) {
				disabled = true
			}
			return multi ?
				<li key={index} className="drop-item">
				 <div className="fl">
					<h5 className="fl mr10">{text}:</h5>
					<dl className="ovh">{item.targets.map(this.renderItemChild)}</dl>
				 </div> 
				</li> :
				<li key={index} className={classNames('drop-item',{on:on,disabled: disabled})} onClick={()=>this.select(item)}>
					{text == ALL ? aliase : text}
				</li>
		}
	}

	render() {
		const {
			className,
			options
		} = this.props,{
			items,
			textName,
			aliase,
			searchEvt,
			max,
			required,
			error
		} = options, {
				expanded,
				selected,
				ALL,
				dropdown,
				defaultClass,
				input,
				list
			} = this.state,
			multi = max > 1,
			computedClass = classNames(defaultClass, className, {
				open: expanded,
				multi: multi
			})
		let title = aliase

		if (selected) { //current selected
			if (typeof selected === 'string') {
				title = selected
			} else if (selected[textName] != ALL) {
				title = selected[textName]
			}
		}else if(!isEmpty(items)){ //set first item as title
			if(Array.isArray(items)){
				if(typeof items[0] === 'string'){
					title = items[0]
				}else{
					title = items[0][textName]
				}
			}else {
				const vals = values(items)[0][textName]
				if(vals && vals !== ALL)
					title = vals 
			}
		}

		return (<div ref={dropdown} className={computedClass} >
			<span className="setbtn" onClick={this.toggle}>
					<b className="ell" title={multi?aliase:title}>{multi?aliase:title}</b><i></i>
				</span>
			<div ref={list} className={classNames("drop-down",{"check": multi})} onWheel={this.scroll} onScroll={this.scroll}>
				{
					searchEvt && 
					<div className="search-wrap">
						<input ref={input} className="input ml5" placeholder="请输入搜索条件" onChange={this.inputChange} onKeyDown={(e)=>this.keydown(e.keyCode)} /><button className="btn" onClick={this.search}>搜&nbsp;索</button>
						<a href="javascript:;" className="a ml10" onClick={this.clear}>重置</a>
					</div>
				}
				{
					multi &&
					<h5>最多选择{max}项</h5>
				}
				<ul className="list"> 
					{ map(items,this.renderItem) } 
				</ul>
				{
					multi &&
					<div className="tc mb10 mt15">
						<button className="button" onClick={this.submit}>确定</button>
						{error&&<span className="err-tip">{error}</span>}
					</div>
				}
			</div>
			</div>)
	}
}