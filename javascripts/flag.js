/**
 * Created with JetBrains WebStorm.
 * User: alaay
 * Date: 11/9/13
 * Time: 4:43 PM
 * To change this template use File | Settings | File Templates.
 */
game.FlagEntity = me.CollectableEntity.extend({

    /* constructor */
    init: function(x,y, settings){
        var settings = {};
        settings.image = "flag";
        settings.spritewidth = 70;


        //call constructor
       this.parent(x,y, settings);
       this.playerOwn = null;
       this.name = "flag"
       this.visible = true;
        this.type = me.game.COLLECTABLE_OBJECT;

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
            console.log("player " + global.state.localPlayer.id + "FLAG CARRIER");
            this.playerOwn = player;
            this.visible = false;
            this.pickable = false;

        }
    },
    ownerDie: function(){
        this.collidable = true;
        this.visible = true;
    },

    updatePosition: function(){
        if (this.playerOwn){ //has a valid player owner
            this.pos.x = this.playerOwn.pos.x;
            this.pos.y = this.playerOwn.pos.y;
        }
    },
    update: function(){
        if (!this.collidable){ //someone picked up already, update its position
            this.updatePosition();
            this.parent();
        }
    },
    onCollision: function(res,obj){
       // if (res.y > 0 && obj.falling)
        this.collidable = false;
        this.visible = false;
        console.log("flag collided");
        if (obj.name == global.state.localPlayer.id){
            this.playerOwn = obj;
        }
    }
});
