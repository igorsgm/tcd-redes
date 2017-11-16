js = jQuery.noConflict();

var qtd;

js(document).ready(function () {
	logCount();
});


function logCount() {
	setTimeout(function () {
		js.ajax({
			url: juri_base + 'index.php?option=com_ajax&plugin=logrestful&log=true&format=json',
			success: function (data) {
				if (qtd != data.data[0]) {
					qtd = data.data[0];
				}
			}, dataType: "json", complete: logCount
		});
	}, 30000);
}