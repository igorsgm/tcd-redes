<?php

/**
 * @version    CVS: 1.0.9
 * @package    Com_Associados
 * @author     Trídia Criação <atendimento@tridiacriacao.com>
 * @copyright  2016 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
// No direct access
defined('_JEXEC') or die;

jimport('joomla.application.component.controller');

/**
 * Class AssociadosController
 *
 * @since  1.6
 */
class AssociadosController extends JControllerLegacy
{
	/**
	 * Method to display a view.
	 *
	 * @param   boolean $cachable  If true, the view output will be cached
	 * @param   mixed   $urlparams An array of safe url parameters and their variable types, for valid values see {@link JFilterInput::clean()}.
	 *
	 * @return  JController   This object to support chaining.
	 *
	 * @since    1.5
	 */
	public function display($cachable = false, $urlparams = false)
	{
        $app   = JFactory::getApplication();
        $start = $app->input->getInt('start', 0);

        if ($start == 0)
        {
            $app->input->set('limitstart', 0);
        }

        $view = $app->input->getCmd('view', 'associados');
		$app->input->set('view', $view);

		parent::display($cachable, $urlparams);

		return $this;
	}
}
