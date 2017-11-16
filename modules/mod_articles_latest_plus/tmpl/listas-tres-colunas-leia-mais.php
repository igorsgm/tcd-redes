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
<div class="row list-3-col">
<?php foreach ($items as $key=>$item):
	// transformando o json das imagens em array
	$images  = json_decode($item->images);
	$urls  = json_decode($item->urls);
?>
	<div class="item <?php echo $item->alias; ?> <?php echo ($key%2) ? "odd" : "even"; if(count($items)==$key+1) echo ' lastItem';?> col-sm-4">
		<div class="item-content">
		<?php $txtSize = $params->get('itemContentSpan');?>
		<div class="item-content-inner">
		<?php if($params->get('itemDateCreated')): ?>
				<time time="<?php echo JHTML::_('date', $item->created, 'd/m/y'); ?>" class="moduleItemDateCreated">
					<i class="fa fa-clock-o"></i> <?php   //Se tiver data customizada exibe, senão exibe a padrão
							$dateFormat = ($params->get('itemCustomDateFormat') ? $params->get('itemCustomDateFormat') : $params->get('itemDateFormat'));
							echo JHTML::_('date', $item->created, $dateFormat); ?>
				</time>
			<?php endif; ?>
		<?php if($params->get('itemImage') && (isset($images->image_intro) || isset($images->image_fulltext))): ?>
			<?php if(!empty($images->image_intro) || !empty($images->image_fulltext)): ?>
			<a class="moduleItemImage" style="background-image: url(<?php // Se tiver imagem de exibição exibe, senão exibe a do artigo
					$image = ($images->image_fulltext ? $images->image_fulltext : $images->image_intro);
					echo $image; ?>);" href="<?php echo $item->link; ?>" title="<?php echo $item->title; ?>">
			</a>
			<?php endif; ?>
		<?php endif; ?>


			<div class="texto">
				<?php if ($params->get('itemTitle')): ?>
					<h4><a class="moduleItemTitle" href="<?php echo !empty($urls->urla) ? $urls->urla : $item->link; ?>"><?php echo $item->title; ?></a></h4>
				<?php endif; ?>
				<?php if ($params->get('itemIntroText')): ?>
					<div class="moduleItemIntrotext">
						<?php
						$limit = $params->get('itemIntroTextLimit');
							// limitando os caracteres do introtext sem tags, de acordo com o limite do módulo (se for o terceiro item, diminui o número de caracteres)
								$introtxt = ($key == 3) ? substr(strip_tags($item->introtext), 0, $params->get('itemIntroTextLimit') - 25) : substr(strip_tags($item->introtext), 0, $params->get('itemIntroTextLimit'));
							// controle para nao cortar a palavra no meio
							$introtxt = substr($introtxt, 0, strrpos($introtxt, " ", -1));
							echo $introtxt;
							 if(strlen($item->introtext) > $limit) {
							 	echo "...";
							 }
						?>
					</div>
				<?php endif; ?>
			</div>
			<?php if(!empty($urls->urla)): ?>
					<div class="btn-group moduleItemReadMore">

						<a class="<?php echo JText::_('MOD_LATEST_NEWS_PLUS_ITEM_READMORE_BUTTON_CLASS'); ?>" href="<?php echo $urls->urla; ?>">
							<?php
							$readmoreLabel = $params->get('itemReadmoreLabel');
							if (!empty($urls->urlatext)) {
								$readmoreLabel = $urls->urlatext;
							}
							elseif (empty($readmoreLabel) && empty($item->alternative_readmore)) {
								$readmoreLabel = JText::_('MOD_LATEST_NEWS_PLUS_ITEM_READMORE_LABEL');
							}
							echo $readmoreLabel;
							?>
							<i class="fa fa-angle-right"></i>
						</a>
					</div>
			<?php elseif(($params->get('itemReadmore') == '1' )): ?>
				<div class="btn-group moduleItemReadMore">

					<a class="<?php echo JText::_('MOD_LATEST_NEWS_PLUS_ITEM_READMORE_BUTTON_CLASS'); ?>" href="<?php echo $item->link; ?>">
						<?php
						$readmoreLabel = $params->get('itemReadmoreLabel');
						if (!empty($item->alternative_readmore)) {
							$readmoreLabel = $item->alternative_readmore;
						}
						elseif (empty($readmoreLabel) && empty($item->alternative_readmore)) {
							$readmoreLabel = JText::_('MOD_LATEST_NEWS_PLUS_ITEM_READMORE_LABEL');
						}
						echo $readmoreLabel;
						?>
						<i class="fa fa-angle-right"></i>
					</a>
				</div>
			<?php endif; ?>
			<div class="clearfix"></div>
		</div>
		</div>
	</div>
<?php endforeach; ?>
</div>

