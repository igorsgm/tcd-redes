<?php
/**
 * @package     Eventos.FNP
 * @subpackage  com_associados
 *
 * @copyright   Copyright (C) 2015 - 2020 Trídia Criação, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_PLATFORM') or die;
jimport('joomla.form.formfield');

JFormHelper::loadFieldClass('list');

/**
 * Provides input for TOS
 *
 * @package     Joomla.Plugin
 * @subpackage  User.profile
 * @since       2.5.5
 */
class JFormFieldCidade extends JFormFieldList
{
	/**
	 * The form field type.
	 *
	 * @var    string
	 * @since  2.5.5
	 */
	protected $type = 'Cidade';

	/**
	 * Method to get the field label markup.
	 *
	 * @return  string  The field label markup.
	 *
	 * @since   2.5.5
	 */
	protected function getLabel()
	{

		// Initialize variables.
        $label = '';
        $replace = '';
        
        // Get the label text from the XML element, defaulting to the element name.
        $text = 'Cidade';
       // die('test');
        
        // Build the class for the label.
        $class = !empty($this->description) ? 'hasTip' : '';
        $class = $this->required == true ? $class.' required' : $class;
        
        // Add replace checkbox
        //$replace = '<input type="checkbox" name="update['.$this->name.']" value="1" />';
        
        // Add the opening label tag and main attributes attributes.
        $label .= '<label id="'.$this->id.'-lbl" for="'.$this->id.'" class="'.$class.'"';
        
        // If a description is specified, use it to build a tooltip.
        if (!empty($this->description)) {
            $label .= ' title="'.htmlspecialchars(trim(JText::_($text), ':').'::' .
                JText::_($this->description), ENT_COMPAT, 'UTF-8').'"';
        }
        
        // Add the label text and closing tag.
        //$label .= '>'.$replace.JText::_($text).'</label>';
        $label .= '>'.JText::_($text).'</label>';
        
        return $label;

    }

    protected function getOptions() 
    {

         // select para as cidades
        $db = JFactory::getDbo();
        $db->setQuery('SELECT * FROM `#__cidades` ORDER BY nm_cidade ASC');

        $results = $db->loadObjectList();

        $options = array();
        foreach ($results as $key => $value) {
            $options[] = JHTML::_('select.option', $value->id, JText::_($value->nm_cidade)); 
        }

        $options = array_merge(parent::getOptions(), $options);     
        array_unshift($options, JHtml::_('select.option', '', ''));                        
        return $options;
    }

    public function getInput() {

        //usuario
        $user = JFactory::getUser();

        $dados = JFactory::getApplication()->getUserState('com_associados.login.data', array());

        $opcoes = JFormFieldCidade::getOptions();

        array_unshift($opcoes, JHtml::_('select.option', '', JText::_(' --- ')));    
        return JHTML::_('select.genericlist', $opcoes, 'jform_cidade', 'class = "cidades inputbox"', 'value','text');


    }
}
?>
