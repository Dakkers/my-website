(function() {
  $(window).load(function() {
    $('.project').click(function() {
      var S, caret, hiddenContent, i;
      hiddenContent = $('.hidden-content', this);
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
        hiddenContent.slideUp(500);
      } else {
        i = 0;
        S = setInterval(function() {
          caret.rotate(i);
          i++;
          if (i === 90) {
            return clearInterval(S);
          }
        }, 0.5);
        hiddenContent.slideDown(500);
      }
    });
  });

}).call(this);
