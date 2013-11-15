/**
 * Created with JetBrains WebStorm.
 * User: alaay
 * Date: 10/18/13
 * Time: 8:40 PM
 */

game.PlayerEntity = me.ObjectEntity.extend({

    /* constructor */
    init: function(x,y, settings){

        //call constructor
        this.parent(x,y, settings);

        /* Player Properties */
        this.alwaysUpdate = true;
        this.step = 0;
        this.stepShoot = 0;
        this.stepAmmo = 0;
        this.isSolid = true;
        this.collidable = true;
        this.health = 100;
        this.canShoot = true;
        this.ammo = 3;
        this.direction = "right";
        this.hasFlag = false;
        //this.autoSort = false;

        //set default horizontal & vertical speed (accel vector)
        this.setVelocity(5,11);
        this.vel.x = 0;
        this.vel.y = 0;
        this.jump = false;

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
        this.renderable.addAnimation ("walk",  [0, 1, 2, 3,4,5,6,7,8,9,10],3);
        //" p1_walk04.png"]);/*, "p1_walk05.png", "p1_walk06.png",
        //"p1_walk07.png", "p1_walk08.png", "p1_walk09.png"]);
        //"p1_walk10.png", "p1_walk11.png"]);*/
        this.renderable.addAnimation("shoot", [1],2);

        // set as default
        this.renderable.setCurrentAnimation("walk");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 1.0);

    },

    update: function(){

        if (this.name === global.state.playername){
            if (this.checkAlive()){
                this.updateCanShoot();
                this.refillAmmo();

                if (me.input.isKeyPressed('left') || me.sys.accel < 90 ){
                    //flip sprite on horizontal axis
                    this.flipX(true);
                    this.direction = "left";
                    //update entity velocity
                    this.vel.x -= this.accel.x *(me.timer.tick);


                }
                else if (me.input.isKeyPressed('right') || me.sys.orientation >90 ){
                    //unflip sprite
                    this.flipX(false);
                    this.direction = "right";
                    //update entity velocity
                    this.vel.x += this.accel.x *(me.timer.tick);

                }
                else {
                    this.vel.x = 0;
                }
                if (me.input.isKeyPressed('jump')){
                    this.jump = true;
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
                    //game.playScreen.gameStart = true;
                    console.log("send server START");

                }

                if (me.input.isKeyPressed('shoot')){
                    if (this.canShoot){
                        console.log("+++++++++++ player shot " + this.direction);
                        this.renderable.setCurrentAnimation("shoot");
                        this.renderable.setCurrentAnimation("walk");
                        this.canShoot = false;
                        this.ammo--;
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

                    }
                } // if (keyPressed('shoot'))

                if (me.input.isKeyPressed('drop')){
                    if (this.hasFlag){
                        this.hasFlag = false;
                        global.state.flag.visible = true;
                        setTimeout(function() {global.state.flag.collidable = true;}, 100);
                    }
                }
                this.checkCollision();
            } //if(this.checkAlive())
        } // if(this.name == globalPlayerName)

        //check and update player movement
        this.updateMovement();
        //this.checkCollision();

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0 ){//|| (this.renderable && this.renderable.isFlickering())) {

            if (this.vel.x !== 0) {
                this.flipX(this.vel.x < 0);
            }

            // update object animation
            this.parent();
        }
        // send local player state to server
        if (this.name == global.state.playername && game.playScreen.gameStart){
            //if (this.step == 0){

            this.sendToServer({
                type: "update",
                x: global.state.localPlayer.pos.x,
                y: global.state.localPlayer.pos.y,
                vX: global.state.localPlayer.vel.x,
                vY: global.state.localPlayer.vel.y,
//                jump:global.state.localPlayer.jump,
//                air:global.state.localPlayer.jumping || global.state.localPlayer.falling

            });
            if(global.state.localPlayer.jump == true )
                global.state.localPlayer.jump = false;
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
    },
    updateCanShoot: function(){
        this.stepShoot++;
        if (this.stepShoot == game.PlayerEntity.SHOOT_DELAY){
            this.stepShoot = 0;
            this.canShoot = true;
        }
    },
    refillAmmo: function(){
        this.stepAmmo++;
        if (this.stepAmmo == game.PlayerEntity.REFILL_AMMO_DELAY){
            this.stepAmmo = 0;
            this.ammo++;
        }
    },
    // called by Flag CollectableEntity onCollision
    checkCollision: function(){
        var res = me.game.collide(this);
        if (res){
            switch (res.obj.name){
                //case me.game.COLLECTABLE_OBJECT: {
                case "flag":{

                    if (this.hasFlag == false){
                        this.sendToServer({
                            type: "pickUpFlag",
                            pid: this.pid,
                            x: this.pos.x,
                            y: this.pos.y,
                            timestamp: new Date().getTime()
                        });
                    }
                    console.log("player.js checkCollision(): player " + this.id + " send pickUpFlag msg");
                    break;
                }
                case "bullet":{
                    console.log("player detect got hit!");
                    this.health -= 20;
                    if (!this.flickering){
                        this.renderable.flicker(60);
                    }
                    //server updates need to be stored
                    //add checking with server updates for dead reckoning.
                    break;
                }
                // send position of returning flag for server to check
                case "returnPoint":{
                    console.log("player.js checkCollision(): player " + this.id + " returned flag!");
                    this.sendToServer({
                        type: "returnFlag",
                        x: this.pos.x,
                        y: this.pos.y,
                        timestamp: new Date().getTime()
                    })
                }
            }
        }
    }, // checkCollision: function()
    checkAlive: function(){
        var isAlive = true;
        if (this.health <= 0){
            isAlive = false;

        }
        return isAlive;
    }


});

game.PlayerEntity.SHOOT_DELAY = 50;
game.PlayerEntity.REFILL_AMMO_DELAY = 100;

var sendToServer = function(msg){
    game.playScreen.socket.send(JSON.stringify(msg));
}