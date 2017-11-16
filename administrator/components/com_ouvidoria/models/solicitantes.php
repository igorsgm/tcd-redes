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
class OuvidoriaModelSolicitantes extends JModelList
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
				'nome', 'a.`nome`',
				'email', 'a.`email`',
				'cpf', 'a.`cpf`',
				'telefone', 'a.`telefone`',
				'id_associado', 'a.`id_associado`',
				'id_user', 'a.`id_user`',
				'is_associado', 'a.`is_associado`',
				'amatra', 'a.`amatra`',
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

		// Load the parameters.
		$params = JComponentHelper::getParams('com_ouvidoria');
		$this->setState('params', $params);

		// List state information.
		parent::populateState('a.nome', 'asc');
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
		$query->from('`#__ouvidoria_solicitantes` AS a');

		// Join over the users for the checked out user
		$query->select("uc.name AS uEditor");
		$query->join("LEFT", "#__users AS uc ON uc.id=a.checked_out");

		// Join over the user field 'created_by'
		$query->select('`created_by`.name AS `created_by`');
		$query->join('LEFT', '#__users AS `created_by` ON `created_by`.id = a.`created_by`');

		// Join over the user field 'modified_by'
		$query->select('`modified_by`.name AS `modified_by`');
		$query->join('LEFT', '#__users AS `modified_by` ON `modified_by`.id = a.`modified_by`');

		// Join over the foreign key 'id_associado'
		$query->select('`#__associados_2813726`.`nome` AS associados_fk_value_2813726');
		$query->join('LEFT', '#__associados AS #__associados_2813726 ON #__associados_2813726.`id` = a.`id_associado`');

		// Join over the foreign key 'id_user'
		$query->select('`#__users_2814075`.`name` AS users_fk_value_2814075');
		$query->join('LEFT', '#__users AS #__users_2814075 ON #__users_2814075.`id` = a.`id_user`');

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
				$query->where('( a.nome LIKE ' . $search . '  OR  a.email LIKE ' . $search . '  OR  a.cpf LIKE ' . $search . ' )');
			}
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

			if (isset($oneItem->id_associado)) {

				$amatra = ThomisticusHelperModel::select('#__associados', 'amatra', ['id' => $oneItem->id_associado], 'Result');
				$oneItem->amatra = ThomisticusHelperModel::select('#__categories', 'title', ['id' => $amatra], 'Result');

				$values    = explode(',', $oneItem->id_associado);
				$textValue = array();

				foreach ($values as $value) {
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__associados_2813726`.`nome`')
						->from($db->quoteName('#__associados', '#__associados_2813726'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->nome;
					}
				}

				$oneItem->id_associado = !empty($textValue) ? implode(', ', $textValue) : $oneItem->id_associado;
			}

			if (isset($oneItem->id_user)) {
				$values    = explode(',', $oneItem->id_user);
				$textValue = array();

				foreach ($values as $value) {
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__users_2814075`.`name`')
						->from($db->quoteName('#__users', '#__users_2814075'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));

					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results) {
						$textValue[] = $results->name;
					}
				}

				$oneItem->id_user = !empty($textValue) ? implode(', ', $textValue) : $oneItem->id_user;
			}
		}

		return $items;
	}
}
