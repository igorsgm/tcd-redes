<?php

/**
 * @version    CVS: 1.0.3
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
				'id', 'a.`id`',
				'ordering', 'a.`ordering`',
				'state', 'a.`state`',
				'created_by', 'a.`created_by`',
				'modified_by', 'a.`modified_by`',
				'updated_at', 'a.`updated_at`',
				'created_at', 'a.`created_at`',
				'id_solicitante', 'a.`id_solicitante`',
				'id_tipo', 'a.`id_tipo`',
				'id_diretoria_responsavel', 'a.`id_diretoria_responsavel`',
				'texto', 'a.`texto`',
				'anexo', 'a.`anexo`',
				'protocolo', 'a.`protocolo`',
				'status', 'a.`status`',
				'id_user_responsavel_atual', 'a.`id_user_responsavel_atual`',
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
	 */
	protected function populateState($ordering = null, $direction = null)
	{
		// Initialise variables.
		$app = JFactory::getApplication('administrator');

		// Load the filter state.
		$search = $app->getUserStateFromRequest($this->context . '.filter.search', 'filter_search');
		$this->setState('filter.search', $search);

		$published = $app->getUserStateFromRequest($this->context . '.filter.state', 'filter_published', '', 'string');
		$this->setState('filter.state', $published);
		// Filtering created_at
		$this->setState('filter.created_at.from', $app->getUserStateFromRequest($this->context . '.filter.created_at.from', 'filter_from_created_at', '', 'string'));
		$this->setState('filter.created_at.to', $app->getUserStateFromRequest($this->context . '.filter.created_at.to', 'filter_to_created_at', '', 'string'));

		// Filtering id_tipo
		$this->setState('filter.id_tipo', $app->getUserStateFromRequest($this->context . '.filter.id_tipo', 'filter_id_tipo', '', 'string'));

		// Filtering id_diretoria_responsavel
		$this->setState('filter.id_diretoria_responsavel', $app->getUserStateFromRequest($this->context . '.filter.id_diretoria_responsavel', 'filter_id_diretoria_responsavel', '', 'string'));

		// Filtering status
		$this->setState('filter.status', $app->getUserStateFromRequest($this->context . '.filter.status', 'filter_status', '', 'string'));


		// Load the parameters.
		$params = JComponentHelper::getParams('com_ouvidoria');
		$this->setState('params', $params);

		// List state information.
		parent::populateState('a.created_at', 'asc');
	}

	/**
	 * Method to get a store id based on model configuration state.
	 *
	 * This is necessary because the model is used by the component and
	 * different modules that might need different sets of data or different
	 * ordering requirements.
	 *
	 * @param   string $id A prefix for the store id.
	 *
	 * @return   string A store id.
	 *
	 * @since    1.6
	 */
	protected function getStoreId($id = '')
	{
		// Compile the store id.
		$id .= ':' . $this->getState('filter.search');
		$id .= ':' . $this->getState('filter.state');

		return parent::getStoreId($id);
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
		$query->select(
			$this->getState(
				'list.select', 'DISTINCT a.*'
			)
		);
		$query->from('`#__ouvidoria_solicitacoes` AS a');

		// Join over the users for the checked out user
		$query->select("uc.name AS uEditor");
		$query->join("LEFT", "#__users AS uc ON uc.id=a.checked_out");

		// Join over the user field 'created_by'
		$query->select('`created_by`.name AS `created_by`');
		$query->join('LEFT', '#__users AS `created_by` ON `created_by`.id = a.`created_by`');

		// Join over the user field 'modified_by'
		$query->select('`modified_by`.name AS `modified_by`');
		$query->join('LEFT', '#__users AS `modified_by` ON `modified_by`.id = a.`modified_by`');
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

		// Filter by published state
		$published = $this->getState('filter.state');

		if (is_numeric($published)) {
			$query->where('a.state = ' . (int)$published);
		} elseif ($published === '') {
			$query->where('(a.state IN (0, 1))');
		}

		// Filter by search in title
		$search = $this->getState('filter.search');

		if (!empty($search)) {
			if (stripos($search, 'id:') === 0) {
				$query->where('a.id = ' . (int)substr($search, 3));
			} else {
				$search = $db->Quote('%' . $db->escape($search, true) . '%');
				$query->where('( a.created_at LIKE ' . $search . '  OR #__ouvidoria_solicitacoes_tipos_2813767.nome LIKE ' . $search . '  OR #__ouvidoria_diretorias_2814031.nome LIKE ' . $search . '  OR  a.texto LIKE ' . $search . '  OR  a.protocolo LIKE ' . $search . '  OR #__ouvidoria_solicitacoes_status_2814073.nome LIKE ' . $search . ' )');
			}
		}


		// Filtering created_at
		$filter_created_at_from = $this->state->get("filter.created_at.from");

		if ($filter_created_at_from !== null && !empty($filter_created_at_from)) {
			$query->where("a.`created_at` >= '" . $db->escape($filter_created_at_from) . "'");
		}
		$filter_created_at_to = $this->state->get("filter.created_at.to");

		if ($filter_created_at_to !== null && !empty($filter_created_at_to)) {
			$query->where("a.`created_at` <= '" . $db->escape($filter_created_at_to) . "'");
		}

		// Filtering id_tipo
		$filter_id_tipo = $this->state->get("filter.id_tipo");

		if ($filter_id_tipo !== null && !empty($filter_id_tipo)) {
			$query->where("a.`id_tipo` = '" . $db->escape($filter_id_tipo) . "'");
		}

		// Filtering id_diretoria_responsavel
		$filter_id_diretoria_responsavel = $this->state->get("filter.id_diretoria_responsavel");

		if ($filter_id_diretoria_responsavel !== null && !empty($filter_id_diretoria_responsavel)) {
			$query->where("a.`id_diretoria_responsavel` = '" . $db->escape($filter_id_diretoria_responsavel) . "'");
		}

		// Filtering status
		$filter_status = $this->state->get("filter.status");

		if ($filter_status !== null && !empty($filter_status)) {
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
	 * Get an array of data items
	 *
	 * @return mixed Array of data items on success, false on failure.
	 */
	public function getItems()
	{
		$items = parent::getItems();

		foreach ($items as $oneItem) {

			if (isset($oneItem->id_solicitante)) {
				$values    = explode(',', $oneItem->id_solicitante);
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

				$oneItem->id_solicitante = !empty($textValue) ? implode(', ', $textValue) : $oneItem->id_solicitante;
			}

			if (isset($oneItem->id_tipo)) {
				$values    = explode(',', $oneItem->id_tipo);
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

				$oneItem->id_tipo = !empty($textValue) ? implode(', ', $textValue) : $oneItem->id_tipo;
			}

			if (isset($oneItem->id_diretoria_responsavel)) {
				$values    = explode(',', $oneItem->id_diretoria_responsavel);
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

				$oneItem->id_diretoria_responsavel = !empty($textValue) ? implode(', ', $textValue) : $oneItem->id_diretoria_responsavel;
			}

			if (isset($oneItem->status)) {
				$values    = explode(',', $oneItem->status);
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

				$oneItem->status = !empty($textValue) ? implode(', ', $textValue) : $oneItem->status;
			}

			if (isset($oneItem->id_user_responsavel_atual)) {
				$values    = explode(',', $oneItem->id_user_responsavel_atual);
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

				$oneItem->id_user_responsavel_atual = !empty($textValue) ? implode(', ', $textValue) : $oneItem->id_user_responsavel_atual;
			}
		}

		return $items;
	}
}
