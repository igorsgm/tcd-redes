<?php
/**
 * @version    CVS: 1.0.0
 * @package    Com_Dispositivos
 * @author     Igor Moraes <igor.sgm@gmail.com>
 * @copyright  2017 Igor Moraes
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */

// No direct access
defined('_JEXEC') or die;

// Access check.
if (!JFactory::getUser()->authorise('core.manage', 'com_dispositivos'))
{
	throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'));
}

// Include dependancies
jimport('joomla.application.component.controller');

JLoader::registerPrefix('Dispositivos', JPATH_COMPONENT_ADMINISTRATOR);
JLoader::register('DispositivosHelper', JPATH_COMPONENT_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'helpers' . DIRECTORY_SEPARATOR . 'dispositivos.php');

$controller = JControllerLegacy::getInstance('Dispositivos');
$controller->execute(JFactory::getApplication()->input->get('task'));
$controller->redirect();
