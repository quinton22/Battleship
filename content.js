// Variables to change how the game is played
const SHIP_SIZES = [5, 4, 3, 3, 2]; // size of each ship
const COLUMN_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
   "T", "U", "V", "W", "X", "Y", "Z"];

var boardsOnScreen = []; // all boards that are created
var board1; // board1 global var
var board2; // board2 global var
var won = false;
var showShip; // function show ship declared global so it can be deleted


// handles resizing of window
window.addEventListener("resize", function () {
   // set board height and width on resize
   let previousHeight;
   let boardHeight = setBoardHeight();
   boardsOnScreen.forEach(function(b) {
      if (b.drawing) { // if board drawing exists
         previousHeight = b.height;
         b.height = boardHeight;
         b.width = boardHeight;

         // resizes ships
         b.ships.forEach(function(s) {
            if (s.orientation === "v") {
               s.height = s.length * (boardHeight / (b.size + 1)) - 6;
               s.width = boardHeight / (b.size + 1) - 6;
            } else {
               s.width = s.length * (boardHeight / (b.size + 1)) - 6;
               s.height = boardHeight / (b.size + 1) - 6;
            }
            // if ship is placed, this keeps it in its spot on resize for the most part
            if (s.spot) {
               let table = s.drawing.parentNode.querySelector("table");
               let bRectTd = table.querySelectorAll("td")[s.spot[0] * b.size + s.spot[1]].getBoundingClientRect();
               let bRectDiv = table.parentNode.parentNode.getBoundingClientRect();
               s.y = bRectTd.top - bRectDiv.top + table.querySelector("td").offsetHeight * .06; // new y
               s.x = bRectTd.left - bRectDiv.left + table.querySelector("td").offsetWidth * .06; // new x
            } else { // otherwise stays on left side of board
               s.x = s.x * b.height / previousHeight;
               s.y = s.y * b.height / previousHeight;
            }
         });
         b.redraw(); // redraws the board (and the ships)
      }
   });

});



window.onload = function() {
   // click event to one player button
   document.getElementById("one-player-btn").addEventListener("click", function () {
      console.log("Init 1 player mode");
      hideTitle(1); // goes to hide title mode = 1
   });

   // click event to two player button
   document.getElementById("two-player-btn").addEventListener("click", function() {
      console.log("Init 2 player mode");
      hideTitle(2); // goes to hide title mode = 2
   });

   // click event on instructions button
   document.getElementById("instructions-btn").addEventListener("click", function() {
      console.log("Instructions Page")
      hideTitle(3); // goes to hide title mode = 3
   });

   // back button click event handler brings back to home page
   document.getElementById("back-btn").addEventListener("click", function() {
      let titleDiv = document.getElementById("title-div");


      if (document.getElementById("instr-header").style.display === "inline") {
         // exits out of instructions
         document.getElementById("instr-header").style.display = "none";
         document.getElementById("instr-container").style.display = "none";
         titleDiv.style.display = "block"; // shows title
      } else if (document.getElementById("one-player-mode").style.display === "inline") {
         // exits out of one-player-mode
         document.getElementById("one-player-mode").style.display = "none";
         document.getElementById("board-container").style.display = "none";
         titleDiv.style.display = "block"; // shows title

         // deletes html of boards
         boardsOnScreen.forEach(function (b) {
            if (b.drawing) {
               document.getElementById("board-cell").removeChild(b.drawing.parentNode);
            }
         });
         boardsOnScreen = []; // resets boards on screen

         if (showShip) {
            document.removeEventListener("keydown", showShip); // removes show ship event listener
         }
      } else if (document.getElementById("two-player-mode").style.display === "inline") {
         // exits two player mode
         document.getElementById("two-player-mode").style.display = "none";
         document.getElementById("board-container").style.display = "none";
         titleDiv.style.display = "block";
         // resets wording and done button
         document.getElementById("done-btn-cell").children[0].innerHTML = "Player one, place your ships."
         document.getElementById("done-btn").innerHTML = "Done";
         document.getElementById("done-btn").style.display = "inline-block";
         if (showShip) {
            document.removeEventListener("keydown", showShip); // removes show ship event listener
         }

         // deletes html of boards
         boardsOnScreen.forEach(function (b) {
            if (b.drawing) {
               document.getElementById("board-cell").removeChild(b.drawing.parentNode);
            }
         });
         boardsOnScreen = []; // resets boardsOnScreen
      }
      if (won) { // if the game has been won and exit
         document.getElementById("done-btn-cell").removeChild(document.getElementById("done-btn-cell").children[0]); // removes win text
         document.getElementById("done-btn-cell").children[0].innerHTML = "Player one, place your ships." // resets other win text
         document.getElementById("done-btn").innerHTML = "Done"; // restes done button
         document.getElementById("done-btn").style.display = "inline-block";
         document.removeEventListener("keydown", showShip); //removes showship listener
         won = false; // resets won
      }
   });
};


