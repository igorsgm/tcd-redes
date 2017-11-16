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

$canEdit = JFactory::getUser()->authorise('core.edit', 'com_associados');
if (!$canEdit && JFactory::getUser()->authorise('core.edit.own', 'com_associados')) {
	$canEdit = JFactory::getUser()->id == $this->item->created_by;
}
?>
<?php if ($this->item) : ?>

	<div class="item_fields">
		<table class="table">
			<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_ID'); ?></th>
			<td><?php echo $this->item->id; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_STATE'); ?></th>
			<td>
			<i class="icon-<?php echo ($this->item->state == 1) ? 'publish' : 'unpublish'; ?>"></i></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_USER_ID'); ?></th>
			<td><?php echo $this->item->user_id; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_STATE_ANAMATRA'); ?></th>
			<td><?php echo $this->item->state_anamatra; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_STATE_AMATRA'); ?></th>
			<td><?php echo $this->item->state_amatra; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_AMATRA'); ?></th>
			<td><?php echo $this->item->amatra_title; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_SITUACAO_DO_ASSOCIADO'); ?></th>
			<td><?php echo $this->item->situacao_do_associado; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_TRATAMENTO'); ?></th>
			<td><?php echo $this->item->tratamento; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_NOME'); ?></th>
			<td><?php echo $this->item->nome; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_EMAIL'); ?></th>
			<td><?php echo $this->item->email; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_NASCIMENTO'); ?></th>
			<td><?php echo $this->item->nascimento; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_NATURALIDADE'); ?></th>
			<td><?php echo $this->item->naturalidade; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_SEXO'); ?></th>
			<td><?php echo $this->item->sexo; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_CPF'); ?></th>
			<td><?php echo $this->item->cpf; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_RG'); ?></th>
			<td><?php echo $this->item->rg; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_ORGAO_EXPEDITOR'); ?></th>
			<td><?php echo $this->item->orgao_expeditor; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_DATA_EMISSAO'); ?></th>
			<td><?php echo $this->item->data_emissao; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_DT_INGRESSO_MAGISTRATURA'); ?></th>
			<td><?php echo $this->item->dt_ingresso_magistratura; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_DT_FILIACAO_ANAMATRA'); ?></th>
			<td><?php echo $this->item->dt_filiacao_anamatra; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_TRIBUNAL'); ?></th>
			<td><?php echo $this->item->tribunal; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_DIRIGENTE'); ?></th>
			<td><?php echo $this->item->dirigente; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_CARGO'); ?></th>
			<td><?php echo $this->item->cargo; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_CARGO_ASSOCIADO_HONORARIO'); ?></th>
			<td><?php echo $this->item->cargo_associado_honorario; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_ESTADO_CIVIL'); ?></th>
			<td><?php echo $this->item->estado_civil; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_ENDERECO'); ?></th>
			<td><?php echo $this->item->endereco; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_LOGRADOURO'); ?></th>
			<td><?php echo $this->item->logradouro; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_NUMERO'); ?></th>
			<td><?php echo $this->item->numero; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_COMPLEMENTO'); ?></th>
			<td><?php echo $this->item->complemento; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_BAIRRO'); ?></th>
			<td><?php echo $this->item->bairro; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_ESTADO'); ?></th>
			<td><?php echo $this->item->estado; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_CIDADE'); ?></th>
			<td><?php echo $this->item->cidade; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_CEP'); ?></th>
			<td><?php echo $this->item->cep; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_OBSERVACOES'); ?></th>
			<td><?php echo $this->item->observacoes; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_EMAIL_ALTERNATIVO'); ?></th>
			<td><?php echo $this->item->email_alternativo; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_FONE_RESIDENCIAL'); ?></th>
			<td><?php echo $this->item->fone_residencial; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_FONE_COMERCIAL'); ?></th>
			<td><?php echo $this->item->fone_comercial; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_FONE_CELULAR'); ?></th>
			<td><?php echo $this->item->fone_celular; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_FONE_FAX'); ?></th>
			<td><?php echo $this->item->fone_fax; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_POSSUI_DEPENDENTES'); ?></th>
			<td><?php echo $this->item->possui_dependentes; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_DEPENDENTES'); ?></th>
			<td><?php echo $this->item->dependentes; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_EVENTOS_QUE_PARTICIPOU_JOGOS_NACIONAIS'); ?></th>
			<td><?php echo $this->item->eventos_que_participou_jogos_nacionais; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_EVENTOS_QUE_PARTICIPOU_CONAMAT'); ?></th>
			<td><?php echo $this->item->eventos_que_participou_conamat; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_EVENTOS_QUE_PARTICIPOU_CONGRESSO_INTERNACIONAL'); ?></th>
			<td><?php echo $this->item->eventos_que_participou_congresso_internacional; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_EVENTOS_QUE_PARTICIPOU_ENCONTRO_APOSENTADOS'); ?></th>
			<td><?php echo $this->item->eventos_que_participou_encontro_aposentados; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_EVENTOS_QUE_PARTICIPOU_OUTROS'); ?></th>
			<td><?php echo $this->item->eventos_que_participou_outros; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_EVENTOS_QUE_PARTICIPOU_OUTROS_DESCRICAO'); ?></th>
			<td><?php echo $this->item->eventos_que_participou_outros_descricao; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_RECEBER_CORRESPONDENCIA'); ?></th>
			<td><?php echo $this->item->receber_correspondencia; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_RECEBER_NEWSLETTER'); ?></th>
			<td><?php echo $this->item->receber_newsletter; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_RECEBER_SMS'); ?></th>
			<td><?php echo $this->item->receber_sms; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_FILIADO_AMB'); ?></th>
			<td><?php echo $this->item->filiado_amb; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_CREATED_BY'); ?></th>
			<td><?php echo $this->item->created_by_name; ?></td>
</tr>
<tr>
			<th><?php echo JText::_('COM_ASSOCIADOS_FORM_LBL_ASSOCIADO_PROTHEUS'); ?></th>
			<td><?php echo $this->item->protheus; ?></td>
</tr>

		</table>
	</div>
	<?php if($canEdit && $this->item->checked_out == 0): ?>
		<a class="btn" href="<?php echo JRoute::_('index.php?option=com_associados&task=associado.edit&id='.$this->item->id); ?>"><?php echo JText::_("COM_ASSOCIADOS_EDIT_ITEM"); ?></a>
	<?php endif; ?>
								<?php if(JFactory::getUser()->authorise('core.delete','com_associados')):?>
									<a class="btn" href="<?php echo JRoute::_('index.php?option=com_associados&task=associado.remove&id=' . $this->item->id, false, 2); ?>"><?php echo JText::_("COM_ASSOCIADOS_DELETE_ITEM"); ?></a>
								<?php endif; ?>
	<?php
else:
	echo JText::_('COM_ASSOCIADOS_ITEM_NOT_LOADED');
endif;
