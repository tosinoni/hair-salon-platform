const User = require('../models/user')
const signToken = require('../auth/auth.js').signToken
const UserService = require('./users-service')
const mongoose = require('mongoose')

exports.getAllUsers = function(req, res) {
  User.find({ isAdmin: false }, (err, data) => {
    if (err) return res.status(204).send({ success: false, error: 'could not get all users' })
    return res.status(200).send({ success: true, data: data })
  })
}

exports.getCurrentUser = function(req, res) {
  return res.status(200).send({ success: true, data: req.user })
}

exports.searchForUsers = function(req, res) {
  const { name } = req.query
  const regex = new RegExp('.*' + name + '.*', 'i')

  User.find(
    {
      $or: [
        { lastname: { $regex: regex } },
        { givenNames: { $regex: regex } },
        { fullname: { $regex: regex } },
      ],
      _id: { $nin: [req.user._id] }
    },
    (err, data) => {
      return res.status(200).send({ success: true, data: data && data.length > 0 ? data : [] })
    },
  )
}

exports.getTotalUsersToFollowupPerMonthInCurrentyear = function(req, res) {
  //create next year date
  const currentYear = new Date().getFullYear()
  const previousYearDate = new Date(currentYear - 1 + '-01-01')
  const nextYearDate = new Date(currentYear + 1 + '-01-01')

  User.aggregate(
    [
      {
        $match: {
          followupDate: { $gte: previousYearDate, $lt: nextYearDate },
        },
      },
      {
        $group: {
          _id: { $month: '$followupDate' },
          users: { $sum: 1 },
        },
      },
    ],
    (err, data) => {
      if (err) return res.status(204).send({ success: false, error: 'could not get the users' })
      return res.status(200).send({ success: true, data: data && data.length > 0 ? data : [] })
    },
  )
}

//all users to follow up three months from now
exports.getAllUsersToFollowUp = function(req, res) {
  let cutoff = new Date()
  cutoff.setHours(0, 0, 0, 0)
  cutoff.setDate(cutoff.getDate() + 90)

  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  User.find({ followupDate: { $gte: currentDate, $lt: cutoff } })
    .sort('followupDate')
    .exec((err, data) => {
      if (err)
        return res.status(204).send({ success: false, error: 'could not get followup dates' })
      return res.status(200).send({ success: true, data: data })
    })
}

exports.findUserById = function(req, res) {
  const { id } = req.params

  User.findById(id, (err, data) => {
    if (err) return res.status(204).send({ success: false, error: 'could not find user' })
    return res.status(200).send({ success: true, data: data })
  })
}

exports.deleteUserById = function(req, res) {
  const { id } = req.params
  User.deleteOne({ _id: id }, err => {
    if (err) return res.status(204).send({ success: false, error: 'Could not delete user' })
    return res.status(200).send({ success: true })
  })
}

exports.UpdateUser = async function(req, res) {
  const { id } = req.params

  const isUserBodyInValidMsg = await UserService.isUserNotValidForUpdate(req.body)

  if (isUserBodyInValidMsg) {
    return res.status(400).send({
      success: false,
      error: isUserBodyInValidMsg,
    })
  }

  const userModel = UserService.convertUserBodyToUserModel(req.body)

  User.updateOne({ _id: id }, userModel, { new: true }, (err, user) => {
    if (err) return res.status(400).send({ success: false, error: 'Could not update user' })
    return res.status(200).send({ success: true, data: user })
  })
}

exports.registerUser = async function(req, res) {
  const isUserBodyInValidMsg = await UserService.isUserValidForRegistration(req.body)
  if (isUserBodyInValidMsg) {
    return res.status(400).send({
      success: false,
      error: isUserBodyInValidMsg,
    })
  }

  let userModel = UserService.convertUserBodyToUserModel(req.body)
  userModel._id = new mongoose.Types.ObjectId()

  User.create(userModel, (err, user) => {
    if (err) return res.status(400).send({ success: false, error: 'Could not register user' })

    res.status(200).send({ success: true, data: user })
  })
}

exports.login = function(req, res) {
  const { username, password } = req.body

  // check if the user exists
  User.findOne({ username: username }, (err, user) => {
    // if there's no user or the password is invalid
    console.log(user)
    if (!user || !user.validPassword(password)) {
      // deny access
      return res.status(400).send({
        success: false,
        error: 'Login failed. Please provide a valid username and password',
      })
    }

    const token = signToken(user)
    res.status(200).send({ success: true, message: 'Token attached.', token })
  })
}

exports.changePassword = async function(req, res) {
  const isAdminPasswordInfoInValidMsg = await UserService.isAdminPasswordInfoInValid(req.body)

  if (isAdminPasswordInfoInValidMsg) {
    return res.status(400).send({
      success: false,
      error: isAdminPasswordInfoInValidMsg,
    })
  }

  const userModel = await UserService.findAdmin()
  userModel.password = userModel.generateHash(req.body.newPassword)

  User.updateOne({ isAdmin: true }, userModel, { new: true }, (err, user) => {
    if (err)
      return res.status(400).send({ success: false, error: 'Could not update admin password' })
    return res.status(200).send({ success: true })
  })
}

exports.createAdmin = function() {
  var user = {
    givenNames: 'Admin',
    lastname: 'Admin',
    username: 'admin',
    password: 'Admin123',
    isAdmin: true,
    role: 'Executive',
    _id: new mongoose.Types.ObjectId(),
  }

  User.findOne({ username: user.username }, (err, userFound) => {
    // if there's no user or the password is invalid
    if (!userFound) {
      User.create(user, (err, userCreated) => {
        if (err) console.log('could not create admin')
      })
    } else {
      userFound.role = 'Executive';
      User.updateOne({ _id: userFound._id }, userFound, (err, user) => {
        if (err) console.log('could not make admin executive')
      })
    }
  })
}
