<?php

/**
 * @version    CVS: 1.0.3
 * @package    Com_Ouvidoria
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  2017 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
// No direct access
defined('_JEXEC') or die;

JLoader::register('OuvidoriaHelper', JPATH_COMPONENT_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'helpers' . DIRECTORY_SEPARATOR . 'ouvidoria.php');

use Joomla\Utilities\ArrayHelper;
use Thomisticus\Utils\Date;

/**
 * solicitacao Table class
 *
 * @since  1.6
 */
class OuvidoriaTablesolicitacao extends JTable
{
	/**
	 * Check if a field is unique
	 *
	 * @param   string $field Name of the field
	 *
	 * @return bool True if unique
	 */
	private function isUnique($field)
	{
		$db    = JFactory::getDbo();
		$query = $db->getQuery(true);

		$query
			->select($db->quoteName($field))
			->from($db->quoteName($this->_tbl))
			->where($db->quoteName($field) . ' = ' . $db->quote($this->$field))
			->where($db->quoteName('id') . ' <> ' . (int)$this->{$this->_tbl_key});

		$db->setQuery($query);
		$db->execute();

		return ($db->getNumRows() == 0) ? true : false;
	}

	/**
	 * Constructor
	 *
	 * @param   JDatabase &$db A database connector object
	 */
	public function __construct(&$db)
	{
		JObserverMapper::addObserverClassToClass('JTableObserverContenthistory', 'OuvidoriaTablesolicitacao', array('typeAlias' => 'com_ouvidoria.solicitacao'));
		parent::__construct('#__ouvidoria_solicitacoes', 'id', $db);
	}

	/**
	 * Overloaded bind function to pre-process the params.
	 *
	 * @param   array $array  Named array
	 * @param   mixed $ignore Optional array or list of parameters to ignore
	 *
	 * @return  null|string  null is operation was satisfactory, otherwise returns an error
	 *
	 * @see     JTable:bind
	 * @since   1.5
	 */
	public function bind($array, $ignore = '')
	{
		$date = Date::getDate();
		$task = JFactory::getApplication()->input->get('task');

		$input = JFactory::getApplication()->input;
		$task  = $input->getString('task', '');

		if ($array['id'] == 0 && empty($array['created_by'])) {
			$array['created_by'] = JFactory::getUser()->id;
		}

		if ($array['id'] == 0 && empty($array['modified_by'])) {
			$array['modified_by'] = JFactory::getUser()->id;
		}

		if ($task == 'apply' || $task == 'save') {
			$array['modified_by'] = JFactory::getUser()->id;
		}

		if ($task == 'apply' || $task == 'save') {
			$array['updated_at'] = $date;
		}

		if ($array['id'] == 0) {
			$array['created_at'] = $date;
		}

		// Support for multiple or not foreign key field: id_solicitante
		if (!empty($array['id_solicitante'])) {
			if (is_array($array['id_solicitante'])) {
				$array['id_solicitante'] = implode(',', $array['id_solicitante']);
			} else {
				if (strrpos($array['id_solicitante'], ',') != false) {
					$array['id_solicitante'] = explode(',', $array['id_solicitante']);
				}
			}
		} else {
			$array['id_solicitante'] = '';
		}

		// Support for multiple or not foreign key field: id_tipo
		if (!empty($array['id_tipo'])) {
			if (is_array($array['id_tipo'])) {
				$array['id_tipo'] = implode(',', $array['id_tipo']);
			} else {
				if (strrpos($array['id_tipo'], ',') != false) {
					$array['id_tipo'] = explode(',', $array['id_tipo']);
				}
			}
		} else {
			$array['id_tipo'] = '';
		}

		// Support for multiple or not foreign key field: id_diretoria_responsavel
		if (!empty($array['id_diretoria_responsavel'])) {
			if (is_array($array['id_diretoria_responsavel'])) {
				$array['id_diretoria_responsavel'] = implode(',', $array['id_diretoria_responsavel']);
			} else {
				if (strrpos($array['id_diretoria_responsavel'], ',') != false) {
					$array['id_diretoria_responsavel'] = explode(',', $array['id_diretoria_responsavel']);
				}
			}
		} else {
			$array['id_diretoria_responsavel'] = '';
		}
		// Support for multi file field: anexo
		if (!empty($array['anexo'])) {
			if (is_array($array['anexo'])) {
				$array['anexo'] = implode(',', $array['anexo']);
			} elseif (strpos($array['anexo'], ',') != false) {
				$array['anexo'] = explode(',', $array['anexo']);
			}
		} else {
			$array['anexo'] = '';
		}


		// Support for multiple or not foreign key field: status
		if (!empty($array['status'])) {
			if (is_array($array['status'])) {
				$array['status'] = implode(',', $array['status']);
			} else {
				if (strrpos($array['status'], ',') != false) {
					$array['status'] = explode(',', $array['status']);
				}
			}
		} else {
			$array['status'] = '';
		}

		// Support for multiple or not foreign key field: id_user_responsavel_atual
		if (!empty($array['id_user_responsavel_atual'])) {
			if (is_array($array['id_user_responsavel_atual'])) {
				$array['id_user_responsavel_atual'] = implode(',', $array['id_user_responsavel_atual']);
			} else {
				if (strrpos($array['id_user_responsavel_atual'], ',') != false) {
					$array['id_user_responsavel_atual'] = explode(',', $array['id_user_responsavel_atual']);
				}
			}
		} else {
			$array['id_user_responsavel_atual'] = '';
		}

		if (isset($array['params']) && is_array($array['params'])) {
			$registry = new JRegistry;
			$registry->loadArray($array['params']);
			$array['params'] = (string)$registry;
		}

		if (isset($array['metadata']) && is_array($array['metadata'])) {
			$registry = new JRegistry;
			$registry->loadArray($array['metadata']);
			$array['metadata'] = (string)$registry;
		}

		if (!JFactory::getUser()->authorise('core.admin', 'com_ouvidoria.solicitacao.' . $array['id'])) {
			$actions         = JAccess::getActionsFromFile(
				JPATH_ADMINISTRATOR . '/components/com_ouvidoria/access.xml',
				"/access/section[@name='solicitacao']/"
			);
			$default_actions = JAccess::getAssetRules('com_ouvidoria.solicitacao.' . $array['id'])->getData();
			$array_jaccess   = array();

			foreach ($actions as $action) {
				if (key_exists($action->name, $default_actions)) {
					$array_jaccess[$action->name] = $default_actions[$action->name];
				}
			}

			$array['rules'] = $this->JAccessRulestoArray($array_jaccess);
		}

		// Bind the rules for ACL where supported.
		if (isset($array['rules']) && is_array($array['rules'])) {
			$this->setRules($array['rules']);
		}

		return parent::bind($array, $ignore);
	}

