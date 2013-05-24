ig.module(
	'game.entities.paddle-player-two'
)
.requires(
	'game.entities.paddle'
)
.defines(function(){
	EntityPaddlePlayerTwo = EntityPaddle.extend({
		animSheet: new ig.AnimationSheet('media/niccagepaddlefinal.png' , 55, 83),
		update: function(){

		
			
			if (ig.input.state('up_two') ) {
				this.vel.y = 300
				this.maxVel.y = 300
			}
			else if (ig.input.state('down_two'))	{
				this.vel.y = -300

			}
			else{
				this.vel.y = 0
			}

				this.parent();
		}
});
});