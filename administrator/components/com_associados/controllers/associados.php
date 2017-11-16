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

jimport('joomla.application.component.controlleradmin');

use Joomla\Utilities\ArrayHelper;

/**
 * Associados list controller class.
 *
 * @since  1.6
 */
class AssociadosControllerAssociados extends JControllerAdmin
{
	/**
	 * Method to clone existing Associados
	 *
	 * @return void
	 */
	public function duplicate()
	{
		// Check for request forgeries
		Jsession::checkToken() or jexit(JText::_('JINVALID_TOKEN'));

		// Get id(s)
		$pks = $this->input->post->get('cid', array(), 'array');

		try {
			if (empty($pks)) {
				throw new Exception(JText::_('COM_ASSOCIADOS_NO_ELEMENT_SELECTED'));
			}

			ArrayHelper::toInteger($pks);
			$model = $this->getModel();
			$model->duplicate($pks);
			$this->setMessage(Jtext::_('COM_ASSOCIADOS_ITEMS_SUCCESS_DUPLICATED'));
		} catch (Exception $e) {
			JFactory::getApplication()->enqueueMessage($e->getMessage(), 'warning');
		}

		$this->setRedirect('index.php?option=com_associados&view=associados');
	}

	/**
	 * Proxy for getModel.
	 *
	 * @param   string $name Optional. Model name
	 * @param   string $prefix Optional. Class prefix
	 * @param   array $config Optional. Configuration array for model
	 *
	 * @return  object    The Model
	 *
	 * @since    1.6
	 */
	public function getModel($name = 'associado', $prefix = 'AssociadosModel', $config = array())
	{
		$model = parent::getModel($name, $prefix, array('ignore_request' => true));

		return $model;
	}

	/**
	 * Method to save the submitted ordering values for records via AJAX.
	 *
	 * @return  void
	 *
	 * @since   3.0
	 */
	public function saveOrderAjax()
	{
		// Get the input
		$input = JFactory::getApplication()->input;
		$pks = $input->post->get('cid', array(), 'array');
		$order = $input->post->get('order', array(), 'array');

		// Sanitize the input
		ArrayHelper::toInteger($pks);
		ArrayHelper::toInteger($order);

		// Get the model
		$model = $this->getModel();

		// Save the ordering
		$return = $model->saveorder($pks, $order);

		if ($return) {
			echo "1";
		}

		// Close the application
		JFactory::getApplication()->close();
	}

	public function geraExcel()
	{

		// Get the model
		$model_associados = $this->getModel('associados');

		$retornoExcel = $model_associados->getExcel();

		// Close the application
		JFactory::getApplication()->close();

	}

	public function userRegister()
	{
		$associadosIds = JFactory::getApplication()->input->get('cid', array(), 'array');

		$responseExport = $this->getModel('associados')->exportUsers(implode(',', $associadosIds));
		$mainframe = JFactory::getApplication();

		$responseExport ? $mainframe->enqueueMessage(JText::_('Usuário(s) Registrado(s) com sucesso!')) :
			$mainframe->enqueueMessage(JText::_('Não foi possível Registrar Usuário(s)!'), 'error');

		$mainframe->redirect('index.php?option=com_associados&view=associados');
	}

	public function usergroupUpdate()
	{
		$input = JFactory::getApplication()->input;
		$associadosIds = $input->get('cid', array(), 'array');

		$db = JFactory::getDbo();

		foreach ($associadosIds as $id) {
			$query = $db->getQuery(true);
			$query->select('amatra, user_id')->from('#__associados')
				->where("id = " . $id . " AND user_id != ''");
			$associado = $db->setQuery($query)->loadObject();

			JUserHelper::setUserGroups($associado->user_id, array(10, (intval($associado->amatra) - 34)));
		}

		JFactory::getApplication()->redirect('index.php?option=com_associados&view=associados');
	}

