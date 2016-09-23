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
