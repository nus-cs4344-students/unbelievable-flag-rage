/**
 * Created with JetBrains WebStorm.
 * User: alaay
 * Date: 11/5/13
 * Time: 7:12 PM
 * To change this template use File | Settings | File Templates.
 */


game.BulletEntity = me.ObjectEntity.extend({

    init: function(x, y, direction){
        var settings = {};
        settings.image = "bullet";

        if (direction == "right"){
            this.parent(x + game.BulletEntity.OFFSET, y + game.BulletEntity.OFFSET, settings);
        }
        else if (direction == "left"){
            this.parent(x - game.BulletEntity.OFFSET, y + game.BulletEntity.OFFSET, settings);
        }

        this.name = "bullet";

        this.direction = direction;
        this.gravity = 0;
        this.passedDist = 0;

        this.alwaysUpdate = true;
        this.configureVelocity();
    },
    update : function(){
        this.updateMovement();
        this.updatePassedDist();
        this.handleCollisions();
        return true;
    },
    configureVelocity: function(){
        if (this.direction == "right"){
            this.vel.x = game.BulletEntity.SPEED;
        }
        else this.vel.x = -game.BulletEntity.SPEED;
    },
    //handles bullet going out of screen
    updatePassedDist: function(){
        this.passedDist += game.BulletEntity.SPEED;
        if (this.passedDist > game.BulletEntity.RANGE){
            me.game.remove(this);
        }
    },
    //handles bullet colliding with other entities
    handleCollisions: function(){
        var collisionResult = me.game.collide(this);
        if (this.vel.x == 0 || (collisionResult && (collisionResult.obj.isSolid || collisionResult.obj.isDestroyable))){
            me.game.remove(this);
        }
        if (collisionResult && collisionResult.obj.isSolid){
            this.createExplosion();
        }
    },
    createExplosion: function(){
        var explosion = new game.BulletExplosion(this.pos.x, this.pos.y - 5);
        me.game.add(explosion, this.z);
        me.game.sort.defer(); //as soon as stack idle, do sort.
        //TODO: me.audio.play("explosionSound")
    },
    onDestroyEvent: function(){
        global.aliveBulletCount--;
    }
});

game.BulletEntity.SPEED = 15;
game.BulletEntity.WIDTH = 20;
game.BulletEntity.OFFSET = 20;
game.BulletEntity.RANGE = 800;