//drawing and calculating the player's movements

include("platform.js");
include("background.js");

var PLAYER_WIDTH = 75;
var PLAYER_HEIGHT = 75;

//velocities, in pixels
var X_VEL = 20;
var Y_VEL = 40;

var MAX_Y_VEL = 35;


//acceleration constant
var GRAVITY = 3;
var player;
var onGround;
var onFire;
/**
* called in onSetup
*/
function createPlayer(x,y) {
	onGround = false;
	onFire = false;
	return {
		x : x,
		y : y,
		xVel : 0,
		yVel : 0,
		score : 0,
	}
}

function updatePlayer(){
	
	checkCollision();

	if(onGround){
		player.yVel = 0;
	}
	else {
		player.yVel += GRAVITY;
	}

	player.yVel = min(player.yVel, MAX_Y_VEL);

	player.x += player.xVel - X_SPEED;
	player.y += player.yVel;

	console.log(player.yVel);

	checkDeath();

	updateScore();

	drawPlayer();
}

function checkDeath(){
	if (player.x < 0 || player.y > screenHeight) {
		player.x = screenWidth/2;
		player.y = 100;
		player.score = floor(player.score/2);
	}
}

function drawPlayer(){
	fillRectangle(player.x,player.y,PLAYER_WIDTH,PLAYER_HEIGHT, makeColor(1,1,1,1));
	fillText(player.score, 25, 50, makeColor(1,1,1,1), "bold 40px sans-serif");
}

function checkCollision(){
	onGround = false;

	for(var i = 0; i < curPlatforms.length; ++i){
		platform = curPlatforms[i];
		//collision detection
		if((player.x <= platform.xCur+PLATFORM_WIDTH) && 
		   (player.x + PLAYER_WIDTH >= platform.xCur) &&
		   (player.y + PLAYER_HEIGHT - PLATFORM_HEIGHT <= platform.yCur+PLATFORM_HEIGHT) && 
		   (player.y + PLAYER_HEIGHT >= platform.yCur)) {

			player.y = platform.yCur-PLAYER_HEIGHT;
			onGround = true;
		}
	}
}

function updateScore(){
	onFire = false;
	//check for collisions
	for(var i = 0; i < curBackground.length; ++i){
		bar = curBackground[i];
		//collision detection
		if((player.x <= bar.x+bar.w) && (player.x + PLAYER_WIDTH >= bar.x)&&
		   (player.y <= bar.y+bar.h) && (player.y + PLAYER_HEIGHT >= bar.y)) {
			onFire = true;
			break;
		}
	}

	if(onFire){
		if(player.score>=2)
			player.score -= 2;
	}
	else {
		player.score += 1;
	}
}