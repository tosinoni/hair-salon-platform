import React from 'react'
import { Table } from 'reactstrap'

import httpClient from '../../httpClient'
import { isArrayEmpty } from '../../util'

import './monthlyReport.scss'

class MonthlyReport extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            debtors: []
        }
    }

    componentDidMount() {
        httpClient.getAllDebtors().then(res => {
            if (res.success && !isArrayEmpty(res.data)) {
                this.setState({ debtors: res.data })
            }
        })
    }
    render() {
        return (
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Amount Owing ($)</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.debtors.map((debtor, index) => {
                        return (
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{debtor.fullname}</td>
                                <td>{debtor.email}</td>
                                <td>{debtor.phoneNumber}</td>
                                <td>{debtor.amountOwing}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        )
    }
}

export default MonthlyReport
