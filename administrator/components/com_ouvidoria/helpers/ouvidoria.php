<?php

/**
 * @version    CVS: 1.0.3
 * @package    Com_Ouvidoria
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  2017 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
// No direct access
defined('_JEXEC') or die;

/**
 * Ouvidoria helper.
 *
 * @since  1.6
 */
class OuvidoriaHelper
{
	/**
	 * Configure the Linkbar.
	 *
	 * @param   string $vName string
	 *
	 * @return void
	 */
	public static function addSubmenu($vName = '')
	{
		JHtmlSidebar::addEntry(
			JText::_('COM_OUVIDORIA_TITLE_SOLICITANTES'),
			'index.php?option=com_ouvidoria&view=solicitantes',
			$vName == 'solicitantes'
		);

		JHtmlSidebar::addEntry(
			JText::_('COM_OUVIDORIA_TITLE_SOLICITACOES'),
			'index.php?option=com_ouvidoria&view=solicitacoes',
			$vName == 'solicitacoes'
		);

		JHtmlSidebar::addEntry(
			JText::_('COM_OUVIDORIA_TITLE_SOLICITACOESTIPOS'),
			'index.php?option=com_ouvidoria&view=solicitacoestipos',
			$vName == 'solicitacoestipos'
		);

		JHtmlSidebar::addEntry(
			JText::_('COM_OUVIDORIA_TITLE_SOLICITACOESSTATUS'),
			'index.php?option=com_ouvidoria&view=solicitacoesstatus',
			$vName == 'solicitacoesstatus'
		);

		JHtmlSidebar::addEntry(
			JText::_('COM_OUVIDORIA_TITLE_SOLICITACOESINTERACOES'),
			'index.php?option=com_ouvidoria&view=solicitacoesinteracoes',
			$vName == 'solicitacoesinteracoes'
		);

		JHtmlSidebar::addEntry(
			JText::_('COM_OUVIDORIA_TITLE_DIRETORIAS'),
			'index.php?option=com_ouvidoria&view=diretorias',
			$vName == 'diretorias'
		);

		JHtmlSidebar::addEntry(
			JText::_('COM_OUVIDORIA_TITLE_SOLICITACOESLOGS'),
			'index.php?option=com_ouvidoria&view=solicitacoeslogs',
			$vName == 'solicitacoeslogs'
		);

		JHtmlSidebar::addEntry(
			JText::_('COM_OUVIDORIA_TITLE_COMENTARIOS'),
			'index.php?option=com_ouvidoria&view=comentarios',
			$vName == 'comentarios'
		);

	}

	/**
	 * Gets the files attached to an item
	 *
	 * @param   int    $pk    The item's id
	 *
	 * @param   string $table The table's name
	 *
	 * @param   string $field The field's name
	 *
	 * @return  array  The files
	 */
	public static function getFiles($pk, $table, $field)
	{
		$db    = JFactory::getDbo();
		$query = $db->getQuery(true);

		$query
			->select($field)
			->from($table)
			->where('id = ' . (int)$pk);

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

		$assetName = 'com_ouvidoria';

		$actions = array(
			'core.admin',
			'core.manage',
			'core.create',
			'core.edit',
			'core.edit.own',
			'core.edit.state',
			'core.delete'
		);

		foreach ($actions as $action) {
			$result->set($action, $user->authorise($action, $assetName));
		}

		return $result;
	}
}

