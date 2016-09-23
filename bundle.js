(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Core = require('./core.js');
const Player = require('./player.js');
const SlowCar = require('./slowcar.js');
const FastCar = require('./fastcar.js');
const Truck = require('./truck.js');
const Log = require('./log.js');
const Turtle = require('./turtle.js');
const EntityManager = require('./entity-manager.js');

/* Global variables */
var canvas = document.getElementById('screen');
var background = new Image();
background.src = encodeURI('assets/background.png');
var core = new Core();
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 264});
var slowcar = new SlowCar({x: 66, y: 600});
var fastcar = new FastCar({x: 198, y: 500});
var truck = new Truck({x: 132, y: 500});
var log1 = new Log({x: 396, y: 400});
var log2 = new Log({x: 462, y: 700});
var turtle = new Turtle({x: 330, y: 300});
var entities = new EntityManager(canvas.width, canvas.height, 66)
entities.addEntity(player);
entities.addEntity(slowcar);
entities.addEntity(fastcar);
entities.addEntity(truck);
entities.addEntity(turtle);
entities.addEntity(log1);
entities.addEntity(log2);

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime, core);
  slowcar.update(elapsedTime, core);
  fastcar.update(elapsedTime, core);
  truck.update(elapsedTime, core);
  turtle.update(elapsedTime, core);
  log1.update(elapsedTime, core);
  log2.update(elapsedTime, core);
  entities.updateEntity(player);
  entities.updateEntity(slowcar);
  entities.updateEntity(fastcar);
  entities.updateEntity(turtle);
  entities.updateEntity(log1);
  entities.updateEntity(log2);
  entities.updateEntity(truck);
  // TODO: Update the game objects
  entities.collide(function(entity1, entity2) {
    entity1.color = '#ff0000';
    entity2.color = '#00ff00';
    entity1.state = "dead";
    entity2.state = "dead";
  })
  core.update(elapsedTime, player);
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.drawImage(background, 0, 0);
  entities.renderCells(ctx);
  player.render(elapsedTime, ctx);
  slowcar.render(elapsedTime, ctx);
  fastcar.render(elapsedTime, ctx);
  truck.render(elapsedTime, ctx);
  turtle.render(elapsedTime, ctx);
  log1.render(elapsedTime, ctx);
  log2.render(elapsedTime, ctx);
  core.render(elapsedTime, ctx);
}

},{"./core.js":2,"./entity-manager.js":3,"./fastcar.js":4,"./game.js":5,"./log.js":6,"./player.js":7,"./slowcar.js":8,"./truck.js":9,"./turtle.js":10}],2:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Core class
 */
module.exports = exports = Core;

/**
 * @constructor Core
 * Creates a new player object
 */
function Core() {
  this.state = "idle";
  this.heartImage = new Image();
  this.heartImage.src = encodeURI('assets/life.png');
  this.timer = 0;
  this.lives = 3;
  this.gameLevel = 1;
  this.score = 0;
  this.endGoal1 = false;
  this.endGoal2 = false;
  this.endGoal3 = false;
  this.scoreMultiplier = 1;
  this.scoreIncrement = 100;
  this.width = 64;
  this.height = 64;
  this.innerScoreText = 'Score: ';
}

