<?php

/**
 * @version    CVS: 1.0.4
 * @package    Com_Ouvidoria
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  2017 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
defined('_JEXEC') or die;

jimport('joomla.application.component.modellist');

/**
 * Methods supporting a list of Ouvidoria records.
 *
 * @since  1.6
 */
class OuvidoriaModelSolicitacoes extends JModelList
{
	/**
	 * Constructor.
	 *
	 * @param   array $config An optional associative array of configuration settings.
	 *
	 * @see        JController
	 * @since      1.6
	 */
	public function __construct($config = array())
	{
		if (empty($config['filter_fields'])) {
			$config['filter_fields'] = array(
				'id', 'a.id',
				'ordering', 'a.ordering',
				'state', 'a.state',
				'created_by', 'a.created_by',
				'modified_by', 'a.modified_by',
				'updated_at', 'a.updated_at',
				'created_at', 'a.created_at',
				'id_solicitante', 'a.id_solicitante',
				'id_tipo', 'a.id_tipo',
				'id_diretoria_responsavel', 'a.id_diretoria_responsavel',
				'texto', 'a.texto',
				'anexo', 'a.anexo',
				'protocolo', 'a.protocolo',
				'status', 'a.status',
				'class', 'a.class',
				'id_user_responsavel_atual', 'a.id_user_responsavel_atual',
			);
		}

		parent::__construct($config);
	}

	/**
	 * Method to auto-populate the model state.
	 *
	 * Note. Calling getState in this method will result in recursion.
	 *
	 * @param   string $ordering  Elements order
	 * @param   string $direction Order direction
	 *
	 * @return void
	 *
	 * @throws Exception
	 *
	 * @since    1.6
	 */
	protected function populateState($ordering = null, $direction = null)
	{
		$app  = JFactory::getApplication();
		$list = $app->getUserState($this->context . '.list');

		$ordering  = isset($list['filter_order']) ? $list['filter_order'] : null;
		$direction = isset($list['filter_order_Dir']) ? $list['filter_order_Dir'] : null;

		$list['limit']     = (int)JFactory::getConfig()->get('list_limit', 20);
		$list['start']     = $app->input->getInt('start', 0);
		$list['ordering']  = $ordering;
		$list['direction'] = $direction;

		$app->setUserState($this->context . '.list', $list);
		$app->input->set('list', null);

		// List state information.
		parent::populateState($ordering, $direction);

		$app = JFactory::getApplication();

		$ordering  = $app->getUserStateFromRequest($this->context . '.ordercol', 'filter_order', $ordering);
		$direction = $app->getUserStateFromRequest($this->context . '.orderdirn', 'filter_order_Dir', $ordering);

		$this->setState('list.ordering', $ordering);
		$this->setState('list.direction', $direction);

		$start = $app->getUserStateFromRequest($this->context . '.limitstart', 'limitstart', 0, 'int');
		$limit = $app->getUserStateFromRequest($this->context . '.limit', 'limit', 0, 'int');

		if ($limit == 0) {
			$limit = $app->get('list_limit', 0);
		}

		$this->setState('list.limit', $limit);
		$this->setState('list.start', $start);
	}

