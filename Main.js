var canvas; //Linked to canvas in index.html
var stage;

//Graphics
//[Background]

var bg; //The Background Graphic

//[Title View]

var main; //Main Background
var startButton; 
var creditsButton;

//Credits

var credits;

//[Game View]

var player;
var ball;
var cpu;
var winPopup;
var losePopup;

//[Score]

var playerScore;
var cpuScore;
var cpuSpeed = 4; //The speed of the CPU paddle; the faster it is the harder the game is

// Variables
var xSpeed = 5;
var ySpeed = 5;

var Ticker = new Object();

//preloader
var preloader; 				//contains the PreloadJS Object
var manifest; 				//holds the list of files to load
var totalLoaded = 0;		//holds number of files already loaded

var TitleView = new Container();

/*
                         _
 _._ _..._ .-',     _.._(`))
'-. `     '  /-._.-'    ',/
   )         \            '.
  / _    _    |             \
 |  a    a    /              |
 \   .-.                     ;  
  '-('' ).-'       ,'       ;
     '-;           |      .'
        \           \    /
        | 7  .__  _.-\   \
        | |  |  ``/  /`  /
       /,_|  |   /,_/   /
          /,_/      '`-'
*/

function Main()
{
	/* Link Canvas */

	canvas = document.getElementById('PongStage');
	stage = new Stage(canvas);

	stage.mouseEventEnabled = true;

	/* Set the Flash Plugin for browsers that don't support SoundJS */
	SoundJS.FlashPlugin.BASE_PATH = "assets/";
	if (!SoundJS.checkPlugin(true)) {
		alert("Error!");
		return;
	}

	manifest = [
				{src:"bg.png", id:"bg"},
				{src:"main.png", id:"main"},
				{src:"startButton.png", id: "startButton"},
				{src:"creditsButton.png", id:"creditsButton"},
				{src:"credits.png", id:"credits"},
				{src:"paddle.png", id:"cpu"},
				{src:"paddle.png", id:"player"},
				{src:"ball.png", id:"ball"},
				{src:"win.png", id: "winPopup"},
				{src:"lose.png", id:"losePopup"},
				{src:"playerScore.mp3|playerScore.ogg", id:"playerScore"},
				{src:"enemyScore.mp3|enemyScore.ogg", id:"enemyScore"},
                {src:"hit.mp3|hit.ogg", id:"paddleHit"},
                {src:"wall.mp3|wall.ogg", id:"wall"}
	];

	preloader = new PreloadJS();
//	preloader.installPLugin(SoundJS);
	preloader.onProgress = handleProgress;
	preloader.onComplete = handleComplete;
	preloader.onFileLoad = handleFileLoad;
	preloader.loadManifest(manifest);

	/* Ticker */

	Ticker.setFPS(30);

	Ticker.addListener(stage);
}


function handleProgress(event) {
	//use event.loaded to get the percentage of the loading
}

function handleComplete(event) {
	//triggered whell all loading is complete
}

function handleFileLoad(event) {
	//triggered when an individual file completes loading
	
	switch(event.type) {
		case PreloadJS.IMAGE:
			//image loaded
			var img = new Image();
			 img.src= event.src;
			 img.onload = handleLoadComplete;
			 window[event.id] = new Bitmap(img);
			break;
			
			case PreloadJS.SOUND:
				//sound loaded
				handleLoadComplete();
				break;
	}	
}
function handleLoadComplete(event) {
	
	totalLoaded++;
	
	if(manifest.length === totalLoaded) {
		addTitleView();
	}
}

function addTitleView() {
	//console.log("Add Title View");
	startButton.x = 240 - 31.5;
	startButton.y = 160;
	startButton.name = 'startButton';
	
	creditsButton.x = 241 - 42;
	creditsButton.y = 200;
	
	TitleView.addChild(main, startButton, creditsButton);
	stage.addChild(bg, TitleView);
	stage.update();
	
	//Button Listeners
	
	startButton.onPress = tweenTitleView;
	creditsButton.onPress = showCredits;
	

}
function showCredits() {
	//Show Credits

	credits.x = 480;

	stage.addChild(credit);
	stage.update();
	Tween.get(credits).to({x:0}, 300);
	credits.onPress = hideCredits;

}

