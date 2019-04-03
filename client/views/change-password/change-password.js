import React from 'react'

import './change-password.scss'
import httpClient from '../../httpClient'

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
} from 'reactstrap'

import Swal from 'sweetalert2'

function getInitialState() {
  return {
    fields: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  }
}

class ChangePassword extends React.Component {
  constructor(props) {
    super(props)

    this.state = getInitialState()
  }

  resetAllFieldStates() {
    this.setState(getInitialState())
  }

  setCurrentPassword(evt) {
    const input = evt.target.value
    const fields = this.state.fields

    fields.currentPassword = input
    fields.currentPasswordState = input ? 'has-success' : 'has-danger'

    this.setState({ fields })
  }

  setNewPassword(evt) {
    const input = evt.target.value
    let fields = this.state.fields

    fields.newPassword = input
    fields.newPasswordState = input ? 'has-success' : 'has-danger'
    fields.confirmPasswordState =
      fields.newPassword === fields.confirmPassword ? 'has-success' : 'has-danger'

    this.setState({ fields })
  }

  setConfirmPassword(evt) {
    const input = evt.target.value
    let fields = this.state.fields

    fields.confirmPassword = input
    fields.confirmPasswordState =
      fields.newPassword === fields.confirmPassword ? 'has-success' : 'has-danger'

    this.setState({ fields })
  }

  isChangePasswordFormValid() {
    let fields = this.state.fields
    let formValid = true

    if (fields.currentPasswordState !== 'has-success') {
      fields.currentPasswordState = 'has-danger'
      formValid = false
    }

    if (fields.newPasswordState !== 'has-success') {
      fields.newPasswordState = 'has-danger'
      formValid = false
    }

    if (fields.confirmPasswordState !== 'has-success') {
      fields.confirmPasswordState = 'has-danger'
      formValid = false
    }

    this.setState({ fields })
    return formValid
  }

  changePasswordSubmit(evt) {
    evt.preventDefault()

    if (this.isChangePasswordFormValid()) {
      httpClient.changePassword(this.state.fields).then(res => {
        if (res.success) {
          Swal('Yaah', 'Password changed successful', 'success')
          this.resetAllFieldStates()
        } else {
          Swal('Oops', res.error, 'error')
        }
      })
    } else {
      Swal('Save Failed!!!', 'Please address the errors in red', 'error')
    }
  }

  render() {
    const { currentPassword, newPassword, confirmPassword } = this.state.fields

    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="change-password">
              <CardHeader>
                <CardTitle tag="h4">Change Password</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className="pr-md-1" md="6">
                    <FormGroup className={'has-label ' + this.state.fields.currentPasswordState}>
                      <label>Current Password: * </label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={e => this.setCurrentPassword(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="6">
                    <FormGroup className={'has-label ' + this.state.fields.newPasswordState}>
                      <label>New Password: * </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={e => this.setNewPassword(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="6">
                    <FormGroup className={'has-label ' + this.state.fields.confirmPasswordState}>
                      <label>Confirm Password: * </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={e => this.setConfirmPassword(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <div className="category form-category">* Required fields</div>
              </CardBody>
              <CardFooter className="text-left">
                <Button color="primary" type="submit" onClick={e => this.changePasswordSubmit(e)}>
                  Change Password
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ChangePassword
