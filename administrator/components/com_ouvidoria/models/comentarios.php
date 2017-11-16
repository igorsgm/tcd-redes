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
class OuvidoriaModelComentarios extends JModelList
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
				'id',
				'a.`id`',
				'ordering',
				'a.`ordering`',
				'state',
				'a.`state`',
				'created_by',
				'a.`created_by`',
				'created_by_solicitante',
				'a.`created_by_solicitante`',
				'id_user_consultado',
				'a.`id_user_consultado`',
				'modified_by',
				'a.`modified_by`',
				'updated_at',
				'a.`updated_at`',
				'created_at',
				'a.`created_at`',
				'id_solicitacao',
				'a.`id_solicitacao`',
				'anexo',
				'a.`anexo`',
				'texto',
				'a.`texto`',
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
		// Filtering created_by_solicitante
		$this->setState('filter.created_by_solicitante', $app->getUserStateFromRequest($this->context . '.filter.created_by_solicitante', 'filter_created_by_solicitante', '', 'string'));

		// Filtering id_user_consultado
		$this->setState('filter.id_user_consultado', $app->getUserStateFromRequest($this->context . '.filter.id_user_consultado', 'filter_id_user_consultado', '', 'string'));

		// Filtering created_at
		$this->setState('filter.created_at.from', $app->getUserStateFromRequest($this->context . '.filter.created_at.from', 'filter_from_created_at', '', 'string'));
		$this->setState('filter.created_at.to', $app->getUserStateFromRequest($this->context . '.filter.created_at.to', 'filter_to_created_at', '', 'string'));

		// Filtering id_solicitacao
		$this->setState('filter.id_solicitacao', $app->getUserStateFromRequest($this->context . '.filter.id_solicitacao', 'filter_id_solicitacao', '', 'string'));


		// Load the parameters.
		$params = JComponentHelper::getParams('com_ouvidoria');
		$this->setState('params', $params);

		// List state information.
		parent::populateState('a.created_by_solicitante', 'asc');
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
		$query->from('`#__ouvidoria_comentarios` AS a');

		// Join over the users for the checked out user
		$query->select("uc.name AS uEditor");
		$query->join("LEFT", "#__users AS uc ON uc.id=a.checked_out");

		// Join over the user field 'created_by'
		$query->select('`created_by`.name AS `created_by`');
		$query->join('LEFT', '#__users AS `created_by` ON `created_by`.id = a.`created_by`');
		// Join over the foreign key 'created_by_solicitante'
		$query->select('`#__ouvidoria_solicitantes_2814574`.`nome` AS solicitantes_fk_value_2814574');
		$query->join('LEFT', '#__ouvidoria_solicitantes AS #__ouvidoria_solicitantes_2814574 ON #__ouvidoria_solicitantes_2814574.`id` = a.`created_by_solicitante`');
		// Join over the foreign key 'id_user_consultado'
		$query->select('`#__users_2814578`.`name` AS users_fk_value_2814578');
		$query->join('LEFT', '#__users AS #__users_2814578 ON #__users_2814578.`id` = a.`id_user_consultado`');

		// Join over the user field 'modified_by'
		$query->select('`modified_by`.name AS `modified_by`');
		$query->join('LEFT', '#__users AS `modified_by` ON `modified_by`.id = a.`modified_by`');
		// Join over the foreign key 'id_solicitacao'
		$query->select('`#__ouvidoria_solicitacoes_2814573`.`protocolo` AS solicitacoes_fk_value_2814573');
		$query->join('LEFT', '#__ouvidoria_solicitacoes AS #__ouvidoria_solicitacoes_2814573 ON #__ouvidoria_solicitacoes_2814573.`id` = a.`id_solicitacao`');

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
				$query->where('(#__ouvidoria_solicitantes_2814574.nome LIKE ' . $search . '  OR #__users_2814578.name LIKE ' . $search . '  OR  a.created_at LIKE ' . $search . '  OR #__ouvidoria_solicitacoes_2814573.protocolo LIKE ' . $search . ' )');
			}
		}


		// Filtering created_by_solicitante
		$filter_created_by_solicitante = $this->state->get("filter.created_by_solicitante");

		if ($filter_created_by_solicitante !== null && !empty($filter_created_by_solicitante)) {
			$query->where("a.`created_by_solicitante` = '" . $db->escape($filter_created_by_solicitante) . "'");
		}

		// Filtering id_user_consultado
		$filter_id_user_consultado = $this->state->get("filter.id_user_consultado");

		if ($filter_id_user_consultado !== null && !empty($filter_id_user_consultado)) {
			$query->where("a.`id_user_consultado` = '" . $db->escape($filter_id_user_consultado) . "'");
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

		// Filtering id_solicitacao
		$filter_id_solicitacao = $this->state->get("filter.id_solicitacao");

		if ($filter_id_solicitacao !== null && !empty($filter_id_solicitacao)) {
			$query->where("a.`id_solicitacao` = '" . $db->escape($filter_id_solicitacao) . "'");
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

			if (isset($oneItem->created_by_solicitante)) {
				$values    = explode(',', $oneItem->created_by_solicitante);
				$textValue = array();

				foreach ($values as $value) {
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__ouvidoria_solicitantes_2814574`.`nome`')
						->from($db->quoteName('#__ouvidoria_solicitantes', '#__ouvidoria_solicitantes_2814574'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->nome;
					}
				}

				$oneItem->created_by_solicitante = !empty($textValue) ? implode(', ', $textValue) : $oneItem->created_by_solicitante;
			}

			if (isset($oneItem->id_user_consultado)) {
				$values    = explode(',', $oneItem->id_user_consultado);
				$textValue = array();

				foreach ($values as $value) {
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__users_2814578`.`name`')
						->from($db->quoteName('#__users', '#__users_2814578'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->name;
					}
				}

				$oneItem->id_user_consultado = !empty($textValue) ? implode(', ', $textValue) : $oneItem->id_user_consultado;
			}

			if (isset($oneItem->id_solicitacao)) {
				$values    = explode(',', $oneItem->id_solicitacao);
				$textValue = array();

				foreach ($values as $value) {
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__ouvidoria_solicitacoes_2814573`.`protocolo`')
						->from($db->quoteName('#__ouvidoria_solicitacoes', '#__ouvidoria_solicitacoes_2814573'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->protocolo;
					}
				}

				$oneItem->id_solicitacao = !empty($textValue) ? implode(', ', $textValue) : $oneItem->id_solicitacao;
			}
		}

		return $items;
	}
}
