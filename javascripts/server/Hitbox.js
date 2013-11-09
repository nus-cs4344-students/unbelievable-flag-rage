/**
 * Created with JetBrains WebStorm.
 * User: alaay
 * Date: 11/5/13
 * Time: 11:40 PM
 * To change this template use File | Settings | File Templates.
 */
function Hitbox(xPos, yPos){

    // Public variables
    this.x;		// x-coordinate of TOP LEFT CORNER Hitbox
    this.y;		// y-coordinate of TOP LEFT CORNER Hitbox

    // Private varibles
    var width = 70;
    var height = 95;
    var xRange;
    var yRange;

    this.x = xPos;
    this.y = yPos;
    xRange = [xPos, this.x + width];
    yRange =  [yPos, this.y + height];

    /*****************************   SET METHODS   *****************************/
    this.setX = function(newX)
    {
        this.x = newX;
    }
    this.setY = function(newY)
    {
        this.y = newY;
    }
    /*
    this.setVX = function(newVX)
    {
        this.vX = newVX;
    }
    this.setVY = function(newVY)
    {
        this.vY = newVY;
    }
    */
    /*****************************   GET METHODS   *****************************/
    this.getX = function()
    {
        return this.x;
    }

    this.getY = function()
    {
        return this.y;
    }
    this.getXrange = function()
    {
        return xRange;
    }
    this.getYrange = function()
    {
        return yRange;
    }
    /*
    this.getVX = function()
    {
        return this.vX;
    }
    this.getVY = function()
    {
        return this.vY;
    }
    */
   /*****************************   PUBLIC METHODS   *****************************/

    this.checkCollide = function(objPosX, objPosY){

        if ( this.getXrange()[0] <= objPosX && objPosX <= this.getXrange()[1] &&
             this.getYrange()[0] <= objPosY && objPosY <= this.getYrange()[1]){
            console.log("bullet Pos: " + objPosX + " , " + objPosY);
            console.log("x - range : " + this.getXrange()[0] + " , " + this.getXrange()[1]);
            console.log("y - range : " + this.getYrange()[0] + " , " + this.getYrange()[1]);
            return true;
        }
        else return false;
    }
    this.update = function(xPos, yPos){
        xRange = [xPos , xPos + width ];
        yRange = [yPos , yPos + height];
    }
}

global.Hitbox = Hitbox;