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
    function randomFromInterval(from,to){
        return Math.floor(Math.random()*(to-from+1)+from);
    }

    function randomSpawn(){
        var yRange1 = 70*7;
        var yRange2 = 70*9;
        var xRange = global.WIDTH;

        var randomX = randomFromInterval(1,xRange);
        var randomY = randomFromInterval(yRange1,yRange2);
        return {x: randomX, y :randomY};
    }
}

global.Flag = Flag;