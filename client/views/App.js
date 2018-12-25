// /client/App.js
import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import httpClient from '../httpClient'

import Logout from './logout/logout'
import Home from './home/home'
import Admin from './admin/admin'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { currentUser: httpClient.getCurrentUser() }
  }

  onLoginSuccess(user) {
    this.setState({ currentUser: user })
  }

  logOut() {
    httpClient.logOut()
    this.setState({ currentUser: null })
  }

  render() {
    const { currentUser } = this.state

    return (
      <div className="App">
        <Switch>
          <Route
            path="/logout"
            render={props => {
              return <Logout onLogOut={this.logOut.bind(this)} />
            }}
          />

          <Route
            path="/"
            render={props =>  {
              return currentUser ? <Admin {...props} /> : <Home {...props} onLoginSuccess={this.onLoginSuccess.bind(this)}/>
            }}
          />
        </Switch>
      </div>
    )
  }
}

export default App