	/**
	 * Método para enviar Associados para o Protheus manualmente
	 */
	public function sendToProtheus()
	{
		set_time_limit(0);
		include_once(JPATH_ROOT . '/ws/controller/ExternalSenderController.php');

		$app = JFactory::getApplication();
		$associadosIds = $app->input->get('cid', array(), 'array');

		$responses = array();
		foreach ($associadosIds as $id) {
			$response = (new ExternalSenderController())->sendRequestByComponent(array(
				'resource' => 'anmt_associados',
				'id_resource_element' => $id,
				'method' => 'INSERT'
			));
			$responses[$id] = $response->body;
		}
		$app->enqueueMessage('<pre>' . print_r($responses, true));
		$app->redirect('index.php?option=com_associados&view=associados');
	}

	/**
	 * Método para resetar o password dos associados selecionados e reenviar o e-mail
	 * (Padrão para o password: "anamatra" + 3 primeiros dígitos do CPF)
	 */
	public function resetPasswordAndSendEmail()
	{
		$dateTime = JFactory::getDate('now', JFactory::getConfig()->get('offset'))->toSql(true);

		JLoader::register('AssocUsersAcy', JPATH_COMPONENT_ADMINISTRATOR . '/helpers/associados_users.php');

		$app = JFactory::getApplication();
		$associadosIds = $app->input->get('cid', array(), 'array');

		$assocModel = JModelLegacy::getInstance('Associado', 'AssociadosModel');

		try {
			foreach ($associadosIds as $id) {
				$associado = $assocModel->getItem($id);

				if (!empty($associado->user_id)) {
					//Gerar senha padrão anamatra + 3 digitos do CPF
					$pass = 'anamatra' . mb_substr($associado->cpf, 0, 3);
					$password = array('password' => $pass, 'password2' => $pass);

					$user = JFactory::getUser($associado->user_id);
					if (!empty($user)) {
						$user->requireReset = 1;
						$user->bind($password);
						$user->save();
						AssocUsersAcy::mailToUser($user);
						$assocModel->setLastPasswordRedefineByAnamatra($associado->id, $dateTime);
					}
				}
			}

			$app->enqueueMessage(JText::_('Senha(s) redefinida(s) com sucesso!<br>Em breve o(s) usuário(s) receberá(ão) um e-mail com as informações de acesso.'));
		} catch (Exception $e) {
			$app->enqueueMessage(JText::_('Erro ao redefinir senha<br>' . $e->getMessage(), 'error'));
		}

		JFactory::getApplication()->redirect('index.php?option=com_associados&view=associados');
	}

	/**
	 * Converter o JSON dos dependentes para Uppercase + sem acentuação
	 */
	public function upperCaseDependentes()
	{
		$db    = JFactory::getDbo();
		$query = $db->getQuery(true);
		$query->select('id, dependentes')->from('#__associados')
			->where("email != '' AND cpf != '' AND state = 1 AND dependentes != '' ");

		$associados = $db->setQuery($query)->loadObjectList();

		setlocale(LC_ALL, "en_US.utf8");
		foreach ($associados as $key => $associado)
		{
			$dependentes = json_decode($associado->dependentes);

			foreach ($dependentes as $dependente)
			{
				if (!empty($dependente->dependente_nome)) {
					$depSemAcentos = preg_replace("/[^A-Za-z0-9 ]/", '',
						iconv('UTF-8', 'ASCII//TRANSLIT', $dependente->dependente_nome));

					$dependente->dependente_nome = strtoupper($depSemAcentos);
				}
			}
			$query = $db->getQuery(true);
			$query->update('#__associados')
				->set('dependentes = ' . $db->quote(json_encode($dependentes)))
				->where('id = ' . $associado->id);
			$db->setQuery($query)->execute();
		}

		JFactory::getApplication()->enqueueMessage('Ok!');
		JFactory::getApplication()->redirect('index.php?option=com_associados&view=associados');
	}

}
