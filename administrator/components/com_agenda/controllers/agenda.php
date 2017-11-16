<?php
/**
 * @version     1.0.0
 * @package     com_agenda
 * @copyright   Copyright (C) 2013. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @author      iComunicação <contato@icomunicacao.com.br> - http://www.icomunicacao.com.br
 */

// No direct access
defined('_JEXEC') or die;

jimport('joomla.application.component.controllerform');

/**
 * Agenda controller class.
 */
class AgendaControllerAgenda extends JControllerForm
{

    function __construct() {
        $this->view_list = 'agendas';
        parent::__construct();
    }

}