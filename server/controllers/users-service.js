const User = require('../models/user')

function isUserBodyNotValid(userBody) {
  const {
    name,
    phoneNumber,
    followupDate,
    lastServiceDate
  } = userBody

  if (!name) {
    return 'Please provide a valid last name'
  } else if (!phoneNumber) {
    return 'Please provide a phone number'
  }  else if (followupDate && followupDate < Date.now()) {
    return 'Follow-up date cannot be less than today'
  } else if (lastServiceDate && lastServiceDate > Date.now()) {
    return 'last service date cannot be greater than today'
  }
}

async function isUserValidForRegistration(userBody) {
  const { phoneNumber } = userBody

  const isUserBodyNotValidMsg = isUserBodyNotValid(userBody)

  if (isUserBodyNotValidMsg) {
    return isUserBodyNotValidMsg
  }

  var userWithPhoneNumber = await findUserByPhoneNumber(phoneNumber)
  if (userWithPhoneNumber) {
    return 'user with phone number exists already'
  }
}

async function isUserNotValidForUpdate(userBody) {
  const { _id, phoneNumber } = userBody

  if (!_id) {
    return 'user is not registered'
  }

  const isUserBodyNotValidMsg = isUserBodyNotValid(userBody)
  if (isUserBodyNotValidMsg) {
    return isUserBodyNotValidMsg
  }

  var userWithPhoneNumber = await findUserByPhoneNumber(phoneNumber)
  if (userWithPhoneNumber && userWithPhoneNumber._id != _id) {
    return 'user with phone number exists already'
  }
}

async function isAdminPasswordInfoInValid(passwordInfo) {
  const { currentPassword, newPassword, confirmPassword } = passwordInfo

  if (!passwordInfo) {
    return 'Please provide a current password'
  } else if (!newPassword) {
    return 'Please provide a new password'
  } else if (!confirmPassword) {
    return 'Please provide a confirmed new password'
  } else if (confirmPassword !== newPassword) {
    return 'new password and verified password do not match'
  }

  const admin = await findAdmin()

  if (admin && !admin.validPassword(currentPassword)) {
    return 'invalid current password provided'
  }

  if (admin && admin.validPassword(newPassword)) {
    return 'current and new password cannot be the same'
  }
}

function convertUserBodyToUserModel(userBody) {
  var userModel = {}

  console.log(userBody)
  userModel.name = userBody.name.trim()
  userModel.phoneNumber = userBody.phoneNumber.trim()
  userModel.alternateTelephoneNumber = userBody.alternateTelephoneNumber.trim()
  userModel.lastServiceDate = userBody.lastServiceDate
  userModel.serviceType = userBody.serviceTypeSelected
  userModel.followupDate = userBody.followupDate ? userBody.followupDate : ''
  userModel.purposeOfFollowup = userBody.purposeOfFollowup ? userBody.purposeOfFollowup : ''
  userModel.notes = userBody.notes ? userBody.notes.trim() : ''
  userModel.isAdmin = false

  return userModel
}

async function findUserByEmail(email) {
  try {
    return User.findOne({ email: email.toLowerCase() })
  } catch (error) {
    throw new Error(`Unable to connect to the database.`)
  }
}

async function findUserByPhoneNumber(phoneNumber) {
  try {
    return User.findOne({ phoneNumber: phoneNumber })
  } catch (error) {
    throw new Error(`Unable to connect to the database.`)
  }
}

async function findAdmin() {
  try {
    return User.findOne({ isAdmin: true })
  } catch (error) {
    throw new Error(`Unable to connect to the database.`)
  }
}

async function findUsersToFollowupWithToday() {
  try {
    const currentDate = new Date()
    currentDate.setHours(0,0,0,0)
    return User.find({
      followupDate: {
        $gte: currentDate,
        $lt: new Date(new Date().setDate(new Date().getDate() + 1)),
      },
    })
  } catch (error) {
    throw new Error(`Unable to connect to the database.`)
  }
}

module.exports = {
  isUserNotValidForUpdate,
  isUserValidForRegistration,
  isAdminPasswordInfoInValid,
  findUserByEmail,
  findUserByPhoneNumber,
  findAdmin,
  convertUserBodyToUserModel,
  findUsersToFollowupWithToday,
}
