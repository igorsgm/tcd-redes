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
 * View class for a list of Ouvidoria.
 *
 * @since  1.6
 */
class OuvidoriaViewComentarios extends JViewLegacy
{
	protected $items;

	protected $pagination;

	protected $state;

	protected $params;

	protected $solicitacao;

	protected $solicitante;

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
		$app = JFactory::getApplication();

		$this->state                      = $this->get('State');
		$this->items                      = $this->get('Items');
		$this->pagination                 = $this->get('Pagination');
		$this->params                     = $app->getParams('com_ouvidoria');
		$this->filterForm                 = $this->get('FilterForm');
		$this->activeFilters              = $this->get('ActiveFilters');
		$this->solicitacao                = $this->get('Solicitacao');
		$this->solicitante                = $this->get('Solicitante');
		$this->consultaveis               = OuvidoriaHelpersOuvidoria::getUsersConsultaveis();
		$this->diretorias                 = OuvidoriaHelpersOuvidoria::getDiretorias();
		$this->isUserOuvidoriaOrSuperUser = OuvidoriaHelpersOuvidoria::isUserOuvidoriaOrSuperUser();
		$this->comentarioToAnswer         = $this->isUserOuvidoriaOrSuperUser ? OuvidoriaHelpersOuvidoria::getUserCommentToAnswer($this->solicitacao->id) : null;
		$this->interacoes                 = OuvidoriaHelpersOuvidoria::getInteracoes((!empty($this->comentarioToAnswer) && !empty($this->comentarioToAnswer->created_by)));
		$this->isSolicitacaoDisabled      = OuvidoriaHelpersOuvidoria::isSolicitacaoDisabled($this->solicitacao->id);

		ThomisticusHelperAsset::loadJSLanguageKeys('media/com_ouvidoria/js/comentarios.js');

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

	/**
	 * Check if state is set
	 *
	 * @param   mixed $state State
	 *
	 * @return bool
	 */
	public function getState($state)
	{
		return isset($this->state->{$state}) ? $this->state->{$state} : false;
	}
}
