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

		js('input:hidden.id_associado').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('id_associadohidden')) {
				js('#jform_id_associado option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js("#jform_id_associado").trigger("liszt:updated");
		js('input:hidden.id_user').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('id_userhidden')) {
				js('#jform_id_user option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js("#jform_id_user").trigger("liszt:updated");
		js('input:hidden.amatra').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('amatrahidden')) {
				js('#jform_amatra option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js("#jform_amatra").trigger("liszt:updated");
	});

	Joomla.submitbutton = function (task) {
		if (task == 'solicitante.cancel') {
			Joomla.submitform(task, document.getElementById('solicitante-form'));
		}
		else {

			if (task != 'solicitante.cancel' && document.formvalidator.isValid(document.id('solicitante-form'))) {

				Joomla.submitform(task, document.getElementById('solicitante-form'));
			}
			else {
				alert('<?php echo $this->escape(JText::_('JGLOBAL_VALIDATION_FORM_FAILED')); ?>');
			}
		}
	}
</script>

<form
		action="<?php echo JRoute::_('index.php?option=com_ouvidoria&layout=edit&id=' . (int)$this->item->id); ?>"
		method="post" enctype="multipart/form-data" name="adminForm" id="solicitante-form" class="form-validate">

	<div class="form-horizontal">
		<?php echo JHtml::_('bootstrap.startTabSet', 'myTab', array('active' => 'general')); ?>

		<?php echo JHtml::_('bootstrap.addTab', 'myTab', 'general', JText::_('COM_OUVIDORIA_TITLE_SOLICITANTE', true)); ?>
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
					<?php echo $this->form->renderField('created_at'); ?>
					<?php echo $this->form->renderField('nome'); ?>
					<?php echo $this->form->renderField('email'); ?>
					<?php echo $this->form->renderField('cpf'); ?>
					<?php echo $this->form->renderField('telefone'); ?>
					<?php echo $this->form->renderField('id_associado'); ?>
					<?php echo $this->form->renderField('is_associado'); ?>
					<?php echo $this->form->renderField('amatra'); ?>

					<?php
					foreach ((array)$this->item->id_associado as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="id_associado" name="jform[id_associadohidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?>
					<?php echo $this->form->renderField('id_user'); ?>

					<?php
					foreach ((array)$this->item->id_user as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="id_user" name="jform[id_userhidden][' . $value . ']" value="' . $value . '" />';
						endif;
					endforeach;
					?>
					<?php echo $this->form->renderField('is_associado'); ?>

					<?php
					foreach ((array)$this->item->amatra as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="amatra" name="jform[amatrahidden][' . $value . ']" value="' . $value . '" />';
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
