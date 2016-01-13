// ==UserScript==
// @name          La Banque Postale - No Virtual Keyboard
// @namespace     org.bouil
// @author        bouil
// @collaborator  foudfou
// @copyright     2013-2014, https://github.com/bouil/userscripts
// @description   Remove virtual keyboard and add a classic input text field for the password on La Banque Postale website https://www.labanquepostale.fr/
// @include       https://voscomptesenligne.labanquepostale.fr/wsost/OstBrokerWeb/loginform?TAM_OP=login&ERROR_CODE=0x00000000&URL=%2Fvoscomptes%2FcanalXHTML%2Fidentif.ea%3Forigin%3Dparticuliers
// @version       0.4.6
// @updateURL     https://openuserjs.org/install/bouil/La_Banque_Postale_-_No_Virtual_Keyboard.user.js
// @grant         none
// @oujs:author   bouil
// @oujs:collaborator foudfou
// ==/UserScript==

var debug = false;

var hashToNumber = new Object();
// firefox
hashToNumber[-1043926944]  = -1;
hashToNumber[2037140090]  = 0;
hashToNumber[-1837280483]   = 1;
hashToNumber[-39504401] = 2;
hashToNumber[1403102968 ]  = 3;
hashToNumber[702003925] = 4;
hashToNumber[-1495191002] = 5;
hashToNumber[307386662]  = 6;
hashToNumber[-88040056 ]    = 7;
hashToNumber[1436389033]  = 8;
hashToNumber[-1860708088]  = 9;

// chrome
hashToNumber[1261568409]  = -1;
hashToNumber[-737831289]  = 0;
hashToNumber[-1939970274]   = 1;
hashToNumber[1633837072]  = 2;
hashToNumber[-1476820365]  = 3;
hashToNumber[-1744932522]   = 4;
hashToNumber[311929800]  = 5;
hashToNumber[-1780532980]  = 6;
hashToNumber[1914433817]   = 7;
hashToNumber[-1580087094] = 8;
hashToNumber[-1726714153]   = 9;

function hashCode(s){           // djb2
  return s.split("").reduce(function(a,b){
    a=((a<<5)-a)+b.charCodeAt(0);
    return a&a;                 // Convert to 32bit integer
  },0);
}

function metaData(str) {
  if ("undefined" !== typeof(GM_info)) {
    return GM_info.script[str];
  } else if ("undefined" !== typeof(GM_getMetadata)) {
    return GM_getMetadata(str);
  } else {
    console.log("GM_ API unsupported");
    return "unknown";
  }
}

function image2number(imageDataBase64) {
  var imageHash = hashCode(imageDataBase64);
  var number = hashToNumber[imageHash];
  return number;
};

function decodeGrid(grid) {

  const kGridSize = 4;
  const kCellHeight = 45; // chaque case chiffre fait kCellHeight px de côté sans la bordure de...
  const kBorderSize = 3;  // ...kBorderSize px

  var canvas, ctx, imageData;

  var n2p = new Object();

  for (var y=0; y<kGridSize; y++) {
    for (var x=0; x<kGridSize; x++) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("width", kCellHeight);
      canvas.setAttribute("height", kCellHeight);
      canvas.setAttribute("style", "display: inline; border: 1px solid red;");
      ctx = canvas.getContext('2d');

      ctx.fillStyle = "rgb(255,255,100)";
      ctx.fillRect(0, 0, kCellHeight, kCellHeight);

      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      ctx.drawImage(grid,
                    (kCellHeight+kBorderSize)*x,
                    (kCellHeight+kBorderSize)*y,
                    kCellHeight,
                    kCellHeight,
                    0, 0, kCellHeight, kCellHeight); // dst
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // no need to convertColor(imageData) here. see http://userscripts.org/scripts/show/126488 - FreeMobile TinyAuth
      ctx.putImageData(imageData, 0, 0);
      var imageDataBase64 = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
      var number = image2number(imageDataBase64);
      var gridPosition = (y * kGridSize + x);

      if (debug) {
        var br = document.createElement("br");
        document.body.appendChild(br);
        document.body.appendChild(canvas);
        numberElement = document.createElement("span");
        numberElement.setAttribute("style", "border-bottom: 1px solid red;");
        numberElement.innerHTML = " row=" + y + ";col=" + x +
          ";imgNumber=" + gridPosition +
          ";hash=" +
          hashCode(imageDataBase64) + " = " +
          number;
        document.body.appendChild(numberElement);
        document.body.appendChild(br);
      }

      if (number != -1) {
        n2p[number] = gridPosition;
      }

      if (number < -1 || number > 9) {
        alert("Décodage de la grille échoué " + number);
        throw new Error("Décodage échoué.");
      }

    }
  }

  if (debug) {
    console.log("Number -> Grille =");
    console.log(n2p);
  }

  for(n=0;n<10;n++){
    if (typeof n2p[n] == "undefined"){
      alert("Grille non decodee pour le chiffre " + n + ". Essayez de mettre a jour le script.");
      break;
    }
  }

  return n2p;
}