// FUNCTIONS

// sets board height based on window size
function setBoardHeight() {
   let boardContainer = document.getElementById("board-container");
   let maxSize = (window.innerHeight - document.querySelector("header").offsetHeight) * .6; // maximum size is 60% of window minus header
   let minSize = 190; // min size of board
   let height = boardContainer.offsetWidth/3; // height if in between max and min
   if (height > maxSize) {
      return maxSize;
   } else if (height < minSize) {
      return minSize;
   } else {
      return height;
   }
}

// Hides the titleDiv and calls mode function to initiate game
function hideTitle(mode) {
   document.getElementById("title-div").style.display = "none";

   if (mode === 1) {
      document.getElementById("board-container").style.display = "block"; // shows board container
      initOnePlayer();
   } else if (mode === 2) {
      document.getElementById("board-container").style.display = "block"; // shows board container
      initTwoPlayer();
   } else {
      goToInstr();
   }
}

// shows instructions div
function goToInstr() {
   document.getElementById("instr-container").style.display = "block";
   document.getElementById("instr-header").style.display = "inline";
}

// Starts the one player mode - currently unavailable
function initOnePlayer() {
   document.getElementById("one-player-mode").style.display = "inline";
}

// Starts the two player mode
function initTwoPlayer() {
   let boardHeight = setBoardHeight(); // Sets board height and width depending on the page size

   // creates boards
   board1 = new Board(boardHeight, boardHeight, "Player One");
   board2 = new Board(boardHeight, boardHeight, "Player Two");

   document.getElementById("two-player-mode").style.display = "inline"; // title

   // sets instruction aside (on left)
   let instrP = document.createElement("p");
   instrP.innerHTML = "Place ships on the board by dragging them. Change their orientation by double clicking or pressing space, h, or v while hovered over them. Click \"Done\" when finished.";
   document.getElementById("instructions-aside").appendChild(instrP);
   instrP.setAttribute("margin-top", "10%");

   board1.draw(); // creates html element of board1

   // done button event listener to save ship places
   let doneBtnClick;
   document.getElementById("done-btn").addEventListener("click", doneBtnClick = function () {
      if (board1.drawing.parentNode.style.display !== "none") { // board1 showing
         if (board1.saveShipPlaces()) { // saves ship places returns true if ships are on board and not overlapping
            board1.drawing.parentNode.style.display = "none"; // board1 out of view
            board1.drawing.parentNode.querySelector("aside").style.display = "none"; // ship container out of view

            board2.draw(); // draws board2

            document.getElementById("done-btn-cell").querySelector("p").innerHTML = "Player two, place your ships."; // replaces help text
         } else { // board1 ships not on board or are overlapping
            document.getElementById("done-btn-cell").querySelector("p").innerHTML = "Please place your ships on the board and do not overlap.";
         }
      } else { // board2 showing
         if (board2.saveShipPlaces()) { // saves ship places returns true if ships are on board and not overlapping
            board2.drawing.parentNode.style.display = "none"; // out of view
            board2.drawing.parentNode.querySelector("aside").style.display = "none"; // ship container out of view
            document.getElementById("done-btn").removeEventListener("click", doneBtnClick); // removes double click event listener
            gameplayTwoPlayer(); // starts gameplay
         } else { // board2 ships not on board or are overlapping
            document.getElementById("done-btn-cell").querySelector("p").innerHTML = "Please place your ships on the board and do not overlap.";
         }
      }
   });
}

