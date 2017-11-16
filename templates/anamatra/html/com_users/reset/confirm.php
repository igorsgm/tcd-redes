<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_users
 *
 * @copyright   Copyright (C) 2005 - 2015 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JHtml::_('behavior.keepalive');
JHtml::_('behavior.formvalidation');

$app = JFactory::getApplication();
$email = $app->getUserState('com_users.reset.email');
?>
<div class="row">
	<div class="col-sm-offset-2 col-sm-8 well">
		<div class="reset-confirm<?php echo $this->pageclass_sfx ?>">

			<?php if ($this->params->get('show_page_heading')) : ?>
				<h1>
					<?php echo $this->escape($this->params->get('page_heading')); ?>
				</h1>
			<?php endif; ?>

			<div class="alert alert-notice">
				<h4 class="alert-heading">
					<?php echo JText::sprintf('COM_USERS_CUSTOMRESET_MENSAGEM_CONFIRMACAO_1', $email); ?>
				</h4>
				<div>
					<p><?php echo JText::_('COM_USERS_CUSTOMRESET_MENSAGEM_CONFIRMACAO_2'); ?></p>
				</div>
			</div>
			<div class="alert alert-warning">
				<div>
					<p><?php echo JText::_('COM_USERS_CUSTOMRESET_MENSAGEM_ALTERAR_EMAIL'); ?></p>
					<a class="btn btn-warning" href="http://anamatra.org.br/suporte">
						<?php echo JText::_('COM_USERS_CUSTOMRESET_MENSAGEM_SUPORTE_BTN'); ?>
					</a>
				</div>
			</div>

			<form action="<?php echo JRoute::_('index.php?option=com_users&task=customreset.confirm'); ?>" method="post"
			      class="form-validate">

				<div class="row">
					<div class="form-group col-sm-6">
						<label id="jform_username-lbl" for="jform_username" class="hasPopover required" title=""
						       data-original-title="<?php echo JText::_('COM_USERS_FIELD_RESET_CONFIRM_USERNAME_LABEL'); ?>">
							<?php echo JText::_('COM_USERS_FIELD_RESET_CONFIRM_USERNAME_LABEL'); ?>
							<span class="star">&nbsp;*</span>
						</label>
						<div class="group-control">
							<input type="text" name="jform[username]" id="jform_username" value="" class="required"
							       size="30" required="required" aria-required="true">
						</div>
					</div>

					<div class="form-group col-sm-6">
						<label id="jform_token-lbl" for="jform_token" class="hasPopover required" title=""
						       data-original-title="<?php echo JText::_('COM_USERS_FIELD_RESET_CONFIRM_TOKEN_LABEL'); ?>">
							<?php echo JText::_('COM_USERS_FIELD_RESET_CONFIRM_TOKEN_LABEL'); ?>
							<span class="star">&nbsp;*</span>
						</label>
						<div class="group-control">
							<input type="text" name="jform[token]" id="jform_token" value="" class="required" size="32"
							       required="required" aria-required="true">
						</div>
					</div>
				</div>


				<div class="form-group text-right">
					<button type="submit" class="btn btn-primary btn-lg validate">
						<?php echo JText::_('JSUBMIT'); ?>
					</button>
				</div>
				<?php echo JHtml::_('form.token'); ?>
			</form>

		</div>
	</div>
</div>
