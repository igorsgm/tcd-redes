<?php
defined('_JEXEC') or die;
 
jimport('joomla.form.helper');
JFormHelper::loadFieldClass('list');
 
class JFormFieldLocal extends JFormFieldList
{
	protected $type = 'Estado';
 
	protected function getOptions() 
	{
		$db = JFactory::getDBO();
		$query = $db->getQuery(true);
		$query->select('sigla,nome');
		$query->from('#__estados');
		$db->setQuery((string)$query);
		$messages = $db->loadObjectList();
		$options = array();
		if ($messages)
		{	
			$options[] = JHtml::_('select.option', '', '---');
			foreach($messages as $message) 
			{
				$options[] = JHtml::_('select.option', $message->sigla, $message->nome);
			}
		}
		$options = array_merge(parent::getOptions(), $options);
		return $options;
	}
}