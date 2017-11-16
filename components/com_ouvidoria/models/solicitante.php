<?php

/**
 * @version    CVS: 1.0.3
 * @package    Com_Ouvidoria
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  2017 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
// No direct access.
defined('_JEXEC') or die;

jimport('joomla.application.component.modelitem');
jimport('joomla.event.dispatcher');

use Joomla\Utilities\ArrayHelper;

/**
 * Ouvidoria model.
 *
 * @since  1.6
 */
class OuvidoriaModelSolicitante extends JModelItem
{
	/**
	 * Method to auto-populate the model state.
	 *
	 * Note. Calling getState in this method will result in recursion.
	 *
	 * @return void
	 *
	 * @since    1.6
	 *
	 */
	protected function populateState()
	{
		$app  = JFactory::getApplication('com_ouvidoria');
		$user = JFactory::getUser();

		// Check published state
		if ((!$user->authorise('core.edit.state', 'com_ouvidoria')) && (!$user->authorise('core.edit', 'com_ouvidoria'))) {
			$this->setState('filter.published', 1);
			$this->setState('filter.archived', 2);
		}

		// Load state from the request userState on edit or from the passed variable on default
		if (JFactory::getApplication()->input->get('layout') == 'edit') {
			$id = JFactory::getApplication()->getUserState('com_ouvidoria.edit.solicitante.id');
		} else {
			$id = JFactory::getApplication()->input->get('id');
			JFactory::getApplication()->setUserState('com_ouvidoria.edit.solicitante.id', $id);
		}

		$this->setState('solicitante.id', $id);

		// Load the parameters.
		$params       = $app->getParams();
		$params_array = $params->toArray();

		if (isset($params_array['item_id'])) {
			$this->setState('solicitante.id', $params_array['item_id']);
		}

		$this->setState('params', $params);
	}

	/**
	 * Method to get an object.
	 *
	 * @param   integer $id The id of the object to get.
	 *
	 * @return  mixed    Object on success, false on failure.
	 */
	public function &getData($id = null)
	{
		if ($this->_item === null) {
			$this->_item = false;

			if (empty($id)) {
				$id = $this->getState('solicitante.id');
			}

			// Get a level row instance.
			$table = $this->getTable();

			// Attempt to load the row.
			if ($table->load($id)) {
				// Check published state.
				if ($published = $this->getState('filter.published')) {
					if (isset($table->state) && $table->state != $published) {
						throw new Exception(JText::_('COM_OUVIDORIA_ITEM_NOT_LOADED'), 403);
					}
				}

				// Convert the JTable to a clean JObject.
				$properties  = $table->getProperties(1);
				$this->_item = ArrayHelper::toObject($properties, 'JObject');
			}
		}


		if (isset($this->_item->created_by)) {
			$this->_item->created_by_name = JFactory::getUser($this->_item->created_by)->name;
		}

		if (isset($this->_item->modified_by)) {
			$this->_item->modified_by_name = JFactory::getUser($this->_item->modified_by)->name;
		}

		if (!empty($this->_item->id_associado)) {
			$this->_item->is_associado = !empty($this->_item->id_associado) ? 'SIM' : 'NÃO';

			$db = JFactory::getDbo();

			$query = $db->getQuery(true);

			$query
				->select('categories.title')
				->from($db->quoteName('#__associados', 'associado'))
				->join('LEFT', $db->quoteName('#__categories', 'categories') . ' ON (' . $db->quoteName('associado.amatra') . ' = ' . $db->quoteName('categories.id') . ')')
				->where($db->quoteName('associado.id') . ' = ' . $this->_item->id_associado);

			$this->_item->amatra = $db->setQuery($query)->loadResult();
		}

		if (isset($this->_item->id_associado) && $this->_item->id_associado != '') {

			if (is_object($this->_item->id_associado)) {
				$this->_item->id_associado = \Joomla\Utilities\ArrayHelper::fromObject($this->_item->id_associado);
			}
			$values = (is_array($this->_item->id_associado)) ? $this->_item->id_associado : explode(',', $this->_item->id_associado);

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

			$this->_item->id_associado = !empty($textValue) ? implode(', ', $textValue) : $this->_item->id_associado;

		}

		if (isset($this->_item->id_user) && $this->_item->id_user != '') {
			if (is_object($this->_item->id_user)) {
				$this->_item->id_user = \Joomla\Utilities\ArrayHelper::fromObject($this->_item->id_user);
			}
			$values = (is_array($this->_item->id_user)) ? $this->_item->id_user : explode(',', $this->_item->id_user);

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

			$this->_item->id_user = !empty($textValue) ? implode(', ', $textValue) : $this->_item->id_user;

		}

		if (isset($this->_item->amatra) && $this->_item->amatra != '') {
			if (is_object($this->_item->amatra)) {
				$this->_item->amatra = ArrayHelper::fromObject($this->_item->amatra);
			}

			$values = (is_array($this->_item->amatra)) ? $this->_item->amatra : explode(',', $this->_item->amatra);

			$textValue = array();

			foreach ($values as $value) {
				$db    = JFactory::getDbo();
				$query = "SELECT id, title FROM anmt_categories WHERE extension = 'com_associados' AND id = '" . $value . "' ORDER BY FIELD(id, 99) DESC, 'title' ASC";

				$db->setQuery($query);
				$results = $db->loadObject();

				if ($results) {
					$textValue[] = $results->title;
				}
			}

			$this->_item->amatra = !empty($textValue) ? implode(', ', $textValue) : $this->_item->amatra;
		}

		return $this->_item;
	}

