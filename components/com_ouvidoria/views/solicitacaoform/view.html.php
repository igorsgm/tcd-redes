<?php

/**
 * @version    CVS: 1.0.3
 * @package    Com_Ouvidoria
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  2017 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
// No direct access
defined('_JEXEC') or die;

jimport('joomla.application.component.view');

/**
 * View to edit
 *
 * @since  1.6
 */
class OuvidoriaViewSolicitacaoform extends JViewLegacy
{
	protected $state;

	/**
	 * @var JObject $item
	 */
	protected $item;

	/**
	 * @var JObject $solicitante
	 */
	protected $solicitante;

	/**
	 * @var JForm $form
	 */
	protected $form;

	/**
	 * @var JForm $formSolicitante
	 */
	protected $formSolicitante;

	protected $params;

	protected $canSave;

	protected $isAssociadoRedirectedLogin;

	protected $isUserOuvidoriaOrSuperUser;

	/**
	 * Display the view
	 *
	 * @param   string $tpl Template name
	 *
	 * @return void
	 *
	 * @throws Exception
	 */
	public function display($tpl = null)
	{
		$app  = JFactory::getApplication();
		$user = JFactory::getUser();

		$this->state                      = $this->get('State');
		$this->item                       = $this->get('Data');
		$this->solicitante                = $this->get('Solicitante');
		$this->params                     = $app->getParams('com_ouvidoria');
		$this->canSave                    = $this->get('CanSave');
		$this->form                       = $this->get('Form');
		$this->formSolicitante            = $this->get('FormSolicitante');
		$this->isUserOuvidoriaOrSuperUser = OuvidoriaHelpersOuvidoria::isUserOuvidoriaOrSuperUser();
		$this->isAssociadoRedirectedLogin = !empty($user->id) && ($app->input->get('assocredirected') == 'true');

		ThomisticusHelperAsset::loadJSLanguageKeys('media/com_ouvidoria/js/solicitacao.js');

		// Check for errors.
		if (count($errors = $this->get('Errors'))) {
			throw new Exception(implode("\n", $errors));
		}


		$this->_prepareDocument();

		parent::display($tpl);
	}

	/**
	 * Prepares the document
	 *
	 * @return void
	 *
	 * @throws Exception
	 */
	protected function _prepareDocument()
	{
		$app   = JFactory::getApplication();
		$menus = $app->getMenu();
		$title = null;

		// Because the application sets a default page title,
		// we need to get it from the menu item itself
		$menu = $menus->getActive();

		if ($menu) {
			$this->params->def('page_heading', $this->params->get('page_title', $menu->title));
		} else {
			$this->params->def('page_heading', JText::_('COM_OUVIDORIA_DEFAULT_PAGE_TITLE'));
		}

		$title = $this->params->get('page_title', '');

		if (empty($title)) {
			$title = $app->get('sitename');
		} elseif ($app->get('sitename_pagetitles', 0) == 1) {
			$title = JText::sprintf('JPAGETITLE', $app->get('sitename'), $title);
		} elseif ($app->get('sitename_pagetitles', 0) == 2) {
			$title = JText::sprintf('JPAGETITLE', $title, $app->get('sitename'));
		}

		$this->document->setTitle($title);

		if ($this->params->get('menu-meta_description')) {
			$this->document->setDescription($this->params->get('menu-meta_description'));
		}

		if ($this->params->get('menu-meta_keywords')) {
			$this->document->setMetadata('keywords', $this->params->get('menu-meta_keywords'));
		}

		if ($this->params->get('robots')) {
			$this->document->setMetadata('robots', $this->params->get('robots'));
		}
	}
}
