ig.module(
  'game.entities.human'
)
.requires(
  'impact.entity'
)
.defines(function(){

  EntityHuman = ig.Entity.extend({
    playerId: new Date().getTime(),
    sprite: 'frankie',
    // The players (collision) size is a bit smaller than the animation
    // frames, so we have to move the collision box a bit (offset)
    size: {x: 70, y:140},
    offset: {x: 65, y: 0},

    maxVel: {x: 300, y: 500},
    friction: {x: 800, y: 0},

    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,
    animSheet: null,
    // These are our own properties. They are not defined in the base
    // ig.Entity class. We just use them internally for the Player
    accelGround: 2100,
    accelAir: 2900,
    jump: 2900,
    maxHealth: 100,
    health: 100,
    flip: true,
    walkingDirection: null,

    // Until we get multiple strike anims...
    strikeTimer: new ig.Timer(),
    strikeTimerDelay: 0.15,
    tauntTimer: new ig.Timer(),
    tauntTimerDelay: .5,
    currentStrike: '',
    recoveryTimer: new ig.Timer(),
    bigImpact: new ig.Sound( 'media/sfx/bigImpact.ogg' ),
    littleImpact: new ig.Sound( 'media/sfx/littleImpact.ogg' ),

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      localPlayer = this.playerId;
      // Add the animations
      if (this.sprite){
        this.animSheet = new ig.AnimationSheet( 'media/' + this.sprite + '-fight.png', 200, 160 );
        this.addAnim( 'idle', 0.5, [0,1] );
        this.addAnim( 'run', 0.3, [0,2] );
        this.addAnim( 'punch', 2, [4] );
        this.addAnim( 'kick', 2, [5] );
        this.addAnim( 'jump', 1, [6] );
        this.addAnim( 'fall', 1, [6] );
        this.addAnim( 'flyingPunch', 1, [7,6] );
        this.addAnim( 'flyingKick', 1, [8,6] );
        this.addAnim( 'dmg', 0.5, [1,3] );
        this.addAnim( 'taunt', 0.5, [9] )
      }

      var sounds = [ 'gle', 'fod', 'clay', 'dank', 'scooba',
                    'hooba', 'shway', 'boopi', 'bapa', 'di', 'ho' ];
      ws.send(JSON.stringify({action: 'playerJoined', playerId: this.playerId }));
    },
    receiveDamage: function( amount, from ) {
      if( this.recoveryTimer.delta() > 0 ) {
        this.parent( amount, from );
        this.recoveryTimer.set(1);
      }
    },
    punch: function() {
      // Without multiple anim frames we need to give our strikes a
      // non-instantaneous duration.
      this.strikeTimer.reset();
      // Calculate where hitbox will be, then put it there
      var posx = this.flip ? this.pos.x - 30 : this.pos.x + 60;
      var posy = this.pos.y + 20;
      ig.game.spawnEntity( EntityHitBox, posx, posy );
      // Alert the network of the strike
      ws.send(JSON.stringify({action: 'punch', playerId: this.playerId}));
      // Determine nature of strike
      if ( this.vel.y != 0 ) {
        this.currentStrike = 'flyingPunch';
      } else {
        this.currentStrike = 'punch';
      }
      // Play sound effect
      this.littleImpact.play();
    },
    kick: function() {
      // See punch ^ for comments
      this.strikeTimer.reset();
      var posx = this.flip ? this.pos.x - 55 : this.pos.x + 85;
      var posy = this.pos.y + 50;
      ig.game.spawnEntity( EntityHitBox, posx, posy );
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

      if ( this.standing && ig.input.pressed('taunt') ) {
        this.tauntTimer.reset();
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
      else if( this.tauntTimer.delta() < this.tauntTimerDelay ) {
        this.currentAnim = this.anims.taunt;
      }
      else if( this.recoveryTimer.delta() < 0 ) {
        this.currentAnim = this.anims.dmg;
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

    },
    draw: function(){
      // border/background for healthbar
      ig.system.context.fillStyle = "rgb(0,0,0)";
      ig.system.context.beginPath();
      ig.system.context.rect(
                (this.pos.x - ig.game.screen.x) * ig.system.scale,
                (this.pos.y - ig.game.screen.y - 8) * ig.system.scale,
                this.size.x * ig.system.scale, 4 * ig.system.scale);
      ig.system.context.closePath();
      ig.system.context.fill();

      // health for health bar
      ig.system.context.fillStyle = "rgb(255,0,0)";
      ig.system.context.beginPath();
      ig.system.context.rect(
                (this.pos.x - ig.game.screen.x + 1) * ig.system.scale,
                (this.pos.y - ig.game.screen.y - 7) * ig.system.scale,
                ((this.size.x - 2) * (this.health / this.maxHealth)) * ig.system.scale, 2 * ig.system.scale);
      ig.system.context.closePath();
      ig.system.context.fill();
      this.parent();
    }
  });

  EntityHitBox = ig.Entity.extend({
  	size: {x: 40, y: 60},
  	expired: false,

  	type: ig.Entity.TYPE.NONE,
  	checkAgainst: ig.Entity.TYPE.B, // Check Against B - our evil clone group
  	collides: ig.Entity.COLLIDES.PASSIVE,

  	animSheet: new ig.AnimationSheet( 'media/hitBox.png', 40, 60 ),

  	init: function( x, y, settings ) {
  		this.parent( x, y, settings );
  		// this.addAnim( 'idle', 0.2, [0] );
  	},

  	// This function is called when this entity overlaps anonther entity of the
  	// checkAgainst group. I.e. for this entity, all entities in the B group.
  	check: function( other ) {
  		other.receiveDamage( 10, this );
  	},

    update: function() {
      this.parent();

      if ( this.expired ) {
        this.kill();
      } else {
        this.expired = true;
      }
    }

  });

});
