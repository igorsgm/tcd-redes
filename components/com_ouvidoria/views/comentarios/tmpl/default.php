<?php
/**
 * @version    CVS: 1.0.3
 * @package    Com_Ouvidoria
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  2017 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */

// No direct access
use Thomisticus\Utils\Date;

defined('_JEXEC') or die;

JHtml::addIncludePath(JPATH_COMPONENT . '/helpers/html');
JHtml::_('bootstrap.tooltip');
JHtml::_('behavior.multiselect');
JHtml::_('thomisticus.assets');

// Overriding select chosen para exibir a busca a partir de 1 resultado (por padrão só exibe a partir de 10)
JHtml::_('formbehavior.chosen', 'select', null, array('disable_search_threshold' => 1));

$lang->load('com_ouvidoria', JPATH_SITE);
ThomisticusHelperAsset::load('ouvidoria.css');
ThomisticusHelperAsset::load('comentarios.js');
ThomisticusHelperAsset::load('utilities.js');

$user       = JFactory::getUser();
$userId     = $user->get('id');
$listOrder  = $this->state->get('list.ordering');
$listDirn   = $this->state->get('list.direction');
$canCreate  = $user->authorise('core.create', 'com_ouvidoria') && file_exists(JPATH_COMPONENT . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'forms' . DIRECTORY_SEPARATOR . 'comentarioform.xml');
$canEdit    = $user->authorise('core.edit', 'com_ouvidoria') && file_exists(JPATH_COMPONENT . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'forms' . DIRECTORY_SEPARATOR . 'comentarioform.xml');
$canCheckin = $user->authorise('core.manage', 'com_ouvidoria');
$canChange  = $user->authorise('core.edit.state', 'com_ouvidoria');
$canDelete  = $user->authorise('core.delete', 'com_ouvidoria');

?>

<div class="page-header">
	<h1>
		<small><?php echo JText::_('COM_OUVIDORIA_OUVIDORIA_TITLE'); ?></small>
		<br/>
		<?php echo JText::_('COM_OUVIDORIA_TITLE_COMENTARIOS'); ?></h1>
</div>

