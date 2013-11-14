/**
 * Created with JetBrains WebStorm.
 * User: alaay
 * Date: 11/13/13
 * Time: 5:46 AM
 * To change this template use File | Settings | File Templates.
 */
game.ReturnPointEntity = me.ObjectEntity.extend({

    /* constructor */
    init: function(x,y, settings){
        var settings = {};
        settings.image = "returnPoint";
        settings.spritewidth = 70;
        settings.spriteheight = 70;

        //call constructor
        this.parent(x,y, settings);
        this.visible = true;
        this.name = "returnPoint"

    },

    update: function(){
        this.parent();
        return true;
    }
});