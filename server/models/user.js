const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectIdSchema = Schema.ObjectId
const bcrypt = require('bcrypt-nodejs')

const User = new Schema(
  {
    _id: ObjectIdSchema,
    givenNames: String,
    lastname: String,
    fullname: String,
    username: String,
    phoneNumber: String,
    alternateTelephoneNumber: String,
    email: String,
    consultationOnly: Boolean,
    maritalStatus: String,
    presentImmigrationStatus: String,
    issueDate: Date,
    expiryDate: Date,
    followupDate: Date,
    purposeOfFollowup: String,
    notes: String,
    password: String,
    avatar: String,
    isAdmin: Boolean,
    role: String,
  },
  { timestamps: { createdAt: 'created_at' } },
)

// adds a method to a user document object to create a hashed password
User.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

// adds a method to a user document object to check if provided password is correct
User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

// middleware: before saving, check if password was changed,
// and if so, encrypt new password before saving:
User.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = this.generateHash(this.password)
  }
  next()
})

mongoose.set('useFindAndModify', false)
// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model('User', User)
