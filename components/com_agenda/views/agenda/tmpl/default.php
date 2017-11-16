<?php
/**
 * @version     1.0.0
 * @package     com_agenda
 * @copyright   Copyright (C) 2013. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @author      iComunicação <contato@icomunicacao.com.br> - http://www.icomunicacao.com.br
 */
// no direct access
defined('_JEXEC') or die;

//Load admin language file
$lang = JFactory::getLanguage();
$lang->load('com_agenda', JPATH_ADMINISTRATOR);

?>
<?php if ($this->item && $this->item->state == 1) : ?>

    <div class="item_fields">
        <table class="table">
            <tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_ID'); ?></th>
			<td><?php echo $this->item->id; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_STATE'); ?></th>
			<td>
			<i class="icon-<?php echo ($this->item->state == 1) ? 'publish' : 'unpublish'; ?>"></i></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_CREATED_BY'); ?></th>
			<td><?php echo $this->item->created_by_name; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_CATEGORIA'); ?></th>
			<td><?php echo $this->item->categoria_title; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_NOME'); ?></th>
			<td><?php echo $this->item->nome; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_LOCAL'); ?></th>
			<td><?php echo $this->item->local; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_DATA_INICIO'); ?></th>
			<td><?php echo $this->item->data_inicio; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_DATA_FIM'); ?></th>
			<td><?php echo $this->item->data_fim; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_HORA_INICIO'); ?></th>
			<td><?php echo $this->item->hora_inicio; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_HORA_FIM'); ?></th>
			<td><?php echo $this->item->hora_fim; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_DESCRICAO'); ?></th>
			<td><?php echo $this->item->descricao; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_MAPS'); ?></th>
			<td><?php echo $this->item->maps; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_AGENDA_FORM_LBL_AGENDA_IMAGEM'); ?></th>
			<td><?php echo $this->item->imagem; ?></td>
</tr>

        </table>
    </div>
    
    <?php
else:
    echo JText::_('COM_AGENDA_ITEM_NOT_LOADED');
endif;
?>
