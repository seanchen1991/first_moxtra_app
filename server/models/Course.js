var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  professor: String,
  enrolled: { type: Number, default: 0 },
  binderId: { type: String, unique: true }
});

CourseSchema.methods.incrementEnrolled = function(cb) {
  this.enrolled++;
  this.save(cb);
};

mongoose.model('Course', CourseSchema);
