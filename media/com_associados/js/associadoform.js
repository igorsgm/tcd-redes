(function ($) {
	$(document).ready(function () {
		$('input:hidden.situacao_do_associado').each(function () {
			var name = $(this).attr('name');
			if (name.indexOf('situacao_do_associadohidden')) {
				$('#jform_situacao_do_associado option[value="' + $(this).val() + '"]').attr('selected', true);
			}
		});

		$("#jform_situacao_do_associado").trigger("liszt:updated");
		$('input:hidden.estado').each(function () {
			var name = $(this).attr('name');
			if (name.indexOf('estadohidden')) {
				$('#jform_estado option[value="' + $(this).val() + '"]').attr('selected', true);
			}
		});
		$("#jform_estado").trigger("liszt:updated");
		$('input:hidden.cidade').each(function () {
			var name = $(this).attr('name');
			if (name.indexOf('cidadehidden')) {
				$('#jform_cidade option[value="' + $(this).val() + '"]').attr('selected', true);
			}
		});
		$("#jform_cidade").trigger("liszt:updated");
		$('input:hidden.eventos_que_participou_jogos_nacionais').each(function () {
			var name = $(this).attr('name');
			if (name.indexOf('eventos_que_participou_jogos_nacionaishidden')) {
				$('#jform_eventos_que_participou_jogos_nacionais option[value="' + $(this).val() + '"]').attr('selected', 'selected');
			}
		});
		$('#jform_eventos_que_participou_jogos_nacionais').change(function () {
			if ($('#jform_eventos_que_participou_jogos_nacionais option:selected').length == 0) {
				$("#jform_eventos_que_participou_jogos_nacionais option[value=0]").attr('selected', 'selected');
			}
		});
		$("#jform_eventos_que_participou_jogos_nacionais").trigger("liszt:updated");
		$('input:hidden.eventos_que_participou_conamat').each(function () {
			var name = $(this).attr('name');
			if (name.indexOf('eventos_que_participou_conamathidden')) {
				$('#jform_eventos_que_participou_conamat option[value="' + $(this).val() + '"]').attr('selected', 'selected');
			}
		});
		$('#jform_eventos_que_participou_conamat').change(function () {
			if ($('#jform_eventos_que_participou_conamat option:selected').length == 0) {
				$("#jform_eventos_que_participou_conamat option[value=0]").attr('selected', 'selected');
			}
		});
		$("#jform_eventos_que_participou_conamat").trigger("liszt:updated");
		$('input:hidden.eventos_que_participou_congresso_internacional').each(function () {
			var name = $(this).attr('name');
			if (name.indexOf('eventos_que_participou_congresso_internacionalhidden')) {
				$('#jform_eventos_que_participou_congresso_internacional option[value="' + $(this).val() + '"]').attr('selected', 'selected');
			}
		});
		$('#jform_eventos_que_participou_congresso_internacional').change(function () {
			if ($('#jform_eventos_que_participou_congresso_internacional option:selected').length == 0) {
				$("#jform_eventos_que_participou_congresso_internacional option[value=0]").attr('selected', 'selected');
			}
		});
		$("#jform_eventos_que_participou_congresso_internacional").trigger("liszt:updated");
		$('input:hidden.eventos_que_participou_encontro_aposentados').each(function () {
			var name = $(this).attr('name');
			if (name.indexOf('eventos_que_participou_encontro_aposentadoshidden')) {
				$('#jform_eventos_que_participou_encontro_aposentados option[value="' + $(this).val() + '"]').attr('selected', 'selected');
			}
		});
		$('#jform_eventos_que_participou_encontro_aposentados').change(function () {
			if ($('#jform_eventos_que_participou_encontro_aposentados option:selected').length == 0) {
				$("#jform_eventos_que_participou_encontro_aposentados option[value=0]").attr('selected', 'selected');
			}
		});
		$("#jform_eventos_que_participou_encontro_aposentados").trigger("liszt:updated");
	});
}(window.jQuery.noConflict(), window, document));