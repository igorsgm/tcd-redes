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
		Recuperação de senha
	</h1>
</div>
<div class="row">
	<div class="col-sm-offset-2 col-sm-8">
		<div class="reset<?php echo $this->pageclass_sfx ?>">


			<form id="user-registration" class="form-validate well" method="post"
			      action="<?php echo JRoute::_('index.php?option=com_users&task=customreset.request'); ?>">

				<legend>
					<small><?php echo JText::_('COM_USERS_CUSTOMRESET_REQUEST_LABEL'); ?></small>
				</legend>

				<div class="row">
					<div class="col-sm-6">
						<div class="alert alert-notice">
							<p><?php echo JText::_('COM_USERS_CUSTOMRESET_INFORME_EMAIL'); ?></p>
						</div>
					</div>
					<div class="col-sm-6">
						<div class="form-group">
							<label id="jform_email-lbl" for="jform_email"
							       data-original-title="<?php echo JText::_('COM_USERS_FIELD_REMIND_EMAIL_LABEL'); ?>">
								<?php echo JText::_('COM_USERS_FIELD_REMIND_EMAIL_LABEL'); ?>
							</label>
							<div class="group-control">
								<input type="text" name="jform[email]" id="jform_email" value=""
								       class="validate-username"
								       size="30">
							</div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-sm-6">
						<div class="alert alert-notice">
							<p><?php echo JText::_('COM_USERS_CUSTOMRESET_INFORME_CPF'); ?></p>
						</div>
					</div>
					<div class="col-sm-6">
						<div class="form-group">
							<label id="jform_cpf-lbl" for="jform_cpf" class="hasPopover"
							       data-original-title="<?php echo JText::_('COM_USERS_FIELD_RESET_CONFIRM_USERNAME_LABEL'); ?>">
								<?php echo JText::_('COM_USERS_FIELD_RESET_CONFIRM_USERNAME_LABEL'); ?>
							</label>
							<div class="group-control">
								<input type="text" name="jform[cpf]" id="jform_cpf" value="" class="validate-username"
								       size="15" aria-invalid="false">
							</div>
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