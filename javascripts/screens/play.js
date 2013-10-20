/**
 * Think of "screens" as mapping to large game states such as
 * Play, Menu, and GameOver
 * User: alaay
 * Date: 10/18/13
 * Time: 6:52 PM
 */

// me => Melon Engine
//Loads simpleMap whenever entering state of being on this screen
game.PlayScreen = me.ScreenObject.extend({
    onResetEvent: function(){
        me.game.onLevelLoaded = this.onLevelLoaded.bind(this);
        me.levelDirector.loadLevel("simpleMap");

        // Helper function to return one of our remote players
        var playerById = function(id) {
            var i;

            for (i = 0; i < global.state.remotePlayers.length; i++) {
                if (global.state.remotePlayers[i].id == id)
                    return global.state.remotePlayers[i];
            };

            return false;
        };
    },
    onLevelLoaded : function (name) {
        console.log("[+] onLevelLoaded:");

        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.SPACE, "jump");

        // Fade out
        me.game.viewport.fadeOut("#000", 500);


        // Create our player and set them to be the local player (so we know who "we" are)
        global.state.localPlayer = new game.PlayerEntity(70, 910, {
            spritewidth: 70,
            spriteheight: 95,
            name: "player"
        });

        global.state.localPlayer.name = global.state.playername;
        global.state.localPlayer.id = global.state.playername;

        //me.game.entityPool.add("player", game.PlayerEntity);//global.state.localPlayer);
        me.game.add(global.state.localPlayer, 4);
        me.game.sort();
        try{
            // Connect to the game server
            this.socket = new SockJS("http://" + global.network.host + ":" + global.network.port + "/game");
            this.socket.onmessage = function(e){
                var message = JSON.parse(e.data);
                switch (message.type) {
                    case "message":

                        break;
                    case "update":
                        global.state.localPlayer.pos.p1X = message.p1X;
                        global.state.localPlayer.pos.p1Y = message.p1Y;
                    break;
                }

            }
        } catch (e){
            console.log("Failed to connect to " + "http://" + global.network.host + ":" + global.network.port);
            }
       /*
        // and set up our networking callbacks

        this.socket.on("connect", this.onSocketConnected);
        this.socket.on("new player", this.onNewPlayer);
        this.socket.on("move player", this.onMovePlayer);
        this.socket.on("remove player", this.onRemovePlayer);
        this.socket.on("error", this.handleError);
        this.socket.on("pong", this.updateLatency);
        */
    },

    // For error debugging
    handleError: function(error){
        console.log(error);
    },

    onDestroyEvent: function () {
        // Unbind keys
        me.input.unbindKey(me.input.KEY.LEFT);
        me.input.unbindKey(me.input.KEY.RIGHT);
        me.input.unbindKey(me.input.KEY.SPACE);
    },

    onSocketConnected: function() {
        console.log("Connected to socket server");
        // When we connect, tell the server we have a new player (us)
        socket.emit("new player", {x: global.state.localPlayer.pos.x, y: global.state.localPlayer.pos.y, vX:global.state.localPlayer.vel.x, vY: global.state.localPlayer.vel.y})

        // Set up ping / pongs for latency
        setInterval(function () {
            global.network.emitTime = +new Date;
            global.network.emits++;
            socket.emit('ping');
        }, 500);
    },

    updateLatency: function() {
        // Simply updates the average latency
        global.network.totlatency += +new Date - global.network.emitTime
        global.network.latency = Math.round(global.network.totlatency/global.network.emits);
        me.game.HUD.setItemValue("latency", global.network.latency);
    },

    onNewPlayer: function(data) {
        // When a new player connects, we create their object and add them to the screen.
        var newPlayer = new game.PlayerEntity(data.x, data.y, {
            spritewidth: 70,
            spriteheight: 95,
            name: "o"
        });
        newPlayer.id = data.id;
        newPlayer.name = data.name;

        global.state.remotePlayers.push(newPlayer);

        me.game.add(newPlayer, 3);
        me.game.sort(game.sort);

        // Update the HUD with the new number of players
        me.game.HUD.setItemValue("connected", (global.state.remotePlayers.length+1));
    },

    onRemovePlayer: function(data) {
        // When a player disconnects, we find them in our remote players array
        var removePlayer = playerById(data.id);

        if(!removePlayer) {
            console.log("Player not found "+data.id);
            return;
        };

        // and remove them from the screen
        me.game.remove(removePlayer);
        me.game.sort();
        global.state.remotePlayers.splice(global.state.remotePlayers.indexOf(removePlayer), 1);

        // and update the HUD
        me.game.HUD.setItemValue("connected", (global.state.remotePlayers.length+1));
    },

    onMovePlayer: function(data) {
        // When a player moves, we get that players object
        var playerToMove = playerById(data.id);

        // if it isn't us, or we can't find it (bad!)
        if(!playerToMove) {
            return;
        }

        // update the players position locally
        playerToMove.pos.x = data.x;
        playerToMove.pos.y = data.y;
        playerToMove.vel.x = data.vX;
        playerToMove.vel.y = data.vY;
    }
});
