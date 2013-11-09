/**
 * Created with JetBrains WebStorm.
 * User: alaay
 * Date: 11/9/13
 * Time: 4:43 PM
 * To change this template use File | Settings | File Templates.
 */
game.FlagEntity = me.ObjectEntity.extend({

    /* constructor */
    init: function(x,y, settings){
        var settings = {};
        settings.image = "flag";
        var randomSpawnPoint = this.randomSpawn();

        //call constructor
        this.parent(randomSpawnPoint.x,randomSpawnPoint.y, settings);
        this.playerOwn = null;
        this.pickable = true;
        this.name = "flag"
        this.visible = true;
    },
    randomFromInterval : function(from,to){
        return Math.floor(Math.random()*(to-from+1)+from);
    },
    randomSpawn: function(){
        var yRange1 = 70*7;
        var yRange2 = 70*9;
        var xRange = global.WIDTH;

        var randomX = this.randomFromInterval(1,xRange);
        var randomY = this.randomFromInterval(yRange1,yRange2);
        return {x: randomX, y :randomY};
    },
    getPickUp: function(player){
        if (this.pickable){
            this.playerOwn = player;
            this.visible = false;
        }
    },
    ownerDie: function(){
        this.pickable = true;
        this.visible = true;
    },

    updatePosition: function(){
        if (this.playerOwn){
            this.pos.x = this.playerOwn.pos.x;
            this.pos.y = this.playerOwn.pos.y;
        }
    },
    update: function(){
        this.updatePosition();
        this.visible = false;
        this.parent();
    }

})
