<?php

/**
 * @version    CVS: 1.0.9
 * @package    Com_Associados
 * @author     Trídia Criação <atendimento@tridiacriacao.com>
 * @copyright  2016 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
// No direct access
defined('_JEXEC') or die;

use Joomla\Utilities\ArrayHelper;

JLoader::register('Dates', JPATH_COMPONENT_SITE . '/helpers/dates.php');

/**
 * associado Table class
 *
 * @since  1.6
 */
class AssociadosTableassociado extends JTable
{

	/**
	 * Constructor
	 *
	 * @param   JDatabase &$db A database connector object
	 */
	public function __construct(&$db)
	{
		JObserverMapper::addObserverClassToClass('JTableObserverContenthistory', 'AssociadosTableassociado',
			array('typeAlias' => 'com_associados.associado'));
		parent::__construct('#__associados', 'id', $db);
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
		$input = JFactory::getApplication()->input;
		$task  = $input->getString('task', '');

		// Support for multiple or not foreign key field: situacao_do_associado
		if (!empty($array['situacao_do_associado']))
		{
			if (is_array($array['situacao_do_associado']))
			{
				$array['situacao_do_associado'] = implode(',', $array['situacao_do_associado']);
			}
			else
			{
				if (strrpos($array['situacao_do_associado'], ',') != false)
				{
					$array['situacao_do_associado'] = explode(',', $array['situacao_do_associado']);
				}
			}
		}
		else
		{
			$array['situacao_do_associado'] = '';
		}

		// Support for empty date field: nascimento
		if ($array['nascimento'] == '0000-00-00')
		{
			$array['nascimento'] = '';
		}

		// Support for empty date field: data_emissao
		if ($array['data_emissao'] == '0000-00-00')
		{
			$array['data_emissao'] = '';
		}

		// Support for empty date field: dt_ingresso_magistratura
		if ($array['dt_ingresso_magistratura'] == '0000-00-00')
		{
			$array['dt_ingresso_magistratura'] = '';
		}

		// Support for empty date field: dt_filiacao_anamatra
		if ($array['dt_filiacao_anamatra'] == '0000-00-00')
		{
			$array['dt_filiacao_anamatra'] = '';
		}

		// Support for multiple or not foreign key field: estado
		if (!empty($array['estado']))
		{
			if (is_array($array['estado']))
			{
				$array['estado'] = implode(',', $array['estado']);
			}
			else
			{
				if (strrpos($array['estado'], ',') != false)
				{
					$array['estado'] = explode(',', $array['estado']);
				}
			}
		}
		else
		{
			$array['estado'] = '';
		}

		// Support for multiple or not foreign key field: cidade
		if (!empty($array['cidade']))
		{
			if (is_array($array['cidade']))
			{
				$array['cidade'] = implode(',', $array['cidade']);
			}
			else
			{
				if (strrpos($array['cidade'], ',') != false)
				{
					$array['cidade'] = explode(',', $array['cidade']);
				}
			}
		}
		else
		{
			$array['cidade'] = '';
		}

		// Support for multiple SQL field: eventos_que_participou_jogos_nacionais
		if (isset($array['eventos_que_participou_jogos_nacionais']))
		{
			if (is_array($array['eventos_que_participou_jogos_nacionais']))
			{
				$array['eventos_que_participou_jogos_nacionais'] = implode(',',
					$array['eventos_que_participou_jogos_nacionais']);
			}
			else
			{
				if (strrpos($array['eventos_que_participou_jogos_nacionais'], ',') != false)
				{
					$array['eventos_que_participou_jogos_nacionais'] = explode(',',
						$array['eventos_que_participou_jogos_nacionais']);
				}
				else
				{
					if (empty($array['eventos_que_participou_jogos_nacionais']))
					{
						$array['eventos_que_participou_jogos_nacionais'] = '';
					}
				}
			}
		} else {
			$array['eventos_que_participou_jogos_nacionais'] = '';
		}

		// Support for multiple SQL field: eventos_que_participou_conamat
		if (isset($array['eventos_que_participou_conamat']))
		{
			if (is_array($array['eventos_que_participou_conamat']))
			{
				$array['eventos_que_participou_conamat'] = implode(',', $array['eventos_que_participou_conamat']);
			}
			else
			{
				if (strrpos($array['eventos_que_participou_conamat'], ',') != false)
				{
					$array['eventos_que_participou_conamat'] = explode(',', $array['eventos_que_participou_conamat']);
				}
				else
				{
					if (empty($array['eventos_que_participou_conamat']))
					{
						$array['eventos_que_participou_conamat'] = '';
					}
				}
			}
		} else {
			$array['eventos_que_participou_conamat'] = '';
		}

		// Support for multiple SQL field: eventos_que_participou_congresso_internacional
		if (isset($array['eventos_que_participou_congresso_internacional']))
		{
			if (is_array($array['eventos_que_participou_congresso_internacional']))
			{
				$array['eventos_que_participou_congresso_internacional'] = implode(',',
					$array['eventos_que_participou_congresso_internacional']);
			}
			else
			{
				if (strrpos($array['eventos_que_participou_congresso_internacional'], ',') != false)
				{
					$array['eventos_que_participou_congresso_internacional'] = explode(',',
						$array['eventos_que_participou_congresso_internacional']);
				}
				else
				{
					if (empty($array['eventos_que_participou_congresso_internacional']))
					{
						$array['eventos_que_participou_congresso_internacional'] = '';
					}
				}
			}
		} else {
			$array['eventos_que_participou_congresso_internacional'] = '';
		}

		// Support for multiple SQL field: eventos_que_participou_encontro_aposentados
		if (isset($array['eventos_que_participou_encontro_aposentados']))
		{
			if (is_array($array['eventos_que_participou_encontro_aposentados']))
			{
				$array['eventos_que_participou_encontro_aposentados'] = implode(',',
					$array['eventos_que_participou_encontro_aposentados']);
			}
			else
			{
				if (strrpos($array['eventos_que_participou_encontro_aposentados'], ',') != false)
				{
					$array['eventos_que_participou_encontro_aposentados'] = explode(',',
						$array['eventos_que_participou_encontro_aposentados']);
				}
				else
				{
					if (empty($array['eventos_que_participou_encontro_aposentados']))
					{
						$array['eventos_que_participou_encontro_aposentados'] = '';
					}
				}
			}
		} else {
			$array['eventos_que_participou_encontro_aposentados'] = '';
		}

		if ($array['id'] == 0)
		{
			$array['created_by'] = JFactory::getUser()->id;
		}

		if (isset($array['params']) && is_array($array['params']))
		{
			$registry = new JRegistry;
			$registry->loadArray($array['params']);
			$array['params'] = (string) $registry;
		}
		if (isset($array['eventos_que_participou_outros_descricao']) && is_array($array['eventos_que_participou_outros_descricao']))
		{
			$registry = new JRegistry;
			$registry->loadArray($array['eventos_que_participou_outros_descricao']);
			$array['eventos_que_participou_outros_descricao'] = (string) $registry;
		}
		if (isset($array['dependentes']) && is_array($array['dependentes']))
		{
			$registry = new JRegistry;
			$registry->loadArray($array['dependentes']);
			$array['dependentes'] = (string) $registry;
		}

		if (isset($array['metadata']) && is_array($array['metadata']))
		{
			$registry = new JRegistry;
			$registry->loadArray($array['metadata']);
			$array['metadata'] = (string) $registry;
		}

		if (!JFactory::getUser()->authorise('core.admin', 'com_associados.associado.' . $array['id']))
		{
			$actions         = JAccess::getActionsFromFile(
				JPATH_ADMINISTRATOR . '/components/com_associados/access.xml',
				"/access/section[@name='associado']/"
			);
			$default_actions = JAccess::getAssetRules('com_associados.associado.' . $array['id'])->getData();
			$array_jaccess   = array();

			foreach ($actions as $action)
			{
				$array_jaccess[$action->name] = $default_actions[$action->name];
			}

			$array['rules'] = $this->JAccessRulestoArray($array_jaccess);
		}

		// Bind the rules for ACL where supported.
		if (isset($array['rules']) && is_array($array['rules']))
		{
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

		foreach ($jaccessrules as $action => $jaccess)
		{
			$actions = array();

			if ($jaccess)
			{
				foreach ($jaccess->getData() as $group => $allow)
				{
					$actions[$group] = ((bool) $allow);
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
		if (property_exists($this, 'ordering') && $this->id == 0)
		{
			$this->ordering = self::getNextOrder();
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
		$userId = (int) $userId;
		$state  = (int) $state;

		// If there are no primary keys set check to see if the instance key is set.
		if (empty($pks))
		{
			if ($this->$k)
			{
				$pks = array($this->$k);
			}
			// Nothing to set publishing state on, return false.
			else
			{
				throw new Exception(500, JText::_('JLIB_DATABASE_ERROR_NO_ROWS_SELECTED'));
			}
		}

		// Build the WHERE clause for the primary keys.
		$where = $k . '=' . implode(' OR ' . $k . '=', $pks);

		// Determine if there is checkin support for the table.
		if (!property_exists($this, 'checked_out') || !property_exists($this, 'checked_out_time'))
		{
			$checkin = '';
		}
		else
		{
			$checkin = ' AND (checked_out = 0 OR checked_out = ' . (int) $userId . ')';
		}

		// Update the publishing state for rows with the given primary keys.
		$this->_db->setQuery(
			'UPDATE `' . $this->_tbl . '`' .
			' SET `state` = ' . (int) $state .
			' WHERE (' . $where . ')' .
			$checkin
		);
		$this->_db->execute();

		// If checkin is supported and all rows were adjusted, check them in.
		if ($checkin && (count($pks) == $this->_db->getAffectedRows()))
		{
			// Checkin each row.
			foreach ($pks as $pk)
			{
				$this->checkin($pk);
			}
		}

		// If the JTable instance value is in the list of primary keys that were set, set the instance.
		if (in_array($this->$k, $pks))
		{
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

		return 'com_associados.associado.' . (int) $this->$k;
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
		$assetParent->loadByName('com_associados');

		// Return the found asset-parent-id
		if ($assetParent->id)
		{
			$assetParentId = $assetParent->id;
		}

		return $assetParentId;
	}

	/**
	 * Save method override to trigger treatFormDates before save
	 *
	 * @param   array|object $src            An associative array or object to bind to the JTable instance.
	 * @param   string       $orderingFilter Filter for the order updating
	 * @param   array|string $ignore         An optional array or space separated list of properties to ignore while binding.
	 *
	 * @return  boolean  True on success.
	 */
	public function save($src, $orderingFilter = '', $ignore = '')
	{
		$src = AssociadosHelpersDates::treatFormDates($src, 'Y-m-d');

		return parent::save($src, $orderingFilter, $ignore);
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

		return $result;
	}
}
