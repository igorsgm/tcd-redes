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
$num = 0;
?>

<!--<form role="form" class="form-inline pull-right" action="" action="<?php echo JRoute::_('index.php?option=com_agenda'); ?>" method="get">
 <div class="form-group">
	 <div class="input-group">
		<div class="input-group-addon">Mês</div>
		<select name="mes">
			<option value="0">Todos</option>
			<?php foreach ($this->mes as $mes): ?>
				<?php $num++; ?>
				<option value="<?php echo $num; ?>" <?php if($this->sMes == $num){ echo 'selected="selected"'; } ?>><?php echo $mes; ?></option>
			<?php endforeach; ?>
		</select>
	</div>
</div>

<div class="form-group">
	<div class="input-group">
		<div class="input-group-addon">Ano</div>
		<select name="ano">
			<option value="0">Todos</option>
			<?php foreach ($this->ano as $ano): ?>
				<?php $num++; ?>
				<option value="<?php echo $ano; ?>" <?php if($this->sAno == $ano){ echo 'selected="selected"'; } ?>><?php echo $ano; ?></option>
			<?php endforeach; ?>
		</select>
	</div>
</div>


<button type="submit" class="btn btn-success">Filtrar</button>

</form>-->
<div class="clearfix"></div>
<div class="page-header">
	<h1><?php echo $this->escape($this->params->get('page_title')); ?></h1>
</div>
<div class="items_list">
	<?php if(empty($this->itens)): ?>
	<div class="alert alert-warning alert-dismissible" role="alert">
	<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Fechar</span></button>
		<strong>Nenhum item encontrado</strong>
	</div>
	<?php else: ?>
		<?php foreach ($this->itens as $item): ?> 
		
		<div class="itemContent row"> 

		
			<div class="conteudo col-lg-9 col-md-9 col-sm-9 col-xs-12">
				<div class="data pull-left">
					<time time="<?php echo JText::sprintf(JHTML::_('date', $item->data_inicio, JText::_("d") , null)); ?>/<?php echo JText::sprintf(JHTML::_('date', $item->data_inicio, JText::_("m") , null)); ?>/<?php echo JText::sprintf(JHTML::_('date', $item->data_inicio, JText::_("Y") , null)); ?>">

					<h4>
					<?php echo JText::sprintf(JHTML::_('date', $item->data_inicio, JText::_("d"), null )); ?></h4>
					<p><?php echo JText::sprintf(JHTML::_('date', $item->data_inicio, JText::_("M"), null )); ?></p>
					<small><?php echo JText::sprintf(JHTML::_('date', $item->data_inicio, JText::_("Y"), null )); ?></small>
					</time>
				</div>
				<div class="detalhes">
					<h3 class="itemTitulo">
						<a href="<?php echo JRoute::_('index.php?option=com_agenda&view=agendaitem&itemdid='.$item->
							id)?>">
							<?php echo $item->nome ?></a>
					</h3>
					<?php 
						$local = JText::sprintf($item->local);
						$hora  = JText::sprintf($item->hora_inicio);
					?>
					<!-- Se o campo local estiver fazio oculta o icon -->
					 <?php if(!empty($local)):?>
						<span class="itemLocal"> <i class="fa fa-map-marker"></i>
							<?php echo JText::sprintf($item->local); ?></span>
						<?php endif; ?>	
					<!-- Se o campo hora estiver fazio oculta o icon -->
					<?php if(!empty($hora)):?>		
						<span class="itemHora"> <i class="fa fa-clock-o"></i>
							<?php echo JText::sprintf($item->hora_inicio); ?></span>
					<?php endif; ?>	
				</div>
				<div class="clearfix"></div>
				<div class="text-right">
					<a class="btn btn-link btn-lg" href="<?php echo JRoute::_('index.php?option=com_agenda&view=agendaitem&itemdid='.$item->id)?>">Ver +</a>
				</div>
			</div>
				<?php if($item->imagem): ?>
			<div class="imagem col-lg-3 col-md-3 col-sm-3 col-xs-12">
				<figure class="thumbnail">
					<img src="<?php echo $item->imagem ?>" alt="<?php echo $item->nome ?>">
				</figure>
			</div>
			<?php endif; ?>
			<div class="clearfix"></div>
			
			
		</div>
		
		<?php endforeach; ?>
		
	<?php endif; ?>
</div>