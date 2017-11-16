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

jimport('joomla.application.component.modelform');
jimport('joomla.event.dispatcher');

use Joomla\Utilities\ArrayHelper;
use Thomisticus\Utils\Arrays;

/**
 * Ouvidoria model.
 *
 * @since  1.6
 */
class OuvidoriaModelSolicitacaoForm extends JModelForm
{
	private $item = null;

	/**
	 * @var null|JObject
	 */
	private $solicitante = null;

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
		$app = JFactory::getApplication('com_ouvidoria');

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
		if ($this->item === null) {
			$this->item = false;

			if (empty($id)) {
				$id = $this->getState('solicitacao.id');
			}

			// Get a level row instance.
			$table = $this->getTable();

			// Attempt to load the row.
			if ($table !== false && $table->load($id)) {
				$user    = JFactory::getUser();
				$id      = $table->id;
				$canEdit = $user->authorise('core.edit', 'com_ouvidoria') || $user->authorise('core.create', 'com_ouvidoria');

				if (!$canEdit && $user->authorise('core.edit.own', 'com_ouvidoria')) {
					$canEdit = $user->id == $table->created_by;
				}

				if (!$canEdit) {
					throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 500);
				}

				// Check published state.
				if ($published = $this->getState('filter.published')) {
					if (isset($table->state) && $table->state != $published) {
						return $this->item;
					}
				}

				// Convert the JTable to a clean JObject.
				$properties = $table->getProperties(1);
				$this->item = ArrayHelper::toObject($properties, 'JObject');
			}
		}

		return $this->item;
	}

	public function getSolicitante($idSolicitacao = null)
	{
		$userId    = JFactory::getUser()->id;
		$associado = $this->getAssociadoData($userId);

		if ($this->solicitante == null) {
			$idSolicitacao = empty($idSolicitacao) ? $idSolicitacao : $this->item->id;

			/** @var OuvidoriaModelSolicitanteForm $modelSolicitante */
			$modelSolicitante = ThomisticusHelperComponent::getModel('SolicitanteForm');

			if (empty($idSolicitacao) && $userId) {
				$idSolicitacao = ThomisticusHelperModel::select('#__ouvidoria_solicitantes', 'id', ['id_user' => $userId], 'Result');

				if ($idSolicitacao) {
					$this->setAssociadoDataToSolicitante($associado, true);
				}
			}

			$this->solicitante = $modelSolicitante->getData($idSolicitacao);
		}

		if (empty($this->solicitante->id) && $userId) {
			$this->setAssociadoDataToSolicitante($associado);
		}

		return $this->solicitante;
	}

	private function getAssociadoData($userId = null)
	{
		if (empty($userId) && !($userId = JFactory::getUser()->id)) {
			return null;
		}

		/** @var AssociadosModelAssociado $modelAssociado */
		$modelAssociado = ThomisticusHelperComponent::getModel('Associado', 'com_associados');
		$idAssociado    = $modelAssociado->getItemIdByProperty(['user_id' => $userId]);

		return ArrayHelper::fromObject($modelAssociado->getData($idAssociado));
	}

	/**
	 * Atribuir os dados do associado para o solicitante.
	 * Chamado quando o usuário estiver logado e ainda não possuir solicitante
	 * Ou, caso já possuia solicitante, irá atualizar o solicitante (neste caso $updateSolicitante é true)
	 *
	 * @param JObject|array $associado         Dados do Associado que será utilizado para popular o solicitante
	 * @param bool          $updateSolicitante Se é para apenas atualizar o solicitante ou não
	 *
	 * @return bool
	 */
	private function setAssociadoDataToSolicitante($associado, $updateSolicitante = false)
	{
		$solicitante = Arrays::sliceByKeys($associado, ['id', 'nome', 'cpf', 'email', 'fone_celular', 'user_id', 'state', 'amatra']);
		$solicitante = Arrays::treatFromToColumns($solicitante, ['id' => 'id_associado', 'fone_celular' => 'telefone', 'user_id' => 'id_user', 'state' => 'is_associado']);

		if ($updateSolicitante) {
			/** @var OuvidoriaModelSolicitanteForm $modelSolicitante */
			$modelSolicitante  = ThomisticusHelperComponent::getModel('SolicitanteForm');
			$solicitante['id'] = ThomisticusHelperModel::select('#__ouvidoria_solicitantes', 'id', ['id_associado' => $associado['id']], 'Result');

			return $modelSolicitante->save($solicitante);
		}

		$this->solicitante->setProperties($solicitante);
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
	public function getTable($type = 'Solicitacao', $prefix = 'OuvidoriaTable', $config = array())
	{
		$this->addTablePath(JPATH_ADMINISTRATOR . '/components/com_ouvidoria/tables');

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
		$table      = $this->getTable();
		$properties = $table->getProperties();

		if (!in_array('alias', $properties)) {
			return null;
		}

		$table->load(array('alias' => $alias));

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
		$form = $this->loadForm('com_ouvidoria.solicitacao', 'solicitacaoform', array(
				'control'   => 'jform',
				'load_data' => $loadData
			)
		);

		if (empty($form)) {
			return false;
		}

		return $form;
	}


	/**
	 * Method to get the Solicitante form.
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
	public function getFormSolicitante($data = array(), $loadData = true)
	{
		$app = JFactory::getApplication();
		$app->setUserState('com_ouvidoria.edit.solicitante.data', $this->solicitante);

		/** @var OuvidoriaModelSolicitanteForm $model */
		$model = ThomisticusHelperComponent::getModel('SolicitanteForm');

		return $model->getForm();
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
		$data = JFactory::getApplication()->getUserState('com_ouvidoria.edit.solicitacao.data', array());

		if (empty($data)) {
			$data = $this->getData();
		}


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
		$id    = (!empty($data['id'])) ? $data['id'] : (int)$this->getState('solicitacao.id');
		$state = (!empty($data['state'])) ? 1 : 0;
		$user  = JFactory::getUser();

		if ($id) {
			// Check the user can edit this item
			$authorised = $user->authorise('core.edit', 'com_ouvidoria') || $authorised = $user->authorise('core.edit.own', 'com_ouvidoria');
		} else {
			// Check the user can create new items in this section
			$authorised = $user->authorise('core.create', 'com_ouvidoria');
		}

		if ($authorised !== true) {
			throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 403);
		}

		$table = $this->getTable();

		if ($table->save($data) === true) {
			return $table->id;
		} else {
			return false;
		}
	}

	/**
	 * Method to delete data
	 *
	 * @param   int $pk Item primary key
	 *
	 * @return  int  The id of the deleted item
	 *
	 * @throws Exception
	 *
	 * @since 1.6
	 */
	public function delete($pk)
	{
		$user = JFactory::getUser();

		if (empty($pk)) {
			$pk = (int)$this->getState('solicitacao.id');
		}

		if ($pk == 0 || $this->getData($pk) == null) {
			throw new Exception(JText::_('COM_OUVIDORIA_ITEM_DOESNT_EXIST'), 404);
		}

		if ($user->authorise('core.delete', 'com_ouvidoria') !== true) {
			throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 403);
		}

		$table = $this->getTable();

		if ($table->delete($pk) !== true) {
			throw new Exception(JText::_('JERROR_FAILED'), 501);
		}

		return $pk;
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

}
