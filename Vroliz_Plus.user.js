// ==UserScript==
// @name        Vroliz plus
// @namespace   http://b1nj.fr
// @description Améliore l'ergonomie du site Vroliz. Ajoute des liens vers la recherche Allo ciné.
// @include     http://www.vroliz.com/*
// @version     0.1
// @grant       none
// @copyright   B1nj
// @license GPL version 3 or any later version; www.gnu.org/copyleft/gpl.htm
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// ==/UserScript==


$(function() {
  
  var link = 'http://www.allocine.fr/recherche/?q=';
  
  $('#polo span a').each(function() {
      var regex = /[\t ]*(.*)[ ]*\([0-9]*\)[ A-Z]*/;
      var input = $(this).text();
      if(regex.test(input)) { 
          var match = input.match(regex);
          $(this).parent().prepend('<a style="float: right" href="' + link + match[1] + '">Allo Ciné</a>');
      }      
  });
  
  if ($('.contentheading').length) {
    console.log($('.contentheading').html());
      var regex = /.*<\/font>[\t ]*(.*)[\t ]*<font.*/;
      var input = $('.contentheading').html();
      if(regex.test(input)) { 
          var match = input.match(regex);
        console.log(match);
          $('.contentheading').append('<a style="" href="' + link + match[1] + '">Allo Ciné</a>');
      }    
  }

  
});