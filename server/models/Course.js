var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  professor: { type: String },
  enrolled: { type: Number, default: 1 },
  owner: { type: String },
  binderID: { type: String },
  students: []
});

CourseSchema.methods.incrementEnrolled = function(cb) {
  this.enrolled++;
  this.save(cb);
};

mongoose.model('Course', CourseSchema);
