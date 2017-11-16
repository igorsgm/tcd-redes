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
include_once(JPATH_COMPONENT . '/helpers/httpful.phar');

/**
 * Associado controller class.
 *
 * @since  1.6
 */
class AssociadosControllerAssociadoForm extends JControllerForm
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
		$previousId = (int)$app->getUserState('com_associados.edit.associado.id');
		$editId = $app->input->getInt('id', 0);

		// Set the user id for the user to edit in the session.
		$app->setUserState('com_associados.edit.associado.id', $editId);

		// Get the model.
		$model = $this->getModel('AssociadoForm', 'AssociadosModel');

		// Check out the item
		if ($editId) {
			$model->checkout($editId);
		}

		// Check in the previous user.
		if ($previousId) {
			$model->checkin($previousId);
		}

		// Redirect to the edit screen.
		$this->setRedirect(JRoute::_('index.php?option=com_associados&view=associadoform&layout=edit', false));
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
		$app = JFactory::getApplication();
		$model = $this->getModel('AssociadoForm', 'AssociadosModel');

		// Get the user data.
		$data = JFactory::getApplication()->input->get('jform', array(), 'array');

		// Validate the posted data.
		$form = $model->getForm();

		if (!$form) {
			throw new Exception($model->getError(), 500);
		}

		$idAssociado = $data['id'];
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
			$app->setUserState('com_associados.edit.associado.data', $jform);

			// Redirect back to the edit screen.
			$id = (int) $app->getUserState('com_associados.edit.associado.id');

			if (empty($id)) {
				$id = $idAssociado;
			}

			$this->setRedirect(JRoute::_('index.php?option=com_associados&view=associadoform&layout=edit&id=' . $id));

			return null;
		}

		$data = $this->sanitizeCpfs($data);

		// Attempt to save the data.
		$return = $model->save($data);

		// Check for errors.
		if ($return === false) {
			// Save the data in the session.
			$app->setUserState('com_associados.edit.associado.data', $data);

			// Redirect back to the edit screen.
			$id = (int)$app->getUserState('com_associados.edit.associado.id');
			$this->setMessage(JText::sprintf('Save failed', $model->getError()), 'warning');
			$this->setRedirect(JRoute::_('index.php?option=com_associados&view=associadoform&layout=edit&id=' . $id,
				false));
		}

		// Check in the profile.
		if ($return) {
			$model->checkin($return);
		}

		// Clear the profile id from the session.
		$app->setUserState('com_associados.edit.associado.id', null);

		// Redirect to the list screen.
		$this->setMessage(JText::_('COM_ASSOCIADOS_ITEM_SAVED_SUCCESSFULLY'));
		$menu = JFactory::getApplication()->getMenu();
//		$item = $menu->getActive();

		JFactory::getSession()->set('application.queue', null);

		$user = JFactory::getUser();
		if (in_array('42', $user->groups) || in_array('53', $user->groups)) {
			$this->setRedirect(JRoute::_('index.php?option=com_associados&view=associados',false));
		}else{

			$this->setRedirect(JRoute::_('index.php?option=com_associados&view=associadoform&layout=thanksmessage&id='. $model->getCadastroAssociadoID(JFactory::getUser()->id)->id,false));
		}

		// Flush the data from the session.
		$app->setUserState('com_associados.edit.associado.data', null);

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
		$editId = (int)$app->getUserState('com_associados.edit.associado.id');

		// Get the model.
		$model = $this->getModel('AssociadoForm', 'AssociadosModel');

		// Check in the item
		if ($editId) {
			$model->checkin($editId);
		}

		$menu = JFactory::getApplication()->getMenu();
		$item = $menu->getActive();
		$url = (empty($item->link) ? 'index.php?option=com_associados&view=associados' : $item->link);
		$this->setRedirect(JRoute::_($url, false));
	}

	/**
	 * Method to remove data
	 *
	 * @return void
	 *
	 * @throws Exception
	 */
	public function remove()
	{
		// Initialise variables.
		$app = JFactory::getApplication();
		$model = $this->getModel('AssociadoForm', 'AssociadosModel');

		// Get the user data.
		$data = array();
		$data['id'] = $app->input->getInt('id');

		// Check for errors.
		if (empty($data['id'])) {
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

			// Save the data in the session.
			$app->setUserState('com_associados.edit.associado.data', $data);

			// Redirect back to the edit screen.
			$id = (int)$app->getUserState('com_associados.edit.associado.id');
			$this->setRedirect(JRoute::_('index.php?option=com_associados&view=associado&layout=edit&id=' . $id,
				false));
		}

		// Attempt to save the data.
		$return = $model->delete($data);

		// Check for errors.
		if ($return === false) {
			// Save the data in the session.
			$app->setUserState('com_associados.edit.associado.data', $data);

			// Redirect back to the edit screen.
			$id = (int)$app->getUserState('com_associados.edit.associado.id');
			$this->setMessage(JText::sprintf('Delete failed', $model->getError()), 'warning');
			$this->setRedirect(JRoute::_('index.php?option=com_associados&view=associado&layout=edit&id=' . $id,
				false));
		}

		// Check in the profile.
		if ($return) {
			$model->checkin($return);
		}

		// Clear the profile id from the session.
		$app->setUserState('com_associados.edit.associado.id', null);

		// Redirect to the list screen.
		$this->setMessage(JText::_('COM_ASSOCIADOS_ITEM_DELETED_SUCCESSFULLY'));
		$menu = JFactory::getApplication()->getMenu();
		$item = $menu->getActive();
		$url = (empty($item->link) ? 'index.php?option=com_associados&view=associados' : $item->link);
		$this->setRedirect(JRoute::_($url, false));

		// Flush the data from the session.
		$app->setUserState('com_associados.edit.associado.data', null);
	}

	public function sanitizeCpfs($data)
	{
		$data['cpf'] = preg_replace('/\D/', '', $data['cpf']);

		foreach ($data['dependentes'] as $key => $value)
		{
			$data['dependentes'][$key]['dependente_cpf'] = preg_replace('/\D/', '', $value['dependente_cpf']);
		}

		return $data;
	}
}
