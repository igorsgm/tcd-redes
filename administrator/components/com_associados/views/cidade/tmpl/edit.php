<?php
/**
 * @version    CVS: 1.0.9
 * @package    Com_Associados
 * @author     Trídia Criação <atendimento@tridiacriacao.com>
 * @copyright  2016 Trídia Criação
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
$document->addStyleSheet(JUri::root() . 'media/com_associados/css/form.css');
?>
<script type="text/javascript">
	js = jQuery.noConflict();
	js(document).ready(function () {
		
	js('input:hidden.id_estado').each(function(){
		var name = js(this).attr('name');
		if(name.indexOf('id_estadohidden')){
			js('#jform_id_estado option[value="'+js(this).val()+'"]').attr('selected',true);
		}
	});
	js("#jform_id_estado").trigger("liszt:updated");
	});

	Joomla.submitbutton = function (task) {
		if (task == 'cidade.cancel') {
			Joomla.submitform(task, document.getElementById('cidade-form'));
		}
		else {
			
			if (task != 'cidade.cancel' && document.formvalidator.isValid(document.id('cidade-form'))) {
				
				Joomla.submitform(task, document.getElementById('cidade-form'));
			}
			else {
				alert('<?php echo $this->escape(JText::_('JGLOBAL_VALIDATION_FORM_FAILED')); ?>');
			}
		}
	}
</script>

<form
	action="<?php echo JRoute::_('index.php?option=com_associados&layout=edit&id=' . (int) $this->item->id); ?>"
	method="post" enctype="multipart/form-data" name="adminForm" id="cidade-form" class="form-validate">

	<div class="form-horizontal">
		<?php echo JHtml::_('bootstrap.startTabSet', 'myTab', array('active' => 'general')); ?>

		<?php echo JHtml::_('bootstrap.addTab', 'myTab', 'general', JText::_('COM_ASSOCIADOS_TITLE_CIDADE', true)); ?>
		<div class="row-fluid">
			<div class="span10 form-horizontal">
				<fieldset class="adminform">

									<?php echo $this->form->renderField('id'); ?>
				<?php echo $this->form->renderField('nm_cidade'); ?>
				<?php echo $this->form->renderField('id_estado'); ?>

			<?php
				foreach((array)$this->item->id_estado as $value): 
					if(!is_array($value)):
						echo '<input type="hidden" class="id_estado" name="jform[id_estadohidden]['.$value.']" value="'.$value.'" />';
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
