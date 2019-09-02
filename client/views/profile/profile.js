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
  CustomInput,
  Label
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
  serviceTypes,
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
      user: {
        serviceType: {}
      },
    }

    this.goBackToDashBoard = this.goBackToDashBoard.bind(this)
    this.setUserFieldState = this.setUserFieldState.bind(this)
    this.editUserSubmit = this.editUserSubmit.bind(this)
    this.resetFieldState = this.resetFieldState.bind(this)
    this.resetState = this.resetState.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
  }

  goBackToDashBoard() {
    this.props.history.push('/')
    Swal('Oops', 'User not found', 'error')
  }

  convetServerModelToClient(user) {
    const serviceType = {}
    for (const type of serviceTypes) {
      serviceType[type.key] = user.serviceType.includes(type.key)
    }

    user.serviceType = serviceType

    user.purposeOfFollowupSelection = getSelectionFromOptions(
      user.purposeOfFollowup,
      followUpReasons,
    )

    user.lastServiceDate = user.lastServiceDate ? new Date(user.lastServiceDate) : ''
    user.followupDate = user.followupDate ? new Date(user.followupDate) : ''

    console.log(user)

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

  setName(evt) {
    this.setUserFieldState(evt.target.value, 'name', 'nameState', isNameValid)
  }

  setPhoneNumber(evt) {
    this.setUserFieldState(evt.target.value, 'phoneNumber', 'phoneNumberState', isPhoneNumberValid)
  }

  handleCheckboxChange(e) {
    const item = e.target.id;
    const isChecked = e.target.checked;
    const serviceType = this.state.user.serviceType
    serviceType[item] = isChecked

    this.setState({serviceType});
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


  setLastServiceDate(moment) {
    const user = this.state.user
    const date = moment && moment.toDate ? moment.toDate() : ''
    const currentDate = new Date()
    currentDate.setHours(0,0,0,0);

    user.lastServiceDate = date
    user.lastServiceDateSelection = moment

    if (date) {
      user.lastServiceDateState =
        isStringValid(date) && date >= currentDate ? 'has-success' : 'has-danger'
    } else {
      user.lastServiceDateState = ''
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
      user.nameState !== 'has-danger' &&
      user.phoneNumberState !== 'has-danger' &&
      user.alternateTelephoneNumberState !== 'has-danger' &&
      user.lastServiceDateState !== 'has-danger' &&
      user.purposeOfFollowupState !== 'has-danger' &&
      user.followupDateState !== 'has-danger'
    )
  }

  resetState() {
    let user = this.state.user

    user.nameState = ''
    user.phoneNumberState = ''
    user.alternateTelephoneNumberState = ''
    user.lastServiceDateState = ''
    user.purposeOfFollowupState = ''
    user.followupDateState = ''

    this.setState({ user })
  }

  editUserSubmit(evt) {
    evt.preventDefault()

    if (this.isEditUserFormValid()) {
      this.state.user.serviceTypeSelected = this.getServiceType()
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

  getServiceType() {
    const serviceType = this.state.user.serviceType

      return Object.keys(serviceType).filter((type)=> {
        return serviceType[type]
      }).toString();
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
                    <Col className="pr-md-1" md="8">
                      <FormGroup className={'has-label ' + user.nameState}>
                        <label>Name: *</label>
                        <Input
                          value={user.name}
                          type="text"
                          onChange={e => this.setName(e)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup className={'has-label ' + user.phoneNumberState}>
                        <label>Tel: *</label>
                        <Input
                          type="text"
                          value={user.phoneNumber}
                          onChange={e => this.setPhoneNumber(e)}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
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
                  <Col xs={12} md={6}>
                    <FormGroup>
                    <Label for="exampleCheckbox">Service Type: </Label>
                    <div>
                        {
                          serviceTypes.map(item => (
                            <CustomInput 
                              key={item.key}
                              type="checkbox"
                              checked={this.state.user.serviceType[item.key]}
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
                    <h5 className="title">{user.name}</h5>
                  </div>
                  <p className="description">{this.getServiceType()}</p>
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
