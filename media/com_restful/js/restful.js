js = jQuery.noConflict();

/**
 * Assim que o documento estiver pronto, carregar o select com as tables
 */
js(document).ready(function () {
	formType = js('.form-validate').is('#resource-form') ? 'resource' : 'external_sender';
	var url = 'index.php?option=com_ajax&plugin=restful&format=json';
	clearSelectbox('#jform_table', '---', '#jform_table');
	makeAjax('', url, loadTables, 'GET');
});

/**
 * Chamar a função que carrega as colunas de acordo com a tabela selecionada, assim que o campo das tabelas for mudado.
 */
js(document).on('change', '#jform_table', function () {
	triggerLoadColumns(js(this).val());
});

/**
 * Ao clickar no checkbox #check_all irá marcar todos os checkboxes da table mais próxima
 */
js(document).on('click', '#check_all', function (e) {
	var table = js(e.target).closest('table');
	js('td input:checkbox', table).prop('checked', this.checked);
});

/**
 * Criar o JSON do Model Schema Relationship de acordo com as rows selecionadas
 */
js(document).on('change', '#tbl-mdl-schema', function () {
	js('#jform_model_schema').empty();

	var selectedRows = [];
	js('#tbl-mdl-schema tr').each(function () {
		if (js(this).find('td:eq(0) input').is(":checked")) {
			selectedRows.push({
				local: js(this).find('td:eq(1) input').val(),
				external: js(this).find('td:eq(2) input').val(),
				fromTo: js(this).find('td:eq(3) input').val()
			});
		}
	});

	// Setando o valor do campo para o JSON das linhas selecionadas
	js('#jform_model_schema').val(JSON.stringify(selectedRows));
});

/**
 * Carregar as colunas do resource fornecido (tabela)
 * @param resource = nome da tabela
 */
function triggerLoadColumns(resource) {
	resource = 'resource=' + resource;
	var url = 'index.php?option=com_ajax&plugin=restful&format=json';
	makeAjax(resource, url, loadModelSchema, 'GET');
}

/**
 * Carregar os dados do formulário
 */
function loadFormData() {
	js("#jform_table").val(selectedTable);
	triggerLoadColumns(selectedTable);
	markClientTableData(JSON.parse(modelSchema));
}

function markClientTableData(mdlSch) {
	js(document).one("ajaxStop", function () {
		js.each(mdlSch, function (i, row) {
			//Marcando a checkbox previamente marcada
			js("input[value='" + row.local + "']").prop('checked', true);
			// Setando o valor para a external database column
			js("input[value='" + row.local + "']:eq(2)").val(row.external);
			// Setando o valor do From/To
			js("[data-column='" + row.local + "']").val(row.fromTo);
		});

	});
}

/**
 * Carrear o select com todas as tabelas existentes no banco de dados
 * @param data = Lista de tabelas do banco de dados
 */
function loadTables(data) {
	tables = data.data[0];
	if (tables == false) {
		js("#jform_table").append('<option value="">Unloaded data</option>');
	} else {
		js.each(tables, function (i) {
			js("#jform_table").append("<option value=" + tables[i].table + ">" + tables[i].table + "</option>");
		});
	}

	// Se o formulário tiver uma tabela fornecida (edição), chamará a função de carregar os dados (apenas uma vez)
	if (selectedTable.length != 0) {
		js(document).one(loadFormData());
	}

	js("#jform_table").trigger("liszt:updated");
}

/**
 * Carregar a tabela de relacionamento
 * @param data = as colunas da tabela, vindas do banco de dados
 */
function loadModelSchema(data) {

	clearSelectbox('#tbl-mdl-body', '', '');
	if (js("#jform_table").val() != selectedTable) {
		js('#jform_model_schema, #jform_model_schema').empty();
	}

	columns = data.data[0];
	if (columns == false) {
		js("#tbl-mdl-body").append('<td>Unloaded data. Please, refresh the page.</td><td></td><td></td>');
	} else {
		js.each(columns, function (i) {
			js("#tbl-mdl-body").append('<tr><td><input type="checkbox" value="' + columns[i].column + '"></td><td><input data-input="local" type="text" value="' + columns[i].column + '" readonly="true" class="readonly required"/></td><td><input data-input="external" type="text" name="" value="' + columns[i].column + '" class="required"/></td><td><input data-column="' + columns[i].column + '" type="text" value=""/></td></tr>');
		});
	}
	js("#jform_columns").trigger("liszt:updated");
}

/**
 * Função genérica para realizar um Ajax
 *
 * @param data = dado que será enviado
 * @param url = url que será chamada
 * @param callBack = função callback que será chamada
 * @param method = tipo da requisição
 */
function makeAjax(data, url, callBack, method) {
	js.ajax({
		url: juri_base + url,
		type: method,
		data: data,
		dataType: 'json', /* Tipo de transmissão */
		success: function (data) {
			callBack(data);
		},
		error: function () {
			console.log(url);
			console.log('miss');
		}
	});
}

/**
 * Função para limpar os filhos de um campo (ex: selects, checkboxes, etc)
 *
 * @param selector = elemento que será limpo
 * @param defaultText = texto default para ser exibido após a limpeza do campo
 * @param elementToAppend = em qual elemento será appended o defaultText
 */
function clearSelectbox(selector, defaultText, elementToAppend) {
	js(selector).val("").attr('selected', 'selected');
	js(selector).children().remove();

	if (selector == elementToAppend) {
		js(selector).append('<option value="">' + defaultText + '</option>');
	}
}
