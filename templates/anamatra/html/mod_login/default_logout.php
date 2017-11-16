<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_login
 *
 * @copyright   Copyright (C) 2005 - 2015 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JHtml::_('behavior.keepalive');
?>
<form action="<?php echo JRoute::_(JUri::getInstance()->toString(), true, $params->get('usesecure')); ?>" method="post" id="login-form">
<?php if ($params->get('greeting')) : ?>
	<div class="login-greeting">
	<?php if ($params->get('name') == 0) : {
		echo JText::sprintf('MOD_LOGIN_HINAME', htmlspecialchars($user->get('name')));
	} else : {
		echo JText::sprintf('MOD_LOGIN_HINAME', htmlspecialchars($user->get('username')));
	} endif; ?>
	<div class="btn-group">
		  <button type="button" class="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
		    <small>Espaço do Associado</small> <span class="caret"></span>
		  </button>
		  <ul class="dropdown-menu">
	  	    <li>
	    		<?php if((in_array('42', $user->groups) || in_array('53', $user->groups))):?>
		    		<a href="<?php echo JRoute::_('index.php?option=com_associados&view=associados'); ?>">
					<i class="fa fa-list"></i> Lista de Associados
				</a>
			<?php endif; ?>
		    </li>
		    <li>
		    	<a href="<?php echo JRoute::_('index.php?option=com_associados&view=associadoform'); ?>">
					<i class="fa fa-refresh"></i> Atualize seu cadastro
				</a>
		    </li>
		    <li>
		    	<a href="<?php echo JRoute::_('index.php?option=com_users&view=profile&layout=edit'); ?>">
		    		<i class="fa fa-unlock-alt"></i> Mudar minha senha
		    	</a>
		    </li>
		    <li><a href="<?php echo JRoute::_('index.php?option=com_suporte&view=chamadoform'); ?>">
					<i class="fa fa-support"></i> Suporte</a></li>
		  </ul>
		</div>
	</div>
<?php endif; ?>
	<div class="logout-button">
		<button type="submit" name="Submit" class="btn btn-link" title="<?php echo JText::_('JLOGOUT'); ?>">
			<i class="fa fa-sign-out"></i>
		</button>
		<input type="hidden" name="option" value="com_users" />
		<input type="hidden" name="task" value="user.logout" />
		<input type="hidden" name="return" value="<?php echo $return; ?>" />
		<?php echo JHtml::_('form.token'); ?>
	</div>
</form>
