// Add entity to namespace?
ig.module( 'game.entities.brandon' )

// Make sure the right shit is available for us
.requires( 'impact.entity' )

.defines(function(){

	EntityGoomba = ig.Entity.extend({
		
		size: {x: 8, y:14},
		offset: {x: 4, y: 2},
		
		maxVel: {x: 200, y: 200},
		
		friction: {x: 600, y: 600},
		
		// Player friendly group
		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.ACTIVE,
		
		animSheet: new ig.AnimationSheet( 'media/player.png', 16, 16 ),
		
		// These are our own properties. They are not defined in the base
		// ig.Entity class. We just use them internally for the Player
		accelGround: 200,
		jump: 500,
		health: 10,
		flip: false,
		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			
			// Add the animations
			this.addAnim( 'idle', 1, [0] );
			this.addAnim( 'run', 0.07, [0,1,2,3,4,5] );
			this.addAnim( 'jump', 1, [9] );
			this.addAnim( 'fall', 0.4, [6,7] );
		},
		
		
		update: function() {

		}
	
	});

});