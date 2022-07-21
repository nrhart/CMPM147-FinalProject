var canvas = document.getElementById('game');//create canvas var
var canvasContext = canvas.getContext('2d'); //make it 2d

var w = 20; //width of tiles

const MinRooms = 5;

var rows = 50; //how many rows of tiles
var cols= 50; //how many cols of tiles

var grid = []; //where we store the map

var rooms = []; //where we store the rooms
var collide = false; //whether or not the rooms are colliding

var amount = randomIntFromInterval(MinRooms, 10) //amount of rooms
var randomKey = randomIntFromInterval(5, amount);
var randomExit = randomIntFromInterval(0,1);
if(randomKey == amount){
	randomKey += 1;
}
if (randomKey > amount){
	randomKey -= 2;
}

var size = 5;	//the actuall size will be a number bettween 5 and 10 | e.g: size+sizeMin
var sizeMin = 5;

var disX; //distance x between rooms
var disY; //distance y between rooms
var corridorW = 1; //corridor width

var playerX = 0;
var playerY = 0;
var playerWidth = 10;
var playerHeight = 10;
var keyX = 0;
var keyY = 0;
var keyWidth = 10;
var keyHeight = 10;
var exitX = 0;
var exitY = 0;
var exitWidth = 10;
var exitHeight = 10;
var playerSpeed = 2;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

gotKey = false;


 ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////


function Cell(c, r, x, y)//cell object
	{
		this.c = c //column it is in
		this.r = r //row it is in
		this.x = x //x coord
		this.y = y //y coord
		this.empty = false //empty or full?
		
		this.show = function() //draw the map
			{
		  	if(this.empty == false)
		  		{
		  			canvasContext.fillStyle = "#323232"
		  			canvasContext.fillRect(this.x, this.y, w, w)
		  		}
		  	else 
		  		{
		  			canvasContext.fillStyle = "#696966"
		  			canvasContext.fillRect(this.x, this.y, w, w)
		  		}
			}

		this.carve = function(dis, x, y)//carve out the rooms
			{
				for (var i = 0; i < rooms.length; i++) 
					{
						if(this.c >= rooms[i].y/w && this.c < rooms[i].y/w+rooms[i].h/w && this.r >= rooms[i].x/w && this.r < rooms[i].x/w+rooms[i].w/w)
							{
								this.empty = true
							}
					}
			}
			
		this.carveH = function(dis,x,y)//carve out the horizontal corridor
			{
				if(this.r >= x && this.r < x+dis && this.c < y+corridorW && this.c > y-corridorW)
					{
						this.empty = true
					}
			}
		this.carveV = function(dis,x,y)//carve out the vertical corridor
			{
				if(this.c >= y && this.c < y+dis && this.r < x+corridorW && this.r > x-corridorW)
					{
						this.empty = true
					}
			}
	}
  
function makeGrid()//create the array of tiles
 	{ 
  	for (var r = 0; r < rows; r++) 
  		{
    		for (var c = 0; c < cols; c++) 
    			{
    				var y = c*w
    				var x = r*w
     				var cell = new Cell(c, r, x, y);
      			grid.push(cell);
    			}
  		}
 	}
 	
 ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
    
function Room(x, y, width, height, i)//room object
	{
		this.x = (x-1)*w; //column
		this.y = (y-1)*w; //row
		this.w = width*w; //width
		this.h = height*w; //height
		
		this.center = [Math.floor(this.x/w+width/2), Math.floor(this.y/w+height/2)]//center
		if (i == 0) {
			playerX = this.x+5;
			playerY = this.y+5;
		}
		if(i == randomKey){
			keyX = this.x + randomIntFromInterval(10, 80);
			keyY = this.y + randomIntFromInterval(10, 80);
		}
		
		if(i == randomExit){
			exitX = this.x + randomIntFromInterval(10, 80);
			exitY = this.y + randomIntFromInterval(10, 80);
		}

		this.draw = function()//draw the number of the room
			{
				canvasContext.fillStyle = "white"
				canvasContext.fillText(i, this.x+this.w/2, this.y+this.h/2-20)
			}
	}

