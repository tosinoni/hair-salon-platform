import React from 'react'
// nodejs library that concatenates classes
import classNames from 'classnames'
// react plugin used to create charts
import { Line, Bar } from 'react-chartjs-2'

import FontAwesome from 'react-fontawesome'

import Button from '../../components/customButton/customButton'

import ReactTable from 'react-table'

import moment from 'moment'

import {
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from 'reactstrap'

import { chartExample1, getChartParameters } from '../../constants/charts'

import httpClient from '../../httpClient'

import { isArrayEmpty } from '../../util'

import './dashboard.scss'
import Tasks from '../../components/tasks/tasks'

class DashboardView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      bigChartData: 'data1',
      data: chartExample1['data1'],
      usersToFollowup: [],
      sumOfUsers: 0,
    }

    this.setBgChartData = this.setBgChartData.bind(this)

    httpClient.getAllUsersToFollowUp().then(res => {
      if (res && res.success && !isArrayEmpty(res.data)) {
        const data = this.getUsersToFollowUp(res.data)
        this.setState({ usersToFollowup: data })
      }
    })

    httpClient.getTotalUsersToFollowupPerMonthInCurrentyear().then(res => {
      if (res && res.success && !isArrayEmpty(res.data)) {
        this.parseFollowUpUserPerMonthData(res.data)
      }
    })
  }

  parseFollowUpUserPerMonthData(userData) {
    let dataPoints = new Array(12).fill(0)
    let sumOfUsers = 0

    for (let index=0; index < userData.length; index++) {
      let user = userData[index]
      if (user && user._id) {
        const index = user._id - 1
        dataPoints[index] = user.users
        sumOfUsers += dataPoints[index]
      }
    }
    
    const chartLineData = getChartParameters(this.refs.linegraph.chartInstance.canvas, dataPoints)
    this.setState({ data: chartLineData, totalUsers: sumOfUsers })
  }
  setBgChartData(name) {
    this.setState({
      bigChartData: name,
    })
  }

  editUserClicked(userObj) {
    this.props.history.push({
      pathname: '/profile',
      state: { id: userObj.userId },
    })
  }

  getUsersToFollowUp(users) {
    return users.map((user, key) => {
      return {
        id: key,
        userId: user._id,
        lastname: user.lastname,
        givenNames: user.givenNames,
        purposeOfFollowup: user.purposeOfFollowup,
        followupDate: moment(user.followupDate).format('MMMM Do YYYY'),
        actions: (
          // we've added some custom button actions
          <div className="actions-center">
            {/* use this button to add a like kind of action */}
            <Button
              onClick={() => {
                const obj = this.state.usersToFollowup.find(o => o.id === key)
                this.editUserClicked(obj)
              }}
              color="info"
              size="sm"
              round
              icon
            >
              <FontAwesome name="edit" />
            </Button>{' '}
          </div>
        ),
      }
    })
  }

  componentDidMount() {}
  componentWillUnmount() {}
  componentDidUpdate(e) {}

  render() {
    return (
      <div className="content">
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Total Users to followup Per Month this year</h5>
                    <CardTitle tag="h2">{this.state.totalUsers}</CardTitle>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line ref="linegraph" data={this.state.data} options={chartExample1.options} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card className="card-tasks">
              <CardHeader>
                <h6 className="card-title">Tasks</h6>
                <p className="card-category">Users follow-up arranged in the most recent order</p>
              </CardHeader>
              <CardBody>
                <ReactTable
                  data={this.state.usersToFollowup}
                  filterable
                  defaultFilterMethod={(filter, row) =>
                    row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                  }
                  columns={[
                    {
                      Header: 'Last Name',
                      accessor: 'lastname',
                      className: 'actions-center',
                    },
                    {
                      Header: 'Given Names',
                      accessor: 'givenNames',
                      className: 'actions-center',
                    },
                    {
                      Header: 'Follow-up reason',
                      accessor: 'purposeOfFollowup',
                      className: 'actions-center',
                    },
                    {
                      Header: 'Follow-up Date',
                      accessor: 'followupDate',
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

export default DashboardView
