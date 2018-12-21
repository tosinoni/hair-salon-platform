import React from 'react'
import Login from '../login/login'
import './home.css'


const Home = (props) => {

	function onLoginSuccess(user) {
		props.onLoginSuccess(user);
	}

	return (
		<div className='home'>
			<Login {...props} onLoginSuccess={onLoginSuccess}/>
		</div>
	)
}

export default Home