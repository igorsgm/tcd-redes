<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_content
 *
 * @copyright   Copyright (C) 2005 - 2014 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JHtml::addIncludePath(JPATH_COMPONENT . '/helpers');

// Create shortcuts to some parameters.
$params          = $this->item->params;
$tpl_params      = JFactory::getApplication()->getTemplate(true)->params;

$images          = json_decode($this->item->images);
$credits = $params->get('credits')? $params->get('credits'):'';
if(!empty($images->image_fulltext)) {
	$img_to_render = 'fulltext';
	$img_not_to_render = 'intro';
} else {
	$img_to_render = 'intro';
	$img_not_to_render = 'fulltext';
}

// $audioPath = JPATH_SITE. '/images/audio/'.$params['audio'];

list($img_width) = getimagesize($images->{'image_' . $img_to_render});
$credit          = $images->{'image_' . $img_to_render . '_credit'};
$credit          = empty($credit) ? $images->{'image_' . $img_not_to_render . '_credit'} : $credit;
$caption         = $images->{'image_' . $img_to_render . '_caption'};
$caption         = empty($caption) ? $images->{'image_' . $img_not_to_render . '_caption'} : $caption;
$alt             = $images->{'image_' . $img_to_render . '_alt'};
$alt             = empty($alt) ? $images->{'image_' . $img_not_to_render . '_alt'} : $alt;

$urls            = json_decode($this->item->urls);
$canEdit         = $params->get('access-edit');
$user            = JFactory::getUser();
$info            = $params->get('info_block_position', 0);
$useDefList      = ($params->get('show_modify_date') || $params->get('show_publish_date') || $params->get('show_create_date')
					|| $params->get('show_hits') || $params->get('show_category') || $params->get('show_parent_category') || $params->get('show_author'));

$post_format     = $params->get('post_format', 'standard');

$has_post_format = $tpl_params->get('show_post_format');

if ($this->print) {
	$has_post_format = false;
}
?>

