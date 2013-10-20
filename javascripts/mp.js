/* Handles Multiplayer Communication */

var Multiplayer = Object.extend({

    //takes in a player object
    init : function (newPlayer) {
        /* init mp communication variables */
        this.socket = new SockJS("http://" + "localhost" + ":" + "63342" + "/ufr");
        this.newPlayer = newPlayer;
        this.playerId = newPlayer.GUID;

        // start sock js
        this.initNetwork();
    },

    handleMessage : function (msg) {

    },

    appendMessage : function(location, msg){
        var prev_msgs = document.getElementById(location).innerHTML;
        document.getElementById(location).innerHTML = "[" + new Date().toString() + "] " + msg + "<br />" + prev_msgs;
    },
    initNetwork : function (){
        // Attempts to connect to game server
        try {
            //this.socket = new SockJS("http://" + "localhost" + ":" + "63342" + "/ufr");
            this.socket.onmessage = function (e) {
                var message = JSON.parse(e.data);
                switch (message.type) {
                    case "message":
                        this.appendMessage("serverMsg", message.content);
                        break;

                    case "update":
                         this.newPlayer.pos.x = message.x;
                         this.newPlayer.pos.y = message.y;
                    break;

                    case "new player":


                    default:
                        this.appendMessage("serverMsg", "unhandled meesage type " + message.type);
                }
            }
        } catch (e) {
            console.log("Failed to connect to " + "http://" + "localhost" + ":" + "63342");
        }
    },
    sendToServer : function (msg){
        /*  usage example
            msg = { type: "update", x: player.pos.x, y: player.pos.y};
            sendToServer(msg);
         */
        this.socket.send(JSON.stringify(msg));
    }
});