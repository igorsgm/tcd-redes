<?php
/**
 * @version    CVS: 1.0.4
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

		js('input:hidden.id_status_vinculado').each(function () {
			var name = js(this).attr('name');
			if (name.indexOf('id_status_vinculadohidden')) {
				js('#jform_id_status_vinculado option[value="' + js(this).val() + '"]').attr('selected', true);
			}
		});
		js("#jform_id_status_vinculado").trigger("liszt:updated");
	});

	Joomla.submitbutton = function (task) {
		if (task == 'solicitacaointeracao.cancel') {
			Joomla.submitform(task, document.getElementById('solicitacaointeracao-form'));
		}
		else {

			if (task != 'solicitacaointeracao.cancel' && document.formvalidator.isValid(document.id('solicitacaointeracao-form'))) {

				Joomla.submitform(task, document.getElementById('solicitacaointeracao-form'));
			}
			else {
				alert('<?php echo $this->escape(JText::_('JGLOBAL_VALIDATION_FORM_FAILED')); ?>');
			}
		}
	}
</script>

<form
		action="<?php echo JRoute::_('index.php?option=com_ouvidoria&layout=edit&id=' . (int)$this->item->id); ?>"
		method="post" enctype="multipart/form-data" name="adminForm" id="solicitacaointeracao-form" class="form-validate">

	<div class="form-horizontal">
		<?php echo JHtml::_('bootstrap.startTabSet', 'myTab', array('active' => 'general')); ?>

		<?php echo JHtml::_('bootstrap.addTab', 'myTab', 'general', JText::_('COM_OUVIDORIA_TITLE_SOLICITACAOINTERACAO', true)); ?>
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
					<?php echo $this->form->renderField('created_at'); ?>                <?php echo $this->form->renderField('nome'); ?>
					<?php echo $this->form->renderField('id_status_vinculado'); ?>

					<?php
					foreach ((array)$this->item->id_status_vinculado as $value):
						if (!is_array($value)):
							echo '<input type="hidden" class="id_status_vinculado" name="jform[id_status_vinculadohidden][' . $value . ']" value="' . $value . '" />';
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