<article class="item item-page<?php echo $this->pageclass_sfx . ($this->item->featured) ? ' item-featured' : ''; ?>"
         itemscope itemtype="http://schema.org/Article">
	<meta itemprop="inLanguage"
	      content="<?php echo ($this->item->language === '*') ? JFactory::getConfig()->get('language') : $this->item->language; ?>"/>
	<?php if ($this->params->get('show_page_heading', 1)) : ?>
		<div class="page-header">
			<h1> <?php echo $this->escape($this->params->get('page_heading')); ?> </h1>
		</div>
	<?php endif;

	if (!empty($this->item->pagination) && $this->item->pagination && !$this->item->paginationposition && $this->item->paginationrelative) {
		echo $this->item->pagination;
	}
	?>
	
	<div class="entry-header<?php echo $has_post_format ? ' has-post-format' : ''; ?>">
		<?php echo JLayoutHelper::render('joomla.content.post_formats.icons', $post_format); ?>

		<?php if (!$this->print && $useDefList && ($info == 0 || $info == 2)) : ?>
			<?php echo JLayoutHelper::render('joomla.content.info_block.block',
				array('item' => $this->item, 'params' => $params, 'position' => 'above')); ?>
		<?php endif; ?>

		<?php if ($params->get('show_title') || $params->get('show_author')) : ?>
			<h4 itemprop="name">
				<?php if ($params->get('show_title')) : ?>
					<?php echo $this->escape($this->item->title); ?>
				<?php endif; ?>
			</h4>
			<?php if ($this->item->state == 0) : ?>
				<span class="label label-warning"><?php echo JText::_('JUNPUBLISHED'); ?></span>
			<?php endif; ?>
			<?php if (strtotime($this->item->publish_up) > strtotime(JFactory::getDate())) : ?>
				<span class="label label-warning"><?php echo JText::_('JNOTPUBLISHEDYET'); ?></span>
			<?php endif; ?>
			<?php if ((strtotime($this->item->publish_down) < strtotime(JFactory::getDate())) && $this->item->publish_down != '0000-00-00 00:00:00') : ?>
				<span class="label label-warning"><?php echo JText::_('JEXPIRED'); ?></span>
			<?php endif; ?>
		<?php endif; ?>
		
	</div>

	<?php if ($post_format == 'standard'):
		if (!empty($images->{'image_' . $img_to_render})): ?>
			<div class="entry-image full-image">
				<?php if (!empty($caption) || !empty($credit)): ?>
					<div class="img_caption none" style="float: <?php echo empty($img_to_render) ? 'none' : 'float_' . $img_to_render; ?>; width: <?php echo $img_width; ?>px;">
						<?php if (!empty($credit)): ?>
							<span class="itemImageCredits"><?php echo $credit ?></span>
						<?php endif; ?>

						<img class="caption" title="<?php echo $caption ?>"
						     src="<?php echo $images->{'image_' . $img_to_render}; ?>" alt="<?php echo $alt; ?>"
						     itemprop="image">
						<?php if (!empty($caption)): ?>
							<p class="img_caption"><?php echo $caption; ?></p>
						<?php endif; ?>
					</div>
				<?php else: ?>
					<img src="<?php echo $images->{'image_' . $img_to_render}; ?>" alt="<?php echo $alt; ?>">
				<?php endif; ?>
			</div>
		<?php endif;?>
	<?php else: ?>
		<?php if (!empty($credits)): ?>
			<?php if ($post_format != 'audio') : ?>
				<div class="img_caption none" style="width: 723px;">
					<span class="creditsGallery"><?php echo $credits; ?></span>		
				</div>
			<?php endif; ?>
		<?php endif; ?>
		<?php if ($post_format != 'audio') : ?>	
			<div class="caption">
					<?php echo JLayoutHelper::render('joomla.content.post_formats.post_' . $post_format,
					array('params' => $params, 'item' => $this->item));?>
			</div>
		<?php endif;?>			

	<?php endif;?>
	
	<?php if (!$this->print) : ?>
		<?php echo JLayoutHelper::render('joomla.content.social_share.share', $this->item); //Helix Social Share ?>
		<?php echo JLayoutHelper::render('joomla.content.comments.comments', $this->item); //Helix Comment ?>
	<?php endif; ?>
	<?php if (!$this->print) : ?>
		<?php if ($canEdit || $params->get('show_print_icon') || $params->get('show_email_icon')) : ?>
			<?php echo JLayoutHelper::render('joomla.content.icons',
				array('params' => $params, 'item' => $this->item, 'print' => false)); ?>
		<?php endif; ?>
	<?php else : ?>
		<?php if ($useDefList) : ?>
			<div id="pop-print" class="btn hidden-print">
				<?php echo JHtml::_('icon.print_screen', $this->item, $params); ?>
			</div>
		<?php endif; ?>
	<?php endif; ?>
	
	<?php if (!$params->get('show_intro')) : echo $this->item->event->afterDisplayTitle; endif; ?>
	<?php echo $this->item->event->beforeDisplayContent; ?>

	<?php if (isset($urls) && ((!empty($urls->urls_position) && ($urls->urls_position == '0')) || ($params->get('urls_position') == '0' && empty($urls->urls_position)))
		|| (empty($urls->urls_position) && (!$params->get('urls_position')))
	) : ?>
		<?php echo $this->loadTemplate('links'); ?>
	<?php endif; ?>
	<?php if ($params->get('access-view')): ?>

		<?php //echo JLayoutHelper::render('joomla.content.full_image', $this->item); ?>

		<?php
		if (!empty($this->item->pagination) && $this->item->pagination && !$this->item->paginationposition && !$this->item->paginationrelative):
			echo $this->item->pagination;
		endif;
		?>
		<?php if (isset ($this->item->toc)) :
			echo $this->item->toc;
		endif; ?>
		<div itemprop="articleBody">
			<?php echo $this->item->text; ?>
		</div>
		

		<?php if (!$this->print && $useDefList && ($info == 1 || $info == 2)) : ?>
			<?php echo JLayoutHelper::render('joomla.content.info_block.block',
				array('item' => $this->item, 'params' => $params, 'position' => 'below')); ?>
		<?php endif; ?>
	
		<?php if ($post_format == 'audio') : ?>
			<div class="img_caption none" style="width: 723px;">
				<?php if (!empty($credits)): ?>
					<?php if ($post_format == 'audio') : ?>
						<span class="creditsAudio"><?php echo $credits; ?></span>		
					<?php endif; ?>
				<?php endif; ?>
			</div>
			<div class="caption">
				<audio controls>
				 	<source src="<?php echo JUri::root() .'images/audios/' .$params['audio'];?>">
				</audio>
			</div>
		<?php endif;?>			

		<?php if ($info == 0 && $params->get('show_tags', 1) && !empty($this->item->tags->itemTags)) : ?>
			<?php $this->item->tagLayout = new JLayoutFile('joomla.content.tags'); ?>
			<?php echo $this->item->tagLayout->render($this->item->tags->itemTags); ?>
		<?php endif; ?>

		<?php
		if (!empty($this->item->pagination) && $this->item->pagination && $this->item->paginationposition && !$this->item->paginationrelative):
			echo $this->item->pagination;
			?>
		<?php endif; ?>
		<?php if (isset($urls) && ((!empty($urls->urls_position) && ($urls->urls_position == '1')) || ($params->get('urls_position') == '1'))) : ?>
			<?php echo $this->loadTemplate('links'); ?>
		<?php endif; ?>
		<?php // Optional teaser intro text for guests ?>
	<?php elseif ($params->get('show_noauth') == true && $user->get('guest')) : ?>
		<?php echo $this->item->introtext; ?>
		<?php //Optional link to let them register to see the whole article. ?>
		<?php if ($params->get('show_readmore') && $this->item->fulltext != null) :
			$link1 = JRoute::_('index.php?option=com_users&view=login');
			$link = new JUri($link1); ?>
			<p class="readmore">
				<a href="<?php echo $link; ?>">
					<?php
					if ($readmore = $this->item->alternative_readmore) :
						echo $readmore;
						if ($params->get('show_readmore_title', 0) != 0) :
							echo JHtml::_('string.truncate', ($this->item->title), $params->get('readmore_limit'));
						endif;
					elseif ($params->get('show_readmore_title', 0) == 0) :
						echo JText::sprintf('COM_CONTENT_READ_MORE_TITLE');
					else :
						echo JText::_('COM_CONTENT_READ_MORE');
						echo JHtml::_('string.truncate', ($this->item->title), $params->get('readmore_limit'));
					endif; ?>
				</a>
			</p>
		<?php endif; ?>
	<?php endif; ?>

	<?php
	if (!empty($this->item->pagination) && $this->item->pagination && $this->item->paginationposition && $this->item->paginationrelative) :
		echo $this->item->pagination;
		?>
	<?php endif; ?>

	<?php echo $this->item->event->afterDisplayContent; ?>

</article>
