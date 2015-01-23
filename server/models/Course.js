var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  professor: String,
  enrolled: { type: Number, default: 0 },
  binderID: { type: String }
});

CourseSchema.methods.incrementEnrolled = function(cb) {
  this.enrolled++;
  this.save(cb);
};

mongoose.model('Course', CourseSchema);