// Handles gameplay for two players
function gameplayTwoPlayer() {
   // set instructions aside
   document.getElementById("instructions-aside").querySelector("p").innerHTML = "Click a position to guess, it will light up green. Then click \"Done.\" Blocks that are red indicate that you hit your oppenent's ship at that position. Blocks that are gray indicate that you have missed at that position. Hold \"s\" to see your board at any time.";

   // keydown event handler to show board
   document.addEventListener("keydown", showShip = function(event) {
      let unshowShip;
      let key = event.keyCode ? event.keyCode : event.which; // gets key
      if (key === 83) { // if "s" is hit
         // if the done button is showing (instead of start)
         // i.e. a board is actually shown on screen
         if (document.getElementById("done-btn").innerHTML === "Done") {
            boardsOnScreen.forEach(function (b) {
               if (b.drawing.parentNode.style.display === "none") { // gets the board that is not being shown
                  b.unhideShips(); // unhides the ships
                  // remove and append so that showing board is always on the right
                  document.getElementById("board-cell").removeChild(b.drawing.parentNode);
                  document.getElementById("board-cell").appendChild(b.drawing.parentNode);
                  b.drawing.parentNode.style.display = "inline-block";
                  b.drawing.parentNode.querySelector("aside").style.display = "block"; // aside is viewable to use as buffer b/w tables

                  // key up event to stop showing board when keyup
                  document.addEventListener("keyup", unshowShip = function(event) {
                     let key2 = event.keyCode ? event.keyCode : event.which;
                     if (key === key2) { // if key up and keys match ("s")
                        b.hideShips(); // hides the ships again
                        b.drawing.parentNode.style.display = "none"; // hides board
                        b.drawing.parentNode.querySelector("aside").style.display = "none"; // hides aside
                        document.removeEventListener("keyup", unshowShip); // removes key up listener
                     }
                  });
               }
            });
         }
      }
   });

   let doneBtn = document.getElementById("done-btn"); // done button
   let randInt = Math.floor(Math.random() * 2); // random integer to decide who goes first
   let startingPlayer = "Player One";
   if (randInt === 1) { // 0 -> Player one & 1 -> Player two
      startingPlayer = "Player Two";
   }
   board1.hideShips(); // hides the ships for both boards
   board2.hideShips();
   var guess = []; // sets variable for the guess
   var guessOpen = true; // spot has not been guessed before (initially all)
   var clicked = false; // Makes sure a position was chosen

   // Displays start text
   let doneBtnP = document.getElementById("done-btn-cell").querySelector("p");
   doneBtnP.innerHTML =
   startingPlayer + " has randomly been chosen to go first. Click \"Start\" to begin.";
   doneBtn.innerHTML = "Start";

   // adds hover class to change cursor to pointer
   board1.drawing.querySelector("table").className += " hover";
   board2.drawing.querySelector("table").className += " hover";

   // sets the text after spot is chosen ("hit", "miss", "win")
   let hitP = document.createElement("p");
   hitP.style.fontSize = "5vw";
   hitP.id = "hit-p";
   doneBtn.parentNode.insertBefore(hitP, doneBtnP);

   // click event for done button
   let startClick;
   doneBtn.addEventListener("click", startClick = function () {
      if (doneBtn.innerHTML === "Done" && clicked && guessOpen) { // board is being displayed, spot was clicked, and is open
         hitP.style.display = "block"; // displays hit, miss, sunk, win
         if (randInt === 0) { // player 1
            if (guessOpen) { // guess not already taken
               doneBtn.innerHTML = "Start";
               board2.drawing.parentNode.style.display = "none"; // hide board
               doneBtnP.innerHTML = "Player Two, your turn.";
               startGuess(board2, guess); // handles guess
               randInt = 1; // alternates players -> player 2
            }
         } else { // player 2
            if (guessOpen) { // guess not already taken
               doneBtn.innerHTML = "Start";
               board1.drawing.parentNode.style.display = "none"; // hide board
               doneBtnP.innerHTML = "Player One, your turn.";
               startGuess(board1, guess); // handles guess
               randInt = 0; // alternates players -> player 1
            }
         }
         clicked = false; // resets clicked
      } else if (doneBtn.innerHTML === "Done" && !clicked) { // if nothing clicked and board on screen
         doneBtnP.innerHTML = "Please click a position on the board."
      } else if (doneBtn.innerHTML === "Done" && clicked && !guessOpen){ // if guess already taken
         doneBtnP.innerHTML = "That spot has already been chosen. Choose another one.";
         console.log("Already taken");
      } else { // no board is displayed
         hitP.style.display = "none";
         doneBtn.innerHTML = "Done";
         doneBtnP.innerHTML = "Guess a spot and click \"Done\" when finished.";
         if (randInt === 0) { // player 1 turn
            board2.drawing.parentNode.style.display = "inline-block";
            doneBtnP.innerHTML += " Your opponent has " + board2.ships.length.toString(); // ships left of opponent
            doneBtnP.innerHTML += board2.ships.length > 1 ? " ships left." : " ship left.";
         } else { // player 2 turn
            board1.drawing.parentNode.style.display = "inline-block";
            doneBtnP.innerHTML += " Your oppenent has " + board1.ships.length.toString(); // ships left of opponent
            doneBtnP.innerHTML += board1.ships.length > 1 ? " ships left." : " ship left.";
         }
      }
      if (won) {
         doneBtn.removeEventListener("click", startClick); // removes event listener if won
      }

   });

   // Handles the clicking of a board
   var clickBoard = function (board) {
      board.drawing.querySelector("table").addEventListener("click", function (event) {

         clicked = true; // sets clicked to true
         guessOpen = true; // guess open initially true to be set false
         guess = []; // guess coordinates
         let tdId = event.target.id; // td id in form [row]_[col]

         if (event.target.id) { // if a td and not anything else
            // gets guess coordinates from td id
            tdId = tdId.substring(tdId.indexOf("_") + 1);
            guess.push(~~tdId.substring(0, tdId.indexOf("_")));
            guess.push(~~tdId.substring(tdId.indexOf("_") + 1));
            board.guesses.forEach(function(g) {
               if (g[0] === guess[0] && g[1] === guess[1]) { // compares guess to all previous guesses;
                  guessOpen = false;
               }
            });
            if (guessOpen) {
               board.drawing.querySelectorAll("td").forEach(function (td) {
                  if (td.style.background === "green") { // resets td to blue
                     td.style.background = "#5483ce";
                  }
               });
               event.target.style.background = "green"; // sets clicked td to green
            }
         }


      });
   };
   clickBoard(board1);
   clickBoard(board2);

}

