/**
 * New node file
 */
/**
 * Created by David on 10/20/13.
 */
"use strict";

function Character(xPos, yPos)
{
    // Public variables
    this.x;		// x-coordinate of Character's position
    this.y;		// y-coordinate of Character's position
    this.vX;    // x-velocity of the Character
    this.vY;    // y-velocity of the Character
    this.hitbox;
    var health;

    // Constructor
    var that = this; // Unused in Character for now.
    this.x = xPos;
    this.y = yPos;
    this.vX = 0; // scaling factor is 10
    this.vY = 0; // scaling factor is 3
    this.hitbox = new Hitbox(xPos,yPos);
    this.health = 100;

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
    this.getHealth = function()
    {
        return this.health;
    }

    /*****************************   PUBLIC METHODS   *****************************/
    this.checkGotHit = function(objPosX, objPosY){
        var isHit = this.hitbox.checkCollide(objPosX, objPosY);
        if (isHit){
            this.health -=20;
        }
        return isHit;
    }

    this.updatePosition = function(xPos, yPos, vX, vY){
        this.setX(xPos);
        this.setY(yPos);
        this.setVX(vX);
        this.setVY(vY);
        this.hitbox.update(xPos, yPos);
    }
}
global.Character = Character;
