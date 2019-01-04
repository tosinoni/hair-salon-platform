import React from 'react'

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from 'reactstrap'

import {
  isNameValid,
  isEmailValid,
  isPhoneNumberValid,
  isStringValid,
  isBoolean,
  getSelectionFromOptions,
} from '../../util'

import {
  maritalStatusOptions,
  consultationOptions,
  immigrationStatuses,
  followUpReasons,
} from '../../constants/constants'

import Datetime from 'react-datetime'

import Select from 'react-select'

import profileImage from '../../assets/profile-image.png'
import './profile.scss'
import httpClient from '../../httpClient'
import Swal from 'sweetalert2'

class Admin extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: '',
    }

    this.goBackToDashBoard = this.goBackToDashBoard.bind(this)
    this.setUserFieldState = this.setUserFieldState.bind(this)
    this.editUserSubmit = this.editUserSubmit.bind(this)
    this.resetFieldState = this.resetFieldState.bind(this)
    this.resetState = this.resetState.bind(this)
  }

  goBackToDashBoard() {
    this.props.history.push('/')
    Swal('Oops', 'User not found', 'error')
  }

  convetServerModelToClient(user) {
    user.consultationOnlySelection = getSelectionFromOptions(
      user.consultationOnly,
      consultationOptions,
    )
    user.maritalStatusSelection = getSelectionFromOptions(user.maritalStatus, maritalStatusOptions)
    user.presentImmigrationStatusSelection = getSelectionFromOptions(
      user.presentImmigrationStatus,
      immigrationStatuses,
    )
    user.purposeOfFollowupSelection = getSelectionFromOptions(
      user.purposeOfFollowup,
      followUpReasons,
    )

    user.issueDate = user.issueDate ? new Date(user.issueDate) : ''
    user.expiryDate = user.expiryDate ? new Date(user.expiryDate) : ''
    user.followupDate = user.followupDate ? new Date(user.followupDate) : ''

    return user
  }

  setProfile() {
    const state = this.props && this.props.location ? this.props.location.state : ''
    const userId = state ? state.id : ''

    if (userId) {
      httpClient.getUser(userId).then(res => {
        if (res.success) {
          this.setState({ user: this.convetServerModelToClient(res.data) })
        } else {
          this.goBackToDashBoard()
        }
      })
    } else {
      this.goBackToDashBoard()
    }
  }
  componentDidMount() {
    this.setProfile()
  }

  componentDidUpdate() {
    const state = this.props && this.props.location ? this.props.location.state : ''
    const userId = state ? state.id : ''

    if (userId && this.state.user && userId !== this.state.user._id) {
      this.setProfile()
    }
  }

  setUserFieldState(input, fieldName, stateName, validateFn) {
    const user = this.state.user

    user[fieldName] = input
    user[stateName] = validateFn(input) ? 'has-success' : 'has-danger'

    this.setState({ user })
  }

  resetFieldState(value, fieldName, stateName) {
    const user = this.state.user

    user[fieldName] = value
    user[stateName] = ''

    this.setState({ user })
  }

  setLastName(evt) {
    this.setUserFieldState(evt.target.value, 'lastname', 'lastNameState', isNameValid)
  }

  setGivenNames(evt) {
    this.setUserFieldState(evt.target.value, 'givenNames', 'givenNamesState', isNameValid)
  }

  setEmail(evt) {
    this.setUserFieldState(evt.target.value, 'email', 'emailState', isEmailValid)
  }

  setPhoneNumber(evt) {
    this.setUserFieldState(evt.target.value, 'phoneNumber', 'phoneNumberState', isPhoneNumberValid)
  }

  setAlternatePhoneNumber(evt) {
    const alternatePhoneNumInput = evt.target.value

    if (alternatePhoneNumInput) {
      this.setUserFieldState(
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
    const user = this.state.user

    user.consultationOnlySelection = consultationOption
    user.consultationOnly = consultationOption.value
    user.consultationOnlyState = isBoolean(consultationOption.value) ? 'has-success' : 'has-danger'

    this.setState({ user })
  }

  setMaritalStatusOption(maritalStatusOption) {
    const user = this.state.user

    user.maritalStatusSelection = maritalStatusOption
    user.maritalStatus = maritalStatusOption.value
    user.maritalStatusState = isStringValid(maritalStatusOption.value)
      ? 'has-success'
      : 'has-danger'

    this.setState({ user })
  }

  setPresentImmigrationStatus(immigrationStatus) {
    const user = this.state.user

    user.presentImmigrationStatusSelection = immigrationStatus
    user.presentImmigrationStatus = immigrationStatus.value
    user.presentImmigrationStatusState = isStringValid(immigrationStatus.value)
      ? 'has-success'
      : 'has-danger'

    this.setState({ user })
  }

  setIssueDate(moment) {
    const user = this.state.user
    const date = moment && moment.toDate ? moment.toDate() : ''

    user.issueDateSelection = moment
    user.issueDate = date

    if (date) {
      user.issueDateState =
        isStringValid(date) && (date >= user.expiryDate || !user.expiryDate)
          ? 'has-success'
          : 'has-danger'
    } else {
      user.issueDateState = ''
    }

    this.setState({ user })
  }

  setExpiryDate(moment) {
    const user = this.state.user
    const date = moment && moment.toDate ? moment.toDate() : ''

    user.expiryDateSelection = moment
    user.expiryDate = date

    if (date) {
      user.expiryDateState =
        isStringValid(date) && (date >= user.issueDate || !user.issueDate)
          ? 'has-success'
          : 'has-danger'
    } else {
      user.expiryDateState = ''
    }

    this.setState({ user })
  }

  setPurposeOfFollowup(purpose) {
    const user = this.state.user

    user.purposeOfFollowupSelection = purpose
    user.purposeOfFollowup = purpose ? purpose.value : ''

    if (purpose) {
      user.purposeOfFollowupState = isStringValid(purpose.value) ? 'has-success' : 'has-danger'
    }

    this.setState({ user })
  }

  setFollowupDate(moment) {
    const user = this.state.user
    const date = moment && moment.toDate ? moment.toDate() : ''
    const currentDate = new Date()
    currentDate.setHours(0,0,0,0);

    user.followupDate = date
    user.followupDateSelection = moment

    console.log(currentDate)
    console.log(date)

    if (date) {
      user.followupDateState =
        isStringValid(date) && date >= currentDate ? 'has-success' : 'has-danger'
    } else {
      user.followupDateState = ''
    }

    this.setState({ user })
  }

  setNotes(evt) {
    const user = this.state.user

    user.notes = evt.target.value

    this.setState({ user })
  }

  isEditUserFormValid() {
    let user = this.state.user

    return (
      user.lastNameState !== 'has-danger' &&
      user.givenNamesState !== 'has-danger' &&
      user.emailState !== 'has-danger' &&
      user.phoneNumberState !== 'has-danger' &&
      user.alternateTelephoneNumberState !== 'has-danger' &&
      user.consultationOnlyState !== 'has-danger' &&
      user.maritalStatusState !== 'has-danger' &&
      user.presentImmigrationStatusState !== 'has-danger' &&
      user.issueDateState !== 'has-danger' &&
      user.expiryDateState !== 'has-danger' &&
      user.purposeOfFollowupState !== 'has-danger' &&
      user.followupDateState !== 'has-danger'
    )
  }

  resetState() {
    let user = this.state.user

    user.lastNameState = ''
    user.givenNamesState = ''
    user.emailState = ''
    user.phoneNumberState = ''
    user.alternateTelephoneNumberState = ''
    user.consultationOnlyState = ''
    user.maritalStatusState = ''
    user.presentImmigrationStatusState = ''
    user.issueDateState = ''
    user.expiryDateState = ''
    user.purposeOfFollowupState = ''
    user.followupDateState = ''

    this.setState({ user })
  }

  editUserSubmit(evt) {
    evt.preventDefault()

    if (this.isEditUserFormValid()) {
      httpClient.updateUser(this.state.user).then(res => {
        if (res.success) {
          Swal('Yaah', 'User updated successfully', 'success')
          this.resetState()
        } else {
          Swal('Save Failed!!!', res.error, 'error')
        }
      })
    } else {
      Swal('Save Failed!!!', 'Please address the errors in red', 'error')
    }
  }

  getDisplayName() {
    let user = this.state.user

    const givenNames = user && user.givenNames ? user.givenNames : ''
    const lastname = user && user.lastname ? user.lastname : ''

    return lastname + ' ' + givenNames
  }

  render() {
    const { user } = this.state

    return (
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Edit Profile</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup className={'has-label ' + user.lastNameState}>
                        <label>Last Name: *</label>
                        <Input
                          value={user.lastname}
                          type="text"
                          onChange={e => this.setLastName(e)}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="8">
                      <FormGroup className={'has-label ' + user.givenNamesState}>
                        <label>Given Names: *</label>
                        <Input
                          value={user.givenNames}
                          type="text"
                          onChange={e => this.setGivenNames(e)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup className={'has-label ' + user.emailState}>
                        <label>Email: * </label>
                        <Input type="email" value={user.email} onChange={e => this.setEmail(e)} />
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="4">
                      <FormGroup className={'has-label ' + user.phoneNumberState}>
                        <label>Tel: *</label>
                        <Input
                          type="text"
                          value={user.phoneNumber}
                          onChange={e => this.setPhoneNumber(e)}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup className={'has-label ' + user.alternateTelephoneNumberState}>
                        <label>Alternative Tel: </label>
                        <Input
                          type="text"
                          value={user.alternateTelephoneNumber}
                          onChange={e => this.setAlternatePhoneNumber(e)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" xs={12} md={6}>
                      <FormGroup>
                        <label>Consultation Option: * </label>
                        <Select
                          className={'react-select primary ' + user.consultationOnlyState}
                          classNamePrefix="react-select"
                          name="consultationOption"
                          value={user.consultationOnlySelection}
                          options={consultationOptions}
                          onChange={value => this.setConsultationOption(value)}
                          isSearchable
                          components={{
                            IndicatorSeparator: () => null,
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" xs={12} md={6}>
                      <FormGroup>
                        <label>Marital Status: * </label>
                        <Select
                          className={'react-select primary ' + user.maritalStatusState}
                          classNamePrefix="react-select"
                          name="maritalStatus"
                          value={user.maritalStatusSelection}
                          options={maritalStatusOptions}
                          onChange={value => this.setMaritalStatusOption(value)}
                          isSearchable
                          components={{
                            IndicatorSeparator: () => null,
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" xs={12} md={6}>
                      <FormGroup>
                        <label>Present Immigration Status: * </label>
                        <Select
                          className={'react-select primary ' + user.presentImmigrationStatusState}
                          classNamePrefix="react-select"
                          name="immigrationStatus"
                          value={user.presentImmigrationStatusSelection}
                          options={immigrationStatuses}
                          onChange={value => this.setPresentImmigrationStatus(value)}
                          isSearchable
                          components={{
                            IndicatorSeparator: () => null,
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup className={user.issueDateState}>
                        <label>Issue Date:</label>
                        <Datetime
                          timeFormat={false}
                          closeOnSelect={true}
                          value={user.issueDate}
                          onChange={date => this.setIssueDate(date)}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup className={user.expiryDateState}>
                        <label>Expiry Date:</label>
                        <Datetime
                          timeFormat={false}
                          closeOnSelect={true}
                          value={user.expiryDate}
                          onChange={date => this.setExpiryDate(date)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>Purpose Of Follow-up: </label>
                        <Select
                          className={'react-select primary ' + user.purposeOfFollowupState}
                          classNamePrefix="react-select"
                          name="purposeOfFollowUp"
                          value={user.purposeOfFollowupSelection}
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
                    <Col className="pl-md-1" md="6">
                      <FormGroup className={user.followupDateState}>
                        <label>Follow-up Date: </label>
                        <Datetime
                          timeFormat={false}
                          closeOnSelect={true}
                          value={user.followupDate}
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
                          value={user.notes}
                          onChange={e => this.setNotes(e)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button
                  className="btn-fill"
                  color="primary"
                  type="submit"
                  onClick={e => this.editUserSubmit(e)}
                >
                  Save
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <div className="avatar-container">
                    <img alt="..." className="avatar" src={profileImage} />
                    <h5 className="title">{this.getDisplayName()}</h5>
                  </div>
                  <p className="description">{user.presentImmigrationStatus}</p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Admin
