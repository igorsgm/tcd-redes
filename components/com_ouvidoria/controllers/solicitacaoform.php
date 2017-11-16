<?php

/**
 * @version    CVS: 1.0.3
 * @package    Com_Ouvidoria
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  2017 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */

// No direct access
use Thomisticus\Utils\Ajax;
use Thomisticus\Utils\Date;

defined('_JEXEC') or die;

/**
 * Solicitacao controller class.
 *
 * @since  1.6
 */
class OuvidoriaControllerSolicitacaoForm extends JControllerForm
{
	private $isNewRecord;
	private $solicitacao;
	private $solicitante;

	/**
	 * Method to check out an item for editing and redirect to the edit form.
	 *
	 * @return void
	 *
	 * @since    1.6
	 */
	public function edit($key = null, $urlVar = null)
	{
		$app = JFactory::getApplication();

		// Get the previous edit id (if any) and the current edit id.
		$previousId = (int)$app->getUserState('com_ouvidoria.edit.solicitacao.id');
		$editId     = $app->input->getInt('id', 0);

		// Set the user id for the user to edit in the session.
		$app->setUserState('com_ouvidoria.edit.solicitacao.id', $editId);

		// Get the model.
		$model = $this->getModel('SolicitacaoForm', 'OuvidoriaModel');

		// Check out the item
		if ($editId) {
			$model->checkout($editId);
		}

		// Check in the previous user.
		if ($previousId) {
			$model->checkin($previousId);
		}

		// Redirect to the edit screen.
		$this->setRedirect(JRoute::_('index.php?option=com_ouvidoria&view=solicitacaoform&layout=edit', false));
	}

	/**
	 * Method to save a user's profile data.
	 *
	 * @return void
	 *
	 * @throws Exception
	 * @since  1.6
	 */
	public function save($key = null, $urlVar = null)
	{

		$app       = JFactory::getApplication();
		$wantsJson = Ajax::isAjaxRequest();

		if ($wantsJson) {

			// Check for request forgeries.
			JSession::checkToken() or jexit(JText::_('JINVALID_TOKEN'));

			JFactory::getDocument()->setMimeEncoding('application/json');

			/** @var OuvidoriaModelSolicitacaoForm $model */
			$model = $this->getModel('SolicitacaoForm', 'OuvidoriaModel');

			// Get the user data.
			$data = JFactory::getApplication()->input->get('jform', array(), 'array');

			// Validate the posted data.
			$form = $model->getForm();

			if (!$form) {
				echo new JResponseJson($model->getError(), 500, true);
				$app->close();
			}

			$data = $this->getExternalFields($data);

			$this->isNewRecord = empty($data['id']);

			// Validate the posted data.
			$data = $model->validate($form, $data);

			// Check for errors.
			if ($data === false) {
				// Get the validation messages.
				$errors = $model->getErrors();

				// Return errors in JSON format and terminate the request
				Ajax::throwControllerValidationErrors($errors);
			}

			try {
				// Attempt to save the data.
				$response = $model->save($data);

				// Check in the profile.
				if ($response) {
					$model->checkin($response);

					/** @var OuvidoriaModelSolicitacao $model */
					$model = $this->getModel('Solicitacao', 'OuvidoriaModel');

					$response = $model->getData($response);
					$message  = JText::sprintf('COM_OUVIDORIA_MODAL_SOLICITACAO_ENVIADO_SUCESS_HTML', $response->protocolo);
				}

				// Invoke the postSave method to allow for the child class to access the model.
				$this->postSaveHook($model, $response);

				$this->isNewRecord = null;

				echo new JResponseJson($response, $message);

			} catch (RuntimeException $e) {
				echo new JResponseJson($e->getCode(), $e->getMessage(), true);
			}

			$app->close();
		}

	}

	/**
	 * Method to abort current operation
	 *
	 * @return void
	 *
	 * @throws Exception
	 */
	public function cancel($key = null)
	{
		$app = JFactory::getApplication();

		// Get the current edit id.
		$editId = (int)$app->getUserState('com_ouvidoria.edit.solicitacao.id');

		// Get the model.
		$model = $this->getModel('SolicitacaoForm', 'OuvidoriaModel');

		// Check in the item
		if ($editId) {
			$model->checkin($editId);
		}

		$menu = JFactory::getApplication()->getMenu();
		$item = $menu->getActive();
		$url  = (empty($item->link) ? 'index.php?option=com_ouvidoria&view=solicitacoes' : $item->link);
		$this->setRedirect(JRoute::_($url, false));
	}

	/**
	 * Method to remove data
	 *
	 * @return void
	 *
	 * @throws Exception
	 *
	 * @since 1.6
	 */
	public function remove()
	{
		$app   = JFactory::getApplication();
		$model = $this->getModel('SolicitacaoForm', 'OuvidoriaModel');
		$pk    = $app->input->getInt('id');

		// Attempt to save the data
		try {
			$return = $model->delete($pk);

			// Check in the profile
			$model->checkin($return);

			// Clear the profile id from the session.
			$app->setUserState('com_ouvidoria.edit.solicitacao.id', null);

			$menu = $app->getMenu();
			$item = $menu->getActive();
			$url  = (empty($item->link) ? 'index.php?option=com_ouvidoria&view=solicitacoes' : $item->link);

			// Redirect to the list screen
			$this->setMessage(JText::_('COM_EXAMPLE_ITEM_DELETED_SUCCESSFULLY'));
			$this->setRedirect(JRoute::_($url, false));

			// Flush the data from the session.
			$app->setUserState('com_ouvidoria.edit.solicitacao.data', null);
		} catch (Exception $e) {
			$errorType = ($e->getCode() == '404') ? 'error' : 'warning';
			$this->setMessage($e->getMessage(), $errorType);
			$this->setRedirect('index.php?option=com_ouvidoria&view=solicitacoes');
		}
	}

