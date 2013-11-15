/**
 * Created with JetBrains WebStorm.
 * User: alaay
 * Date: 11/9/13
 * Time: 5:09 PM
 * To change this template use File | Settings | File Templates.
 */
function Flag()
{
    // Public variables
    this.x;		// x-coordinate of Fkag's position
    this.y;		// y-coordinate of Flag's position
    this.playerOwner;    // Player who owns flag

    var randomSpawnPoint = randomSpawn();
    this.x = randomSpawnPoint.x;
    this.y = randomSpawnPoint.y;
    this.playerOwner = null;


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
    this.ownerDie = function (){
        this.playerOwner = null;
    }

    this.updatePosition = function(){
        this.x = this.playerOwner.character.x;
        this.y = this.playerOwner.character.y;
    }
    this.spawn = function(){
        var randomSpawnPoint = randomSpawn();
        this.x = randomSpawnPoint.x;
        this.y = randomSpawnPoint.y;
    }
}

global.Flag = Flag;