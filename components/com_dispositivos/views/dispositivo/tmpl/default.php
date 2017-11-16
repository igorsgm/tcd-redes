<?php
/**
 * @version    CVS: 1.0.0
 * @package    Com_Dispositivos
 * @author     Igor Moraes <igor.sgm@gmail.com>
 * @copyright  2017 Igor Moraes
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
// No direct access
defined('_JEXEC') or die;

$canEdit = JFactory::getUser()->authorise('core.edit', 'com_dispositivos');

if (!$canEdit && JFactory::getUser()->authorise('core.edit.own', 'com_dispositivos')) {
	$canEdit = JFactory::getUser()->id == $this->item->created_by;
}
?>
	
	<div class="item_fields">
		
		<table class="table">
			
			
			<tr>
				<th><?php echo JText::_('COM_DISPOSITIVOS_FORM_LBL_DISPOSITIVO_IDENTIFICADOR_APARELHO'); ?></th>
				<td><?php echo $this->item->identificador_aparelho; ?></td>
			</tr>
			
			<tr>
				<th><?php echo JText::_('COM_DISPOSITIVOS_FORM_LBL_DISPOSITIVO_TIPO'); ?></th>
				<td><?php echo $this->item->tipo; ?></td>
			</tr>
			
			<tr>
				<th><?php echo JText::_('COM_DISPOSITIVOS_FORM_LBL_DISPOSITIVO_MODELO'); ?></th>
				<td><?php echo $this->item->modelo; ?></td>
			</tr>
			
			<tr>
				<th><?php echo JText::_('COM_DISPOSITIVOS_FORM_LBL_DISPOSITIVO_SISTEMA_OPERACIONAL'); ?></th>
				<td><?php echo $this->item->sistema_operacional; ?></td>
			</tr>
			
			<tr>
				<th><?php echo JText::_('COM_DISPOSITIVOS_FORM_LBL_DISPOSITIVO_NOME_PROPIERTARIO'); ?></th>
				<td><?php echo $this->item->nome_propiertario; ?></td>
			</tr>
		
		</table>
	
	</div>

<?php if ($canEdit && $this->item->checked_out == 0): ?>
	
	<a class="btn" href="<?php echo JRoute::_('index.php?option=com_dispositivos&task=dispositivo.edit&id=' . $this->item->id); ?>"><?php echo JText::_("COM_DISPOSITIVOS_EDIT_ITEM"); ?></a>

<?php endif; ?>

<?php if (JFactory::getUser()->authorise('core.delete', 'com_dispositivos.dispositivo.' . $this->item->id)) : ?>
	
	<a class="btn btn-danger" href="#deleteModal" role="button" data-toggle="modal">
		<?php echo JText::_("COM_DISPOSITIVOS_DELETE_ITEM"); ?>
	</a>
	
	<div id="deleteModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
			<h3><?php echo JText::_('COM_DISPOSITIVOS_DELETE_ITEM'); ?></h3>
		</div>
		<div class="modal-body">
			<p><?php echo JText::sprintf('COM_DISPOSITIVOS_DELETE_CONFIRM', $this->item->id); ?></p>
		</div>
		<div class="modal-footer">
			<button class="btn" data-dismiss="modal">Close</button>
			<a href="<?php echo JRoute::_('index.php?option=com_dispositivos&task=dispositivo.remove&id=' . $this->item->id, false, 2); ?>" class="btn btn-danger">
				<?php echo JText::_('COM_DISPOSITIVOS_DELETE_ITEM'); ?>
			</a>
		</div>
	</div>

<?php endif; ?>