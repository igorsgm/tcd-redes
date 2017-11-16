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
class OuvidoriaModelSolicitacoeslogs extends JModelList
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
				'updated_at',
				'a.`updated_at`',
				'created_at',
				'a.`created_at`',
				'id_solicitacao',
				'a.`id_solicitacao`',
				'id_interacao',
				'a.`id_interacao`',
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

		// Filtering id_solicitacao
		$this->setState('filter.id_solicitacao', $app->getUserStateFromRequest($this->context . '.filter.id_solicitacao', 'filter_id_solicitacao', '', 'string'));

		// Filtering id_interacao
		$this->setState('filter.id_interacao', $app->getUserStateFromRequest($this->context . '.filter.id_interacao', 'filter_id_interacao', '', 'string'));


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
		$query->from('`#__ouvidoria_solicitacoes_logs` AS a');


		// Join over the user field 'created_by'
		$query->select('`created_by`.name AS `created_by`');
		$query->join('LEFT', '#__users AS `created_by` ON `created_by`.id = a.`created_by`');
		// Join over the foreign key 'created_by_solicitante'
		$query->select('`#__ouvidoria_solicitantes_2814552`.`nome` AS solicitantes_fk_value_2814552');
		$query->join('LEFT', '#__ouvidoria_solicitantes AS #__ouvidoria_solicitantes_2814552 ON #__ouvidoria_solicitantes_2814552.`id` = a.`created_by_solicitante`');
		// Join over the foreign key 'id_solicitacao'
		$query->select('`#__ouvidoria_solicitacoes_2814550`.`protocolo` AS solicitacoes_fk_value_2814550');
		$query->join('LEFT', '#__ouvidoria_solicitacoes AS #__ouvidoria_solicitacoes_2814550 ON #__ouvidoria_solicitacoes_2814550.`id` = a.`id_solicitacao`');
		// Join over the foreign key 'id_interacao'
		$query->select('`#__ouvidoria_solicitacoes_interacoes_2814551`.`nome` AS solicitacoesinteracoes_fk_value_2814551');
		$query->join('LEFT', '#__ouvidoria_solicitacoes_interacoes AS #__ouvidoria_solicitacoes_interacoes_2814551 ON #__ouvidoria_solicitacoes_interacoes_2814551.`id` = a.`id_interacao`');

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
				$query->where('(#__ouvidoria_solicitantes_2814552.nome LIKE ' . $search . '  OR #__ouvidoria_solicitacoes_2814550.protocolo LIKE ' . $search . '  OR #__ouvidoria_solicitacoes_interacoes_2814551.nome LIKE ' . $search . ' )');
			}
		}


		// Filtering created_by_solicitante
		$filter_created_by_solicitante = $this->state->get("filter.created_by_solicitante");

		if ($filter_created_by_solicitante !== null && !empty($filter_created_by_solicitante)) {
			$query->where("a.`created_by_solicitante` = '" . $db->escape($filter_created_by_solicitante) . "'");
		}

		// Filtering id_solicitacao
		$filter_id_solicitacao = $this->state->get("filter.id_solicitacao");

		if ($filter_id_solicitacao !== null && !empty($filter_id_solicitacao)) {
			$query->where("a.`id_solicitacao` = '" . $db->escape($filter_id_solicitacao) . "'");
		}

		// Filtering id_interacao
		$filter_id_interacao = $this->state->get("filter.id_interacao");

		if ($filter_id_interacao !== null && !empty($filter_id_interacao)) {
			$query->where("a.`id_interacao` = '" . $db->escape($filter_id_interacao) . "'");
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
						->select('`#__ouvidoria_solicitantes_2814552`.`nome`')
						->from($db->quoteName('#__ouvidoria_solicitantes', '#__ouvidoria_solicitantes_2814552'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->nome;
					}
				}

				$oneItem->created_by_solicitante = !empty($textValue) ? implode(', ', $textValue) : $oneItem->created_by_solicitante;
			}

			if (isset($oneItem->id_solicitacao)) {
				$values    = explode(',', $oneItem->id_solicitacao);
				$textValue = array();

				foreach ($values as $value) {
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__ouvidoria_solicitacoes_2814550`.`protocolo`')
						->from($db->quoteName('#__ouvidoria_solicitacoes', '#__ouvidoria_solicitacoes_2814550'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->protocolo;
					}
				}

				$oneItem->id_solicitacao = !empty($textValue) ? implode(', ', $textValue) : $oneItem->id_solicitacao;
			}

			if (isset($oneItem->id_interacao)) {
				$values    = explode(',', $oneItem->id_interacao);
				$textValue = array();

				foreach ($values as $value) {
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__ouvidoria_solicitacoes_interacoes_2814551`.`nome`')
						->from($db->quoteName('#__ouvidoria_solicitacoes_interacoes', '#__ouvidoria_solicitacoes_interacoes_2814551'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->nome;
					}
				}

				$oneItem->id_interacao = !empty($textValue) ? implode(', ', $textValue) : $oneItem->id_interacao;
			}
		}

		return $items;
	}
}
