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
use Thomisticus\Utils\Strings;

defined('_JEXEC') or die;

/**
 * Solicitante controller class.
 *
 * @since  1.6
 */
class OuvidoriaControllerSolicitante extends JControllerLegacy
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
		$previousId = (int)$app->getUserState('com_ouvidoria.edit.solicitante.id');
		$editId     = $app->input->getInt('id', 0);

		// Set the user id for the user to edit in the session.
		$app->setUserState('com_ouvidoria.edit.solicitante.id', $editId);

		// Get the model.
		$model = $this->getModel('Solicitante', 'OuvidoriaModel');

		// Check out the item
		if ($editId) {
			$model->checkout($editId);
		}

		// Check in the previous user.
		if ($previousId && $previousId !== $editId) {
			$model->checkin($previousId);
		}

		// Redirect to the edit screen.
		$this->setRedirect(JRoute::_('index.php?option=com_ouvidoria&view=solicitanteform&layout=edit', false));
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
			$model = $this->getModel('Solicitante', 'OuvidoriaModel');

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
			$app->setUserState('com_ouvidoria.edit.solicitante.id', null);

			// Flush the data from the session.
			$app->setUserState('com_ouvidoria.edit.solicitante.data', null);

			// Redirect to the list screen.
			$this->setMessage(JText::_('COM_OUVIDORIA_ITEM_SAVED_SUCCESSFULLY'));
			$menu = JFactory::getApplication()->getMenu();
			$item = $menu->getActive();

			if (!$item) {
				// If there isn't any menu item active, redirect to list view
				$this->setRedirect(JRoute::_('index.php?option=com_ouvidoria&view=solicitantes', false));
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
			$model = $this->getModel('Solicitante', 'OuvidoriaModel');

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
				$app->redirect(JRoute::_('index.php?option=com_ouvidoria&view=solicitantes', false));
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
	 * Trazer os dados do solicitante via Ajax
	 */
	public function getSolicitanteByCpf()
	{
		$app = JFactory::getApplication();

		if (Ajax::isAjaxRequest()) {
			JFactory::getDocument()->setMimeEncoding('application/json');

			if ($cpf = $app->input->get('cpf')) {
				$idSolicitante = ThomisticusHelperModel::select('#__ouvidoria_solicitantes', 'id', array('cpf' => $cpf, 'state' => 1), 'Result');

				if (empty($idSolicitante)) {
					$data = ['is_associado' => !empty(ThomisticusHelperModel::select('#__associados', 'id', ['cpf' => $cpf, 'state' => 1], 'Result'))];
					echo new JResponseJson($data, 'Solicitante não encontrado na base de dados.', true);
					$app->close();
				}

				/** @var OuvidoriaModelSolicitanteForm $model */
				$model = ThomisticusHelperComponent::getModel('SolicitanteForm');

				$solicitante               = $model->getData($idSolicitante);
				$solicitante->cpf          = Strings::mask($solicitante->cpf, '000.000.000-00');
				$solicitante->is_associado = !empty($solicitante->is_associado) ? 1 : 0;

				$message = $solicitante->is_associado ? "O solicitante é um associado e deve estar logado" : null;

				echo new JResponseJson($solicitante, $message, empty($solicitante));
			}
		}

		$app->close();
	}

	/**
	 * Caso não esteja logado retornará a URL da view de login já com a URL de return (para onde será redirecionada assim que o usuário autenticar)
	 * É chamado no JavaScript da view de solicitaçãoform (solicitacao.js), quando o usuário clicar em "É associado Anamatra?" = SIM
	 */
	public function verifyIsAssociadoAndNotLoggedInOnButtonClick()
	{
		$app = JFactory::getApplication();

		if ($app->isClient('site') && !JFactory::getUser()->id) {
			$return = htmlspecialchars_decode(JRoute::_(JUri::root() . 'index.php?option=com_ouvidoria&view=solicitacaoform') . '&assocredirected=true');
			$url    = htmlspecialchars_decode(JRoute::_(JUri::root() . 'index.php?option=com_users&view=login')) . '&return=' . base64_encode($return);

			echo new JResponseJson($url, null, empty($url));
		}

		$app->close();
	}


	/**
	 * Caso não esteja logado retornará a URL da view de login já com a URL de return (para onde será redirecionada assim que o usuário autenticar)
	 * É chamado no JavaScript da view de solicitaçãoform (solicitacao.js), quando o usuário preencher completamente o campo do CPF e após a verificação se é um solicitante ou não
	 */
	public function verifyIsAssociadoAndNotLoggedInOnCpfFilled()
	{
		$app = JFactory::getApplication();
		$cpf = $app->input->get('cpf');

		if ($app->isClient('site') && !JFactory::getUser()->id && strlen($cpf) == 11) {
			$idAssociado = ThomisticusHelperModel::select('#__associados', 'id', ['state' => 1, 'cpf' => $cpf], 'Result');

			$return = htmlspecialchars_decode(JRoute::_(JUri::root() . 'index.php?option=com_ouvidoria&view=solicitacaoform') . '&assocredirected=true');
			$url    = htmlspecialchars_decode(JRoute::_(JUri::root() . 'index.php?option=com_users&view=login')) . '&return=' . base64_encode($return);

			$message = empty($idAssociado) ? ('Não foi encontrado nenhum associado com o CPF: ' . $cpf) : ('O associado com o CPF: ' . $cpf . ' possui o ID: ' . $idAssociado);
			echo new JResponseJson($url, $message, empty($idAssociado));
		}

		$app->close();
	}
}
