
// /client/App.js
import React, { Component } from "react";
import { Switch, Route, Redirect } from 'react-router-dom'
import httpClient from '../httpClient'

import NavBar from '../components/NavBar'
import Login from './login/login'
import Logout from './logout/logout'
import Register from './register/register'
import VIP from './vip/vip'
import Home from './home/home'

class App extends Component {
  state = { currentUser: httpClient.getCurrentUser() }

	onLoginSuccess(user) {
		this.setState({ currentUser: user})
	}

	logOut() {
		httpClient.logOut()
		this.setState({ currentUser: null })
	}
	
	render() {
		const { currentUser } = this.state
		return (
			<div className='App container'>

				<NavBar currentUser={currentUser} />

				<Switch>

					<Route path="/login" render={(props) => {
						return <Login {...props} onLoginSuccess={this.onLoginSuccess.bind(this)} />
					}} />

					<Route path="/logout" render={(props) => {
						return <Logout onLogOut={this.logOut.bind(this)} />
					}} />

					{/* the sign up component takes an 'onRegisterSuccess' prop which will perform the same thing as onLoginSuccess: set the state to contain the currentUser */}
					<Route path="/register" render={(props) => {
						return <Register {...props} onRegisterSuccess={this.onLoginSuccess.bind(this)} />
					}} />

					<Route path="/vip" render={() => {
						return currentUser
							? <VIP />
							: <Redirect to="/login" />
					}} />

					<Route path="/" component={Home} />

				</Switch>
			</div>
		)
	}
}

export default App;