// handles guess
function startGuess(board, guess) {
   let hit = false; // hit is false
   let sunk = false; // sunk is false
   board.guesses.push(guess); // addes guess to all guesses
   board.shipPlaces.forEach(function (s, idx) {
      s.forEach(function (p, idx2) {
         if (guess[0] === p[0] && guess[1] === p[1]) { // compares guess to location of ships
            hit = true; // true if match
            board.shipPlaces[idx].splice(idx2, 1); // removes that coordinate so no longer counted
            if (!board.shipPlaces[idx].length) { // if all the spots of a ship have been guessed and removed
               board.shipPlaces.splice(idx, 1); // remove ship from coordinate matrix
               board.ships.splice(idx, 1); // removes ship from board
               sunk = true; // sunk
            }
         }
      });
   });
   if (hit) {
      console.log("Hit");
      document.getElementById("hit-p").innerHTML = "HIT!";
      document.getElementById(boardsOnScreen.indexOf(board) + "_" + guess[0].toString() + "_" + guess[1].toString()).style.background = "red"; // sets td to the color red to indicate hit
      if (sunk) {
         console.log("Sunk");
         document.getElementById("hit-p").innerHTML = "You sunk a ship!!";
         if (!board.ships.length) { // no ships remaining, the game is won
            won = true;
            let winnerBoard = board === boardsOnScreen[0] ? boardsOnScreen[1] : boardsOnScreen[0];
            document.getElementById("hit-p").innerHTML = winnerBoard.player + ", you WIN!!!";
            document.getElementById("hit-p").parentNode.querySelectorAll("p")[1].innerHTML = "You sunk all of your opponent's ships! Press the \"X\" in the upper right hand corner to go back to the main menu.";
            document.getElementById("done-btn").style.display = "none";
            boardsOnScreen.forEach(function (b) {
               b.deleteDraw();
            });
            boardsOnScreen = [];
         }
      }
   }
   else {
      console.log("Miss");
      document.getElementById("hit-p").innerHTML = "Miss.";
      document.getElementById(boardsOnScreen.indexOf(board) + "_" + guess[0].toString() + "_" + guess[1].toString()).style.background = "#a9b7ce"; // colors td gray to indicate miss
   }
}