	/**
	 * This function convert an array of JAccessRule objects into an rules array.
	 *
	 * @param   array $jaccessrules An array of JAccessRule objects.
	 *
	 * @return  array
	 */
	private function JAccessRulestoArray($jaccessrules)
	{
		$rules = array();

		foreach ($jaccessrules as $action => $jaccess) {
			$actions = array();

			if ($jaccess) {
				foreach ($jaccess->getData() as $group => $allow) {
					$actions[$group] = ((bool)$allow);
				}
			}

			$rules[$action] = $actions;
		}

		return $rules;
	}

	/**
	 * Overloaded check function
	 *
	 * @return bool
	 */
	public function check()
	{
		// If there is an ordering column and this is a new row then get the next ordering value
		if (property_exists($this, 'ordering') && $this->id == 0) {
			$this->ordering = self::getNextOrder();
		}

		// Check if protocolo is unique
		if (!$this->isUnique('protocolo')) {
			throw new Exception('Your <b>protocolo</b> item "<b>' . $this->protocolo . '</b>" already exists');
		}

		// Support multi file field: anexo
		$app   = JFactory::getApplication();
		$files = $app->input->files->get('jform', array(), 'raw');
		$array = $app->input->get('jform', array(), 'ARRAY');

		if (isset($files['anexo']) && $files['anexo'][0]['size'] > 0) {
			// Deleting existing files
			$oldFiles = OuvidoriaHelper::getFiles($this->id, $this->_tbl, 'anexo');

			foreach ($oldFiles as $f) {
				$oldFile = JPATH_ROOT . '/media/com_ouvidoria/arquivos/solicitacoes/' . $f;

				if (file_exists($oldFile) && !is_dir($oldFile)) {
					unlink($oldFile);
				}
			}

			$this->anexo = "";

			foreach ($files['anexo'] as $singleFile) {
				jimport('joomla.filesystem.file');

				// Check if the server found any error.
				$fileError = $singleFile['error'];
				$message   = '';

				if ($fileError > 0 && $fileError != 4) {
					switch ($fileError) {
						case 1:
							$message = JText::_('File size exceeds allowed by the server');
							break;
						case 2:
							$message = JText::_('File size exceeds allowed by the html form');
							break;
						case 3:
							$message = JText::_('Partial upload error');
							break;
					}

					if ($message != '') {
						$app->enqueueMessage($message, 'warning');

						return false;
					}
				} elseif ($fileError == 4) {
					if (isset($array['anexo'])) {
						$this->anexo = $array['anexo'];
					}
				} else {
					// Check for filesize
					$fileSize = $singleFile['size'];

					if ($fileSize > 20971520) {
						$app->enqueueMessage('File bigger than 20MB', 'warning');

						return false;
					}

					// Replace any special characters in the filename
					jimport('joomla.filesystem.file');
					$filename  = Date::getDate() . '-' . JFile::stripExt($singleFile['name']);
					$extension  = JFile::getExt($singleFile['name']);
					$filename   = preg_replace("/[^A-Za-z0-9]/i", "-", $filename);
					$filename   = $filename . '.' . $extension;
					$uploadPath = JPATH_ROOT . '/media/com_ouvidoria/arquivos/solicitacoes/' . $filename;
					$fileTemp   = $singleFile['tmp_name'];

					if (!JFile::exists($uploadPath)) {
						if (!JFile::upload($fileTemp, $uploadPath)) {
							$app->enqueueMessage('Error moving file', 'warning');

							return false;
						}
					}

					$this->anexo .= (!empty($this->anexo)) ? "," : "";
					$this->anexo .= $filename;
				}
			}
		} else {
			$this->anexo .= isset($array['anexo_hidden']) ? $array['anexo_hidden'] : '';
		}

		return parent::check();
	}

