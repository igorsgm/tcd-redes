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

<style>
       
/***
 * Bootstrap relies on CSS transitions for animation, which makes it
 * easy to override.  Just add the vertical class to your carousel:
 * <div class='carousel vertical'>...</div>
 ***/

.carousel.vertical .carousel-inner {
  height: 100%;
}
.carousel.vertical .item {
  -webkit-transition: 0.6s ease-in-out top;
  -moz-transition:    0.6s ease-in-out top;
  -ms-transition:     0.6s ease-in-out top;
  -o-transition:      0.6s ease-in-out top;
  left:               0;
}
.carousel.vertical .active,
.carousel.vertical .next.left,
.carousel.vertical .prev.right    { top:     0; }
.carousel.vertical .next,
.carousel.vertical .active.right  { top:  100%; }
.carousel.vertical .prev,
.carousel.vertical .active.left   { top: -100%; }        
</style>
<div id="carousel-<?php echo $module->id;?>" class="vertical-slider carousel slide vertical" data-interval="5000" data-ride="carousel">
	<a class="right carousel-control" href="#carousel-<?php echo $module->id;?>" role="button" data-slide="next">
		<span class="glyphicon glyphicon-chevron-right" aria-hidden="true">
			<i class="fa fa-angle-up"></i>
		</span>
		<span class="sr-only">Próximo</span>
	</a>
	
	<div class="carousel-inner" role="listbox">
	<?php foreach ($items as $key=>$item):
		// transformando o json das imagens em array
		$images  = json_decode($item->images);?>
		<div class="item <?php if ($key == '0') echo 'active'; ?> <?php echo ($key%2) ? "odd" : "even"; if(count($items)==$key+1) echo ' lastItem'; ?>">
			<div class="row-fluid">
				<?php if($params->get('itemImage') && (isset($images->image_intro) || isset($images->image_fulltext))): ?>
					<div class="imagem">
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
		<a class="left carousel-control" href="#carousel-<?php echo $module->id;?>" role="button" data-slide="prev">
			<span class="glyphicon glyphicon-chevron-left" aria-hidden="true">
				<i class="fa fa-angle-down"></i>
			</span>
			<span class="sr-only">Anterior</span>
		</a>
			
</div>