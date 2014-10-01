ig.module(
  'game.entities.evilClone'
)
.requires(
  'impact.entity'
)
.defines(function(){

  EntityEvilClone = ig.Entity.extend({
    // The players (collision) size is a bit smaller than the animation
    // frames, so we have to move the collision box a bit (offset)
    size: {x: 70, y: 140},
    offset: {x: 65, y: 0},

    maxVel: {x: 300, y: 500},
    friction: {x: 800, y: 0},

  	type: ig.Entity.TYPE.B,
  	checkAgainst: ig.Entity.TYPE.A,
  	collides: ig.Entity.COLLIDES.PASSIVE,

    animSheet: new ig.AnimationSheet( 'media/frankie-clone.png', 200, 160 ),

    // These are our own properties. They are not defined in the base
    // ig.Entity class. We just use them internally for the Player
    accelGround: 2100,
    accelAir: 2900,
    jump: 2900,
    health: 30,
    speed: 3,
    flip: true,

    // Until we get multiple strike anims...
    strikeTimer: new ig.Timer(),
    strikeTimerDelay: 0.15,
    currentStrike: '',
    recoveryTimer: new ig.Timer(),
    bigImpact: new ig.Sound( 'media/sfx/bigImpact.ogg' ),
    littleImpact: new ig.Sound( 'media/sfx/littleImpact.ogg' ),

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      // Add the animations
      this.addAnim( 'idle', 0.5, [0,1] );
      this.addAnim( 'run', 0.3, [0,2] );
      this.addAnim( 'punch', 2, [4]);
      this.addAnim( 'kick', 2, [5]);
      this.addAnim( 'jump', 1, [6] );
      this.addAnim( 'fall', 1, [6] );
      this.addAnim( 'flyingPunch', 1, [7,6]);
      this.addAnim( 'flyingKick', 1, [8,6]);
      this.addAnim( 'dmg', 0.1, [1,3]);
    },
    receiveDamage: function( amount, from ) {
      if( this.recoveryTimer.delta() > 0 ) {
        // if we can take damage right now, call the parent
        // function to reduce health
        this.parent( amount, from );

        // make invincible for two seconds
        this.invincibleTimer.set(2);
      }
    },
    punch: function() {
      this.strikeTimer.reset();
      if ( this.vel.y != 0 ) {
        this.currentStrike = 'flyingPunch';
      } else {
        this.currentStrike = 'punch';
      }
      this.littleImpact.play();
    },
    kick: function() {
      this.strikeTimer.reset();
      if ( this.vel.y != 0 ) {
        this.currentStrike = 'flyingKick';
      } else {
        this.currentStrike = 'kick';
      }
      this.bigImpact.play();
    },
    leap: function(){
      this.vel.y = -this.jump;
    },
    walkLeft: function() {
      this.walkingDirection = 'left';
    },
    walkRight: function() {
      this.walkingDirection = 'right';
    },
    stopWalking: function() {
      this.walkingDirection = null;
    },
    update: function() {

      // near an edge? return!
      if( !ig.game.collisionMap.getTile(
          this.pos.x + (this.flip ? + 5 : this.size.x - 5),
          this.pos.y + this.size.y+1
        )
      ) {
        this.flip = !this.flip;
      }

      var xdir = this.flip ? -1 : 1;
      this.accel.x = xdir * this.accelGround;

      // set the current animation, based on the player's speed and active strike
      if( this.strikeTimer.delta() < this.strikeTimerDelay ){
        this.currentAnim = this.anims[this.currentStrike];
      }
      else if( this.vel.y < 0 ) {
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

      this.currentAnim.flip.x = this.flip;

      // move!
      this.parent();

    },

    handleMovementTrace: function( res ) {
      this.parent( res );

      // Turn around at wall
      if( res.collision.x ) {
        this.flip = !this.flip;
      }
    },

    check: function( other ) {
      other.receiveDamage( 10, this );
    }

  });

});
