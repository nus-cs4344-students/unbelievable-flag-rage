/**
 * Created with JetBrains WebStorm.
 * User: alaay
 * Date: 10/18/13
 * Time: 8:40 PM
 */

game.PlayerEntity = me.ObjectEntity.extend({

    /* constructor */
    init: function(x,y, settings){
        /* Player Properties */
        this.isMultiplayer = true;
        this.step = 1;
        //call constructor
        this.parent(x,y, settings);

        //set default horizontal & vertical speed (accel vector)
        this.setVelocity(8,22);

        // adjust bonding box for collision
        //this.updateColRect(-1, 0, 10, 11);

        //set display to follow out position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        //set position
        //this.pos.x = 1222;
        //this.pos.y = 955;

        // set a renderable
        this.renderable = game.player1Texture.createAnimationFromName([
            "p1_walk01.png", "p1_walk02.png", "p1_walk03.png",
            "p1_walk04.png", "p1_walk05.png", "p1_walk06.png",
            "p1_walk07.png", "p1_walk08.png", "p1_walk09.png",
            "p1_walk10.png", "p1_walk11.png"
        ]);

        // define a basic walking animatin
        this.renderable.addAnimation ("walk",  ["p1_walk01.png", "p1_walk02.png", "p1_walk03.png"]);
        // set as default
        this.renderable.setCurrentAnimation("walk");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 1.0);

    },

    update: function(){



        if (this.name === global.state.playername){
            if (me.input.isKeyPressed('left')){
                //flip sprite on horizontal axis
                this.flipX(true);
                //update entity velocity
                this.vel.x -= this.accel.x * me.timer.tick;
            }
            else if (me.input.isKeyPressed('right')){
                //unflip sprite
                this.flipX(false);
                //update entitiy velocity
                this.vel.x += this.accel.x *me.timer.tick;
            }
            else {
                this.vel.x = 0;
            }


        if (me.input.isKeyPressed('jump')){
            //make sure we are not already jumping/falling
            if (!this.jumping && !this.falling){
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.vel.y = -this.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.jumping = true;
            }
        }//if (me.input.isKeyPressed('jump'))
    }
        //check and update player movement
        this.updateMovement();

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0 || (this.renderable && this.renderable.isFlickering())) {
            // update object animation
            this.parent();
            return true;
        }
        if (this.name === global.state.playername){
            //if (this.step == 0){
                sendToServer({
                     type: "update",
                     x: global.state.localPlayer.pos.x,
                     y: global.state.localPlayer.pos.y
                });
                console.log("send to server type update");
            //}
        }
        //this.step++;
        //if (this.step > ){
        //    this.step = 0;
        //}

        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    },
    sendToServer : function (msg){
        /*  usage example
         msg = { type: "update", x: player.pos.x, y: player.pos.y};
         sendToServer(msg);
         */
        game.playScreen.socket.send(JSON.stringify(msg));
    }
});

var sendToServer = function(msg){
    console.log("msg: " + msg);
    game.playScreen.socket.send(JSON.stringify(msg));
}