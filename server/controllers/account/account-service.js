const User = require('../../models/user')
const Account = require('../../models/account')

async function isEntryValid(entry) {
  const { userId, monthsOwing, amountOwing } = entry

  if (!userId) {
    return 'Please provide a user'
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
  entryModel.name = user.name
  entryModel.hairPrice = entryBody.hairPrice || 0
  entryModel.nailPrice = entryBody.nailPrice || 0
  entryModel.lashPrice = entryBody.lashPrice || 0
  entryModel.waxPrice = entryBody.waxPrice || 0

  console.log(user)
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
  isNewEntryValid
}
