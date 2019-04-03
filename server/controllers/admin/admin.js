const User = require('../../models/user')
const AdminService = require('./admin-service')
const mongoose = require('mongoose')

exports.createAdmin = async function(req, res) {
  const isAdminBodyInValidMsg = await AdminService.isNewAdminBodyValid(req.body)
  if (isAdminBodyInValidMsg) {
    return res.status(400).send({
      success: false,
      error: isAdminBodyInValidMsg,
    })
  }

  const admin = await AdminService.convertAdminBodyToAdminModel(req.body)

  User.updateOne({ _id: admin._id }, admin, (err, user) => {
    if (err) return res.status(400).send({ success: false, error: 'Could not create admin' })
    return res.status(200).send({ success: true, data: user })
  })
}

exports.getAllAdmins = function(req, res) {
  User.find({ isAdmin: true,  _id: { $nin: [req.user._id] } }, (err, data) => {
    if (err) return res.status(204).send({ success: false, error: 'could not get all admins' })
    return res.status(200).send({ success: true, data: data })
  })
}

exports.updateAdmin = async function(req, res) {
  const isAdminBodyInValidMsg = await AdminService.isAdminBodyValid(req.body)
  if (isAdminBodyInValidMsg) {
    return res.status(400).send({
      success: false,
      error: isAdminBodyInValidMsg,
    })
  }

  const admin = await AdminService.convertAdminBodyToAdminModel(req.body)

  User.updateOne({ _id: admin._id }, admin, (err, user) => {
    if (err) return res.status(400).send({ success: false, error: 'Could not update admin' })
    return res.status(200).send({ success: true, data: user })
  })
}


exports.deleteAdminById = async function(req, res) {
  const { id } = req.params

  let admin = await User.findById(id)
  admin.isAdmin = false;

  User.updateOne({ _id: admin._id }, admin, (err, user) => {
    if (err) return res.status(400).send({ success: false, error: 'Could not remove admin' })
    return res.status(200).send({ success: true, data: user })
  })
}