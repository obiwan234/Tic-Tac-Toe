let player;
let board;
let turns;
let messageSlot;
let again;
let pastMoves;
let playerList=["X","O"];
let winLine=false;
let spacing=4;
let canvas;

// let textPad=(this.boxHeight*.2);
PlayerToken=function(letter) {
	this.token=letter;
	this.display=function(location) {
		textSize(90);
		text(this.token,location.x+16,location.y+80);
	}
}

function setup() {
	select("#gamename").html("Tic Tac Toe");
	canvas=createCanvas(400,400);
	canvas.position(windowWidth/2-width/2,windowHeight/3-height/2);
	messageSlot=createElement("h1");
	messageSlot.position(windowWidth/2-width/2,410+windowHeight/3-height/2);
	makeButton();
	makeUndoButton();
	initializeVars();
}

function makeUndoButton() {
	undo=createButton("Undo");
	undo.position(315+windowWidth/2-width/2,425+windowHeight/3-height/2);
	undo.mousePressed(undoMove);
	undo.size(87,50)
	undo.style("background-color","rgb(0,200,0)");
	undo.style("border","none");
	undo.style("color","rgb(0,0,200)");
}

function undoMove() {
	if(!winLine&&turns>0) {
		let lastTurn=pastMoves[pastMoves.length-1];
		turns--;
		switchPlayer();
		lastTurn.status=-1;
		pastMoves.splice(pastMoves.length-1,1)
	}
}

function initializeVars() {
	//rows,cols,boxWidth,boxHeight,canvasWidth,canvasHeight,spacing,statusList,pigment
	board=new Grid(3,3,100,100,width,height,spacing,
		[new PlayerToken(" "),new PlayerToken("X"),new PlayerToken("O")],color(0,255,0));
	player=0;
	turns=0;
	winLine=false;
	pastMoves=[];
	messageSlot.html(playerList[player]+"'s turn");
}

function resetGame() {
	again.hide();
	undo.show();
	background(0,0,200);
	initializeVars();
}

function makeButton() {
	again=createButton("Play Again?")
	again.position(200+windowWidth/2-width/2,425+windowHeight/3-height/2);
	again.mousePressed(resetGame);
	again.size(87,50)
	again.style("background-color","rgb(0,200,0)");
	again.style("border","none");
	again.style("color","rgb(0,0,200)");
	again.hide();
}

function draw() {
	background(0,0,200);
	board.printGrid();
	//highlight
	let loc=board.findLocation(mouseX,mouseY);
	if(loc&&loc.status==-1&&!winLine) {
		loc.highlight(false,2);
	}
	//win line
	if(winLine) {
		strokeWeight(5);
		stroke(200,0,0);
		line(winLine[0].midpointX,winLine[0].midpointY,winLine[1].midpointX,winLine[1].midpointY);
		strokeWeight(1);
		noStroke();
	}
}

function switchPlayer() {
	player=1-player;
	messageSlot.html(playerList[player]+"'s turn");
}

function mousePressed() {
	let location=board.findLocation(mouseX,mouseY)
	if(location&&location.status==-1&&!winLine) {
		pastMoves[pastMoves.length]=location;
		location.status=player;
		let won=board.checkStreak(3,location.row,location.col,player);
		if(won) {
			winGame(won);
		}else{
			turns++;
			if(turns==9) {
				tieGame();
			} else {
				switchPlayer();
			}
		}
	}
}

function winGame(won) {
	strokeWeight(5);
	stroke(200,0,0);
	line(won[0].midpointX,won[0].midpointY,won[1].midpointX,won[1].midpointY);
	strokeWeight(1);
	stroke(0);
	winLine=won;
	messageSlot.html(playerList[player]+" Won!!");
	again.show();
	undo.hide();
}

function tieGame() {
	messageSlot.html("Tie Game");
	again.show();
	undo.hide();
}
