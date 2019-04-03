const User = require('../../models/user')
const Account = require('../../models/account')

async function isEntryValid(entry) {
  const { userId, monthsOwing, amountOwing } = entry

  if (!userId) {
    return 'Please provide a user'
  }

  if (!monthsOwing) {
    return 'Please provide the number of months owing'
  }

  if (!amountOwing) {
    return 'Please provide the amount owing'
  }

  var userWithId = await User.findById(userId)

  if (!userWithId) {
    return 'Invalid user specified'
  }

  return ''
}

async function convertAccountEntryBodyToAccountModel(entryBody) {
  var entryModel = {}

  const user = await User.findById(entryBody.userId)

  entryModel.userId = user._id
  entryModel.presentImmigrationStatus = user.presentImmigrationStatus
  entryModel.fullname = user.fullname
  entryModel.monthsOwing = entryBody.monthsOwing
  entryModel.amountOwing = entryBody.amountOwing

  return entryModel
}

async function isNewEntryValid(entry) {
  const isEntryBodyNotValidMsg = await isEntryValid(entry)

  if (isEntryBodyNotValidMsg) {
    return isEntryBodyNotValidMsg
  }

  var entryWithUserId = await Account.findOne({ userId: entry.userId })

  return entryWithUserId ? 'Entry for user already exists' : ''
}

module.exports = {
  isEntryValid,
  convertAccountEntryBodyToAccountModel,
  isNewEntryValid,
}