function createRooms()//create the rooms
	{
		for (var i = 0; i < amount; i++) //for the amount of rooms you want
			{
				var room = new Room(Math.floor(Math.random()*rows)+1, Math.floor(Math.random()*cols)+1, Math.floor(Math.random()*size)+sizeMin, Math.floor(Math.random()*size)+sizeMin, i)
				//create a room object ^
					
				if(i > 0)//if not the first room
					{
						if(rooms[0].x+rooms[0].w >= canvas.width || rooms[0].x <= 0 || rooms[0].y+rooms[0].h >= canvas.height || rooms[0].y <= 0)//if first room is outside the canvas
							{
								rooms = [] //restart
								createRooms();
								break;
							}
							
						for (var e = 0; e < rooms.length; e++) //for all the previous rooms
							{
								collide = false//they are not colliding

								if(room.x <= rooms[e].x+rooms[e].w && room.x+room.w >= rooms[e].x && room.y <= rooms[e].y+rooms[e].h && room.y+room.h >= rooms[e].y)//if colliding with previous room
									{
										collide = true;//kill room
										i--
										break;
									}
								else if (room.x+room.w >= canvas.width || room.x <= 0 || room.y+room.h >= canvas.height || room.y <= 0) //if outside of canvas
									{
										collide = true;//kill room
										i--;
										break;
									}
							}
					}
				
				if(collide == false)//if they have not collided
					{
						rooms.push(room) //add room to the array
						if(i>0)//make corridors
							{
								hCorridor(rooms[i-1].center[0], room.center[0], rooms[i-1].center[1], room.center[1])
								vCorridor(rooms[i-1].center[0], room.center[0], rooms[i-1].center[1], room.center[1])
							}
					}
			}
	}

 ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function hCorridor(x1,x2,y1,y2)//horizontal corridor creator
	{
		if(x1 > x2)//if the first room is further towards the right then the second one
			{
				disX = x1-x2 //find the distance between rooms
				disX += 1
				
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].carveH(disX, x2, y2)//carve out the corridor
					}				
			}
		else//if the second room is further towards the right then the first one
			{
				disX = x2 - x1 //find the distance between rooms
				disX += 1
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].carveH(disX, x1, y1)//carve out corridor
					}
			}
			
	}
	
function vCorridor(x1,x2,y1,y2)//vertical corridor creator
	{
		var x;
		
		if(y1 > y2)//if the first room is further towards the bottom then the second one
			{
				disY = y1-y2 //find the distance between rooms
				disY += 1
				
				if(x2+(disX-1) > x1+(disX-1))//find the correct x coord
					{
						x = x2
					}
				else 
					{
					x = x2+(disX-1)
					}
				
				for(var i = 0; i < grid.length; i++) 
					{
						grid[i].carveV(disY, x, y2)//carve out corridor
					}
			}
		else//if the second room is further towards the bottom then the first one
			{
				disY = y2 - y1 //find the distance between rooms
				disY += 1
				
				if(x1+(disX-1) > x2+(disX-1))//find the correct x coord
					{
						x = x1
					}	
				else 
					{
						x = x1+(disX-1)
					}
					
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].carveV(disY, x, y1)//carve out corridor
					}
				
			}
			
	}
		
 ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
function createPlayer() {
	canvasContext.fillStyle = "#FF0000";
	canvasContext.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function createKey() {
	canvasContext.fillStyle = "#FFD700";
	canvasContext.fillRect(keyX, keyY, keyWidth-1, keyHeight-1);
	canvasContext.fillRect(keyX+9, keyY, keyWidth, keyHeight/3);
	canvasContext.fillRect(keyX+12, keyY, keyWidth/3, keyHeight/2);
	canvasContext.fillRect(keyX+19, keyY, keyWidth/3, keyHeight/2);
}

function createExit() {
	canvasContext.fillStyle = "black";
	canvasContext.fillRect(exitX, exitY, exitWidth, exitHeight);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
	else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
	else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
}

function randomIntFromInterval(min, max) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min)
  }

function movement() {
	if (rightPressed) {
		playerX += playerSpeed;
	} else if (leftPressed) {
		playerX -= playerSpeed;
	}
	if (upPressed) {
		playerY -= playerSpeed;
	} else if (downPressed) {
		playerY += playerSpeed;
	}
}
 
function draw() {

	movement();
	//checkInput();
	if (playerX + playerWidth > exitX && 
		playerX < exitX + exitWidth && 
		playerY + exitHeight > exitY && 
		playerY < exitY + exitHeight && gotKey == true) {
		location.reload();
	}

	if (rooms.length < MinRooms) {
		location.reload();
	}
   	for (var i = 0; i < grid.length; i++) 
   		{
     		grid[i].carve();//carve out the rooms
     		grid[i].show();//draw the map
  		}
		
  	for (var i = 0; i < rooms.length; i++) 
  		{
  			rooms[i].draw();//draw the rooms number
  		}
	createPlayer();
	/*if (playerX + playerWidth > rooms.x && 
		playerX < rooms.x + rooms.w && 
		playerY + rooms.h > rooms.y && 
		playerY < rooms.y + rooms.h) {
		playerSpeed *= 0;
	}*/
	createKey(keyX, keyY, keyWidth, keyHeight);
	if (playerX + playerWidth > keyX && 
		playerX < keyX + keyWidth && 
		playerY + playerHeight > keyY && 
		playerY < keyY + keyHeight) {
		gotKey = true;
	}
	createExit();
  }

makeGrid()//make map
createRooms()//make rooms
setInterval(draw, 10);//update
