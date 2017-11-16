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
class OuvidoriaViewSolicitacoestipos extends JViewLegacy
{
	protected $items;

	protected $pagination;

	protected $state;

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
		$this->state         = $this->get('State');
		$this->items         = $this->get('Items');
		$this->pagination    = $this->get('Pagination');
		$this->filterForm    = $this->get('FilterForm');
		$this->activeFilters = $this->get('ActiveFilters');

		// Check for errors.
		if (count($errors = $this->get('Errors'))) {
			throw new Exception(implode("\n", $errors));
		}

		OuvidoriaHelper::addSubmenu('solicitacoestipos');

		$this->addToolbar();

		$this->sidebar = JHtmlSidebar::render();
		parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @return void
	 *
	 * @since    1.6
	 */
	protected function addToolbar()
	{
		$state = $this->get('State');
		$canDo = OuvidoriaHelper::getActions();

		JToolBarHelper::title(JText::_('COM_OUVIDORIA_TITLE_SOLICITACOESTIPOS'), 'solicitacoestipos.png');

		// Check if the form exists before showing the add/edit buttons
		$formPath = JPATH_COMPONENT_ADMINISTRATOR . '/views/solicitacaotipo';

		if (file_exists($formPath)) {
			if ($canDo->get('core.create')) {
				JToolBarHelper::addNew('solicitacaotipo.add', 'JTOOLBAR_NEW');

				if (isset($this->items[0])) {
					JToolbarHelper::custom('solicitacoestipos.duplicate', 'copy.png', 'copy_f2.png', 'JTOOLBAR_DUPLICATE', true);
				}
			}

			if ($canDo->get('core.edit') && isset($this->items[0])) {
				JToolBarHelper::editList('solicitacaotipo.edit', 'JTOOLBAR_EDIT');
			}
		}

		if ($canDo->get('core.edit.state')) {
			if (isset($this->items[0]->state)) {
				JToolBarHelper::divider();
				JToolBarHelper::custom('solicitacoestipos.publish', 'publish.png', 'publish_f2.png', 'JTOOLBAR_PUBLISH', true);
				JToolBarHelper::custom('solicitacoestipos.unpublish', 'unpublish.png', 'unpublish_f2.png', 'JTOOLBAR_UNPUBLISH', true);
			} elseif (isset($this->items[0])) {
				// If this component does not use state then show a direct delete button as we can not trash
				JToolBarHelper::deleteList('', 'solicitacoestipos.delete', 'JTOOLBAR_DELETE');
			}

			if (isset($this->items[0]->state)) {
				JToolBarHelper::divider();
				JToolBarHelper::archiveList('solicitacoestipos.archive', 'JTOOLBAR_ARCHIVE');
			}

			if (isset($this->items[0]->checked_out)) {
				JToolBarHelper::custom('solicitacoestipos.checkin', 'checkin.png', 'checkin_f2.png', 'JTOOLBAR_CHECKIN', true);
			}
		}

		// Show trash and delete for components that uses the state field
		if (isset($this->items[0]->state)) {
			if ($state->get('filter.state') == -2 && $canDo->get('core.delete')) {
				JToolBarHelper::deleteList('', 'solicitacoestipos.delete', 'JTOOLBAR_EMPTY_TRASH');
				JToolBarHelper::divider();
			} elseif ($canDo->get('core.edit.state')) {
				JToolBarHelper::trash('solicitacoestipos.trash', 'JTOOLBAR_TRASH');
				JToolBarHelper::divider();
			}
		}

		if ($canDo->get('core.admin')) {
			JToolBarHelper::preferences('com_ouvidoria');
		}

		// Set sidebar action - New in 3.0
		JHtmlSidebar::setAction('index.php?option=com_ouvidoria&view=solicitacoestipos');
	}

	/**
	 * Method to order fields
	 *
	 * @return void
	 */
	protected function getSortFields()
	{
		return array(
			'a.`id`'       => JText::_('JGRID_HEADING_ID'),
			'a.`ordering`' => JText::_('JGRID_HEADING_ORDERING'),
			'a.`state`'    => JText::_('JSTATUS'),
			'a.`nome`'     => JText::_('COM_OUVIDORIA_SOLICITACOESTIPOS_NOME'),
		);
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