// CLASSES

// ship class
class Ship {
   constructor(x, y, height, width, length, id) {
      this.x = x; // x position (px)
      this.y = y; // y position (px)
      this.height = height; // height (px)
      this.width = width; // width (px)
      this.length = length // length of ship (number of blocks)
      this.id = id; // html element id
      this.orientation = "v"; // v = vertical, h = horizontal
      this.spot = null; //Row and col of the ship, leftmost and uppermost
      this.rememberX = x; // last x position
      this.rememberY = y; // last x position
      this.drawing = null; // the html object associated with this ship
      this.dragging = false; // true if ship is being dragged
      this.focused = false; // true if ship is hovered over
      this.mousePosition = []; // position of mouse relative to ship
   }

   // changes orientation of a ship and redraws it to update html view
   changeOrientation() {
      let newHeight = this.width;
      this.width = this.height;
      this.height = newHeight;
      this.orientation = this.orientation === "v" ? "h" : "v";
      this.redraw();
   }

   // updates html view of ship for x, y, height, and width
   redraw() {
      let ship = this.drawing;
      ship.style.top = (this.y).toString() + "px";
      ship.style.left = (this.x).toString() + "px";
      ship.style.height = (this.height).toString() + "px";
      ship.style.width = (this.width).toString() + "px";
   }

