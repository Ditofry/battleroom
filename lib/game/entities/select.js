ig.module (
  'game.entities.select'
)
.requires(
  'impact.entity'
)
.defines(function(){
  EntitySelect = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/Character-Select-Screen.png', 540, 360),
    gravityFactor: 0,
    init: function( x, y, settings) {
      this.parent( x, y, settings );
      this.addAnim('idle', 1, [0] );
    },
    update: function() {
      var mouseX = ig.input.mouse.x,
          mouseY = ig.input.mouse.y;
      if ( mouseX > 0 && mouseX < 108  ) {
        if(ig.input.pressed('mouse1')){
          ig.game.chosenCharacter = 'frankie';
          ig.game.currentLevel = 'battleroom1';
          ig.game.loadLevelDeferred(LevelBattleroom1);
        }
      } else if ( mouseX > 108 && mouseX < 216 ) {
        if(ig.input.pressed('mouse1')){
          ig.game.chosenCharacter = 'liz';
          ig.game.currentLevel = 'battleroom1';
          ig.game.loadLevelDeferred(LevelBattleroom1);
        }

      } else {
        this.currentAnim = this.anims.idle;
      }
      this.parent();
    }

  });
});
