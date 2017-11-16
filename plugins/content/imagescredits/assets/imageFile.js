(function ($) {

		$(document).on('ready',function () {
			var folder;
			$("#item-form").attr('enctype', 'multipart/form-data');	
			$("strong").text('30,00 MB');

			$('.post-formats input').on('click', function(){
		        checkFormate();
		    });

			$('#upload-submit').on('click', function(){
		    	
		    	var foto = $("#upload-file").prop("files")[0];
		    	folder   = $("#folderlist").val();
		    	
			    var numFiles  = document.getElementById("upload-file");
			    sessionStorage.setItem('numFiles', numFiles.files.length);
				
				var textFiles = $("#f_text").val();
				var regxFiles = new RegExp("fakepath");
				var res = regxFiles.test(foto);

				if (folder != '') {
					folder = res ? foto.replace(/C:\\fakepath\\*/g, folder) : folder;
				}

				if (typeof foto != 'undefined') {
		       		uploadFile(foto, folder);
				}
	
		    });
		});


		/**
		 * Envia um ajax para fazer upload da imagem
		 *
		 * @param foto
		 * @param idInscricao
		*/
		function uploadFile(foto, folder) {
			
			var data = new FormData();
			data.append('Filedata', foto);
			
			tAjax(Joomla.JUri.base() + 'index.php?option=com_media&task=file.upload&format=json&'+sessionName+'='+sessionId+'&'+sessionToken+'=1'+'&asset='+inputAsset+'&author='+inputAuthor+'&view=images&folder='+folder, data, 'POST', 'json', callBackUploadImage);
		}

		/**
		 * CallBack do ajax de upload da imagem
		 *
		 * @param response
		*/
		callBackUploadImage = function (response) {
			
			var data = {
				'status'   : response.status,
				'message'  : response.message,
				'error'    : response.error,
				'location' : response.location
			}

			data = JSON.stringify(data);
			sessionStorage.setItem('data', data);
			
			folder = $("#folderlist").val();

			var classAlert = response.status == 1 ? 'success' : 'error';
			numFiles  = sessionStorage['numFiles'];
			
			if (numFiles == 1 && response.status == 1 && arkimage != 1) {				
				
				$("#f_url").val(response.location);
				sessionStorage.clear();
				
				$('#click_insert').click();
			
			}else{

				$('#system-message-container').html('<div class="alert alert-'+classAlert+'"><button type="button" class="close" data-dismiss="alert">×</button><h4 class="alert-heading">Mensagem</h4><div class="alert-message">'+response.message+'</div></div>');
				sessionStorage.clear();
			}

			arkTipo = arkimage ? 'arkimage' : 'arkmedia';	
			var url = arkimage == null && arkmedia == null ? '/index.php?option=com_media&view=images&tmpl=component&asset=com_content&author=&fieldid=jform_images_image_intro&ismoo=0&folder='+folder : '/index.php?option=com_media&view=images&tmpl=component&e_name={EDITOR}&asset=com_content&'+arkTipo+'=1&author=';
			window.location.href = Joomla.JUri.base() + url;
		}

		

		function checkFormate(){

	        var formate = $('.post-formats input:checked').attr('value');

	        $('#jform_attribs_excluir_audio').closest('.control-group').hide();
	        
	        if(typeof formate != 'undefined'){
	            if(formate == 'audio') {
	                $('#jform_attribs_audio').closest('.control-group').show();
	                $('#jform_attribs_excluir_audio').closest('.control-group').show();
	            } 
	        }
	    }
	}

	(window.jQuery.noConflict(), window, document)
);
