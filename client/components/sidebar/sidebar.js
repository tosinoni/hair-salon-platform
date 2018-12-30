import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Nav, Collapse } from 'reactstrap'
import FontAwesome from 'react-fontawesome'
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar'

import logoImage from '../../assets/logoSmall.png'
import './sidebar.scss'

var perfectScrollbar

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.activeRoute.bind(this)
  }

  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'active' : ''
  }

  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      perfectScrollbar = new PerfectScrollbar(this.refs.sidebar, {
        suppressScrollX: true,
        suppressScrollY: false,
      })
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      perfectScrollbar.destroy()
    }
  }
  render() {
    const { bgColor, routes, logo } = this.props
    let logoImg = null
    let logoText = null
    if (logo !== undefined) {
      if (logo.outterLink !== undefined) {
        logoImg = (
          <a
            href={logo.outterLink}
            className="simple-text logo-mini"
            target="_blank"
            onClick={this.props.toggleSidebar}
          >
            <div className="logo-img">
              <img src={logo.imgSrc} className="image" alt="react-logo" />
            </div>
          </a>
        )
        logoText = (
          <a
            href={logo.outterLink}
            className="simple-text logo-normal"
            target="_blank"
            onClick={this.props.toggleSidebar}
          >
            {logo.text}
          </a>
        )
      } else {
        logoImg = (
          <Link
            to={logo.innerLink}
            className="simple-text logo-mini"
            onClick={this.props.toggleSidebar}
          >
            <div className="logo-img">
              <img src={logo.imgSrc} alt="react-logo" />
            </div>
          </Link>
        )
        logoText = (
          <Link
            to={logo.innerLink}
            className="simple-text logo-normal"
            onClick={this.props.toggleSidebar}
          >
            {logo.text}
          </Link>
        )
      }
    }
    return (
      <div className="sidebar" data={bgColor}>
        <div className="sidebar-wrapper" ref="sidebar">
          <div className="logo">
            <Link to="/" className="simple-text logo-mini" onClick={this.props.toggleSidebar}>
              <div className="logo-img">
                <img src={logo.imgSrc} className="image" alt="react-logo" />
              </div>
            </Link>
            <Link to="/" className="simple-text logo-normal" onClick={this.props.toggleSidebar}>
              {logo.text}
            </Link>
          </div>
          <Nav>
            {routes.map((prop, key) => {
              if (prop.redirect || !prop.isSideBar) return null
              return (
                <li className={this.activeRoute(prop.path)} key={key}>
                  <Link
                    to={prop.path}
                    className="nav-link"
                    activeClassName="active"
                    onClick={this.props.toggleSidebar}
                  >
                    <FontAwesome className="icon" name={prop.icon} />
                    <p className="nav-text">{prop.name}</p>
                  </Link>
                </li>
              )
            })}
          </Nav>
        </div>
      </div>
    )
  }
}

export default Sidebar