Core.prototype.update = function(time, player) {
  switch(player.state){
    case "idle":
      this.state = "idle";
      this.lifeTaken = false;
    break;
    case "dead":
      this.state = "dead";
      if(!this.lifeTaken){
        this.lives--;
        this.lifeTaken = true;
      }
    break;
    case "levelUp":
      this.state = "levelUp";
      if(player.goal1 == true && this.endGoal1 == false){
        this.endGoal1 = true;
        this.score += this.scoreIncrement * this.scoreMultiplier;
        this.scoreMultiplier++;
        this.gameLevel++;
      }
      if(player.goal2 == true && this.endGoal2 == false){
        this.endGoal2 = true;
        this.score += this.scoreIncrement * this.scoreMultiplier;
        this.scoreMultiplier++;
        this.gameLevel++;
      }
      if(player.goal3 == true && this.endGoal3 == false){
        this.endGoal3 = true;
        this.score += this.scoreIncrement * this.scoreMultiplier;
        this.scoreMultiplier++;
        this.gameLevel++;
      }
      if(this.endGoal1 && this.endGoal2 && this.endGoal3){
        this.state = "win";
      }
    break;
  }
  switch(this.state){
    case "idle":
    break;
    case "dead":
    break;
    case "win":
    break;

  }
}
Core.prototype.render = function(time, ctx) {
  for(var i = 0; i < this.lives; i++){
    ctx.drawImage(
      //image
      this.heartImage,
      //destination rectangle
      i*64 + 64, 0, this.width, this.height
    );
  }
  ctx.font = "35px Georgia"
  ctx.fillText(this.innerScoreText, 420, 40);
  ctx.fillText(this.score, 530, 40);
}

},{}],3:[function(require,module,exports){
module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize) {
  this.cellSize = cellSize;
  this.widthInCells = Math.ceil(width / cellSize);
  this.heightInCells = Math.ceil(height / cellSize);
  this.cells = [];
  this.numberOfCells = this.widthInCells * this.heightInCells;
  for(var i = 0; i < this.numberOfCells; i++) {
    this.cells[i] = [];
  }
  this.cells[-1] = [];
}

function getIndex(x, y) {
  var x = Math.floor(x / this.cellSize);
  var y = Math.floor(y / this.cellSize);
  if(x < 0 ||
     x >= this.widthInCells ||
     y < 0 ||
     y >= this.heightInCells
  ) return -1;
  return y * this.widthInCells + x;
}

EntityManager.prototype.addEntity = function(entity){
  var index = getIndex.call(this, entity.x, entity.y);
  this.cells[index].push(entity);
  entity._cell = index;
}

EntityManager.prototype.updateEntity = function(entity){
  var index = getIndex.call(this, entity.x, entity.y);
  // If we moved to a new cell, remove from old and add to new
  if(index != entity._cell) {
    var cellIndex = this.cells[entity._cell].indexOf(entity);
    if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
    this.cells[index].push(entity);
    entity._cell = index;
  }
}

EntityManager.prototype.removeEntity = function(entity) {
  var cellIndex = this.cells[entity._cell].indexOf(entity);
  if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
  entity._cell = undefined;
}

EntityManager.prototype.collide = function(callback) {
  var self = this;
  this.cells.forEach(function(cell, i) {
    // test for collisions
    cell.forEach(function(entity1) {
      // check for collisions with cellmates
      cell.forEach(function(entity2) {
        if(entity1 != entity2) checkForCollision(entity1, entity2, callback);

        // check for collisions in cell to the right
        if(i % (self.widthInCells - 1) != 0) {
          self.cells[i+1].forEach(function(entity2) {
            checkForCollision(entity1, entity2, callback);
          });
        }

        // check for collisions in cell below
        if(i < self.numberOfCells - self.widthInCells) {
          self.cells[i+self.widthInCells].forEach(function(entity2){
            checkForCollision(entity1, entity2, callback);
          });
        }

        // check for collisions diagionally below and right
        if(i < self.numberOfCells - self.withInCells && i % (self.widthInCells - 1) != 0) {
          self.cells[i+self.widthInCells + 1].forEach(function(entity2){
            checkForCollision(entity1, entity2, callback);
          });
        }
      });
    });
  });
}

function checkForCollision(entity1, entity2, callback) {
  var collides = !(entity1.x + entity1.width < entity2.x ||
                   entity1.x > entity2.x + entity2.width ||
                   entity1.y + entity1.height < entity2.y ||
                   entity1.y > entity2.y + entity2.height);
  if(collides) {
    callback(entity1, entity2);
  }
}

EntityManager.prototype.renderCells = function(ctx) {
  for(var x = 0; x < this.widthInCells; x++) {
    for(var y = 0; y < this.heightInCells; y++) {
      ctx.strokeStyle = '#333333';
      ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
  }
}

},{}],4:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the SlowCar class
 */
module.exports = exports = FastCar;

/**
 * @constructor FastCar
 * Creates a new fastcar object
 * @param {Postition} position object specifying an x and y
 */
function FastCar(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 60;
  this.height = 120;
  this.image  = new Image();
  this.image.src = encodeURI('assets/racer.png');
  this.rate = 1.5;
  this.level = 1;

  var self = this;
}

/**
 * @function updates the fastcar object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
FastCar.prototype.update = function(time, core) {
  this.level = core.gameLevel;
  this.y -= this.rate * this.level;
  if(this.y < -128) this.y = 480;
}

/**
 * @function renders the fastcar into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
FastCar.prototype.render = function(time, ctx) {
  ctx.drawImage(
    // image
    this.image,
    // destination rectangle
    this.x, this.y, this.width, this.height
  );
}

},{}],5:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],6:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Log class
 */
