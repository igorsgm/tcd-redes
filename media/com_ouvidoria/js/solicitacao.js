(function ($) {
	/**
	 * FIELDS
	 */
	addMasks = function () {
		$('#jform_cpf, #jform_cpf_consulta').mask('000.000.000-00');
		$('#jform_telefone').mask(tel9DigitMaskBehavior, telOptional9Digit);
	};

	/**
	 * Verificar os campos que devem ser bloqueados
	 * Chamado na view do solicitacaoform
	 */
	checkFieldsToBlock = function () {
		if (isLogged && isAssociado) {
			tDisableFields(['#jform_is_associado', '#jform_cpf', '#jform_nome', '#jform_email', '#jform_telefone', '#jform_amatra'], true, false, false);
		}
	}

	/**
	 * Requisição para trazer a URL de redirecionamento da view de login quando o usuário ainda não estiver logado
	 * Chamada quando é clicado em "Associado à Amatra" = SIM
	 */
	function verifyIsAssociadoAndNotLoggedInOnButtonClick() {
		if (!isLogged && $('#jform_is_associado1').is(':checked')) {

			tAjax(Joomla.JUri.base() + 'index.php?option=com_ouvidoria&task=solicitante.verifyIsAssociadoAndNotLoggedInOnButtonClick', {}, 'POST', 'json', function (response) {

				// URL da view de login, já com a URL de retorno para a view da solicitação
				var loginUrlWithRedirect = response.data;
				swal({
					customClass:        'ouvidoria-alert',
					type:               'info',
					title:              Joomla.JText._('COM_OUVIDORIA_MODAL_IS_ASSOCIADO_REDIRECT_LOGIN_TITLE'),
					html:               Joomla.JText._('COM_OUVIDORIA_MODAL_IS_ASSOCIADO_REDIRECT_LOGIN_HTML'),
					buttonsStyling:     false,
					confirmButtonClass: 'btn btn-success btn-lg',
					confirmButtonText:  Joomla.JText._('COM_OUVIDORIA_MODAL_IS_ASSOCIADO_REDIRECT_LOGIN_BTN_OK'),
					cancelButtonClass:  'btn btn-danger btn-lg',
					cancelButtonText:   Joomla.JText._('COM_OUVIDORIA_MODAL_IS_ASSOCIADO_REDIRECT_LOGIN_BTN_CANCEL'),
					reverseButtons:     true,
					showCancelButton:   true,
					allowOutsideClick:  false
				}).then(function () { // Ao clicar em OK
					window.location.replace(loginUrlWithRedirect);
				}, function () { // Ao clicar em cancelar
					tResetFields('#jform_is_associado');
					$('#jform_is_associado0').click();
				});

			});
		}
	}

	/**
	 * Requisição para trazer a URL de redirecionamento da view de login quando o usuário ainda não estiver logado
	 * Chamada após a verificação que procura os dados do solicitante
	 */
	function verifyIsAssociadoAndNotLoggedInOnCpfFilled() {

		var cpf = $('#jform_cpf').val().onlyNumbers();

		if (!isLogged && cpf.length === 11 && (!isSolicitante || isAssociado)) {
			tAjax(Joomla.JUri.base() + 'index.php?option=com_ouvidoria&task=solicitante.verifyIsAssociadoAndNotLoggedInOnCpfFilled', {cpf: cpf}, 'POST', 'json', function (response) {

				if (response.success) {
					var loginUrlWithRedirect = response.data;
					swal({
						customClass:        'ouvidoria-alert',
						type:               'info',
						title:              Joomla.JText._('COM_OUVIDORIA_MODAL_IS_ASSOCIADO_REDIRECT_LOGIN_TITLE'),
						html:               Joomla.JText._('COM_OUVIDORIA_MODAL_IS_ASSOCIADO_NOT_LOGGED_BY_CPF_FILLED_REDIRECT_LOGIN_HTML'),
						buttonsStyling:     false,
						confirmButtonClass: 'btn btn-success btn-lg',
						confirmButtonText:  Joomla.JText._('COM_OUVIDORIA_MODAL_IS_ASSOCIADO_REDIRECT_LOGIN_BTN_OK'),
						cancelButtonClass:  'btn btn-danger btn-lg',
						cancelButtonText:   Joomla.JText._('COM_OUVIDORIA_MODAL_IS_ASSOCIADO_REDIRECT_LOGIN_BTN_CANCEL'),
						reverseButtons:     true,
						showCancelButton:   true,
						allowOutsideClick:  false
					}).then(function () { // Ao clicar em OK
						window.location.replace(loginUrlWithRedirect);
					}, function () { // Ao clicar em cancelar
						tResetFields(['#jform_is_associado', '#jform_cpf']);
						isSolicitante = false;
						$('#jform_is_associado0').click();
					});
				}
			});
		}
	}

	/**
	 * Callback do envio dos dados do solicitante. Preenche os dados hidden do solicitante assim que ele é submitted
	 * (Para evitar que seja criado um novo solicitante ao invés de editá-lo)
	 *
	 * @param object    response    Response da request Ajax
	 */
	function solicitanteSubmissionCallback(response) {
		console.log("Salvando dados dos solicitante.");

		if (!response.success) {
			Joomla.renderMessages({error: response.data});
		}

		var solicitante = response.data;

		$('[data-form="solicitante"]').populateJForm(solicitante, true, true);

		$('[data-panel="solicitacao"]').removeClass('hidden');
	}

	/**
	 * Callback do envio dos dados da solicitação, apresentando a modal de sucesso
	 *
	 * @param object    response    Response da request Ajax
	 */
	function solicitacaoSubmissionCallback(response) {
		if (!response.success) {
			Joomla.renderMessages({error: response.data});
			return false;
		}

		swal({
			customClass:        'ouvidoria-alert',
			buttonsStyling:     false,
			confirmButtonClass: 'btn btn-success btn-lg',
			title:              Joomla.JText._('COM_OUVIDORIA_MODAL_SOLICITACAO_ENVIADO_SUCESSO_TITLE'),
			html:               response.message,
			type:               'success',
			allowOutsideClick:  false
		}).then(function () {
			location.reload();
		});
	}

	/**
	 * Consultar se existe o Solicitante na base de dados e fazer o carregamento dos dados
	 * Chamado ao ter alteração no campo de CPF do solicitante
	 */
	function getSolicitanteData() {
		var cpf = $('#jform_cpf').val().onlyNumbers();

		if (cpf.length === 11) {
			console.log('Verificando se CPF existe na base de dados dos solicitantes');
			tAjax(Joomla.JUri.base() + 'index.php?option=com_ouvidoria&task=solicitante.getSolicitanteByCpf', {cpf: cpf}, 'POST', 'json', function (response) {

				isAssociado = response.data.is_associado;

				if (!response.success || isAssociado) {
					console.log(response.message);
					verifyIsAssociadoAndNotLoggedInOnCpfFilled();
					return false;
				}

				console.log("Solicitante encontrado na base de dados dos solicitantes.");

				var solicitante = response.data;

				$('[data-form="solicitante"]').populateJForm(solicitante);
				tResetFields('#jform_is_associado');
				$('#jform_is_associado' + solicitante.is_associado).click();
				isSolicitante = true;
				verifyIsAssociadoAndNotLoggedInOnCpfFilled();
			});
		}
	}

	/* =======================================================================
	 *  EVENTOS que chamam as funções declaradas acima ou de outras Libraries
	 * =======================================================================
	 */
	$(document).on('click', '#jform_is_associado1', verifyIsAssociadoAndNotLoggedInOnButtonClick);

	$('[data-form="solicitante"]').ready(function () {
		tAjaxOnFormSubmit('[data-form="solicitante"]', solicitanteSubmissionCallback);
	});

	$('[data-form="solicitacao"]').ready(function () {
		tAjaxOnFormSubmit('[data-form="solicitacao"]', solicitacaoSubmissionCallback);
	});

	$(document).on('input change', '#jform_cpf', function () {
		getSolicitanteData();
	});

}(window.jQuery.noConflict(), window, document));