	/**
	 * Method to set the publishing state for a row or list of rows in the database
	 * table.  The method respects checked out rows by other users and will attempt
	 * to checkin rows that it can after adjustments are made.
	 *
	 * @param   mixed   $pks      An optional array of primary key values to update.  If not
	 *                            set the instance property value is used.
	 * @param   integer $state    The publishing state. eg. [0 = unpublished, 1 = published]
	 * @param   integer $userId   The user id of the user performing the operation.
	 *
	 * @return   boolean  True on success.
	 *
	 * @since    1.0.4
	 *
	 * @throws Exception
	 */
	public function publish($pks = null, $state = 1, $userId = 0)
	{
		// Initialise variables.
		$k = $this->_tbl_key;

		// Sanitize input.
		ArrayHelper::toInteger($pks);
		$userId = (int)$userId;
		$state  = (int)$state;

		// If there are no primary keys set check to see if the instance key is set.
		if (empty($pks)) {
			if ($this->$k) {
				$pks = array($this->$k);
			} // Nothing to set publishing state on, return false.
			else {
				throw new Exception(500, JText::_('JLIB_DATABASE_ERROR_NO_ROWS_SELECTED'));
			}
		}

		// Build the WHERE clause for the primary keys.
		$where = $k . '=' . implode(' OR ' . $k . '=', $pks);

		// Determine if there is checkin support for the table.
		if (!property_exists($this, 'checked_out') || !property_exists($this, 'checked_out_time')) {
			$checkin = '';
		} else {
			$checkin = ' AND (checked_out = 0 OR checked_out = ' . (int)$userId . ')';
		}

		// Update the publishing state for rows with the given primary keys.
		$this->_db->setQuery(
			'UPDATE `' . $this->_tbl . '`' .
			' SET `state` = ' . (int)$state .
			' WHERE (' . $where . ')' .
			$checkin
		);
		$this->_db->execute();

		// If checkin is supported and all rows were adjusted, check them in.
		if ($checkin && (count($pks) == $this->_db->getAffectedRows())) {
			// Checkin each row.
			foreach ($pks as $pk) {
				$this->checkin($pk);
			}
		}

		// If the JTable instance value is in the list of primary keys that were set, set the instance.
		if (in_array($this->$k, $pks)) {
			$this->state = $state;
		}

		return true;
	}

	/**
	 * Define a namespaced asset name for inclusion in the #__assets table
	 *
	 * @return string The asset name
	 *
	 * @see JTable::_getAssetName
	 */
	protected function _getAssetName()
	{
		$k = $this->_tbl_key;

		return 'com_ouvidoria.solicitacao.' . (int)$this->$k;
	}

	/**
	 * Returns the parent asset's id. If you have a tree structure, retrieve the parent's id using the external key field
	 *
	 * @param   JTable  $table Table name
	 * @param   integer $id    Id
	 *
	 * @see JTable::_getAssetParentId
	 *
	 * @return mixed The id on success, false on failure.
	 */
	protected function _getAssetParentId(JTable $table = null, $id = null)
	{
		// We will retrieve the parent-asset from the Asset-table
		$assetParent = JTable::getInstance('Asset');

		// Default: if no asset-parent can be found we take the global asset
		$assetParentId = $assetParent->getRootId();

		// The item has the component as asset-parent
		$assetParent->loadByName('com_ouvidoria');

		// Return the found asset-parent-id
		if ($assetParent->id) {
			$assetParentId = $assetParent->id;
		}

		return $assetParentId;
	}

	/**
	 * Delete a record by id
	 *
	 * @param   mixed $pk Primary key value to delete. Optional
	 *
	 * @return bool
	 */
	public function delete($pk = null)
	{
		$this->load($pk);
		$result = parent::delete($pk);

		if ($result) {
			jimport('joomla.filesystem.file');

			foreach ($this->anexo as $anexoFile) {
				JFile::delete(JPATH_ROOT . '/media/com_ouvidoria/arquivos/solicitacoes/' . $anexoFile);
			}
		}

		return $result;
	}
}
