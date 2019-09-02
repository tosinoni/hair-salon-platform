import React from 'react'

import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Form,
  Container,
  Row,
  FormGroup,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap'

import Button from '../../components/customButton/customButton'
import FontAwesome from 'react-fontawesome'
import httpClient from '../../httpClient'
import logoImage from '../../assets/logo.png'
import Swal from 'sweetalert2'
import { isStringValid } from '../../util'

import './login.scss'

function getInitialState() {
  return {
    fields: {
      username: '',
      usernameState: '',
      password: '',
    },
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = getInitialState()
    this.setLoginFieldState = this.setLoginFieldState.bind(this)
    this.resetAllFieldStates = this.resetAllFieldStates.bind(this)
  }

  setLoginFieldState(input, fieldName, stateName) {
    const fields = this.state.fields
    fields[fieldName] = input
    fields[stateName] = isStringValid(input) ? 'has-success' : 'has-danger'
    this.setState({ fields })
  }

  resetAllFieldStates() {
    this.setState(getInitialState())
  }

  setUsername(evt) {
    this.setLoginFieldState(evt.target.value, 'username', 'usernameState')
  }

  setPassword(evt) {
    this.setLoginFieldState(evt.target.value, 'password', 'passwordState')
  }

  onFormSubmit(evt) {
    evt.preventDefault()
    let fields = this.state.fields
    let formValid = true

    if (fields.usernameState !== 'has-success') {
      fields.usernameState = 'has-danger'
      formValid = false
    }

    if (fields.passwordState !== 'has-success') {
      fields.passwordState = 'has-danger'
      formValid = false
    }

    this.setState({ fields })

    if (formValid) {
      httpClient.logIn(this.state.fields).then(res => {
        if (res.success) {
          this.resetAllFieldStates()
          const token = httpClient.setToken(res.token)
          this.props.history.push('/')
          Swal('Login Successful!!!', '', 'success')
        } else {
          Swal('Oops!!', res.error, 'error')
        }
      })
    }
  }

  render() {
    const { username, password, usernameState, passwordState } = this.state.fields
    return (
      <div className="LogIn container login-container">
        <Form className="login-form" onSubmit={this.onFormSubmit.bind(this)}>
          <Card>
            <CardHeader>
              <img className="login-logo img-responsive" src={logoImage} />
            </CardHeader>
            <CardBody>
              <FormGroup className={'has-label ' + usernameState}>
                <label>Username: * </label>
                <Input
                  type="text"
                  name="username"
                  value={username}
                  onChange={e => this.setUsername(e)}
                />
              </FormGroup>
              <FormGroup className={'has-label ' + passwordState}>
                <label>Password: * </label>
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={e => this.setPassword(e)}
                />
              </FormGroup>
            </CardBody>
            <CardFooter className="text-center">
              <Button color="primary" type="submit" onClick={this.onFormSubmit.bind(this)}>
                Log In
              </Button>
            </CardFooter>
          </Card>
        </Form>
      </div>
    )
  }
}

export default Login
