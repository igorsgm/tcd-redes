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
				'id',
				'a.id',
				'ordering',
				'a.ordering',
				'state',
				'a.state',
				'created_by',
				'a.created_by',
				'modified_by',
				'a.modified_by',
				'updated_at',
				'a.updated_at',
				'created_at',
				'a.created_at',
				'nome',
				'a.nome',
				'email',
				'a.email',
				'cpf',
				'a.cpf',
				'telefone',
				'a.telefone',
				'id_associado',
				'a.id_associado',
				'id_user',
				'a.id_user',
				'is_associado',
				'a.is_associado',
				'amatra',
				'a.amatra',
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

		$query->from('`#__ouvidoria_solicitantes` AS a');

		// Join over the users for the checked out user.
		$query->select('uc.name AS uEditor');
		$query->join('LEFT', '#__users AS uc ON uc.id=a.checked_out');

		// Join over the created by field 'created_by'
		$query->join('LEFT', '#__users AS created_by ON created_by.id = a.created_by');

		// Join over the created by field 'modified_by'
		$query->join('LEFT', '#__users AS modified_by ON modified_by.id = a.modified_by');
		// Join over the foreign key 'id_associado'
		$query->select('`#__associados_2813726`.`nome` AS associados_fk_value_2813726');
		$query->join('LEFT', '#__associados AS #__associados_2813726 ON #__associados_2813726.`id` = a.`id_associado`');
		// Join over the foreign key 'id_user'
		$query->select('`#__users_2814075`.`name` AS users_fk_value_2814075');
		$query->join('LEFT', '#__users AS #__users_2814075 ON #__users_2814075.`id` = a.`id_user`');

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
	 * Method to get an array of data items
	 *
	 * @return  mixed An array of data on success, false on failure.
	 */
	public function getItems()
	{
		$items = parent::getItems();

		foreach ($items as $item) {

			if (isset($item->id_associado)) {

				$values    = explode(',', $item->id_associado);
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

				$item->id_associado = !empty($textValue) ? implode(', ', $textValue) : $item->id_associado;
			}


			if (isset($item->id_user)) {

				$values    = explode(',', $item->id_user);
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

				$item->id_user = !empty($textValue) ? implode(', ', $textValue) : $item->id_user;
			}

			if (isset($item->amatra)) {
				$values    = explode(',', $item->amatra);
				$textValue = array();

				foreach ($values as $value) {
					if (!empty($value)) {
						$db    = JFactory::getDbo();
						$query = "SELECT id, title FROM anmt_categories WHERE extension = 'com_associados' AND id = '" . $value . "' ORDER BY FIELD(id, 99) DESC, 'title' ASC";

						$db->setQuery($query);
						$results = $db->loadObject();

						if ($results) {
							$textValue[] = $results->title;
						}
					}
				}

				$item->amatra = !empty($textValue) ? implode(', ', $textValue) : $item->amatra;
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