<section class="comentario">
	<div id="topo" class="comentario_header">
		<nav class="navbar navbar-default" role="navigation">
			<div class="container-fluid">
				<!-- Brand and toggle get grouped for better mobile display -->
				<div class="navbar-header">
					<strong class="navbar-brand">
						<?php echo JText::sprintf('COM_OUVIDORIA_TITLE_COMENTARIOS_HEADER', $this->solicitacao->protocolo); ?>
					</strong>
				</div>
				<?php if ($this->isUserOuvidoriaOrSuperUser): ?>
					<ul class="nav navbar-nav">
						<li>
						<span class="bg-warning">
							<small>Prazo:</small>
							<strong>7 dias</strong>
						</span>
						</li>
					</ul>
				<?php endif; ?>
				<ul class="nav navbar-nav navbar-right">
					<li>
						<span>
							<small><?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_TIPO'); ?>: <strong><?php echo $this->solicitacao->id_tipo ?></strong> </small>
							<small><?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_TIPO_DIRETORIA'); ?>: <strong> <?php echo $this->solicitacao->id_diretoria_responsavel ?> </strong> </small>
						</span>
					</li>
					<li>
						<a href="#rodape" class="btn scroll bg-warning" title="<?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_GO_BOTTOM'); ?>">
							<i class="fa fa-angle-double-down"></i> <span class="sr-only"><?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_GO_BOTTOM'); ?></span>
						</a>
					</li>
				</ul>
			</div>
		</nav>

		<?php if ($this->isUserOuvidoriaOrSuperUser): ?>
			<div class="comentario_header-others">
				<div class="row">
					<div class="col-sm-4">
						<dl>
							<dt><?php echo JText::_('COM_OUVIDORIA_SOLICITACOES_ID_SOLICITANTE'); ?>:</dt>
							<dd><?php echo $this->solicitante->nome ?></dd>
						</dl>
						<dl>
							<dt><?php echo JText::_('COM_OUVIDORIA_SOLICITANTES_CPF'); ?>:</dt>
							<dd><?php echo $this->solicitante->cpf ?></dd>
						</dl>
					</div>
					<div class="col-sm-4">
						<dl>
							<dt><?php echo JText::_('COM_OUVIDORIA_FORM_LBL_SOLICITANTE_EMAIL'); ?>:</dt>
							<dd><?php echo $this->solicitante->email ?></dd>
						</dl>
						<dl>
							<dt><?php echo JText::_('COM_OUVIDORIA_FORM_LBL_SOLICITANTE_TELEFONE'); ?>:</dt>
							<dd><?php echo $this->solicitante->telefone ?></dd>
						</dl>
					</div>
					<div class="col-sm-4">
						<dl>
							<dt><?php echo JText::_('COM_OUVIDORIA_FORM_LBL_SOLICITANTE_IS_ASSOCIADO'); ?>:</dt>
							<dd><?php echo isset($this->solicitante->is_associado) ? $this->solicitante->is_associado : 'Não'; ?></dd>
						</dl>
						<dl>
							<dt><?php echo JText::_('COM_OUVIDORIA_FORM_LBL_SOLICITANTE_AMATRA'); ?>:</dt>
							<dd><?php echo isset($this->solicitante->amatra) ? $this->solicitante->amatra : 'Não informado'; ?></dd>
						</dl>
					</div>
				</div>
			</div>
		<?php endif; ?>

	</div>

	<div class="comentario_content">
		<div class="row">
			<div class="col-sm-8">
				<div class="list-group">

					<div class="list-group-item list-group-item-action flex-column align-items-start">
						<div class="comment-header">
							<h5>Solicitante: <strong><?php echo $this->solicitante->nome ?></strong></h5>
							<time>
								<small><?php echo Date::formatDate($this->solicitacao->created_at, 'd/m/Y H:i:s') ?></small>
							</time>
						</div>
						<p id="texto-comentario-80"><?php echo $this->solicitacao->texto ?></p>
						<div class="comment-footer">
							<?php if (!empty($this->solicitacao->anexo)): ?>
								<a class="btn btn-link btn-info" href="<?php echo JUri::root() . 'media/com_ouvidoria/arquivos/solicitacoes/' . $this->solicitacao->anexo; ?>"
								   title="<?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_DOWNLOAD_TIP'); ?>" target="_blank">
									<i class='fa fa-download'></i>
									<?php echo $this->solicitacao->anexo; ?>
								</a>
							<?php endif; ?>
						</div>
					</div>

					<?php foreach ($this->items as $item): ?>
						<?php if ($item->hasChangeStatusMessage && !empty($item->interacao->statusChangedTo)): ?>

							<div class="list-group-item-status flex-column align-items-start user-item">
								<time>
									<small><?php echo Date::formatDate($item->created_at, 'd/m/Y H:i:s') ?></small>
								</time>
								<?php echo JText::sprintf('COM_OUVIDORIA_STATUS_ALTERADO_PARA', $item->interacao->statusChangedTo); ?>
							</div>

						<?php endif; ?>

						<?php if (!empty($item->comentario)): ?>
							<div class="list-group-item list-group-item-action flex-column align-items-start <?php echo $item->typeClass; ?>">

								<div class="comment-header">
									<h5><?php echo $item->isAnamatraInteraction ? JText::_('COM_OUVIDORIA_OUVIDORIA_TITLE') : 'Solicitante : '; ?>
										<strong><?php echo $item->isAnamatraInteraction ? $item->created_by->name : $item->created_by_solicitante->nome; ?></strong>
									</h5>

									<?php if ($item->isAnamatraInteraction): ?>
										<strong class="text-uppercase"><?php echo $item->created_by->diretoria; ?></strong>
									<?php endif; ?>

									<time>
										<small><?php echo Date::formatDate($item->created_at, 'd/m/Y H:i:s') ?></small>
									</time>
								</div>

								<?php if (!empty($item->comentario->texto)): ?>
									<p id="texto-comentario-80"><?php echo $item->comentario->texto ?></p>
								<?php endif; ?>


								<?php if ($item->showCommentFooter): ?>
									<div class="comment-footer">
										<?php if (!empty($item->comentario->user_consultado_name) || !empty($item->comentario->user_consultado_por_name)): ?>
											<span class="btn disabled"><?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_' . ($item->interacao->id == 9 ? 'CONSULTADO_POR' : 'CONSULTANDO')); ?>
												<strong><?php echo $item->interacao->id == 9 ? $item->comentario->user_consultado_por_name : $item->comentario->user_consultado_name; ?></strong>
											</span>
										<?php endif; ?>

										<?php if (!empty($item->comentario->anexo)): ?>
											<a class="btn btn-link btn-info" href="<?php echo JUri::root() . 'media/com_ouvidoria/arquivos/solicitacoes/' . $item->comentario->anexo; ?>"
											   title="<?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_DOWNLOAD_TIP'); ?>" target="_blank">
												<i class='fa fa-download'></i>
												<?php echo $item->comentario->anexo; ?>
											</a>
										<?php endif; ?>
									</div>
								<?php endif; ?>
							</div>
						<?php endif; ?>
					<?php endforeach; ?>

				</div>
			</div>

			<?php echo $this->loadTemplate('form_comentario'); ?>

		</div>
	</div>

	<div id="rodape" class="comentario_footer navbar navbar-default">
		<div class="container-fluid">
			<span class="navbar-header">
				<a title="Voltar à página anterior" href="javascript:history.back();" class="btn navbar-brand bg-warning">
					<small><i class="fa fa-angle-double-left"></i> <span class="sr-only"><?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_GO_BACK'); ?></span></small>
				</a>
			</span>
			<ul class="nav navbar-nav">
				<li>
					<span>
						<small>
							<?php echo JText::_('COM_OUVIDORIA_FORM_LBL_SOLICITACAO_STATUS'); ?>
						</small>
						<strong>
							<i class="<?php echo $this->solicitacao->statusClass; ?>"> </i>
							<?php echo $this->solicitacao->status; ?>
						</strong>
					</span>
				</li>
			</ul>
			<ul class="nav navbar-nav navbar-right">
				<?php if (!$this->isUserOuvidoriaOrSuperUser && !$this->isSolicitacaoDisabled): ?>
					<li>
						<a href="#" class="btn" data-action="finalizar-chamado" data-solicitacao-id="<?php echo $this->solicitacao->id; ?>">
							<?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_FINISH'); ?>
						</a>
					</li>
				<?php endif; ?>
				<li>
					<a href="#topo" class="btn scroll bg-warning" title="Ir para o topo">
						<i class="fa fa-angle-double-up"></i> <span class="sr-only"><?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_GO_TOP'); ?></span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</section>


