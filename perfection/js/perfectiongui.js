/**********************************************************
 * Perfection GUI : view / controls
 **********************************************************/
// Namespace for Perfection components

var Perfection = Perfection || {};

//#### C O N T R O L S #########

var count = 0;

Perfection.controls = {
	startButton: document.getElementById("start-button"),
	newButton: document.getElementById("new-game-button"),	   
};

//#### V I E W #########

Perfection.view = {
	STEPS		:	50,
	timer		: 	document.getElementById("timer"),
	bestScore	:	document.getElementById("best-time"),
	dragPieces	:   document.querySelectorAll(".piecetray td img"),
	targetPieces:	document.querySelectorAll(".gametray td img"),
	piecetray   :	document.querySelectorAll(".piecetray td"),
	gametray    :   document.querySelectorAll(".gametray td"),
	container	:	document.getElementById("container"),
	playArea	:	document.getElementById("play-area"),
	gameState	:	document.getElementById("game-state"),
	updateTime	:   function(time) {
						this.timer.innerHTML = time;
					},
	dragStart	:	function(event) {
						var piece = event.currentTarget;
  						piece.classList.add("selected"); 
					},
	allowDrop	:	function(event) {
						event.preventDefault();
					},
	doDrop		:	function(event) {
    					event.preventDefault();
    					var currentPiece = document.querySelector(".selected");
						currentPiece.classList.remove("selected");
    					var targetPiece = event.currentTarget;
    					var targetParent = targetPiece.parentElement;
    					if (currentPiece.className === targetPiece.className) { 
    						targetParent.appendChild(currentPiece);
    						currentPiece.classList.add("matched");
							currentPiece.setAttribute('draggable', false);
							matchedCount++;
							isFinished();
    					};
					},	
	enablePieces:	function() {
						for(var i = 0; i < this.dragPieces.length; i++) {
							dragArray[i].ondragstart = this.dragStart;
							targetArray[i].ondragover = this.allowDrop;
							targetArray[i].ondrop = this.doDrop;
						};
					},
	updateScore	:	function(score) {
						this.bestScore.innerHTML = score;
					},
	animatePiece: 	function(piece) {
						var location = this.getLocation(piece); 
						piece.style.position = "absolute";
						this.container.appendChild(piece);
    					this.movePieceTo(location, piece); 
    	 
						var vector = { 
							x: this.destinationX() / this.STEPS,
							y: this.destinationY() / this.STEPS, 
						};
		
						var animationStepsLeft = this.STEPS;
						requestAnimationFrame( doOneStep );

						function doOneStep() {
							if (animationStepsLeft > 0) {
								location.x += vector.x;
								location.y += vector.y;
								Perfection.view.movePieceTo(location, piece);
								animationStepsLeft--;
								requestAnimationFrame( doOneStep );
							};
						};
					},
	movePieceTo	:	function(location, piece) {
    						piece.style.left = location.x+'px';
    						piece.style.top  = location.y+'px';	
 
					},			
    getLocation :	function(element) {  //algorithm from quirksmode//code from Joseph Fall//
	    				var xPos = 0;
	    				var yPos = 0;
	    				while(element && element != this.container) { 
	        				xPos += (element.offsetLeft - element.scrollLeft + element.clientLeft);
	        				yPos += (element.offsetTop - element.scrollTop + element.clientTop);
		    				element = element.offsetParent;
	    				}
	    				return { x: xPos, y: yPos };
					},
	destinationX:	function() {
						return Math.floor(Math.random() * 10000) - 5000;
					},
	destinationY:	function() {
						return Math.floor(Math.random() * 10000) - 5000;
					},
	rotateText	:	function(deg, message) {
						this.gameState.innerHTML = message;

    					var animationStepsLeft = this.STEPS;
    					requestAnimationFrame(setStyle);
    					
    					function setStyle() {
							if(animationStepsLeft > 0) {
								Perfection.view.gameState.style.transform = "rotate(" + deg + "deg)";
    							deg += 28.8;
    							animationStepsLeft--;
    							requestAnimationFrame(setStyle);
    						};
					 	};
					 },
	
};
