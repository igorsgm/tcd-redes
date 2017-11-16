<?php

/**
 * @version    CVS: 1.0.9
 * @package    Com_Associados
 * @author     Trídia Criação <atendimento@tridiacriacao.com>
 * @copyright  2016 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
// No direct access.
defined('_JEXEC') or die;

jimport('joomla.application.component.modelitem');
jimport('joomla.event.dispatcher');

use Joomla\Utilities\ArrayHelper;

/**
 * Associados model.
 *
 * @since  1.6
 */
class AssociadosModelAssociado extends JModelItem
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
		$app = JFactory::getApplication('com_associados');

		// Load state from the request userState on edit or from the passed variable on default
		if (JFactory::getApplication()->input->get('layout') == 'edit')
		{
			$id = JFactory::getApplication()->getUserState('com_associados.edit.associado.id');
		}
		else
		{
			$id = JFactory::getApplication()->input->get('id');
			JFactory::getApplication()->setUserState('com_associados.edit.associado.id', $id);
		}

		$this->setState('associado.id', $id);

		// Load the parameters.
		$params       = $app->getParams();
		$params_array = $params->toArray();

		if (isset($params_array['item_id']))
		{
			$this->setState('associado.id', $params_array['item_id']);
		}

		$this->setState('params', $params);
	}

	/**
	 * Method to get an object.
	 *
	 * @param   integer $id             The id of the object to get.
	 * @param   boolean $forceGoThrough True to make the relationships again
	 *
	 * @return  mixed    Object on success, false on failure.
	 */
	public function &getData($id = null, $forceGoThrough = false)
	{
		if ($this->_item === null || $forceGoThrough)
		{
			$this->_item = false;

			if (empty($id))
			{
				$id = $this->getState('associado.id');
			}

			// Get a level row instance.
			$table = $this->getTable();

			// Attempt to load the row.
			if ($table->load($id))
			{
				// Check published state.
				if ($published = $this->getState('filter.published'))
				{
					if ($table->state != $published)
					{
						return $this->_item;
					}
				}

				// Convert the JTable to a clean JObject.
				$properties  = $table->getProperties(1);
				$this->_item = ArrayHelper::toObject($properties, 'JObject');
			}
		}


			$this->_item->state_anamatra = JText::_('COM_ASSOCIADOS_ASSOCIADOS_STATE_ANAMATRA_OPTION_' . $this->_item->state_anamatra);
			$this->_item->state_amatra = JText::_('COM_ASSOCIADOS_ASSOCIADOS_STATE_AMATRA_OPTION_' . $this->_item->state_amatra);

			if (isset($this->_item->situacao_do_associado) && $this->_item->situacao_do_associado != '') {
				if (is_object($this->_item->situacao_do_associado)){
					$this->_item->situacao_do_associado = \Joomla\Utilities\ArrayHelper::fromObject($this->_item->situacao_do_associado);
				}
				$values = (is_array($this->_item->situacao_do_associado)) ? $this->_item->situacao_do_associado : explode(',',$this->_item->situacao_do_associado);

				$textValue = array();
				foreach ($values as $value)
				{
					$db = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__associados_situacao_2481055`.`situacao_nome`')
						->from($db->quoteName('#__associados_situacao', '#__associados_situacao_2481055'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));
					$db->setQuery($query);
					$results = $db->loadObject();
					if ($results) {
						$textValue[] = $results->situacao_nome;
					}
				}

			$this->_item->situacao_do_associado = !empty($textValue) ? implode(', ', $textValue) : $this->_item->situacao_do_associado;

			}
					$this->_item->tratamento = JText::_('COM_ASSOCIADOS_ASSOCIADOS_TRATAMENTO_OPTION_' . $this->_item->tratamento);
					$this->_item->sexo = JText::_('COM_ASSOCIADOS_ASSOCIADOS_SEXO_OPTION_' . $this->_item->sexo);
					$this->_item->tribunal = JText::_('COM_ASSOCIADOS_ASSOCIADOS_TRIBUNAL_OPTION_' . $this->_item->tribunal);
					$this->_item->cargo = JText::_('COM_ASSOCIADOS_ASSOCIADOS_CARGO_OPTION_' . $this->_item->cargo);
					$this->_item->estado_civil = JText::_('COM_ASSOCIADOS_ASSOCIADOS_ESTADO_CIVIL_OPTION_' . $this->_item->estado_civil);
					$this->_item->logradouro = JText::_('COM_ASSOCIADOS_ASSOCIADOS_LOGRADOURO_OPTION_' . $this->_item->logradouro);

			if (isset($this->_item->estado) && $this->_item->estado != '') {
				if (is_object($this->_item->estado)){
					$this->_item->estado = \Joomla\Utilities\ArrayHelper::fromObject($this->_item->estado);
				}
				$values = (is_array($this->_item->estado)) ? $this->_item->estado : explode(',',$this->_item->estado);

				$textValue = array();
				foreach ($values as $value)
				{
					$db = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__estado_2481041`.`sig_estado`')
						->from($db->quoteName('#__estado', '#__estado_2481041'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));
					$db->setQuery($query);
					$results = $db->loadObject();
					if ($results) {
						$textValue[] = $results->sig_estado;
					}
				}

			$this->_item->estado = !empty($textValue) ? implode(', ', $textValue) : $this->_item->estado;

			}

			if (isset($this->_item->cidade) && $this->_item->cidade != '') {
				if (is_object($this->_item->cidade)){
					$this->_item->cidade = \Joomla\Utilities\ArrayHelper::fromObject($this->_item->cidade);
				}
				$values = (is_array($this->_item->cidade)) ? $this->_item->cidade : explode(',',$this->_item->cidade);

				$textValue = array();
				foreach ($values as $value)
				{
					$db = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__cidades_2481040`.`nm_cidade`')
						->from($db->quoteName('#__cidades', '#__cidades_2481040'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));
					$db->setQuery($query);
					$results = $db->loadObject();
					if ($results) {
						$textValue[] = $results->nm_cidade;
					}
				}

			$this->_item->cidade = !empty($textValue) ? implode(', ', $textValue) : $this->_item->cidade;

			}
					$this->_item->possui_dependentes = JText::_('COM_ASSOCIADOS_ASSOCIADOS_POSSUI_DEPENDENTES_OPTION_' . $this->_item->possui_dependentes);

			if (isset($this->_item->eventos_que_participou_jogos_nacionais) && $this->_item->eventos_que_participou_jogos_nacionais != '') {
				if (is_object($this->_item->eventos_que_participou_jogos_nacionais))
				{
					$this->_item->eventos_que_participou_jogos_nacionais = ArrayHelper::fromObject($this->_item->eventos_que_participou_jogos_nacionais);
				}

				$values = (is_array($this->_item->eventos_que_participou_jogos_nacionais)) ? $this->_item->eventos_que_participou_jogos_nacionais : explode(',',$this->_item->eventos_que_participou_jogos_nacionais);

				$textValue = array();
				foreach ($values as $value)
				{
					$db = JFactory::getDbo();
					$query = "SELECT * FROM `anmt_associados_eventos` WHERE `state` = 1 AND `evento_tipo` LIKE 'jogos' HAVING id LIKE '" . $value . "'";
					$db->setQuery($query);
					$results = $db->loadObject();
					if ($results) {
						$textValue[] = $results->evento_ano;
					}
				}

			$this->_item->eventos_que_participou_jogos_nacionais = !empty($textValue) ? implode(', ', $textValue) : $this->_item->eventos_que_participou_jogos_nacionais;

			}

			if (isset($this->_item->eventos_que_participou_conamat) && $this->_item->eventos_que_participou_conamat != '') {
				if (is_object($this->_item->eventos_que_participou_conamat))
				{
					$this->_item->eventos_que_participou_conamat = ArrayHelper::fromObject($this->_item->eventos_que_participou_conamat);
				}

				$values = (is_array($this->_item->eventos_que_participou_conamat)) ? $this->_item->eventos_que_participou_conamat : explode(',',$this->_item->eventos_que_participou_conamat);

				$textValue = array();
				foreach ($values as $value)
				{
					$db = JFactory::getDbo();
					$query = "SELECT * FROM `anmt_associados_eventos` WHERE `state` = 1 AND `evento_tipo` LIKE 'conamat' HAVING id LIKE '" . $value . "'";
					$db->setQuery($query);
					$results = $db->loadObject();
					if ($results) {
						$textValue[] = $results->evento_ano;
					}
				}

			$this->_item->eventos_que_participou_conamat = !empty($textValue) ? implode(', ', $textValue) : $this->_item->eventos_que_participou_conamat;

			}

			if (isset($this->_item->eventos_que_participou_congresso_internacional) && $this->_item->eventos_que_participou_congresso_internacional != '') {
				if (is_object($this->_item->eventos_que_participou_congresso_internacional))
				{
					$this->_item->eventos_que_participou_congresso_internacional = ArrayHelper::fromObject($this->_item->eventos_que_participou_congresso_internacional);
				}

				$values = (is_array($this->_item->eventos_que_participou_congresso_internacional)) ? $this->_item->eventos_que_participou_congresso_internacional : explode(',',$this->_item->eventos_que_participou_congresso_internacional);

				$textValue = array();
				foreach ($values as $value)
				{
					$db = JFactory::getDbo();
					$query = "SELECT * FROM `anmt_associados_eventos` WHERE `state` = 1 AND `evento_tipo` LIKE 'internacional' HAVING id LIKE '" . $value . "'";
					$db->setQuery($query);
					$results = $db->loadObject();
					if ($results) {
						$textValue[] = $results->evento_ano;
					}
				}

			$this->_item->eventos_que_participou_congresso_internacional = !empty($textValue) ? implode(', ', $textValue) : $this->_item->eventos_que_participou_congresso_internacional;

			}

			if (isset($this->_item->eventos_que_participou_encontro_aposentados) && $this->_item->eventos_que_participou_encontro_aposentados != '') {
				if (is_object($this->_item->eventos_que_participou_encontro_aposentados))
				{
					$this->_item->eventos_que_participou_encontro_aposentados = ArrayHelper::fromObject($this->_item->eventos_que_participou_encontro_aposentados);
				}

				$values = (is_array($this->_item->eventos_que_participou_encontro_aposentados)) ? $this->_item->eventos_que_participou_encontro_aposentados : explode(',',$this->_item->eventos_que_participou_encontro_aposentados);

				$textValue = array();
				foreach ($values as $value)
				{
					$db = JFactory::getDbo();
					$query = "SELECT * FROM `anmt_associados_eventos` WHERE `state` = 1 AND `evento_tipo` LIKE 'aposentados' HAVING id LIKE '" . $value . "'";
					$db->setQuery($query);
					$results = $db->loadObject();
					if ($results) {
						$textValue[] = $results->evento_ano;
					}
				}

			$this->_item->eventos_que_participou_encontro_aposentados = !empty($textValue) ? implode(', ', $textValue) : $this->_item->eventos_que_participou_encontro_aposentados;

			}
					$this->_item->eventos_que_participou_outros = JText::_('COM_ASSOCIADOS_ASSOCIADOS_EVENTOS_QUE_PARTICIPOU_OUTROS_OPTION_' . $this->_item->eventos_que_participou_outros);
					$this->_item->receber_correspondencia = JText::_('COM_ASSOCIADOS_ASSOCIADOS_RECEBER_CORRESPONDENCIA_OPTION_' . $this->_item->receber_correspondencia);
					$this->_item->receber_newsletter = JText::_('COM_ASSOCIADOS_ASSOCIADOS_RECEBER_NEWSLETTER_OPTION_' . $this->_item->receber_newsletter);
					$this->_item->receber_sms = JText::_('COM_ASSOCIADOS_ASSOCIADOS_RECEBER_SMS_OPTION_' . $this->_item->receber_sms);
					$this->_item->filiado_amb = JText::_('COM_ASSOCIADOS_ASSOCIADOS_FILIADO_AMB_OPTION_' . $this->_item->filiado_amb);if (isset($this->_item->created_by) )
		{
			
			$idUserCreatedBy = ThomisticusHelperModel::select('#__users', 'id', array('id' => $this->_item->created_by), 'Result');

			if  (!empty($idUserCreatedBy)) {
				$this->_item->created_by_name = JFactory::getUser($this->_item->created_by)->name;				
			}
		}

		return $this->_item;
	}

	/**
	 * Get an instance of JTable class
	 *
	 * @param   string  $type    Name of the JTable class to get an instance of.
	 * @param   string  $prefix  Prefix for the table class name. Optional.
	 * @param   array   $config  Array of configuration values for the JTable object. Optional.
	 *
	 * @return  JTable|bool JTable if success, false on failure.
	 */
	public function getTable($type = 'Associado', $prefix = 'AssociadosTable', $config = array())
	{
		$this->addTablePath(JPATH_ADMINISTRATOR . '/components/com_associados/tables');

		return JTable::getInstance($type, $prefix, $config);
	}

	/**
	 * Get the id of an item by alias
	 *
	 * @param   string  $alias  Item alias
	 *
	 * @return  mixed
	 */
	public function getItemIdByAlias($alias)
	{
		$table = $this->getTable();

		$table->load(array('alias' => $alias));

		return $table->id;
	}

	/**
	 * Method to check in an item.
	 *
	 * @param   integer  $id  The id of the row to check out.
	 *
	 * @return  boolean True on success, false on failure.
	 *
	 * @since    1.6
	 */
	public function checkin($id = null)
	{
		// Get the id.
		$id = (!empty($id)) ? $id : (int) $this->getState('associado.id');

		if ($id)
		{
			// Initialise the table
			$table = $this->getTable();

			// Attempt to check the row in.
			if (method_exists($table, 'checkin'))
			{
				if (!$table->checkin($id))
				{
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Method to check out an item for editing.
	 *
	 * @param   integer  $id  The id of the row to check out.
	 *
	 * @return  boolean True on success, false on failure.
	 *
	 * @since    1.6
	 */
	public function checkout($id = null)
	{
		// Get the user id.
		$id = (!empty($id)) ? $id : (int) $this->getState('associado.id');

		if ($id)
		{
			// Initialise the table
			$table = $this->getTable();

			// Get the current user object.
			$user = JFactory::getUser();

			// Attempt to check the row out.
			if (method_exists($table, 'checkout'))
			{
				if (!$table->checkout($user->get('id'), $id))
				{
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Get and item by property (database column)
	 *
	 * @param array $array Array element with columns and values to be searched
	 *
	 * @return null|int Element id
	 */
	public function getItemIdByProperty($array)
	{
		$table      = $this->getTable();
		$properties = $table->getProperties();

		if (!Thomisticus\Utils\Arrays::insideAnother(array_keys($properties), array_keys($array)))
		{
			return null;
		}

		$table->load($array);

		return $table->id;
	}

	/**
	 * Get the name of a category by id
	 *
	 * @param   int  $id  Category id
	 *
	 * @return  Object|null	Object if success, null in case of failure
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
	 * @param   int  $id     Item id
	 * @param   int  $state  Publish state
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
	 * @param   int  $id  Element id
	 *
	 * @return  bool
	 */
	public function delete($id)
	{
		$table = $this->getTable();

		return $table->delete($id);
	}


}