/**
 * replaces the img/map grid with a simple password input. The login input
 * remains unchanged.
 */
function customizeUI(grid) {
  var divBlocMdp = document.getElementById("cvs-bloc-mdp");

  var loginInput = document.getElementById("val_cel_identifiant");
  loginInput.setAttribute("autocomplete", "on");

  var newPasswordInput = document.getElementById("cvs-bloc-mdp-input").cloneNode(true);
  newPasswordInput.removeAttribute("disabled");
  newPasswordInput.setAttribute("type", "password");
  newPasswordInput.setAttribute("autocomplete", "on");
  newPasswordInput.setAttribute("maxlength","6");
  while (divBlocMdp.hasChildNodes()) {
    divBlocMdp.removeChild(divBlocMdp.lastChild);
  }
  divBlocMdp.appendChild(newPasswordInput);

  var oldSubmit = document.getElementById("valider");
  var newSubmit = oldSubmit.cloneNode(true); // listeners not copied!
    // onclick sendForm()
  newSubmit.setAttribute("type", "submit");
  newSubmit.setAttribute("id", "gm_submit");
  newSubmit.removeAttribute("disabled");
  newSubmit.removeAttribute("grey");
  newSubmit.style.backgroundColor = "#004B9B";
  oldSubmit.parentNode.replaceChild(newSubmit, oldSubmit);

  // add some info about this script
  var about = document.createElement("div");
  var ptmp = document.createElement("h3");
  ptmp.innerHTML = metaData("name");
  about.appendChild(ptmp);
  ptmp = document.createElement("p");
  ptmp.innerHTML = "Version " + metaData("version");
  about.appendChild(ptmp);
  newSubmit.parentNode.appendChild(about);

  document.getElementById("val_cel_identifiant").focus();

  return {newSubmit: newSubmit, newPasswordInput: newPasswordInput};
}

/**
 * attach the submit handler, that translates the password to a positional
 * string, and feeds the dedicated hidden field with it.
 */
function attachSubmitHandler(map, passwordElt) {

  function createSubmitHandler(form, map, password){ return function (event) {
    var password = passwordElt.value;
    var keyboardPass = "";
    for(i = 0 ; i < password.length ; i++){
      var k = map[password[i]];
      if (k < 10) k = "0" + k;
      keyboardPass = keyboardPass + k;
    }
    document.getElementById("cs").value = keyboardPass; // hidden password

    if (debug)
      alert("pass="+keyboardPass);
    else
      form.submit();
  };}

  var form = document.forms['formAccesCompte'];
  var submitHandler = createSubmitHandler(form, map, passwordElt.value);
  form.addEventListener('submit', submitHandler, false);
}

function imgSrc(str) {
  return (str.match(/url\([^\)]+\)/gi) || [""])[0].split(/[()'"]+/)[1];
}


function main() {
  var elt = document.getElementById('imageclavier'),
      style = elt.currentStyle || window.getComputedStyle(elt, false),
      bg = style.getPropertyValue('background-image'),
      gridSrc = imgSrc(bg);

  if (!gridSrc) {
    alert("Aucune grille d'identification trouvee");
    return;
  }

  if (debug) {
    console.log("Grid is");
    console.log(gridSrc);
  }

  var customizedUI = customizeUI(elt);

  var image = new Image();
  image.onload = function() {
    var number2GridPositionMap = decodeGrid(image);
    attachSubmitHandler(number2GridPositionMap, customizedUI.newPasswordInput);
  };
  image.src = gridSrc;
};

main();
