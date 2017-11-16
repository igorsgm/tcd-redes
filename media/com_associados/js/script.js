js = jQuery.noConflict();

js(document).ready(function () {

	var uf;

	//alteracao do atributo name do campo para gravacao de dados
	js("#jform_cidade").attr('name', 'jform[cidade]');

	//alteracao inclusao acao funcao carrega cidades ao selecionar uf
	js("#jform_estado").change(function (event) {

		uf = js(this).val();

		js("#jform_cidade").val("").attr('selected', 'selected');

		js("#jform_cidade").children().remove();
		js("#jform_cidade").append('<option value=""> --- </option>');
		carregaCidades();
		js("#jform_cidade").trigger("liszt:updated");

	});

	function carregaCidades() {
		path_json = juri_base + "index.php?option=com_ajax&plugin=cidades&format=json&estado=" + uf;
		var returnValue;
		js.ajax({
			async: false,
			dataType: 'json',
			url: path_json,
			success: function (data) {
				cidade = data.data[0];
				if (cidade == false) {
					//alert('Dados nao carregados');
					js("#jform_cidade").append('<option value="">Dados não carregados</option>');
					returnValue = false;
				} else {
					js.each(cidade, function (i) {
						js("#jform_cidade").append("<option value=" + cidade[i].id + ">" + cidade[i].nm_cidade + "</option>");
					});
				}
			}
		});

		return returnValue;
	}

	//Limpa lista do Selectbox
	function clearSelectbox(selector, defaultText) {

		js(selector).val("").attr('selected', 'selected');

		js(selector).children().remove();
		js(selector).append('<option value="">' + defaultText + '</option>');

	}

	//Máscaras --> Precisa importar o arquivo /media/com_associados/js/jquery.inputmask.bundle.min.js
	js("#jform_cpf").inputmask('999.999.999-99');
	js("#jform_cep").inputmask('99999-999');
	js('#jform_fone_residencial, #jform_fone_comercial, #jform_fone_fax, #jform_fone_celular').mask(tel9DigitMaskBehavior, telOptional9Digit);
	js('#jform_naturalidade, #jform_nome, #jform_email, #jform_naturalidade, #jform_orgao_expeditor,' +
		' #jform_cargo_associado_honorario, #jform_endereco, #jform_numero, #jform_complemento, #jform_bairro, ' +
		'#jform_observacoes, #jform_email, #jform_email_alternativo, input[name*="dependente_nome"]').keyup(function () {
		this.value = makeSortString(this.value).toUpperCase();
	});

	// Máscara das datas
	js("#jform_nascimento, #jform_data_emissao, #jform_dt_ingresso_magistratura, #jform_dt_filiacao_anamatra").inputmask("d/m/y");

	// Máscaras dos dependentes
	js("input[name*='dependente_cpf']").inputmask("999.999.999-99");
	js("input[name*='dependente_nascimento']").inputmask("d/m/y");
	js(document).on("subform-row-add", function (event, row) {
		js('input[name*="dependente_nome"]').keyup(function () {
			this.value = makeSortString(this.value).toUpperCase();
		});
		js("input[name*='dependente_nascimento']").inputmask("d/m/y");
		js("input[name*='dependente_cpf']").inputmask("999.999.999-99");
	});


});

var makeSortString = (function () {
	var translateRegex = /[àáâäæãåāÀÁÂÄÆÃÅĀèéêëēėęÈÉÊËĒĖĘîïíīįìÎÏÍĪĮÌôöòóœøōõÔÖÒÓŒØŌÕûüùúūÛÜÙÚŪÇç]/g;
	var translate = {
		"à": "a", "á": "a", "â": "a", "ä": "a", "æ": "a", "ã": "a", "å": "a", "ā": "a",
		"À": "A", "Á": "A", "Â": "A", "Ä": "A", "Æ": "A", "Ã": "A", "Å": "A", "Ā": "A",
		"è": "e", "é": "e", "ê": "e", "ë": "e", "ē": "e", "ė": "e", "ę": "e",
		"È": "E", "É": "E", "Ê": "E", "Ë": "E", "Ē": "E", "Ė": "E", "Ę": "E",
		"î": "i", "ï": "i", "í": "i", "ī": "i", "į": "i", "ì": "i",
		"Î": "I", "Ï": "I", "Í": "I", "Ī": "I", "Į": "I", "Ì": "I",
		"ô": "o", "ö": "o", "ò": "o", "ó": "o", "œ": "o", "ø": "o", "ō": "o", "õ": "o",
		"Ô": "O", "Ö": "O", "Ò": "O", "Ó": "O", "Œ": "O", "Ø": "O", "Ō": "O", "Õ": "O",
		"û": "u", "ü": "u", "ù": "u", "ú": "u", "ū": "u",
		"Û": "U", "Ü": "U", "Ù": "U", "Ú": "U", "Ū": "U",
		"ç": "c", "Ç": "c"
	};
	return function (string) {
		return ( string.replace(translateRegex, function (match) {
			return translate[match];
		}) );
	}
})();

