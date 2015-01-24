var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request-promise');
var CryptoJS = require('crypto-js');

var Course = mongoose.model('Course');
var Student = mongoose.model('Student');

var clientID = 'mpzVqzEzCIo';
var clientSecret = 'vvui5RuC9sU';
var grantType = 'http://www.moxtra.com/auth_uniqueid';

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

// router.get('/students/:username/binderid', function(req, res) {
//   request.post('https://api.moxtra.com/v1/me/binders?access_token=' + req.student.token, function(err, response, body) {
//     if (!err && response.statusCode == 200) {
//       var parsed = JSON.parse(body);
//       res.json(parsed);
//     }
//   }).catch(console.error);
// });

// router.post('/courses', function(req, res, next) {
//   var course = new Course(req.body);
//   request.post('https://api.moxtra.com/v1/me/binders?access_token='+token, function(err, response, body) {
//     if (!err && response.statusCode == 200) {
//       course.binderID = body.binderID;
//     }
//   }).then(
//     course.save(function(err, course) {
//       if (err)
//         return next(err);
//       res.json(course);
//     })
//   ).catch(console.error);
// });

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
  var student;
  var uniqueID = req.user._id;
  var timestamp = new Date().getTime();
  var hash = CryptoJS.HmacSHA256(clientID + uniqueID + timestamp, clientSecret);
  var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  var signature = hashInBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  var url = 'https://api.moxtra.com/oauth/token?client_id='+clientID+'&client_secret='+clientSecret+'&grant_type='+grantType+'&uniqueid='+uniqueID+'&timestamp='+timestamp+'&signature='+signature;
  
  request.post(url, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      console.log("Students post route body: ", body);
      req.body.token = body;
      student = new Student(req.body);
    }
  }).then(student.save(function(err, student) {
    if (err)
      return next(err);
    res.json(student);
  })).catch(console.error);
});

router.get('/students/:username', function(req, res) {
  res.json(req.student);
});

// router.get('/students/:username/token', function(req, res) {
//   var uniqueID = req.student._id;
//   var timestamp = new Date().getTime();
//   var hash = CryptoJS.HmacSHA256(clientID + uniqueID + timestamp, clientSecret);
//   var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
//   var signature = hashInBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
//   var url = 'https://api.moxtra.com/oauth/token?client_id='+clientID+'&client_secret='+clientSecret+'&grant_type='+grantType+'&uniqueid='+uniqueID+'&timestamp='+timestamp+'&signature='+signature;
  
//   request.post(url, function(err, response, body) {
//     if (!err && response.statusCode == 200) {
//       var parsed = JSON.parse(body);
//       res.json(parsed);
//     }
//   }).catch(console.error);
// });

router.post('/students/:username/enroll', function(req, res, next) {
  var course = new Course(req.body);
  var student = req.student;

  student.courses.push(course);
  student.save(function(err, student) {
    if (err)
      return next(err);
    res.json(course);
  });
});

router.get('/login/data', function(req, res) {
  var uniqueID = req.user._id;
  var timestamp = new Date().getTime();
  var hash = CryptoJS.HmacSHA256(clientID + uniqueID + timestamp, clientSecret);
  var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  var signature = hashInBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  var url = 'https://api.moxtra.com/oauth/token?client_id='+clientID+'&client_secret='+clientSecret+'&grant_type='+grantType+'&uniqueid='+uniqueID+'&timestamp='+timestamp+'&signature='+signature;
  
  request.post(url, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var parsed = JSON.parse(body);
      token = parsed.access_token;
      req.user.token = token;
    }
  }).then(res.json(req.user))
  .catch(console.error);
});

module.exports = router;
