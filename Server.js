/**
 * New node file
 */
/**
 * Created by David on 10/20/13.
 */

"use strict";

var LIB_PATH = "./javascripts/server/";
require(LIB_PATH + "Player.js");
require(LIB_PATH + "Character.js");
require(LIB_PATH + "Game.js");
require(LIB_PATH + "Hitbox.js");
require(LIB_PATH + "Bullet.js");
require(LIB_PATH + "Flag.js");
require(LIB_PATH + "ReturnPoint.js");
function Server()
{
    // Private Variables
    var port;                                   // Game port
    var count;                                  // Keeps track how many people are connected to server
    var gameInterval;                           // Interval variable used for gameLoop
    var sockets;                                // Associative array for sockets, indexed via player ID
    var players;                                // Associative array for players, indexed via socket ID
    var p1, p2,p3,p4;                           // Player 1,2,3 and 4
    var p1Status,p2Status,p3Status,p4Status;    // Player 1,2,3 and 4 status (taken or empty)
    var bullets;
    var flag;
    var returnPoint;
    var lastStateUpdate = new Date().getTime();
    /*****************************   SENDING MESSAGE METHODS   *****************************/
    //private method: broadcast(msg)
    var broadcast = function (msg)
    {
        var id;
        for (id in sockets) {
            sockets[id].write(JSON.stringify(msg));
        }
    }

    var selectiveBroadcast = function(idNotToSendTo, msg){
        for (var id in sockets){
            if (id != idNotToSendTo){
                sockets[id].write(JSON.stringify(msg));
            }
        }
    }

    //private method: unicast(socket, msg)
    var unicast = function (socket, msg)
    {
        socket.write(JSON.stringify(msg));
    }

    //send messages with delay
    var delayUnicast = function (delay, socketID,states)
    {
        setTimeout(unicast(socketID, states),delay);

    }
    //broadcast with delay
    var delayBroadcast = function (msg,delay)
    {
        var id;
        for(id in sockets)
        {
            setTimeout(unicast, delay, sockets[id], msg);
        }
        //console.log(delay);


    }


    /***************************   CREATING NEW PLAYER METHODS   *****************************/
    function playerIdAssigning ()
    {
        if(p1Status === "empty")
        {
            p1Status = "taken";
            return 1;
        }

        else if (p2Status === "empty")
        {
            p2Status = "taken";
            return 2;
        }
        else if (p3Status === "empty")
        {
            p3Status = "taken";
            return 3;
        }
        else if (p4Status === "empty")
        {
            p4Status = "taken";
            return 4;
        }
        else
            return 0; // game full
    }

    function playerPosAssigning (PID)
    {
        // 1st player is always top left,
        // 2nd player is always bottom left,
        // 3rd player is always top right,
        // 4th player is always bottom right

        if (PID == 1)
            return "topLeft";
        else if(PID == 2)
            return "bottomLeft";
        else if(PID == 3)
            return "topRight";
        else if(PID == 4)
            return "bottomRight";
        else
            return "";
    }

    function xStartPos (playerPos)
    {
        if(playerPos == "topLeft")
            return Game.PLAYER_LEFT_START_POS_X;
        else if(playerPos == "bottomLeft")
            return Game.PLAYER_LEFT_START_POS_X;
        else if(playerPos == "topRight")
            return Game.PLAYER_RIGHT_START_POS_X;
        else if(playerPos == "bottomRight")
            return Game.PLAYER_RIGHT_START_POS_X;
        else
            return 0;

    }

    function yStartPos (playerPos)
    {
        if(playerPos == "topLeft")
            return Game.PLAYER_TOP_START_POS_Y;
        else if(playerPos == "bottomLeft")
            return Game.PLAYER_BOTTOM_START_POS_Y;
        else if(playerPos == "topRight")
            return Game.PLAYER_TOP_START_POS_Y;
        else if(playerPos == "bottomRight")
            return Game.PLAYER_BOTTOM_START_POS_Y;
        else
            return 0;
    }

    function markPlayers (PID,conn)
    {
        if(PID == 1)
            p1 = players[conn.id];
        else if(PID == 2)
            p2 = players[conn.id];
        else if(PID == 3)
            p3 = players[conn.id];
        else if(PID == 4)
            p4 = players[conn.id];

    }

    function newPlayer (conn)
    {
        count++;

        var PID = playerIdAssigning();

        if (PID != 0)
        {

            var playerPos = playerPosAssigning(PID);
            var playerPosX = xStartPos(playerPos);
            var playerPosY = yStartPos(playerPos);
            console.log ("PID: "+ PID + " playerPos: " + playerPos );


            // Create player object and insert into players with key = conn.id
            players[conn.id] = new Player(conn.id, PID, playerPosX, playerPosY);
            sockets[PID] = conn;
            markPlayers (PID,conn);

            // Send recently connected client coordinates to create local player
            unicast(conn,
                {
                    type: "createLocalPlayer",
                    playerID: PID,
                    x: playerPosX,
                    y: playerPosY
                }
            );
            // Broadcast new player connected to other players
            selectiveBroadcast(PID,
                {
                    type: "createRemotePlayer",
                    playerID: PID,
                    x: playerPosX,
                    y: playerPosY
                }
            );
            // Tell new player about other existing players.
            for (var connID in players){
                var otherPlayer = players[connID];
                if (otherPlayer.sid != conn.id){ //if not new player in server player list
                    unicast(conn,                //send to new player
                        {
                            type: "createRemotePlayer",
                            playerID: otherPlayer.pid,
                            x: otherPlayer.x,
                            y: otherPlayer.y
                        }
                    );
                }
            }
        }
        else
        {
            // Send message to new player (the current client)
            unicast(conn, {type: "message", content:"The game is full.  Come back later"});
        }

    }
    /*****************************   IN GAME (LOOP) METHODS   *****************************/
    function gameLoop()
    {
        //temporary game state updates in game loop
        // Check player got hit and broadcasts Player that got hit
        for (var i = 0; i < bullets.length; i++){
            var bullet = bullets[i];
            var playerHit = bullet.moveOneStep(players); //player object that got hit

            if (playerHit != null){
                console.log("playerHit" + playerHit.pid);
                broadcast(
                    {
                        type: "gotHit",
                        pid: playerHit.pid,
                        health: playerHit.character.health
                    }
                );
            }
            if (bullet.getInvalid()){
                bullets.splice(i,1);
            }
        }

        // Check player deaths and broadcasts Player died
        for (var connId in players){
            var player = players[connId];

            if (player.character.health <= 0){

                if (player.character.flag){       // player has flag
                    player.character.beforeDie(); // remove player as flagCarrier
                    broadcast({
                        type: "updateFlagPos",
                        x: flag.x,
                        y: flag.y
                    });
                }

                broadcast({
                    type: "playerDied",
                    pid: player.pid
                });

                // get spawn position for player who died
                var position = playerPosAssigning(player.pid);
                var x = xStartPos(position);
                var y = yStartPos(position);
                // tell player to respawn
                unicast(sockets[player.pid],
                    {
                        type: "respawnPlayer",
                        x: x,
                        y: y,
                        pid: player.pid
                    });
                player.character.x = x;
                player.character.y = y;
                player.character.health = 100;
            }
        }

        // Send Flag Coordinates
        var flagOwner = flag.playerOwner;
        if (flagOwner){
            selectiveBroadcast(flagOwner.pid,
                {
                    type: "updateFlagPos",
                    x: flag.x,
                    y: flag.y
                }
            );
            /*
             // Check player return flag
             var flagReturned = returnPoint.checkGotReturn(flagOwner.character.x, flagOwner.character.y);
             if (flagReturned){
             flagOwner.character.returnFlag();
             flag.spawn();
             returnPoint.spawn();
             broadcast({
             type:"spawnFlagAndReturn",
             flagX: flag.x,
             flagY: flag.y,
             rpX: returnPoint.x,
             rpY: returnPoint.y,
             pid: flagOwner.pid
             });
             }
             */
        }


    }
    /*****************************   GAME STATE METHODS   *****************************/
    function broadcastLoop()
    {
        var artificialDelay = 800;
        var errorpercentage = 0.2;
        var from   = artificialDelay - errorpercentage* artificialDelay;
        var to = artificialDelay + errorpercentage*artificialDelay;

        var changingdelay = Math.floor(Math.random()*(to - from + 1) + from);
        if (gameInterval !== undefined)
        {
            var timeStamp = new Date().getTime();
            delayBroadcast ({
                type: "update",
                //player 1 state
                p1: {
                    time:timeStamp,
                    x:p1.character.getX(),
                    y:p1.character.getY(),
                    vX:p1.character.getVX(),
                    vY:p1.character.getVY()
                },

                //player 2 state
                p2: {
                    time:timeStamp,
                    x:p2.character.getX(),
                    y:p2.character.getY(),
                    vX:p2.character.getVX(),
                    vY:p2.character.getVY()
                },

                //player 3 state

                p3: {
                    time:timeStamp,
                    x:p3.character.getX(),
                    y:p3.character.getY(),
                    vX:p3.character.getVX(),
                    vY:p3.character.getVY()
                },

                //player 4 state
                p4: {
                    time:timeStamp,
                    x:p4.character.getX(),
                    y:p4.character.getY(),
                    vX:p4.character.getVX(),
                    vY:p4.character.getVY()
                }

            },0);
        }

    }


    function reset()
    {
        gameInterval = undefined;

    }

    function update(conn,message)
    {
        //console.log("player" + conn.id);
        var playerCharacter = players[conn.id].character;
        //console.log("received update from player " + players[conn.id].pid);
        playerCharacter.updatePosition(message.x, message.y, message.vX, message.vY);
        /*
         players[conn.id].character.setX(message.x);
         players[conn.id].character.setY(message.y);
         players[conn.id].character.setVX(message.vX);
         players[conn.id].character.setVY(message.vY);
         */
    }

    function playerShoot(conn,message)
    {
        var bullet = new Bullet (message.bulletX, message.bulletY, message.bulletVX);
        bullets.push(bullet);
        selectiveBroadcast(players[conn.id].pid, message);
    }

    function playerPickUpFlag(conn, message){
        var player = players[conn.id];
        if (!player.character.flag && !flag.playerOwner){ //players has no flag && flag has no owner
            if( flag.x   <= player.character.x <= flag.x + 70 &&
                flag.y   <= player.character.y <= flag.y + 70){
                player.character.flag = flag;
                flag.playerOwner = player;
                broadcast(
                    {
                        type: "playerPickUpFlag",
                        pid: player.pid
                    });
            }
        }
    }

    function playerReturnFlag(conn, message){
        var player = players[conn.id];
        //check if player has the flag, and the flag has the right player
        if (player.character.flag && flag.playerOwner.pid == player.pid){
            //check if the player's position is in range of the hitbox of the return point
            if (returnPoint.checkGotReturn(message.x, message.y)){
                player.character.flag = null;
                flag.ownerDie(); //just setting flag.playerOwner = null;
                flag.spawn();
                returnPoint.spawn(flag);
                broadcast({
                    type:"spawnFlagAndReturn",
                    flagX: flag.x,
                    flagY: flag.y,
                    rpX: returnPoint.x,
                    rpY: returnPoint.y,
                    pid: player.pid
                });
            }
        }
    }

    function playing()
    {
        // There is already a timer running so the game has
        // already started.
        console.log("Already playing!");

    }

    function notEnoughPlayer()
    {
        // We need at least 2 players to play.
        console.log("Not enough players!");
        broadcast({type:"message", content:"Not enough player"});
    }

    function startGame()
    {
        // send flag spawn point to clients
        flag = new Flag();
        returnPoint = new ReturnPoint();
        // Everything is a OK
        broadcast({
            type:"startGame",
            flagX: flag.x,
            flagY: flag.y,
            rpX: returnPoint.x,
            rpY: returnPoint.y
        });
        // TODO: might need separate gameState and sendUpdate loops
        gameInterval = setInterval(function() {gameLoop();}, 1000/Game.FRAME_RATE);
        setInterval(function() {broadcastLoop();}, 1000/15);
    }

    function prepare()
    {
        if (gameInterval !== undefined)
        {
            playing();
        }

         else if (Object.keys(players).length < 4)
         {
         notEnoughPlayer();
         }

        else
        {
            startGame();
        }

    }



    /********************   MANAGING INPUT FROM CLIENTS METHODS   *****************************/

    function manageData (conn,data)
    {
        var message = JSON.parse(data);

        switch (message.type)
        {
            // one of the player starts the game.
            case "start":
                console.log("received start");
                prepare();
                break;

            //update position
            case "update":
                //console.log("server updating");
                update(conn,message);
                break;
            case "playerShoot":
                console.log("received playerShot" + players[conn.id].pid);
                playerShoot(conn,message);
                break;
            case "pickUpFlag":
                console.log("player " + players[conn.id].pid + " has picked up flag");
                playerPickUpFlag(conn,message);
                break;
            case "returnFlag":
                console.log("player " + players[conn.id].pid + " has returned the flag");
                playerReturnFlag(conn,message);
                break
            default:
                console.log("Unhandled " + message.type);
        }

    }

    function receivingDataFromClient (conn)
    {
        conn.on('data', function (data)

        {
            manageData (conn,data);
        });
    }

    /*****************************   CONNECTION METHODS   *****************************/

    function reinitialize ()
    {
        count = 0;
        gameInterval = undefined;
        players = new Object;
        sockets = new Object;
        bullets = [];
        p1Status = p2Status = p3Status = p4Status = "empty";
    }

    function clientConnection (conn)
    {
        console.log("connected");
        // Sends to client
        broadcast({type:"message", content:"There is now " + count + " players"});

        if (count == 4) {
            // Send back message that game is full
            unicast(conn, {type:"message", content:"The game is full.  Come back later"});
            // TODO: force a disconnect
        } else {
            // create a new player
            newPlayer(conn);
        }

    }

    function removePlayer(conn)
    {
        if (players[conn.id] === p1)
        {
            p1 = undefined;
            p1Status = "empty";
        }
        if (players[conn.id] === p2)
        {
            p2 = undefined;
            p2Status = "empty";
        }
        if (players[conn.id] === p3)
        {
            p3 = undefined;
            p3Status = "empty";
        }
        if (players[conn.id] === p4)
        {
            p4 = undefined;
            p4Status = "empty";
        }
        delete players[conn.id];
    }

    function clientClosing (conn)
    {

        conn.on('close', function () {
            console.log(conn.id + " disconnected======")
            // Stop game if it's playing
            reset();

            // Decrease player counter
            count--;

            // Remove player who wants to quit/closed the window
            removePlayer(conn);

            // Sends to everyone connected to server except the client
            broadcast({type:"message", content: " There is now " + count + " players."});
        });


    }

    function startServerAndListenForConnection(express,http,sock)
    {
        // Standard code to starts the server and listen for connection
        var app = express();
        var httpServer = http.createServer(app);
        sock.installHandlers(httpServer, {prefix:'/game'});
        httpServer.listen(process.env.PORT||Game.PORT);
        app.use(express.static(__dirname));
    }



    /*******************************   START GAME   ********************************/
    /*
     * priviledge method: start()
     *
     * Called when the server starts running.  Open the
     * socket and listen for connections.  Also initialize
     * callbacks for socket.
     */
    this.start = function ()
    {
        try
        {
            var express = require('express');
            var http = require('http');
            var sockjs = require('sockjs');
            var sock = sockjs.createServer();

            // reinitialize
            reinitialize ();

            // Upon connection established from a client socket
            sock.on('connection', function (conn)
            {
                clientConnection (conn);
                clientClosing (conn);
                receivingDataFromClient (conn);

            });// socket.on("connection"


            // Standard code to starts the server and listen for connection

            startServerAndListenForConnection(express,http,sock);
        }

        catch (e)
        {
            console.log("Cannot listen to " + port);
            console.log("Error: " + e);
        }

    }

    this.getPlayers = function (){
        return players;
    }

}//Server
/*****************************   LOAD SCRIPT   *****************************/
// This will auto run after this script is loaded
var gameServer = new Server();
gameServer.start();
