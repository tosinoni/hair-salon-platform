const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const User = new Schema(
  {
    id: Number,
    firstname: String,
    lastname: String,
    middlename: String,
    username: String,
    telephoneNum: String,
    alternateTelephoneNum: String,
    email: String,
    consultationOnly: Boolean,
    presentImmigrationStatus: String,
    issueDate: Date,
    expiryDate: Date,
    followupDate: Date,
    purposeOfFollowup: String,
    notes: String,
    password: String,
    avatar: String,
    role: String
  }
);

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
	if(this.isModified('password')) {
		this.password = this.generateHash(this.password)
	}
	next();
});

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("User", User);