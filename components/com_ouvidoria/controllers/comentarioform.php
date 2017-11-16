<?php

/**
 * @version    CVS: 1.0.3
 * @package    Com_Ouvidoria
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  2017 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */

// No direct access
use Joomla\Utilities\ArrayHelper;

defined('_JEXEC') or die;

/**
 * Comentario controller class.
 *
 * @since  1.6
 */
class OuvidoriaControllerComentarioForm extends JControllerForm
{
	protected $interacao;
	protected $comentario;
	protected $solicitacao;
	protected $solicitante;
	protected $validData;
	protected $idLog;
	protected $comentarioToAnswer;

	/**
	 * @var OuvidoriaModelComentarioForm $modelComentario
	 */
	protected $modelComentario;

	/**
	 * @var OuvidoriaModelSolicitacaoForm $modelSolicitacao
	 */
	protected $modelSolicitacao;

	/**
	 * @var OuvidoriaModelSolicitante $modelSolicitante
	 */
	protected $modelSolicitante;

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
		$previousId = (int)$app->getUserState('com_ouvidoria.edit.comentario.id');
		$editId     = $app->input->getInt('id', 0);

		// Set the user id for the user to edit in the session.
		$app->setUserState('com_ouvidoria.edit.comentario.id', $editId);

		// Get the model.
		$model = $this->getModel('ComentarioForm', 'OuvidoriaModel');

		// Check out the item
		if ($editId) {
			$model->checkout($editId);
		}

		// Check in the previous user.
		if ($previousId) {
			$model->checkin($previousId);
		}

		// Redirect to the edit screen.
		$this->setRedirect(JRoute::_('index.php?option=com_ouvidoria&view=comentarioform&layout=edit', false));
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
		// Check for request forgeries.
		JSession::checkToken() or jexit(JText::_('JINVALID_TOKEN'));

		// Initialise variables.
		$app   = JFactory::getApplication();
		$model = $this->getModel('ComentarioForm', 'OuvidoriaModel');

		// Get the user data.
		$data          = JFactory::getApplication()->input->get('jform', array(), 'array');
		$idSolicitacao = $data['id_solicitacao'];

		if (empty($data['created_by_solicitante']) && !OuvidoriaHelpersOuvidoria::isUserOuvidoriaOrSuperUser() && JFactory::getUser()->id) {
			$data['created_by_solicitante'] = ThomisticusHelperModel::select('#__ouvidoria_solicitacoes', 'id_solicitante', ['id' => $data['id_solicitacao']], 'Result');
		}

		if (!empty($data['comentarioToAnswer'])) {
			$this->comentarioToAnswer = ArrayHelper::toObject($data['comentarioToAnswer']);
		}

		if (in_array(intval($data['acao']), [3, 4, 5, 6, 7, 8, 9])) {

			// Validate the posted data.
			$form = $model->getForm();

			if (!$form) {
				throw new Exception($model->getError(), 500);
			}

			// Validate the posted data.
			$data = $model->validate($form, $data);

			// Check for errors.
			if ($data === false) {
				// Get the validation messages.
				$errors = $model->getErrors();

				// Push up to three validation messages out to the user.
				for ($i = 0, $n = count($errors); $i < $n && $i < 3; $i++) {
					if ($errors[$i] instanceof Exception) {
						$app->enqueueMessage($errors[$i]->getMessage(), 'warning');
					} else {
						$app->enqueueMessage($errors[$i], 'warning');
					}
				}

				$input = $app->input;
				$jform = $input->get('jform', array(), 'ARRAY');

				// Save the data in the session.
				$app->setUserState('com_ouvidoria.edit.comentario.data', $jform);

				// Redirect back to the edit screen.
				$this->setRedirect(JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . $idSolicitacao, false));

				$this->redirect();
			}

			// Attempt to save the data.
			$return = $model->save($data);

