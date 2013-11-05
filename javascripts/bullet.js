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

        this.parent(x, y, settings);

        this.name = "bullet";

        this.direction = direction;
        this.gravity = 0;
        this.passedDist = 0;

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
            this.vel.x = BulletEntity.SPEED;
        }
        else this.vel.x = -BulletEntity.SPPED;
    },
    //handles bullet going out of screen
    updatePassedDis: function(){
        this.passedDist += BulletEntity.SPEED;
        if (this.passedDist > BulletEntity.RANGE){
            me.game.remove(this);
        }
    },
    //handles bullet colliding with other entities
    handleCollision: function(){
        var collisionResult = me.game.collide(this);
        if (this.vel.x == 0 || (collisionResult && (collisionResult.obj.isSolid || collisionResult.obj.isDestroyable))){
            me.game.remove(this);
        }
        if (collisionResult && collisionResult.obj.isSolid){
            this.createExplosion();
        }
    },
    createExplosion: function(){
        var explosion = new BulletExplosion(this.pos.x, this.pos.y - 5);
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
game.BulletEntity.RANGE = 600;