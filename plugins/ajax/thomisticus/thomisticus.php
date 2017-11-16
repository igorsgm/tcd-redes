<?php
defined('_JEXEC') or die;

// Import library dependencies
jimport('joomla.plugin.plugin');
JLoader::import('thomisticus.library');

/**
 * Plugin to dynamically return a static method from some static Joomla classes or, specially, Thomisticus Library.
 *
 * To be used by ajax calls. Ex: tAjax
 * Eg:
 *
 * <script>
 *      // It's necessary to escape slashes when namespaced function signatures are sent
 *      var data = {
 *          "signature": "JText::_", //folder name. In this case: /libraries/thomisticus/src/{THIS}
 *          "params": {0: "JYES"}// Must be passed as array
 *      };
 *
 *      tAjax('http://yoursite.com/index.php?option=com_ajax&plugin=thomisticus&format=json', 'POST', data);
 *
 * </script>
 */
class plgAjaxThomisticus extends JPlugin
{

    /**
	 * Input object
	 *
	 * @var     JInput
	 */
	private $jinput;


	public function onAjaxThomisticus()
	{
		$this->jinput = JFactory::getApplication()->input;

		$functionSignature = $this->jinput->get('signature', '', 'RAW');

		$params = $this->jinput->get('params');

		if (!empty($functionSignature))
		{
			try
			{
				$response = call_user_func_array($functionSignature, $params);
			}
			catch (Exception $e)
			{
				$response = false;
			}

			return $response;
		}

		return false;
	}

}