			// Check for errors.
			if ($return === false) {
				// Save the data in the session.
				$app->setUserState('com_ouvidoria.edit.comentario.data', $data);

				// Redirect back to the edit screen.
				$id = (int)$app->getUserState('com_ouvidoria.edit.comentario.id');
				$this->setMessage(JText::sprintf('Save failed', $model->getError()), 'warning');
				$this->setRedirect(JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . $idSolicitacao, false));
			}

			// Check in the profile.
			if ($return) {
				$model->checkin($return);
				$data['id'] = $return;
			}

			// Clear the profile id from the session.
			$app->setUserState('com_ouvidoria.edit.comentario.id', null);
		}

		// Redirect to the list screen.
		$this->setMessage(JText::_('COM_OUVIDORIA_ITEM_SAVED_SUCCESSFULLY'));
		$this->setRedirect(JRoute::_('index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . $idSolicitacao, false));

		// Flush the data from the session.
		$app->setUserState('com_ouvidoria.edit.comentario.data', null);

		// Invoke the postSave method to allow for the child class to access the model.
		$this->postSaveHook($model, $data);
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
		$editId = (int)$app->getUserState('com_ouvidoria.edit.comentario.id');

		// Get the model.
		$model = $this->getModel('ComentarioForm', 'OuvidoriaModel');

		// Check in the item
		if ($editId) {
			$model->checkin($editId);
		}

		$menu = JFactory::getApplication()->getMenu();
		$item = $menu->getActive();
		$url  = (empty($item->link) ? 'index.php?option=com_ouvidoria&view=comentarios' : $item->link);
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
		$model = $this->getModel('ComentarioForm', 'OuvidoriaModel');
		$pk    = $app->input->getInt('id');

		// Attempt to save the data
		try {
			$return = $model->delete($pk);

			// Check in the profile
			$model->checkin($return);

			// Clear the profile id from the session.
			$app->setUserState('com_ouvidoria.edit.comentario.id', null);

			$menu = $app->getMenu();
			$item = $menu->getActive();
			$url  = (empty($item->link) ? 'index.php?option=com_ouvidoria&view=comentarios' : $item->link);

			// Redirect to the list screen
			$this->setMessage(JText::_('COM_EXAMPLE_ITEM_DELETED_SUCCESSFULLY'));
			$this->setRedirect(JRoute::_($url, false));

			// Flush the data from the session.
			$app->setUserState('com_ouvidoria.edit.comentario.data', null);
		} catch (Exception $e) {
			$errorType = ($e->getCode() == '404') ? 'error' : 'warning';
			$this->setMessage($e->getMessage(), $errorType);
			$this->setRedirect('index.php?option=com_ouvidoria&view=comentarios');
		}
	}

	/**
	 * Function that allows child controller access to model data
	 * after the data has been saved.
	 *
	 * @param   JModelLegacy $model     The data model object.
	 * @param   array        $validData The validated data.
	 *
	 * @return  void
	 *
	 * @since   1.6
	 */
	protected function postSaveHook(JModelLegacy $model, $validData = array())
	{
		$this->validData = ArrayHelper::toObject($validData);
		$this->interacao = OuvidoriaHelpersOuvidoria::getPostSaveInteracao($this->validData->acao);

		if (!empty($this->validData->id)) {
			$this->modelComentario = ThomisticusHelperComponent::getModel('ComentarioForm');
			$this->comentario      = $this->modelComentario->getData($this->validData->id);
		}

		$this->modelSolicitacao = ThomisticusHelperComponent::getModel('SolicitacaoForm');
		$this->solicitacao      = $this->modelSolicitacao->getData($this->validData->id_solicitacao);
		$this->modelSolicitante = ThomisticusHelperComponent::getModel('Solicitante');
		$this->solicitante      = $this->modelSolicitante->getData($this->solicitacao->id_solicitante);

		$interactionMethods = [
			1 => "postSaveAnalisarChamado",         // Muda status da solicitação para "Em análise" e envia email para o solicitante
			2 => "postSaveTransferirChamado",       // Não muda status, altera o id_diretoria_responsavel da solicitacao e notifica os responsáveis da nova diretoria responsável
			3 => "postSaveAguardarSolicitante",     // Muda stauts e envia email para o solicitante
			4 => "postSaveDevolverAoSolicitante",   // Muda stauts e envia email para o solicitante
			5 => "postSaveArquivarChamado",         // Muda status e envia email para o solicitante
			6 => "postSaveResolverChamado",         // Muda status e envia email para o solicitante
			7 => "postSaveConsultaInterna",         // Não muda status, muda o responsável manda email para quem está sendo consultado
			8 => "postSaveComentarChamado",         // Não muda status e envia email para os responsáveis da diretoria
			9 => "postSaveRespostaConsulta"
		];

		$this->idLog = $this->registerLog();
		$this->{$interactionMethods[$this->interacao->id]}();
	}

	/**
	 * Registrar a interação da solicitação na tabela de logs
	 *
	 * @return bool
	 */
	private function registerLog()
	{
		/** @var OuvidoriaModelSolicitacaologForm $logModel */
		$logModel = ThomisticusHelperComponent::getModel('SolicitacaologForm');
		$data     = [
			'state'                  => 1,
			'id_solicitacao'         => $this->solicitacao->id,
			'id_interacao'           => $this->interacao->id,
			'id_comentario'          => (!empty($this->comentario->id) ? $this->comentario->id : ''),
			'created_by_solicitante' => (!empty($this->validData->created_by_solicitante) ? $this->validData->created_by_solicitante : '')
		];

		return $logModel->save($data);
	}

	/**
	 * Método de alteração simples de status e notificação de tal mudança por email
	 * Chamado pelas alterações de status
	 */
	protected function changeStatusSolicitacaoAndEmailSolicitante()
	{
		$solicitacao           = ArrayHelper::fromObject($this->solicitacao);
		$solicitacao['status'] = $this->interacao->id_status;
		$this->modelSolicitacao->save($solicitacao);

		$subject  = JText::_('COM_OUVIDORIA_EMAILS_MUDANCA_STATUS_SUBJECT');
		$urlBotao = JUri::root() . 'index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . $this->solicitacao->id . '&Itemid=585';

		if (!empty($this->comentario->texto)) {
			$body     = JText::sprintf('COM_OUVIDORIA_EMAILS_MUDANCA_STATUS_BODY_COM_MENSAGEM', $this->solicitante->nome, $this->solicitacao->protocolo, $this->interacao->nome_status, $this->comentario->texto, $urlBotao);
		} else {
			$body     = JText::sprintf('COM_OUVIDORIA_EMAILS_MUDANCA_STATUS_BODY_SEM_MENSAGEM', $this->solicitante->nome, $this->solicitacao->protocolo, $this->interacao->nome_status, $urlBotao);
		}

		// LOCAL E HOMOLOG
		ThomisticusHelperMail::sendMail($subject, $body, ['producao@tridiacriacao.com', 'assistenteti@anamatra.org.br'], '', '', true);

		// PRODUCAO
		// ThomisticusHelperMail::sendMail($subject, $body, $this->solicitante->email, '', '', true);
	}

	/**
	 * Muda o status da solicitação para "Em Análise"e envia o email para o solicitante
	 */
	protected function postSaveAnalisarChamado()
	{
		return $this->changeStatusSolicitacaoAndEmailSolicitante();
	}

	/**
	 * Muda o status para "Aguardando Solicitante" e envia um email para o solicitante
	 */
	protected function postSaveAguardarSolicitante()
	{
		return $this->changeStatusSolicitacaoAndEmailSolicitante();
	}

	/**
	 * Muda o status para "Devolvido" e envia um email para o solicitante
	 */
	protected function postSaveDevolverAoSolicitante()
	{
		return $this->changeStatusSolicitacaoAndEmailSolicitante();
	}

	/**
	 * Muda o status para "Arquivado" e envia um email para o solicitante
	 */
	protected function postSaveArquivarChamado()
	{
		return $this->changeStatusSolicitacaoAndEmailSolicitante();
	}

	/**
	 * Muda o status para "Resolvido" e envia um email para o solicitante
	 */
	protected function postSaveResolverChamado()
	{
		return $this->changeStatusSolicitacaoAndEmailSolicitante();
	}

	/**
	 * Não muda o status, seta o id_user_responsavel_atual e notifica quem foi consultado
	 */
	protected function postSaveConsultaInterna()
	{
		$solicitacao                              = ArrayHelper::fromObject($this->solicitacao);
		$solicitacao['id_user_responsavel_atual'] = $this->validData->id_user_consultado;
		$this->modelSolicitacao->save($solicitacao);

		$user = JFactory::getUser($this->validData->id_user_consultado);

		$subject  = JText::_('COM_OUVIDORIA_EMAILS_CONSULTA_INTERNA_SUBJECT');
		$urlBotao = JUri::root() . 'index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . $this->solicitacao->id . '&Itemid=587';
		$body     = JText::sprintf('COM_OUVIDORIA_EMAILS_CONSULTA_INTERNA_BODY', $user->name, $this->solicitacao->protocolo, $this->comentario->texto, $this->solicitante->nome, $this->solicitante->cpf, $this->solicitacao->texto, $urlBotao);

		// LOCAL E HOMOLOG
		ThomisticusHelperMail::sendMail($subject, $body, ['producao@tridiacriacao.com', 'assistenteti@anamatra.org.br'], '', '', true);

		// PRODUCAO
		// ThomisticusHelperMail::sendMail($subject, $body, $user->email, '', '', true);

	}

	/**
	 * Não muda o status, seta o id_user_responsavel_atual, notifica quem fez a consulta e altera o comentário para respondido
	 */
	protected function postSaveRespostaConsulta()
	{
		$userRespondendo = JFactory::getUser();
		$userFezConsulta = JFactory::getUser($this->comentarioToAnswer->created_by);

		$solicitacao                              = ArrayHelper::fromObject($this->solicitacao);
		$solicitacao['id_user_responsavel_atual'] = $this->comentarioToAnswer->created_by;
		$this->modelSolicitacao->save($solicitacao);

		$comentarioToAnswer = $this->modelComentario->getData($this->comentarioToAnswer->id);
		$comentarioToAnswer = ArrayHelper::fromObject($comentarioToAnswer);
		$comentarioToAnswer['respondido'] = 1;
		$this->modelComentario->save($comentarioToAnswer);


		$subject  = JText::_('COM_OUVIDORIA_EMAILS_CONSULTA_INTERNA_RESPOSTA_SUBJECT');
		$urlBotao = JUri::root() . 'index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . $this->solicitacao->id . '&Itemid=587';
		$body     = JText::sprintf('COM_OUVIDORIA_EMAILS_CONSULTA_INTERNA_RESPOSTA_BODY', $userFezConsulta->name, $this->solicitacao->protocolo, $userRespondendo->name, $this->comentario->texto, $this->solicitante->nome, $this->solicitante->cpf, $this->solicitacao->texto, $urlBotao);

		// LOCAL E HOMOLOG
		ThomisticusHelperMail::sendMail($subject, $body, ['producao@tridiacriacao.com', 'assistenteti@anamatra.org.br'], '', '', true);

		//	PRODUCAO
//		ThomisticusHelperMail::sendMail($subject, $body, $userFezConsulta->email, '', '', true);

	}

	/**
	 * Não muda o status, altera o id_diretoria_responsavel da solicitação e notifica os repsonsáveis da nova diretoria responsável
	 */
	protected function postSaveTransferirChamado()
	{
		$solicitacao                             = ArrayHelper::fromObject($this->solicitacao);
		$solicitacao['id_diretoria_responsavel'] = $this->validData->diretoria_transferencia;
		$this->modelSolicitacao->save($solicitacao);

		$usersConsultaveis = OuvidoriaHelpersOuvidoria::getEmailsUsersConsultaveis($this->solicitacao->id_diretoria_responsavel);

		$subject  = JText::_('COM_OUVIDORIA_EMAILS_TRANSFERENCIA_SUBJECT');
		$urlBotao = JUri::root() . 'index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . $this->solicitacao->id . '&Itemid=587';

		$nomeDiretoria = ThomisticusHelperModel::select('#__ouvidoria_diretorias', 'nome', ['id' => $this->solicitacao->id_diretoria_responsavel], 'Result');

		foreach ($usersConsultaveis as $userId => $email) {
			$user = JFactory::getUser($userId);
			$body = JText::sprintf('COM_OUVIDORIA_EMAILS_TRANSFERENCIA_RESPONSAVEL_DIRETORIA_BODY', $user->name, $this->solicitacao->protocolo, $nomeDiretoria, $this->solicitante->nome, $this->solicitante->cpf, $this->solicitacao->texto, $urlBotao);

			// LOCAL E HOMOLOG
			ThomisticusHelperMail::sendMail($subject, $body, ['producao@tridiacriacao.com', 'assistenteti@anamatra.org.br'], '', '', true);

			// PRODUCAO
			// ThomisticusHelperMail::sendMail($subject, $body, $user->email, '', '', true);
		}

	}

	/**
	 * Apenas envia o email para os responsáveis da diretoria
	 */
	protected function postSaveComentarChamado()
	{
		$usersConsultaveis = OuvidoriaHelpersOuvidoria::getEmailsUsersConsultaveis($this->solicitacao->id_diretoria_responsavel);

		$subject  = JText::_('COM_OUVIDORIA_EMAILS_COMENTARIO_DO_SOLICITANTE_SUBJECT');
		$urlBotao = JUri::root() . 'index.php?option=com_ouvidoria&view=comentarios&solicitacao=' . $this->solicitacao->id . '&Itemid=587';

		foreach ($usersConsultaveis as $userId => $email) {
			$user = JFactory::getUser($userId);
			$body = JText::sprintf('COM_OUVIDORIA_EMAILS_COMENTARIO_DO_SOLICITANTE_BODY', $user->name, $this->solicitacao->protocolo, $this->solicitante->nome, $this->solicitante->cpf, $this->comentario->texto, $urlBotao);
			// LOCAL E HOMOLOG
			ThomisticusHelperMail::sendMail($subject, $body, ['producao@tridiacriacao.com', 'assistenteti@anamatra.org.br'], '', '', true);

			// PRODUCAO
			// ThomisticusHelperMail::sendMail($subject, $body, $user->email, '', '', true);
		}
	}

}
