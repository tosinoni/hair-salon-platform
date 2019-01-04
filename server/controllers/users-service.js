const User = require('../models/user')

function isUserBodyNotValid(userBody) {
  const {
    lastname,
    givenNames,
    email,
    phoneNumber,
    issueDate,
    expiryDate,
    maritalStatus,
    presentImmigrationStatus,
    followupDate,
  } = userBody

  if (!lastname) {
    return 'Please provide a valid last name'
  } else if (!givenNames) {
    return 'Please provide the given names'
  } else if (!email) {
    return 'Please provide an email'
  } else if (!phoneNumber) {
    return 'Please provide a phone number'
  } else if (!presentImmigrationStatus) {
    return 'Please provide the current immigration status'
  } else if (!maritalStatus) {
    return 'Please provide the marital status'
  } else if (issueDate && expiryDate && issueDate > expiryDate) {
    return 'Issue date cannot be greater than expiry date'
  } else if (followupDate && followupDate < Date.now()) {
    return 'Follow-up date cannot be less than today'
  }
}

async function isUserValidForRegistration(userBody) {
  const { email, phoneNumber } = userBody

  const isUserBodyNotValidMsg = isUserBodyNotValid(userBody)

  if (isUserBodyNotValidMsg) {
    return isUserBodyNotValidMsg
  }

  var userWithEmail = await findUserByEmail(email)
  if (userWithEmail) {
    return 'user with email exists already'
  }

  var userWithPhoneNumber = await findUserByPhoneNumber(phoneNumber)
  if (userWithPhoneNumber) {
    return 'user with phone number exists already'
  }
}

async function isUserNotValidForUpdate(userBody) {
  const { _id, email, phoneNumber } = userBody

  if (!_id) {
    return 'user is not registered'
  }

  const isUserBodyNotValidMsg = isUserBodyNotValid(userBody)
  if (isUserBodyNotValidMsg) {
    return isUserBodyNotValidMsg
  }

  var userWithEmail = await findUserByEmail(email)

  if (userWithEmail && userWithEmail._id != _id) {
    return 'user with email exists already'
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

  userModel.lastname = userBody.lastname.trim()
  userModel.givenNames = userBody.givenNames.trim()
  userModel.fullname = userBody.lastname.trim() + ' ' + userBody.givenNames.trim()
  userModel.phoneNumber = userBody.phoneNumber.trim()
  userModel.alternateTelephoneNumber = userBody.alternateTelephoneNumber.trim()
  userModel.email = userBody.email.trim()
  userModel.consultationOnly = userBody.consultationOnly
  userModel.maritalStatus = userBody.maritalStatus
  userModel.issueDate = userBody.issueDate
  userModel.expiryDate = userBody.expiryDate
  userModel.presentImmigrationStatus = userBody.presentImmigrationStatus
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
