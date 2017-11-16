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

JHtml::_('behavior.keepalive');
JHtml::_('behavior.tooltip');
JHtml::_('behavior.formvalidation');
JHtml::_('formbehavior.chosen', 'select');

// Load admin language file
$lang = JFactory::getLanguage();
$lang->load('com_ouvidoria', JPATH_SITE);
$doc = JFactory::getDocument();
$doc->addScript(JUri::base() . '/media/com_ouvidoria/js/form.js');

$user    = JFactory::getUser();
$canEdit = OuvidoriaHelpersOuvidoria::canUserEdit($this->item, $user);


?>

<div class="comentario-edit front-end-edit">
	<?php if (!$canEdit) : ?>
		<h3>
			<?php throw new Exception(JText::_('COM_OUVIDORIA_ERROR_MESSAGE_NOT_AUTHORISED'), 403); ?>
		</h3>
	<?php else : ?>
		<?php if (!empty($this->item->id)): ?>
			<h1><?php echo JText::sprintf('COM_OUVIDORIA_EDIT_ITEM_TITLE', $this->item->id); ?></h1>
		<?php else: ?>
			<h1><?php echo JText::_('COM_OUVIDORIA_ADD_ITEM_TITLE'); ?></h1>
		<?php endif; ?>

		<form id="form-comentario"
		      action="<?php echo JRoute::_('index.php?option=com_ouvidoria&task=comentario.save'); ?>"
		      method="post" class="form-validate form-horizontal" enctype="multipart/form-data">

			<input type="hidden" name="jform[id]" value="<?php echo $this->item->id; ?>"/>

			<input type="hidden" name="jform[ordering]" value="<?php echo $this->item->ordering; ?>"/>

			<input type="hidden" name="jform[state]" value="<?php echo $this->item->state; ?>"/>

			<input type="hidden" name="jform[checked_out]" value="<?php echo $this->item->checked_out; ?>"/>

			<input type="hidden" name="jform[checked_out_time]" value="<?php echo $this->item->checked_out_time; ?>"/>

			<?php echo $this->form->getInput('created_by'); ?>
			<?php echo $this->form->renderField('created_by_solicitante'); ?>

			<?php foreach ((array)$this->item->created_by_solicitante as $value): ?>
				<?php if (!is_array($value)): ?>
					<input type="hidden" class="created_by_solicitante" name="jform[created_by_solicitantehidden][<?php echo $value; ?>]" value="<?php echo $value; ?>"/>
				<?php endif; ?>
			<?php endforeach; ?>
			<?php echo $this->form->renderField('id_user_consultado'); ?>

			<?php echo $this->form->getInput('modified_by'); ?>
			<?php echo $this->form->getInput('updated_at'); ?>
			<?php echo $this->form->getInput('created_at'); ?>
			<?php echo $this->form->renderField('id_solicitacao'); ?>

			<?php foreach ((array)$this->item->id_solicitacao as $value): ?>
				<?php if (!is_array($value)): ?>
					<input type="hidden" class="id_solicitacao" name="jform[id_solicitacaohidden][<?php echo $value; ?>]" value="<?php echo $value; ?>"/>
				<?php endif; ?>
			<?php endforeach; ?>
			<?php echo $this->form->renderField('anexo'); ?>

			<?php $anexoFiles = array(); ?>
			<?php if (!empty($this->item->anexo)) : ?>
				<?php foreach ((array)$this->item->anexo as $fileSingle) : ?>
					<?php if (!is_array($fileSingle)) : ?>
						<a href="<?php echo JRoute::_(JUri::root() . 'comentarios' . DIRECTORY_SEPARATOR . $fileSingle, false); ?>"><?php echo $fileSingle; ?></a> |
						<?php $anexoFiles[] = $fileSingle; ?>
					<?php endif; ?>
				<?php endforeach; ?>
			<?php endif; ?>
			<input type="hidden" name="jform[anexo_hidden]" id="jform_anexo_hidden" value="<?php echo implode(',', $anexoFiles); ?>"/>
			<?php echo $this->form->renderField('texto'); ?>

			<div class="control-group">
				<div class="controls">

					<?php if ($this->canSave): ?>
						<button type="submit" class="validate btn btn-primary">
							<?php echo JText::_('JSUBMIT'); ?>
						</button>
					<?php endif; ?>
					<a class="btn"
					   href="<?php echo JRoute::_('index.php?option=com_ouvidoria&task=comentarioform.cancel'); ?>"
					   title="<?php echo JText::_('JCANCEL'); ?>">
						<?php echo JText::_('JCANCEL'); ?>
					</a>
				</div>
			</div>

			<input type="hidden" name="option" value="com_ouvidoria"/>
			<input type="hidden" name="task"
			       value="comentarioform.save"/>
			<?php echo JHtml::_('form.token'); ?>
		</form>
	<?php endif; ?>
</div>
