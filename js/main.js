// Wrap script in self-invokig anonymous function
// http://forum.jquery.com/topic/jquery-anonymous-function-calls
(function (window) {
	// Save "Show links" button to variable
	var btn = $('a#show-links');

	// Declare two variables at once, one for each btn icon
	var openClass = 'icon-circle-arrow-down',
			closeClass = 'icon-circle-arrow-up',
			iconDiv = $('a#show-links :first-child');

	// Function to change btn icon
	function switchBtn() {
		
		// If btn is closed, switch to open icon
		if ( iconDiv.hasClass( openClass ) ) {
			
			// Replace open class with closed class
			iconDiv.removeClass( openClass ).addClass( closeClass );

		} else {
			
			// Do the opposite down here
			iconDiv.removeClass( closeClass ).addClass( openClass );

		}
	}

	// Run switchBtn function everytime 'btn' is clicked
	btn.on('click', switchBtn);

	// Force all links to open in new tab
	$('a').each(function(){
		$(this).attr('target', '_blank')
	});

}(window));

	;(function( $, window, document, undefined ){

	'use strict';

	var Cirro     = window.Cirro || {};
	var $window   = $(window);
	var	$document = $(document);

	// The ninedot singleton controller object
	var ImpactIntro = {

		init: function(){
			var self = this;

			self.win          = {};
			self.running 			= false;
			self.$html				= $("html, body");
			self.$docuHeight	= $(document).height();
			self.$flexsliders = $(".flexslider");
			self.$navButton   = $(".nav-button");
			self.$navigationz = $("#navigationz");

			// Testing scroll direction
			self.previousScroll = 0; 

			self.navigation();
			self.navButtonAnimation();
			self.defineWindowPosition();
			// self.navTextFadeOut();
			//self.flexslider();

			// Attach click handlers
	
		


	
		},

		defineWindowDimensions: function() {

			var self = this;

			self.win.height = $window.height();
			self.win.width  = $window.width();

		},

		defineWindowPosition: function() {

			var self = this;

			self.win.scrollTop = $window.scrollTop();
			console.log('jq', self.win.scrollTop);
		},

		navButtonAnimation: function() {

			var self = ImpactIntro;
			self.$navButton.hover(
				function(){
					var $this = $(this);
					$this.animate({
						borderRadius: '40px',
					}, 100, 'linear');
	 				
				},
				function(){
					var $this = $(this);
					$this.animate({
						borderRadius: '0px',
					}, 100, 'linear');
				}
			);
 		
		},

		navigation: function() {
			var self = this;
			var navTop = $window.scrollTop();
			var barStart = $('#top-banner').height();


			if (navTop <= barStart ) {
				self.$navigationz.css({ position: "absolute", top: barStart});
			} else {
				self.$navigationz.css({ position: "fixed", top: "-1px"});
			}
		},

		flexslider: function() {
			var self = this; 

			self.$flexsliders.flexslider({
				animation: "slide",
			//	keyboard: true,
			//	controlNav: false,
				directionNav: true,
				slideshowSpeed: 5000,
				slideshow: true,
			//	start: self.defineSubPositions(),
							
			});

		}, 


	}

	// Attach the object controller to the Cirro namespace
	Cirro.ImpactIntro = ImpactIntro;

	// Window load
	$window.load(function(){

		var $loader = $("div#loader");
		var $html   = $("html");

		// Show site after timeout
		setTimeout(function() {

			$html.css("overflow","auto");
			$loader.fadeOut();

		}, 500);

		// Initialize the singleton object controller
	ImpactIntro.init();

    
   


	});

	// Window scroll
	$window.scroll(function(){
		ImpactIntro.navigation();
	});	

	// Window resize
	$window.resize(function(){
	
	});

}( jQuery, window, document));