	/**
	 * Build an SQL query to load the list data.
	 *
	 * @return   JDatabaseQuery
	 *
	 * @since    1.6
	 */
	protected function getListQuery()
	{
		// Create a new query object.
		$db    = $this->getDbo();
		$query = $db->getQuery(true);

		// Select the required fields from the table.
		$query
			->select(
				$this->getState(
					'list.select', 'DISTINCT a.*'
				)
			);

		$query->from('`#__ouvidoria_solicitacoes` AS a');

		// Join over the users for the checked out user.
		$query->select('uc.name AS uEditor');
		$query->join('LEFT', '#__users AS uc ON uc.id=a.checked_out');

		// Join over the created by field 'created_by'
		$query->join('LEFT', '#__users AS created_by ON created_by.id = a.created_by');

		// Join over the created by field 'modified_by'
		$query->join('LEFT', '#__users AS modified_by ON modified_by.id = a.modified_by');
		// Join over the foreign key 'id_solicitante'
		$query->select('`#__ouvidoria_solicitantes_2813755`.`nome` AS solicitantes_fk_value_2813755');
		$query->join('LEFT', '#__ouvidoria_solicitantes AS #__ouvidoria_solicitantes_2813755 ON #__ouvidoria_solicitantes_2813755.`id` = a.`id_solicitante`');
		// Join over the foreign key 'id_tipo'
		$query->select('`#__ouvidoria_solicitacoes_tipos_2813767`.`nome` AS solicitacoestipos_fk_value_2813767');
		$query->join('LEFT', '#__ouvidoria_solicitacoes_tipos AS #__ouvidoria_solicitacoes_tipos_2813767 ON #__ouvidoria_solicitacoes_tipos_2813767.`id` = a.`id_tipo`');
		// Join over the foreign key 'id_diretoria_responsavel'
		$query->select('`#__ouvidoria_diretorias_2814031`.`nome` AS diretorias_fk_value_2814031');
		$query->join('LEFT', '#__ouvidoria_diretorias AS #__ouvidoria_diretorias_2814031 ON #__ouvidoria_diretorias_2814031.`id` = a.`id_diretoria_responsavel`');
		// Join over the foreign key 'status'
		$query->select('`#__ouvidoria_solicitacoes_status_2814073`.`nome` AS solicitacoesstatus_fk_value_2814073');
		$query->join('LEFT', '#__ouvidoria_solicitacoes_status AS #__ouvidoria_solicitacoes_status_2814073 ON #__ouvidoria_solicitacoes_status_2814073.`id` = a.`status`');
		// Join over the foreign key 'id_user_responsavel_atual'
		$query->select('`#__users_2814074`.`name` AS users_fk_value_2814074');
		$query->join('LEFT', '#__users AS #__users_2814074 ON #__users_2814074.`id` = a.`id_user_responsavel_atual`');

		if (!JFactory::getUser()->authorise('core.edit', 'com_ouvidoria')) {
			$query->where('a.state = 1');
		}

		// Filter by search in title
		$search = $this->getState('filter.search');

		if (!empty($search)) {
			if (stripos($search, 'id:') === 0) {
				$query->where('a.id = ' . (int)substr($search, 3));
			} else {
				$search = $db->Quote('%' . $db->escape($search, true) . '%');
				$query->where('(#__users_2814074.name LIKE ' . $search . '  OR #__users_2814074.name LIKE ' . $search . '  OR  a.texto LIKE ' . $search . '  OR  a.protocolo LIKE ' . $search . '  OR #__users_2814074.name LIKE ' . $search . ' )');
			}
		}


		// Filtering created_at
		// Checking "_dateformat"
		$filter_created_at_from  = $this->state->get("filter.created_at_from_dateformat");
		$filter_Qcreated_at_from = (!empty($filter_created_at_from)) ? $this->isValidDate($filter_created_at_from) : null;

		if ($filter_Qcreated_at_from != null) {
			$query->where("a.created_at >= '" . $db->escape($filter_Qcreated_at_from) . "'");
		}

		$filter_created_at_to  = $this->state->get("filter.created_at_to_dateformat");
		$filter_Qcreated_at_to = (!empty($filter_created_at_to)) ? $this->isValidDate($filter_created_at_to) : null;

		if ($filter_Qcreated_at_to != null) {
			$query->where("a.created_at <= '" . $db->escape($filter_Qcreated_at_to) . "'");
		}

		// Filtering id_tipo
		$filter_id_tipo = $this->state->get("filter.id_tipo");

		if ($filter_id_tipo) {
			$query->where("a.`id_tipo` = '" . $db->escape($filter_id_tipo) . "'");
		}

		// Filtering id_diretoria_responsavel
		$filter_id_diretoria_responsavel = $this->state->get("filter.id_diretoria_responsavel");

		if ($filter_id_diretoria_responsavel) {
			$query->where("a.`id_diretoria_responsavel` = '" . $db->escape($filter_id_diretoria_responsavel) . "'");
		}

		// Filtering status
		$filter_status = $this->state->get("filter.status");

		if ($filter_status) {
			$query->where("a.`status` = '" . $db->escape($filter_status) . "'");
		}

		// Add the list ordering clause.
		$orderCol  = $this->state->get('list.ordering');
		$orderDirn = $this->state->get('list.direction');

		if ($orderCol && $orderDirn) {
			$query->order($db->escape($orderCol . ' ' . $orderDirn));
		}

		return $query;
	}

