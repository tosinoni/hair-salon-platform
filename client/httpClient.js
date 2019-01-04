import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { API_URL } from './constants/constants'

// instantiate axios
const httpClient = axios.create({
  baseURL: API_URL,
})
// Add a response interceptor
httpClient.interceptors.response.use(
  function(response) {
    if(response.data && response.data.message == 'Invalid token.') {
      httpClient.logOut();
    }
    return response
  },
  function(error) {
    return Promise.reject(error.response)
  },
)

httpClient.getToken = function() {
  return localStorage.getItem('token')
}

httpClient.setToken = function(token) {
  localStorage.setItem('token', token)
  this.defaults.headers.common.token = token
  return jwtDecode(token)
}

httpClient.changePassword = function(passwordInfo) {
  return this({ method: 'post', url: '/users/changePassword', data: passwordInfo })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.data
    })
}

httpClient.getCurrentUser = function() {
  const token = this.getToken()
  if (token) {
    const decodedToken = jwtDecode(token)
    return decodedToken
  }
  return null
}

httpClient.logIn = function(credentials) {
  return this({ method: 'post', url: '/users/login', data: credentials })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.data
    })
}

httpClient.register = function(userInfo) {
  return this({ method: 'post', url: '/users/register', data: userInfo })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.data
    })
}

httpClient.searchForUsers = function(query, page = 1) {
  return this({ method: 'get', url: '/users/search?name=' + query })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err
    })
}

httpClient.deleteUser = function(userId) {
  return this({ method: 'delete', url: '/users/' + userId })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.data
    })
}

httpClient.updateUser = function(userInfo) {
  return this({ method: 'put', url: '/users/' + userInfo._id, data: userInfo })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.data
    })
}

httpClient.getUser = function(userId) {
  return this({ method: 'get', url: '/users/' + userId })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err
    })
}

httpClient.getAllUsers = function() {
  return this({ method: 'get', url: '/users' })
    .then(res => {
      console.log(res.data)
      return res.data
    })
    .catch(err => {
      return err
    })
}

httpClient.getAllUsersToFollowUp = function() {
  return this({ method: 'get', url: '/users/followup' })
    .then(res => {
      console.log(res.data)
      return res.data
    })
    .catch(err => {
      return err
    })
}

httpClient.logOut = function() {
  localStorage.removeItem('token')
  delete this.defaults.headers.common.token
  return true
}

// During initial app load attempt to set a localStorage stored token
// as a default header for all api requests.
httpClient.defaults.headers.common.token = httpClient.getToken()
export default httpClient
