(function ($) {
	
	//Slow scrolling
	$(document).on('click', '.scroll', function (event) {
		event.preventDefault();
		$('html,body').animate({scrollTop: $(this.hash).offset().top}, 800);
	});

}(window.jQuery.noConflict(), window, document));