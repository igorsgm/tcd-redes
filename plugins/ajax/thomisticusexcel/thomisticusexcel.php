<?php

use Joomla\Utilities\ArrayHelper;
use Thomisticus\Utils\Arrays;
use Thomisticus\Utils\Strings;

defined('_JEXEC') or die;

// Import library dependencies
jimport('joomla.plugin.plugin');
JLoader::import('thomisticus.library');


class plgAjaxThomisticusexcel extends JPlugin
{

    /**
     * Input object
     *
     * @var     JInput
     */
    private $jinput;


    public function onAjaxThomisticusexcel()
    {
        $this->jinput = JFactory::getApplication()->input;

        if (!empty($this->jinput->get('method'))) {
            return $this->{$this->jinput->get('method')}();
        }

        return false;
    }

    /**
     * Return the component folders. Is being used in the Excel plugin
     * Eg: tAjax('http://yourwebsite.com/index.php?option=com_ajax&plugin=thomisticus&format=json', {method: 'getComponentViews', component: 'com_content', admin: true}, 'POST', 'html');
     */
    public function getComponentViews()
    {
        JFactory::getDocument()->setMimeEncoding('application/json');

        $path = $this->jinput->get('admin') == 'true' ? 'administrator/components/' : 'components/';

        $folders = array();
        if (!empty($this->jinput->get('componentName'))) {
            $folders = ThomisticusHelperFile::getFolders($path . $this->jinput->get('componentName') . '/views');
        }

        return $folders;
    }

    /**
     * Returns the attributes of the object that is passed to the list view of some backend component
     * In case of some error in the execution of getItems, the form attributes of that view will be returned
     *
     * @return array
     */
    public function getModelItemsAttributes()
    {
        JFactory::getDocument()->setMimeEncoding('application/json');

        $viewName      = $this->jinput->get('viewName');
        $componentName = $this->jinput->get('componentName');

        $model      = ThomisticusHelperComponent::getModel($viewName, $componentName, 'administrator');
        $attributes = array();

        if (!method_exists($model, 'getItems')) {
            return $attributes;
        }

        try {

            $items = ArrayHelper::fromObject($model->getItems());

            if (empty($items) || empty($items[0])) {
                $attributes = $this->getAttributesByForm($viewName, $componentName);
            } else {
                $attributes = array_keys(Arrays::first($items));
            }

        } catch (Error $error) {
            $attributes                    = $this->getAttributesByForm($viewName, $componentName);
            $attributes['messages']        = new JObject();
            $attributes['messages']->info  = [
                'O método <strong>getItems</strong> da view ' . $viewName . ' apresentou um erro, assim, será exibido apenas os campos presentes no formulário (XML) a serem selecionados como colunas do excel.</div>'
            ];
            $attributes['messages']->error = ['<strong>Erro: </strong>' . $error->getMessage() . '<br><strong>Arquivo: </strong> ' . $error->getFile() . ' - <strong>Linha: </strong> ' . $error->getLine()];
        }

        return $attributes;
    }

    /**
     * Returns the form attributes of a view
     *
     * @param string $viewName
     * @param string $componentName
     *
     * @return array
     */
    private function getAttributesByForm($viewName, $componentName)
    {
        $viewName = Strings::singularizePtBr($viewName);

        $form = ThomisticusHelperForm::getForm($componentName, $viewName, 'administrator');

        return ThomisticusHelperForm::getFormAttributes($form);
    }

}