import React from 'react'
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar'
import { Route, Switch, Redirect } from 'react-router-dom'
import { EXECUTIVE } from '../../constants/constants'


import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import httpClient from '../../httpClient'

import routes from '../../routes'
import logoImage from '../../assets/logoSmall.png'
import './admin.scss'

var perfectScrollbar

class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      backgroundColor: 'black',
      isExecutive: false,
      sidebarOpened: document.documentElement.className.indexOf('nav-open') !== -1,
      appRoutes: [],
    }

    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.handleBgClick = this.handleBgClick.bind(this)

    httpClient.getLoggedInUser().then(user => {
      if (user && user.success && user.data) {
        const isExecutive = user.data.role === EXECUTIVE
        this.setState({ isExecutive: isExecutive })
      }

      this.getRoutes(routes)
    })
  }

  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      document.documentElement.className += ' perfect-scrollbar-on'
      document.documentElement.classList.remove('perfect-scrollbar-off')
      perfectScrollbar = new PerfectScrollbar(this.refs.mainPanel, { suppressScrollX: true })
      let tables = document.querySelectorAll('.table-responsive')
      for (let i = 0; i < tables.length; i++) {
        perfectScrollbar = new PerfectScrollbar(tables[i])
      }
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      perfectScrollbar.destroy()
      document.documentElement.className += ' perfect-scrollbar-off'
      document.documentElement.classList.remove('perfect-scrollbar-on')
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === 'PUSH') {
      if (navigator.platform.indexOf('Win') > -1) {
        let tables = document.querySelectorAll('.table-responsive')
        for (let i = 0; i < tables.length; i++) {
          perfectScrollbar = new PerfectScrollbar(tables[i])
        }
      }
      document.documentElement.scrollTop = 0
      document.scrollingElement.scrollTop = 0
      this.refs.mainPanel.scrollTop = 0
    }
  }

  // this function opens and closes the sidebar on small devices
  toggleSidebar() {
    document.documentElement.classList.toggle('nav-open')
    this.setState({ sidebarOpened: !this.state.sidebarOpened })
  }

  getRoutes(routes) {
    const appRoutes =  routes.map((prop, key) => {
      if(prop.isAdmin && !this.state.isExecutive) {
        return
      }

      if (prop.redirect) {
        return <Redirect from={prop.path} to={prop.pathTo} key={key} />
      }
      return <Route path={prop.path} component={prop.component} key={key} />
    })

    this.setState({ appRoutes: appRoutes })
  }

  handleBgClick(color) {
    this.setState({ backgroundColor: color })
  }

  getBrandText(path) {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].path) !== -1) {
        return routes[i].name
      }
    }
    return 'Brand'
  }

  render() {
    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          routes={routes}
          isExecutive={this.state.isExecutive}
          bgColor={this.state.backgroundColor}
          logo={{
            outterLink: '' + this.props.location.pathname,
            text: 'Olalere Law Office',
            imgSrc: logoImage,
          }}
          toggleSidebar={this.toggleSidebar}
        />
        <div className="main-panel" ref="mainPanel" data={this.state.backgroundColor}>
          <Header
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
            toggleSidebar={this.toggleSidebar}
            sidebarOpened={this.state.sidebarOpened}
          />
          <Switch>{this.state.appRoutes}</Switch>
        </div>
      </div>
    )
  }
}

export default Admin
