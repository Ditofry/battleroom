ig.module(
	'game.entities.puck-two'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityPuckTwo = ig.Entity.extend({
		size: { x: 83.2, y: 83},
		type: ig.Entity.TYPE.B,
		collides: ig.Entity.COLLIDES.ACTIVE,

		animSheet: new ig.AnimationSheet('media/niccagerotatingzorz.png', 83.2	, 83 ),

		bounciness: 1,

		init: function(x, y, settings){
		//	if(puckLocation>768 || puckLocation<0){
				this.parent( 300, 300, settings);
		//	}
			//pulsing animation for puck
			this.addAnim('idle', 0.2	,[0 ]); // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

			this.vel.x = 400;
			this.vel.y = 400;

			this.maxVel.x = 400;
			this.maxVel.y = 400;

		},
		check:function(){

		}
	});
});