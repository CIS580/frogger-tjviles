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
