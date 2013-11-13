/**
 * Created with JetBrains WebStorm.
 * User: alaay
 * Date: 11/5/13
 * Time: 11:40 PM
 * To change this template use File | Settings | File Templates.
 */
function Hitbox(xPos, yPos, w, h){

    // Public variables
    this.x;		// x-coordinate of TOP LEFT CORNER Hitbox
    this.y;		// y-coordinate of TOP LEFT CORNER Hitbox

    // Private varibles //Characer w,h = 70,95 ReturnPoint = 70,70
    var width = w;
    var height = h;
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

   /*****************************   PUBLIC METHODS   *****************************/

   //checks if the position of a bullet falls inbetween
   //the x-range and y-range of the hitbox
    this.checkCollide = function(objPosX, objPosY){
        console.log("HitBox Pos: " + objPosX + " , " + objPosY);
        console.log("x,y : " + this.x + ", "+ this.y);
        console.log("x - range : " + this.getXrange()[0] + " , " + this.getXrange()[1]);
        console.log("y - range : " + this.getYrange()[0] + " , " + this.getYrange()[1]);
        if ( this.getXrange()[0] <= objPosX && objPosX <= this.getXrange()[1] &&
             this.getYrange()[0] <= objPosY && objPosY <= this.getYrange()[1]){
            console.log("bullet Pos: " + objPosX + " , " + objPosY);
            console.log("x - range : " + this.getXrange()[0] + " , " + this.getXrange()[1]);
            console.log("y - range : " + this.getYrange()[0] + " , " + this.getYrange()[1]);
            return true;
        }
        else return false;
    }
    //updates position of hitBox based on top left corner coordinate
    this.update = function(xPos, yPos){
        this.x = xPos;
        this.y = yPos;
        xRange = [xPos , xPos + width ];
        yRange = [yPos , yPos + height];
    }
}

global.Hitbox = Hitbox;