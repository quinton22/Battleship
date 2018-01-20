var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

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
   document.getElementById("twoPlayerMode").style.display = "block";
   canvas.style.display = "block";
   c.fillRect(0, 0, canvas.width, canvas.height);
   c.fillStyle = "#000";
}




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
