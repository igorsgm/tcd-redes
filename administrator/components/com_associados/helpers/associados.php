<?php

/**
 * @version    CVS: 1.0.9
 * @package    Com_Associados
 * @author     Trídia Criação <atendimento@tridiacriacao.com>
 * @copyright  2016 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
// No direct access
defined('_JEXEC') or die;

/**
 * Associados helper.
 *
 * @since  1.6
 */
class AssociadosHelpersAssociados
{
	/**
	 * Configure the Linkbar.
	 *
	 * @param   string  $vName  string
	 *
	 * @return void
	 */
	public static function addSubmenu($vName = '')
	{
		JHtmlSidebar::addEntry(
			JText::_('COM_ASSOCIADOS_TITLE_ASSOCIADOS'),
			'index.php?option=com_associados&view=associados',
			$vName == 'associados'
		);

		JHtmlSidebar::addEntry(
			JText::_('JCATEGORIES') . ' (' . JText::_('COM_ASSOCIADOS_TITLE_ASSOCIADOS') . ')',
			"index.php?option=com_categories&extension=com_associados",
			$vName == 'categories'
		);
		if ($vName=='categories') {
			JToolBarHelper::title('Associados Anamatra: JCATEGORIES (COM_ASSOCIADOS_TITLE_ASSOCIADOS)');
		}

JHtmlSidebar::addEntry(
			JText::_('COM_ASSOCIADOS_TITLE_SITUACOES'),
			'index.php?option=com_associados&view=situacoes',
			$vName == 'situacoes'
		);

JHtmlSidebar::addEntry(
			JText::_('COM_ASSOCIADOS_TITLE_EVENTOS'),
			'index.php?option=com_associados&view=eventos',
			$vName == 'eventos'
		);

JHtmlSidebar::addEntry(
			JText::_('COM_ASSOCIADOS_TITLE_CIDADES'),
			'index.php?option=com_associados&view=cidades',
			$vName == 'cidades'
		);

JHtmlSidebar::addEntry(
			JText::_('COM_ASSOCIADOS_TITLE_ESTADOS'),
			'index.php?option=com_associados&view=estados',
			$vName == 'estados'
		);

	}

	/**
	 * Gets the files attached to an item
	 *
	 * @param   int     $pk     The item's id
	 *
	 * @param   string  $table  The table's name
	 *
	 * @param   string  $field  The field's name
	 *
	 * @return  array  The files
	 */
	public static function getFiles($pk, $table, $field)
	{
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);

		$query
			->select($field)
			->from($table)
			->where('id = ' . (int) $pk);

		$db->setQuery($query);

		return explode(',', $db->loadResult());
	}

	/**
	 * Gets a list of the actions that can be performed.
	 *
	 * @return    JObject
	 *
	 * @since    1.6
	 */
	public static function getActions()
	{
		$user   = JFactory::getUser();
		$result = new JObject;

		$assetName = 'com_associados';

		$actions = array(
			'core.admin', 'core.manage', 'core.create', 'core.edit', 'core.edit.own', 'core.edit.state', 'core.delete'
		);

		foreach ($actions as $action)
		{
			$result->set($action, $user->authorise($action, $assetName));
		}

		return $result;
	}
}


class AssociadosHelper extends AssociadosHelpersAssociados
{

}
