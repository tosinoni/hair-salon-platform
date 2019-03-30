const User = require('../../models/user')
const Account = require('../../models/account')

async function isAdminBodyValid(admin) {
  const { userId, password, role } = admin

  if (!userId) {
    return 'Please provide a user'
  }

  if (!role) {
    return 'Please provide an admin role'
  }

  let userWithId = await User.findById(userId)

  if (!userWithId) {
    return 'Invalid user specified'
  }

  return ''
}

async function isNewAdminBodyValid(admin) {
  const isAdminBodyNotValidMsg = await isAdminBodyValid(admin)

  if (isAdminBodyNotValidMsg) {
    return isAdminBodyNotValidMsg
  }

  if (!admin.password) {
    return 'Please provide a valid password'
  }

  if (!admin.username) {
    return 'Please provide a username'
  }

  var adminWithUserId = await User.findOne({ _id: admin.userId, isAdmin: true })

  return adminWithUserId ? 'User is already an admin' : ''
}

async function convertAdminBodyToAdminModel(adminBody) {
  let adminModel = await User.findById(adminBody.userId)

  if (adminBody.password) {
    adminModel.password = adminBody.password
  }

  if (adminBody.username) {
    adminModel.username = adminBody.username
  }
  
  adminModel.isAdmin = true
  adminModel.role = adminBody.role

  return adminModel
}

module.exports = {
  isAdminBodyValid,
  convertAdminBodyToAdminModel,
  isNewAdminBodyValid,
}
