ig.module(
	'game.entities.paddle'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityPaddle = ig.Entity.extend({
		size: {x:55, y:83},
		collides: ig.Entity.COLLIDES.FIXED,

		animSheet: new ig.AnimationSheet('media/niccagepaddlefinal.png', 55,83),

		init: function(x, y, settings){
			this.parent( x, y, settings);

			this.addAnim('idle', 1, [0] );

		}
	});
});