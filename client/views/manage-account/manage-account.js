import React from 'react'
import ReactTable from 'react-table'
import FontAwesome from 'react-fontawesome'

import './manage-account.scss'
import httpClient from '../../httpClient'

import AsyncSelect from 'react-select/lib/Async'
import { isArrayEmpty, isStringValid } from '../../util'
import Swal from 'sweetalert2'

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
      monthsOwingState: '',
      monthsOwing: '',
      amountOwingState: '',
      amountOwing: '',
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
    this.setEntryFieldState = this.setEntryFieldState.bind(this)
    this.editEntryClicked = this.editEntryClicked.bind(this)
    this.deleteEntry = this.deleteEntry.bind(this)

    this.getAllEntries()
  }

  addNewEntry(evt) {
    const modal = this.state.modal

    modal.toggle = !modal.toggle

    this.setState({ modal })
  }

  getAllEntries() {
    httpClient.getAllAccountEntries().then(entriesResponse => {
      console.log(entriesResponse)
      if (entriesResponse && entriesResponse.success && !isArrayEmpty(entriesResponse.data)) {
        const data = this.getEntriesDataForTable(entriesResponse.data)
        this.setState({ data: data })
      }
    })
  }

  editEntryClicked(entry) {
    const modal = this.state.modal

    modal.toggle = true
    modal.userSelection = {
      value: entry.userId,
      label: entry.name,
      _id: entry.userId,
    }
    modal.userSelectionDisabled = true
    modal.nailPrice = entry.nailPrice
    modal.hairPrice = entry.hairPrice
    modal.waxPrice = entry.waxPrice
    modal.lashPrice = entry.lashPrice

    modal.isEdit = true
    modal.entryId = entry.entryId

    this.setState({ modal })
  }

  deleteEntry(entry) {
    httpClient.deleteAccountEntry(entry.entryId).then(res => {
      if (res.success) {
        var data = this.state.data
        data.find((o, i) => {
          if (o.id === entry.id) {
            data.splice(i, 1)
            return true
          }
          return false
        })
        this.setState({ data: data })
        Swal('Deleted', 'Entry deleted successfully', 'success')
      } else {
        Swal('Oops', res.error, 'error')
      }
    })
  }

  getEntriesDataForTable(entries) {
    return entries.map((entry, key) => {
      return {
        id: key,
        entryId: entry._id,
        userId: entry.userId,
        name: entry.name,
        hairPrice: entry.hairPrice,
        nailPrice: entry.nailPrice,
        waxPrice: entry.waxPrice,
        lashPrice: entry.lashPrice,
        actions: (
          // we've added some custom button actions
          <div className="actions-center">
            {/* use this button to add a like kind of action */}
            <Button
              onClick={() => {
                const obj = this.state.data.find(o => o.id === key)
                this.editEntryClicked(obj)
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
                  text: 'You will not be able to recover this entry!',
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, delete Entry!',
                  confirmButtonColor: '#d33',
                  cancelButtonText: 'Cancel',
                }).then(result => {
                  if (result.value) {
                    this.deleteEntry(obj)
                  }
                })
              }}
              color="danger"
              size="sm"
              round
              icon
            >
              <FontAwesome name="times" />
            </Button>
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
    modal.userSelectionState = isStringValid(modal.value) ? 'has-success' : 'has-danger'

    this.setState({ modal })
  }

  setEntryFieldState(evt, fieldName) {
    const modal = this.state.modal
    modal[fieldName] = evt.target.value

    this.setState({ modal })
  }

  getUsersDataForSelect(users) {
    return users.map(user => ({
      value: user._id,
      label: user.name,
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

    if ((!modal.isEdit && modal.userSelectionState !== 'has-success') || (modal.isEdit && !modal.userSelection)) {
      modal.userSelectionState = 'has-danger'
      formValid = false
    }

    this.setState({ modal })
    return formValid
  }

  submitPromise(entryObj) {
    return this.state.modal.isEdit
      ? httpClient.updateAccountEntry(entryObj)
      : httpClient.addAccountEntry(entryObj)
  }

  submitEntry(evt) {
    evt.preventDefault()

    if (this.isModalValid()) {
      const modal = this.state.modal

      const entryObj = {
        _id: modal.entryId,
        userId: modal.userSelection._id,
        hairPrice: modal.hairPrice,
        nailPrice: modal.nailPrice,
        lashPrice: modal.lashPrice,
        waxPrice: modal.waxPrice
      }

      const _this = this
      this.submitPromise(entryObj).then(function(res) {
        if (res.success) {
          _this.getAllEntries()
          _this.toggleModal()
          Swal('Yaah', 'Account entry created', 'success')
        } else {
          Swal('Account entry not created!!!', res.error, 'error')
        }
      })
    }
  }

  render() {
    const { modal } = this.state
    const headerTitle = modal.isEdit ? 'Edit Entry' : 'Add new entry'

    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="manage-account">
              <CardHeader>
                <CardTitle tag="h4">Manage Account</CardTitle>
                <div>
                <Button color="primary" type="submit" onClick={this.toggleModal}>
                  Add New Entry
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
                        <FormGroup className={'has-label ' + modal.hairPriceState}>
                          <label>Hair Price: </label>
                          <Input
                            type="number"
                            value={modal.hairPrice}
                            onChange={e => this.setEntryFieldState(e, 'hairPrice')}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-md-1" md="8">
                        <FormGroup className={'has-label ' + modal.nailPriceState}>
                          <label>Nail Price:  </label>
                          <Input
                            type="number"
                            value={modal.nailPrice}
                            onChange={e => this.setEntryFieldState(e, 'nailPrice')}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-md-1" md="8">
                        <FormGroup className={'has-label ' + modal.lashPriceState}>
                          <label>Lash Price:  </label>
                          <Input
                            type="number"
                            value={modal.lashPrice}
                            onChange={e => this.setEntryFieldState(e, 'lashPrice')}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-md-1" md="8">
                        <FormGroup className={'has-label ' + modal.nailPriceState}>
                          <label>Wax Price:  </label>
                          <Input
                            type="number"
                            value={modal.waxPrice}
                            onChange={e => this.setEntryFieldState(e, 'waxPrice')}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
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
                </div>
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
                      accessor: 'name',
                      className: 'actions-center',
                    },
                    {
                      Header: 'Hair Price ($)',
                      accessor: 'hairPrice',
                      className: 'actions-center',
                    },
                    {
                      Header: 'Nail Price ($)',
                      accessor: 'nailPrice',
                      className: 'actions-center',
                    },
                    {
                      Header: 'Lash Price ($)',
                      accessor: 'lashPrice',
                      className: 'actions-center',
                    },
                    {
                      Header: 'Wax Price ($)',
                      accessor: 'waxPrice',
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
