app.factory('courses', ['$http', 'students', function($http, students) {
  var o = {
    courses: []
  };
  o.create = function(course) {
    return $http.post('/courses', course).success(function(data) {
      o.courses.push(data);
      students.student.courses.push(data);
    });
  };
  o.get = function(id) {
    return $http.get('/courses/' + id).then(function(res) {
      return res.data;
    });
  };
  o.getAll = function() {
    return $http.get('/courses').success(function(data) {
      angular.copy(data, o.courses);
      console.log("Courses: ", o.courses);
    });
  };
  o.incrementEnrolled = function(course) {
    return $http.put('/courses/' + course._id + '/enroll')
      .success(function(data) {
        course.enrolled++;
      });
  };
  o.join = function(course) {
    var options = {
      binder_id: course.binderID,
      iframe: false,
      // tagid4iframe: 'container',
      // iframewidth: '500px',
      // iframeheight: '450px',
      autostart_meet: true,
      autostart_note: false,
      start_chat: function(event) {
        console.log('Chat started session Id: ' + event.session_id);
      },
      start_meet: function(event) {
        console.log('Meet started session key: ' + event.session_key + ' session id: ' + event.session_id);
      },
      end_meet: function(event) {
        console.log('Meet end event');
      },
      invite_member: function(event) {
        console.log('Invite member into binder Id: ' + event.binder_id);
      },
      request_note: function(event) {
        console.log('Note start request');
      },
      error: function(event) {
        console.log('Chat error code: ' + event.error_code + ' error message: ' + event.error_message);
      }
    };
    Moxtra.chat(options);
  };
  return o;
}])
