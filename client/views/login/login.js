import React from 'react'
import httpClient from '../../httpClient'
import logoImage from '../../assets/logoSmall.png'
import './login.css'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: { username: '', password: '' },
    }
  }

  onInputChange(evt) {
    this.setState({
      fields: {
        ...this.state.fields,
        [evt.target.name]: evt.target.value,
      },
    })
  }

  onFormSubmit(evt) {
    evt.preventDefault()
    httpClient.logIn(this.state.fields).then(user => {
      this.setState({ fields: { username: '', password: '' } })
      if (user) {
        this.props.onLoginSuccess(user)
        this.props.history.push('/')
      }
    })
  }

  render() {
    const { username, password } = this.state.fields
    return (
      <div className="LogIn container login-container">
        <div className="col-md-4 well">
          <img className="login-logo img-responsive" src={logoImage} />
          <form onChange={this.onInputChange.bind(this)} onSubmit={this.onFormSubmit.bind(this)}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                className="form-control"
              />
            </div>
            <div className="form-group text-center login-button">
              <button className="btn btn-primary">Log In</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
