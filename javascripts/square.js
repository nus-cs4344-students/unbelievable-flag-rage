/**
 * Created by David on 11/14/13.
 */
game.square = me.Renderable.extend({
    init:function (x, y) {
        // call the constructor
        this.parent(new me.Vector2d(x, y) , 100, 100);

        this.canShoot = true;

        // selected flag
        this.selected = false;

        // to memorize where we grab the square
        this.grabOffset = new me.Vector2d(0,0);

        // white : unselected
        // red : selected
        this.color = "white";

        // store the id of the corresponding
        // touch event (when selected)
        this.pointerId = null;

        //set default horizontal & vertical speed (accel vector)
        this.setVelocity(3,22);
        this.vel.x = 0;
        this.vel.y = 0;

        // register required events
        this.moveCallback = this.onMoveEvent.bind(this);
        me.event.subscribe("mousemove", this.moveCallback);
        me.input.registerPointerEvent('mousedown', this, this.onShootEvent.bind(this));
        me.input.registerPointerEvent('mouseup', this, this.onJumpEvent.bind(this));

    },

    /**
     * callback for move event
     */
    onMoveEvent : function(e) {
        if (this.selected === true) {
            if (this.pointerId === e.pointerId) {
                // follow the mouse/finger
                this.pos.set(e.gameX, e.gameY);
                this.pos.sub(this.grabOffset);
            }
        }
    },

    /**
     * callback for event click
     */
    onShootEvent : function(e) {
        if (this.canShoot){
            console.log("+++++++++++ player shot " + this.direction);
            this.renderable.setCurrentAnimation("shoot");
            this.renderable.setCurrentAnimation("walk");
            this.canShoot = false;
            var isOpponent = false;
            var bullet = new game.BulletEntity(this.pos.x, this.pos.y, this.direction, false);
            me.game.add(bullet,2);
            me.game.sort();
            global.aliveBulletCount++;

            this.sendToServer({
                type: "playerShoot",
                bulletX: bullet.pos.x,
                bulletY: bullet.pos.y,
                bulletVX: bullet.vel.x
            });
            console.log("local player bullet: " + bullet.pos.x + bullet.pos.y) ;
            console.log("    player location: " + this.pos.x + this.pos.y);
            //me.audio.play("shoot");
        }
    },

    /**
     * callback for event click
     */
    onJumpEvent : function(e) {
//        if (!this.jumping && !this.falling){
//            // set current vel to the maximum defined value
//            // gravity will then do the rest
//            this.vel.y = -this.maxVel.y * me.timer.tick;
//            // set the jumping flag
//            this.jumping = true;
//        }
    },

    /**
     * update function
     */
    update : function () {
        return true;
    },

    /**
     * draw the square
     */
    draw : function (context) {
        context.fillStyle = this.color;
        context.fillRect (this.pos.x,this.pos.y,this.width,this.height);
    },

    /**
     * called when the object is destroyed
     */
    destroy : function() {
        // unregister events
        me.event.unsubscribe("mousemove", this.moveCallback);
        me.input.releasePointerEvent('mousedown', this);
        me.input.releasePointerEvent('mouseup', this);
    }
});