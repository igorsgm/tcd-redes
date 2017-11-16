<?php
/**
 * @version     1.0.0
 * @package     thomisticusexcel
 * @copyright   Copyright (C) 2015. Todos os direitos reservados.
 * @license     GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 * @author      Trídia Criação <atendimento@tridiacriacao.com> - http://www.tridiacriacao.com
 */

defined('_JEXEC') or die;

jimport('joomla.plugin.plugin');
jimport('joomla.application.component.controlleradmin');

JLoader::import('thomisticus.library');
JHtml::_('bootstrap.framework');
JHtml::_('thomisticus.bootstrapTable');

class PlgSystemthomisticusexcel extends JPlugin
{
    public function onBeforeRender()
    {
        $app = JFactory::getApplication();

        if ($app->isClient('administrator')) {

            $params = $this->treatParams($this->params->get('componente'));
            $option = $app->input->get('option');
            $view   = $app->input->get('view');

            $inScope = in_array($option, array_keys($params)) && in_array($view, $params[$option]);

            if ($inScope || ($option == 'com_plugins' && $app->input->get('view') == 'plugin')) {
                JLoader::import('thomisticus.library');
                JHtml::_('thomisticus.assets');
                JFactory::getDocument()->addScript(JUri::root() . 'media/thomisticus/js/plugins/thomisticusexcel.js');
            }

            // Adicionar botão apenas para os componentes e views habilitadas pelo plugin
            if ($inScope) {

                $toolbar = JToolbar::getInstance('toolbar');
                $toolbar->appendButton('Link', 'users', 'Gerar Excel', 'index.php');

            }
        }
    }

    /**
     * Tratar os parâmetros para ficar mais fácil de ser manipulado pelo plugin
     *
     * @param object|JObject $params = parâmetros do plugin
     *
     * @return array = nome do componente como key e array de views como seu conteúdo
     */
    private function treatParams($params)
    {
        $parameters = array();

        if (!empty($params)) {
            foreach ($params as $key => $param) {
                $parameters[$param->name] = explode(',', $param->views);
            }
        }

        return $parameters;
    }
}