	/**
	 * Method to get an array of data items
	 *
	 * @return  mixed An array of data on success, false on failure.
	 */
	public function getItems()
	{
		$items = parent::getItems();

		foreach ($items as $item) {

			if (isset($item->id_solicitante)) {

				$values    = explode(',', $item->id_solicitante);
				$textValue = array();

				foreach ($values as $value) {
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__ouvidoria_solicitantes_2813755`.`nome`')
						->from($db->quoteName('#__ouvidoria_solicitantes', '#__ouvidoria_solicitantes_2813755'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->nome;
					}
				}

				$item->id_solicitante = !empty($textValue) ? implode(', ', $textValue) : $item->id_solicitante;
			}


			if (isset($item->id_tipo)) {

				$values    = explode(',', $item->id_tipo);
				$textValue = array();

				foreach ($values as $value) {
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__ouvidoria_solicitacoes_tipos_2813767`.`nome`')
						->from($db->quoteName('#__ouvidoria_solicitacoes_tipos', '#__ouvidoria_solicitacoes_tipos_2813767'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->nome;
					}
				}

				$item->id_tipo = !empty($textValue) ? implode(', ', $textValue) : $item->id_tipo;
			}


			if (isset($item->id_diretoria_responsavel)) {

				$values    = explode(',', $item->id_diretoria_responsavel);
				$textValue = array();

				foreach ($values as $value) {
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__ouvidoria_diretorias_2814031`.`nome`')
						->from($db->quoteName('#__ouvidoria_diretorias', '#__ouvidoria_diretorias_2814031'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->nome;
					}
				}

				$item->id_diretoria_responsavel = !empty($textValue) ? implode(', ', $textValue) : $item->id_diretoria_responsavel;
			}


			if (isset($item->status)) {

				$values    = explode(',', $item->status);
				$textValue = array();

				foreach ($values as $value) {
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__ouvidoria_solicitacoes_status_2814073`.`nome`')
						->from($db->quoteName('#__ouvidoria_solicitacoes_status', '#__ouvidoria_solicitacoes_status_2814073'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->nome;
					}
				}

				$item->status = !empty($textValue) ? implode(', ', $textValue) : $item->status;
			}


			if (isset($item->id_user_responsavel_atual)) {

				$values    = explode(',', $item->id_user_responsavel_atual);
				$textValue = array();

				foreach ($values as $value) {
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__users_2814074`.`name`')
						->from($db->quoteName('#__users', '#__users_2814074'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->name;
					}
				}

				$item->id_user_responsavel_atual = !empty($textValue) ? implode(', ', $textValue) : $item->id_user_responsavel_atual;

				if (empty($item->id_user_responsavel_atual)) {
					$item->id_user_responsavel_atual = $item->id_diretoria_responsavel;
				}

			}


		}

		return $items;
	}

	/**
	 * Overrides the default function to check Date fields format, identified by
	 * "_dateformat" suffix, and erases the field if it's not correct.
	 *
	 * @return void
	 */
	protected function loadFormData()
	{
		$app              = JFactory::getApplication();
		$filters          = $app->getUserState($this->context . '.filter', array());
		$error_dateformat = false;

		foreach ($filters as $key => $value) {
			if (strpos($key, '_dateformat') && !empty($value) && $this->isValidDate($value) == null) {
				$filters[$key]    = '';
				$error_dateformat = true;
			}
		}

		if ($error_dateformat) {
			$app->enqueueMessage(JText::_("COM_OUVIDORIA_SEARCH_FILTER_DATE_FORMAT"), "warning");
			$app->setUserState($this->context . '.filter', $filters);
		}

		return parent::loadFormData();
	}

	/**
	 * Checks if a given date is valid and in a specified format (YYYY-MM-DD)
	 *
	 * @param   string $date Date to be checked
	 *
	 * @return bool
	 */
	private function isValidDate($date)
	{
		$date = str_replace('/', '-', $date);

		return (date_create($date)) ? JFactory::getDate($date)->format("Y-m-d") : null;
	}
}