   // draws a ship which is a gray rectangle
   draw() {
      let ship = document.createElement("div");
      ship.style.top = (this.y).toString() + "px";
      ship.style.left = (this.x).toString() + "px";
      ship.style.height = (this.height).toString() + "px";
      ship.style.width = (this.width).toString() + "px";
      ship.className = "ship";
      ship.id = this.id;

      this.drawing = ship;

      let _this = this;

      // double click to change orientation
      this.drawing.addEventListener("dblclick", function shipDblClick() {
            _this.changeOrientation();
      });

      // click to drag - dragging set to true
      this.drawing.addEventListener("mousedown", function shipMouseDown(event) {
         _this.dragging = true;
         _this.drawing.className += " float"; // adds a shadow
      });

      // drops ship and snaps to a position
      this.drawing.addEventListener("mouseup", function shipMouseUp(event) {
         _this.mousePosition = []; // resets track of mouse positoin
         _this.drawing.style.zIndex = "2";
         let table = _this.drawing.parentNode.querySelector("table");

         // sets bounds for board which are a half of a cell outside of the actual board
         let tableLeftBound =  table.parentNode.previousSibling.offsetWidth + table.querySelector("td").offsetWidth/2;
         let tableRightBound = table.parentNode.parentNode.offsetWidth - _this.width + table.querySelector("td").offsetWidth/2;
         let tableTopBound =  table.querySelector("caption").offsetHeight + table.querySelector("tr").offsetHeight/2;
         let tableBottomBound = table.offsetHeight - _this.height + table.querySelector("tr").offsetHeight/2;

         if (_this.x > tableLeftBound && _this.y > tableTopBound && _this.x < tableRightBound && _this.y < tableBottomBound) { // if inside board

            // find closest row and snap to it
            let trPos, tdPos;
            let shipPos = _this.drawing.getBoundingClientRect();
            let trArray = table.querySelectorAll("tr");
            let minDist = trArray[0].offsetHeight; // distance to nearest td cell
            let minDistSigned; // signed version of above
            let row = -1;
            let col = -1;

            // calculates minDist for y axis
            trArray.forEach(function(tr, idx) {
               trPos = tr.getBoundingClientRect();
               if (Math.abs(trPos.top - shipPos.top) < minDist) {
                  minDistSigned = trPos.top - shipPos.top;
                  minDist = Math.abs(minDistSigned);
                  row = idx;
               }
            });

            // if the ship was being dragged, makes sure ship is within the
            // bounds otherwise snaps back to old pos
            if (_this.dragging) {
               let newY = _this.y + minDistSigned + trArray[row].offsetHeight * .05;
               if (newY > tableBottomBound - table.querySelector("tr").offsetHeight/2 || newY < tableTopBound + table.querySelector("tr").offsetHeight/2) {
                  _this.y = _this.rememberY
               } else {
                  _this.y = newY
               }
            }

            // calculates minDist for x axis
            let tdArray = trArray[1].querySelectorAll("td");
            minDist = tdArray[0].offsetWidth;
            tdArray.forEach(function(td, idx) {
               tdPos = td.getBoundingClientRect();
               if (Math.abs(tdPos.left - shipPos.left) < minDist) {
                  minDistSigned = tdPos.left - shipPos.left;
                  minDist = Math.abs(minDistSigned);
                  col = idx;
               }
            });

            // if the ship was being dragged, makes sure ship is within the
            // bounds otherwise snaps back to old pos
            if (_this.dragging) {
               let newX = _this.x + minDistSigned + tdArray[col].offsetWidth * .06;
               if (newX > tableRightBound - table.querySelector("td").offsetWidth/2 || newX < tableLeftBound + table.querySelector("td").offsetWidth/2) {
                  _this.x = _this.rememberX;
               } else {
                  _this.x = newX;
               }
            }

            _this.spot = [row-1, col]; // sets spot so ship is officially on the board

            // sets old position as new position
            _this.rememberX = _this.x;
            _this.rememberY = _this.y;
            _this.redraw(); // redraws the ship
         } else {
            // snaps back to old position and redraws
            console.log("Place ship on board");
            _this.x = _this.rememberX;
            _this.y = _this.rememberY;
            _this.redraw();
         }
         _this.dragging = false; // sets draggin to false
         _this.drawing.className = "ship"; // removes shadow
      });

      // sets green border on ship and allows for orientation change
      this.drawing.addEventListener("mouseover", function shipMouseOver(event) {
         _this.focused = true;
      });

      // handles actual dragging of ship
      this.drawing.addEventListener("mousemove", function shipMouseMove(event) {
         if (_this.dragging && _this.focused) {
            _this.drawing.style.zIndex = "3";
            let rect = _this.drawing.getBoundingClientRect();
            // rect.left / rect.right vs event.clientX
            let xDist = event.clientX - rect.left; // distance from mouse to side of ship
            let yDist = event.clientY - rect.top; // distance from mouse to top of ship

            if (_this.mousePosition.length === 0) {
               _this.mousePosition = [xDist, yDist]; // sets mouse position
            } else if (_this.mousePosition.length !== 0) { // always keeps mouse distance the same therefore moving ship
               _this.x += xDist - _this.mousePosition[0];
               _this.y += yDist - _this.mousePosition[1];
               _this.redraw(); // redraw to update x and y
            }
         }
      });

      // handles keypress to change orientation only if focused
      document.addEventListener("keypress", function shipKeyPress(event) {
         if (_this.focused) {
            let key = event.keyCode ? event.keyCode : event.which;
            if ((key == 86 || key === 118) && _this.orientation === "h") { // V, v
               _this.changeOrientation();
            } else if ((key === 72 || key === 104) && _this.orientation === "v") { // H, h
                     _this.changeOrientation();
            } else if (key === 32) { // space
               _this.changeOrientation();
            }
         }

      });

      // unfocuses and fires mouseup event so that if the mouse moves out
      // of the ship while dragging, then there is no glitch
      this.drawing.addEventListener("mouseout", function shipMouseOut(event) {
         _this.drawing.className = "ship";
         _this.focused = false;
         if(_this.dragging) {
            let mouseUp = new MouseEvent('mouseup');
            _this.drawing.dispatchEvent(mouseUp);
         }

      });

      // returns the html element
      return ship;
   }
}


