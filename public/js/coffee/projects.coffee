#   cfcoptions : { "out": ".."   }   
$(window).load ->
  
  $('.project').click ->
    hiddenContent = $('.hidden-content', this)
    caret = $('img', this)
    if hiddenContent.is(':visible')
      i = 90
      S = setInterval(->
        caret.rotate(i)
        i--
        if (i == 0)
          clearInterval(S)
      , 0.5)
      hiddenContent.slideUp(500)
      
    else
      i = 0
      S = setInterval(->
        caret.rotate(i)
        i++
        if (i == 90)
          clearInterval(S)
      , 0.5)
      hiddenContent.slideDown(500)
    return
  
  return
