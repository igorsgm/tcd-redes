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
<?php foreach ($items as $key=>$item):
	// transformando o json das imagens em array
	$images  = json_decode($item->images);?>
	<div class="item <?php echo ($key%2) ? "odd" : "even"; if(count($items)==$key+1) echo ' lastItem'; ?>">

		<?php if($params->get('itemTitle')): ?>
			<h4><a class="moduleItemTitle" href="<?php echo $item->link; ?>"><?php echo $item->title; ?></a></h4>
		<?php endif; ?>
		<div class="row-fluid">
			<?php if($params->get('itemImage') && (isset($images->image_intro) || isset($images->image_fulltext))): ?>
				<div class="imagem <?php echo 'span'.$params->get('itemImageSpan');?>">
					<div class="img-item thumbnail">
						<a class="moduleItemImage thumbnail-inner" href="<?php echo $item->link; ?>" title="<?php echo $item->title; ?>">
							<img src="
							<?php // Se tiver imagem de exibição exibe, senão exibe a do artigo
								$image = ($images->image_intro ? $images->image_intro : $images->image_fulltext);
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

				<?php if ($params->get('itemIntroText')): ?>
					<div class="moduleItemIntrotext">
						<?php
							// limitando os caracteres do introtext sem tags, de acordo com o limite do módulo
							$introtxt = substr(strip_tags($item->introtext), 0, $params->get('itemIntroTextLimit'));
							// controle para nao cortar a palavra no meio
							$introtxt = substr($introtxt, 0, strrpos($introtxt, " ", -1));
							echo $introtxt;
						?>
					</div>
				<?php endif; ?>
			</div>
		</div>
		<div class="clearfix"></div>
	</div>
<?php endforeach; ?>