// Board Class represents a board that ships are played on
class Board {
   constructor(height, width, player) {
      this.height = height; // height (px)
      this.width = width; // width (px)
      this.player = player; // Player One / Two
      this.size = 10; // Playable grid size
      this.drawing = null; // the html element of the board object
      this.shipPlaces = []; // the places of all the ships on this board
      this.guesses = []; // all the guess on this board

      // Creates array of Ship objects
      this.ships = []; // all the ship objects associated with this board
      let _this = this; // allows this to work in foreach loop
      SHIP_SIZES.forEach(function(length, idx) {
         _this.ships.push(new Ship(0, _this.height/(_this.size + 1), length * _this.height/(_this.size + 1) - 6, _this.width/(_this.size + 1) - 6, length));
      });
      boardsOnScreen.push(this); // keeps the boards on screen
   }

   // saves the places of the ship only if all the ships have been placed
   // returns true if all ships are on the board and not overlapping
   saveShipPlaces() {
      this.shipPlaces = [];
      let _this = this;
      let safe = true; // variable to check if all the ships are on the board

      // checks if each ship is on the board, if so puts all of the locations
      // each ship takes up into an array and puts that in ship places
      this.ships.forEach(function(ship) {
         if (!ship.spot) { // checks if on board (spot won't exist otherwise)
            safe = false;
         } else { // pushes positions into shipPlaces
            let shipPosition = [];
            shipPosition.push(ship.spot);
            if (ship.orientation === "v") { // counts all positions a ship takes up
               for(let i = 1; i < ship.length; ++i) {
                  shipPosition.push([ship.spot[0] + i, ship.spot[1]]);
               }
            } else {
               for(let i = 1; i < ship.length; ++i) {
                  shipPosition.push([ship.spot[0], ship.spot[1] + i]);
               }
            }
            _this.shipPlaces.push(shipPosition);
         }
      });

      // checks for overlap of ships if all ships are on the board
      if (safe) {
         let sPlace; // variable to hold everything except this ship so it doesn't check itself
         this.ships.forEach(function(ship, idx) {
            sPlace = _this.shipPlaces.slice(0); // deep copy of ship places
            let shipPos = []; // holds array of cordinates of ship
            if (ship.orientation === "v") {
               for (let i = 0; i < ship.length; ++i) {
                  shipPos.push([ship.spot[0] + i, ship.spot[1]]);
               }
            } else {
               for (let i = 0; i < ship.length; ++i) {
                  shipPos.push([ship.spot[0], ship.spot[1] + i]);
               }
            }
            sPlace.splice(idx, 1); // ensures that ship doesn't check itself

            // checks for overlap of all other ships
            sPlace.forEach(function (s) {
               s.forEach(function (p) {
                  if (ship.orientation === "v") {
                     for(let i = 0; i < ship.length; ++i) {
                        if (p[0] === ship.spot[0] + i && p[1] === ship.spot[1]) {
                           safe = false; // overlap
                           break;
                        }
                     }
                  } else {
                     for(let i = 1; i < ship.length; ++i) {
                        if (p[0] === ship.spot[0] && p[1] === ship.spot[1] + i) {
                           safe = false; // overlap
                           break;
                        }
                     }
                  }
               });
            });
         });

         // places ship on board permanently
         if (safe) {
            this.ships.forEach(function(ship) {
               // clone to remove event listeners
               let clone = ship.drawing.cloneNode();
               ship.drawing.parentNode.replaceChild(clone, ship.drawing);
               ship.drawing = clone;
               ship.drawing.className += " shipset";
            });
         }
      }

      return safe;
   }

