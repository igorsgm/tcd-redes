(function ($) {

	/**
	 * Consulta a lista de views presentes no componente
	 */
	function makeAjaxViewList() {

		// O número do item group
		var groupNumber   = $(this).attr('name').onlyNumbers(),
		    componentName = $(this).val();

		$.ajax({
			url:      Joomla.JUri.root() + 'index.php?option=com_ajax&plugin=thomisticusexcel&format=json',
			type:     'POST',
			data:     {
				method:        'getComponentViews',
				componentName: componentName,
				admin:         true
			},
			dataType: 'html',
			success:  function (data) {
				listViewsOfComponent(data, groupNumber);
			}
		});
	}

	/**
	 * Exibir a lista de de views do componente no select
	 *
	 * @param string    data          Response do makeAjaxViewList
	 * @param int       groupNumber   Número do grupo, ou seja, row do repeatable do Joomla!
	 */
	function listViewsOfComponent(data, groupNumber) {
		var views       = JSON.parse(data).data[0],
		    selectViews = $('select[name="jform[params][enabled][enabled' + groupNumber + '][view]"]');

		selectViews.find('option').remove().end();

		$.each(views, function (i, view) {
			selectViews.append($('<option></option>').val(view).html(view));
		});

		selectViews.trigger('liszt:updated');
	}

	/**
	 * Consultar a lista de atributos
	 */
	function makeAjaxAttributes() {

		// O número do item group
		var groupNumber   = $(this).attr('name').onlyNumbers(),
		    componentName = $('select[name="jform[params][enabled][enabled' + groupNumber + '][component]"]').val(),
		    viewName      = $(this).val();

		$.ajax({
			url:      Joomla.JUri.root() + 'index.php?option=com_ajax&plugin=thomisticusexcel&format=json',
			type:     'POST',
			data:     {
				method:        'getModelItemsAttributes',
				componentName: componentName,
				viewName:      viewName,
				admin:         true
			},
			dataType: 'html',
			success:  function (data) {
				data = JSON.parse(data).data[0];

				// Exibir os erros caso entre no catch do método getModelItemsAttributes do plugin
				if (isset(data['messages'])) {
					Joomla.renderMessages(data['messages']);
					delete data['messages'];
				}

				makeColumnsTable(groupNumber, data);
			}
		});
	}

	/**
	 * Criar a tabela com os atributos da view (getItems ou xml)
	 *
	 * @param int groupNumber   Número do grupo, ou seja, row do repeatable do Joomla!
	 * @param array attributes
	 */
	function makeColumnsTable(groupNumber, attributes) {

		var tableData = [];
		$.each(attributes, function (i, attribute) {
			tableData.push({attribute: attribute});
		});

		var table = '<br><table data-table="attributes" data-toggle="table" data-click-to-select="true">\n    <thead>\n    <tr>\n        <th data-field="state" data-checkbox="true"></th>\n        <th data-field="attribute">Atributo</th>\n    </tr>\n    </thead>\n</table>';
		$('tr[data-group="enabled' + groupNumber + '"] td:first-child').append(table);
		$('[data-table="attributes"]').bootstrapTable({data: tableData});
	}

	$(document).on('change', '.component-selected', makeAjaxViewList);
	$(document).on('change', '.view-selected', makeAjaxAttributes);

}(window.jQuery.noConflict(), window, document));