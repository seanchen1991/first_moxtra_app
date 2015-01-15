var express = require('express');
var app = express();
var router = express.Router();

var mongoose = require('mongoose');

var Course = mongoose.model('Course');
var Student = mongoose.model('Student');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.param('course', function(req, res, next, id) {
  Course.findById(id, function(err, course) {
    if (err)
      return next(err);
    if (!course)
      return next(new Error("Can't find course."));
    req.course = course;
    return next();
  });
});

router.param('username', function(req, res, next, username) {
  Student.findOne({ 'username' : username }, function(err, student) {
    if (err)
      return next(err);
    if (!student)
      return next(new Error("Can't find student."));
    req.student = student;
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
  req.course.incrementEnrolled(function(err, course) {
    if (err)
      return next(err);
    res.json(course);
  });
});

router.get('/students', function(req, res, next) {
  Student.find(function(err, students) {
    if (err)
      return next(err);
    res.json(students);
  });
});

router.post('/students', function(req, res, next) {
  var student = new Student(req.body);

  student.save(function(err, student) {
    if (err)
      return next(err);
    res.json(student);
  });
});

router.get('/students/:username', function(req, res) {
  res.json(req.student);
});

router.put('/students/:username', function(req, res, next) {
  var course = new Course(req.body);
  course.student = req.student;

  course.save(function(err, course) {
    req.student.courses.push(course);
    req.student.save(function(err, student) {
      if (err)
        return next(err);
      res.json(course);
    });
  });
});

router.get('/login/data', function(req, res) {
  res.json(req.user);
});

module.exports = router;
