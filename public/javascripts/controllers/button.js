$('#enroll').on('click', function() {
  var el = $(this);
  el.text() == el.data("text-swap") ? 
  el.text(el.data("text-original")) :
  el.text(el.data("text-swap"));
});
