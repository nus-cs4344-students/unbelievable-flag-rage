var global = {
    WIDTH: 1610,
    HEIGHT: 1050,
    DOUBLE: true,
    DEBUG: true,
    network: {
        //host: "unbelievable-flag-rage.herokuapp.com",

//        host: "localhost",
        host: "172.28.178.151",
        port: "4344",
        //port: 80,
        totlatency: 0,
        latency: 0,
        emitTime: 0,
        emits: 0
    },
    state: {
        playername: "",
        localPlayer: undefined,
        remotePlayers: [],
        flag: undefined,
        returnPoint: undefined
    },
    time:{
        serverTime : 0,
        clientTime : 0,
        timeOffSet : 100
    },
    serverArray:{
        serverUpdateArr :new Array(),// store server updates
        bufferUpdateSize: 4 // size to store server update history
    },
    aliveBulletCount: 0
};

/* game namespace */
var game =
{

    /**
     * an object where to store game global data
     */
    data : {
        // score
        score : 0
    },
    onload: function() {

        me.sys.pauseOnBlur = false;
        me.sys.stopOnBlur = false;
        me.sys.alwaysUpdate = true;
        //me.sys.gravity = ;

        //game world is 1680 x 1580 px
        if (!me.video.init("jsapp", 1080, 800, true, 'auto')) {
            alert("html 5 canvas is not supported by this browser.");
            return;
        }

        //
        //me.sys.stopOnBlur = false;
        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);
        // Load Resources
        me.loader.preload(game.resources);

        //Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);


    },
    loaded: function() {
        // set the Play/Ingame Screen Object
        game.playScreen = new game.PlayScreen();
        me.state.set(me.state.PLAY, game.playScreen);
        me.sys.gravity = 0.25;

        //load texture for player
        game.player1Texture = new me.TextureAtlas(me.loader.getJSON("p1_walk"), me.loader.getImage("p1_walk"));
        game.player2Texture = new me.TextureAtlas(me.loader.getJSON("p2_walk"), me.loader.getImage("p2_walk"));
        game.player3Texture = new me.TextureAtlas(me.loader.getJSON("p3_walk"), me.loader.getImage("p3_walk"));
        game.player4Texture = new me.TextureAtlas(me.loader.getJSON("p4_walk"), me.loader.getImage("p4_walk"));
        me.debug.renderHitBox = false;
        // start the game
        me.state.change(me.state.PLAY);
    }
};

window.onReady(function(){
    game.onload();
});
