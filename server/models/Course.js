var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  professor: String,
  enrolled: { type: Number, default: 0 },
});

CourseSchema.methods.enroll = function(cb) {
  this.enrolled++;
  this.save(cb);
};

mongoose.model('Course', CourseSchema);
