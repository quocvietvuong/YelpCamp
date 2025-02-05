const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  }
  // don't need to specify username and password here because passportLocalMongoose as a plugin will handle this
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)