   // hides the html of the ships from view
   hideShips() {
      this.ships.forEach(function(ship) {
         ship.drawing.style.display = "none";
      });
   }

   // unhides the html of the ships
   unhideShips() {
      this.ships.forEach(function(ship) {
         ship.drawing.style.display = "block";
      });
   }

   // redraws the board as to update the height and width
   redraw() {
      let trArray = this.drawing.querySelectorAll("tr");
      let _this = this;
      this.drawing.querySelector("table").setAttribute("height", this.height.toString() + "px"); // sets height of table
      this.drawing.querySelector("table").setAttribute("width", this.width.toString() + "px"); // sets width of table

      // sets height and width of table rows
      trArray.forEach(function(tr) {
         tr.setAttribute("height", (_this.height / (_this.size + 1)).toString() + "px");
         tr.style.width = (_this.width).toString() + "px";
      });

      // redraws each ship
      this.ships.forEach(function(s) {
         s.redraw();
      });
   }

   // removes html of board
   deleteDraw() {
      this.drawing ? this.drawing.parentNode.removeChild(this.drawing) : null;
   }

   // Creates html of board and appends it to doc
   draw() {
      // Create the board and board container
      let tDivContainer = document.createElement("div"); // outer container
      tDivContainer.className = "table-div-container";

      // creates the ship container on side of board
      let shipContainer = document.createElement("aside");
      shipContainer.id = "ship-container";
      shipContainer.innerHTML = "<strong>Ships:</strong>";
      tDivContainer.appendChild(shipContainer);


      let tableDiv = document.createElement("div"); // table container
      tableDiv.id = this.player;
      let table = document.createElement("table"); // table
      tableDiv.appendChild(table);

      let caption = document.createElement("caption"); // caption "Player __"
      caption.innerHTML = this.player + "'s Board";
      table.appendChild(caption);
      tDivContainer.appendChild(tableDiv);

      // puts in cells
      for(let q = 0; q <= this.size; ++q) {
         let tr = document.createElement("tr");
         let td;
         for(let r = 0; r <= this.size; ++r) {
            if (q === 0 || r === 0) {
               td = document.createElement("th");
               if (q === 0 && r !== 0) {

                  // Puts column letters at top of table, if longer than 26 then uses A1, B1, ... etc
                  if (q < COLUMN_LETTERS.length) {
                     td.innerHTML = COLUMN_LETTERS[r - 1];
                  } else {
                     td.innerHTML = COLUMN_LETTERS[(r - 1) % this.size] + Math.floor((r - 1) / this.size).toString();
                  }
               // Puts numbers on side of rows
               } else if (r === 0 && q !== 0) {
                  td.innerHTML = q.toString();
               }
            } else {
               td = document.createElement("td");

               // adds id to each cell in the form [row]_[col]
               td.id = boardsOnScreen.indexOf(this).toString() + "_" +(q - 1).toString() + "_" + (r - 1).toString();
            }
            td.setAttribute("width", this.width / (this.size + 1)); // sets width of <td> cells
            tr.appendChild(td);
            tr.setAttribute("height", this.height / (this.size + 1)); // sets height of rows
         }
         tr.style.width = (this.width).toString() + "px"; // sets width of rows
         table.appendChild(tr);
      }
      table.setAttribute("height", this.height.toString() + "px"); // sets height of table
      table.setAttribute("width", this.width.toString() + "px"); // sets width of table

      tableDiv.appendChild(table);
      tableDiv.className = "table-div";

      // draws each ship
      this.ships.forEach(function (ship) {
         tableDiv.appendChild(ship.draw());
      });
      // appends to document
      document.getElementById("board-cell").appendChild(tDivContainer);
      this.drawing = tableDiv; // sets drawing equal to html of table
   }
}
