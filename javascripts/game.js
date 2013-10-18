/* game namespace */
var game = {
    onload: function() {
        if (!me.video.init("jsapp", 800, 600, true, 'auto')) {
            alert("html 5 canvas is not supported by this browser.");
            return;
        }
        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);
        // Load Resources
        me.loader.preload(game.resources);

        //Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },
    loaded: function() {
        // set the Play/Ingame Screen Object
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // add player entity in the entity pool
        me.entityPool.add("player1",game.PlayerEntity);
        console.log("added player1 entity");

        //enable keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.X, "jump", true);
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
