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
