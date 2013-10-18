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
        me.levelDirector.loadLevel("simpleMap");
    },
    //action to perform when game is finished (state change)
    onDestroyEvent: function() {
    }
});
