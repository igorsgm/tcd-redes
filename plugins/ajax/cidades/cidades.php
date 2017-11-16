<?php defined('_JEXEC') or die;


// Import library dependencies
jimport('joomla.plugin.plugin');

class plgAjaxCidades extends JPlugin {

	function onAjaxCidades() {

		$id_estado = JRequest::getInt('estado');
		$db    = JFactory::getDbo();
		$query = $db->getQuery(TRUE);
		$query
			->select('id, nm_cidade')
			->from($db->quoteName('#__cidades'))
			->where($db->quoteName('id_estado'). ' = ' . $db->quote($id_estado))
			->order($db->quoteName('nm_cidade') . ' ASC');

		$db->setQuery($query);

		return $db->loadObjectList();

	}
}