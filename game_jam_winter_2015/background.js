//For drawing and updating the background
include("sound.js");

var curBackground = []

function createBackground(x,y,w,h){

	backgroundObj = {
		x : x,
		y : y,
		w : w,
		h : h,
	}

	curBackground.push(backgroundObj);
	return backgroundObj;
}

function updateBackground() {
	
	// get the average for the first channel
	var freqData	= new Uint8Array(analyzer.frequencyBinCount)
	analyzer.getByteFrequencyData(freqData)
	// normalized
	var histogram	= new Float32Array(10)
	WebAudiox.ByteToNormalizedFloat32Array(freqData, histogram)
	// draw the spectrum
	var barStep	= canvas.width / (histogram.length-1)
	
	curBackground = [];
	for(var i = 0; i < histogram.length; i++){
		createBackground(i*barStep, (1-histogram[i])*canvas.height, barStep+1, canvas.height);
		
	}

	drawBackground();
}

function drawBackground() {
	var canvasCtx		= canvas.getContext("2d")
	var gradient	= canvasCtx.createLinearGradient(0,0,0,canvas.height)
	gradient.addColorStop(1.00,'#000000')
	gradient.addColorStop(0.75,'#ff0000')
	gradient.addColorStop(0.25,'#ffff00')
	gradient.addColorStop(0.00,'#ffffff')
	canvasCtx.fillStyle	= gradient

	for(var i = 0; i < curBackground.length; ++i){
		rect = curBackground[i];
		canvasCtx.fillRect(rect.x, rect.y, rect.w, rect.h);
	}
}