module.exports = exports = Log;

/**
 * @constructor Log
 * Creates a new log object
 * @param {Postition} position object specifying an x and y
 */
function Log(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 66;
  this.height = 132;
  this.image  = new Image();
  this.image.src = encodeURI('assets/largelog.png');
  this.rate = 0.75;
  this.level = 1;

  var self = this;
}

/**
 * @function updates the log object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Log.prototype.update = function(time, core) {
  this.y -= this.rate * this.level;
  if(this.y < -128) this.y = 480;
  this.level = core.gameLevel;
}

/**
 * @function renders the log into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Log.prototype.render = function(time, ctx) {
  ctx.drawImage(
    // image
    this.image,
    // destination rectangle
    this.x, this.y, this.width, this.height
  );
}

},{}],7:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.hopIncrement = 22;
  this.startY = 264;
  this.spritesheet  = new Image();
  this.spritesheetLeft  = new Image();
  this.deadImage = new Image();
  this.deadImage.src = encodeURI('assets/dead.png');
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.spritesheetLeft.src = encodeURI('assets/PlayerSprite2Left.png');
  this.timer = 0;
  this.frame = 0;
  this.goal1 = false;
  this.goal2 = false;
  this.goal3 = false;

  var self = this;
  window.onkeydown = function(event) {
    switch(event.keyCode){

        //up
        case 87:
        case 38:
          if(self.state == "idle"){
            self.state = "movingUp";
            self.timer = 0;
            self.frame = 0;
          }
    			break;
    		//down
    		case 83:
        case 40:
          if(self.state == "idle"){
            self.state = "movingDown";
            self.timer = 0;
            self.frame = 0;
          }
    			break;
    		//left
    		case 65:
        case 37:
          if(self.state == "idle"){
            self.state = "movingLeft";
            self.timer = 0;
            self.frame = 3;
          }
    			break;
    		//right
    		case 68:
        case 39:
          if(self.state == "idle"){
            self.state = "movingRight";
            self.timer = 0;
            self.frame = 0;
          }
    			break;
    }
  }
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time, core) {
  this.checkLocation();
  console.log(this.x, this.y);
  switch(this.state) {
    case "dead":
      this.timer += time;
      if(this.timer > 2000) {
        this.timer = 0;
        this.frame = 0;
        this.x = 0;
        this.y = this.startY;
        this.state = "idle";
      }
      break;
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
    break;
    case "movingRight":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3){
          this.frame = 0;
          this.timer = 0;
          this.state = "idle";
        }
        else{
            this.x += this.hopIncrement;
        }
      }
    break;
    case "movingLeft":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame -= 1;
        if(this.frame < 0){
          this.frame = 0;
          this.timer = 0;
          this.state = "idle";
        }
        else{
            this.x -= this.hopIncrement;
        }
      }
    break;
    case "movingUp":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3){
          this.frame = 0;
          this.timer = 0;
          this.state = "idle";
        }
        else{
            this.y -= this.hopIncrement;
        }
      }
    break;
    case "movingDown":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3){
          this.frame = 0;
          this.timer = 0;
          this.state = "idle";
        }
        else{
            this.y += this.hopIncrement;
        }
      }
    break;
    case "levelUp":
      this.timer += time;
      if(this.timer > 2000) {
        this.timer = 0;
        this.frame = 0;
        this.x = 0;
        this.y = this.startY;
        this.state = "idle";
      }
    break;
    // TODO: Implement your player's update by state
  }

}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      ctx.strokeStyle = this.color;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      break;
    case "movingRight":
    case "movingUp":
    case "movingDown":
      ctx.drawImage(
        //image
        this.spritesheet,
        //source rectangle,
        this.frame * 64, 0, this.width, this.height,
        //destination rectangle
        this.x, this.y, this.width, this.height
      );
      ctx.strokeStyle = this.color;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      break;
    case "movingLeft":
      ctx.drawImage(
        //image
        this.spritesheetLeft,
        //source rectangle,
        this.frame * 64, 0, this.width, this.height,
        //destination rectangle
        this.x, this.y, this.width, this.height
      );
      ctx.strokeStyle = this.color;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      break;
    case "dead":
      ctx.drawImage(
        //image
        this.deadImage,
        //destination rectangle
        this.x, this.y, this.width, this.height
      );
      ctx.strokeStyle = this.color;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    break;
    case "levelUp":
      ctx.drawImage(
        //image
        this.deadImage,
        //destination rectangle
        this.x, this.y, this.width, this.height
      );
      ctx.strokeStyle = this.color;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    break;
    // TODO: Implement your player's redering according to state
  }
}

Player.prototype.checkLocation = function(){
  if(this.y > 320 && this.y < 396 && this.x > 523 && this.x < 594 && !this.goal3){
    this.goal3 = true;
    this.state = "levelUp";
  }
  if(this.y > 170 && this.y < 210 && this.x > 523 && this.x < 594 && !this.goal2){
    this.goal2 = true;
    this.state = "levelUp";
  }
  if(this.y > 50 && this.y < 90 && this.x > 523 && this.x < 594 && !this.goal1){
    this.goal1 = true;
    this.state = "levelUp";
  }
}

},{}],8:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the SlowCar class
 */
