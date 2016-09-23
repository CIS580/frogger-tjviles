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
