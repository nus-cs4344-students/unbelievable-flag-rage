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
       this.playerOwner = null;
       this.visible = true;
       this.name = "flag"
       this.collidable = true;
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
            this.playerOwner = player;
            this.collidable = false;
    },
    ownerDie: function(){
        this.visible = true;
        setTimeout(function() { this.collidable = true; console.log("flag.js: collidable = true")}, 100);
        this.   playerOwner = null;
    },

    updatePosition: function(){
        if (this.playerOwner){ //has a valid player owner
            this.pos.x = this.playerOwner.pos.x;
            this.pos.y = this.playerOwner.pos.y;
        }
    },
    update: function(){
        if (!this.collidable){ //someone picked up already, update its position
            this.updatePosition();
            this.parent();
        }
        return true;
    },
    onCollision: function(res,obj){
        console.log("flag.js: onCollision" + obj.id);
       // if (res.y > 0 && obj.falling)
        this.collidable = false;
        //this.visible = false;
        console.log("flag collided");
        if (obj.name == global.state.localPlayer.id){
            this.playerOwner = obj;
        }
    }
});
