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

jimport('joomla.application.component.modelform');
jimport('joomla.event.dispatcher');

use Joomla\Utilities\ArrayHelper;

/**
 * Associados model.
 *
 * @since  1.6
 */
class AssociadosModelAssociadoForm extends JModelForm
{
	private $item = null;

	/**
	 * Method to auto-populate the model state.
	 *
	 * Note. Calling getState in this method will result in recursion.
	 *
	 * @return void
	 *
	 * @since  1.6
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
	 * Method to get an ojbect.
	 *
	 * @param   integer $id The id of the object to get.
	 *
	 * @return Object|boolean Object on success, false on failure.
	 *
	 * @throws Exception
	 */
	public function &getData($id = null)
	{
		if ($this->item === null)
		{
			$this->item = false;
			$user       = JFactory::getUser();

			if (empty($id))
			{
				$id = $this->getState('associado.id');
				// Se ainda assim o id ficar vazio, verificar se o usuário está online e pegar o id do associado relacionado ao seu user_id
				if (empty($id) && $user->id)
				{
					$id = self::getCadastroAssociadoID($user->id)->id;
				}
				// $id = $this->getState('associado.id');
			}

			// Get a level row instance.
			$table = $this->getTable();

			// Attempt to load the row.
			if ($table !== false && $table->load($id))
			{
				// $user = JFactory::getUser();
				$id      = $table->id;
				$canEdit = $user->authorise('core.edit', 'com_associados') || $user->authorise('core.create',
						'com_associados');

				if (!$canEdit && $user->authorise('core.edit.own', 'com_associados'))
				{
					$canEdit = $user->id == $table->created_by;
				}

				if (!$canEdit)
				{
					throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 500);
				}

				// Check published state.
				if ($published = $this->getState('filter.published'))
				{
					if ($table->state != $published)
					{
						return $this->item;
					}
				}

				// Convert the JTable to a clean JObject.
				$properties = $table->getProperties(1);
				$this->item = ArrayHelper::toObject($properties, 'JObject');


				if (!empty($this->item->eventos_que_participou_conamat))
				{
					$this->item->eventos_que_participou_conamat = AssociadosHelpersAssociadosfront::treatJOjectElement((array) $this->item->eventos_que_participou_conamat);
				}

				if (!empty($this->item->eventos_que_participou_jogos_nacionais))
				{
					$this->item->eventos_que_participou_jogos_nacionais = AssociadosHelpersAssociadosfront::treatJOjectElement((array) $this->item->eventos_que_participou_jogos_nacionais);
				}

				if (!empty($this->item->eventos_que_participou_congresso_internacional))
				{
					$this->item->eventos_que_participou_congresso_internacional = AssociadosHelpersAssociadosfront::treatJOjectElement((array) $this->item->eventos_que_participou_congresso_internacional);
				}

				if (!empty($this->item->eventos_que_participou_encontro_aposentados))
				{
					$this->item->eventos_que_participou_encontro_aposentados = AssociadosHelpersAssociadosfront::treatJOjectElement((array) $this->item->eventos_que_participou_encontro_aposentados);
				}

			}
		}

//		var_dump($this->item);
//		die;
		return $this->item;
	}

	/**
	 * Method to get the table
	 *
	 * @param   string $type   Name of the JTable class
	 * @param   string $prefix Optional prefix for the table class name
	 * @param   array  $config Optional configuration array for JTable object
	 *
	 * @return  JTable|boolean JTable if found, boolean false on failure
	 */
	public function getTable($type = 'Associado', $prefix = 'AssociadosTable', $config = array())
	{
		$this->addTablePath(JPATH_ADMINISTRATOR . '/components/com_associados/tables');

		return JTable::getInstance($type, $prefix, $config);
	}

	/**
	 * Get an item by alias
	 *
	 * @param   string $alias Alias string
	 *
	 * @return int Element id
	 */
	public function getItemIdByAlias($alias)
	{
		$table = $this->getTable();

		$table->load(array('alias' => $alias));

		return $table->id;
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
	 * @param   integer $id The id of the row to check out.
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
	 * Method to get the profile form.
	 *
	 * The base form is loaded from XML
	 *
	 * @param   array   $data     An optional array of data for the form to interogate.
	 * @param   boolean $loadData True if the form is to load its own data (default case), false if not.
	 *
	 * @return    JForm    A JForm object on success, false on failure
	 *
	 * @since    1.6
	 */
	public function getForm($data = array(), $loadData = true)
	{
		// Get the form.
		$form = $this->loadForm('com_associados.associado', 'associadoform', array(
				'control'   => 'jform',
				'load_data' => $loadData
			)
		);

		if (empty($form))
		{
			return false;
		}

		return $form;
	}

	/**
	 * Method to get the data that should be injected in the form.
	 *
	 * @return    mixed    The data for the form.
	 *
	 * @since    1.6
	 */
	protected function loadFormData()
	{
		$data = JFactory::getApplication()->getUserState('com_associados.edit.associado.data', array());

		if (empty($data))
		{
			$data = $this->getData();
		}

		// Tratamento das datas para o formato d/m/Y
		$data = AssociadosHelpersDates::treatFormDates($data, 'd/m/Y');

		return $data;
	}

	/**
	 * Method to save the form data.
	 *
	 * @param   array $data The form data
	 *
	 * @return bool
	 *
	 * @throws Exception
	 * @since 1.6
	 */
	public function save($data)
	{
		$id       = (!empty($data['id'])) ? $data['id'] : (int) $this->getState('associado.id');
		$state    = (!empty($data['state'])) ? 1 : 0;
		$user     = JFactory::getUser();
		$situacao = $this->getCadastroAssociadoID($user->id);

		if ($id)
		{
			// Check the user can edit this item
			$authorised = $user->authorise('core.edit',
					'com_associados') || $authorised = $user->authorise('core.edit.own', 'com_associados');
		}
		else
		{
			// Check the user can create new items in this section
			$authorised = $user->authorise('core.create', 'com_associados');
		}

		if ($authorised !== true)
		{
			throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 403);
		}


		$table = $this->getTable();
		if ($table->save($data) === true)
		{

			// Update na tabela de associados mudando o status do associado para aposentado caso ele marque a opcao de aposentado no formulario.
			if ($table->aposentado == 1)
			{
				$db    = $this->getDbo();
				$query = $db->getQuery(true);
				$query->update('#__associados')->set("situacao_do_associado = 4 ")->where('id = ' . $table->id);
				$db->setQuery($query)->execute();
			}
			elseif ($data['aposentado'] == 0 && $situacao->situacao_do_associado == 4)
			{
				$db    = $this->getDbo();
				$query = $db->getQuery(true);
				$query->update('#__associados')->set("situacao_do_associado = 2 ")->where('id = ' . $table->id);
				$db->setQuery($query)->execute();
			}

			return $table->id;

		}
		else
		{
			return false;
		}
	}

	/**
	 * Method to delete data
	 *
	 * @param   array $data Data to be deleted
	 *
	 * @return bool|int If success returns the id of the deleted item, if not false
	 *
	 * @throws Exception
	 */
	public function delete($data)
	{
		$id = (!empty($data['id'])) ? $data['id'] : (int) $this->getState('associado.id');

		if (JFactory::getUser()->authorise('core.delete', 'com_associados') !== true)
		{
			throw new Exception(403, JText::_('JERROR_ALERTNOAUTHOR'));
		}

		$table = $this->getTable();

		if ($table->delete($data['id']) === true)
		{
			return $id;
		}
		else
		{
			return false;
		}
	}

	/**
	 * Check if data can be saved
	 *
	 * @return bool
	 */
	public function getCanSave()
	{
		$table = $this->getTable();

		return $table !== false;
	}

	/**
	 * Verificar se o usuário logado pode editar a Amatra e Tribunal do Associado
	 * Ou seja, apenas se fizer parte aos usergroups:
	 * Administrador, Super User, Secretarias ou Secretarias Amatras
	 *
	 * @return bool
	 */
	public function getCanEditAmatraAndTribunal()
	{
		$allowedUserGroups = [7, 8, 42, 53];
		$user = JFactory::getUser();

		return !empty(array_intersect($allowedUserGroups, $user->groups));
	}

	/**
	 * Retorna o ID de um Associado cadastrado (aprovado ou não)
	 *
	 * @param integer|null $userID = ID do usuário. Caso não seja enviado como parâmetro, o método retornará o último que
	 *                             se cadastrou.
	 *
	 * @return integer = ID do Associado na #__asociados
	 */
	public function getCadastroAssociadoID($userID = null)
	{
		$db    = JFactory::getDbo();
		$query = $db->getQuery(true);
		$query->select('id, situacao_do_associado')->from('#__associados');

		($userID !== null) ? $query->where('`state` = 1 AND `user_id` = ' . $userID) : $query->order('id DESC')->setLimit(1);

		return $db->setQuery($query)->loadObject();
	}

}
