const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
//ya is liya h taky koi user again aik jas kopi chhe na enter kr saky eg:eamil..
const User = mongoose.model("user", UserSchema);
// User.createIndexes();  is se just email ki index bany gi means k just email unique ho ga but is ka logic auth.js ma likh rahy h
module.exports = User;
