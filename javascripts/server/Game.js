/**
 * New node file
 */
/*=====================================================
 Declared as literal object (All variables are static)
 =====================================================*/
var Game = {
    HEIGHT : 1050,				    // height of game window
    WIDTH : 1610,				    // width of game window
    PORT : 4344,				    // port of game
    PLAYER_LEFT_START_POS_X: 70,    // player left x-coord
    PLAYER_LEFT_START_POS_X: 70,    // player left x-coord
    PLAYER_RIGHT_START_POS_X: 1540,  // player right x-coord
    PLAYER_TOP_START_POS_Y: 140,     // player top y-coord
    PLAYER_BOTTOM_START_POS_Y: 910, // player bottom y-coord
    FRAME_RATE : 60,			    // frame rate of game
    SERVER_NAME : "localhost"	    // server name of game
    //SERVER_NAME : "172.28.179.28"	// server name of game
}

// For node.js require
global.Game = Game;

// vim:ts=4