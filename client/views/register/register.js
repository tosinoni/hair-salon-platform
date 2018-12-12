import React from 'react'
import httpClient from '../../httpClient'

// sign up form behaves almost identically to log in form. We could create a flexible Form component to use for both actions, but for now we'll separate the two:
class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fields: { firstname: '', lastname: '', email: '', username:'' }
		};
	}
	

	onInputChange(evt) {
		this.setState({
			fields: {
				...this.state.fields,
				[evt.target.name]: evt.target.value
			}
		})
	}

	onFormSubmit(evt) {
		evt.preventDefault()
		httpClient.register(this.state.fields).then(user => {
			this.setState({ fields: { firstname: '', lastname: '', email: '', username:''} })
			if(user) {
				this.props.onRegisterSuccess(user)
				this.props.history.push('/')
			}
		})
	}
	
	render() {
		const { firstname, lastname, email, username } = this.state.fields
		return (
			<div className='SignUp'>
				<div className='row'>
					<div className='column column-33 column-offset-33'>
						<h1>Sign Up</h1>
						<form onChange={this.onInputChange.bind(this)} onSubmit={this.onFormSubmit.bind(this)}>
							<input type="text" placeholder="First Name" name="firstname" value={firstname} />
                            <input type="text" placeholder="Last Name" name="lastname" value={lastname} />
							<input type="text" placeholder="Email" name="email" value={email} />
							<input type="text" placeholder="Username" name="username" value={username} />
							<button>Register</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default Register