<?php
/**
 * @package     Joomla.Site
 * @subpackage  Layout
 *
 * @copyright   Copyright (C) 2005 - 2014 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('JPATH_BASE') or die;

if($displayData['params']->get('gallery')) {
	$images = json_decode( $displayData['params']->get('gallery') );

	if( count( $images->gallery_images ) ) {
		?>

		<div id="carousel-gallery-<?php echo $displayData['item']->id; ?>" class="entry-gallery carousel slide article-slide" data-ride="carousel">
			<div class="carousel-inner cont-slider" role="listbox">
				<?php
					foreach ( $images->gallery_images as $key => $image ) {
						?>
							<div class="item<?php echo ($key===0) ? ' active': ''; ?>">
								<img src="<?php echo $image; ?>" alt="">
							</div>
						<?php
					}
				?>
			</div>
			<!-- Indicators -->
			<ol class="carousel-indicators">
			<?php
							foreach ( $images->gallery_images as $key => $image ) {
								?>
			<li class="<?php echo ($key===0) ? ' active': ''; ?>" data-slide-to="<?php echo $key;?>" data-target="#carousel-gallery-<?php echo $displayData['item']->id; ?>">
			   <img width="250" alt="" src="<?php echo $image; ?>">
			</li>
			<?php
							}
						?>
			</ol>


			<a class="carousel-left" href="#carousel-gallery-<?php echo $displayData['item']->id; ?>" role="button" data-slide="prev">
				<span class="fa fa-angle-left" aria-hidden="true"></span>
				<span class="sr-only">Previous</span>
			</a>
			<a class="carousel-right" href="#carousel-gallery-<?php echo $displayData['item']->id; ?>" role="button" data-slide="next">
				<span class="fa fa-angle-right" aria-hidden="true"></span>
				<span class="sr-only">Next</span>
			</a>
		</div>
		<?php
	}

}