//Hide Credits

function hideCredits(e) {
	Tween.get(credits).to({x:480}, 300).call(rmvCredits);
}

//Remove Credits

function rmvCredits() {
	stage.removeChild(credits);
}

//Tween Title View
function tweenTitleView() {
	//Start Game

	Tween.get(TitleView).to({y:-320}, 300).call(addGameView);
}

function addGameView() {
	//Destroy Menu & Credits screen

	stage.removeChild(TitleView);
	TitleView = null;
	credits = null;

	//Add Game View

	player.x = 2;
	player.y = 160 - 37.5;
	cpu.x = 480 - 25;
	cpu.y = 160 - 37.5;
	ball.x = 240 - 15;
	ball.y = 240 - 15;

	//Score

	playerScore = new Text('0', 'bold 20px Arial', '#A3FF24');
	playerScore.x = 211;
	playerScore.y = 20;

	cpuScore = new Text('0', 'bold 20px Arial', '#A3FF24');
	cpuScore.X = 262;
	cpuScore.y = 20;

	stage.addChild(playerScore, cpuScore, player, cpu, ball);
	stage.update();

	//Start Listener

	bg.onPress = startGame;
}

function startGame(e) {
	bg.onPress = null;
	stage.onMouseMove = movePaddle;

	Ticker.addListener(ticker, false);
	ticker.tick = update;
}

function movePaddle(e) {
	//Mouse Movement
	player.y = e.stageY;
}

//Reset

function reset() {
	ball.x = 240 - 15;
    ball.y = 160 - 15;
    player.y = 160 - 37.5;
    cpu.y = 160 - 37.5;
     
    stage.onMouseMove = null;
    Ticker.removeListener(ticker);
    bg.onPress = startGame;
}
function alert(e) {
	Ticker.removeListener(ticker);
	stage.onMouseMove = null;
	bg.onPress = null;

	if(e == 'winPopup') {
		winPopup.x = 140;
		winPopup.y = -90;

		stage.addChild(winPopup);
		Tween.get(winPopup).to({y: 115}, 300);

	} else {
		losePopup.x = 140;
		losePopup.y = -90;

		stage.addChild(losePopup);
		Tween.get(losePopup).to({y: 115}, 300);
	}
}

function update() {
	//Ball movement

	ball.x = ball.x + xSpeed;
	ball.y = ball.y + ySpeed;

	//CPU Movement

	if(cpu.y < ball.y) {
		cpu.y = cpu.y + cpuSpeed;
	}else if(cpu.y > ball.y) {
		cpu.y = cpu.y - cpuSpeed;
	}

	//Wall collision

	if((ball.y) < 0) { ySpeed = -ySpeed; SoundJS.play('wall'); };//UP
	if ((ball.y + (30)) > 320) { ySpeed = -ySpeed; SoundJS.play('wall'); }; //Down

	//CPU Score

	if((ball.x) < 0) {
		xSpeed = -xSpeed;
		playerScore.text = parseInt(playerScore.text + 1);
		reset();
		SoundJS.play('playerScore');
	}

	// CPU collision

	if(ball.x + 30 > cpu.x 
		&& ball.x + 30 < cpu.x + 22 
		&& ball.y >= cpu.y 
		&& ball.y < cpu.y + 75) {
		xSpeed *= -1;
		SoundJS.play('hit');
	}

	//Player collision

	if(ball.x <= player.x + 22 
		&& ball.x > player.x
		&& ball.y >= player.y
		&& ball.y < player.y +75) {
		xSpeed *= -1;
		SoundJS.play('hit');
	}

	//Stop paddle from going off canvas

	if(player.y >= 249) {
		player.y = 249;
	}

	//Check for win

	if(playerScore.text == '10')
    {
        alert('winPopup');
    }
     
    /* Check for Game Over */
     
    if(cpuScore.text == '10')
    {
        alert('losePopup');
    }
}
