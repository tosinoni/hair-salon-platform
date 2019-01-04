import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import App from './views/App'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import 'react-table/react-table.css'
import 'react-datetime/css/react-datetime.css'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'

import './styles/app.scss'

const hist = createBrowserHistory()

ReactDOM.render(
  <Router history={hist}>
    <App />
  </Router>,
  document.getElementById('root'),
)
