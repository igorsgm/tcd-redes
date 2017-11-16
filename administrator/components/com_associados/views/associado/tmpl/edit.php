<?php
/**
 * @version	CVS: 1.0.9
 * @package	Com_Associados
 * @author	 Trídia Criação <atendimento@tridiacriacao.com>
 * @copyright  2016 Trídia Criação
 * @license	GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
// No direct access
defined('_JEXEC') or die;

JHtml::addIncludePath(JPATH_COMPONENT . '/helpers/html');
JHtml::_('behavior.tooltip');
JHtml::_('behavior.formvalidation');
JHtml::_('formbehavior.chosen', 'select');
JHtml::_('behavior.keepalive');

// Import CSS
$document = JFactory::getDocument();
$document->addStyleSheet(JUri::root() . 'media/com_associados/css/form.css');

// Import JS
// $document->addScript(JUri::root() . 'media/com_associados/js/script.js');
$document->addScript(JUri::root() . 'media/com_associados/js/jquery.inputmask.bundle.min.js');
?>

<script type="text/javascript">
	//inclusao de variaveis necessarias a funcao cidades
	var juri_base = '<?php echo JURI::root(); ?>';
</script>

<script type="text/javascript">
	js = jQuery.noConflict();
	js(document).ready(function () {

		js('input:hidden.situacao_do_associado').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('situacao_do_associadohidden')) {
				js('#jform_situacao_do_associado option[value="' + js(this).val() + '"]').attr('selected', true);
			}
			js("#jform_situacao_do_associado ").attr("disabled", "disabled");
		});
		js("#jform_situacao_do_associado").trigger("liszt:updated");
		js('input:hidden.estado').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('estadohidden')) {
				js('#jform_estado option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js('input:hidden.estado').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('estadohidden')) {
				js('#jform_estado option[value="' + js(this).val() + '"]').attr('selected', true);
			}
			js("#jform_estado ").attr("disabled", "disabled");
		});
		js("#jform_estado").trigger("liszt:updated");
		js('input:hidden.cidade').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('cidadehidden')) {
				js('#jform_cidade option[value="' + js(this).val() + '"]').attr('selected', true);
			}
			js("#jform_cidade ").attr("disabled", "disabled");
		});
		js("#jform_cidade").trigger("liszt:updated");
		js('input:hidden.eventos_que_participou_jogos_nacionais').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('eventos_que_participou_jogos_nacionaishidden')) {
				js('#jform_eventos_que_participou_jogos_nacionais option[value="' + js(this).val() + '"]').attr('selected', true);
			}

		});
		js("#jform_eventos_que_participou_jogos_nacionais").trigger("liszt:updated");
		js('input:hidden.eventos_que_participou_conamat').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('eventos_que_participou_conamathidden')) {
				js('#jform_eventos_que_participou_conamat option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js("#jform_eventos_que_participou_conamat").trigger("liszt:updated");
		js('input:hidden.eventos_que_participou_congresso_internacional').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('eventos_que_participou_congresso_internacionalhidden')) {
				js('#jform_eventos_que_participou_congresso_internacional option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js("#jform_eventos_que_participou_congresso_internacional").trigger("liszt:updated");
		js('input:hidden.eventos_que_participou_encontro_aposentados').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('eventos_que_participou_encontro_aposentadoshidden')) {
				js('#jform_eventos_que_participou_encontro_aposentados option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js("#jform_eventos_que_participou_encontro_aposentados").trigger("liszt:updated");


	});

	Joomla.submitbutton = function (task) {
		if (task == 'associado.cancel') {
			Joomla.submitform(task, document.getElementById('associado-form'));
		}
		else {

			if (task != 'associado.cancel' && document.formvalidator.isValid(document.id('associado-form'))) {

				if (js('#jform_eventos_que_participou_jogos_nacionais option:selected').length == 0) {
					js("#jform_eventos_que_participou_jogos_nacionais option[value=0]").attr('selected', 'selected');
				}
				if (js('#jform_eventos_que_participou_conamat option:selected').length == 0) {
					js("#jform_eventos_que_participou_conamat option[value=0]").attr('selected', 'selected');
				}
				if (js('#jform_eventos_que_participou_congresso_internacional option:selected').length == 0) {
					js("#jform_eventos_que_participou_congresso_internacional option[value=0]").attr('selected', 'selected');
				}
				if (js('#jform_eventos_que_participou_encontro_aposentados option:selected').length == 0) {
					js("#jform_eventos_que_participou_encontro_aposentados option[value=0]").attr('selected', 'selected');
				}
				Joomla.submitform(task, document.getElementById('associado-form'));
			}
			else {
				alert('<?php echo $this->escape(JText::_('JGLOBAL_VALIDATION_FORM_FAILED')); ?>');
			}
		}
	}

</script>

<form
	action="<?php echo JRoute::_('index.php?option=com_associados&layout=edit&id=' . (int)$this->item->id); ?>"
	method="post" enctype="multipart/form-data" name="adminForm" id="associado-form" class="form-validate span12">

	<div class="form-horizontal">
		<?php echo JHtml::_('bootstrap.startTabSet', 'myTab', array('active' => 'general')); ?>

		<?php echo JHtml::_('bootstrap.addTab', 'myTab', 'general',
			JText::_('COM_ASSOCIADOS_TITLE_ASSOCIADO', true)); ?>
		<div class="row-fluid">
			<div class="span10 form-horizontal">
				<fieldset class="adminform">


					<?php echo $this->form->renderField('amatra'); ?>
					<?php echo $this->form->renderField('tratamento'); ?>
					<?php echo $this->form->renderField('nome'); ?>
					<?php echo $this->form->renderField('email'); ?>
					<?php echo $this->form->renderField('nascimento'); ?>
					<?php echo $this->form->renderField('naturalidade'); ?>
					<?php echo $this->form->renderField('sexo'); ?>
					<?php echo $this->form->renderField('cpf'); ?>
					<?php echo $this->form->renderField('rg'); ?>
					<?php echo $this->form->renderField('orgao_expeditor'); ?>
					<?php echo $this->form->renderField('data_emissao'); ?>
					<?php echo $this->form->renderField('estado_civil'); ?>

					<?php echo $this->form->renderField('observacoes'); ?>

				</fieldset>
			</div>
		</div>
		<?php echo JHtml::_('bootstrap.endTab'); ?>
		<?php echo JHtml::_('bootstrap.addTab', 'myTab', 'contato', 'Dados de contato'); ?>
		<div class="row-fluid">
			<div class="span10 form-horizontal">
				<fieldset class="adminform">
					<?php echo $this->form->renderField('endereco'); ?>
					<?php echo $this->form->renderField('logradouro'); ?>
					<?php echo $this->form->renderField('numero'); ?>
					<?php echo $this->form->renderField('complemento'); ?>
					<?php echo $this->form->renderField('bairro'); ?>
					<?php echo $this->form->renderField('estado'); ?>

					<?php
					foreach ((array)$this->item->estado as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="estado" name="jform[estadohidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?><?php echo $this->form->renderField('cidade'); ?>

					<?php
					foreach ((array)$this->item->cidade as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="cidade" name="jform[cidadehidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?>
					<?php echo $this->form->renderField('cep'); ?>

					<?php echo $this->form->renderField('email_alternativo'); ?>
					<?php echo $this->form->renderField('fone_residencial'); ?>
					<?php echo $this->form->renderField('fone_comercial'); ?>
					<?php echo $this->form->renderField('fone_celular'); ?>
					<?php echo $this->form->renderField('fone_fax'); ?>
					<?php echo $this->form->renderField('receber_correspondencia'); ?>
					<?php echo $this->form->renderField('receber_newsletter'); ?>
					<?php echo $this->form->renderField('receber_sms'); ?>
				</fieldset>
			</div>
		</div>
		<?php echo JHtml::_('bootstrap.endTab'); ?>



		<?php echo JHtml::_('bootstrap.addTab', 'myTab', 'magistratura', 'Magistratura'); ?>
		<div class="row-fluid">
			<div class="span10 form-horizontal">
				<fieldset class="adminform">
					<?php echo $this->form->renderField('dt_ingresso_magistratura'); ?>

					<?php echo $this->form->renderField('tribunal'); ?>
					<?php echo $this->form->renderField('dirigente'); ?>
					<?php echo $this->form->renderField('cargo'); ?>
					<?php echo $this->form->renderField('cargo_associado_honorario'); ?>
					<?php echo $this->form->renderField('filiado_amb'); ?>
				</fieldset>
			</div>
		</div>
		<?php echo JHtml::_('bootstrap.endTab'); ?>
		<?php echo JHtml::_('bootstrap.addTab', 'myTab', 'dependentes', 'Dependentes'); ?>
		<div class="row-fluid">
			<div class="span10 form-horizontal">
				<fieldset class="adminform">

					<?php echo $this->form->renderField('possui_dependentes'); ?>
					<?php echo $this->form->renderField('dependentes'); ?>
				</fieldset>
			</div>
		</div>
		<?php echo JHtml::_('bootstrap.endTab'); ?>



		<?php echo JHtml::_('bootstrap.addTab', 'myTab', 'eventos', 'Eventos'); ?>
		<div class="row-fluid">
			<div class="span10 form-horizontal">
				<fieldset class="adminform">


					<?php echo $this->form->renderField('eventos_que_participou_jogos_nacionais'); ?>

					<?php
					foreach ((array)$this->item->eventos_que_participou_jogos_nacionais as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="eventos_que_participou_jogos_nacionais" name="jform[eventos_que_participou_jogos_nacionaishidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?><?php echo $this->form->renderField('eventos_que_participou_conamat'); ?>

					<?php
					foreach ((array)$this->item->eventos_que_participou_conamat as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="eventos_que_participou_conamat" name="jform[eventos_que_participou_conamathidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?><?php echo $this->form->renderField('eventos_que_participou_congresso_internacional'); ?>

					<?php
					foreach ((array)$this->item->eventos_que_participou_congresso_internacional as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="eventos_que_participou_congresso_internacional" name="jform[eventos_que_participou_congresso_internacionalhidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?><?php echo $this->form->renderField('eventos_que_participou_encontro_aposentados'); ?>

					<?php
					foreach ((array)$this->item->eventos_que_participou_encontro_aposentados as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="eventos_que_participou_encontro_aposentados" name="jform[eventos_que_participou_encontro_aposentadoshidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?><?php echo $this->form->renderField('eventos_que_participou_outros'); ?>
					<?php echo $this->form->renderField('eventos_que_participou_outros_descricao'); ?>


				</fieldset>
			</div>
		</div>
		<?php echo JHtml::_('bootstrap.endTab'); ?>


		<?php echo JHtml::_('bootstrap.addTab', 'myTab', 'administracao', 'Administração'); ?>
		<div class="row-fluid">
			<div class="span12 form-horizontal">
				<fieldset class="adminform">


					<?php echo $this->form->renderField('id'); ?>
					<?php echo $this->form->renderField('state'); ?>
					<?php echo $this->form->renderField('user_id'); ?>
					<?php echo $this->form->renderField('forma_associacao'); ?>
					<?php echo $this->form->renderField('state_anamatra'); ?>
					<?php echo $this->form->renderField('state_amatra'); ?>
					<?php echo $this->form->renderField('dt_filiacao_anamatra'); ?>
					<?php echo $this->form->renderField('situacao_do_associado'); ?>

					<?php
					foreach ((array)$this->item->situacao_do_associado as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="situacao_do_associado" name="jform[situacao_do_associadohidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?>

					<?php echo $this->form->renderField('created_by'); ?>
					<?php echo $this->form->renderField('protheus'); ?>


					<?php if ($this->state->params->get('save_history', 1)) : ?>
						<div class="control-group">
							<div class="control-label"><?php echo $this->form->getLabel('version_note'); ?></div>
							<div class="controls"><?php echo $this->form->getInput('version_note'); ?></div>
						</div>
					<?php endif; ?>

				</fieldset>
			</div>
		</div>
		<?php echo JHtml::_('bootstrap.endTab'); ?>



		<?php echo JHtml::_('bootstrap.endTabSet'); ?>

		<input type="hidden" name="task" value=""/>
		<?php echo JHtml::_('form.token'); ?>

	</div>
</form>
