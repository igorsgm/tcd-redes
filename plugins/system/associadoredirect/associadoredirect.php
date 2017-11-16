<?php
/**
 * @package     Redirect after Profile Edit
 *
 * @copyright   Copyright (C) 2015 Charlie Lodder, Inc. All rights reserved.
 * @license     GNU General Public License version 3 or later
 */

defined('_JEXEC') or die;

use Joomla\Registry\Registry;

class PlgSystemAssociadoredirect extends JPlugin
{
	protected $autoloadLanguage = false;


	public function __construct(&$subject, $config)
	{
		parent::__construct($subject, $config);
	}

	public function onUserAfterLogin($params)
	{
		// True or false para variável que será utilizada pelo AssociadosFrontendHelper (método verifyFirstAccess)
		JFactory::getSession()->set('isAssociadoFirstLogin', (strtotime($params['user']->lastvisitDate) < 0));
	}

	/**
	 * Se o usuário deletado pelo sistema for um associado, irá limpar o campo user_id do Associado
	 * @param JUser $user
	 */
	public function onUserAfterDelete($user, $succes, $msg)
	{
		$pluginParams = new Registry(JPluginHelper::getPlugin('system', 'associadoredirect')->params);

		if ($succes && in_array($pluginParams->get('usergroup'), $user['groups'])) {

			$db = JFactory::getDbo();
			$query = $db->getQuery(true);
			$query->update($db->quoteName('#__associados'))
				->set($db->quoteName('user_id') . ' = ""')
				->where($db->quoteName('user_id') . ' = ' . $user['id']);

			$db->setQuery($query)->execute();
		}
	}

	public function onUserAfterSave($user, $isNew, $success, $msg)
	{
		$app = JFactory::getApplication();
		$input = $app->input;

		$validTasks = array('save', 'login');

		// Verificar se está no front-end e se está editando um usuário existente
		if ($app->isSite() && $isNew == false &&  in_array($input->get('task'), $validTasks)) {

			// Se está na página de edição do cadastro do associado
			if ($input->get('option') == 'com_users') {
				// Obter o valor do parâmetro de redirecionamento
				$params = new Registry(JPluginHelper::getPlugin('system', 'associadoredirect')->params);
				$redirect = $params->get('url', 'index.php');

				// Pegar URI do Menu ID
				$menu = $app->getMenu();
				$item = $menu->getItem($redirect);

				// Redirect para página edição do Associado
				$app->redirect(JRoute::_($item->link));
			}
		}
	}
}
