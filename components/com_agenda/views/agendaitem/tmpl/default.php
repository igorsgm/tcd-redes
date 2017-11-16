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
?>
<div>
	<?php if(empty($this->itens)): ?>
		<p>Nenhum item encontrado</p>
	<?php else: ?>
		<?php foreach ($this->itens as $item): ?>
			<div class="item_fields">
				<div class="page-header">
					<h3>
						<?php echo $item->nome; ?>
					</h3>
					<small><a href="javascript:history.back();" class="btn btn-link	 pull-right"><i class="fa fa-reply"></i> Voltar</a></small>
				</div>
				<div class="row">
					<div class="col-xs-8">
						<div class="descricao">				
							<?php echo $item->descricao; ?>
						</div>
						<?php if($item->maps): ?>
							<div class="mapa">
								<h4>Mapa do evento</h4>
								<div class="thumbnail">
									<div class="embed-container">
										<?php echo $item->maps ?>
									</div>
								</div>
							</div>
						<?php endif; 

						if(!empty($item->files)): 
							
						$files = AgendaFrontendHelper::getFilesWithTitle($item->files, $item->file_titles); ?>
						
						<h4>Arquivos</h4>
			 
						<nav class="files btn-group">
							<?php foreach ($files as $key => $file) : ?>
								<?php if(!empty($file['arquivo']['name'])):?>	
									<?php $title = $files['0']['title'];?>
									<?php if($files['0']['title'] == $title):?>
										<?php $title = array('file_titles1' => $title['file_titles0']);?>
										<a href="images/agenda/anexar/<?php echo $file['arquivo']['name'];?>" class="btn btn-default" title="Baixar arquivo: <?php echo $files['0']['title'][$key]['title'];?>">
											<i class="fa fa-download"></i>
												<span><?php echo $title[$key]['title'];?></span>
											<?php endif; ?>
											<span><?php echo $files['0']['title'][$key]['title'];?></span>
										</a>
								<?php endif; ?>	
							<?php endforeach; ?>		
						</nav>	
									

					<?php endif; ?>
				</div>
				<div class="col-xs-4">
					<?php if($item->imagem): ?>
						<div class="thumbnail">
							<img src="<?php echo $item->imagem ?>" alt="<?php echo $item->nome ?>" title="<?php echo $item->nome ?>" />
						</div>
					<?php endif; ?>

					<div class="panel panel-default">
						<div class="panel-heading">
							Mais detalhes
						</div>
						<div class="panel-body">
							<dl>
								<dt><small>Data Inicial</small></dt> 
								<dd>
									<?php echo implode('/', array_reverse(explode('-', $item->data_inicio))); ?>
								</dd>
								<?php if($item->data_fim != '0000-00-00'): ?>
									<dt><small>Data Final</small></dt> 
									<dd><?php echo implode('/', array_reverse(explode('-', $item->data_fim))); ?></dd>
								<?php endif; ?>

								<?php if($item->hora_inicio): ?>
									<dt><small>Horário Inicial</small></dt> <dd><?php echo $item->hora_inicio ?></dd>
								<?php endif; ?>
								<?php if($item->hora_fim): ?>
									<dt><small>Horário Final</small></dt> <dd><?php echo($item->hora_fim); ?></dd>
								<?php endif; ?>
								<dt><small>Local</small></dt> <dd><?php echo $item->local ?></dd>
							</dl>
						</div>

					</div>


				</div>
			</div>
		</div>
	<?php endforeach; ?>
<?php endif; ?>
</div>