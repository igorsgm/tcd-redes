// js = jQuery.noConflict();




// js('#finder').ready(function () {
// 	if (sessionStorage['busca'].length != 0) {
// 		js('#finder').val(sessionStorage['busca']);
// 		// js('#blankRadio3').attr('checked', true);
// 		js(sessionStorage['radios']).prop('checked', true);
		
// 	}
// });



// js(document).on('click', 'button[name="Search"]', function () {

// 	var input = js('#finder').val();
// 	var radio = js("input[name=blankRadio]:checked").id();
	
// 	sessionStorage['busca'] = input;
// 	sessionStorage['radios'] = radio;
	
// 	var radio3 = js('#blankRadio3').val();
// 	var option = js('input:checked').val();

// 	if (radio3 == option) {
// 		js('#finder').val('"' + input + '"');
// 	}else{
// 		replaceEmpty(input, option);
// 	}
	
// });


// function replaceEmpty(input, option){
	
// 	var radio2 = js('#blankRadio2').val();
// 	var radio4 = js('#blankRadio4').val();

// 	if (radio2 == option) {
		
// 		var input = input.replace(/\s/g," ou ");
// 		var result = js('#finder').val(input);
		
// 		return result;

// 	}else if(radio4 == option){
		
// 		var input = input.replace(/\s/g," e ");
// 		var result = js('#finder').val(input);
		
// 		return result;
// 	}
// }
