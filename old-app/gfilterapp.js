

var inputLoaded = false;
var inputImage;

var filterTypes = {
  "game_boy_camera": {
    numColors: 4,
    ditherStyle: "Ordered4x4",
    srcImg: "./inputs/game_boy_camera.png",
    height: 112,
    width: 128
  },
  "game_boy_camera2": {
    numColors: 4,
    ditherStyle: "FloydSteinberg",
    srcImg: "./inputs/game_boy_camera.png",
    height: 112,
    width: 128
  },

  "game_boy_screen_ordered": {
    numColors: 4,
    ditherStyle: "Ordered4x4",
    srcImg: "./inputs/gameboy_1.png",
    height: 144,
    width: 160
  },
  "game_boy_screen_floyd": {
    numColors: 4,
    ditherStyle: "FloydSteinberg",
    srcImg: "./inputs/gameboy_1.png",
    height: 144,
    width: 160
  },

  "nes": {
    numColors: 56,
    ditherStyle: "FloydSteinberg",
    srcImg: "./inputs/NES_palette2.png",
    height: 240,
    width: 256
  },
  "nes_restricted": {
    numColors: 56,
    ditherStyle: "FloydSteinberg",
    srcImg: "./inputs/NES_palette2.png",
    height: 240,
    width: 256
  },

  "appleII": {
    numColors: 6,
    ditherStyle: "FloydSteinberg",
    srcImg: "./inputs/appleII_highres.png",
    height: 192,
    width: 280
  },

  "virtual_boy": {
    numColors: 4,
    ditherStyle: "FloydSteinberg",
    srcImg: "./inputs/virtual_boy.png",
    height: 224,
    width: 384
  },

};

// NES palette

var nesPalette = [
  [{r:124,g:124,b:124},	{r:188,g:188,b:188},	{r:248,g:248,b:248},	{r:252,g:252,b:252}],
  [{r:  0,g:  0,b:252},	{r:  0,g:120,b:248},	{r: 60,g:188,b:252},	{r:164,g:228,b:252}],
  [{r:  0,g:  0,b:188},	{r:  0,g: 88,b:248},	{r:104,g:136,b:252},	{r:184,g:184,b:248}],
  [{r: 68,g: 40,b:188},	{r:104,g: 68,b:252},	{r:152,g:120,b:248},	{r:216,g:184,b:248}],
  [{r:148,g:  0,b:132},	{r:216,g:  0,b:204},	{r:248,g:120,b:248},	{r:248,g:184,b:248}],
  [{r:168,g:  0,b: 32},	{r:228,g:  0,b: 88},	{r:248,g: 88,b:152},	{r:248,g:164,b:192}],
  [{r:168,g: 16,b:  0},	{r:248,g: 56,b:  0},	{r:248,g:120,b: 88},	{r:240,g:208,b:176}],
  [{r:136,g: 20,b:  0},	{r:228,g: 92,b: 16},	{r:252,g:160,b: 68},	{r:252,g:224,b:168}],
  [{r: 80,g: 48,b:  0},	{r:172,g:124,b:  0},	{r:248,g:184,b:  0},	{r:248,g:216,b:120}],
  [{r:  0,g:120,b:  0},	{r:  0,g:184,b:  0},	{r:184,g:248,b: 24},	{r:216,g:248,b:120}],
  [{r:  0,g:104,b:  0},	{r:  0,g:168,b:  0},	{r: 88,g:216,b: 84},	{r:184,g:248,b:184}],
  [{r:  0,g: 88,b:  0},	{r:  0,g:168,b: 68},	{r: 88,g:248,b:152},	{r:184,g:248,b:216}],
  [{r:  0,g: 64,b: 88},	{r:  0,g:136,b:136},	{r:  0,g:232,b:216},	{r:  0,g:252,b:252}],
  [{r:  0,g:  0,b:  0},	{r:  0,g:  0,b:  0},	{r:120,g:120,b:120},	{r:216,g:216,b:216}],
];

var nesPal = [];
nesPalette.forEach(function(pal) {
  pal.forEach(function(color) {
    color.code = (255 << 24)	|	// alpha
      (color.b  << 16)	|	// blue
      (color.g  <<  8)	|	// green
      color.r;
    nesPal.push([color.r,color.g,color.b]);
  });
});
filterTypes.nes.palette = nesPal;
filterTypes.nes_restricted.palette = nesPal;


$('#imageLoaderInput').on('change', function(e) {
  var canvas = document.getElementById('inputImageCanvas');
  var ctx = canvas.getContext('2d');

  $('#inputImageContainer').css({display:'block'});

  var reader = new FileReader();
  reader.onload = function(event){
    inputImage = new Image();
    inputImage.onload = function(){
      inputLoaded = true;
      canvas.width = inputImage.width;
      canvas.height = inputImage.height;

      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(inputImage,0,0);
    }
    inputImage.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);
});



