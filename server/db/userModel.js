const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();


const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
  login_name:  { type: String },
	password:  { type: String },
  
});

userSchema.pre('save', async function (next) {

  const user = this
  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})


userSchema.methods.generateAuthToken = async function() {

  const user = this
  const token = jwt.sign({_id: user._id}, process.env.JWT_KEY, {  expiresIn: '1h'})
 
  return token

}

userSchema.statics.findByCredentials = async (login_name, password) => {


  const user = await User.findOne({ login_name } )

  if (!user) {
      throw new Error('User does not exist!')
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
      throw new Error('Wrong password')
  }
  return user

}

// module.exports = mongoose.model.Users || mongoose.model("Users", userSchema);
const User = mongoose.model('User', userSchema);

module.exports = User;