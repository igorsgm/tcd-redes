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

JHtml::_('behavior.keepalive');
JHtml::_('behavior.tooltip');
JHtml::_('behavior.formvalidation');
JHtml::_('formbehavior.chosen', 'select');

// Load admin language file
$lang = JFactory::getLanguage();
$lang->load('com_associados', JPATH_SITE);
$doc = JFactory::getDocument();

//Import JS
JHtml::_('thomisticus.assets');
JHtml::_('thomisticus.mask');
$doc->addScript(JUri::base() . 'media/com_associados/js/form.js');
$doc->addScript(JUri::base() . 'media/com_associados/js/script.js');
$doc->addScript(JUri::base() . 'media/com_associados/js/jquery.inputmask.bundle.min.js');
$doc->addScript(JUri::base() . 'media/com_associados/js/associadoform.js');

$user    = JFactory::getUser();
$canEdit = AssociadosHelpersAssociadosfront::canUserEdit($this->item, $user);
if ($this->item->state == 1) {
	$state_string = 'Publish';
	$state_value  = 1;
} else {
	$state_string = 'Unpublish';
	$state_value  = 0;
}
$canState = JFactory::getUser()->authorise('core.edit.state', 'com_associados');

AssociadosHelpersAssociadosfront::verifyFirstAccess();

?>

<script type="text/javascript">
	//inclusao de variaveis necessarias a funcao cidades
	var juri_base = '<?php echo JURI::root(); ?>';

	<?php if (!$this->canEditAmatraAndTribunal): // Bloqueat a edição da amatra e tribunal se não tiver permissão ?>

	(function ($) {
		$(document).ready(function () {
			tDisableFields(['#jform_amatra', '#jform_tribunal'], true);
		});
	}(window.jQuery.noConflict(), window, document));

	<?php endif;?>

</script>

<div class="associado-edit front-end-edit">
	<?php if (!empty($this->item->id)): ?>
		<div class="page-header">
			<h1>Editar perfil do colaborador | <?php echo $this->item->nome; ?></h1>
		</div>
	<?php else: ?>
		<div class="page-header">
			<h1>Cadastro Associado</h1>
		</div>
	<?php endif; ?>

	<form id="form-associado"
	      action="<?php echo JRoute::_('index.php?option=com_associados&task=associado.save'); ?>"
	      method="post" class="form-validate" enctype="multipart/form-data">
		<div class="hidden">
			<?php echo $this->form->renderField('id'); ?>
		</div>

		<div class="control-group">
			<?php if (!$canState): ?>
				<div class="control-label hidden"><?php echo $this->form->getLabel('state'); ?></div>
				<div class="controls hidden"><?php echo $state_string; ?></div>
				<input type="hidden" name="jform[state]" value="<?php echo $state_value; ?>"/>
			<?php else: ?>
				<div class="control-label hidden"><?php echo $this->form->getLabel('state'); ?></div>
				<div class="controls hidden"><?php echo $this->form->getInput('state'); ?></div>
			<?php endif; ?>
		</div>
		<!-- 		<div class="row">
	<div class="col-sm-6">
		<?php echo $this->form->renderField('user_id'); ?>
	</div>
	<div class="col-sm-3">
		<?php echo $this->form->renderField('state_anamatra'); ?>
	</div>
	<div class="col-sm-3">
		<?php echo $this->form->renderField('state_amatra'); ?>
	</div>
