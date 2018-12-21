// /client/App.js
import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import httpClient from '../httpClient'

import NavBar from '../components/navbar/NavBar'
import Login from './login/login'
import Logout from './logout/logout'
import Register from './register/register'
import VIP from './vip/vip'
import Home from './home/home'
import Dashboard from './dashboard/dashboard'

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

          {/* the sign up component takes an 'onRegisterSuccess' prop which will perform the same thing as onLoginSuccess: set the state to contain the currentUser */}
          <Route
            path="/register"
            render={props => {
              return <Register {...props} onRegisterSuccess={this.onLoginSuccess.bind(this)} />
            }}
          />

          <Route
            path="/vip"
            render={() => {
              return currentUser ? <VIP /> : <Redirect to="/login" />
            }}
          />

          <Route
            path="/"
            render={props =>  {
              console.log(this.state.currentUser)
              return currentUser ? <Dashboard /> : <Home {...props} onLoginSuccess={this.onLoginSuccess.bind(this)}/>
            }}
          />
        </Switch>
      </div>
    )
  }
}

export default App
