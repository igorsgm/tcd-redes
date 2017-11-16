<?php
/**
 * @version    CVS: 1.0.3
 * @package    Com_Ouvidoria
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  2017 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
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
$document->addStyleSheet(JUri::root() . 'media/com_ouvidoria/css/form.css');
?>
<script type="text/javascript">
	js = jQuery.noConflict();
	js(document).ready(function () {

		js('input:hidden.id_solicitante').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('id_solicitantehidden')) {
				js('#jform_id_solicitante option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js("#jform_id_solicitante").trigger("liszt:updated");
		js('input:hidden.id_tipo').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('id_tipohidden')) {
				js('#jform_id_tipo option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js("#jform_id_tipo").trigger("liszt:updated");
		js('input:hidden.id_diretoria_responsavel').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('id_diretoria_responsavelhidden')) {
				js('#jform_id_diretoria_responsavel option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js("#jform_id_diretoria_responsavel").trigger("liszt:updated");
		js('input:hidden.status').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('statushidden')) {
				js('#jform_status option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js("#jform_status").trigger("liszt:updated");
		js('input:hidden.id_user_responsavel_atual').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('id_user_responsavel_atualhidden')) {
				js('#jform_id_user_responsavel_atual option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js("#jform_id_user_responsavel_atual").trigger("liszt:updated");
	});

	Joomla.submitbutton = function (task) {
		if (task == 'solicitacao.cancel') {
			Joomla.submitform(task, document.getElementById('solicitacao-form'));
		}
		else {

			if (task != 'solicitacao.cancel' && document.formvalidator.isValid(document.id('solicitacao-form'))) {

				Joomla.submitform(task, document.getElementById('solicitacao-form'));
			}
			else {
				alert('<?php echo $this->escape(JText::_('JGLOBAL_VALIDATION_FORM_FAILED')); ?>');
			}
		}
	}
</script>

<form
		action="<?php echo JRoute::_('index.php?option=com_ouvidoria&layout=edit&id=' . (int)$this->item->id); ?>"
		method="post" enctype="multipart/form-data" name="adminForm" id="solicitacao-form" class="form-validate">

	<div class="form-horizontal">
		<?php echo JHtml::_('bootstrap.startTabSet', 'myTab', array('active' => 'general')); ?>

		<?php echo JHtml::_('bootstrap.addTab', 'myTab', 'general', JText::_('COM_OUVIDORIA_TITLE_SOLICITACAO', true)); ?>
		<div class="row-fluid">
			<div class="span10 form-horizontal">
				<fieldset class="adminform">

					<input type="hidden" name="jform[id]" value="<?php echo $this->item->id; ?>"/>
					<input type="hidden" name="jform[ordering]" value="<?php echo $this->item->ordering; ?>"/>
					<input type="hidden" name="jform[state]" value="<?php echo $this->item->state; ?>"/>
					<input type="hidden" name="jform[checked_out]" value="<?php echo $this->item->checked_out; ?>"/>
					<input type="hidden" name="jform[checked_out_time]" value="<?php echo $this->item->checked_out_time; ?>"/>

					<?php echo $this->form->renderField('created_by'); ?>
					<?php echo $this->form->renderField('modified_by'); ?>
					<?php echo $this->form->renderField('updated_at'); ?>
					<?php echo $this->form->renderField('created_at'); ?>                <?php echo $this->form->renderField('id_solicitante'); ?>

					<?php
					foreach ((array)$this->item->id_solicitante as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="id_solicitante" name="jform[id_solicitantehidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?>                <?php echo $this->form->renderField('id_tipo'); ?>

					<?php
					foreach ((array)$this->item->id_tipo as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="id_tipo" name="jform[id_tipohidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?>                <?php echo $this->form->renderField('id_diretoria_responsavel'); ?>

					<?php
					foreach ((array)$this->item->id_diretoria_responsavel as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="id_diretoria_responsavel" name="jform[id_diretoria_responsavelhidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?>                <?php echo $this->form->renderField('texto'); ?>
					<?php echo $this->form->renderField('anexo'); ?>

					<?php $anexoFiles = array(); ?>
					<?php if (!empty($this->item->anexo)) : ?>
						<?php foreach ((array)$this->item->anexo as $fileSingle) : ?>
							<?php if (!is_array($fileSingle)) : ?>
								<a href="<?php echo JRoute::_(JUri::root() . 'solicitacoes' . DIRECTORY_SEPARATOR . $fileSingle, false); ?>"><?php echo $fileSingle; ?></a> |
								<?php $anexoFiles[] = $fileSingle; ?>
							<?php endif; ?>
						<?php endforeach; ?>
						<input type="hidden" name="jform[anexo_hidden]" id="jform_anexo_hidden" value="<?php echo implode(',', $anexoFiles); ?>"/>
					<?php endif; ?>                <?php echo $this->form->renderField('protocolo'); ?>
					<?php echo $this->form->renderField('status'); ?>

					<?php
					foreach ((array)$this->item->status as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="status" name="jform[statushidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?>                <?php echo $this->form->renderField('id_user_responsavel_atual'); ?>

					<?php
					foreach ((array)$this->item->id_user_responsavel_atual as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="id_user_responsavel_atual" name="jform[id_user_responsavel_atualhidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?>

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
