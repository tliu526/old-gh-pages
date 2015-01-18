// Generating and drawing platform objects
var curPlatforms = []

var DEFAULT_START_X = 1000
var DEFAULT_START_Y = screenHeight;
var PLATFORM_WIDTH = 200
var PLATFORM_HEIGHT = 20

//speed of platform in pixels
var X_SPEED = 10

/**
* creates a platform object, and adds it to curPlatforms array 
* @param x final x-position of platform
* @param x final y-position of platform
*/
function createPlatform(x, y){

	platformObj = {
		xCur : x,
		yCur : DEFAULT_START_Y,
		xFin : x,
		yFin : y,
		w : PLATFORM_WIDTH,
		h : PLATFORM_HEIGHT,
	}

	curPlatforms.push(platformObj);
	return platformObj;
}

function setupPlatforms(){
	for(var i = 0; i <screenWidth*6; i+= 200){
		createPlatform(i,screenHeight-200)
	}
}

/**
* updates the locations of all the platforms, called in onTick
*/
function updatePlatforms() {

	for(var i = 0; i < curPlatforms.length; ++i){
		platform = curPlatforms[i];

		platform.xCur -= X_SPEED

		if(platform.yCur > platform.yFin){
			var diff = platform.yCur - platform.yFin;
			platform.yCur -= diff/2; 
		}

		if(platform.xCur+PLATFORM_WIDTH <=0) {
			removeAt(curPlatforms, i);
			i--;
		}
	}

	drawPlatforms();
}
/**
* Draws all current platforms, called in updatePlatforms
*/
function drawPlatforms() {
	var canvasCtx		= canvas.getContext("2d")
	var gradient	= canvasCtx.createLinearGradient(0,0,0,canvas.height)
	gradient.addColorStop(1.00,'#000000')
	gradient.addColorStop(0.75,'#ff0000')
	gradient.addColorStop(0.25,'#ffff00')
	gradient.addColorStop(0.00,'#ffffff')
	canvasCtx.fillStyle	= gradient

	for(var i = 0; i < curPlatforms.length; ++i){
		platform = curPlatforms[i];
		fillRectangle(platform.xCur, platform.yCur, platform.w, platform.h, makeColor(1,1,1,1));
		//canvasCtx.fillRect(platform.xCur, platform.yCur, platform.w, platform.h)
	}
	
}