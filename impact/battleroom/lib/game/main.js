ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

	'game.entities.combatant',
	'game.levels.battleroom1'
)
.defines(function(){

MyGame = ig.Game.extend({

	gravity: 300, // All entities are affected by this

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),

	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.X, 'jump' );
		ig.input.bind( ig.KEY.C, 'punch' );
		ig.input.bind( ig.KEY.Z, 'kick' );
		// Set canvas color
		ig.game.clearColor = '#00FFFF';
		// Load the LevelTest as required above ('game.level.test')
		this.loadLevel( LevelBattleroom1 );
		ig.music.add( 'media/music/guile.mp3' );
		ig.music.volume = 0.5;
		ig.music.play();
	},

	update: function() {
		// Update all entities and BackgroundMaps
		this.parent();

		// screen follows the player
		var player = this.getEntitiesByType( EntityCombatant )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
	},

	draw: function() {
		// Draw all entities and BackgroundMaps
		this.parent();

		this.font.draw( 'Arrow Keys, X, C', 2, 2 );
	}
});

// Start the Game with 60fps, a resolution of 540x360, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 540, 360, 2 );

});
