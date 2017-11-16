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

jimport('joomla.application.component.view');

/**
 * View class for a list of Associados.
 *
 * @since  1.6
 */
class AssociadosViewAssociados extends JViewLegacy
{
	protected $items;

	protected $pagination;

	protected $state;

	/**
	 * Display the view
	 *
	 * @param   string  $tpl  Template name
	 *
	 * @return void
	 *
	 * @throws Exception
	 */
	public function display($tpl = null)
	{
		$this->state = $this->get('State');
		$this->items = $this->get('Items');
		$this->pagination = $this->get('Pagination');

		// Check for errors.
		if (count($errors = $this->get('Errors')))
		{
			throw new Exception(implode("\n", $errors));
		}

		AssociadosHelpersAssociados::addSubmenu('associados');

		$this->addToolbar();

		$this->sidebar = JHtmlSidebar::render();

		// Gerar XLS
		$tmpl = JRequest::getVar('tpl', '', 'get', 'STRING');
		$tpl = empty($tmpl) ? $tpl : $tmpl;
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
		$canDo = AssociadosHelpersAssociados::getActions();

		JToolBarHelper::title(JText::_('COM_ASSOCIADOS_TITLE_ASSOCIADOS'), 'associados.png');

		// Check if the form exists before showing the add/edit buttons
//		$formPath = JPATH_COMPONENT_ADMINISTRATOR . '/views/associado';

//		if (file_exists($formPath))
//		{
//			if ($canDo->get('core.create'))
//			{
				// JToolBarHelper::addNew('associado.add', 'JTOOLBAR_NEW');
				// JToolbarHelper::custom('associados.duplicate', 'copy.png', 'copy_f2.png', 'JTOOLBAR_DUPLICATE', true);
//			}

//			if ($canDo->get('core.edit') && isset($this->items[0]))
//			{
				// JToolBarHelper::editList('associado.edit', 'JTOOLBAR_EDIT');
//			}
//		}

		if ($canDo->get('core.edit.state'))
		{
			if (isset($this->items[0]->state))
			{
				JToolBarHelper::divider();
				// JToolBarHelper::custom('associados.publish', 'publish.png', 'publish_f2.png', 'JTOOLBAR_PUBLISH', true);
				// JToolBarHelper::custom('associados.unpublish', 'unpublish.png', 'unpublish_f2.png', 'JTOOLBAR_UNPUBLISH', true);
			    //JToolBarHelper::custom('associados.geraExcel', 'list.png', 'list', 'Gerar arquivo Excel', false, true);
			    JToolBarHelper::custom('associados.userRegister', 'users.png', 'users.png', 'Cadastrar Usuários', true);

			    // Exibir se for SuperAdmin
			    // if (JFactory::getUser()->authorise('core.admin')) {
				   //  JToolBarHelper::custom('associados.usergroupUpdate', 'users.png', 'users.png', 'Atualizar Usergroup',
					  //   true);
				   //  JToolBarHelper::custom('associados.sendToProtheus', 'out-2.png', 'out-2.png', 'Enviar para Protheus',
					  //   true);
				   //  JToolBarHelper::custom('associados.upperCaseDependentes', 'users.png', 'users.png',
					  //   'UpperCase Dependentes',
					  //   true);
			    // }
				
			}
			elseif (isset($this->items[0]))
			{
				// If this component does not use state then show a direct delete button as we can not trash
				JToolBarHelper::deleteList('', 'associados.delete', 'JTOOLBAR_DELETE');
			}

			if (isset($this->items[0]->state))
			{
				JToolBarHelper::divider();
				// JToolBarHelper::archiveList('associados.archive', 'JTOOLBAR_ARCHIVE');
			}
			JToolBarHelper::custom('associados.resetPasswordAndSendEmail', 'redo-2.png', 'redo-2.png', 'Redefinir Senha',
					true);

//			if (isset($this->items[0]->checked_out))
//			{
				// JToolBarHelper::custom('associados.checkin', 'checkin.png', 'checkin_f2.png', 'JTOOLBAR_CHECKIN', true);
//			}
		}

		// Show trash and delete for components that uses the state field
		if (isset($this->items[0]->state))
		{
			if ($state->get('filter.state') == -2 && $canDo->get('core.delete'))
			{
				JToolBarHelper::deleteList('', 'associados.delete', 'JTOOLBAR_EMPTY_TRASH');
				JToolBarHelper::divider();
			}
			elseif ($canDo->get('core.edit.state'))
			{
//				JToolBarHelper::trash('associados.trash', 'JTOOLBAR_TRASH');
				JToolBarHelper::divider();
			}
		}

		if ($canDo->get('core.admin'))
		{
			JToolBarHelper::preferences('com_associados');
		}

		// Set sidebar action - New in 3.0
		JHtmlSidebar::setAction('index.php?option=com_associados&view=associados');

		$this->extra_sidebar = '';
		JHtmlSidebar::addFilter(

			JText::_('JOPTION_SELECT_PUBLISHED'),

			'filter_published',

			JHtml::_('select.options', JHtml::_('jgrid.publishedOptions'), "value", "text", $this->state->get('filter.state'), true)

		);
		//Filter for the field state_anamatra
		$select_label = JText::sprintf('COM_ASSOCIADOS_FILTER_SELECT_LABEL', 'Status Anamatra');
		$options = array();
		$options[0] = new stdClass();
		$options[0]->value = "0";
		$options[0]->text = "Novo";
		$options[1] = new stdClass();
		$options[1]->value = "1";
		$options[1]->text = "Aprovado";
		$options[2] = new stdClass();
		$options[2]->value = "2";
		$options[2]->text = "Em análise";
		$options[3] = new stdClass();
		$options[3]->value = "3";
		$options[3]->text = "Recusado";
		JHtmlSidebar::addFilter(
			$select_label,
			'filter_state_anamatra',
			JHtml::_('select.options', $options , "value", "text", $this->state->get('filter.state_anamatra'), true)
		);

		//Filter for the field state_amatra
		$select_label = JText::sprintf('COM_ASSOCIADOS_FILTER_SELECT_LABEL', 'Status Amatra');
		$options = array();
		$options[0] = new stdClass();
		$options[0]->value = "0";
		$options[0]->text = "Novo";
		$options[1] = new stdClass();
		$options[1]->value = "1";
		$options[1]->text = "Aprovado";
		$options[2] = new stdClass();
		$options[2]->value = "2";
		$options[2]->text = "Em análise";
		$options[3] = new stdClass();
		$options[3]->value = "3";
		$options[3]->text = "Recusado";
		JHtmlSidebar::addFilter(
			$select_label,
			'filter_state_amatra',
			JHtml::_('select.options', $options , "value", "text", $this->state->get('filter.state_amatra'), true)
		);

		JHtmlSidebar::addFilter(
			JText::_("- Selecionar Região -"),
			'filter_amatra',
			JHtml::_('select.options', JHtml::_('category.options', 'com_associados'), "value", "text", $this->state->get('filter.amatra'))

		);

		//Filter for the field receber_newsletter
		$select_label = JText::sprintf('COM_ASSOCIADOS_FILTER_SELECT_LABEL', 'Receber e-mails da Anamatra?');
		$options = array();
		$options[0] = new stdClass();
		$options[0]->value = "0";
		$options[0]->text = "Não";
		$options[1] = new stdClass();
		$options[1]->value = "1";
		$options[1]->text = "Sim";
		JHtmlSidebar::addFilter(
			$select_label,
			'filter_receber_newsletter',
			JHtml::_('select.options', $options , "value", "text", $this->state->get('filter.receber_newsletter'), true)
		);

		//Filter for the field receber_sms
		$select_label = JText::sprintf('COM_ASSOCIADOS_FILTER_SELECT_LABEL', 'Receber comunicação da Anamatra pelo celular?');
		$options = array();
		$options[0] = new stdClass();
		$options[0]->value = "0";
		$options[0]->text = "Não";
		$options[1] = new stdClass();
		$options[1]->value = "1";
		$options[1]->text = "Sim";
		JHtmlSidebar::addFilter(
			$select_label,
			'filter_receber_sms',
			JHtml::_('select.options', $options , "value", "text", $this->state->get('filter.receber_sms'), true)
		);

		//Filter for the field forma_associacao
		$select_label = JText::sprintf('COM_ASSOCIADOS_FILTER_SELECT_LABEL', 'Filiação do associado');
		$options = array();
		$options[0] = new stdClass();
		$options[0]->value = "0";
		$options[0]->text = "Associado somente a Amatra";
		$options[1] = new stdClass();
		$options[1]->value = "1";
		$options[1]->text = "Associado a Amatra e Anamatra";
		$options[2] = new stdClass();
		$options[2]->value = "2";
		$options[2]->text = "Vazio";
		JHtmlSidebar::addFilter(
			$select_label,
			'filter_forma_associacao',
			JHtml::_('select.options', $options , "value", "text", $this->state->get('filter.forma_associacao'), true)
		);

		//Filter for the field situacao_do_associado;
		jimport('joomla.form.form');
		$options = array();
		JForm::addFormPath(JPATH_COMPONENT . '/models/forms');
		$form = JForm::getInstance('com_associados.associado', 'associado');

		$field = $form->getField('situacao_do_associado');

		$query = $form->getFieldAttribute('filter_situacao_do_associado', 'query');
		$translate = $form->getFieldAttribute('filter_situacao_do_associado', 'translate');
		$key = $form->getFieldAttribute('filter_situacao_do_associado', 'key_field');
		$value = $form->getFieldAttribute('filter_situacao_do_associado', 'value_field');

		// Get the database object.
		$db = JFactory::getDbo();

		// Set the query and get the result list.
		$db->setQuery($query);
		$items = $db->loadObjectlist();

		// Build the field options.
		if (!empty($items)) {
			foreach ($items as $item) {
				if ($translate == true) {
					$options[] = JHtml::_('select.option', $item->$key, JText::_($item->$value));
				} else {
					$options[] = JHtml::_('select.option', $item->$key, $item->$value);
				}
			}
		}

		JHtmlSidebar::addFilter(
			'$Situacao_do_associado',
			'filter_situacao_do_associado',
			JHtml::_('select.options', $options, "value", "text", $this->state->get('filter.situacao_do_associado')),
			true
		);

	}