	/**
	 * Get an instance of JTable class
	 *
	 * @param   string $type   Name of the JTable class to get an instance of.
	 * @param   string $prefix Prefix for the table class name. Optional.
	 * @param   array  $config Array of configuration values for the JTable object. Optional.
	 *
	 * @return  JTable|bool JTable if success, false on failure.
	 */
	public function getTable($type = 'Solicitante', $prefix = 'OuvidoriaTable', $config = array())
	{
		$this->addTablePath(JPATH_ADMINISTRATOR . '/components/com_ouvidoria/tables');

		return JTable::getInstance($type, $prefix, $config);
	}

	/**
	 * Get the id of an item by alias
	 *
	 * @param   string $alias Item alias
	 *
	 * @return  mixed
	 */
	public function getItemIdByAlias($alias)
	{
		$table      = $this->getTable();
		$properties = $table->getProperties();
		$result     = null;

		if (key_exists('alias', $properties)) {
			$table->load(array('alias' => $alias));
			$result = $table->id;
		}

		return $result;
	}

	/**
	 * Method to check in an item.
	 *
	 * @param   integer $id The id of the row to check out.
	 *
	 * @return  boolean True on success, false on failure.
	 *
	 * @since    1.6
	 */
	public function checkin($id = null)
	{
		// Get the id.
		$id = (!empty($id)) ? $id : (int)$this->getState('solicitante.id');

		if ($id) {
			// Initialise the table
			$table = $this->getTable();

			// Attempt to check the row in.
			if (method_exists($table, 'checkin')) {
				if (!$table->checkin($id)) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Method to check out an item for editing.
	 *
	 * @param   integer $id The id of the row to check out.
	 *
	 * @return  boolean True on success, false on failure.
	 *
	 * @since    1.6
	 */
	public function checkout($id = null)
	{
		// Get the user id.
		$id = (!empty($id)) ? $id : (int)$this->getState('solicitante.id');

		if ($id) {
			// Initialise the table
			$table = $this->getTable();

			// Get the current user object.
			$user = JFactory::getUser();

			// Attempt to check the row out.
			if (method_exists($table, 'checkout')) {
				if (!$table->checkout($user->get('id'), $id)) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Get the name of a category by id
	 *
	 * @param   int $id Category id
	 *
	 * @return  Object|null    Object if success, null in case of failure
	 */
	public function getCategoryName($id)
	{
		$db    = JFactory::getDbo();
		$query = $db->getQuery(true);
		$query
			->select('title')
			->from('#__categories')
			->where('id = ' . $id);
		$db->setQuery($query);

		return $db->loadObject();
	}

	/**
	 * Publish the element
	 *
	 * @param   int $id    Item id
	 * @param   int $state Publish state
	 *
	 * @return  boolean
	 */
	public function publish($id, $state)
	{
		$table = $this->getTable();
		$table->load($id);
		$table->state = $state;

		return $table->store();
	}

	/**
	 * Method to delete an item
	 *
	 * @param   int $id Element id
	 *
	 * @return  bool
	 */
	public function delete($id)
	{
		$table = $this->getTable();

		return $table->delete($id);
	}


}