module.exports = exports = SlowCar;

/**
 * @constructor SlowCar
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function SlowCar(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 60;
  this.height = 100;
  this.image  = new Image();
  this.image.src = encodeURI('assets/testcar.png');
  this.rate = 0.5;
  this.level = 1;

  var self = this;
}

/**
 * @function updates the slowcar object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
SlowCar.prototype.update = function(time, core) {
  this.level = core.gameLevel;
  this.y -= this.rate * this.level;
  if(this.y < -128) this.y = 480;
}

/**
 * @function renders the slowcar into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
SlowCar.prototype.render = function(time, ctx) {
  ctx.drawImage(
    // image
    this.image,
    // destination rectangle
    this.x, this.y, this.width, this.height
  );
}

},{}],9:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Truck class
 */
module.exports = exports = Truck;

/**
 * @constructor Truck
 * Creates a new truck object
 * @param {Postition} position object specifying an x and y
 */
function Truck(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 60;
  this.height = 137;
  this.image  = new Image();
  this.image.src = encodeURI('assets/pickup.png');
  this.rate = 0.75;
  this.level = 1;

  var self = this;
}

/**
 * @function updates the truck object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Truck.prototype.update = function(time, core) {
  this.y -= this.rate * this.level;
  if(this.y < -128) this.y = 480;
  this.level = core.gameLevel;
}

/**
 * @function renders the truck into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Truck.prototype.render = function(time, ctx) {
  ctx.drawImage(
    // image
    this.image,
    // destination rectangle
    this.x, this.y, this.width, this.height
  );
}

},{}],10:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Turtle class
 */
module.exports = exports = Turtle;

/**
 * @constructor Turtle
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Turtle(position) {
  this.state = "normal";
  this.x = position.x;
  this.y = position.y;
  this.width  = 60;
  this.height = 93;
  this.normalImage  = new Image();
  this.normalImage.src = encodeURI('assets/turtle.png');
  this.down1Image  = new Image();
  this.down1Image.src = encodeURI('assets/turtle2.png');
  this.down2Image  = new Image();
  this.down2Image.src = encodeURI('assets/turtle3.png');
  this.down3Image  = new Image();
  this.down3Image.src = encodeURI('assets/turtle4.png');
  this.rate = 0.75;
  this.level = 1;
  this.timer = 0;
  var self = this;
}

/**
 * @function updates the turtle object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Turtle.prototype.update = function(time, core) {
  this.level = core.gameLevel;
  this.y -= this.rate * this.level;
  if(this.y < -128){
    this.y = 480;
  }
  switch(this.state){
    case "normal":
      this.timer += time;
      if(this.timer > 2000) {
        this.timer = 0;
        this.state = "down1";
      }
    break;
    case "down1":
      this.timer += time;
      if(this.timer > 500) {
        this.timer = 0;
        this.state = "down2";
      }
    break;
    case "down2":
      this.timer += time;
      if(this.timer > 500) {
        this.timer = 0;
        this.state = "down3";
      }
    break;
    case "down3":
      this.timer += time;
      if(this.timer > 500) {
        this.timer = 0;
        this.state = "normal";
      }
    break;
  }
}

/**
 * @function renders the turtle into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Turtle.prototype.render = function(time, ctx) {
  switch(this.state){
    case "normal":
      ctx.drawImage(
        // image
        this.normalImage,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
    break;
    case "down1":
      ctx.drawImage(
        // image
        this.down1Image,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
    break;
    case "down2":
      ctx.drawImage(
        // image
        this.down2Image,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
    break;
    case "down3":
      ctx.drawImage(
        // image
        this.down3Image,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
    break;
  }
}

},{}]},{},[1]);
