ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

	'game.entities.combatant',
	'game.entities.human',
	'game.entities.evilClone',
	'game.entities.select',
	'game.levels.Select',
	'game.levels.battleroom1'
)
.defines(function(){

MyGame = ig.Game.extend({

	gravity: 1300,
	chosenCharacter: 'frankie',
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),

	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.X, 'jump' );
		ig.input.bind( ig.KEY.C, 'punch' );
		ig.input.bind( ig.KEY.Z, 'kick' );
		ig.input.bind( ig.KEY.MOUSE1, 'mouse1' );
		// Set canvas color
		ig.game.clearColor = '#000000';
		this.loadLevelDeferred( LevelSelect );
		ig.music.add( 'media/music/guile.mp3' );
		ig.music.volume = 0.5;
		ig.music.play();
	},

	update: function() {
		// Update all entities and BackgroundMaps
		this.parent();

		// screen follows the player
		var player = this.player;
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
	},

	loadLevel: function(data) {
		this.parent(data);
		if(ig.game.currentLevel == 'battleroom1') {
			this.player = ig.game.spawnEntity(EntityHuman,400,50, {sprite: this.chosenCharacter});
		}
	},

	draw: function() {
		// Draw all entities and BackgroundMaps
		this.parent();

		this.font.draw( 'Arrow Keys, X, C, Z', 2, 2 );
	}
});

// Start the Game with 60fps, a resolution of 540x360, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 540, 360, 2 );


});