$('#createImageBtn').on('click', function() {

  if (inputLoaded === false) {
    alert('Please load an input image.');
    return;
  }

  var ditheringOn = $('#dithering').is(':checked') ? true : false;
  var fVal = $('#ditheringType').val();
  var filterType = filterTypes[fVal];
  var outputSize = $('#outputSize').val();

  if (ditheringOn) {
    filterType.dither = filterType.ditherStyle;
  } else {
    filterType.dither = undefined;
  }

  console.log(outputSize);
  console.dir(filterType);

  var p = new Promise(function(resolve, reject) {

    // set the ref image
    console.log('set the ref image');

    var img = new Image();
    var canvas = document.getElementById('refImageCanvas');
    var ctx = canvas.getContext('2d');

    img.onload = function(){
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.mozImageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = ctx.msImageSmoothingEnabled = ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img,0,0);
      resolve();
    };
    img.onerror = function() {
      reject();
    };
    img.src = filterType.srcImg;

  }).then(function() {

    // set the resized input
    console.log('set the resized input');

    var canvas = document.getElementById('inputResizedCanvas');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    var newW = inputImage.width;
    var newH = inputImage.height;

    if ( filterType.height < inputImage.height && inputImage.height >= inputImage.width) {
      newW = Math.round(filterType.height * (inputImage.width / inputImage.height));
      newH = filterType.height;
    } else if ( filterType.width < inputImage.width) {
      newW = filterType.width;
      newH = Math.round(filterType.width * (inputImage.height / inputImage.width));
    }

    // use normal input size if specified
    if ($('#outputSize').val() === 'sameAsInputAndProcess') {
      newW = inputImage.width;
      newH = inputImage.height;
    }

    console.log('new width:'+newW);
    console.log('new height:'+newH);
    console.log('draw resized input');

    canvas.width = newW;
    canvas.height = newH;

    context.mozImageSmoothingEnabled = context.webkitImageSmoothingEnabled = context.msImageSmoothingEnabled = context.imageSmoothingEnabled = false;
    context.drawImage(inputImage, 0, 0, newW, newH);

    return;
  }).then(function() {

    console.log('do actual processing...');

    var numColors = filterType.numColors;
    var refCanvas = document.getElementById('refImageCanvas');
    var inputCanvas = document.getElementById('inputResizedCanvas');
    var q, pal, out;

    if (filterType.palette) {
      pal = filterType.palette;
      numColors = pal.length;
    } else {
      q = new RgbQuant({
        colors: numColors
      });
      q.sample(refCanvas);
      pal = q.palette(true);
    }

    var q2 = new RgbQuant({
      colors: numColors,
      palette: pal
    });

    var ditheringType = filterType.dither;
    console.log('ditheringType='+ditheringType);
    if (ditheringType === "") ditheringType = null;

    out = q2.reduce(inputCanvas, 1, ditheringType);

    var pcan = drawPixels(out, inputCanvas.width);//1920
    pcan.setAttribute('id', "outCan");

    $('#canOutput').html('').append(pcan);

    $('#outModal').modal()

  }).catch(function() {
    alert('Something went wrong :(');
    console.dir(arguments);
  });


});


function downloadOut() {
  document.getElementById("saveImageBtn").download = "image.png";
  document.getElementById("saveImageBtn").href = document.getElementById("outCan").toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
}

// --- image stuff

function typeOf(val) {
  return Object.prototype.toString.call(val).slice(8,-1);
}

function drawPixels(idxi8, width0, width1) {
  var idxi32 = new Uint32Array(idxi8.buffer);

  width1 = width1 || width0;

  var can = document.createElement("canvas"),
    can2 = document.createElement("canvas"),
    ctx = can.getContext("2d"),
    ctx2 = can2.getContext("2d");

  ctx.mozImageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = ctx.msImageSmoothingEnabled = ctx.imageSmoothingEnabled = false;


  can.width = width0;
  can.height = Math.ceil(idxi32.length / width0);
  can2.width = width1;
  can2.height = Math.ceil(can.height * width1 / width0);

  ctx.imageSmoothingEnabled = ctx.mozImageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = ctx.msImageSmoothingEnabled = false;
  ctx2.imageSmoothingEnabled = ctx2.mozImageSmoothingEnabled = ctx2.webkitImageSmoothingEnabled = ctx2.msImageSmoothingEnabled = false;

  var imgd = ctx.createImageData(can.width, can.height);

  if (typeOf(imgd.data) == "CanvasPixelArray") {
    var data = imgd.data;
    for (var i = 0, len = data.length; i < len; ++i)
      data[i] = idxi8[i];
  }
  else {
    var buf32 = new Uint32Array(imgd.data.buffer);
    buf32.set(idxi32);
  }

  ctx.putImageData(imgd, 0, 0);

  if ( $('#outputSize').val() === 'sameAsInput') {
    can2.width = inputImage.width;
    can2.height = inputImage.height;
  }

  ctx2.mozImageSmoothingEnabled = ctx2.webkitImageSmoothingEnabled = ctx2.msImageSmoothingEnabled = ctx2.imageSmoothingEnabled = false;
  ctx2.drawImage(can, 0, 0, can2.width, can2.height);

  return can2;
}
