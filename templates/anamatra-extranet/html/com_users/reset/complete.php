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
?>

<div class="page-header">
	<h1>
		Criar nova senha
	</h1>
</div>

<div class="row">
	<div class="col-sm-offset-2 col-sm-8">
		<div class="reset-complete<?php echo $this->pageclass_sfx ?>">

			<form action="<?php echo JRoute::_('index.php?option=com_users&task=reset.complete'); ?>" method="post"
			      class="form-validate well">

				<div class="alert alert-notice">
					<div>
						<p><?php echo JText::_('COM_USERS_CUSTOMRESET_COMPLETE_LABEL'); ?></p>
					</div>
				</div>

				<div class="form-group col-sm-6">
					<label id="jform_password1-lbl" for="jform_password1" class="hasPopover required" title="">
						<?php echo JText::_('COM_USERS_FIELD_RESET_PASSWORD1_LABEL'); ?>
						<span class="star">&nbsp;*</span>
					</label>
					<div class="group-control">
						<input type="password" name="jform[password1]" id="jform_password1" value="" autocomplete="off"
						       class="validate-password required" size="30" maxlength="99" required="required"
						       aria-required="true">
					</div>
				</div>

				<div class="form-group col-sm-6">
					<label id="jform_password2-lbl" for="jform_password2" class="hasPopover required" title="">
						<?php echo JText::_('COM_USERS_FIELD_RESET_PASSWORD2_LABEL'); ?>
						<span class="star">&nbsp;*</span>
					</label>
					<div class="group-control">
						<input type="password" name="jform[password2]" id="jform_password2" value="" autocomplete="off"
						       class="validate-password required" size="30" maxlength="99" required="required"
						       aria-required="true">
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
