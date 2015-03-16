var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var moxtraData = require('./../config/auth');

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

router.param('id', function(req, res, next, id) {
  Student.find({ uniqueID: id }, function(err, student) {
    if (err)
      return next(err);
    if (!student)
      return next(new Error("Can't find student."));
    req.student = student;
    return next();
  });
});

router.get('/login/data', function(req, res) {
  var student = req.user[0];
  console.log('/login/data student: ', student);
  var url = 'http://localhost:8000/students/' + student.uniqueID + '/access_token';
  request(url, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      console.log('/login/data body: ', body);
      student.token = JSON.parse(body);
      res.json(student);
    }
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
  var student = req.user[0];
  var options = {
    method: 'post',
    json: true,
    url: moxtraData.moxtraAuth.binderURL + student.token,
    headers: { 'content-type': 'application/json' },
    body: { 'name' : course.title, 'conversation' : true }
  };
  request(options, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      course.binderID = body.data.id;
      course.owner.uniqueid = student.uniqueID;
      course.owner.token = student.token;
      course.students.push(student.uniqueID);
      student.courses.push(course);
      student.save(function(err, student) {
        if (err)
          return next(err);
      });
      course.save(function(err, course) {
        if (err)
          return next(err);
        res.json(course);
      });
    }
  });
});

router.get('/courses/:course', function(req, res) {
  res.json(req.course);
});

router.put('/courses/:course/enroll', function(req, res, next) {
  var course = req.course;
  var url = 'http://localhost:8000/students/' + req.user[0].uniqueID + '/access_token';

  request(url, function(err, response, body) {
    console.log("Update course access token with: ", body);
    course.owner.token = JSON.parse(body);
    console.log("Updated course: ", course);
    course.incrementEnrolled(function(err, course) {
      if (err)
        return next(err);
      course.students.push(req.user[0].uniqueID);
      course.save(function(err, course) {
        if (err)
          return next(err);
        res.json(course);
      });
    });
  });
});

router.get('/students', function(req, res, next) {
  Student.find(function(err, students) {
    if (err)
      return next(err);
    res.json(students);
  });
});

router.get('/students/:id', function(req, res) {
  res.json(req.student[0]);
});

router.get('/students/:id/access_token', function(req, res) {
  res.json(req.student[0].token);
});

router.post('/students/:id/enroll', function(req, res, next) {
  var course = new Course(req.body);
  var student = req.student[0];
  console.log("Students enroll req: ", student);
  var options = {
    method: 'post',
    json: true,
    url: 'https://api.moxtra.com/' + course.binderID + '/addteamuser?access_token=' + course.owner.token,
    headers: { 'content-type': 'application/json' },
    body: {
      'users': [
        {
          'user': {
            'unique_id': student.uniqueID
          }
        }
      ],
      'email_off': true,
      'notification_off': true,
      'suppress_feed': true
    }
  };
  request(options, function(err, response, body) {
    console.log("Post Enroll Response body:", body);
    if (!err && response.statusCode == 200) {
      student.courses.push(course);
      student.save(function(err, student) {
        if (err)
          return next(err);
        res.json(course);
      });
    }
  });
});

module.exports = router;
