<?php
/**
 * @version     1.0.0
 * @package     com_agenda
 * @copyright   Copyright (C) 2013. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @author      iComunicação <contato@icomunicacao.com.br> - http://www.icomunicacao.com.br
 */

// No direct access.
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

/**
 * Agendas list controller class.
 */
class AgendaControllerAgendas extends AgendaController
{
	/**
	 * Proxy for getModel.
	 * @since	1.6
	 */
	public function &getModel($name = 'Agendas', $prefix = 'AgendaModel')
	{
		$model = parent::getModel($name, $prefix, array('ignore_request' => true));
		return $model;
	}
}