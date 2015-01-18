/**
Handles all sound manipulation via calls to webaudiox API
*/
include("webaudiox.js");
include("platform.js");
include("background.js");

// webaudiox mutable variables
// Overall audio context
var audioContext;
// AnalyzerNode
var analyzer;
// Output to Speakers
var lineOut;
// Visualizes sound
var analyser2canvas;

// Buffer for audio file
var audioBuffer;

// Beat Detector from WebAudiox
var beatDetector;

//called in game.js onSetup()
function setupSound() {
	// Create WebAudio API context
    audioContext = new AudioContext();

    // Create lineOut
    lineOut = new WebAudiox.LineOut(audioContext);

    // Initialize the analyser and connect
    analyzer = audioContext.createAnalyser();
    analyzer.connect(lineOut.destination);
    lineOut.destination = analyzer;
	
    // create the object
    analyser2canvas = new WebAudiox.Analyser2Canvas(analyzer, canvas);

    beatDetector = new WebAudiox.AnalyserBeatDetector(analyzer, onBeat);
}
/*
* loads a dropped music file
*/
function onFileDrop(evt) {
	//TODO modify to just initialize variables
	setupSound();

	var droppedFiles = evt.dataTransfer.files;
	var reader = new FileReader();
	reader.onload = function(fileEvent){
		var data = fileEvent.target.result;
		onDroppedFileLoaded(data);
	}

	reader.readAsArrayBuffer(droppedFiles[0]);
}


/**
* called when the song is complete
*/
function onEnded() {
	playing = false;
    drawEndScreen();
}

/**
* Called from onFileDrop
*/
function onDroppedFileLoaded(data) {
	if(audioContext.decodeAudioData) {
			audioContext.decodeAudioData(data, function(buffer) {
				audioBuffer = buffer;
				startSound();
			}, function(e) {
				console.log(e);
			});
		} else {
			audioBuffer = audioContext.createBuffer(data, false );
			startSound();
		}
}

function startSound() {
	setupGame();
	fillText("Loading track...", screenWidth/4,screenHeight/4 + 200, makeColor(1,1,1,1), "40px sans-serif");
	var source  = audioContext.createBufferSource();
	source.buffer = audioBuffer;
	source.connect(lineOut.destination);
	source.onended = onEnded;
	source.start(2);
	playing = true;
}

function startDefaultSound(){
	setupGame();
	fillText("Loading track...", screenWidth/4,screenHeight/4 + 200, makeColor(1,1,1,1), "40px sans-serif");
    WebAudiox.loadBuffer(audioContext, 'point_of_departure.mp3', function(buffer){
        // init AudioBufferSourceNode
        var source  = audioContext.createBufferSource();
        source.buffer  = buffer;
        source.connect(lineOut.destination);
        source.onended = onEnded;
        // start the sound now
        playing = true;
        source.start(0);
    });
    
}

/**
* Called when a beat is detected
*/
function onBeat(){
	var freq = WebAudiox.AnalyserBeatDetector.compute(analyzer);
	if(freq > 0.4){
		createPlatform(screenWidth-200, randomReal(0.2,0.6)*screenHeight);
	}
	else {
		createPlatform(screenWidth-200, randomReal(0.5, 0.8)*screenHeight);		
	}

}



/*
function updateSound() {

	if(currentTime() - timeLastPlatform > 1)
			canPlacePlatform = true;

	// get the average for the first channel
	var freqData	= new Uint8Array(analyzer.frequencyBinCount)
	analyzer.getByteFrequencyData(freqData)
	// normalized
	var histogram	= new Float32Array(10)
	WebAudiox.ByteToNormalizedFloat32Array(freqData, histogram)
	// draw the spectrum
	var barStep	= canvas.width / (histogram.length-1)
	var barWidth	= barStep*0.8
	var avg = 0;
	var max = 0;
	for(var i = 0; i < histogram.length; i++){

		avg += histogram[i];
		if(histogram[i] > max)
			max = histogram[i]
	}
	avg /= histogram.length;

	//console.log(histogram[histogram.length-2])

	//console.log("average: " + pow(avg,2))
	//console.log("max: " + pow(max,2))

	if(histogram[histogram.length-2]>0.3 && canPlacePlatform){
		createPlatform(screenWidth-200, randomReal(0,1)*screenHeight)
		canPlacePlatform = false;
		timeLastPlatform = currentTime();
	}
}
*/
/**
* Performs analysis on playing music and creates appropriate platforms, also draws background
*/
function updateSound(){

	//for platforms
	beatDetector.update(0.1);
}

function exampleEqualizer() {
	//determines fill color
	var canvasCtx		= canvas.getContext("2d")
	var gradient	= canvasCtx.createLinearGradient(0,0,0,canvas.height)
	gradient.addColorStop(1.00,'#000000')
	gradient.addColorStop(0.75,'#ff0000')
	gradient.addColorStop(0.25,'#ffff00')
	gradient.addColorStop(0.00,'#ffffff')
	canvasCtx.fillStyle	= gradient

	// get the average for the first channel
	var freqData	= new Uint8Array(analyzer.frequencyBinCount)
	analyzer.getByteFrequencyData(freqData)
	// normalized
	var histogram	= new Float32Array(10)
	WebAudiox.ByteToNormalizedFloat32Array(freqData, histogram)
	// draw the spectrum
	var barStep	= canvas.width / (histogram.length-1)
	var barWidth	= barStep*0.8
	for(var i = 0; i < histogram.length; i++){
		canvasCtx.fillRect(i*barStep, (1-histogram[i])*canvas.height, barWidth, canvas.height)
		//canvasCtx.fillRect(i*barStep, (1-histogram[i])*screenHeight, 200, 100)		
	}

    // put the sound in the canvas
    analyser2canvas.update();
}

/**
* draw ending screen
*/
function drawEndScreen() {
	var white = makeColor(1,1,1,1)
	fillText("Your score is: " + player.score, screenWidth/4,screenHeight/4, white, "40px sans-serif");
    fillText("Drag another music file or press enter to play again.", screenWidth/4,screenHeight/4 + 100, white, "40px sans-serif");
}