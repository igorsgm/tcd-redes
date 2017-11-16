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

// Overriding select chosen para exibir a busca a partir de 1 resultado (por padrão só exibe a partir de 10)
JHtml::_('formbehavior.chosen', 'select', null, array('disable_search_threshold' => 1));

JHtml::_('thomisticus.assets');
JHtml::_('thomisticus.mask');

// Load admin language file
$lang = JFactory::getLanguage();
$lang->load('com_ouvidoria', JPATH_SITE);

ThomisticusHelperAsset::load('form.js');
ThomisticusHelperAsset::load('solicitacao.js');
ThomisticusHelperAsset::load('ouvidoria.css');

$user    = JFactory::getUser();
$canEdit = OuvidoriaHelpersOuvidoria::canUserEdit($this->item, $user);

?>

<script>
	(function ($) {
		isSolicitante = false;
		isLogged    = <?php echo empty($user->id) ? 'false' : 'true'; ?>;
		isAssociado = <?php echo empty($this->solicitante->id_associado) ? 'false' : 'true'; ?>;

		$(document).ready(function () {
			checkFieldsToBlock();
			addMasks();
		});

	}(window.jQuery.noConflict(), window, document));
</script>

<div class="solicitacao-edit front-end-edit">
	<?php if (!$canEdit) : ?>
		<h3>
			<?php throw new Exception(JText::_('COM_OUVIDORIA_ERROR_MESSAGE_NOT_AUTHORISED'), 403); ?>
		</h3>
	<?php else : ?>

		<div id="topo" class="page-header">
			<h3><?php echo JText::_('COM_OUVIDORIA_OUVIDORIA_TITLE'); ?></h3>
		</div>
		<p>
			<?php echo JText::_('COM_OUVIDORIA_OUVIDORIA_DESC'); ?>
		</p>

		<ul class="nav btn-group" role="tablist">
			<li role="presentation" class="<?php echo $this->isAssociadoRedirectedLogin ? 'active' : '' ?>">
				<a class="btn btn-primary" aria-controls="novo_chamado" role="tab" data-toggle="tab" href="#novo_chamado"><?php echo JText::_('COM_OUVIDORIA_OUVIDORIA_BTN_NEW'); ?></a>
			</li>
			<li role="presentation">
				<a class="btn btn-default" aria-controls="consultar_chamado" role="tab" data-toggle="tab" href="#consultar_chamado"><?php echo JText::_('COM_OUVIDORIA_OUVIDORIA_BTN_SEARCH'); ?></a>
			</li>

			<?php if ($this->isUserOuvidoriaOrSuperUser): ?>
				<li role="presentation" class="pull-right">
					<a class="btn btn-info" href="<?php echo JRoute::_('index.php?option=com_ouvidoria&view=solicitacoes'); ?>"><?php echo JText::_('COM_OUVIDORIA_OUVIDORIA_BTN_CONTROL_PANEL'); ?></a>
				</li>
			<?php endif; ?>

		</ul>
		<div class="tab-content">
			<div role="tabpanel" class="tab-pane <?php echo $this->isAssociadoRedirectedLogin ? 'active' : '' ?>" id="novo_chamado">
				<div data-panel="solicitante" class="panel panel-default">

					<div class="panel-heading">
						<h4>
							<i class="fa fa-list-alt"></i>
							<strong><?php echo JText::_('COM_OUVIDORIA_DADOS_DA_SOLICITACAO'); ?></strong>
						</h4>
					</div>
					<div class="panel-body">
						<form id="form-solicitante" data-form="solicitante"
						      action="<?php echo JRoute::_('index.php?option=com_ouvidoria&task=solicitante.save'); ?>"
						      method="post" class="form-validate" enctype="multipart/form-data">

							<input type="hidden" name="jform[id]" value="<?php echo $this->solicitante->id; ?>"/>

							<input type="hidden" name="jform[ordering]" value="<?php echo $this->solicitante->ordering; ?>"/>

							<input type="hidden" name="jform[state]" value="<?php echo $this->solicitante->state; ?>"/>

							<input type="hidden" name="jform[checked_out]" value="<?php echo $this->solicitante->checked_out; ?>"/>

							<input type="hidden" name="jform[checked_out_time]" value="<?php echo $this->solicitante->checked_out_time; ?>"/>

							<?php echo $this->formSolicitante->getInput('created_by'); ?>
							<?php echo $this->formSolicitante->getInput('modified_by'); ?>
							<?php echo $this->formSolicitante->getInput('updated_at'); ?>
							<?php echo $this->formSolicitante->getInput('created_at'); ?>
							<small class="tip">
								<em><?php echo JText::_('COM_OUVIDORIA_REQUIRED_TIP'); ?></em>
							</small>
							<div class="row">
								<div class="col-sm-3 col-md-2">
									<?php echo $this->formSolicitante->renderField('is_associado'); ?>
								</div>
								<div class="col-sm-4">
									<?php echo $this->formSolicitante->renderField('cpf'); ?>
								</div>
								<div class="col-sm-5 col-md-6">
									<?php echo $this->formSolicitante->renderField('nome'); ?>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-6">
									<?php echo $this->formSolicitante->renderField('email'); ?>
								</div>
								<div class="col-sm-3">
									<?php echo $this->formSolicitante->renderField('telefone'); ?>
								</div>
								<div class="col-sm-3">
									<?php echo $this->formSolicitante->renderField('amatra'); ?>
								</div>
							</div>

							<div class="hidden">
								<?php echo $this->formSolicitante->renderField('id_associado'); ?>
							</div>
							<?php foreach ((array)$this->solicitante->id_associado as $value): ?>
								<?php if (!is_array($value)): ?>
									<input type="hidden" class="id_associado" name="jform[id_associadohidden][<?php echo $value; ?>]" value="<?php echo $value; ?>"/>
								<?php endif; ?>
							<?php endforeach; ?>
							<?php echo $this->formSolicitante->renderField('id_user'); ?>

							<?php foreach ((array)$this->solicitante->id_user as $value): ?>
								<?php if (!is_array($value)): ?>
									<input type="hidden" class="id_user" name="jform[id_userhidden][<?php echo $value; ?>]" value="<?php echo $value; ?>"/>
								<?php endif; ?>
							<?php endforeach; ?>

							<div class="control-group tip">
								<i class="fa fa-info-circle"></i>
								<em>
									<?php $text = JText::_('COM_OUVIDORIA_DATA_TIP_NO_ASSOC'); ?>
									<?php if (!empty($user->id)) : ?>
										<?php $text = JText::sprintf('COM_OUVIDORIA_DATA_TIP_ASSOC', JRoute::_(JRoute::_(JUri::root() . 'index.php?option=com_associados&view=associadoform'))); ?>
									<?php endif; ?>
									<?php echo $text; ?>

								</em>
							</div>

							<div class="control-group">
								<div class="controls">

									<?php if ($this->canSave): ?>
										<button type="submit" class="validate btn btn-primary">
											<?php echo JText::_('COM_OUVIDORIA_REDIGIR_CHAMADO'); ?>
										</button>
									<?php endif; ?>
								</div>
							</div>

							<input type="hidden" name="option" value="com_ouvidoria"/>
							<input type="hidden" name="task"
							       value="solicitanteform.save"/>
							<?php echo JHtml::_('form.token'); ?>
						</form>
					</div>

					<div data-panel="solicitacao" class="panel-body chamado-form hidden">
						<form id="form-solicitacao" data-form="solicitacao"
						      action="<?php echo JRoute::_('index.php?option=com_ouvidoria&task=solicitacao.save'); ?>"
						      method="post" class="form-validate" enctype="multipart/form-data">

							<input type="hidden" name="jform[id]" value="<?php echo $this->item->id; ?>"/>

							<input type="hidden" name="jform[ordering]" value="<?php echo $this->item->ordering; ?>"/>

							<input type="hidden" name="jform[state]" value="<?php echo $this->item->state; ?>"/>

							<input type="hidden" name="jform[checked_out]" value="<?php echo $this->item->checked_out; ?>"/>

							<input type="hidden" name="jform[checked_out_time]" value="<?php echo $this->item->checked_out_time; ?>"/>
							<div class="hidden">
								<?php echo $this->form->getInput('created_by'); ?>
								<?php echo $this->form->getInput('modified_by'); ?>
								<?php echo $this->form->getInput('updated_at'); ?>
								<?php echo $this->form->getInput('created_at'); ?>
								<?php echo $this->form->renderField('id_solicitante'); ?>
							</div>
							<?php foreach ((array)$this->item->id_solicitante as $value): ?>
								<?php if (!is_array($value)): ?>
									<input type="hidden" class="id_solicitante" name="jform[id_solicitantehidden][<?php echo $value; ?>]" value="<?php echo $value; ?>"/>
								<?php endif; ?>
							<?php endforeach; ?>

							<div class="row">
								<div class="col-sm-3">
									<?php echo $this->form->renderField('id_tipo'); ?>

									<?php foreach ((array)$this->item->id_tipo as $value): ?>
										<?php if (!is_array($value)): ?>
											<input type="hidden" class="id_tipo" name="jform[id_tipohidden][<?php echo $value; ?>]" value="<?php echo $value; ?>"/>
										<?php endif; ?>
									<?php endforeach; ?>
								</div>
								<div class="col-sm-4">
									<?php echo $this->form->renderField('id_diretoria_responsavel'); ?>

									<?php foreach ((array)$this->item->id_diretoria_responsavel as $value): ?>
										<?php if (!is_array($value)): ?>
											<input type="hidden" class="id_diretoria_responsavel" name="jform[id_diretoria_responsavelhidden][<?php echo $value; ?>]" value="<?php echo $value; ?>"/>
										<?php endif; ?>
									<?php endforeach; ?>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<?php echo $this->form->renderField('texto'); ?>
								</div>
							</div>

							<div class="hidden">
								<?php $anexoFiles = array(); ?>
								<?php if (!empty($this->item->anexo)) : ?>
									<?php foreach ((array)$this->item->anexo as $fileSingle) : ?>
										<?php if (!is_array($fileSingle)) : ?>
											<a href="<?php echo JRoute::_(JUri::root() . 'solicitacoes' . DIRECTORY_SEPARATOR . $fileSingle, false); ?>"><?php echo $fileSingle; ?></a> |
											<?php $anexoFiles[] = $fileSingle; ?>
										<?php endif; ?>
									<?php endforeach; ?>
								<?php endif; ?>
								<input type="hidden" name="jform[anexo_hidden]" id="jform_anexo_hidden" value="<?php echo implode(',', $anexoFiles); ?>"/>

								<?php echo $this->form->renderField('status'); ?>

								<?php foreach ((array)$this->item->status as $value): ?>
									<?php if (!is_array($value)): ?>
										<input type="hidden" class="status" name="jform[statushidden][<?php echo $value; ?>]" value="<?php echo $value; ?>"/>
									<?php endif; ?>
								<?php endforeach; ?>
								<?php echo $this->form->renderField('id_user_responsavel_atual'); ?>

								<?php foreach ((array)$this->item->id_user_responsavel_atual as $value): ?>
									<?php if (!is_array($value)): ?>
										<input type="hidden" class="id_user_responsavel_atual" name="jform[id_user_responsavel_atualhidden][<?php echo $value; ?>]" value="<?php echo $value; ?>"/>
									<?php endif; ?>
								<?php endforeach; ?>
							</div>
							<div class="row">
								<div class="col-sm-8">
									<?php echo $this->form->renderField('anexo'); ?>
								</div>
								<div class="col-sm-4">
									<div class="control-group">
										<div class="controls text-right">
											<br>
											<?php if ($this->canSave): ?>
												<button type="submit" class="validate btn btn-success">
													<?php echo JText::_('COM_OUVIDORIA_ENVIAR_CHAMADO'); ?>
												</button>
											<?php endif; ?>
										</div>
									</div>
								</div>
							</div>

							<input type="hidden" name="option" value="com_ouvidoria"/>
							<input type="hidden" name="task"
							       value="solicitacaoform.save"/>
							<?php echo JHtml::_('form.token'); ?>
						</form>
					</div>
				</div>
			</div>

			<?php echo $this->loadTemplate('consultar'); ?>

		</div>
	<?php endif; ?>
</div>
