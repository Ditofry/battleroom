ig.module(
  'game.entities.combatant'
)
.requires(
  'impact.entity'
)
.defines(function(){

EntityCombatant = ig.Entity.extend({

  // The players (collision) size is a bit smaller than the animation
  // frames, so we have to move the collision box a bit (offset)
  size: {x: 70, y:145},
  offset: {x: 65, y: 0},

  maxVel: {x: 300, y: 500},
  friction: {x: 800, y: 0},

  type: ig.Entity.TYPE.A, // Player friendly group
  checkAgainst: ig.Entity.TYPE.NONE,
  collides: ig.Entity.COLLIDES.PASSIVE,

  animSheet: new ig.AnimationSheet( 'media/liz-fight.png', 200, 160 ),

  // These are our own properties. They are not defined in the base
  // ig.Entity class. We just use them internally for the Player
  accelGround: 900,
  accelAir: 200,
  jump: 200,
  health: 100,
  flip: true,

  // Until we get multiple strike anims...
  strikeTimer: new ig.Timer(),
  strikeTimerDelay: 0.15,
  currentStrike: '',

  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    // Add the animations
    this.addAnim( 'idle', 0.4, [0,1] );
    this.addAnim( 'run', 0.2, [0,2] );
    this.addAnim( 'punch', 2, [4]);
    this.addAnim( 'kick', 2, [5]);
    this.addAnim( 'jump', 1, [6] );
    this.addAnim( 'fall', 1, [6] );
    this.addAnim( 'flyingPunch', 1, [7,6]);
    this.addAnim( 'flyingKick', 1, [8,6]);
    this.addAnim( 'dmg', 0.1, [1,3]);
  },

  update: function() {

    // move left or right.  Will this preserve horizontal momentum?
    var accel = this.standing ? this.accelGround : this.accelAir;
    if( ig.input.state('left') ) {
      this.accel.x = -accel;
      this.flip = true;
    }
    else if( ig.input.state('right') ) {
      this.accel.x = accel;
      this.flip = false;
    }
    else {
      this.accel.x = 0;
    }

    // jump
    if( this.standing && ig.input.pressed('jump') ) {
      this.vel.y = -this.jump;
    }

    // standing punch
    if( this.standing && ig.input.pressed('punch') ) {
      this.strikeTimer.reset();
      this.currentStrike = 'punch';
    }
    // standing kick
    if( this.standing && ig.input.pressed('kick') ) {
      this.strikeTimer.reset();
      this.currentStrike = 'kick';
    }
    // standing punch
    if( this.vel.y != 0 && ig.input.pressed('punch') ) {
      this.strikeTimer.reset();
      this.currentStrike = 'flyingPunch';
    }
    // standing kick
    if( this.vel.y != 0 && ig.input.pressed('kick') ) {
      this.strikeTimer.reset();
      this.currentStrike = 'flyingKick';
    }

    // // shoot
    // if( ig.input.pressed('shoot') ) {
    //   ig.game.spawnEntity( EntitySlimeGrenade, this.pos.x, this.pos.y, {flip:this.flip} );
    // }

    // set the current animation, based on the player's speed
    if( this.vel.y < 0 ) {
      this.currentAnim = this.anims.jump;
    }
    else if( this.vel.y > 0 ) {
      this.currentAnim = this.anims.fall;
    }
    else if( this.vel.x != 0 ) {
      this.currentAnim = this.anims.run;
    }
    else {
      this.currentAnim = this.anims.idle;
    }

    // Determine strike
    if( this.strikeTimer.delta() < this.strikeTimerDelay ){
      this.currentAnim = this.anims[this.currentStrike];
    }

    // kick
    if( this.standing && ig.input.pressed('kick') ) {
      this.currentAnim = this.anims.kick;
    }

    this.currentAnim.flip.x = this.flip;

    // move!
    this.parent();
  }
});


// The grenades a player can throw are NOT in a separate file, because
// we don't need to be able to place them in Weltmeister. They are just used
// here in the code.

// Only entities that should be usable in Weltmeister need to be in their own
// file.
EntitySlimeGrenade = ig.Entity.extend({
  size: {x: 10, y: 10},
  offset: {x: 2, y: 2},
  maxVel: {x: 200, y: 200},


  // The fraction of force with which this entity bounces back in collisions
  bounciness: 2,

  type: ig.Entity.TYPE.NONE,
  checkAgainst: ig.Entity.TYPE.B, // Check Against B - our evil enemy group
  collides: ig.Entity.COLLIDES.PASSIVE,

  animSheet: new ig.AnimationSheet( 'media/slime-grenade.png', 8, 8 ),

  bounceCounter: 0,


  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
    this.vel.y = -50;
    this.addAnim( 'idle', 0.2, [0,1] );
  },

  handleMovementTrace: function( res ) {
    this.parent( res );
    // Count bounces
    if( res.collision.x || res.collision.y ) {

      // only bounce 300 times
      this.bounceCounter++;
      if( this.bounceCounter > 5 ) {
        //this.kill();
      }
    }
  },

  // This function is called when this entity overlaps anonther entity of the
  // checkAgainst group. I.e. for this entity, all entities in the B group.
  check: function( other ) {
    other.receiveDamage( 10, this );
    this.kill();
  }
});

});
