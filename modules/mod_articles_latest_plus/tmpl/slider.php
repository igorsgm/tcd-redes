<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_articles_latest
 *
 * @copyright   Copyright (C) 2005 - 2016 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
?>
<div id="carousel-<?php echo $module->id;?>" class="primary-slider carousel slide" data-interval="8000" data-ride="carousel">
	<div class="carousel-inner" role="listbox">
	<?php foreach ($items as $key=>$item):
		// transformando o json das imagens em array
		$images  = json_decode($item->images);?>
		<div class="item <?php if ($key == '0') echo 'active'; ?> <?php echo ($key%2) ? "odd" : "even"; if(count($items)==$key+1) echo ' lastItem'; ?>">

			<div class="row-fluid">
				<?php if($params->get('itemImage') && (isset($images->image_intro) || isset($images->image_fulltext))): ?>
					<div class="imagem <?php echo 'span'.$params->get('itemImageSpan');?>">
						<div class="img-item">
							<a class="moduleItemImage" href="<?php echo $item->link; ?>" title="<?php echo $item->title; ?>">
								<img src="
								<?php // Se tiver imagem do artigo exibe, senão exibe a da intro
									$image = ($images->image_fulltext ? $images->image_fulltext : $images->image_intro);
									echo $image; ?>" alt="<?php echo $item->title; ?>
								"/>
							</a>
						</div>
					</div>
				<?php endif; ?>
				<div class="texto <?php if(empty($images->image_intro) || !$params->get('itemImage')) echo "span12"; else echo 'span' .$params->get('itemContentSpan'); ?>">
					<?php if($params->get('itemDateCreated')): ?>
						<span class="moduleItemDateCreated">
							<?php   //Se tiver data customizada exibe, senão exibe a padrão
									$dateFormat = ($params->get('itemCustomDateFormat') ? $params->get('itemCustomDateFormat') : $params->get('itemDateFormat'));
									echo JHTML::_('date', $item->created, $dateFormat); ?>
						</span>
					<?php endif; ?>
					<?php if($params->get('itemTitle')): ?>
						<h3><a class="moduleItemTitle" href="<?php echo $item->link; ?>"><?php echo $item->title; ?></a></h3>
					<?php endif; ?>

					<?php if ($params->get('itemIntroText')): ?>
						<div class="moduleItemIntrotext">
							<?php
								// limitando os caracteres do introtext sem tags, de acordo com o limite do módulo
								$introtxt = substr(strip_tags($item->introtext), 0, $params->get('itemIntroTextLimit'));
								// controle para nao cortar a palavra no meio
								//$introtxt = substr($introtxt, 0, strrpos($introtxt, " ", -1));
								echo $introtxt;
							?>
						</div>
					<?php endif; ?>
				</div>
			</div>
			<div class="clearfix"></div>
		</div>
	<?php endforeach; ?>
	</div>
		<!-- Indicadores -->
		<!-- <div class="navegar-item">
			<ol class="carousel-indicators">
				<?php foreach ($items as $key=>$item):	?>
					<li class="navitem <?php if ($key == '0') echo 'active'; ?>" data-slide-to="<?php echo $key ;?>" data-target="#carousel-<?php echo $module->id;?>"></li>
				<?php endforeach; ?>
			</ol>
		</div> -->

		<!-- Controles -->
		<div class="controles-item">
			<a class="left carousel-control" href="#carousel-<?php echo $module->id;?>" role="button" data-slide="prev">
				<span class="glyphicon glyphicon-chevron-left" aria-hidden="true">
					<i class="fa fa-angle-left"></i>
				</span>
				<span class="sr-only">Anterior</span>
			</a>
			<a class="right carousel-control" href="#carousel-<?php echo $module->id;?>" role="button" data-slide="next">
				<span class="glyphicon glyphicon-chevron-right" aria-hidden="true">
					<i class="fa fa-angle-right"></i>
				</span>
				<span class="sr-only">Próximo</span>
			</a>
		</div>
</div>