import React from 'react'

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

import { consultationOptions, immigrationStatuses } from '../../constants/constants'

import Datetime from 'react-datetime'

import Select from 'react-select'

import httpClient from '../../httpClient'

import './register.scss'

// sign up form behaves almost identically to log in form. We could create a flexible Form component to use for both actions, but for now we'll separate the two:
class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: { firstname: '', lastname: '', email: '', username: '' },
      consultationOption: '',
      immigrationStatus: '',
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
    httpClient.register(this.state.fields).then(user => {
      this.setState({ fields: { firstname: '', lastname: '', email: '', username: '' } })
      if (user) {
        this.props.onRegisterSuccess(user)
        this.props.history.push('/')
      }
    })
  }

  render() {
    const { firstname, lastname, email, username } = this.state.fields
    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="register">
              <CardHeader>
                <CardTitle tag="h4">Register User</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className="pr-md-1" md="4">
                    <FormGroup>
                      <label>Last Name: </label>
                      <Input type="text" />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="8">
                    <FormGroup>
                      <label>Given Name(s): </label>
                      <Input type="text" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="4">
                    <FormGroup>
                      <label>Email: </label>
                      <Input type="text" />
                    </FormGroup>
                  </Col>
                  <Col className="px-md-1" md="4">
                    <FormGroup>
                      <label>Tel: </label>
                      <Input type="text" />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="4">
                    <FormGroup>
                      <label>Alternative Tel: </label>
                      <Input type="text" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <FormGroup>
                      <label>Consultation Option: </label>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="consultationOption"
                        value={this.state.consultationOption}
                        options={consultationOptions}
                        onChange={value => this.setState({ consultationOption: value })}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <FormGroup>
                      <label>Immigration Status: </label>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="immigrationStatus"
                        value={this.state.immigrationStatus}
                        options={immigrationStatuses}
                        onChange={value => this.setState({ immigrationStatus: value })}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <FormGroup>
                      <label>Issue Date: </label>
                      <Datetime
                        timeFormat={false}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <FormGroup>
                      <label>Expiry Date: </label>
                      <Datetime
                        timeFormat={false}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <div className="category form-category">* Required fields</div>
              </CardBody>
              <CardFooter className="text-right">
                <Button color="primary" onClick={e => this.registerSubmit(e)}>
                  Register
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Register
