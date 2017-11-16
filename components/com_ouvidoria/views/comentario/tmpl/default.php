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

$canEdit = JFactory::getUser()->authorise('core.edit', 'com_ouvidoria');

if (!$canEdit && JFactory::getUser()->authorise('core.edit.own', 'com_ouvidoria')) {
	$canEdit = JFactory::getUser()->id == $this->item->created_by;
}
?>
	
	<div class="item_fields">
		
		<table class="table">
			
			
			<tr>
				<th><?php echo JText::_('COM_OUVIDORIA_FORM_LBL_COMENTARIO_CREATED_BY_SOLICITANTE'); ?></th>
				<td><?php echo $this->item->created_by_solicitante; ?></td>
			</tr>
			
			<tr>
				<th><?php echo JText::_('COM_OUVIDORIA_FORM_LBL_COMENTARIO_ID_USER_CONSULTADO'); ?></th>
				<td><?php echo $this->item->id_user_consultado; ?></td>
			</tr>
			
			<tr>
				<th><?php echo JText::_('COM_OUVIDORIA_FORM_LBL_COMENTARIO_ID_SOLICITACAO'); ?></th>
				<td><?php echo $this->item->id_solicitacao; ?></td>
			</tr>
			
			<tr>
				<th><?php echo JText::_('COM_OUVIDORIA_FORM_LBL_COMENTARIO_ANEXO'); ?></th>
				<td>
					<?php
					foreach ((array)$this->item->anexo as $singleFile) :
						if (!is_array($singleFile)) :
							$uploadPath = 'comentarios' . DIRECTORY_SEPARATOR . $singleFile;
							echo '<a href="' . JRoute::_(JUri::root() . $uploadPath, false) . '" target="_blank">' . $singleFile . '</a> ';
						endif;
					endforeach;
					?></td>
			</tr>
			
			<tr>
				<th><?php echo JText::_('COM_OUVIDORIA_FORM_LBL_COMENTARIO_TEXTO'); ?></th>
				<td><?php echo nl2br($this->item->texto); ?></td>
			</tr>
		
		</table>
	
	</div>

<?php if ($canEdit && $this->item->checked_out == 0): ?>
	
	<a class="btn" href="<?php echo JRoute::_('index.php?option=com_ouvidoria&task=comentario.edit&id=' . $this->item->id); ?>"><?php echo JText::_("COM_OUVIDORIA_EDIT_ITEM"); ?></a>

<?php endif; ?>

<?php if (JFactory::getUser()->authorise('core.delete', 'com_ouvidoria.comentario.' . $this->item->id)) : ?>
	
	<a class="btn btn-danger" href="#deleteModal" role="button" data-toggle="modal">
		<?php echo JText::_("COM_OUVIDORIA_DELETE_ITEM"); ?>
	</a>
	
	<div id="deleteModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
			<h3><?php echo JText::_('COM_OUVIDORIA_DELETE_ITEM'); ?></h3>
		</div>
		<div class="modal-body">
			<p><?php echo JText::sprintf('COM_OUVIDORIA_DELETE_CONFIRM', $this->item->id); ?></p>
		</div>
		<div class="modal-footer">
			<button class="btn" data-dismiss="modal">Close</button>
			<a href="<?php echo JRoute::_('index.php?option=com_ouvidoria&task=comentario.remove&id=' . $this->item->id, false, 2); ?>" class="btn btn-danger">
				<?php echo JText::_('COM_OUVIDORIA_DELETE_ITEM'); ?>
			</a>
		</div>
	</div>

<?php endif; ?>