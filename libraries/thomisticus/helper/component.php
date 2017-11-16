<?php
/**
 * @package     Thomisticus.Library
 * @subpackage  Helper
 *
 * @copyright   Copyright (C) 2017-2021 Igor Moraes. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('_JEXEC') or die;

/**
 * Asset helper
 *
 * @package     Thomisticus.Library
 * @subpackage  Helper
 * @since       1.0
 */
abstract class ThomisticusHelperComponent
{
	/**
	 * Gets the item's edit permission for an user in a specific component.
	 *
	 * (Method overrided from Component Creator and generalized)
	 *
	 * @param  mixed $item          The item
	 * @param string $componentName The component name (will be picked up automatically from application if not provided)
	 *
	 * @return bool
	 */
	public static function canUserEdit($item, $componentName = '')
	{
		$user = JFactory::getUser();

		if (empty($componentName)) {
			$componentName = JFactory::getApplication()->input->get('option');
		}

		if ($user->authorise('core.edit', $componentName) ||
			isset($item->created_by) && $item->created_by == $user->id && $user->authorise('core.edit.own', $componentName)
		) {
			return true;
		}

		return false;
	}

	/**
	 * Get an instance of the named model
	 *
	 * @param string $modelSufix    Model sufix name. Eg: 'Article'
	 * @param string $componentName The component name which model belongs to. Eg: 'com_content'
	 *                              - Automatically searched if it's not provided
	 * @param string $client        The client ('administrator' or 'site')
	 *                              - Automatically searched if it's not provided
	 *
	 * @return bool|JModelLegacy|null
	 */
	public static function getModel($modelSufix, $componentName = '', $client = '')
	{

		if (empty($componentName)) {
			$componentName = self::getComponentName();
		}

		$mainPath = self::getMainPath($client);

		$model = null;

		// If the file exists, let's require it
		if (file_exists($mainPath . '/components/' . $componentName . '/models/' . strtolower($modelSufix) . '.php')) {
			require_once $mainPath . '/components/' . $componentName . '/models/' . strtolower($modelSufix) . '.php';

			$prefix = ucfirst(substr($componentName, strpos($componentName, "_") + 1)) . 'Model';
			$model  = JModelLegacy::getInstance($modelSufix, $prefix);
		}

		return $model;
	}

	/**
	 * Get current component name
	 *
	 * @param string $componentName
	 *
	 * @return mixed|string
	 */
	private static function getComponentName()
	{
		return JFactory::getApplication()->input->get('option');
	}

	/**
	 * Get main path of folder accordingly to where application is being executed (administrator or site)
	 *
	 * @param string|null $client 'administrator' or 'site'
	 *
	 * @return string
	 */
	private static function getMainPath($client = '')
	{
		if (empty($client)) {
			$mainPath = JFactory::getApplication()->isClient('site') ? JPATH_SITE : JPATH_ADMINISTRATOR;
		} else {
			$mainPath = $client == 'administrator' ? JPATH_ADMINISTRATOR : JPATH_SITE;
		}

		return $mainPath;
	}
}
