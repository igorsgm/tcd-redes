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

jimport('joomla.application.component.view');

/**
 * View class for a list of Agenda.
 */
class AgendaViewAgendasCategoria extends JViewLegacy
{
	protected $items;
	protected $pagination;
	protected $state;
    protected $params;

	/**
	 * Display the view
	 */
	public function display($tpl = null)
	{
        $app              = JFactory::getApplication();
    	$jinput = JFactory::getApplication()->input;
		
    	$this->sAno 		  = $jinput->get('ano', '0', 'INT');
		$this->sMes 		  = $jinput->get('mes', '0', 'INT');
        $this->state	  = $this->get('State');
        $this->itens	  = $this->get('Items');
        $this->pagination = $this->get('Pagination');
        $this->params     = $app->getParams('com_agenda');
        $this->mes		  = $this->get('Mes');
        $this->ano		  = $this->get('Ano');


        // Check for errors.
        if (count($errors = $this->get('Errors'))) {;
            throw new Exception(implode("\n", $errors));
        }

        parent::display($tpl);
	}	
}
