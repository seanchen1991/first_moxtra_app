app.directive('clickAndDisable', [function() {
  return {
    scope: {
      clickAndDisable: '&'
    },
    link: function(scope, elem, attrs) {
      elem.bind('click', function() {
        elem.prop('disabled', true);
      });
    }
  }
}])