</div> -->
		<div class="row">
			<div class="col-sm-12">
				<?php echo $this->form->renderField('nome'); ?>
				<?php echo $this->form->renderField('situacao_do_associado'); ?>
			</div>

		</div>
		<div class="row">
			<div class="col-sm-2">
				<?php echo $this->form->renderField('amatra'); ?>
			</div>
			<div class="col-sm-5">
				<?php echo $this->form->renderField('tratamento'); ?>
			</div>
			<div class="col-sm-5">
				<?php echo $this->form->renderField('email'); ?>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-3">
				<?php echo $this->form->renderField('nascimento'); ?>
			</div>
			<div class="col-sm-5">
				<?php echo $this->form->renderField('naturalidade'); ?>
			</div>
			<div class="col-sm-2">
				<?php echo $this->form->renderField('sexo'); ?>
			</div>
			<div class="col-sm-2">
				<?php echo $this->form->renderField('estado_civil'); ?>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-3">
				<?php echo $this->form->renderField('cpf'); ?>
			</div>
			<div class="col-sm-3">
				<?php echo $this->form->renderField('rg'); ?>
			</div>
			<div class="col-sm-3">
				<?php echo $this->form->renderField('orgao_expeditor'); ?>
			</div>
			<div class="col-sm-3">
				<?php echo $this->form->renderField('data_emissao'); ?>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-4">
				<?php echo $this->form->renderField('dt_ingresso_magistratura'); ?>
			</div>
			<div class="col-sm-4">
				<?php echo $this->form->renderField('dt_filiacao_anamatra'); ?>
			</div>
			<div class="col-sm-4">
				<?php echo $this->form->renderField('tribunal'); ?>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-2">
				<?php echo $this->form->renderField('dirigente'); ?>
			</div>
			<div class="col-sm-2">
				<?php echo $this->form->renderField('aposentado'); ?>
			</div>
			<div class="col-sm-4">
				<?php echo $this->form->renderField('cargo'); ?>
			</div>
			<div class="col-sm-4">
				<?php echo $this->form->renderField('cargo_associado_honorario'); ?>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-5">
				<?php echo $this->form->renderField('endereco'); ?>
			</div>
			<div class="col-sm-3">
				<?php echo $this->form->renderField('logradouro'); ?>
			</div>
			<div class="col-sm-2">
				<?php echo $this->form->renderField('numero'); ?>
			</div>
			<div class="col-sm-2">
				<?php echo $this->form->renderField('cep'); ?>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-3">
				<?php echo $this->form->renderField('complemento'); ?>
			</div>
			<div class="col-sm-3">
				<?php echo $this->form->renderField('bairro'); ?>
			</div>
			<div class="col-sm-2">
				<?php echo $this->form->renderField('estado'); ?>


				<?php foreach ((array)$this->item->estado as $value): ?>
					<?php if (!is_array($value)): ?>
						<input type="hidden" class="estado" name="jform[estadohidden][<?php echo $value; ?>]"
						       value="<?php echo $value; ?>"/>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
			<div class="col-sm-4">
				<?php echo $this->form->renderField('cidade'); ?>

				<?php foreach ((array)$this->item->cidade as $value): ?>
					<?php if (!is_array($value)): ?>
						<input type="hidden" class="cidade" name="jform[cidadehidden][<?php echo $value; ?>]"
						       value="<?php echo $value; ?>"/>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
		</div>

		<?php if (AssociadosHelpersAssociadosfront::isUserSecretariaOrAdmin()): ?>
			<div class="row">
				<div class="col-sm-12">
					<?php echo $this->form->renderField('observacoes'); ?>
				</div>
			</div>
		<?php endif; ?>

		<div class="row">
			<div class="col-sm-8">
				<?php echo $this->form->renderField('email_alternativo'); ?>
			</div>
			<div class="col-sm-4">
				<?php echo $this->form->renderField('fone_residencial'); ?>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-4">
				<?php echo $this->form->renderField('fone_comercial'); ?>
			</div>
			<div class="col-sm-4">
				<?php echo $this->form->renderField('fone_celular'); ?>
			</div>
			<div class="col-sm-4">
				<?php echo $this->form->renderField('fone_fax'); ?>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-4">
				<?php echo $this->form->renderField('possui_dependentes'); ?>
			</div>
			<div class="col-sm-8">
				<?php echo $this->form->renderField('dependentes'); ?>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-3">
				<?php echo $this->form->renderField('eventos_que_participou_jogos_nacionais'); ?>

				<?php foreach (explode(",", $this->item->eventos_que_participou_jogos_nacionais) as $value): ?>
					<?php if (!is_array($value)): ?>
						<input type="hidden" class="eventos_que_participou_jogos_nacionais"
						       name="jform[eventos_que_participou_jogos_nacionaishidden][<?php echo $value; ?>]"
						       value="<?php echo $value; ?>"/>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
			<div class="col-sm-3">
				<?php echo $this->form->renderField('eventos_que_participou_conamat'); ?>

				<?php foreach (explode(",", $this->item->eventos_que_participou_conamat) as $value): ?>
					<?php if (!is_array($value)): ?>
						<input type="hidden" class="eventos_que_participou_conamat"
						       name="jform[eventos_que_participou_conamathidden][<?php echo $value; ?>]"
						       value="<?php echo $value; ?>"/>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
			<div class="col-sm-3">
				<?php echo $this->form->renderField('eventos_que_participou_congresso_internacional'); ?>

				<?php foreach (explode(",", $this->item->eventos_que_participou_congresso_internacional) as $value): ?>
					<?php if (!is_array($value)): ?>
						<input type="hidden" class="eventos_que_participou_congresso_internacional"
						       name="jform[eventos_que_participou_congresso_internacionalhidden][<?php echo $value; ?>]"
						       value="<?php echo $value; ?>"/>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
			<div class="col-sm-3">
				<?php echo $this->form->renderField('eventos_que_participou_encontro_aposentados'); ?>

				<?php foreach (explode(",", $this->item->eventos_que_participou_encontro_aposentados) as $value): ?>
					<?php if (!is_array($value)): ?>
						<input type="hidden" class="eventos_que_participou_encontro_aposentados"
						       name="jform[eventos_que_participou_encontro_aposentadoshidden][<?php echo $value; ?>]"
						       value="<?php echo $value; ?>"/>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-4">
				<?php echo $this->form->renderField('eventos_que_participou_outros'); ?>
			</div>
			<div class="col-sm-8">
				<?php echo $this->form->renderField('eventos_que_participou_outros_descricao'); ?>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-3">
				<?php echo $this->form->renderField('receber_correspondencia'); ?>
			</div>
			<div class="col-sm-3">
				<?php echo $this->form->renderField('receber_sms'); ?>
			</div>
			<div class="col-sm-3">
				<?php echo $this->form->renderField('receber_newsletter'); ?>
			</div>
			<div class="col-sm-3">
				<?php echo $this->form->renderField('filiado_amb'); ?>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-12">
				<?php echo $this->form->renderField('created_by'); ?>
			</div>
		</div>

		<div class="control-group">
			<div class="controls">

				<?php if ($this->canSave): ?>
					<button type="submit" class="validate btn btn-primary">
						<?php echo JText::_('COM_ASSOCIADOS_SUBMIT'); ?>
					</button>
				<?php endif; ?>
				<a class="btn"
				   href="<?php echo JRoute::_('index.php?option=com_associados&task=associadoform.cancel'); ?>"
				   title="<?php echo JText::_('JCANCEL'); ?>">
					<?php echo JText::_('JCANCEL'); ?>
				</a>
			</div>
		</div>

		<input type="hidden" name="option" value="com_associados"/>
		<input type="hidden" name="task"
		       value="associadoform.save"/>
		<?php echo JHtml::_('form.token'); ?>
	</form>
</div>
