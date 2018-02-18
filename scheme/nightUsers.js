var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  email: {type: String, default: null},
  githubId: {type: String, default: null},
  vkId: {type: String, default: null},
  city: {type: String, default: null},
  regDate: Date,
  regStrategy: {type: String, default: 'local'},
  lastSearch:{type: String, default: null}
});

var nightUser = mongoose.model('User', userSchema);

module.exports = nightUser;