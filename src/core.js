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
