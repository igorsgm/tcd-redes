<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_articles_latest
 *
 * @copyright   Copyright (C) 2005 - 2016 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Helper for mod_boletins
 *
 * @since  1.6
 */
abstract class ModBoletinsLatestHelper
{
	/**
	 * Retrieve a list of article
	 *
	 * @param   \Joomla\Registry\Registry  &$params  module parameters
	 *
	 * @return  mixed
	 *
	 * @since   1.6
	 */ 
	public static function getList(&$params)
	{

		$db = JFactory::getDbo();
		$query = $db->getQuery(true);
		$query->select('*');
		$query->from($db->quoteName('#__acymailing_mail'));
		$query->where($db->quoteName('tempid')." = ".$db->quote($params->get('tempid')));
		$query->where($db->quoteName('published')." = 1");
		$query->order($db->quoteName('mailid') . ' DESC');
		$query->setLimit($params->get('count', 5));
		$db->setQuery($query);
		$results = $db->loadObjectList();
		

		return $results;
	}
}
