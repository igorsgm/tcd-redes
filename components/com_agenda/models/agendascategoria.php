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
class AgendaModelAgendasCategoria extends JModelList{
    protected function getListQuery(){
    	$jinput = JFactory::getApplication()->input;
		$ano = $jinput->get('ano', '0', 'INT');
		$mes = $jinput->get('mes', '0', 'INT');

    	$categoria = $this->getCategorias();
        $db = $this->getDbo();
        $query = $db->getQuery(true);

        $query->select('id, data_inicio, data_fim, nome, hora_inicio, hora_fim, local, descricao, imagem')
        	  ->from('#__com_agenda')
        	  ->where('state = 1')
        	  ->order('data_inicio asc');

		if(isset($dataAtual)){
			$query->where("(data_inicio >= NOW() OR data_fim >= NOW())");
		}

		if($categoria){
			$query->where("categoria IN ($categoria)");
		}

		if($ano){
			$query->where("(YEAR(data_inicio) = $ano OR YEAR(data_fim) = $ano)");
		}

		if($mes){
			$query->where("(MONTH(data_inicio) = $mes OR MONTH(data_fim) = $mes)");
		}

        return $query;
    }

    public function getItems() {
        return parent::getItems();
    }
    
    protected function getCategorias(){
    	$categoria = implode(',', $this->getParamsMenu('categoria'));
    	return $categoria;
    }
    
    protected function getParamsMenu($variavel){
		$app = JFactory::getApplication();
		$menuitem   = $app->getMenu()->getActive();
		$params = $menuitem->params;
		$paramsMenu = $params->get($variavel);
		return $paramsMenu;
    }
    
    public function getMes(){
    	$meses = array("Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro");
    	return $meses;
    }
    
    public function getAno(){
    	$anoInicial = $this->getParamsMenu('ano_inicial');
    	$anoFinal = date('Y');
    	
    	if(empty($anoInicial)){
    		$anoInicial = $anoFinal;
    	}
    	
    	for ($i = $anoInicial; $i <= $anoFinal; $i++){
    		$datas[] = $i;
    	}
    	
    	return $datas;    	
    }
}
