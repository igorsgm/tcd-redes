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

use Thomisticus\Utils\Date;

JHtml::addIncludePath(JPATH_COMPONENT . '/helpers/html');
JHtml::_('bootstrap.tooltip');
JHtml::_('behavior.multiselect');
// Load admin language file
$lang = JFactory::getLanguage();
$lang->load('com_ouvidoria', JPATH_SITE);
ThomisticusHelperAsset::load('ouvidoria.css');
// Overriding select chosen para exibir a busca a partir de 1 resultado (por padrão só exibe a partir de 10)
JHtml::_('formbehavior.chosen', 'select', null, array('disable_search_threshold' => 1));

$user       = JFactory::getUser();
$userId     = $user->get('id');
$listOrder  = $this->state->get('list.ordering');
$listDirn   = $this->state->get('list.direction');
$canCreate  = $user->authorise('core.create', 'com_ouvidoria') && file_exists(JPATH_COMPONENT . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'forms' . DIRECTORY_SEPARATOR . 'solicitacaoform.xml');
$canEdit    = $user->authorise('core.edit', 'com_ouvidoria') && file_exists(JPATH_COMPONENT . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'forms' . DIRECTORY_SEPARATOR . 'solicitacaoform.xml');
$canCheckin = $user->authorise('core.manage', 'com_ouvidoria');
$canChange  = $user->authorise('core.edit.state', 'com_ouvidoria');
$canDelete  = $user->authorise('core.delete', 'com_ouvidoria');
?>
<div class="page-header">
	<h1>
	<small><?php echo JText::_('COM_OUVIDORIA_OUVIDORIA_TITLE'); ?></small>
	<br/>
	<?php echo JText::_('COM_OUVIDORIA_OUVIDORIA_TITLE_CONTROL_PANEL'); ?></h1>
</div>
<form action="<?php echo JRoute::_('index.php?option=com_ouvidoria&view=solicitacoes'); ?>" method="post"
      name="adminForm" id="adminForm">

	<?php echo JLayoutHelper::render('default_filter', array('view' => $this), dirname(__FILE__)); ?>
	<hr />
<div class="panel panel-default">

	<div class="table-responsive">
		<table class="table table-striped" id="solicitacaoList">
			<thead>
			<tr>
				<th class=''>
					<?php echo JHtml::_('grid.sort', 'COM_OUVIDORIA_SOLICITACOES_PROTOCOLO', 'a.protocolo', $listDirn, $listOrder); ?>
				</th>
				<th class=''>
					<?php echo JHtml::_('grid.sort', 'COM_OUVIDORIA_SOLICITACOES_CREATED_AT', 'a.created_at', $listDirn, $listOrder); ?>
				</th>
				<th class=''>
					<?php echo JHtml::_('grid.sort', 'COM_OUVIDORIA_SOLICITACOES_STATUS', 'a.status', $listDirn, $listOrder); ?>
				</th>
				<th class=''>
					<?php echo JHtml::_('grid.sort', 'COM_OUVIDORIA_SOLICITACOES_ID_SOLICITANTE', 'a.id_solicitante', $listDirn, $listOrder); ?>
				</th>
				<th class=''>
					<?php echo JHtml::_('grid.sort', 'COM_OUVIDORIA_SOLICITACOES_ID_TIPO', 'a.id_tipo', $listDirn, $listOrder); ?>
				</th>
				<th class=''>
					<?php echo JHtml::_('grid.sort', 'COM_OUVIDORIA_SOLICITACOES_TEXTO', 'a.texto', $listDirn, $listOrder); ?>
				</th>
				<th class=''>
					<?php echo JHtml::_('grid.sort', 'COM_OUVIDORIA_SOLICITACOES_UPDATED_AT', 'a.updated_at', $listDirn, $listOrder); ?>
				</th>
				<th class=''>
					<?php echo JHtml::_('grid.sort', 'COM_OUVIDORIA_SOLICITACOES_ID_USER_RESPONSAVEL_ATUAL', 'a.id_user_responsavel_atual', $listDirn, $listOrder); ?>
				</th>
				<th class="bg-warning">
					Prazo
				</th>
			</tr>
			</thead>

			<tbody>
			<?php foreach ($this->items as $i => $item) : ?>
				<?php $canEdit = $user->authorise('core.edit', 'com_ouvidoria'); ?>

				<?php if (!$canEdit && $user->authorise('core.edit.own', 'com_ouvidoria')): ?>
					<?php $canEdit = JFactory::getUser()->id == $item->created_by; ?>
				<?php endif; ?>

				<tr class="row<?php echo $i % 2; ?>">

					<td>
						<?php if (isset($item->checked_out) && $item->checked_out) : ?>
							<?php echo JHtml::_('jgrid.checkedout', $i, $item->uEditor, $item->checked_out_time, 'solicitacoes.', $canCheckin); ?>
						<?php endif; ?>
						<a href="<?php echo JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . (int)$item->id); ?>">
							<strong><?php echo $this->escape($item->protocolo); ?></strong>
						</a>

					</td>
					<td>
						<a href="<?php echo JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . (int)$item->id); ?>">
							<small>
								<?php echo Date::formatDate($item->created_at, 'd/m/Y - H:i'); ?>
							</small>
						</a>
					</td>
					<td>
						<a href="<?php echo JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . (int)$item->id); ?>">
							<strong>
								<?php echo $item->status; ?>
							</strong>
						</a>
					</td>
					<td>
						<a href="<?php echo JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . (int)$item->id); ?>">
							<?php echo $item->id_solicitante; ?>
						</a>
					</td>
					<td>
						<a href="<?php echo JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . (int)$item->id); ?>">
							<?php echo $item->id_tipo; ?>
						</a>
					</td>
					<td>
						<a href="<?php echo JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . (int)$item->id); ?>">
							<small>
								<?php
									$intro = substr($item->texto, 0, 40);
									echo $intro;
									echo "...";
								?>
							</small>
						</a>
					</td>

					 <td>
					 	<a href="<?php echo JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . (int)$item->id); ?>">
							<small>
								<?php echo Date::formatDate($item->updated_at, 'd/m/Y - H:i'); ?>
							</small>
						</a>
					</td>
					<td>
						<a href="<?php echo JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . (int)$item->id); ?>">
							<?php echo $item->id_user_responsavel_atual; ?>
						</a>

					</td>
					<td class="bg-warning">
						<a href="<?php echo JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . (int)$item->id); ?>">
						 	<strong>
							7 dias
							</strong>
						</a>
					</td>
				</tr>
			<?php endforeach; ?>
			</tbody>
		</table>
	</div>
</div>
	<div id="rodape" class="comentario_footer navbar navbar-default">
		<div class="container-fluid">
			<span class="navbar-header">
				<a title="Voltar à página anterior" href="javascript:history.back();" class="btn navbar-brand bg-warning">
					<small><i class="fa fa-angle-double-left"></i> <span class="sr-only"><?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_GO_BACK');?></span></small>
				</a>
			</span>
			<ul class="nav navbar-nav navbar-right">
				<li>
					<?php echo $this->pagination->getListFooter(); ?>
				</li>
			</ul>
		</div>
	</div>


	<input type="hidden" name="task" value=""/>
	<input type="hidden" name="boxchecked" value="0"/>
	<input type="hidden" name="filter_order" value="<?php echo $listOrder; ?>"/>
	<input type="hidden" name="filter_order_Dir" value="<?php echo $listDirn; ?>"/>
	<?php echo JHtml::_('form.token'); ?>
</form>


