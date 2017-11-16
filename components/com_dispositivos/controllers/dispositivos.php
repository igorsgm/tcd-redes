<?php
/**
 * @version    CVS: 1.0.0
 * @package    Com_Dispositivos
 * @author     Igor Moraes <igor.sgm@gmail.com>
 * @copyright  2017 Igor Moraes
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */

// No direct access.
defined('_JEXEC') or die;

/**
 * Dispositivos list controller class.
 *
 * @since  1.6
 */
class DispositivosControllerDispositivos extends DispositivosController
{
	/**
	 * Proxy for getModel.
	 *
	 * @param   string  $name    The model name. Optional.
	 * @param   string  $prefix  The class prefix. Optional
	 * @param   array   $config  Configuration array for model. Optional
	 *
	 * @return object	The model
	 *
	 * @since	1.6
	 */
	public function &getModel($name = 'Dispositivos', $prefix = 'DispositivosModel', $config = array())
	{
		$model = parent::getModel($name, $prefix, array('ignore_request' => true));

		return $model;
	}
}
