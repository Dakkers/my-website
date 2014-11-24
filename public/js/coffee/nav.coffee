#   cfcoptions : { "out": ".."   }   


$(window).load ->
  links =
    "lin": "https://linkedin.com/in/dakotastlaurent"
    "pro": "/projects"
    "blo": "/blog"
    "git": "https://github.com/stdako"
    "twi": "https://twitter.com/stdako"
    "hom": "/"

  $("li").click ->
    id = $(this).attr('id')
    val = id.substring(3,id.length)
    $(location).attr('href', links[val])
    return

  return
