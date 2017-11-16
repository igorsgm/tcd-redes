<?php
/**
 * @version    CVS: 1.0.0
 * @package    Com_Restful
 * @author     Igor Moraes <igor.sgm@gmail.com>
 * @copyright  2016 Igor Moraes
 * @license    GNU General Public License
 */

// No direct access.
defined('_JEXEC') or die;

jimport('joomla.application.component.modeladmin');
require_once(JPATH_ROOT . '/ws/Config.inc.php');
require_once(JPATH_ROOT . '/ws/database/Trigger.php');

/**
 * Restful model.
 *
 * @since  1.6
 */
class RestfulModelExternalsender extends JModelAdmin
{
	/**
	 * @var    string    Alias to manage history control
	 * @since   3.2
	 */
	public $typeAlias = 'com_restful.externalsender';
	/**
	 * @var      string    The prefix to use with controller messages.
	 * @since    1.6
	 */
	protected $text_prefix = 'COM_RESTFUL';
	/**
	 * @var null  Item data
	 * @since  1.6
	 */
	protected $item = null;

	/**
	 * Method to get the record form.
	 *
	 * @param   array $data An optional array of data for the form to interogate.
	 * @param   boolean $loadData True if the form is to load its own data (default case), false if not.
	 *
	 * @return  JForm  A JForm object on success, false on failure
	 *
	 * @since    1.6
	 */
	public function getForm($data = array(), $loadData = true)
	{
		// Initialise variables.
		$app = JFactory::getApplication();

		// Get the form.
		$form = $this->loadForm(
			'com_restful.externalsender', 'externalsender',
			array(
				'control' => 'jform',
				'load_data' => $loadData
			)
		);

		if (empty($form)) {
			return false;
		}

		return $form;
	}

	/**
	 * Method to duplicate an Externalsender
	 *
	 * @param   array &$pks An array of primary key IDs.
	 *
	 * @return  boolean  True if successful.
	 *
	 * @throws  Exception
	 */
	public function duplicate(&$pks)
	{
		$user = JFactory::getUser();

		// Access checks.
		if (!$user->authorise('core.create', 'com_restful')) {
			throw new Exception(JText::_('JERROR_CORE_CREATE_NOT_PERMITTED'));
		}

		$dispatcher = JEventDispatcher::getInstance();
		$context = $this->option . '.' . $this->name;

		// Include the plugins for the save events.
		JPluginHelper::importPlugin($this->events_map['save']);

		$table = $this->getTable();

		foreach ($pks as $pk) {
			if ($table->load($pk, true)) {
				// Reset the id to create a new record.
				$table->id = 0;

				if (!$table->check()) {
					throw new Exception($table->getError());
				}


				// Trigger the before save event.
				$result = $dispatcher->trigger($this->event_before_save, array($context, &$table, true));

				if (in_array(false, $result, true) || !$table->store()) {
					throw new Exception($table->getError());
				}

				// Trigger the after save event.
				$dispatcher->trigger($this->event_after_save, array($context, &$table, true));
			} else {
				throw new Exception($table->getError());
			}
		}

		// Clean cache
		$this->cleanCache();

		return true;
	}

	/**
	 * Returns a reference to the a Table object, always creating it.
	 *
	 * @param   string $type The table type to instantiate
	 * @param   string $prefix A prefix for the table class name. Optional.
	 * @param   array $config Configuration array for model. Optional.
	 *
	 * @return    JTable    A database object
	 *
	 * @since    1.6
	 */
	public function getTable($type = 'Externalsender', $prefix = 'RestfulTable', $config = array())
	{
		return JTable::getInstance($type, $prefix, $config);
	}

	/**
	 * Method to get the data that should be injected in the form.
	 *
	 * @return   mixed  The data for the form.
	 *
	 * @since    1.6
	 */
	protected function loadFormData()
	{
		// Check the session for previously entered form data.
		$data = JFactory::getApplication()->getUserState('com_restful.edit.externalsender.data', array());

		if (empty($data)) {
			if ($this->item === null) {
				$this->item = $this->getItem();
			}

			$data = $this->item;
		}

		return $data;
	}

	/**
	 * Method to get a single record.
	 *
	 * @param   integer $pk The id of the primary key.
	 *
	 * @return  mixed    Object on success, false on failure.
	 *
	 * @since    1.6
	 */
	public function getItem($pk = null)
	{
		if ($item = parent::getItem($pk)) {
			// Do any procesing on fields here if needed
		}

		return $item;
	}

	/**
	 * Prepare and sanitise the table prior to saving.
	 *
	 * @param   JTable $table Table Object
	 *
	 * @return void
	 *
	 * @since    1.6
	 */
	protected function prepareTable($table)
	{
		jimport('joomla.filter.output');
		if (empty($table->id)) {
			// If it is a new external sender register, create triggers
			$this->triggerOperation('create', $table->table);
			// Set ordering to the last item if not set
			if (@$table->ordering === '') {
				$db = JFactory::getDbo();
				$db->setQuery('SELECT MAX(ordering) FROM #__restful_external_senders');
				$max = $db->loadResult();
				$table->ordering = $max + 1;
			}
		}
	}

	/**
	 * Create or Drop triggers of three events: INSERT UPDATE and Delete
	 * @param string $task = create or drop
	 * @param string $table = table that the trigger is associated
	 *
	 */
	public function triggerOperation($task, $table)
	{
		$trigger = new Trigger();

		$events = ['INSERT', 'UPDATE'];

		foreach ($events as $event) {
			$task == 'drop' ? $trigger->drop("on{$event}{$table}")
				: $trigger->create($table, $trigger->generateName($event, $table), $event);
		}
	}


	/**
	 * Delete triggers associated to the external senders that will be deleted
	 * @param array $externalSendersIds = array of externalsenders primary keys (integers) that will be deleted
	 */
	public function deleteTriggers($externalSendersIds)
	{
		foreach ($externalSendersIds as $key => $id) {
			$table = $this->getExternalSenderTable($id);
			$this->triggerOperation('drop', $table);
		}
	}


	/**
	 * Retrieves the external sender's table name by its primary key
	 * @param $id = External sender's ID
	 *
	 * @return string = external sender table name
	 */
	private function getExternalSenderTable($id)
	{
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);

		$query->select($db->quoteName('table'))->from('#__restful_external_senders')->where('id = ' . $id);

		return $db->setQuery($query)->loadResult();
	}
}
