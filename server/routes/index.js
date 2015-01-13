var express = require('express');
var app = express();
var router = express.Router();

var mongoose = require('mongoose');

var Course = mongoose.model('Course');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.param('course', function(req, res, next, id) {
  var query = Course.findById(id);

  query.exec(function(err, course) {
    if (err)
      return next(err);
    if (!course)
      return next(new Error("Can't find course."));

    req.course = course;
    return next();
  });
});

router.get('/courses', function(req, res, next) {
  Course.find(function(err, courses) {
    if (err)
      return next(err);
    res.json(courses);
  });
});

router.post('/courses', function(req, res, next) {
  var course = new Course(req.body);

  course.save(function(err, course) {
    if (err)
      return next(err);
    res.json(course);
  });
});

router.get('/courses/:course', function(req, res) {
  res.json(req.course);
});

router.put('/courses/:course/enroll', function(req, res, next) {
  req.course.enroll(function(err, course) {
    if (err)
      return next(err);
    res.json(course);
  });
});

module.exports = router;
