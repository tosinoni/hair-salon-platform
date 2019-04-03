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

import SweetAlert from 'sweetalert2-react'

import {
  consultationOptions,
  maritalStatusOptions,
  immigrationStatuses,
  followUpReasons,
} from '../../constants/constants'

import { isNameValid, isEmailValid, isPhoneNumberValid, isStringValid, isBoolean } from '../../util'

import Datetime from 'react-datetime'

import Select from 'react-select'

import Swal from 'sweetalert2'

import httpClient from '../../httpClient'

import './register.scss'

function getInitialState() {
  return {
    register: {
      lastname: '',
      lastNameState: '',
      givenNames: '',
      givenNamesState: '',
      email: '',
      emailState: '',
      phoneNumber: '',
      phoneNumberState: '',
      alternateTelephoneNumber: '',
      alternateTelephoneNumberState: '',
      consultationOnly: '',
      consultationOnlySelection: null,
      consultationOnlyState: '',
      maritalStatus: '',
      maritalStatusSelection: null,
      maritalStatusState: '',
      presentImmigrationStatus: '',
      presentImmigrationStatusSelection: null,
      presentImmigrationStatusState: '',
      issueDate: '',
      issueDateSelection: '',
      issueDateState: '',
      expiryDate: '',
      expiryDateSelection: '',
      expiryDateState: '',
      purposeOfFollowup: '',
      purposeOfFollowupSelection: null,
      purposeOfFollowupState: '',
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

  setLastName(evt) {
    this.setRegisterFieldState(evt.target.value, 'lastname', 'lastNameState', isNameValid)
  }

  setEmail(evt) {
    this.setRegisterFieldState(evt.target.value, 'email', 'emailState', isEmailValid)
  }

  setGivenNames(evt) {
    this.setRegisterFieldState(evt.target.value, 'givenNames', 'givenNamesState', isNameValid)
  }

  setPhoneNumber(evt) {
    this.setRegisterFieldState(
      evt.target.value,
      'phoneNumber',
      'phoneNumberState',
      isPhoneNumberValid,
    )
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

  setConsultationOption(consultationOption) {
    const register = this.state.register

    register.consultationOnlySelection = consultationOption
    register.consultationOnly = consultationOption.value
    register.consultationOnlyState = isBoolean(consultationOption.value)
      ? 'has-success'
      : 'has-danger'

    this.setState({ register })
  }

  setMaritalStatusOption(maritalStatusOption) {
    const register = this.state.register

    register.maritalStatusSelection = maritalStatusOption
    register.maritalStatus = maritalStatusOption.value
    register.maritalStatusState = isStringValid(maritalStatusOption.value)
      ? 'has-success'
      : 'has-danger'

    this.setState({ register })
  }

  setPresentImmigrationStatus(immigrationStatus) {
    const register = this.state.register

    register.presentImmigrationStatusSelection = immigrationStatus
    register.presentImmigrationStatus = immigrationStatus.value
    register.presentImmigrationStatusState = isStringValid(immigrationStatus.value)
      ? 'has-success'
      : 'has-danger'

    this.setState({ register })
  }

  setIssueDate(moment) {
    const register = this.state.register
    const date = moment && moment.toDate ? moment.toDate() : ''

    register.issueDateSelection = moment
    register.issueDate = date

    if (date) {
      register.issueDateState =
        isStringValid(date) && (date >= register.expiryDate || !register.expiryDate)
          ? 'has-success'
          : 'has-danger'
    } else {
      register.issueDateState = ''
    }

    this.setState({ register })
  }

  setExpiryDate(moment) {
    const register = this.state.register
    const date = moment && moment.toDate ? moment.toDate() : ''

    register.expiryDateSelection = moment
    register.expiryDate = date

    if (date) {
      register.expiryDateState =
        isStringValid(date) && (date >= register.issueDate || !register.issueDate)
          ? 'has-success'
          : 'has-danger'
    } else {
      register.expiryDateState = ''
    }

    this.setState({ register })
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
    currentDate.setHours(0,0,0,0);

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

    if (register.lastNameState !== 'has-success') {
      register.lastNameState = 'has-danger'
      formValid = false
    }

    if (register.givenNamesState !== 'has-success') {
      register.givenNamesState = 'has-danger'
      formValid = false
    }

    if (register.emailState !== 'has-success') {
      register.emailState = 'has-danger'
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

    if (register.consultationOnlyState !== 'has-success') {
      register.consultationOnlyState = 'has-danger'
      formValid = false
    }

    if (register.maritalStatusState !== 'has-success') {
      register.maritalStatusState = 'has-danger'
      formValid = false
    }

    if (register.presentImmigrationStatusState !== 'has-success') {
      register.presentImmigrationStatusState = 'has-danger'
      formValid = false
    }

    if (register.issueDateState !== 'has-success' && register.issueDate) {
      register.issueDateState = 'has-danger'
      formValid = false
    }

    if (register.expiryDateState !== 'has-success' && register.expiryDate) {
      register.expiryDateState = 'has-danger'
      formValid = false
    }

    if (register.purposeOfFollowupState !== 'has-success' && register.purposeOfFollowup) {
      register.purposeOfFollowupState = 'has-danger'
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
      lastname,
      givenNames,
      email,
      phoneNumber,
      alternateTelephoneNumber,
      maritalStatusSelection,
      consultationOnlySelection,
      presentImmigrationStatusSelection,
      issueDate,
      expiryDate,
      purposeOfFollowupSelection,
      followupDate,
      showAlert,
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
                  <Col className="pr-md-1" md="4">
                    <FormGroup className={'has-label ' + this.state.register.lastNameState}>
                      <label>Last Name: * </label>
                      <Input type="text" value={lastname} onChange={e => this.setLastName(e)} />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="8">
                    <FormGroup className={'has-label ' + this.state.register.givenNamesState}>
                      <label>Given Name(s): * </label>
                      <Input type="text" value={givenNames} onChange={e => this.setGivenNames(e)} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="4">
                    <FormGroup className={'has-label ' + this.state.register.emailState}>
                      <label>Email: * </label>
                      <Input type="email" value={email} onChange={e => this.setEmail(e)} />
                    </FormGroup>
                  </Col>
                  <Col className="px-md-1" md="4">
                    <FormGroup className={'has-label ' + this.state.register.phoneNumberState}>
                      <label>Tel: *</label>
                      <Input
                        type="text"
                        value={phoneNumber}
                        onChange={e => this.setPhoneNumber(e)}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="4">
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
                      <label>Consultation Option: * </label>
                      <Select
                        className={
                          'react-select primary ' + this.state.register.consultationOnlyState
                        }
                        classNamePrefix="react-select"
                        name="consultationOption"
                        value={consultationOnlySelection}
                        options={consultationOptions}
                        onChange={value => this.setConsultationOption(value)}
                        isSearchable
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={12} md={6}>
                    <FormGroup>
                      <label>Marital Status: * </label>
                      <Select
                        className={
                          'react-select primary ' + this.state.register.maritalStatusState
                        }
                        classNamePrefix="react-select"
                        name="maritalStatus"
                        value={maritalStatusSelection}
                        options={maritalStatusOptions}
                        onChange={value => this.setMaritalStatusOption(value)}
                        isSearchable
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <FormGroup>
                      <label>Present Immigration Status: * </label>
                      <Select
                        className={
                          'react-select primary ' +
                          this.state.register.presentImmigrationStatusState
                        }
                        classNamePrefix="react-select"
                        name="immigrationStatus"
                        value={presentImmigrationStatusSelection}
                        options={immigrationStatuses}
                        onChange={value => this.setPresentImmigrationStatus(value)}
                        isSearchable
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <FormGroup className={this.state.register.issueDateState}>
                      <label>Issue Date:</label>
                      <Datetime
                        timeFormat={false}
                        closeOnSelect={true}
                        value={issueDate}
                        onChange={date => this.setIssueDate(date)}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={12} md={6}>
                    <FormGroup className={this.state.register.expiryDateState}>
                      <label>Expiry Date:</label>
                      <Datetime
                        timeFormat={false}
                        closeOnSelect={true}
                        value={expiryDate}
                        onChange={date => this.setExpiryDate(date)}
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
