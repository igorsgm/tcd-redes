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
JHtml::_('bootstrap.tooltip');
JHtml::_('behavior.multiselect');
JHtml::_('formbehavior.chosen', 'select');

$user       = JFactory::getUser();
$userId     = $user->get('id');
$listOrder  = $this->state->get('list.ordering');
$listDirn   = $this->state->get('list.direction');
$canCreate  = $user->authorise('core.create', 'com_associados') && file_exists(JPATH_COMPONENT . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'forms' . DIRECTORY_SEPARATOR . 'associadoform.xml');
$canEdit    = $user->authorise('core.edit', 'com_associados') && file_exists(JPATH_COMPONENT . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'forms' . DIRECTORY_SEPARATOR . 'associadoform.xml');
$canCheckin = $user->authorise('core.manage', 'com_associados');
$canChange  = $user->authorise('core.edit.state', 'com_associados');
$canDelete  = $user->authorise('core.delete', 'com_associados');
?>
<?php if((in_array('42', $user->groups) || in_array('53', $user->groups))):?>
<div class="page-header">
	<h1>
		Associados
	</h1>
</div>
<form action="<?php echo JRoute::_('index.php?option=com_associados&view=associados'); ?>" method="post"
      name="adminForm" id="adminForm">
      <div class="well">
			<?php echo JLayoutHelper::render('default_filter', array('view' => $this), dirname(__FILE__)); ?>
		</div>
	</div>
	<div class="table-responsive">
	<table class="table table-striped table-hover table-condensed" id="associadoList">
		<thead>
		<tr>
			<?php if (isset($this->items[0]->state)): ?>
				<!-- <th width="5%">
				<?php echo JHtml::_('grid.sort', 'JPUBLISHED', 'a.state', $listDirn, $listOrder); ?>
				</th> -->
			<?php endif; ?>

				<!-- <th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_ID', 'a.id', $listDirn, $listOrder); ?>
				</th> -->
				<!-- <th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_STATE_ANAMATRA', 'a.state_anamatra', $listDirn, $listOrder); ?>
				</th>
				<th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_STATE_AMATRA', 'a.state_amatra', $listDirn, $listOrder); ?>
				</th> -->
				<th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_AMATRA', 'a.amatra', $listDirn, $listOrder); ?>
				</th>
				<th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_NOME', 'a.nome', $listDirn, $listOrder); ?>
				</th>
				<th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_CPF', 'a.cpf', $listDirn, $listOrder); ?>
				</th>
				<!-- <th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_ESTADO_CIVIL', 'a.estado_civil', $listDirn, $listOrder); ?>
				</th> -->
				<th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_ESTADO', 'a.estado', $listDirn, $listOrder); ?>
				</th>
				<th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_CIDADE', 'a.cidade', $listDirn, $listOrder); ?>
				</th>
				<!-- <th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_FONE_COMERCIAL', 'a.fone_comercial', $listDirn, $listOrder); ?>
				</th> -->
				<th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_FONE_CELULAR', 'a.fone_celular', $listDirn, $listOrder); ?>
				</th>
				<!-- <th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_RECEBER_NEWSLETTER', 'a.receber_newsletter', $listDirn, $listOrder); ?>
				</th>
				<th class=''>
				<?php echo JHtml::_('grid.sort',  'COM_ASSOCIADOS_ASSOCIADOS_RECEBER_SMS', 'a.receber_sms', $listDirn, $listOrder); ?>
				</th> -->


				<!-- <?php if ($canEdit || $canDelete): ?>
				<th class="center">
				<?php echo JText::_('COM_ASSOCIADOS_ASSOCIADOS_ACTIONS'); ?>
				</th>
				<?php endif; ?> -->

		</tr>
		</thead>
		<tfoot>
			<tr>
				<td colspan="<?php echo isset($this->items[0]) ? count(get_object_vars($this->items[0])) : 20; ?>">
					<div class="row">
						<div class="col-md-1 associado-edit">
						<?php echo $this->pagination->getLimitBox(); ?>
						</div>
						<div class="col-md-10">
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<?php echo $this->pagination->getPagesLinks(); ?>
						</div>
					</div>
				</td>
			</tr>
		</tfoot>
		<tbody>
		<?php foreach ($this->items as $i => $item) : ?>
			<?php $canEdit = $user->authorise('core.edit', 'com_associados'); ?>

							<?php if (!$canEdit && $user->authorise('core.edit.own', 'com_associados')): ?>
					<?php $canEdit = JFactory::getUser()->id == $item->created_by; ?>
				<?php endif; ?>

			<tr class="row<?php echo $i % 2; ?>">

				<?php if (isset($this->items[0]->state)) : ?>
					<?php $class = ($canChange) ? 'active' : 'disabled'; ?>
					<!-- <td class="center">
						<a class="btn btn-micro <?php echo $class; ?>" href="<?php echo ($canChange) ? JRoute::_('index.php?option=com_associados&task=associado.publish&id=' . $item->id . '&state=' . (($item->state + 1) % 2), false, 2) : '#'; ?>">
						<?php if ($item->state == 1): ?>
							<i class="icon-publish"></i>
						<?php else: ?>
							<i class="icon-unpublish"></i>
						<?php endif; ?>
						</a>
					</td> -->
				<?php endif; ?>

				<!-- <td>

					<?php echo $item->id; ?>
				</td> -->
				<!-- <td>

					<?php echo $item->state_anamatra; ?>
				</td> -->
				<!-- <td>

					<?php echo $item->state_amatra; ?>
				</td> -->
				<td>

					<a title="Editar: <?php echo $item->nome; ?>" data-toggle="tooltip" href="<?php echo JRoute::_('index.php?option=com_associados&task=associadoform.edit&id=' . $item->id, false, 2); ?>" class="btn btn-mini" type="button"><?php echo $item->amatra; ?></a>
				</td>
				<td>
					<a title="Editar: <?php echo $item->nome; ?>" data-toggle="tooltip" href="<?php echo JRoute::_('index.php?option=com_associados&task=associadoform.edit&id=' . $item->id, false, 2); ?>" class="btn btn-mini" type="button"><?php echo $item->nome; ?></a>
					<!-- <?php echo $item->nome; ?> -->
				</td>
				<td>

					<a title="Editar: <?php echo $item->nome; ?>" data-toggle="tooltip" href="<?php echo JRoute::_('index.php?option=com_associados&task=associadoform.edit&id=' . $item->id, false, 2); ?>" class="btn btn-mini" type="button"><?php echo $item->cpf; ?></a>
				</td>
				<!-- <td>

					<?php echo $item->estado_civil; ?>
				</td> -->
				<td>

					<a title="Editar: <?php echo $item->nome; ?>" data-toggle="tooltip" href="<?php echo JRoute::_('index.php?option=com_associados&task=associadoform.edit&id=' . $item->id, false, 2); ?>" class="btn btn-mini" type="button"><?php echo $item->estado; ?></a>
				</td>
				<td>

					<a title="Editar: <?php echo $item->nome; ?>" data-toggle="tooltip" href="<?php echo JRoute::_('index.php?option=com_associados&task=associadoform.edit&id=' . $item->id, false, 2); ?>" class="btn btn-mini" type="button"><?php echo $item->cidade; ?></a>
				</td>
				<!-- <td>

					<?php echo $item->fone_comercial; ?>
				</td> -->
				<td>

					<a title="Editar: <?php echo $item->nome; ?>" data-toggle="tooltip" href="<?php echo JRoute::_('index.php?option=com_associados&task=associadoform.edit&id=' . $item->id, false, 2); ?>" class="btn btn-mini" type="button"><?php echo $item->fone_celular; ?></a>
				</td>
				<!-- <td>

					<?php echo $item->receber_newsletter; ?>
				</td> -->
				<!-- <td>

					<?php echo $item->receber_sms; ?>
				</td> -->


				<!-- <?php if ($canEdit || $canDelete): ?>
					<td class="center">
						<?php if ($canEdit): ?>
							<a href="<?php echo JRoute::_('index.php?option=com_associados&task=associadoform.edit&id=' . $item->id, false, 2); ?>" class="btn btn-mini" type="button"><i class="icon-edit" ></i></a>
						<?php endif; ?>
						<?php if ($canDelete): ?>
							<a href="<?php echo JRoute::_('index.php?option=com_associados&task=associadoform.remove&id=' . $item->id, false, 2); ?>" class="btn btn-mini delete-button" type="button"><i class="icon-trash" ></i></a>
						<?php endif; ?>
					</td>
				<?php endif; ?> -->

			</tr>
		<?php endforeach; ?>
		</tbody>
	</table>
	</div>

	<!-- <?php if ($canCreate) : ?>
		<a href="<?php //echo JRoute::_('index.php?option=com_associados&task=associadoform.edit&id=0', false, 2); ?>"
		   class="btn btn-success btn-small"><i
				class="icon-plus"></i>
			<?php //echo JText::_('COM_ASSOCIADOS_ADD_ITEM'); ?></a>
	<?php endif; ?> -->

	<input type="hidden" name="task" value=""/>
	<input type="hidden" name="boxchecked" value="0"/>
	<input type="hidden" name="filter_order" value="<?php echo $listOrder; ?>"/>
	<input type="hidden" name="filter_order_Dir" value="<?php echo $listDirn; ?>"/>
	<?php echo JHtml::_('form.token'); ?>
</form>
<?php else: ?>
	<div class="alert alert-danger" style="text-align: center;"><h4>Você não tem acesso a este recurso.</h4></div>
<?php endif; ?>
<?php if($canDelete) : ?>
<script type="text/javascript">

	jQuery(document).ready(function () {
		jQuery('.delete-button').click(deleteItem);
	});

	function deleteItem() {

		if (!confirm("<?php echo JText::_('COM_ASSOCIADOS_DELETE_MESSAGE'); ?>")) {
			return false;
		}
	}
</script>
<?php endif; ?>
