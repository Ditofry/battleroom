ig.module(
	'game.entities.paddle-cpu'
)
.requires(
	'game.entities.paddle',
	'game.entities.puck'
)
.defines(function(){
	EntityPaddleCpu = EntityPaddle.extend({
//		animSheet: new ig.AnimationSheet('media/niccagepaddlefinal.png' , 64, 83),
		update: function(){

			var puck = ig.game.getEntitiesByType( EntityPuck )[0];
			
			if (puck.pos.y + puck.size.y/2 > this.pos.y + this.size.y/2) {
				this.vel.y = 100
				this.maxVel.y = 400
			}
			else{
				this.vel.y = -100
			

			}
			this.parent();
		}
});
});