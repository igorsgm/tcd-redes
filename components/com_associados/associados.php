<?php
/**
 * @version    CVS: 1.0.9
 * @package    Com_Associados
 * @author     Trídia Criação <atendimento@tridiacriacao.com>
 * @copyright  2016 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */

defined('_JEXEC') or die;

// Include dependancies
jimport('joomla.application.component.controller');

JLoader::registerPrefix('Associados', JPATH_COMPONENT);
JLoader::register('AssociadosController', JPATH_COMPONENT . '/controller.php');

// Importing Thomisticus Library to all component pages
JLoader::import('thomisticus.library');

// Execute the task.
$controller = JControllerLegacy::getInstance('Associados');
$controller->execute(JFactory::getApplication()->input->get('task'));
$controller->redirect();
