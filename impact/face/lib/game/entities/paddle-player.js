ig.module(
	'game.entities.paddle-player'
)
.requires(
	'game.entities.paddle'
)
.defines(function(){
	EntityPaddlePlayer = EntityPaddle.extend({
		animSheet: new ig.AnimationSheet('media/brandon_head.png' , 64, 83),
		update: function(){

		
			
			if (ig.input.state('down') ) {
				this.vel.y = 600
				this.maxVel.y = 600
			}
			else if (ig.input.state('up'))	{
				this.vel.y = -600
			

			}
			else{
				this.vel.y = 0
			}

				this.parent();
		}
});
});