<?php

/**
 * @version     1.0.0
 * @package     com_agenda
 * @copyright   Copyright (C) 2013. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @author      iComunicação <contato@icomunicacao.com.br> - http://www.icomunicacao.com.br
 */
defined('_JEXEC') or die;

jimport('joomla.application.component.modellist');

/**
 * Methods supporting a list of Agenda records.
 */
class AgendaModelAgendaItem extends JModelList {

    protected function getListQuery() {
    	$jinput = JFactory::getApplication()->input;
		$itemId = $jinput->get('itemdid', '0', 'INT');
		
		$db = $this->getDbo();
        $query = $db->getQuery(true);
        $query->select('id, data_inicio, data_fim, nome, hora_inicio, hora_fim, local, descricao, imagem, maps, files, file_titles')
        	  ->from('#__com_agenda')
        	  ->where('state = 1')
        	  ->where("id = $itemId");
        	  
        return $query;
    }

    public function getItems() {
        return parent::getItems();
    }
}
