import React from 'react'
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap'

import ReactTable from 'react-table'
import FontAwesome from 'react-fontawesome'

import Button from '../../components/customButton/customButton'
import Swal from 'sweetalert2'

import httpClient from '../../httpClient'

import { isArrayEmpty } from '../../util'

import './users.scss'
class Users extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      viewProfile: false,
    }

    httpClient.getAllUsers().then(users => {
      if (users && users.success && !isArrayEmpty(users.data)) {
        const data = this.getUsersDataForTable(users.data)
        this.setState({ data: data })
      }
    })

    this.deleteUser = this.deleteUser.bind(this)
    this.editUserClicked = this.editUserClicked.bind(this)
  }

  editUserClicked(userObj) {
    this.props.history.push({
      pathname: '/profile',
      state: { id: userObj.userId }
    })
  }

  deleteUser(userObj) {
    httpClient.deleteUser(userObj.userId).then(res => {
      if (res.success) {
        var data = this.state.data
        data.find((o, i) => {
          if (o.id === userObj.id) {
            data.splice(i, 1)
            return true
          }
          return false
        })
        this.setState({ data: data })
        Swal('Deleted', 'User deleted successfully', 'success')
      } else {
        Swal('Oops', res.error, 'error')
      }
    })
  }

  getUsersDataForTable(users) {
    return users.map((user, key) => {
      return {
        id: key,
        userId: user._id,
        lastname: user.lastname,
        givenNames: user.givenNames,
        presentImmigrationStatus: user.presentImmigrationStatus,
        phoneNumber: user.phoneNumber,
        actions: (
          // we've added some custom button actions
          <div className="actions-center">
            {/* use this button to add a like kind of action */}
            <Button
              onClick={() => {
                const obj = this.state.data.find(o => o.id === key)
                this.editUserClicked(obj)
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
                  text: 'You will not be able to recover this user!',
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, delete user!',
                  confirmButtonColor: '#d33',
                  cancelButtonText: 'Cancel',
                }).then(result => {
                  if (result.value) {
                    this.deleteUser(obj)
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

  componentDidUpdate(e) {}

  render() {
    const { data } = this.state
    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="users">
              <CardHeader>
                <CardTitle tag="h4">Users</CardTitle>
              </CardHeader>
              <CardBody>
                <ReactTable
                  data={this.state.data}
                  filterable
                  defaultFilterMethod={(filter, row) => 
                    (row[filter.id].toUpperCase().includes(filter.value.toUpperCase()))}
                  columns={[
                    {
                      Header: 'Last Name',
                      accessor: 'lastname',
                      className: "actions-center"
                    },
                    {
                      Header: 'Given Names',
                      accessor: 'givenNames',
                      className: "actions-center"
                    },
                    {
                      Header: 'Immigration Status',
                      accessor: 'presentImmigrationStatus',
                      className: "actions-center"
                    },
                    {
                      Header: 'Phone Number',
                      accessor: 'phoneNumber',
                      className: "actions-center"
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

export default Users
