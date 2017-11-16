(function ($) {

		/* =======================================================================
		 *  EVENTOS que chamam as funções declaradas acima ou de outras Libraries
		 * =======================================================================
		 */

		$(document).on('change', '[data-action="uploadImage"]', function () {
			var idInscricao = $(this).data('id-inscricao');
			var imgElement = '[data-foto-img="' + idInscricao + '"]';
			readUrlImageAndPreview(this, imgElement, '2M', true, callBackMaxFileSize);	

			var foto = $("#jform_foto-" + idInscricao).prop("files")[0];	
			uploadImage(foto, idInscricao)
		});
		

		/**
		 * Envia um ajax para fazer upload da imagem
		 *
		 * @param foto
		 * @param idInscricao
		*/
		function uploadImage(foto, idInscricao) {		
			var data = new FormData();
			data.append('id', idInscricao);
			data.append('jform[foto][]', foto);
			
			tAjax(Joomla.JUri.base() + 'index.php?option=com_smarteventos&task=inscricaoform.uploadImage&format=json', data, 'POST', 'json', callBackUploadImage);
		}

		/**
		 * CallBack do ajax de upload da imagem
		 *
		 * @param response
		*/
		callBackUploadImage = function (response) {
			
			if (response.success) {

				swal({
					customClass:        'inscricao-alert',
					title:              Joomla.JText._('MOD_JOGOSANAMATRA_UPLOAD_IMAGE_TITLE'),
					text:               Joomla.JText._('MOD_JOGOSANAMATRA_UPLOAD_IMAGE_MESSAGE'),
					type:               'success',
					buttonsStyling:     false,
					confirmButtonClass: 'btn btn-success btn-lg',
					timer:              3000
				});
			
			}else{

				swal({
					customClass:        'inscricao-alert',
					title:              Joomla.JText._('MOD_JOGOSANAMATRA_UPLOAD_IMAGE_ERROR_TITLE'),
					text:               Joomla.JText._('MOD_JOGOSANAMATRA_UPLOAD_IMAGE_ERROR_MESSAGE') + maxFileSize,
					type:               'warning',
					buttonsStyling:     false,
					confirmButtonClass: 'btn btn-success btn-lg',
					timer:              3000
				});
			}	
		}

		/**
		 * Exibir mensagem de alerta que a imagem excede o tamanho permitido e retornar o campo para a imagem default
		 * Chamado como callBack de erro do método readUrlImageAndPreview (assim que uma imagem é inserida)
		 * @param {element} input
		 */
		callBackMaxFileSize = function (input) {
			var maxFileSize = '2M';

			// Limpando img e input quando o uploadder errado
			input = $(input);

			input.val('');
			var imageTab = input.attr('data-foto-input');
			$('[data-foto-img="' + imageTab + '"]').attr('src', Joomla.JUri.base() + 'components/com_smarteventos/assets/img/avatar.jpg');

			swal({
				customClass:        'inscricao-alert',
				title:              Joomla.JText._('COM_SMARTEVENTOS_IMAGE_FILE_SIZE_LIMIT_TITLE'),
				text:               Joomla.JText._('COM_SMARTEVENTOS_IMAGE_FILE_SIZE_LIMIT_TEXT') + maxFileSize,
				type:               'warning',
				buttonsStyling:     false,
				confirmButtonClass: 'btn btn-success btn-lg',
				timer:              3000
			});
		};	

	}

	(window.jQuery.noConflict(), window, document)
);
