<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_articles_latest
 *
 * @copyright   Copyright (C) 2005 - 2016 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
$doc = JFactory::getDocument();
// Importing JS files
$doc->addStyleDeclaration(".modal-content { width: 110%; }");

?>
<ul class="latestnews<?php echo $moduleclass_sfx; ?>">
	<?php foreach ($list as $item): ?>
		<?php $results = str_replace('{emailsubject}', $item->subject, $item->body);?>
		<div class="item">
			<h4><a class="moduleItemTitle" data-toggle="modal" data-target="#modal-<?php echo $item->mailid; ?>" href="#"><?php echo $item->subject; ?></a></h4>
		</div>
		<!-- Modal -->
		<div class="modal fade" id="modal-<?php echo $item->mailid; ?>" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-body">
						<?php echo $results; ?>
					</div>
				</div>
			</div>
		</div>
	<?php endforeach; ?>
</ul>
