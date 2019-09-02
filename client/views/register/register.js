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
  CustomInput,
  Row,
  Col,
} from 'reactstrap'

import SweetAlert from 'sweetalert2-react'

import {
  serviceTypes,
  followUpReasons,
} from '../../constants/constants'

import { isNameValid, isPhoneNumberValid, isStringValid } from '../../util'

import Datetime from 'react-datetime'

import Select from 'react-select'

import Swal from 'sweetalert2'

import httpClient from '../../httpClient'

import './register.scss'

function getInitialState() {
  return {
    register: {
      name: '',
      nameState: '',
      phoneNumber: '',
      phoneNumberState: '',
      alternateTelephoneNumber: '',
      alternateTelephoneNumberState: '',
      purposeOfFollowup: '',
      serviceType: {},
      purposeOfFollowupSelection: null,
      purposeOfFollowupState: '',
      lastServiceDate: '',
      lastServiceDateSelection: '',
      lastServiceDateState: '',
      followupDate: '',
      followupDateSelection: '',
      followupDateState: '',
      notes: ''
    },
  }
}

class Register extends React.Component {
  constructor(props) {
    super(props)

    this.state = getInitialState()
    this.registerSubmit = this.registerSubmit.bind(this)
    this.isRegisterFormValid = this.isRegisterFormValid.bind(this)
    this.setRegisterFieldState = this.setRegisterFieldState.bind(this)
    this.resetFieldState = this.resetFieldState.bind(this)
    this.resetAllFieldStates = this.resetAllFieldStates.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
  }

  setRegisterFieldState(input, fieldName, stateName, validateFn) {
    const register = this.state.register
    register[fieldName] = input

    register[stateName] = validateFn(input) ? 'has-success' : 'has-danger'
    this.setState({ register })
  }

  resetFieldState(value, fieldName, stateName) {
    const register = this.state.register
    register[fieldName] = value
    register[stateName] = ''
    this.setState({ register })
  }

  resetAllFieldStates() {
    this.setState(getInitialState())
  }

  setName(evt) {
    this.setRegisterFieldState(evt.target.value, 'name', 'nameState', isNameValid)
  }

  setPhoneNumber(evt) {
    this.setRegisterFieldState(
      evt.target.value,
      'phoneNumber',
      'phoneNumberState',
      isPhoneNumberValid,
    )
  }

  handleCheckboxChange(e) {
    const item = e.target.id;
    const isChecked = e.target.checked;
    const serviceType = this.state.register.serviceType
    serviceType[item] = isChecked

    this.setState({serviceType});
  }

  setLastServiceDate(moment) {
    const register = this.state.register
    const date = moment && moment.toDate ? moment.toDate() : ''
    const currentDate = new Date()
    currentDate.setHours(0,0,0,0);

    register.lastServiceDate = date
    register.lastServiceDateSelection = moment

    if (date) {
      register.lastServiceDateState =
        isStringValid(date) && date <= currentDate ? 'has-success' : 'has-danger'
    } else {
      register.lastServiceDateState = ''
    }

    this.setState({ register })
  }

  setAlternatePhoneNumber(evt) {
    const alternatePhoneNumInput = evt.target.value

    if (alternatePhoneNumInput) {
      this.setRegisterFieldState(
        alternatePhoneNumInput,
        'alternateTelephoneNumber',
        'alternateTelephoneNumberState',
        isPhoneNumberValid,
      )
    } else {
      this.resetFieldState(
        alternatePhoneNumInput,
        'alternateTelephoneNumber',
        'alternateTelephoneNumberState',
      )
    }
  }

  setPurposeOfFollowup(purpose) {
    const register = this.state.register

    register.purposeOfFollowupSelection = purpose
    register.purposeOfFollowup = purpose ? purpose.value : ''

    if (purpose) {
      register.purposeOfFollowupState = isStringValid(purpose.value) ? 'has-success' : 'has-danger'
    }

    this.setState({ register })
  }

  setFollowupDate(moment) {
    const register = this.state.register
    const date = moment && moment.toDate ? moment.toDate() : ''
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0);

    register.followupDate = date
    register.followupDateSelection = moment

    if (date) {
      register.followupDateState =
        isStringValid(date) && date >= currentDate ? 'has-success' : 'has-danger'
    } else {
      register.followupDateState = ''
    }

