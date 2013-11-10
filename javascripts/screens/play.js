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

    },
    onNewPlayer: function(data, isLocal) {
        var newPlayerName = "";
        if (isLocal){
            newPlayerName = "player";
        }
        else {
            newPlayerName = "opponent";
        }

        // When a new player connects, we create their object and add them to the screen.
        var newPlayer = new game.PlayerEntity(data.x, data.y, {
            spritewidth: 70,
            spriteheight: 95,
            name: newPlayerName,
            isLocal: isLocal
        });
        newPlayer.id = data.playerID;
        newPlayer.name = data.playerID;

        if (isLocal){
            global.state.localPlayer = newPlayer;
            global.state.playername = newPlayer.id;
            console.log ("playername: " + global.state.playername);
            console.log ("localPlayer id:" + global.state.localPlayer.id + " name:" + global.state.localPlayer.name);
            me.game.add(global.state.localPlayer, 2);
            me.game.sort();
        }
        else {
            global.state.remotePlayers.push(newPlayer);
            console.log("remotePlayer id: " + newPlayer.id + " name: " + newPlayer.name);
            me.game.add(newPlayer, 2);
            me.game.sort();
        }


        // Update the HUD with the new number of players
        //me.game.HUD.setItemValue("connected", (global.state.remotePlayers.length+1));
    },
    onLevelLoaded : function (name) {
        console.log("[+] onLevelLoaded:");

        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.UP, "jump");
        me.input.bindKey(me.input.KEY.SPACE, "jump");
        me.input.bindKey(me.input.KEY.S, "start");
        me.input.bindKey(me.input.KEY.Q, "shoot");

        // Fade out
        me.game.viewport.fadeOut("#000", 500);

        /*
        // Create our player and set them to be the local player (so we know who "we" are)
        global.state.localPlayer = new game.PlayerEntity(70, 910, {
            spritewidth: 70,
            spriteheight: 95,
            name: "player"
        });
        */
        this.gameStart = true;

        // Start Connection to server
        try{
            this.socket = new SockJS("http://" + global.network.host + ":" + global.network.port + "/game");
            this.socket.onmessage = function(e){

                var message = JSON.parse(e.data);
                switch (message.type) {
                    case "message":

                        break;
                    case "update":
                        var updateArr = [];
                        updateArr.push(message.p1); // i = 0 (remotePlayer.id = i + 1)
                        updateArr.push(message.p2); // i = 1
                        //updateArr.push(message.p3); // i = 2
                        //updateArr.push(message.p4); // i = 3

                        for (var i = 0; i < updateArr.length; i ++){
                            var updateMsg = updateArr[i];
//                            if (global.state.localPlayer.id == (i + 1)  ){
//                                setPlayerPos(global.state.localPlayer, updateMsg);
//                            }
                            if(global.state.localPlayer.id != i + 1){
                                var remotePlayer = remotePlayerById(i + 1);
                                var remotePlayerUpdateMsg = updateArr[remotePlayer.id - 1];
                                if (remotePlayer == undefined || remotePlayerUpdateMsg == undefined){
                                    console.log("i: " + i);
                                }
                                setPlayerPos(remotePlayer, remotePlayerUpdateMsg);
                            }
                        }
                    break;

                    //get local player ID - 1,2,3,4 from server after connecting
                    case "myID":
                        console.log("received myID: " + message.playerID);
                        global.state.localPlayer.id = message.playerID;
                        global.state.playername = message.playerID;
                        global.state.localPlayer.name =  message.playerID;
                    break;

                    case "createLocalPlayer":

                        if (global.state.localPlayer == undefined){
                            var isLocal = true;
                            game.playScreen.onNewPlayer(message, isLocal);
                            console.log("Create local player: " + message.playerID);
                        }
                    break;

                    case "createRemotePlayer":
                        var remotePlayerID = message.playerID;
                        if (!remotePlayerById(remotePlayerID)){
                            var isLocal = false;
                            game.playScreen.onNewPlayer(message, isLocal);
                            console.log("Create remote player: " + remotePlayerID);
                        }
                    break;
                    case "playerShoot":
                        console.log("received playerShoot");
                        var direction = "";
                        if (message.bulletVX < 0){
                            direction = "left";
                        }
                        else direction = "right";
                        var isOpponent = true;
                        var opponentBullet = new game.BulletEntity(message.bulletX, message.bulletY, direction, isOpponent);
                        me.game.add(opponentBullet, 2);
                        me.game.sort();

                        break;
                    case "gotHit":
                        if (global.state.localPlayer.id == message.pid){
                            if (global.state.localPlayer.health > 0){
                                //global.state.localPlayer.health -= 20;
                                var newHealth = message.health;
                                console.log("server: " + global.state.localPlayer.id + "got hit. health: " + newHealth);
                            }
                            else {
                                global.state.localPlayer.renderable.flicker(90);
                                me.game.remove(global.state.localPlayer);
                            }
                        }
                        else {
                            var opponentHit = remotePlayerById(message.pid);
                            if (!opponentHit.flickering){
                                opponentHit.renderable.flicker(3);
                            }

                        }
                    break;
                    case "spawnFlag":
                        console.log("Client Spawn Flag at " + message.flagX + ", " + message.flagY);
                        var flag = new game.FlagEntity(message.flagX, message.flagY);
                        global.state.flag = flag;
                        me.game.add(flag, 3);
                        me.game.sort();
                    break;

                    case "playerPickUpFlag":
                        console.log("Player" + message.pid + "has the FLAG!");
                        global.state.flag.visible = false;
                        global.state.flag.collidable = false;
                        if (global.state.localPlayer.id == message.pid){
                            if (!global.state.localPlayer.hasFlag){
                                global.state.localPlayer.hasFlag = true;
                                global.state.flag.playerOwner = global.state.localPlayer;
                            }
                        }
                        else {
                            var flagCarrier = remotePlayerById(message.pid);
                            flagCarrier.hasFlag = true;
                            global.state.flag.playerOwner = flagCarrier;
                        }
                        global.state.flag = flag;
                        me.game.add(flag, 3);
                        me.game.sort();
                        break;

                    case "startGame":
                        console.log("Client Start Flag at " + message.flagX + ", " + message.flagY);
                        var flag = new game.FlagEntity(message.flagX, message.flagY);
                        global.state.flag = flag;
                        me.game.add(flag, 3);
                        me.game.sort();
                    break;
                }
            }
        } catch (e){
            console.log("Failed to connect to " + "http://" + global.network.host + ":" + global.network.port);
            }
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

    onRemovePlayer: function(data) {
        // When a player disconnects, we find them in our remote players array
        var removePlayer = remotePlayerById(data.id);

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
        var playerToMove = remotePlayerById(data.id);

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

var setPlayerPos = function (playerObj, playerMessageFromServer){
    playerObj.pos.x = playerMessageFromServer.x;
    playerObj.pos.y = playerMessageFromServer.y
    playerObj.vel.x = playerMessageFromServer.vX;
    playerObj.vel.y = playerMessageFromServer.vY;
}
// Helper function to return one of our remote players
var remotePlayerById = function(id) {
    var i;

    for (i = 0; i < global.state.remotePlayers.length; i++) {
        if (global.state.remotePlayers[i].id == id)
            return global.state.remotePlayers[i];
    };

    return false;
};
