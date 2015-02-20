var mongoose = require('mongoose');
var request = require('request');
var Student = require('./Student');

var CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  professor: { type: String },
  enrolled: { type: Number, default: 1 },
  owner: { 
    uniqueid: String,
    token: String
  },
  binderID: { type: String },
  students: []
});

CourseSchema.methods.incrementEnrolled = function(cb) {
  this.enrolled++;
  this.save(cb);
};

mongoose.model('Course', CourseSchema);