	/**
	 * Método de consulta do protocolo e cpf
	 * @return JControllerLegacy
	 */
	public function consult()
	{
		$app = JFactory::getApplication();

		$menuItem = $app->getMenu()->getActive();
		$url      = (empty($menuItem->link) ? 'index.php?option=com_ouvidoria&view=solicitacaoform' : $menuItem->link);

		// Check for request forgeries.
		JSession::checkToken() or jexit(JText::_('JINVALID_TOKEN'));

		// Get the user data.
		$data = $app->input->get('jform', array(), 'array');

		if (empty($data['cpf']) || empty($data['protocolo'])) {
			$app->enqueueMessage(JText::_('COM_OUVIDORIA_CONSULTA_CPF_OR_PROTOCOLO_VAZIO'), 'error');

			return $this->setRedirect(JRoute::_($url, false));
		}

		$idSolicitacao = OuvidoriaHelpersOuvidoria::getIdSolicitacaoByCpfAndProtocolo($data['cpf'], $data['protocolo']);

		if (empty($idSolicitacao)) {
			$app->enqueueMessage(JText::_('COM_OUVIDORIA_CONSULTA_PROTOCOLO_CPF_NAO_ENCONTRADO'), 'warning');

			return $this->setRedirect(JRoute::_($url, false));
		}

		// Redirect to the comentarios screen.
		$this->setRedirect(JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . $idSolicitacao, false));
	}

	/**
	 * Adicionar os campos externos necessários para salvar a solicitação
	 * Chamado no método save
	 *
	 * @param $data
	 *
	 * @return mixed
	 */
	private function getExternalFields($data)
	{
		$app         = JFactory::getApplication();
		$solicitante = $app->getUserState('com_ouvidoria.edit.solicitante.data');

		$data['protocolo']      = Date::formatDate(Date::getDate(), 'dmsyiH');
		$data['id_solicitante'] = $solicitante->id;

		$app->setUserState('com_ouvidoria.edit.solicitante.data', null);

		return $data;
	}

	/**
	 * Function that allows child controller access to model data
	 * after the data has been saved.
	 *
	 * @param   JModelLegacy $model     The data model object.
	 * @param   array        $validData The validated data.
	 *
	 * @return void
	 * @since   1.6
	 */
	protected function postSaveHook(JModelLegacy $model, $validData = array())
	{
		$this->solicitacao = $validData;

		$idSolicitante = ThomisticusHelperModel::select('#__ouvidoria_solicitacoes', 'id_solicitante', ['id' => $this->solicitacao->id], 'Result');

		/** @var OuvidoriaModelSolicitante $modelSolicitante */
		$modelSolicitante  = ThomisticusHelperComponent::getModel('Solicitante');
		$this->solicitante = $modelSolicitante->getData($idSolicitante);

		if ($this->isNewRecord) {
			$this->sendEmailInicialSolicitante();
			$this->sendEmailInicialResponsaveisDiretorias();
		}

	}

	/**
	 * Enviar o email assim que a solicitação for criada
	 * (para quem criou a solicitacão + responsáveis da diretoria selecionada + emails que sempre podem ser consultados)
	 */
	private function sendEmailInicialSolicitante()
	{
		// Para o solicitante
		$subject  = JText::_('COM_OUVIDORIA_EMAILS_EMAIL_INICIAL_SUBJECT');
		$urlBotao = JUri::root() . 'index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . $this->solicitacao->id . '&Itemid=585';
		$body     = JText::sprintf('COM_OUVIDORIA_EMAILS_EMAIL_INICIAL_SOLICITANTE_BODY', $this->solicitante->nome, $this->solicitacao->protocolo, $this->solicitacao->texto, $urlBotao);

//		LOCAL E HOMOLOG
		ThomisticusHelperMail::sendMail($subject, $body, ['producao@tridiacriacao.com', 'assistenteti@anamatra.org.br'], '', '', true);

//		PRODUCAO
//		ThomisticusHelperMail::sendMail($subject, $body, $this->solicitante->email, '', '', true);
	}

	/**
	 * Apenas envia o email para os responsáveis da diretoria
	 */
	private function sendEmailInicialResponsaveisDiretorias()
	{
		$idDiretoria       = ThomisticusHelperModel::select('#__ouvidoria_solicitacoes', 'id_diretoria_responsavel', ['id' => $this->solicitacao->id], 'Result');
		$usersConsultaveis = OuvidoriaHelpersOuvidoria::getEmailsUsersConsultaveis($idDiretoria);

		$subject  = JText::_('COM_OUVIDORIA_EMAILS_EMAIL_INICIAL_SUBJECT');
		$urlBotao = JUri::root() . 'index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . $this->solicitacao->id . '&Itemid=587';

		foreach ($usersConsultaveis as $userId => $email) {
			$user = JFactory::getUser($userId);
			$body = JText::sprintf('COM_OUVIDORIA_EMAILS_EMAIL_INICIAL_RESPONSAVEL_DIRETORIA_BODY', $user->name, $this->solicitacao->protocolo, $this->solicitante->nome, $this->solicitante->cpf, $this->solicitacao->texto, $urlBotao);

			// LOCAL E HOMOLOG
			ThomisticusHelperMail::sendMail($subject, $body, ['producao@tridiacriacao.com', 'assistenteti@anamatra.org.br'], '', '', true);

			// PRODUCAO
			// ThomisticusHelperMail::sendMail($subject, $body, $email, '', '', true);
		}
	}
}
