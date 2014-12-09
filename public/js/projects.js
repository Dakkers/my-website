$(window).load(function() {
  $('.project-header').click(function() {
    var S, caret, hiddenContent, i;

    hiddenContent = $(this).siblings('.project-content');
    caret = $('img', this);
    if (hiddenContent.is(':visible')) {
      i = 90;
      S = setInterval(function() {
        caret.rotate(i);
        i--;
        if (i === 0) {
          return clearInterval(S);
        }
      }, 0.5);

    } else {
      i = 0;
      S = setInterval(function() {
        caret.rotate(i);
        i++;
        if (i === 90) {
          return clearInterval(S);
        }
      }, 0.5);
    }

    hiddenContent.slideToggle(500);
  });
});
