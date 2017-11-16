(function ($) {

	$(document).ready(function () {
		$('select').chosen({
			placeholder_text_single:   Joomla.JText._('JGLOBAL_SELECT_AN_OPTION'),
			placeholder_text_multiple: Joomla.JText._('JGLOBAL_SELECT_SOME_OPTIONS'),
			no_results_text:           Joomla.JText._('JGLOBAL_SELECT_NO_RESULTS_MATCH')
		});

		$('select').chosen().chosenReadonly();
	});

	base_url = new RegExp(/^.*\//).exec(window.location.href)[0].replace('/administrator', '');


	/* =======================================================================
	 *                              PLUGINS
	 * =======================================================================
	 */

	/**
	 * Plugin para verificar se um element possui determinado atributo
	 * @param name           Nome do atributo
	 * @returns {boolean}   true quando possuir
	 */
	$.fn.hasAttr = function (name) {
		var attr = this.attr(name);
		return (typeof attr !== typeof undefined && attr !== false);
	};

	/**
	 * Remover elementos de um array de acordo com o valor
	 * @returns {Array}     o array sem os elementos informados
	 */
	Array.prototype.removeByValue = function () {
		var element, L = arguments.length, aux;
		while (L && this.length) {
			element = arguments[--L];
			while ((aux = this.indexOf(element)) !== -1) {
				this.splice(aux, 1);
			}
		}
		return this;
	};


	/**
	 * Limpar determinados elementos de um array (Ex: para remover os undefined de um array, myArray.clean(undefined))
	 * @param valueToDelete
	 * @returns {Array}
	 */
	Array.prototype.clean = function (valueToDelete) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == valueToDelete) {
				this.splice(i, 1);
				i--;
			}
		}
		return this;
	};


	/**
	 * Validar campos utilizando o método da library formValidation
	 * (Parâmetros: Atributos name dos elementos que serão resetados)
	 * @read http://formvalidation.io/api/#validate-field
	 */
	$.fn.validateFields = function () {
		if (!empty(arguments)) {
			var formValidation = $(this);

			$.each(arguments, function (i, name) {
				formValidation.formValidation('updateStatus', name, 'NOT_VALIDATED')
					.formValidation('validateField', name);
			});
		}
	};


	/* =======================================================================
	 *                              GENERAL
	 * =======================================================================
	 */

	tojQuery = function (data) {
		return (data instanceof jQuery) ? data : $(data);
	};

	/**
	 * Retorna um parâmetro da URL
	 *
	 * @param param = o parâmetro da query string
	 * @param fromParent = Se é para verificar de uma janela pai (útil quando é verificado via iframe dentro de outra página)
	 * @returns {boolean|string}
	 */
	tGetUrlParameter = function (param, fromParent) {
		fromParent = fromParent || false;

		var window_url = (fromParent === true ? window.parent : window);

		var sPageURL      = decodeURIComponent((window_url.location.search.substring(1))),
		    sURLVariables = sPageURL.split('&'),
		    sParameterName,
		    i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === param) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};

	/**
	 * Esconder um ou mais elementos
	 *
	 * @param {Array}   elementsToHide    = array de elementos que serão escondidos quando a página carregar
	 * @param {boolean} checkParents      = boolean se é pra ocultar os dois parentes (útil quando quer ocultar o control-group)
	 * @param {boolean} removeRequired    = Se for para remover a propriedade de required para todos os campos que serão removidos
	 * @param {boolean} resetField        = true se for para limpar o campo
	 */
	tHideElements = function (elementsToHide, checkParents, removeRequired, resetField) {
		// False por padrão, caso o parâmetro não tenha sido enviado
		checkParents = checkParents || false;
		resetField   = resetField || false;

		$(elementsToHide).each(function (i, val) {
			var element = checkParents ? $(val).closest('.control-group') : $(val);

			if (resetField) {
				tResetFields(val);
			}

			if (removeRequired) {
				$(val).prop('required', false).removeClass('required').attr('aria-required', false);
			}

			element.hide();
		});
	};

	/**
	 * Exibir um ou mais elementos
	 *
	 * @param {Array}   elementsToShow    = array de elementos que serão exibidos
	 * @param {boolean} checkParents      = boolean se é pra ocultar os dois parentes (útil quando quer ocultar o control-group)
	 * @param {boolean} setRequired       = Se for para adicionar a propriedade de required para todos os campos que serão exibidos
	 */
	tShowElements = function (elementsToShow, checkParents, setRequired) {
		// False por padrão, caso o parâmetro não tenha sido enviado
		checkParents = checkParents || false;

		$(elementsToShow).each(function (i, val) {
			var element = checkParents ? $(val).closest('.control-group') : $(val);

			if (setRequired) {
				$(val).prop('required', true).addClass('required').attr('aria-required', true);
			}

			element.show().removeClass('hidden');
		});
	};

	/**
	 * Adicionar a classe disabled aos campos informados no array
	 *
	 * @param {Array}   elementsToDisable      = array de elementos que serão desabilitados
	 * @param {boolean} checkControlGroup      = boolean se é para ocultar os dois parentes (útil quando quer ocultar o control-group)
	 * @param {boolean} removeRequired         = Se for para remover a propriedade de required para todos os campos que serão desabilitados
	 */
	tDisableFields = function (elementsToDisable, checkControlGroup, removeRequired) {
		// False por padrão, caso o parâmetro não tenha sido enviado
		checkControlGroup = checkControlGroup || false;

		$(elementsToDisable).each(function (i, val) {
			var element = checkControlGroup ? $(val).closest('.control-group') : $(val);
			element.addClass('disabled').attr('disabled', 'true').css('pointer-events', 'none');

			if (removeRequired) {
				$(val).prop('required', false).removeClass('required').attr('aria-required', false);
			}

			// Se é um select do tipo Chosen
			if (element.prop("tagName") === 'SELECT' && !empty($(val).data('chosen'))) {
				element.chosen().chosenReadonly(true);
			}
		});
	};

	/**
	 * Remover a classe disabled aos campos informados no array
	 *
	 * @param {Array}   elementsToDisable   = array de elementos que serão desabilitados
	 * @param {boolean} checkControlGroup   = boolean se é para ocultar os dois parentes (útil quando quer ocultar o control-group)
	 * @param {boolean} setRequired         = Se for para setar a propriedade de required para todos os campos que serão exibidos
	 */
	tEnableFields = function (elementsToDisable, checkControlGroup, setRequired) {
		// False por padrão, caso o parâmetro não tenha sido enviado
		checkControlGroup = checkControlGroup || false;

		$(elementsToDisable).each(function (i, val) {
			var element = checkControlGroup ? $(val).closest('.control-group') : $(val);
			element.removeClass('disabled').removeAttr('disabled').css('pointer-events', '');

			if (setRequired) {
				$(val).prop('required', true).addClass('required').attr('aria-required', true);
			}

			// Se é um select do tipo Chosen
			if (element.prop("tagName") === 'SELECT' && !empty($(val).data('chosen'))) {
				element.chosen().chosenReadonly(false);
			}
		});
	};

	/**
	 * Esconder/exibir um ou mais elementos de acordo com o valor de um botão Yes/No
	 * Serve para ser executada on ready & on change
	 *
	 * @param fieldsetId         = id do fieldset que possui o botão Yes/No
	 *                             [ex: '#jform_notificar' possui a classe "btn-group-yesno radio"]
	 * @param labelHideElement   = texto do atributo "for" da label correspondente ao NÃO (SEM "#") para ocultar o(s)
	 *                             elemento(s) [ex: 'jform_notificar0']
	 * @param elementsToShowHide = array de elementos que serão escondidos quando o clicarem no labelHideElement
	 *                             [ex: ['#jform_notificacao_grupos']] --> Entre colchetes
	 * @param checkParents       = boolean se é pra ocultar os dois parentes (útil quando quer ocultar o control-group
	 * @param resetFields        = boolean caso deseje limpar os campos ao escondê-los.
	 */
	tShowHideElementsOnYesNoClick = function (fieldsetId, labelHideElement, elementsToShowHide, checkParents, resetFields) {

		// False por padrão, caso o parâmetro não tenha sido enviado
		checkParents = checkParents || false;
		resetFields  = resetFields || false;

		$(function ($) {
			$(fieldsetId).change(function () {
				var clickedId = $(this).find('label.active').attr('for');

				$(elementsToShowHide).each(function (i, elm) {
					var element = checkParents ? $(elm).closest('.control-group') : $(elm);

					if (clickedId === labelHideElement) {
						if (resetFields) {
							tResetFields(elm);
						}
						element.hide();
					} else {
						element.show();
					}
				});
			}).change();
		});
	};

	/**
	 * Resetar (retirar o que foi preenchido) de todos os campos dentro de determinado elemento
	 * Se for um elemento sem filhos, resetará apenas ele.
	 * @param {array|string} elements = string id do elemento [ex: '#myform']
	 */
	tResetFields = function (elements) {

		var resetSingleField = function (field) {
			var singleField = ['INPUT', 'SELECT', 'TEXTAREA'];

			// Se não for um campo específico, limpar todos dentro dele.
			if (singleField.indexOf($(field).prop("tagName")) === -1) {
				var specialElements = $(field).find('input:radio, input:checkbox');

				specialElements.removeAttr('checked').removeAttr('selected');
				specialElements.next().removeClass('btn-success btn-danger active');

				var normalElements = $(field).find('input:text, input:password, input:file, select, textarea');
				normalElements.val('').trigger('liszt:updated');

				return true;
			}

			$(field).val('').trigger('liszt:updated');
			$(field).removeAttr('checked').removeAttr('selected');
		};

		if (is_array(elements)) {
			$.each(elements, function (i, field) {
				resetSingleField(field);
			});
		} else {
			resetSingleField(elements);
		}
	};

	/**
	 * Resetar campos utilizando o método da library formValidation
	 *
	 * @param {string} formValidationAttr   Atributo do formulário que é validado pelo formValidation
	 * @param {array} elements              Atributo dos elementos que serão resetados
	 *
	 * @read http://formvalidation.io/api/#reset-field
	 */
	tResetFormValidationFields = function (formValidationAttr, elements) {
		if (!is_array(elements)) {
			elements = [elements];
		}

		if (!empty(elements)) {
			var formValidation = $(formValidationAttr).data('formValidation');

			$.each(elements, function (i, attr) {
				formValidation.resetField($(attr), true);
			});

			tResetFields(elements);
		}
	};

	/**
	 * Alternar checkboxes de acordo com o seu valor [ex: ao marcar SIM em uma, a outra deverá ser marcada como NÃO]
	 *
	 * @param fieldSetId            = id do fieldset que contém os botões de yes e no
	 * @param classesToCheck        = classes para serem verificadas se a label principal possui ou não, com pontos [ex: ".active .btn-success .btn-danger .btn-primary]
	 * @param classesToAddOrRemove  = classes para serem adicionadas ou removidas, sem pontos e sem vírgulas [ex: "active btn-success btn-danger btn-primary]
	 * @param labelToCheck          = label a ser verificada se possui as classesToAddOrRemove [ex: 'jform_retirada0']
	 * @param labelOnText1          = texto do atributo "for" da label correspondente ao SIM (SEM "#") a ser marcada como NÃO
	 * @param labelOffText1         = texto do atributo "for" da label correspondente ao NÃO (SEM "#") a ser marcada como SIM
	 */
	tChangeElementValueOnYesNo = function (fieldSetId, classesToCheck, classesToAddOrRemove, labelToCheck, labelOnText1, labelOffText1) {
		$(fieldSetId).on("click", function () {
			if ($("label[for='" + labelToCheck + "'").is(classesToCheck)) {
				$("label[for='" + labelOnText1 + "'").removeClass(classesToAddOrRemove);
				$("#" + labelOnText1).prop("checked", false);
				$("label[for='" + labelOffText1 + "'").addClass(classesToAddOrRemove);
				$("#" + labelOffText1).prop("checked", true);
			} else {
				$("label[for='" + labelOffText1 + "'").removeClass(classesToAddOrRemove);
				$("#" + labelOffText1).prop("checked", false);
				$("label[for='" + labelOnText1 + "'").addClass(classesToAddOrRemove);
				$("#" + labelOnText1).prop("checked", true);
			}
		});
	};

	/* =======================================================================
	 *                              SELECTS
	 * =======================================================================
	 */


	/*
	 * Readonly support for Chosen selects
	 * @version v1.0.6
	 * @link http://github.com/westonganger/chosen-readonly
	 */
	$.fn.chosenReadonly = function (isReadonly) {
		var elements = this.filter(function (i, item) {
			return $(item).data('chosen');
		});

		elements.on('chosen:updated', function () {
			var item = $(this);
			if (item.attr('readonly')) {
				var wasDisabled = item.is(':disabled');

				item.attr('disabled', 'disabled');
				item.data('chosen').search_field_disabled();

				if (wasDisabled) {
					item.attr('disabled', 'disabled');
				} else {
					item.removeAttr('disabled');
				}
			} else {
				item.data('chosen').search_field_disabled();
			}
		});

		if (isReadonly) {
			elements.attr('readonly', 'readonly');
		} else if (isReadonly === false) {
			elements.removeAttr('readonly');
		}

		elements.trigger('chosen:updated');

		return this;
	};

	/**
	 * Plugin para popular um select a partir de um objeto
	 *
	 * @param {object} options      No formato {value: text}
	 * @param {boolean} toClear     true por default. Irá limpar os campos do select
	 */
	$.fn.populateChosen = function (options, toClear) {
		toClear    = toClear || true;
		var select = this;

		if (toClear) {
			select.empty();
		}

		$.each(options, function (value, name) {
			select.append('<option value="' + value + '">' + name + '</option>');
		});

		select.trigger('liszt:updated').trigger("chosen:updated");
	};

	/**
	 * Selecionar um ou mais valores em um Multiple select
	 * @param {string} nameField
	 * @param {array} values = ex: ["10", "11"]
	 */
	tSelectValuesMultipleSelect = function (nameField, values) {
		$(nameField).val(values).trigger("liszt:updated");
	};

	/**
	 * Retorna um array dos option values de um select
	 * @param {string} selectAttr   atributo seletor do Select
	 * @returns {Array}             Array com values dos options do select
	 */
	tGetSelectOptionValues = function (selectAttr) {
		var options = [];

		$(selectAttr).find('option').each(function () {
			options.push($(this).val());
		});

		return options;
	};

	/**
	 * Método para renderizar selects com múltiplas opções
	 *
	 * @param nameView = string nome do arquivo da view [ex: se a view for items.php, será 'items']
	 * @param nameField = name do item no XML
	 * @param idForm = id do formulário na view (sem #)
	 */
	tRenderMultipleSelect = function (nameView, nameField, idForm) {

		$(document).ready(function () {
			$('input:hidden.' + nameField).each(function () {
				var name = $(this).attr('name');
				if (name.indexOf(nameField + 'hidden')) {
					$('#jform_' + nameField + ' option[value="' + $(this).val() + '"]').attr('selected', true);
				}
			});
			$("#jform_" + nameField).trigger("liszt:updated");

		});

		Joomla.submitbutton = function (task) {
			if (task === nameView + '.cancel') {
				Joomla.submitform(task, document.getElementById(idForm));
			} else {
				if (task !== nameView + '.cancel' && document.formvalidator.isValid(document.id(idForm))) {
					if ($('#jform_' + nameField + ' option:selected').length === 0) {
						$('#jform_' + nameField + ' option[value=0]').attr('selected', 'selected');
					}
					Joomla.submitform(task, document.getElementById(idForm));
				}
				else {
					alert('Formulário inválido');
				}
			}
		}
	};

	/**
	 * Evitar que a mesma option seja selecionada em mais de um select.
	 * Geralmente utilizado quando há mais de um select com as mesmas opções
	 *
	 * @param {Array}   selectsSelectorsToMonitor
	 */
	disableEqualOptionInAnotherSelect = function (selectsSelectorsToMonitor) {

		var selects = $(implode(', ', selectsSelectorsToMonitor));

		selects.change(function () {
			var selectedOption = $(this).val();

			if (selectedOption === "") {
				return false;
			}

			var otherSelectsSelectedOptions = [];
			selects.each(function () {
				otherSelectsSelectedOptions.push(this.value);
			});

			selects.not(this).each(function () {
				$('option', this).each(function () {
					var sel = $(this).val();
					if (sel === selectedOption) {
						$(this).prop('disabled', true);
					} else if (!in_array(sel, otherSelectsSelectedOptions)) {
						$(this).prop('disabled', false);
					}
				});
			});

			selects.trigger("liszt:updated");
		}).change(); // Trigger once to add options at load of first
	};

	/* =======================================================================
	 *                              DATES
	 * =======================================================================
	 */

	/**
	 * Formatar a data de yyyy-mm-dd para dd/mm/yyyy
	 * @returns {string}
	 */
	String.prototype.formatDate = function () {
		var date = this.match(/\d+/g), day = date[2], month = date[1], year = date[0];
		return day + '/' + month + '/' + year;
	};

	/**
	 * Retorna a data atual no formato SQL yyyy-mm-dd H:i:s
	 * @returns {string}
	 */
	tCurrentDate = function () {
		var dateTime = new Date();
		var date     = dateTime.getFullYear() + '-' + ("0" + (dateTime.getMonth() + 1)).slice(-2) + '-' + dateTime.getDate();
		var time     = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();

		return date + ' ' + time;
	};

	/**
	 * Retorna a idade a partir de uma data de nascimento no formato DD/MM/YYYY
	 * @param {string} birthdate     Data de nascimento no formato DD/MM/YYYY
	 * @param {string} limitDate     Caso seja fornecido, a idade será calculada até esta data, no formato DD/MM/YYYY
	 * @returns {number}    A idade
	 */
	tCalculateAge = function (birthdate, limitDate) {
		limitDate = limitDate || false;

		var arrayDate = birthdate.split("/");

		var limitYear, limitMonth, limitDay;
		if (limitDate) {
			var arrayLimitDate = limitDate.split("/");
			limitYear          = +arrayLimitDate[2];
			limitMonth         = +arrayLimitDate[1];
			limitDay           = +arrayLimitDate[0];
		} else {
			var date   = new Date;
			limitYear  = date.getFullYear();
			limitMonth = date.getMonth() + 1;
			limitDay   = date.getDate();
		}

		var yearBirthdate  = +arrayDate[2],
		    monthBirthdate = +arrayDate[1],
		    dayBirthdate   = +arrayDate[0],

		    age            = limitYear - yearBirthdate;

		if (limitMonth < monthBirthdate || limitMonth === monthBirthdate && limitDay < dayBirthdate) {
			age--;
		}

		return age < 0 ? 0 : age;
	};

	/* =======================================================================
	 *                              STRINGS
	 * =======================================================================
	 */

	/**
	 * Replace elements in a string.
	 *
	 * Eg: var myString = "{0} is my name, {1} is my age"
	 * myString.format("Thomas", "35"); // Returns "Thomas is my name, 35 is my age."
	 *
	 * @returns {string}
	 */
	String.prototype.format = function () {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function (match, number) {
			return !empty(args[number]) ? args[number] : '';
		});
	};

	/**
	 * Returns a masked string. Useful for formatting cpfs, cnpj, ceps, dates*
	 *
	 * @param {string} mask  format, eg: '000.000.000-00'
	 *
	 * @returns {string}
	 */
	String.prototype.mask = function (mask) {
		var masked = '';
		var k      = 0;

		for (i = 0; i <= mask.length - 1; i++) {
			if (mask[i] === '0') {
				if ((this[k]).length) {
					masked += this[k++];
				}
			}
			else {
				if ((mask[i]).length) {
					masked += mask[i];
				}
			}
		}

		return masked;
	};

	/**
	 * Sanitize a string to return only numbers
	 * @returns {string}
	 */
	String.prototype.onlyNumbers = function () {
		return this.replace(/[^0-9]/g, '');
	};

	/**
	 * Returns a formatted string in the Brazilian currency
	 * @returns {string}
	 */
	String.prototype.toReais = function () {
		return 'R$ ' + number_format(this, 2, ',', '.');
	};

	/**
	 * Plugin to remove accents/diacritics in a string
	 *
	 * @read https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
	 * @returns {string}
	 */
	String.prototype.removeDiacritics = function () {
		var defaultDiacriticsRemovalMap = [
			{
				'base':    'A',
				'letters': '\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'
			},
			{'base': 'AA', 'letters': '\uA732'},
			{'base': 'AE', 'letters': '\u00C6\u01FC\u01E2'},
			{'base': 'AO', 'letters': '\uA734'},
			{'base': 'AU', 'letters': '\uA736'},
			{'base': 'AV', 'letters': '\uA738\uA73A'},
			{'base': 'AY', 'letters': '\uA73C'},
			{'base': 'B', 'letters': '\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'},
			{'base': 'C', 'letters': '\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'},
			{
				'base':    'D',
				'letters': '\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779\u00D0'
			},
			{'base': 'DZ', 'letters': '\u01F1\u01C4'},
			{'base': 'Dz', 'letters': '\u01F2\u01C5'},
			{
				'base':    'E',
				'letters': '\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'
			},
			{'base': 'F', 'letters': '\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'},
			{
				'base':    'G',
				'letters': '\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'
			},
			{
				'base':    'H',
				'letters': '\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'
			},
			{
				'base':    'I',
				'letters': '\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'
			},
			{'base': 'J', 'letters': '\u004A\u24BF\uFF2A\u0134\u0248'},
			{
				'base':    'K',
				'letters': '\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'
			},
			{
				'base':    'L',
				'letters': '\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'
			},
			{'base': 'LJ', 'letters': '\u01C7'},
			{'base': 'Lj', 'letters': '\u01C8'},
			{'base': 'M', 'letters': '\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'},
			{
				'base':    'N',
				'letters': '\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'
			},
			{'base': 'NJ', 'letters': '\u01CA'},
			{'base': 'Nj', 'letters': '\u01CB'},
			{
				'base':    'O',
				'letters': '\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'
			},
			{'base': 'OI', 'letters': '\u01A2'},
			{'base': 'OO', 'letters': '\uA74E'},
			{'base': 'OU', 'letters': '\u0222'},
			{'base': 'OE', 'letters': '\u008C\u0152'},
			{'base': 'oe', 'letters': '\u009C\u0153'},
			{'base': 'P', 'letters': '\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'},
			{'base': 'Q', 'letters': '\u0051\u24C6\uFF31\uA756\uA758\u024A'},
			{
				'base':    'R',
				'letters': '\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'
			},
			{
				'base':    'S',
				'letters': '\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'
			},
			{
				'base':    'T',
				'letters': '\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'
			},
			{'base': 'TZ', 'letters': '\uA728'},
			{
				'base':    'U',
				'letters': '\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'
			},
			{'base': 'V', 'letters': '\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'},
			{'base': 'VY', 'letters': '\uA760'},
			{'base': 'W', 'letters': '\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'},
			{'base': 'X', 'letters': '\u0058\u24CD\uFF38\u1E8A\u1E8C'},
			{
				'base':    'Y',
				'letters': '\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'
			},
			{
				'base':    'Z',
				'letters': '\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'
			},
			{
				'base':    'a',
				'letters': '\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'
			},
			{'base': 'aa', 'letters': '\uA733'},
			{'base': 'ae', 'letters': '\u00E6\u01FD\u01E3'},
			{'base': 'ao', 'letters': '\uA735'},
			{'base': 'au', 'letters': '\uA737'},
			{'base': 'av', 'letters': '\uA739\uA73B'},
			{'base': 'ay', 'letters': '\uA73D'},
			{'base': 'b', 'letters': '\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'},
			{'base': 'c', 'letters': '\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'},
			{
				'base':    'd',
				'letters': '\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'
			},
			{'base': 'dz', 'letters': '\u01F3\u01C6'},
			{
				'base':    'e',
				'letters': '\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'
			},
			{'base': 'f', 'letters': '\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'},
			{
				'base':    'g',
				'letters': '\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'
			},
			{
				'base':    'h',
				'letters': '\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'
			},
			{'base': 'hv', 'letters': '\u0195'},
			{
				'base':    'i',
				'letters': '\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'
			},
			{'base': 'j', 'letters': '\u006A\u24D9\uFF4A\u0135\u01F0\u0249'},
			{
				'base':    'k',
				'letters': '\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'
			},
			{
				'base':    'l',
				'letters': '\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'
			},
			{'base': 'lj', 'letters': '\u01C9'},
			{'base': 'm', 'letters': '\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'},
			{
				'base':    'n',
				'letters': '\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'
			},
			{'base': 'nj', 'letters': '\u01CC'},
			{
				'base':    'o',
				'letters': '\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'
			},
			{'base': 'oi', 'letters': '\u01A3'},
			{'base': 'ou', 'letters': '\u0223'},
			{'base': 'oo', 'letters': '\uA74F'},
			{'base': 'p', 'letters': '\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'},
			{'base': 'q', 'letters': '\u0071\u24E0\uFF51\u024B\uA757\uA759'},
			{
				'base':    'r',
				'letters': '\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'
			},
			{
				'base':    's',
				'letters': '\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'
			},
			{
				'base':    't',
				'letters': '\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'
			},
			{'base': 'tz', 'letters': '\uA729'},
			{
				'base':    'u',
				'letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'
			},
			{'base': 'v', 'letters': '\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'},
			{'base': 'vy', 'letters': '\uA761'},
			{'base': 'w', 'letters': '\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'},
			{'base': 'x', 'letters': '\u0078\u24E7\uFF58\u1E8B\u1E8D'},
			{
				'base':    'y',
				'letters': '\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'
			},
			{
				'base':    'z',
				'letters': '\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'
			}
		];

		var diacriticsMap = {};
		for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
			var letters = defaultDiacriticsRemovalMap [i].letters;
			for (var j = 0; j < letters.length; j++) {
				diacriticsMap[letters[j]] = defaultDiacriticsRemovalMap [i].base;
			}
		}
		return this.replace(/[^\u0000-\u007E]/g, function (a) {
			return diacriticsMap[a] || a;
		});
	};


	/**
	 * Checks if a string contains another string
	 *
	 * @param {string}    specificString    stirng to check if inside this
	 * @param {boolean}   toLowerCase       if is to parse string to lower case
	 * @returns {boolean}
	 */
	String.prototype.contains = function (specificString, toLowerCase) {

		if (toLowerCase) {
			return this.toLowerCase().indexOf(specificString.toLowerCase()) >= 0;
		}

		return this.indexOf(specificString) >= 0;
	};

	/**
	 * MASKS
	 */


	/**
	 * Telephone mask with optional ninth digit
	 *
	 * Usage eg: $('#id').mask(tel9DigitMaskBehavior, telOptional9Digit);
	 * @param val
	 * @returns {string}
	 */
	tel9DigitMaskBehavior = function (val) {
		return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
	};
	telOptional9Digit = function () {
		return {
			onKeyPress: function (val, e, field, options) {
				field.mask(tel9DigitMaskBehavior.apply({}, arguments), options);
			}
		};
	};


	/* =======================================================================
	 *                              NUMBERS
	 * =======================================================================
	 */

	/**
	 * Convert computer format to bytes
	 *
	 * @param {string} from The value to convert to bytes, with metric prefix - according IS (eg: 2M, 1G)
	 *
	 * @read https://en.wikipedia.org/wiki/Metric_prefix
	 * @return bool|string
	 */
	convertToBytes = function (from) {
		var number = substr(from, 0, -1);
		var unit   = strtoupper(substr(from, -1));

		var expByUnit = {K: 1, M: 2, G: 3, T: 4, P: 5, E: 6, Z: 7, Y: 8};

		if (!isset(expByUnit[unit])) {
			return false;
		}

		return number * pow(1024, expByUnit[unit]);
	};


	/* =======================================================================
	 *                              IMAGES
	 * =======================================================================
	 */

	/**
	 * Preview an image before it is uploaded (should be called in a "change" input event)
	 *
	 * @param input Input Element to upload images
	 * @param {string}    imgAttr  Attribute to identify the img element (where image will be previewed)
	 * @param {string}    maxFileSize  Maximum file size (eg: '500K', '2M')
	 * @param {boolean}   asCssBackground   If it is to preview the image as background
	 * @param {function}  callBackMaxFileSize  Callback function if file exceeds maxFileSize in bytes
	 */
	readUrlImageAndPreview = function (input, imgAttr, maxFileSize, asCssBackground, callBackMaxFileSize) {
		maxFileSize         = convertToBytes(maxFileSize) || false;
		callBackMaxFileSize = callBackMaxFileSize || false;
		asCssBackground     = asCssBackground || false;


		if (input.files && input.files[0]) {
			var file = input.files[0];

			if (file.size > maxFileSize && typeof callBackMaxFileSize === 'function') {
				callBackMaxFileSize(input);
			} else {
				var reader    = new FileReader();
				reader.onload = function (e) {
					if (asCssBackground) {
						$(imgAttr).css('background-image', 'url(' + e.target.result + ')');
					} else {
						$(imgAttr).attr('src', e.target.result);
					}
				};

				reader.readAsDataURL(file);
			}
		}
	};

	/* =======================================================================
	 *                              FORMS
	 * =======================================================================
	 */


	/**
	 * Método para implementar um searchEngine numa lista <ul><li>
	 * Utilizado em Anamatra: index.php?option=com_jogosanamatra&view=inscricoes&Itemid=616
	 * @param           inputElement      Elemento input que será monitorado on keyup
	 * @param {string}  elementSelector   Seleor ul que contém os li's
	 */
	filterEngine = function (inputElement, elementSelector) {
		var value = $(inputElement).val().toLowerCase().removeDiacritics();

		$(elementSelector).each(function () {
			if ($(this).text().toLowerCase().removeDiacritics().search(value) > -1) {
				$(this).parents("li").show();
			}
			else {
				$(this).parents("li").hide();
			}
		});
	};


	/**
	 * Plugin para popular um formulário a partir dos dados de uma request
	 *
	 * @param data  Os dados que serão preenchidos no formulário
	 * @param onlyHiddens   Se é para popular apenas os campos que estão escondidos
	 * @param onlyIfEmpty   Inserir o valor do campo apenas se o seu value for vazio
	 */
	$.fn.populateJForm = function (data, onlyHiddens, onlyIfEmpty) {
		var form = this;

		if (form.prop("tagName") !== 'FORM') {
			return false;
		}

		onlyHiddens = onlyHiddens || false;
		onlyIfEmpty = onlyIfEmpty || false;

		$.each(data, function (column, value) {
			var element      = form.find('[name="jform[' + column + ']"]'),
			    validTags    = ['INPUT', 'SELECT', 'TEXTAREA'],
			    invalidTypes = ['radio', 'checkbox'],
			    fillElement  = !empty(element) && !in_array(element.attr('type'), invalidTypes) && in_array(element.prop("tagName"), validTags)
				    && (onlyHiddens ? element.attr('type') === 'hidden' : true) && (onlyIfEmpty ? empty(element.val()) : true);

			if (fillElement) {
				element.val(value).trigger('liszt:updated');
			}
		});
	}


	/* =======================================================================
	 *                              TABLES
	 * =======================================================================
	 */

	/**
	 * Plugin para retornar todos os tds de uma coluna específica [eg: $('#myTH').getTds()]
	 */
	$.fn.getTds = function () {
		var thIndex = this.index() + 1;

		return this.closest("table").find("tr td:nth-child(" + thIndex + ")");
	};

	/* =======================================================================
	 *                              AJAX
	 * =======================================================================
	 */

	/**
	 * Previnirá o submit padrão do form e o enviará via Ajax
	 * (Com semáforo que evita double submits)
	 *
	 * @param form
	 * @param {function}    successCallBack
	 */
	tAjaxOnFormSubmit = function (form, successCallBack) {

		form = tojQuery(form);

		form.submit(function (e) {
			e.preventDefault();
			e.stopImmediatePropagation();

			if (typeof lazyLoading === "function") {
				lazyLoading();
			}

			tAjax(form.attr('action'), new FormData(this), 'POST', 'json', successCallBack);
		});
	};

	/**
	 * Função genérica para realizar um Ajax
	 *
	 * @param url
	 * @param data
	 * @param type
	 * @param dataType
	 * @param successCallBack
	 * @param errorCallBack
	 */
	tAjax = function (url, data, type, dataType, successCallBack, errorCallBack) {

		successCallBack = successCallBack || false;
		errorCallBack   = errorCallBack || false;
		type            = type || 'POST';
		dataType        = dataType || 'json';

		var ajaxObj = {
			url:      url,
			type:     type,
			data:     data,
			dataType: dataType,
			success:  function (data) {
				if (typeof successCallBack === 'function') {
					successCallBack(data);
				}
			},
			error:    function (data) {
				if (typeof errorCallBack === 'function') {
					errorCallBack(data);
				}
			}
		};

		if (data instanceof FormData) {
			ajaxObj.contentType = false;
			ajaxObj.processData = false;
		}

		$.ajax(ajaxObj);
	};

}(window.jQuery.noConflict(), window, document));