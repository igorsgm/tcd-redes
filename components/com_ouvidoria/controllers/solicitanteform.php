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

defined('_JEXEC') or die;

/**
 * Solicitante controller class.
 *
 * @since  1.6
 */
class OuvidoriaControllerSolicitanteForm extends JControllerForm
{
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
		$previousId = (int)$app->getUserState('com_ouvidoria.edit.solicitante.id');
		$editId     = $app->input->getInt('id', 0);

		// Set the user id for the user to edit in the session.
		$app->setUserState('com_ouvidoria.edit.solicitante.id', $editId);

		// Get the model.
		$model = $this->getModel('SolicitanteForm', 'OuvidoriaModel');

		// Check out the item
		if ($editId) {
			$model->checkout($editId);
		}

		// Check in the previous user.
		if ($previousId) {
			$model->checkin($previousId);
		}

		// Redirect to the edit screen.
		$this->setRedirect(JRoute::_('index.php?option=com_ouvidoria&view=solicitanteform&layout=edit', false));
	}

	/**
	 * Method to save a user's profile data.
	 * Only used as ajax request from solicitacaoform
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

			/** @var OuvidoriaModelSolicitanteForm $model */
			$model = $this->getModel('SolicitanteForm', 'OuvidoriaModel');

			// Get the user data.
			$data = JFactory::getApplication()->input->get('jform', array(), 'array');

			// Validate the posted data.
			$form = $model->getForm();

			if (!$form) {
				echo new JResponseJson($model->getError(), 500, true);
				$app->close();
			}

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

					/** @var OuvidoriaModelSolicitante $model */
					$model = $this->getModel('Solicitante', 'OuvidoriaModel');

					$response = $model->getData($response);

					$app->setUserState('com_ouvidoria.edit.solicitante.data', $response);
				}

				echo new JResponseJson($response);
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
		$editId = (int)$app->getUserState('com_ouvidoria.edit.solicitante.id');

		// Get the model.
		$model = $this->getModel('SolicitanteForm', 'OuvidoriaModel');

		// Check in the item
		if ($editId) {
			$model->checkin($editId);
		}

		$menu = JFactory::getApplication()->getMenu();
		$item = $menu->getActive();
		$url  = (empty($item->link) ? 'index.php?option=com_ouvidoria&view=solicitantes' : $item->link);
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
		$model = $this->getModel('SolicitanteForm', 'OuvidoriaModel');
		$pk    = $app->input->getInt('id');

		// Attempt to save the data
		try {
			$return = $model->delete($pk);

			// Check in the profile
			$model->checkin($return);

			// Clear the profile id from the session.
			$app->setUserState('com_ouvidoria.edit.solicitante.id', null);

			$menu = $app->getMenu();
			$item = $menu->getActive();
			$url  = (empty($item->link) ? 'index.php?option=com_ouvidoria&view=solicitantes' : $item->link);

			// Redirect to the list screen
			$this->setMessage(JText::_('COM_EXAMPLE_ITEM_DELETED_SUCCESSFULLY'));
			$this->setRedirect(JRoute::_($url, false));

			// Flush the data from the session.
			$app->setUserState('com_ouvidoria.edit.solicitante.data', null);
		} catch (Exception $e) {
			$errorType = ($e->getCode() == '404') ? 'error' : 'warning';
			$this->setMessage($e->getMessage(), $errorType);
			$this->setRedirect('index.php?option=com_ouvidoria&view=solicitantes');
		}
	}

}
