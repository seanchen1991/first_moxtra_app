var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var studentSchema = mongoose.Schema({
  uniqueID : { type: String },
  name : { type: String },
  courses: []
});

// studentSchema.methods.generateHash = function(password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// studentSchema.methods.validPassword = function(password) {
//   return bcrypt.compareSync(password, this.password);
// };

module.exports = mongoose.model('Student', studentSchema);
