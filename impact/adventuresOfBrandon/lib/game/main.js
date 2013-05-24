 ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	// Entities
	'game.entities.player',
	'game.entities.brandon',
	
	// Levels
	'game.levels.first',
	'game.levels.second',
	'game.levels.third'
)
.defines(function(){

MyGame = ig.Game.extend({
	
  gravity: 300,
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	
	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.X, 'jump' );
		ig.input.bind( ig.KEY.C, 'shoot' );
		
		// Load the LevelTest as required above ('game.level.test')
		//this.loadLevel( LevelFirst );
		this.loadLevel( LevelThird );

	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// screen follows the player
		var player = this.getEntitiesByType( EntityBrandon )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/3;
			this.screen.y = player.pos.y - ig.system.height/2.5;
		}
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	
		this.font.draw( 'Arrow Keys, X, C', 2, 2 );
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 900, 400, 1);

});
