ig.module(
  'game.entities.human'
)
.requires(
  'impact.entity'
)
.defines(function(){

  EntityHuman = ig.Entity.extend({
    playerId: new Date().getTime(),
    // The players (collision) size is a bit smaller than the animation
    // frames, so we have to move the collision box a bit (offset)
    size: {x: 70, y:140},
    offset: {x: 65, y: 0},

    maxVel: {x: 300, y: 500},
    friction: {x: 800, y: 0},

    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,

    animSheet: new ig.AnimationSheet( 'media/frankie-fight.png', 200, 160 ),

    // These are our own properties. They are not defined in the base
    // ig.Entity class. We just use them internally for the Player
    accelGround: 2100,
    accelAir: 2900,
    jump: 2900,
    health: 100,
    flip: true,
    walkingDirection: null,

    // Until we get multiple strike anims...
    strikeTimer: new ig.Timer(),
    strikeTimerDelay: 0.15,
    currentStrike: '',
    bigImpact: new ig.Sound( 'media/sfx/bigImpact.ogg' ),
    littleImpact: new ig.Sound( 'media/sfx/littleImpact.ogg' ),

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      localPlayer = this.playerId;
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
      ws.send(JSON.stringify({action: 'playerJoined', playerId: this.playerId }));
    },
    punch: function() {
      this.strikeTimer.reset();
      ws.send(JSON.stringify({action: 'punch', playerId: this.playerId}));
      if ( this.vel.y != 0 ) {
        this.currentStrike = 'flyingPunch';
      } else {
        this.currentStrike = 'punch';
      }
      this.littleImpact.play();
    },
    kick: function() {
      this.strikeTimer.reset();
      ws.send(JSON.stringify({action: 'kick', playerId: this.playerId}));
      if ( this.vel.y != 0 ) {
        this.currentStrike = 'flyingKick';
      } else {
        this.currentStrike = 'kick';
      }
      this.bigImpact.play();
    },
    leap: function(){
      this.vel.y = -this.jump;
      ws.send(JSON.stringify({action: 'leap', playerId: this.playerId}));
    },
    walkLeft: function() {
      this.walkingDirection = 'left';
      ws.send(JSON.stringify({action: 'walkLeft', playerId: this.playerId}));
    },
    walkRight: function() {
      this.walkingDirection = 'right';
      ws.send(JSON.stringify({action: 'walkRight', playerId: this.playerId}));
    },
    stopWalking: function() {
      this.walkingDirection = null;
      ws.send(JSON.stringify({action: 'stopWalking', playerId: this.playerId}));
    },
    update: function() {

      // movement keybindings
      var accel = this.standing ? this.accelGround : this.accelAir;
      if( ig.input.pressed('left') ) {
        this.walkLeft();
      }
      else if( ig.input.released('left') ) {
        this.stopWalking();
      }
      else if( ig.input.pressed('right') ) {
        this.walkRight();
      }
      else if( ig.input.released('right') ) {
        this.stopWalking();
      }

      // movement
      var accel = this.standing ? this.accelGround : this.accelAir;
      switch ( this.walkingDirection ) {
        case 'left':
          this.accel.x = -accel;
          this.flip = true;
          break;
        case 'right':
          this.accel.x = accel;
          this.flip = false;
          break;
        default:
          this.accel.x = 0;
      }

      // jump
      if( this.standing && ig.input.pressed('jump') ) {
        this.leap();
      }
      // standing punch
      if( ig.input.pressed('punch') ) {
        this.punch();
      }
      // standing kick
      if( ig.input.pressed('kick') ) {
        this.kick();
      }
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

      // Emit our player actions here

    }
  });

});
