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
