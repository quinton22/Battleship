// Variables to change how the game is played
var shipSizes = [5, 4, 3, 3, 2]; // size of each ship

var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");
var startingPositions = {
   carrier: [0, 0],
   battleship: [0, 0],
   cruiser: [0, 0],
   submarine: [0, 0],
   destroyer: [0, 0]
}

class Ship {
   constructor(x, y, height, width) {
      this.x = x;
      this.y = y;
      this.height = height;
      this.width = width;
      this.orientation = "v";
      this.hit = false;
   }
}

class Board {
   constructor(x, y, height, width) {
      this.x = x;
      this.y = y;
      this.height = height;
      this.width = width;
      this.size = 10;
      this.carrier = new Ship(this.x - 100, this.y, shipSizes[0] * this.height/(this.size + 1), this.width/(this.size + 1));
      this.battleship = new Ship(this.x - 100, this.y, shipSizes[1] * this.height/(this.size + 1), this.width/(this.size + 1));
      this.cruiser = new Ship(this.x - 100, this.y, shipSizes[2] * this.height/(this.size + 1), this.width/(this.size + 1));
      this.submarine = new Ship(this.x - 100, this.y, shipSizes[3] * this.height/(this.size + 1), this.width/(this.size + 1));
      this.destroyer = new Ship(this.x - 100, this.y, shipSizes[4] * this.height/(this.size + 1), this.width/(this.size + 1));

   }

   draw() {
      
   }
}


window.addEventListener("resize", function() {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
})

window.onload = function() {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   c.fillStyle = document.body.style.background;

   document.getElementById("onePlayer").addEventListener("click", function () {
      console.log("Init 1 player mode");
      hideTitle(1);
   });

   document.getElementById("twoPlayer").addEventListener("click", function() {
      console.log("Init 2 player mode");
      hideTitle(2);
   });
};

// Hides the titleDiv and calls mode function to initiate game
function hideTitle(mode) {
   document.getElementById("titleDiv").style.display = "none";
   document.querySelector("canvas").style.display = "block";
   if (mode === 1) {
      initOnePlayer();
   } else {
      initTwoPlayer();
   }
}

// Starts the one player mode
function initOnePlayer() {
   document.getElementById("onePlayerMode").style.display = "block";
   canvas.style.display = "block";
}

// Starts the two player mode
function initTwoPlayer() {
   let board1 = new Board()
   document.getElementById("twoPlayerMode").style.display = "block";
   canvas.style.display = "block";
   c.strokeRect(boardPositio, boardPosition[1]);


// c = canvas.getContext('2d')
// c.fillStyle
// c.fillRect(x,y, width, height)

// Line:
// c.beginPath()
// c.moveTo(x,y)
// c.lineTo(x,y)
// c.strokeStyle =
// c.stroke

// Arc / circle
// c.beginPath()
// c.arc(x, y, r, startAngle, endAngle, drawCounterClockwise)
// c.stroke()

// var xVal = 100;
// function animate() {
//    requestAnimationFrame(animate);
//
//    c.beginPath();
//    c.arc(x, 100, 50, 0, Math.PI * 2, false);
//    c.stroke();
//
//    x += 1;
//
// }
//
// animate()

// //start with only the mousedown event attached
// canvas.addEventListener("mousedown",mousedown);
//
// //and some vars to track the dragged item
// var dragIdx = -1;
// var dragOffsetX, dragOffsetY;
//
// function mousedown(e){
//     //...calc coords into mouseX, mouseY
//     for(i=circArray.length; i>=0; i--){ //loop in reverse draw order
//         dx = mouseX - circArray[i].x;
//         dy = mouseY - circArray[i].y;
//         if (Math.sqrt((dx*dx) + (dy*dy)) < circArray[i].r) {
//             //we've hit an item
//             dragIdx = i; //store the item being dragged
//             dragOffsetX = dx; //store offsets so item doesn't 'jump'
//             dragOffsetY = dy;
//             canvas.addEventListener("mousemove",mousemove); //start dragging
//             canvas.addEventListener("mouseup",mouseup);
//             return;
//         }
//     }
// }
//
// function mousemove(e) {
//      //...calc coords
//      circArray[dragIdx].x = mouseX + dragOffsetX; //drag your item
//      circArray[dragIdx].y = mouseY + dragOffsetY;
//      //...repaint();
// }
//
// function mouseup(e) {
//      dragIdx = -1; //reset for next mousedown
//     canvas.removeListener(.... //remove the move/up events when done
}
