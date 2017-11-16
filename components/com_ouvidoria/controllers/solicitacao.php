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
use Thomisticus\Utils\Ajax;

defined('_JEXEC') or die;

/**
 * Solicitacao controller class.
 *
 * @since  1.6
 */
class OuvidoriaControllerSolicitacao extends JControllerLegacy
{
	/**
	 * Method to check out an item for editing and redirect to the edit form.
	 *
	 * @return void
	 *
	 * @since    1.6
	 */
	public function edit()
	{
		$app = JFactory::getApplication();

		// Get the previous edit id (if any) and the current edit id.
		$previousId = (int)$app->getUserState('com_ouvidoria.edit.solicitacao.id');
		$editId     = $app->input->getInt('id', 0);

		// Set the user id for the user to edit in the session.
		$app->setUserState('com_ouvidoria.edit.solicitacao.id', $editId);

		// Get the model.
		$model = $this->getModel('Solicitacao', 'OuvidoriaModel');

		// Check out the item
		if ($editId) {
			$model->checkout($editId);
		}

		// Check in the previous user.
		if ($previousId && $previousId !== $editId) {
			$model->checkin($previousId);
		}

		// Redirect to the edit screen.
		$this->setRedirect(JRoute::_('index.php?option=com_ouvidoria&view=solicitacaoform&layout=edit', false));
	}

	/**
	 * Method to save a user's profile data.
	 *
	 * @return    void
	 *
	 * @throws Exception
	 * @since    1.6
	 */
	public function publish()
	{
		// Initialise variables.
		$app = JFactory::getApplication();

		// Checking if the user can remove object
		$user = JFactory::getUser();

		if ($user->authorise('core.edit', 'com_ouvidoria') || $user->authorise('core.edit.state', 'com_ouvidoria')) {
			$model = $this->getModel('Solicitacao', 'OuvidoriaModel');

			// Get the user data.
			$id    = $app->input->getInt('id');
			$state = $app->input->getInt('state');

			// Attempt to save the data.
			$return = $model->publish($id, $state);

			// Check for errors.
			if ($return === false) {
				$this->setMessage(JText::sprintf('Save failed: %s', $model->getError()), 'warning');
			}

			// Clear the profile id from the session.
			$app->setUserState('com_ouvidoria.edit.solicitacao.id', null);

			// Flush the data from the session.
			$app->setUserState('com_ouvidoria.edit.solicitacao.data', null);

			// Redirect to the list screen.
			$this->setMessage(JText::_('COM_OUVIDORIA_ITEM_SAVED_SUCCESSFULLY'));
			$menu = JFactory::getApplication()->getMenu();
			$item = $menu->getActive();

			if (!$item) {
				// If there isn't any menu item active, redirect to list view
				$this->setRedirect(JRoute::_('index.php?option=com_ouvidoria&view=solicitacoes', false));
			} else {
				$this->setRedirect(JRoute::_($item->link . $menuitemid, false));
			}
		} else {
			throw new Exception(500);
		}
	}

	/**
	 * Remove data
	 *
	 * @return void
	 *
	 * @throws Exception
	 */
	public function remove()
	{
		// Initialise variables.
		$app = JFactory::getApplication();

		// Checking if the user can remove object
		$user = JFactory::getUser();

		if ($user->authorise('core.delete', 'com_ouvidoria')) {
			$model = $this->getModel('Solicitacao', 'OuvidoriaModel');

			// Get the user data.
			$id = $app->input->getInt('id', 0);

			// Attempt to save the data.
			$return = $model->delete($id);

			// Check for errors.
			if ($return === false) {
				$this->setMessage(JText::sprintf('Delete failed', $model->getError()), 'warning');
			} else {
				// Check in the profile.
				if ($return) {
					$model->checkin($return);
				}

				$app->setUserState('com_ouvidoria.edit.inventory.id', null);
				$app->setUserState('com_ouvidoria.edit.inventory.data', null);

				$app->enqueueMessage(JText::_('COM_OUVIDORIA_ITEM_DELETED_SUCCESSFULLY'), 'success');
				$app->redirect(JRoute::_('index.php?option=com_ouvidoria&view=solicitacoes', false));
			}

			// Redirect to the list screen.
			$menu = JFactory::getApplication()->getMenu();
			$item = $menu->getActive();
			$this->setRedirect(JRoute::_($item->link, false));
		} else {
			throw new Exception(500);
		}
	}

	/**
	 * Finalizar chamado pelo solicitante via ajax (Botão "Finalizar Solicitação") - apenas para o usuário final
	 */
	public function finalizarSolicitacao()
	{
		$app = JFactory::getApplication();

		if (Ajax::isAjaxRequest()) {
			JFactory::getDocument()->setMimeEncoding('application/json');

			if ($idSolicitacao = $app->input->get('idSolicitacao')) {

				/** @var OuvidoriaModelSolicitacaoForm $model */
				$model                 = ThomisticusHelperComponent::getModel('SolicitacaoForm', 'com_ouvidoria');
				$solicitacao           = $model->getData($idSolicitacao);
				$solicitacao           = ArrayHelper::fromObject($solicitacao);
				$solicitacao['status'] = 6; // Finalizado

				$model->save($solicitacao);
				$this->sendEmailAfterFinalizacaoSolicitacao(ArrayHelper::toObject($solicitacao));

				echo new JResponseJson(null, null);
			}
		}

		$app->close();
	}

	/**
	 * Envio de e-mails para os responsáveis da solicitação quando o solicitante realizar a finalização
	 *
	 * @param $solicitacao
	 */
	private function sendEmailAfterFinalizacaoSolicitacao($solicitacao)
	{
		$usersConsultaveis = OuvidoriaHelpersOuvidoria::getEmailsUsersConsultaveis($solicitacao->id_diretoria_responsavel);

		/** @var OuvidoriaModelSolicitante $modelSolicitante */
		$modelSolicitante = ThomisticusHelperComponent::getModel('Solicitante');
		$solicitante      = $modelSolicitante->getData($solicitacao->id_solicitante);

		$subject = JText::_('COM_OUVIDORIA_EMAILS_FINALIZACAO_SOLICITACAO_SUBJECT');

		foreach ($usersConsultaveis as $userId => $email) {
			$user = JFactory::getUser($userId);
			$body = JText::sprintf('COM_OUVIDORIA_EMAILS_FINALIZACAO_SOLICITACAO_BODY', $user->name, $solicitante->nome, $solicitacao->protocolo);
			// LOCAL E HOMOLOG
			ThomisticusHelperMail::sendMail($subject, $body, ['producao@tridiacriacao.com', 'assistenteti@anamatra.org.br'], '', '', true);

			// PRODUCAO
			// ThomisticusHelperMail::sendMail($subject, $body, $user->email, '', '', true);
		}
	}
}