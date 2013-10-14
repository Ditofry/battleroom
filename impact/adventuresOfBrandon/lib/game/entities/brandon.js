// Add entity to namespace?
ig.module( 'game.entities.brandon' )

// Make sure the right shit is available for us
.requires( 'impact.entity' )

// Everything that makes this entity tick
.defines(function(){

EntityBrandon = ig.Entity.extend({
	
	size: {x: 113, y:200},
	
	maxVel: {x: 200, y: 200},
	
	friction: {x: 600, y: 600},
	
	// Player friendly group
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.ACTIVE,
	
	animSheet: new ig.AnimationSheet( 'media/brandon.png', 113, 200 ),	
	
	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	accelGround: 200,
	jump: 500,
	health: 10,
	flip: false,
	
	// Set the things that need to be set as the entity is loaded
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [1,2,3,4,5,6] );
		this.addAnim( 'jump', 1, [7] );
		this.addAnim( 'fall', 0.4, [1,3] );

	},
	
	
	update: function() {

		// move left or right
		var accel = this.accelGround;
		var uAccel = this.accelAir;
		if( ig.input.state('left') ) {
			this.vel.x = -accel;
			this.flip = true;
		}
		else if( ig.input.state('right') ) {
			this.vel.x = accel;
			this.flip = false;
		}
		else if( ig.input.state('up') ) {
			this.vel.y = -accel;
			this.flip = false;
			
			// var yeti = new ig.Sound('media/sounds/yeti.mp3');
			// yeti.play();
		}
		else if( ig.input.state('down') ) {
			this.vel.y = accel;
			this.flip = false;			
		}
		else {
			this.vel.x = 0;
			this.vel.y = 0;
		}
		
		
		// jump
		if( this.standing && ig.input.pressed('jump') ) {
			this.vel.y = -this.jump;
			var yeti = new ig.Sound('media/sounds/yeti.mp3');
			yeti.play();
		}
		
		// shoot
		if( ig.input.pressed('shoot') ) {
			ig.game.spawnEntity( EntitySlimeGrenade, this.pos.x, this.pos.y, {flip:this.flip} );
		}
		
		// set the current animation, based on the player's speed
		if( this.vel.y != 0 || this.vel.x != 0 ) {
			this.currentAnim = this.anims.run;
		} else {
			this.currentAnim = this.anims.idle;
		}
		
		this.currentAnim.flip.x = this.flip;
		
		// move!
		this.parent();
	}
});

});