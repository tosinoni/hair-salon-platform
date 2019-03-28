const Account = require('../../models/account')
const AccountService = require('./account-service')
const mongoose = require('mongoose')

exports.addEntry = async function(req, res) {
  const isAccountEntryBodyInValidMsg = await AccountService.isNewEntryValid(req.body)
  if (isAccountEntryBodyInValidMsg) {
    return res.status(400).send({
      success: false,
      error: isAccountEntryBodyInValidMsg,
    })
  }

  let accountEntry = await AccountService.convertAccountEntryBodyToAccountModel(req.body)
  accountEntry._id = new mongoose.Types.ObjectId()

  Account.create(accountEntry, (err, entry) => {
    if (err) return res.status(400).send({ success: false, error: 'Could not create account entry' })

    res.status(200).send({ success: true, data: entry })
  })
}

exports.getAllEntries = function(req, res) {
  Account.find({}, (err, data) => {
    if (err) return res.status(204).send({ success: false, error: 'could not get all account entries' })
    return res.status(200).send({ success: true, data: data })
  })
}

exports.updateEntry = async function(req, res) {
  const { id } = req.params

  const isAccountEntryBodyInValidMsg = await AccountService.isEntryValid(req.body)
  if (isAccountEntryBodyInValidMsg) {
    return res.status(400).send({
      success: false,
      error: isAccountEntryBodyInValidMsg,
    })
  }

  let accountEntry = await AccountService.convertAccountEntryBodyToAccountModel(req.body)

  Account.updateOne({ _id: id }, accountEntry, (err, user) => {
    if (err) return res.status(400).send({ success: false, error: 'Could not update entry' })
    return res.status(200).send({ success: true, data: user })
  })
}

exports.deleteEntryById = function(req, res) {
  const { id } = req.params

  Account.deleteOne({ _id: id }, err => {
    if (err) return res.status(204).send({ success: false, error: 'Could not delete entry' })
    return res.status(200).send({ success: true })
  })
}