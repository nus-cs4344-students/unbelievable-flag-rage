/**
 * Created with JetBrains WebStorm.
 * User: alaay
 * Date: 11/13/13
 * Time: 5:48 AM
 * To change this template use File | Settings | File Templates.
 */
function ReturnPoint()
{
    // Public variables
    this.x;		// x-coordinate of ReturnPoint's position
    this.y;		// y-coordinate of ReturnPoint's position

    var randomSpawnPoint = randomSpawn();
    this.x = randomSpawnPoint.x;
    this.y = randomSpawnPoint.y;
    this.hitbox = new Hitbox(this.x, this.y, 140, 140);

    // Private Methods
    function randomFromInterval(from,to){
        return Math.floor(Math.random()*(to-from+1)+from);
    }

    function randomSpawn(){
        var yRange1 = 70*7;
        var yRange2 = 70*9;
        var xRange1 = 300;
        var xRange2 = Game.WIDTH - 300;

        var randomX = randomFromInterval(xRange1,xRange2);
        var randomY = randomFromInterval(yRange1,yRange2);
        return {x: randomX, y :randomY};
    }

    // Public Methods
    this.checkGotReturn = function(objPosX, objPosY){
        var isHit = this.hitbox.checkCollide(objPosX, objPosY);

        return isHit;
    }
    this.spawn = function(flag){

        //while returnPoint is 70 units in range of x
        //find another position
        //flag.x +140 due to flag.x being top left hand corner (70 units from the right hand corner)
        var randomSpawnPoint = randomSpawn();
        this.x = randomSpawnPoint.x;
        this.y = randomSpawnPoint.y;


        while ( flag.x - 70 <= this.x && this.x <= flag.x + 140 /*&& //dont use y
                flag.y - 70 <= this.y <= flag.y + 140*/){
            var randomSpawnPoint = randomSpawn();
            this.x = randomSpawnPoint.x;
            this.y = randomSpawnPoint.y;
        }

        this.hitbox.update(this.x, this.y);
    }
}

global.ReturnPoint = ReturnPoint;