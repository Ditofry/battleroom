ig.module (
  'game.entities.title'
)
.requires(
  'impact.entity'
)
.defines(function(){
  EntityTitle = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/title_screen.png', 540, 360),
    gravityFactor: 0,
    init: function( x, y, settings) {
      this.parent( x, y, settings );
      this.addAnim('idle', 1, [0] );
    },
    update: function() {
      var mouseX = ig.input.mouse.x,
          mouseY = ig.input.mouse.y;

      if ( mouseX > 204 && mouseX < 337 && mouseY > 211 && mouseY < 226 ) {
        if(ig.input.pressed('mouse1')){
          ig.game.gameplayMode = 'single';
          ig.game.currentLevel = 'Select';
          ig.game.loadLevelDeferred(LevelSelect);
        }
      } else if ( mouseX > 204 && mouseX < 337 && mouseY > 270 && mouseY < 285 ) {
        if(ig.input.pressed('mouse1')){
          ig.game.gameplayMode = 'multi';
          ig.game.currentLevel = 'Select';
          ig.game.loadLevelDeferred(LevelSelect);
        }
      } else {
        this.currentAnim = this.anims.idle;
      }
      this.parent();
    }
  });
});
