/**
 * New node file
 */
/**
 * Created by David on 10/20/13.
 */

"use strict";

var LIB_PATH = "C:/Users/alaay/WebstormProjects/ufr/javascripts/server/";
require(LIB_PATH + "Player.js");
require(LIB_PATH + "Character.js");
require(LIB_PATH + "Game.js");

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

            // Send message to new player (the current client)
            //unicast(conn, {type: "myID", playerID:PID});
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
        broadcast ({
            type: "update",
            //player 1 state
            p1: {
                x:p1.character.getX(),
                y:p1.character.getY(),
                vX:p1.character.getVX(),
                vY:p1.character.getVY()
            },

            //player 2 state
            p2: {
                x:p2.character.getX(),
                y:p2.character.getY(),
                vX:p2.character.getVX(),
                vY:p2.character.getVY()
            },

            //player 3 state
            p3: {
                x:p3.character.getX(),
                y:p3.character.getY(),
                vX:p3.character.getVX(),
                vY:p3.character.getVY()
            },

            //player 4 state
            p4: {
                x:p4.character.getX(),
                y:p4.character.getY(),
                vX:p4.character.getVX(),
                vY:p4.character.getVY()
            }
        });
    }
    /*****************************   GAME STATE METHODS   *****************************/

    function reset()
    {


    }
    
    function update(conn,message)
    {
        //console.log("player" + conn.id);
        players[conn.id].character.setX(message.x);
        players[conn.id].character.setY(message.y);
        players[conn.id].character.setVX(message.vX);
        players[conn.id].character.setVY(message.vY);
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
    	// Everything is a OK
    	broadcast({type:"startGame"});
        gameInterval = setInterval(function() {gameLoop();}, 1000/Game.FRAME_RATE);
    }

    function prepare()
    {
        if (gameInterval !== undefined) 
        {
        	playing();
        } 
        else if (Object.keys(players).length < 2) 
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
        httpServer.listen(Game.PORT, '0.0.0.0');
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

            startServerAndListenForConnection(express,http,sock);
        }

        catch (e)
        {
            console.log("Cannot listen to " + port);
            console.log("Error: " + e);
        }

    }

}//Server
/*****************************   LOAD SCRIPT   *****************************/
// This will auto run after this script is loaded
var gameServer = new Server();
gameServer.start();
