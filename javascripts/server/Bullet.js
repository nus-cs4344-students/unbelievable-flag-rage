/**
 * Created with JetBrains WebStorm.
 * User: alaay
 * Date: 11/5/13
 * Time: 9:17 PM
 * To change this template use File | Settings | File Templates.
 */
"use strict";

function Bullet(xPos, yPos, vX)
{
    // Public variables
    this.x;		// x-coordinate of Bullet's position
    this.y;		// y-coordinate of Bullet's position
    this.passedDist;    // x-velocity of the Bullet
    this.vX;    // y-velocity of the Bullet
    this.vY;

    // Private variables
    var lastUpdate;
    var range;
    var isInvalid;

    // Constructor
    var getTimestamp = function() { return new Date().getTime(); };
    var that = this; // Unused in Bullet for now.
    this.x = xPos;
    this.y = yPos;
    this.vX = vX; // scaling factor is 10
    this.vY = 0; // scaling factor is 3
    this.passedDist = 0;
    range = 800;
    isInvalid = false;
    lastUpdate = getTimestamp();
    /*****************************   SET METHODS   *****************************/
    this.setX = function(newX)
    {
        this.x = newX;
    }
    this.setY = function(newY)
    {
        this.y = newY;
    }
    this.setVX = function(newVX)
    {
        this.vX = newVX;
    }
    this.setVY = function(newVY)
    {
        this.vY = newVY;
    }

    /*****************************   GET METHODS   *****************************/
    this.getX = function()
    {
        return this.x;
    }

    this.getY = function()
    {
        return this.y;
    }
    this.getVX = function()
    {
        return this.vX;
    }
    this.getVY = function()
    {
        return this.vY;
    }
    this.getInvalid = function()
    {
        return isInvalid;
    }
    /*************************** UPDATE STATE METHODS **************************/

    this.moveOneStep = function(players) {
        var now = getTimestamp(); // get the current time in millisecond resolution

        //Delay compensation
        //var delayCompensation = (1000 - delay)/1000;

        // Update position
        var moveX =  vX*(now - lastUpdate)*Game.FRAME_RATE/1000;
        var moveDist = 0;
        if (moveX < 0){
            moveDist = moveX * -1;
        }
        this.passedDist += moveDist;

        //check if bullet is valid
        if (this.passedDist < range && !isInvalid){
            that.x += moveX;

            lastUpdate = now;

            for (var connId in players){
                var player = players[connId];
                console.log("bullet checking player hit: " + player.pid);
                console.log("bullet x: " + this.x + " y: " + this.y);
                var isHit = player.character.checkGotHit(this.x, this.y);
                if (isHit){
                    console.log("bullet reports it hit! ++++++++++++++++++++++++++++ playerID: " + player.pid);
                    isInvalid = true;
                    return player.pid;
                }
            }
            return null;
        }
        else {
            isInvalid = true;
            return null;
        }
    }
}
global.Bullet = Bullet;