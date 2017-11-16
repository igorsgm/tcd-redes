<?php
/**
 * @version    CVS: 1.0.3
 * @package    Com_Ouvidoria
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  2017 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */

defined('_JEXEC') or die;

// Include dependancies
jimport('joomla.application.component.controller');

JLoader::registerPrefix('Ouvidoria', JPATH_COMPONENT);
JLoader::register('OuvidoriaController', JPATH_COMPONENT . '/controller.php');

// Importing Thomisticus Library to all component pages
JLoader::import('thomisticus.library');
JHtml::_('thomisticus.sweetAlert2');

// Execute the task.
$controller = JControllerLegacy::getInstance('Ouvidoria');
$controller->execute(JFactory::getApplication()->input->get('task'));
$controller->redirect();
