include("sound.js")
include("platform.js")
include("player.js")
include("background.js")

var START_TIME = currentTime();
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var ENTER = 13;

var playing = false;

// When setup happens...
function onSetup() {
    
    document.addEventListener('drop', onDocumentDrop, false);
    document.addEventListener('dragover', onDocumentDragOver, false);

    setupSound();
    player = createPlayer(screenWidth/2,screenHeight/2);
    setupPlatforms();
    
    drawTitleScreen();
}

// When a key is pushed
function onKeyStart(key) {
    if(key == LEFT)
        player.xVel = -1*X_VEL;
    if(key == RIGHT)
        player.xVel = X_VEL;
    if(key == UP && onGround){
        player.yVel = -1*Y_VEL;
        player.y -= 1;
        onGround = false;
    }
    if(key == ENTER && !playing){
        startDefaultSound();
    }

}

function onKeyEnd(key){
    if(key == LEFT)
        player.xVel = 0;
    if(key == RIGHT)
        player.xVel = 0;
}

// Called 30 times or more per second
function onTick() {
    if(playing){
        clearRectangle(0, 0, screenWidth, screenHeight);    
        updateSound();
        updateBackground();
        updatePlatforms();
        updatePlayer();
    }
    //exampleEqualizer();
}

function onDocumentDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    return false;
}

//load dropped MP3
function onDocumentDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    onFileDrop(evt);
}

function resetGame() {
    if(!playing){
        setupSound();
        player = createPlayer(screenWidth/2,screenHeight/2);
        setupPlatforms();
        playing = true;
    }
}

//draws instructions
function drawTitleScreen() {
    clearRectangle(0, 0, screenWidth, screenHeight);
    var white = makeColor(1,1,1,1)
    fillText("Soundscape", screenWidth/4,screenHeight/4, white, "bold 120px sans-serif");
    fillText("Use your arrow keys to move, avoiding the frequency columns.", screenWidth/4,screenHeight/4 + 100, white, "40px sans-serif");
    fillText("Drag a music file onto the screen to begin, or press enter for the default track.", screenWidth/4,screenHeight/4 + 200, white, "40px sans-serif");
}