    this.setState({ register })
  }

  setNotes(evt) {
    const register = this.state.register

    register.notes = evt.target.value

    this.setState({ register })
  }

  isRegisterFormValid() {
    let register = this.state.register
    let formValid = true

    if (register.nameState !== 'has-success') {
      register.nameState = 'has-danger'
      formValid = false
    }

    if (register.phoneNumberState !== 'has-success') {
      register.phoneNumberState = 'has-danger'
      formValid = false
    }

    if (register.alternateTelephoneNumberState !== 'has-success' && register.alternatePhoneNumber) {
      register.phoneNumberState = 'has-danger'
      formValid = false
    }

    if (register.purposeOfFollowupState !== 'has-success' && register.purposeOfFollowup) {
      register.purposeOfFollowupState = 'has-danger'
      formValid = false
    }

    if (register.lastServiceDateState !== 'has-success' && register.lastServiceDate) {
      register.lastServiceDateState = 'has-danger'
      formValid = false
    }

    if (register.followupDateState !== 'has-success' && register.followupDate) {
      register.followupDateState = 'has-danger'
      formValid = false
    }

    this.setState({ register })
    return formValid
  }

  registerSubmit(evt) {
    evt.preventDefault()

    if (this.isRegisterFormValid()) {
      const serviceType = this.state.register.serviceType

      const serviceTypeSelected = Object.keys(serviceType).filter((type)=> {
        return serviceType[type]
      });

      this.state.register.serviceTypeSelected = serviceTypeSelected.toString()
      httpClient.register(this.state.register).then(res => {
        if (res.success) {
          Swal('Yaah', 'User registered successfully', 'success')
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
    const {
      name,
      phoneNumber,
      alternateTelephoneNumber,
      purposeOfFollowupSelection,
      followupDate,
      lastServiceDate,
      notes,
    } = this.state.register

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
                  <Col className="pr-md-1" md="8">
                    <FormGroup className={'has-label ' + this.state.register.nameState}>
                      <label>Name: * </label>
                      <Input type="text" value={name} onChange={e => this.setName(e)} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="6">
                    <FormGroup className={'has-label ' + this.state.register.phoneNumberState}>
                      <label>Tel: *</label>
                      <Input
                        type="text"
                        value={phoneNumber}
                        onChange={e => this.setPhoneNumber(e)}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="6">
                    <FormGroup
                      className={'has-label ' + this.state.register.alternateTelephoneNumberState}
                    >
                      <label>Alternative Tel: </label>
                      <Input
                        type="text"
                        value={alternateTelephoneNumber}
                        onChange={e => this.setAlternatePhoneNumber(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <FormGroup>
                    <Label for="exampleCheckbox">Service Type: </Label>
                    <div>
                        {
                          serviceTypes.map(item => (
                            <CustomInput 
                              key={item.key}
                              type="checkbox"
                              checked={this.state.register.serviceType[item.key]}
                              onChange={this.handleCheckboxChange}
                              id={item.key}
                              label={item.name} />
                          ))
                        }
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <FormGroup className={this.state.register.lastServiceDateState}>
                      <label>Last Service Date:</label>
                      <Datetime
                        timeFormat={false}
                        closeOnSelect={true}
                        value={lastServiceDate}
                        onChange={date => this.setLastServiceDate(date)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md="6">
                    <FormGroup>
                      <label>Purpose Of Follow-up: </label>
                      <Select
                        className={
                          'react-select primary ' + this.state.register.purposeOfFollowupState
                        }
                        classNamePrefix="react-select"
                        name="purposeOfFollowup"
                        value={purposeOfFollowupSelection}
                        options={followUpReasons}
                        onChange={value => this.setPurposeOfFollowup(value)}
                        isSearchable
                        isClearable={true}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={12} md="6">
                    <FormGroup className={this.state.register.followupDateState}>
                      <label>Follow-up Date: </label>
                      <Datetime
                        timeFormat={false}
                        closeOnSelect={true}
                        value={followupDate}
                        onChange={date => this.setFollowupDate(date)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Notes: </label>
                      <Input
                        cols="80"
                        rows="4"
                        type="textarea"
                        value={notes}
                        onChange={e => this.setNotes(e)}
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
