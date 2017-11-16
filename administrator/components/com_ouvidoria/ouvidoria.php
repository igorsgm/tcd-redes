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

// Access check.
if (!JFactory::getUser()->authorise('core.manage', 'com_ouvidoria')) {
	throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'));
}

// Include dependancies
jimport('joomla.application.component.controller');

JLoader::registerPrefix('Ouvidoria', JPATH_COMPONENT_ADMINISTRATOR);
JLoader::register('OuvidoriaHelper', JPATH_COMPONENT_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'helpers' . DIRECTORY_SEPARATOR . 'ouvidoria.php');

JLoader::register('OuvidoriaHelpersOuvidoria', JPATH_SITE . DIRECTORY_SEPARATOR . 'components' . DIRECTORY_SEPARATOR . 'com_ouvidoria' . DIRECTORY_SEPARATOR . 'helpers' . DIRECTORY_SEPARATOR . 'ouvidoria.php');

// Importing Thomisticus Library to all component pages
JLoader::import('thomisticus.library');

$controller = JControllerLegacy::getInstance('Ouvidoria');
$controller->execute(JFactory::getApplication()->input->get('task'));
$controller->redirect();
