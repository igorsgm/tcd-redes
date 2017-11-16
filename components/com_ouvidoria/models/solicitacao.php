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
class OuvidoriaModelSolicitacao extends JModelItem
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
			$id = JFactory::getApplication()->getUserState('com_ouvidoria.edit.solicitacao.id');
		} else {
			$id = JFactory::getApplication()->input->get('id');
			JFactory::getApplication()->setUserState('com_ouvidoria.edit.solicitacao.id', $id);
		}

		$this->setState('solicitacao.id', $id);

		// Load the parameters.
		$params       = $app->getParams();
		$params_array = $params->toArray();

		if (isset($params_array['item_id'])) {
			$this->setState('solicitacao.id', $params_array['item_id']);
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
		if ($this->_item === null || !empty($id)) {
			$this->_item = false;

			if (empty($id)) {
				$id = $this->getState('solicitacao.id');
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

		if (isset($this->_item->id_solicitante) && $this->_item->id_solicitante != '') {
			if (is_object($this->_item->id_solicitante)) {
				$this->_item->id_solicitante = \Joomla\Utilities\ArrayHelper::fromObject($this->_item->id_solicitante);
			}
			$values = (is_array($this->_item->id_solicitante)) ? $this->_item->id_solicitante : explode(',', $this->_item->id_solicitante);

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

			$this->_item->id_solicitante = !empty($textValue) ? implode(', ', $textValue) : $this->_item->id_solicitante;

		}

		if (isset($this->_item->id_tipo) && $this->_item->id_tipo != '') {
			if (is_object($this->_item->id_tipo)) {
				$this->_item->id_tipo = \Joomla\Utilities\ArrayHelper::fromObject($this->_item->id_tipo);
			}
			$values = (is_array($this->_item->id_tipo)) ? $this->_item->id_tipo : explode(',', $this->_item->id_tipo);

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

			$this->_item->id_tipo = !empty($textValue) ? implode(', ', $textValue) : $this->_item->id_tipo;

		}

		if (isset($this->_item->id_diretoria_responsavel) && $this->_item->id_diretoria_responsavel != '') {
			if (is_object($this->_item->id_diretoria_responsavel)) {
				$this->_item->id_diretoria_responsavel = \Joomla\Utilities\ArrayHelper::fromObject($this->_item->id_diretoria_responsavel);
			}
			$values = (is_array($this->_item->id_diretoria_responsavel)) ? $this->_item->id_diretoria_responsavel : explode(',', $this->_item->id_diretoria_responsavel);

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

			$this->_item->id_diretoria_responsavel = !empty($textValue) ? implode(', ', $textValue) : $this->_item->id_diretoria_responsavel;

		}

		if (isset($this->_item->status) && $this->_item->status != '') {

			$this->_item->statusClass = ThomisticusHelperModel::select('#__ouvidoria_solicitacoes_status', 'class', ['id' => $this->_item->status], 'Result');

			if (is_object($this->_item->status)) {
				$this->_item->status = \Joomla\Utilities\ArrayHelper::fromObject($this->_item->status);
			}
			$values = (is_array($this->_item->status)) ? $this->_item->status : explode(',', $this->_item->status);

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

			$this->_item->status = !empty($textValue) ? implode(', ', $textValue) : $this->_item->status;
		}

		if (isset($this->_item->id_user_responsavel_atual) && $this->_item->id_user_responsavel_atual != '') {
			if (is_object($this->_item->id_user_responsavel_atual)) {
				$this->_item->id_user_responsavel_atual = \Joomla\Utilities\ArrayHelper::fromObject($this->_item->id_user_responsavel_atual);
			}
			$values = (is_array($this->_item->id_user_responsavel_atual)) ? $this->_item->id_user_responsavel_atual : explode(',', $this->_item->id_user_responsavel_atual);

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

			$this->_item->id_user_responsavel_atual = !empty($textValue) ? implode(', ', $textValue) : $this->_item->id_user_responsavel_atual;

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
	public function getTable($type = 'Solicitacao', $prefix = 'OuvidoriaTable', $config = array())
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
		$id = (!empty($id)) ? $id : (int)$this->getState('solicitacao.id');

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
		$id = (!empty($id)) ? $id : (int)$this->getState('solicitacao.id');

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
