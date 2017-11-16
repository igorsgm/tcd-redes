<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_articles_latest
 *
 * @copyright   Copyright (C) 2005 - 2016 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

//Adicionando a library jquery cookie
JFactory::getDocument()->addScript(JUri::base() . '/modules/mod_articles_latest_plus/assets/jquery.cookie.min.js');

?>
<?php
	//Exibir modal apenas se não existir um cookie no browser para aquele artigo
	if (isset($items[0]->id) && !isset($_COOKIE["hideModal_articleId_" . $items[0]->id])):
		foreach ($items as $key=>$item):
			?>
			<div class="modal modal-comunicados" id="modal--<?php echo $module->id;?>" role="dialog" tabindex="-1">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-label="Fechar" aria-hidden="true">&times;</button>
							<h4 class="modal-title"><?php echo $item->title; ?></h4>
						</div>
						<div class="modal-body">
							<?php echo $item->introtext; ?>
							<div class="text-right">
								<button id="modal-dont-show" type="button" class="btn btn-primary" data-dismiss="modal" aria-label="Fechar" aria-hidden="true">
								Não mostrar mais</button>
							</div>
						</div>
					</div>
				</div>
			</div>
	<?php endforeach;
endif; ?>

<script type="text/javascript">
	js = jQuery.noConflict();
	js(document).ready(function() {
		js('#modal--<?php echo $module->id;?>').modal('show');
		js('#modal-dont-show').on('click', function () {
			var cookieName = 'hideModal_articleId_' + <?php echo $items[0]->id; ?>;
			jQuery.cookie(cookieName, 'yes');
		});
	});
</script>
