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
var cpuSpeed=6; //The speed of the CPU paddle; the faster it is the harder the game is

// Variables
var xSpeed = 5;
var ySpeed = 5;

var ticker = new Object;

//preloader
var preloader; 				//contains the PreloadJS Object
var manifest; 				//holds the list of files to load
var totalLoaded = 0;		//holds number of files already loaded

var TitleView = new Container();

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
				{src:"credits.png", id:"credits"}.
				{src:"paddle.png", "cpu"},
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
	preloader.installPLugin(SoundJS);
	preloader.onProgress = handleProgress;
	preloader.onComplete = handleComplete;
	preloader.onFileLoad = handleFileLoad;
	preloader.loadManifest(manifest);

	/* Ticker */

	Ticker.setFPS(30);
	Ticker.addListener(stage);
}