$(document).ready(function(){
  var speed = 50;
  var head = $('.head');
  var body = $('.body');
  var tail = $('.tail');
  head.css({
    left: 280,
    top: 280
  })
  var headPos = head.position();
  body.css({
    left: headPos.left -50,
    top: headPos.top,
  })
  var bodyPos = body.position();
  tail.css({
    left: bodyPos.left -50,
    top: bodyPos.top,
  })

  var moveBody = function() {
    head.css({
      left: head.position().left + speed,
      top: headPos.top
    })
    body.css({
      left: body.position().left + speed,
      top: headPos.top
    })
    tail.css({
      left: tail.position().left + speed,
      top: headPos.top
    })
  }

  setInterval(function(){
    moveBody()
  }, 500)
});
