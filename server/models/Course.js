var mongoose = require('mongoose');
var request = require('request');

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

CourseSchema.methods.getAccessToken = function() {
  request.get('/students/' + this.owner + '/access_token', function(err, response, body) {
    if (err)
      return next(err);
    return body;
  });
};

mongoose.model('Course', CourseSchema);
