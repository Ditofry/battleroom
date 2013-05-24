ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.paddle-player',
	'game.entities.paddle-cpu',
	'game.entities.paddle',
	'game.entities.paddle-player-two',
	'game.entities.puck',
	'game.entities.puck-two',	
	'game.levels.main'
)
.defines(function(){



 // this.mode = MyGame.MODE.INTRO1;
 // if (this.mode == MyGame.MODE.INTRO1){

 // 	this.loadlevel(levelIntro);
 // }

MyGame = ig.Game.extend({
	
 
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	//var playerTwoScore = 0;
	
	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.A, 'up_two' );
		ig.input.bind( ig.KEY.Z, 'down_two' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );

		// if(myGameMode == 1){
		// 	this.loadLevel(MyGameLevel);
		// }
		// this.mode = MyGame.MODE.INTRO1;

		this.loadLevel(LevelMain);

	},

	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();	

		var puck = this.getEntitiesByType(EntityPuck)[0];

		var randomLocationX = Math.random() * (500 - 200) + 200;
		var randomLocationY = Math.random() * (300 - 100) + 100;
		if(this.getEntitiesByType(EntityPuck) != undefined){
			var puckLocation = puck.pos.x;

			var count = 0;
			if(puckLocation > 768 || puckLocation<0){
				count = 1;
			}
		}
		if(count == 1){
			if(this.getEntitiesByType(EntityPuckTwo)[0] == undefined){
				this.spawnEntity(EntityPuckTwo, randomLocationX, randomLocationY);
		//		this.removeEntity(puck);
			}
		}
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();

		var puckTwo = this.getEntitiesByType(EntityPuckTwo);
		var puck = this.getEntitiesByType(EntityPuck)[0];
		
			var puckLocation = puck.pos.x;
			var puckLocationY = puck.pos.y;
	
		var playerOneScore = 0;
		var playerTwoScore = 0;

		
		if(puckLocation>768){
			
			playerOneScore++;
		} else if(puckLocation<0){
			playerTwoScore++;
			
		}

		if(this.getEntitiesByType(EntityPuckTwo)[0] != undefined){
			console.log(puckTwo);
		//	puckTwoLocation = puckTwo.pos.x;
			// if(puckTwoLocation>768){
				
			// 	playerTwoScore++;
			// } else if(puckTwoLocation<0){
				
			// 	playerOneScore++;
			// }
		}
	//console.log(this.getEntitiesByType(EntityPuckTwo)[0] != undefined);

	//	this.font.draw( playerTwoScore, ig.system.width -50, 50, ig.Font.ALIGN.RIGHT );
		this.font.draw('Brandon: ',50, 375);
		this.font.draw('Nic Cage: ',668, 375);
		this.font.draw(playerTwoScore, 708, 375);
		this.font.draw(playerOneScore, 90, 375);


	}

});



	
// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 768, 480, 1 );

});

