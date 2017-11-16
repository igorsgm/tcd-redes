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

jimport('joomla.application.component.controllerform');

/**
 * Dispositivo controller class.
 *
 * @since  1.6
 */
class DispositivosControllerDispositivo extends JControllerForm
{
	/**
	 * Constructor
	 *
	 * @throws Exception
	 */
	public function __construct()
	{
		$this->view_list = 'dispositivos';
		parent::__construct();
	}
}
