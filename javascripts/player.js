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
        this.alwaysUpdate = true;
        this.step = 0;
        //call constructor
        this.parent(x,y, settings);

        //set default horizontal & vertical speed (accel vector)
        this.setVelocity(10,22);
        this.vel.x = 0;
        this.vel.y = 0;

        // adjust bonding box for collision
        //this.updateColRect(-1, 0, 10, 11);

        //set display to follow out position on both axis only if local player
        if (settings.isLocal){
            me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        }
        //console.log("viewport follow" + this.id + this.name + ": (" + this.pos.x + ", " + this.pos.y + ")");
        //set position
        //this.pos.x = 1222;
        //this.pos.y = 955;
        //this.renderable.updateWhenPause = true;

        // set a renderable
        this.renderable = game.player1Texture.createAnimationFromName([
            "p1_walk01.png", "p1_walk02.png", "p1_walk03.png",
            "p1_walk04.png", "p1_walk05.png", "p1_walk06.png",
            "p1_walk07.png", "p1_walk08.png", "p1_walk09.png",
            "p1_walk10.png", "p1_walk11.png"
        ]);

        // define a basic walking animatin
        this.renderable.addAnimation ("walk",  ["p1_walk01.png", "p1_walk02.png", "p1_walk03.png"]);
                                                //" p1_walk04.png"]);/*, "p1_walk05.png", "p1_walk06.png",
                                                //"p1_walk07.png", "p1_walk08.png", "p1_walk09.png"]);
                                                //"p1_walk10.png", "p1_walk11.png"]);*/
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

            if (me.input.isKeyPressed('start')){
                sendToServer({type: "start"});
                game.playScreen.gameStart = true;
                console.log("send server START");
            }
        }

        //check and update player movement
        this.updateMovement();
        //var result = this.parent();

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0 ){//|| (this.renderable && this.renderable.isFlickering())) {

            if (this.vel.x !== 0) {
                this.flipX(this.vel.x < 0);
            }

            // update object animation
            var result = this.parent();

                    //console.log("send x: " + global.state.localPlayer.pos.x + " y: " + global.state.localPlayer.pos.y);
        }
        // send local player state to server
        if (this.name == global.state.playername && game.playScreen.gameStart){
            //if (this.step == 0){
                this.sendToServer({
                    type: "update",
                    x: global.state.localPlayer.pos.x,
                    y: global.state.localPlayer.pos.y,
                    vX: global.state.localPlayer.vel.x,
                    vY: global.state.localPlayer.vel.y
                });
            //} //if (this.step)..
            if (this.step++ > 3)
                this.step = 0;
        }

         // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return true;
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
    game.playScreen.socket.send(JSON.stringify(msg));
}