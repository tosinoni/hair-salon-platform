import React from 'react'
import Login from '../login/login'
import './home.scss'


const Home = (props) => {

	function onLoginSuccess(user) {
		props.onLoginSuccess(user);
	}

	return (
		<div className='home'>
			<Login {...props}/>
		</div>
	)
}

export default Home