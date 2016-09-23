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
