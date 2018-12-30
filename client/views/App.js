// /client/App.js
import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import httpClient from '../httpClient'

import Home from './home/home'
import Admin from './admin/admin'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { currentUser: httpClient.getCurrentUser() }
  }

  logOut() {
    httpClient.logOut()
    this.setState({ currentUser: null })
  }

  render() {
    const currentUser = httpClient.getCurrentUser()

    return (
      <div className="App">
        <Switch>
          <Route
            path="/"
            render={props =>  {
              return currentUser ? <Admin {...props} onLogOut={this.logOut.bind(this)} /> : <Home {...props}/>
            }}
          />
        </Switch>
      </div>
    )
  }
}

export default App
