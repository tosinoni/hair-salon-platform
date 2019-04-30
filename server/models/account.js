const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectIdSchema = Schema.ObjectId

const Account = new Schema(
  {
    _id: ObjectIdSchema,
    userId: String,
    fullname: String,
    presentImmigrationStatus: String,
    monthsOwing: Number,
    amountOwing: Number,
    isPaymentMade: Boolean,
  },
  { timestamps: { createdAt: 'created_at' } },
)

mongoose.set('useFindAndModify', false)
// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model('Account', Account)
