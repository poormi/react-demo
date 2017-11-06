import React, {
	Component
} from 'react'
import PropTypes from 'prop-types'

export default class List extends Component {
	static propTypes = {
		current: PropTypes.string,
		items: PropTypes.arrayOf(PropTypes.shape({
			menuId: PropTypes.number.isRequired,
			parentId: PropTypes.number,
			name: PropTypes.string.isRequired,
			link: PropTypes.string.isRequired,
			subMenu: PropTypes.array,
			fold: PropTypes.bool
		})).isRequired,
		isLeft: PropTypes.string
	}

	static defaultProps = {
		current: '001',
		items: []
	}

	foldMenu = (event) => {
		const $t = event.currentTarget.parentElement;
		if ($t.className.indexOf('fold') < 0) {
			$t.className += 'fold'
		} else {
			$t.className = $t.className.replace('fold', '');
		}
	}

	renderSubMenuItem = (subMenu) => {
		let parentId = 0
		const html = subMenu.length &&
			<dl className='l2-list'>
			{
				subMenu.map((m,i)=>{
					const location = document.location.href, isCur = location === m.link
					if(isCur) parentId = m.parentId
					return <dd key={m.menuId} className={isCur?'cur':''}><a href={m.link}>{m.name}</a></dd>
				})
			}
		</dl>

		return {
			html,
			parentId
		}
	}

	renderMenuItem = (menu, index) => {
		if (!menu) return;
		const {
			current
		} = this.props
		if (menu.parentId == current) {
			const {
				parentId,
				html
			} = this.renderSubMenuItem(menu.subMenu || [])
			return <li key={menu.menuId} className={(menu.menuId == parentId)?'':'fold' }>
				<a href='javascript:' className='l1-item' onClick={(e)=>this.foldMenu(e)}><em className="open"></em>{menu.name}</a>
				{
					menu.subMenu.length && html
				}
			</li>
		} else {
			return <li key={menu.menuId} id={menu.menuId}>
				<a href={menu.link} className={menu.menuId==current?'cur':''}>{menu.name}</a>
			</li>
		}
	}

	render() {
		const {
			items,
			isLeft
		} = this.props
		return (
			<ul className={isLeft=='true'?'l1-list':'menu-list clearfix fl'}>
				{items&&items.map(this.renderMenuItem)}
			</ul>
		)
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.items !== nextProps.items;
	}
}