	/**
	 * Method to order fields
	 *
	 * @return void
	 */
	protected function getSortFields()
	{
		return array(
			'a.`id`' => JText::_('JGRID_HEADING_ID'),
			'a.`state`' => JText::_('JSTATUS'),
			'a.`state_anamatra`' => JText::_('COM_ASSOCIADOS_ASSOCIADOS_STATE_ANAMATRA'),
			'a.`state_amatra`' => JText::_('COM_ASSOCIADOS_ASSOCIADOS_STATE_AMATRA'),
			'a.`amatra`' => JText::_('COM_ASSOCIADOS_ASSOCIADOS_AMATRA'),
			'a.`nome`' => JText::_('COM_ASSOCIADOS_ASSOCIADOS_NOME'),
			'a.`cpf`' => JText::_('COM_ASSOCIADOS_ASSOCIADOS_CPF'),
			'a.`estado_civil`' => JText::_('COM_ASSOCIADOS_ASSOCIADOS_ESTADO_CIVIL'),
			'a.`estado`' => JText::_('COM_ASSOCIADOS_ASSOCIADOS_ESTADO'),
			'a.`cidade`' => JText::_('COM_ASSOCIADOS_ASSOCIADOS_CIDADE'),
			'a.`fone_comercial`' => JText::_('COM_ASSOCIADOS_ASSOCIADOS_FONE_COMERCIAL'),
			'a.`fone_celular`' => JText::_('COM_ASSOCIADOS_ASSOCIADOS_FONE_CELULAR'),
			'a.`receber_newsletter`' => JText::_('COM_ASSOCIADOS_ASSOCIADOS_RECEBER_NEWSLETTER'),
			'a.`receber_sms`' => JText::_('COM_ASSOCIADOS_ASSOCIADOS_RECEBER_SMS'),
		);
	}
}
