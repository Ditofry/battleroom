ig.module(
  'game.entities.liz'
)
.requires(
  'impact.entity'
)
.defines(function(){

EntityLiz = ig.Entity.extend({

  // The players (collision) size is a bit smaller than the animation
  // frames, so we have to move the collision box a bit (offset)
  size: {x: 70, y:140},
  offset: {x: 65, y: 0},

  maxVel: {x: 300, y: 500},
  friction: {x: 800, y: 0},

  type: ig.Entity.TYPE.A, // Player friendly group
  checkAgainst: ig.Entity.TYPE.NONE,
  collides: ig.Entity.COLLIDES.PASSIVE,

  animSheet: new ig.AnimationSheet( 'media/liz-fight.png', 200, 160 ),

  // These are our own properties. They are not defined in the base
  // ig.Entity class. We just use them internally for the Player
  accelGround: 2100,
  accelAir: 2900,
  jump: 2900,
  health: 100,
  flip: true,

  // Until we get multiple strike anims...
  strikeTimer: new ig.Timer(),
  strikeTimerDelay: 0.15,
  currentStrike: '',
  bigImpact: new ig.Sound( 'media/sfx/bigImpact.ogg' ),
  littleImpact: new ig.Sound( 'media/sfx/littleImpact.ogg' ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );
    // Enter the arena!!!!

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

    var sounds = [ 'gle', 'fod', 'clay', 'dank', 'scooba',
                  'hooba', 'shway', 'boopi', 'bapa', 'di', 'ho' ];

    ws.send(JSON.stringify({action: 'joined', data: { playerName: namingAlg(sounds) }}));
  },
  handleMovementTrace: function( res ) {
      // This completely ignores the trace result (res) and always
      // moves the entity according to its velocity
      if( this.vel.y < 0 ) {
        this.pos.x += this.vel.x * ig.system.tick;
        this.pos.y += this.vel.y * ig.system.tick;
      } else {
        this.parent(res);
      }
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

    // // jump
    // if( this.standing && ig.input.pressed('jump') ) {
    //   this.vel.y = -this.jump;
    //   ws.send(JSON.stringify({action: 'jump'}));
    // }
    //
    // // standing punch
    // if( this.standing && ig.input.pressed('punch') ) {
    //   this.strikeTimer.reset();
    //   this.currentStrike = 'punch';
    //   this.littleImpact.play();
    //   ws.send(JSON.stringify({action: 'punch'}));
    // }
    // // standing kick
    // if( this.standing && ig.input.pressed('kick') ) {
    //   this.strikeTimer.reset();
    //   this.currentStrike = 'kick';
    //   this.bigImpact.play();
    //   ws.send(JSON.stringify({action: 'kick'}));
    // }
    // // standing punch
    // if( this.vel.y != 0 && ig.input.pressed('punch') ) {
    //   this.strikeTimer.reset();
    //   this.currentStrike = 'flyingPunch';
    //   this.littleImpact.play();
    //   ws.send(JSON.stringify({action: 'flyingPunch'}));
    // }
    // // standing kick
    // if( this.vel.y != 0 && ig.input.pressed('kick') ) {
    //   this.strikeTimer.reset();
    //   this.currentStrike = 'flyingKick';
    //   this.bigImpact.play();
    //   ws.send(JSON.stringify({action: 'flyingKick'}));
    // }

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

  }
});


});
