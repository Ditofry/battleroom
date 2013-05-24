ig.module(
	'game.entities.puck'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityPuck = ig.Entity.extend({
		size: { x: 83.2, y: 83},
		type: ig.Entity.TYPE.B,
		collides: ig.Entity.COLLIDES.ACTIVE,

		animSheet: new ig.AnimationSheet('media/niccagerotatingzorz.png', 83.2	, 83 ),

		bounciness: 1,

		init: function(x, y, settings){
			this.parent( x, y, settings);

			//pulsing animation for puck
			this.addAnim('idle', 0.2	,[0 ]); // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

			this.vel.x = 400;
			this.vel.y = 400;

			this.maxVel.x = 400;
			this.maxVel.y = 400;
			// spawnPuck: function(x, y){

			// 	this.parent(x, y, settings);
			// 	var NewPuck = new EntityPuck(x, y)
			// }
		
		},
    check: function( ) {
		 	var puck_number = 1;
			

			if(puckLocation > 768 || puckLocation < 0){
				//	setTimeout(function(){
				//	var self=this;	
						self.puck_number = 2;
					//}, 50);	
				this.kill();
			}
        
    }		

	});
});