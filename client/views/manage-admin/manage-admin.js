import React, {Fragment} from 'react'
import ReactTable from 'react-table'
import FontAwesome from 'react-fontawesome'

import './manage-admin.scss'
import httpClient from '../../httpClient'

import AsyncSelect from 'react-select/lib/Async'
import { isArrayEmpty, isStringValid, isNameValid } from '../../util'
import Swal from 'sweetalert2'
import Select from 'react-select'

import { adminOptions } from '../../constants/constants'

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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'

function getInitialState(toggle) {
  return {
    modal: {
      toggle: toggle,
      headerTitle: '',
      footerActionTitle: '',
      userSelectionState: '',
      userSelection: '',
      rolSelectionState: '',
      roleSelection: '',
      password: '',
      confirmPassword: '',
      userSelectionDisabled: false,
      entryId: '',
    },
  }
}

class ManageAccount extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      modal: getInitialState(false),
    }

    this.addNewEntry = this.addNewEntry.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.searchForUsers = this.searchForUsers.bind(this)
    this.submitEntry = this.submitEntry.bind(this)
    this.editAdminClicked = this.editAdminClicked.bind(this)
    this.deleteAdmin = this.deleteAdmin.bind(this)

    this.getAllAdmins()
  }

  addNewEntry(evt) {
    const modal = this.state.modal

    modal.toggle = !modal.toggle

    this.setState({ modal })
  }

  getAllAdmins() {
    httpClient.getAllAdmins().then(admins => {
      if (admins && admins.success && !isArrayEmpty(admins.data)) {
        const data = this.getAdminsDataForTable(admins.data)
        this.setState({ data: data })
      }
    })
  }

  editAdminClicked(admin) {
    const modal = this.state.modal

    modal.toggle = true
    modal.userSelection = {
      value: admin.userId,
      label: admin.fullname,
      _id: admin.userId,
    }
    modal.userSelectionDisabled = true
    modal.role = admin.role
    modal.roleSelection = {
      value: admin.role,
      label: admin.role,
    }

    modal.isEdit = true

    this.setState({ modal })
  }

  deleteAdmin(admin) {
    httpClient.deleteAdmin(admin.userId).then(res => {
      if (res.success) {
        var data = this.state.data
        data.find((o, i) => {
          if (o.id === admin.id) {
            data.splice(i, 1)
            return true
          }
          return false
        })
        this.setState({ data: data })
        Swal('Deleted', 'User is no more an admin.', 'success')
      } else {
        Swal('Oops', res.error, 'error')
      }
    })
  }

  getAdminsDataForTable(admins) {
    return admins.map((admin, key) => {
      return {
        id: key,
        userId: admin._id,
        fullname: admin.fullname ? admin.fullname : admin.username,
        role: admin.role,
        actions: (
          // we've added some custom button actions
          <div className="actions-center">
            {/* use this button to add a like kind of action */}
            <Button
              onClick={() => {
                const obj = this.state.data.find(o => o.id === key)
                this.editAdminClicked(obj)
              }}
              color="info"
              size="sm"
              round
              icon
            >
              <FontAwesome name="edit" />
            </Button>{' '}
            {/* use this button to remove the data row */}
            <Button
              onClick={() => {
                const obj = this.state.data.find(o => o.id === key)
                Swal({
                  title: 'Are you sure?',
                  text: 'This user will no longer be an admin!',
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, Remove Admin!',
                  confirmButtonColor: '#d33',
                  cancelButtonText: 'Cancel',
                }).then(result => {
                  if (result.value) {
                    this.deleteAdmin(obj)
                  }
                })
              }}
              color="danger"
              size="sm"
              round
              icon
            >
              <FontAwesome name="times" />
            </Button>{' '}
          </div>
        ),
      }
    })
  }

  toggleModal() {
    const modal = this.state.modal

    const toggle = !modal.toggle

    this.setState(getInitialState(toggle))
  }

  setUser(user) {
    const modal = this.state.modal

    modal.userSelection = user
    modal.userSelectionState = isStringValid(user.value) ? 'has-success' : 'has-danger'

    this.setState({ modal })
  }

  setUserName(evt) {
    const input = evt.target.value
    const modal = this.state.modal

    modal.username = input
    modal.usernameState = isNameValid(input) ? 'has-success' : 'has-danger'

    this.setState({ modal })
  }

  setRole(role) {
    const modal = this.state.modal

    modal.roleSelection = role
    modal.rolSelectionState = isStringValid(role.value) ? 'has-success' : 'has-danger'

    this.setState({ modal })
  }

  setPassword(evt) {
    const input = evt.target.value
    const modal = this.state.modal

    modal.password = input
    modal.passwordState = input ? 'has-success' : 'has-danger'
    modal.confirmPasswordState =
      modal.password === modal.confirmPassword ? 'has-success' : 'has-danger'

    this.setState({ modal })
  }

  setConfirmPassword(evt) {
    const input = evt.target.value
    const modal = this.state.modal

    modal.confirmPassword = input
    modal.confirmPasswordState =
      modal.password === modal.confirmPassword ? 'has-success' : 'has-danger'

    this.setState({ modal })
  }

  getUsersDataForSelect(users) {
    return users.map(user => ({
      value: user._id,
      label: user.fullname,
      _id: user._id,
    }))
  }
  searchForUsers(inputValue) {
    return httpClient.searchForUsers(inputValue).then(users => {
      if (users && users.success && !isArrayEmpty(users.data)) {
        return this.getUsersDataForSelect(users.data)
      }
    })
  }

  isModalValid() {
    let modal = this.state.modal
    let formValid = true

    if (
      (!modal.isEdit && modal.userSelectionState !== 'has-success') ||
      (modal.isEdit && !modal.userSelection)
    ) {
      modal.userSelectionState = 'has-danger'
      formValid = false
    }

    if (
      (!modal.isEdit && modal.rolSelectionState !== 'has-success') ||
      (modal.isEdit && !modal.roleSelection)
    ) {
      modal.rolSelectionState = 'has-danger'
      formValid = false
    }

    if (!modal.isEdit && modal.usernameState !== 'has-success') {
      modal.usernameState = 'has-danger'
      formValid = false
    }

    if (!modal.isEdit && modal.passwordState !== 'has-success') {
      modal.passwordState = 'has-danger'
      formValid = false
    }

    if (!modal.isEdit && modal.confirmPasswordState !== 'has-success') {
      modal.confirmPasswordState = 'has-danger'
      formValid = false
    }

    this.setState({ modal })
    return formValid
  }

  submitPromise(adminObj) {
    return this.state.modal.isEdit
      ? httpClient.updateAdmin(adminObj)
      : httpClient.addAdmin(adminObj)
  }

  submitEntry(evt) {
    evt.preventDefault()

    if (this.isModalValid()) {
      const modal = this.state.modal

      const adminObj = {
        userId: modal.userSelection._id,
        role: modal.roleSelection.value,
        username: modal.username ? modal.username : '',
        password: modal.password ? modal.password : '',
      }

      const _this = this
      this.submitPromise(adminObj).then(function(res) {
        if (res.success) {
          _this.getAllAdmins()
          _this.toggleModal()

          const successMsg = modal.isEdit ? 'Admin modified' : 'Admin created'
          Swal('Yaah', successMsg, 'success')
        } else {
          Swal('Operation failed!!!', res.error, 'error')
        }
      })
    }
  }

  render() {
    const { modal } = this.state
    const headerTitle = modal.isEdit ? 'Edit Admin' : 'Add new admin'

    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="manage-account">
              <CardHeader>
                <CardTitle tag="h4">Manage Admins</CardTitle>
                <Button color="primary" type="submit" onClick={this.toggleModal}>
                  Add New Admin
                </Button>
                <Modal isOpen={this.state.modal.toggle} toggle={this.toggleModal}>
                  <ModalHeader toggle={this.toggle}>{headerTitle}</ModalHeader>
                  <ModalBody>
                    <Row>
                      <Col className="pr-md-1" md="8">
                        <FormGroup>
                          <label>User: </label>
                          <AsyncSelect
                            className={'react-select primary ' + modal.userSelectionState}
                            classNamePrefix="react-select"
                            name="consultationOption"
                            value={modal.userSelection}
                            onChange={value => this.setUser(value)}
                            loadOptions={this.searchForUsers}
                            components={{
                              IndicatorSeparator: () => null,
                            }}
                            isDisabled={modal.userSelectionDisabled}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-md-1" md="8">
                        <FormGroup>
                          <label>Role: * </label>
                          <Select
                            className={'react-select primary ' + modal.rolSelectionState}
                            classNamePrefix="react-select"
                            name="role"
                            value={modal.roleSelection}
                            options={adminOptions}
                            onChange={value => this.setRole(value)}
                            isSearchable
                            components={{
                              IndicatorSeparator: () => null,
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {!modal.isEdit ? (
                      <Fragment>
                        <Row>
                          <Col className="pr-md-1" md="8">
                            <FormGroup className={'has-label ' + modal.usernameState}>
                              <label>Username: * </label>
                              <Input
                                type="text"
                                value={modal.username}
                                onChange={e => this.setUserName(e)}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="pr-md-1" md="8">
                            <FormGroup className={'has-label ' + modal.passwordState}>
                              <label>Password: * </label>
                              <Input
                                type="password"
                                value={modal.password}
                                onChange={e => this.setPassword(e)}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="pr-md-1" md="8">
                            <FormGroup className={'has-label ' + modal.confirmPasswordState}>
                              <label>Confirm Password: * </label>
                              <Input
                                type="password"
                                value={modal.confirmPassword}
                                onChange={e => this.setConfirmPassword(e)}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Fragment>
                    ) : (
                      ''
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.toggleModal}>
                      Cancel
                    </Button>{' '}
                    <Button color="primary" onClick={e => this.submitEntry(e)}>
                      Submit
                    </Button>
                  </ModalFooter>
                </Modal>
              </CardHeader>
              <CardBody>
                <ReactTable
                  data={this.state.data}
                  filterable
                  defaultFilterMethod={(filter, row) =>
                    row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                  }
                  columns={[
                    {
                      Header: 'Name',
                      accessor: 'fullname',
                      className: 'actions-center',
                    },
                    {
                      Header: 'Role',
                      accessor: 'role',
                      className: 'actions-center',
                    },
                    {
                      Header: 'Actions',
                      accessor: 'actions',
                      sortable: false,
                      filterable: false,
                    },
                  ]}
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={false}
                  className="-striped -highlight"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ManageAccount
