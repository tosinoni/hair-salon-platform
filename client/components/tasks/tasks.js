import React, { Component } from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

import FontAwesome from 'react-fontawesome'
import Button from '../../components/customButton/customButton'

export class Tasks extends Component {
  constructor(props) {
    super(props)
  }

  handleCheckbox() {
    const target = event.target
    console.log(event.target)
    this.setState({
      [target.name]: target.checked,
    })
  }

  render() {
    const edit = <Tooltip id="edit_tooltip">Edit Task</Tooltip>
    const remove = <Tooltip id="remove_tooltip">Remove</Tooltip>
    const tasks_title = [
      'Sign contract for "What are conference organizers afraid of?"',
      'Lines From Great Russian Literature? Or E-mails From My Boss?',
      'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroi',
      'Create 4 Invisible User Experiences you Never Knew About',
      'Read "Following makes Medium better"',
      'Unfollow 5 enemies from twitter',
    ]
    var tasks = []
    var number
    for (var i = 0; i < tasks_title.length; i++) {
      number = 'checkbox' + i
      tasks.push(
        <tr key={i}>
          <td />
          <td>{tasks_title[i]}</td>
          <td className="td-actions text-right">
            <OverlayTrigger placement="top" overlay={edit}>
              <Button className="btn-simple btn btn-xs btn-info">
                <FontAwesome name="edit" className="icon" />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={remove}>
              <Button className="btn-simple btn btn-xs btn-danger">
                <FontAwesome name="times" className="icon" />
              </Button>
            </OverlayTrigger>
          </td>
        </tr>,
      )
    }
    return <tbody>{tasks}</tbody>
  }
}

export default Tasks
