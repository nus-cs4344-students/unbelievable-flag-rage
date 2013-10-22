var global = {
    WIDTH: 1136,
    HEIGHT: 640,
    DOUBLE: true,
    DEBUG: true,
    network: {
        host: "localhost",
        port: 4344,
        totlatency: 0,
        latency: 0,
        emitTime: 0,
        emits: 0
    },
    state: {
        playername: "",
        localPlayer: undefined,
        remotePlayers: []
    }
};

/* game namespace */
var game = {
    onload: function() {

        me.sys.pauseOnBlur = false;
        me.sys.stopOnBlur = false;

        if (!me.video.init("jsapp", 800, 600, true, 'auto')) {
            alert("html 5 canvas is not supported by this browser.");
            return;
        }

        //
        //me.sys.stopOnBlur = false;
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

        //load texture for player
        game.player1Texture = new me.TextureAtlas(me.loader.getJSON("p1_walk"), me.loader.getImage("p1_walk"));
        me.debug.renderHitBox = true;
        // start the game
        me.state.change(me.state.PLAY);
    }
};

window.onReady(function(){
    game.onload();
});
