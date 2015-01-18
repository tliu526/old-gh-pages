include("sound.js")
include("platform.js")
include("player.js")
include("background.js")

var START_TIME = currentTime();
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;

// When setup happens...
function onSetup() {
    
    document.addEventListener('drop', onDocumentDrop, false);
    document.addEventListener('dragover', onDocumentDragOver, false);

    setupSound('no_church.m4a');
    player = createPlayer(screenWidth/2,screenHeight/2);
    setupPlatforms();
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
}

function onKeyEnd(key){
    if(key == LEFT)
        player.xVel = 0;
    if(key == RIGHT)
        player.xVel = 0;
}

// Called 30 times or more per second
function onTick() {
    clearRectangle(0, 0, screenWidth, screenHeight);    
    
    updateSound();
    updateBackground();
    updatePlatforms();
    updatePlayer();
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