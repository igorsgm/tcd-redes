(function ($) {

	$(document).ready(function () {
		treatActionFormsShowing();
	});

	/**
	 * Tratar quais campos serão exibidos de acordo com a opção da Ação
	 * Chamada toda vez que há alguma alteração no no select das ações
	 */
	treatActionFormsShowing = function () {
		var fieldsToShow = [];
		switch (intval($('#jform_acao').val())) {
			case 0: // - Selecione uma ação -
				break;
			case 1: // Analisar chamado
				fieldsToShow = ['#submit-button'];
				break;
			case 2: // Transferir chamado
				fieldsToShow = ['#submit-button', '#jform_diretoria_transferencia'];
				break;
			case 4: // Devolver ao solicitante
			case 5: // Arquivar o chamado
			case 9: // Responder consulta
				fieldsToShow = ['#submit-button', '#jform_texto'];
				break;
			case 3: // Aguardar solicitante
			case 6: // Resolver o chamado
			case 8: // Comentar Este chamado (apenas quando for o criador do chamado)
				fieldsToShow = ['#submit-button', '#jform_texto', '#jform_anexo'];
				break;
			case 7: // Consulta interna
				fieldsToShow = ['#submit-button', '#jform_id_user_consultado', '#jform_texto'];
				break;
		}

		tHideElements(['#jform_id_user_consultado', '#jform_diretoria_transferencia', '#jform_texto', '#jform_anexo', '#submit-button'], true, false, true);
		tShowElements(fieldsToShow, true);
	};

	/**
	 * Finalizar o chamado pelo botão "Finalizar chamado" (apenas para o user final)
	 */
	finalizarSolicitacao = function () {
		swal({
			customClass:        'ouvidoria-alert',
			type:               'warning',
			title:              Joomla.JText._('COM_OUVIDORIA_MODAL_FINALIZAR_CHAMADO_TITLE'),
			html:               Joomla.JText._('COM_OUVIDORIA_MODAL_FINALIZAR_CHAMADO_HTML'),
			buttonsStyling:     false,
			confirmButtonClass: 'btn btn-success btn-lg',
			confirmButtonText:  Joomla.JText._('COM_OUVIDORIA_MODAL_FINALIZAR_CHAMADO_BTN_FINALIZAR'),
			cancelButtonClass:  'btn btn-danger btn-lg',
			cancelButtonText:   Joomla.JText._('COM_OUVIDORIA_MODAL_FINALIZAR_CHAMADO_BTN_CANCEL'),
			reverseButtons:     true,
			showCancelButton:   true,
			allowOutsideClick:  false
		}).then(function () { // Ao clicar em OK
			var data = {idSolicitacao: $('[data-action="finalizar-chamado"]').attr('data-solicitacao-id')};
			tAjax(Joomla.JUri.base() + 'index.php?option=com_ouvidoria&task=solicitacao.finalizarSolicitacao', data, 'POST', 'json', function (response) {
				window.location.reload();
			});
		});
	};

	/* =======================================================================
	 *  EVENTOS que chamam as funções declaradas acima ou de outras Libraries
	 * =======================================================================
	 */

	$(document).on('change', '#jform_acao', treatActionFormsShowing);
	$(document).on('click', '[data-action="finalizar-chamado"]', function (e) {
		e.preventDefault();
		finalizarSolicitacao();
	});

}(window.jQuery.noConflict(), window, document));