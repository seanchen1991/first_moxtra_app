var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var studentSchema = mongoose.Schema({
  username : { type: String, required: true },
  password : { type: String, require: true },
  courses : [ {type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

studentSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

studentSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

studentSchema.methods.enroll = function(course) {
  this.courses.push(course);
  this.save(course);
};

module.exports = mongoose.model('Student', studentSchema);
