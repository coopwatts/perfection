/**********************************************************
 * Perfection App : app / model
 **********************************************************/
// Namespace for Perfection components

var Perfection = Perfection || {};

//#### M O D E L #########

//Some initial conditions
Perfection.timeLeft = 0;
Perfection.timer = null;
Perfection.controls.startButton.disabled = false;
var matchCount = 0;
var bestTime = 0;
var dragArray = [];
var targetArray = [];
var randomDrags = [];
var randomTargets = [];

//Add all the nodelist items into an array for the draggable pieces
for(var i = 0; i < Perfection.view.dragPieces.length; i++) {
	dragArray.push(Perfection.view.dragPieces[i]);
};
//Add all the nodelist items into an array for the target pieces
for(var i = 0; i < Perfection.view.targetPieces.length; i++) {
	Perfection.view.targetPieces[i].setAttribute('draggable', false); //target pieces cannot be dragged
	targetArray.push(Perfection.view.targetPieces[i]);
};


//This function gets the actual name of the images when needed - used for comparison
function getName(piece) {
	var source = piece.src;
	var startName = source.lastIndexOf("/") +1;
	var endName = source.indexOf(".") - 1;
	var actualName = source.slice(startName, endName);
	return actualName.toLowerCase();
};

/*This function creates a random array when needed
**This is the Fisher-Yates shuffle method taken from:
**en.wikipedia.org/wiki/Fisher–Yates_shuffle**/
function randomizePieces(myArray) {
    for (var i = myArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = myArray[i];
        myArray[i] = myArray[j];
        myArray[j] = temp;
    }
    return myArray;
};

function randomBoard() {
	randomDrags = randomizePieces(dragArray);
	randomTargets = randomizePieces(targetArray);
	for (var i = 0; i < dragArray.length; i++) {
		Perfection.view.piecetray[i].appendChild(randomDrags[i]);
	};
	for (var i = 0; i < targetArray.length; i++) {
		Perfection.view.gametray[i].appendChild(randomTargets[i]);
	};
};

//This function controls the timer when the start button is clicked
function beginGame() {
	matchedCount = 0;
	var matched = document.querySelectorAll(".matched");
	for (var i = 0; i < matched.length; i++) {
		matched[i].classList.remove("matched");
	};
	Perfection.controls.startButton.disabled = true;
	Perfection.timeLeft = 60;
	Perfection.timer = setInterval(countDown, 1000)
	randomBoard();
	setDraggable();
};
	
//When timer begins, decrease the time left by 1 for every interval
function countDown() { 
	Perfection.timeLeft--;
	if(Perfection.timeLeft > 9)
		Perfection.view.updateTime("00:" + Perfection.timeLeft); 
	else
		Perfection.view.updateTime("00:0" + Perfection.timeLeft);
	if(Perfection.timeLeft === 0) {
		clearInterval(Perfection.timer);
		for(var i = 0; i < Perfection.view.dragPieces.length; i++) {
			Perfection.view.dragPieces[i].setAttribute('draggable', false);
		};
		var matchedPieces = document.querySelectorAll(".matched");
		for(var i = 0; i < matchedPieces.length; i++) {
			Perfection.view.animatePiece(matchedPieces[i]);
		};	
		Perfection.view.rotateText(0, "OUT OF TIME!");
	};
};

//initialize the timer for new game
function refreshCount() {
	Perfection.view.updateTime("1:00");
};

function setDraggable() {
	for (var i = 0; i < Perfection.view.dragPieces.length; i++) {
		Perfection.view.dragPieces[i].removeAttribute("draggable");
	};
};

function isFinished() {
	if ((matchedCount === 36) && (Perfection.timeLeft !== 0)) {
		Perfection.view.rotateText(0, "PERFECTION!");
		if(Perfection.timeLeft > bestTime) {
			Perfection.view.updateScore("Best time " + Perfection.view.timer.innerHTML);
			bestTime = Perfection.timeLeft;
			clearInterval(Perfection.timer);
		};
	};
};

function newGame() {
	var matched = document.querySelectorAll(".matched");
	for (var i = 0; i < matched.length; i++) {
		matched[i].removeAttribute("draggable");
		matched[i].removeAttribute("style");
		matched[i].classList.remove("matched");
	};
	setDraggable();
	refreshCount();
	randomBoard();
	clearInterval(Perfection.timer);
	matchedCount = 0;
	Perfection.controls.startButton.disabled = false;
	Perfection.view.gameState.innerHTML = " ";
};

//#### C O N T R O L E R #########

//Configure the Perfection event handlers//
Perfection.start = function() {
	newGame();
	Perfection.view.enablePieces();
	Perfection.controls.startButton.onclick = beginGame;
	Perfection.controls.newButton.onclick = newGame;
};

//Begin
window.onload = Perfection.start;

		


	