var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  professor: String,
  enrolled: { type: Number, default: 0 },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

CourseSchema.methods.incrementEnrolled = function(cb) {
  this.enrolled++;
  this.save(cb);
};

mongoose.model('Course', CourseSchema);
