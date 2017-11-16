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

jimport('joomla.application.component.controllerform');

/**
 * Associado controller class.
 *
 * @since  1.6
 */
class AssociadosControllerAssociado extends JControllerForm
{
    /**
     * Constructor
     *
     * @throws Exception
     */
    public function __construct()
    {
        $this->view_list = 'associados';
        parent::__construct();
    }

    /**
     * OVERWRITING a função de salvar do JControllerForm para adicionar a função de verificar o usuário ao salvar
     *
     * Method to save a record.
     *
     * @param   string $key The name of the primary key of the URL variable.
     * @param   string $urlVar The name of the URL variable if different from the primary key (sometimes required to avoid router collisions).
     *
     * @return  boolean  True if successful, false otherwise.
     *
     * @since   12.2
     */
    public function save($key = null, $urlVar = null)
    {
        // Check for request forgeries.
        JSession::checkToken() or jexit(JText::_('JINVALID_TOKEN'));

        $app = JFactory::getApplication();
        $lang = JFactory::getLanguage();
        $model = $this->getModel();
        $table = $model->getTable();
        $data = $this->input->post->get('jform', array(), 'array');
        $checkin = property_exists($table, 'checked_out');
        $context = "$this->option.edit.$this->context";
        $task = $this->getTask();

        // Determine the name of the primary key for the data.
        if (empty($key)) {
            $key = $table->getKeyName();
        }

        // To avoid data collisions the urlVar may be different from the primary key.
        if (empty($urlVar)) {
            $urlVar = $key;
        }

        $recordId = $this->input->getInt($urlVar);

        // Populate the row id from the session.
        $data[$key] = $recordId;

        // The save2copy task needs to be handled slightly differently.
        if ($task == 'save2copy') {
            // Check-in the original row.
            if ($checkin && $model->checkin($data[$key]) === false) {
                // Check-in failed. Go back to the item and display a notice.
                $this->setError(JText::sprintf('JLIB_APPLICATION_ERROR_CHECKIN_FAILED', $model->getError()));
                $this->setMessage($this->getError(), 'error');

                $this->setRedirect(
                    JRoute::_(
                        'index.php?option=' . $this->option . '&view=' . $this->view_item
                        . $this->getRedirectToItemAppend($recordId, $urlVar), false
                    )
                );

                return false;
            }

            // Reset the ID, the multilingual associations and then treat the request as for Apply.
            $data[$key] = 0;
            $data['associations'] = array();
            $task = 'apply';
        }

        // Access check.
        if (!$this->allowSave($data, $key)) {
            $this->setError(JText::_('JLIB_APPLICATION_ERROR_SAVE_NOT_PERMITTED'));
            $this->setMessage($this->getError(), 'error');

            $this->setRedirect(
                JRoute::_(
                    'index.php?option=' . $this->option . '&view=' . $this->view_list
                    . $this->getRedirectToListAppend(), false
                )
            );

            return false;
        }

        // Validate the posted data.
        // Sometimes the form needs some posted data, such as for plugins and modules.
        $form = $model->getForm($data, false);

        if (!$form) {
            $app->enqueueMessage($model->getError(), 'error');

            return false;
        }

        // Test whether the data is valid.
        $validData = $model->validate($form, $data);

        // Check for validation errors.
        if ($validData === false) {
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
            $app->setUserState($context . '.data', $data);

            // Redirect back to the edit screen.
            $this->setRedirect(
                JRoute::_(
                    'index.php?option=' . $this->option . '&view=' . $this->view_item
                    . $this->getRedirectToItemAppend($recordId, $urlVar), false
                )
            );

            return false;
        }

        if (!isset($validData['tags'])) {
            $validData['tags'] = null;
        }

        // Attempt to save the data.
        if (!$model->save($validData)) {
            // Save the data in the session.
            $app->setUserState($context . '.data', $validData);

            // Redirect back to the edit screen.
            $this->setError(JText::sprintf('JLIB_APPLICATION_ERROR_SAVE_FAILED', $model->getError()));
            $this->setMessage($this->getError(), 'error');

            $this->setRedirect(
                JRoute::_(
                    'index.php?option=' . $this->option . '&view=' . $this->view_item
                    . $this->getRedirectToItemAppend($recordId, $urlVar), false
                )
            );

            return false;
        }

        // Save succeeded, so check-in the record.
        if ($checkin && $model->checkin($validData[$key]) === false) {
            // Save the data in the session.
            $app->setUserState($context . '.data', $validData);

            // Check-in failed, so go back to the record and display a notice.
            $this->setError(JText::sprintf('JLIB_APPLICATION_ERROR_CHECKIN_FAILED', $model->getError()));
            $this->setMessage($this->getError(), 'error');

            $this->setRedirect(
                JRoute::_(
                    'index.php?option=' . $this->option . '&view=' . $this->view_item
                    . $this->getRedirectToItemAppend($recordId, $urlVar), false
                )
            );

            return false;
        }

        $langKey = $this->text_prefix . ($recordId == 0 && $app->isSite() ? '_SUBMIT' : '') . '_SAVE_SUCCESS';
        $prefix = JFactory::getLanguage()->hasKey($langKey) ? $this->text_prefix : 'JLIB_APPLICATION';

        $this->setMessage(JText::_($prefix . ($recordId == 0 && $app->isSite() ? '_SUBMIT' : '') . '_SAVE_SUCCESS'));

        $userID = $data["user_id"];
        $stateAmatra = $data["state_amatra"];
        $stateAnamatra = $data["state_anamatra"];
        $situacaoAssociado = $data["situacao_do_associado"];

        // Redirect the user and adjust session state based on the chosen task.
        switch ($task) {
            case 'apply':
                // Set the record data in the session.
                $recordId = $model->getState($this->context . '.id');
                $this->holdEditId($context, $recordId);
                $app->setUserState($context . '.data', null);
                $model->checkout($recordId);

                self::editUserJoomla($userID, $stateAmatra, $stateAnamatra, $situacaoAssociado);

                // Redirect back to the edit screen.
                $this->setRedirect(
                    JRoute::_(
                        'index.php?option=' . $this->option . '&view=' . $this->view_item
                        . $this->getRedirectToItemAppend($recordId, $urlVar), false
                    )
                );
                break;

            case 'save2new':
                // Clear the record id and data from the session.
                $this->releaseEditId($context, $recordId);
                $app->setUserState($context . '.data', null);

                self::editUserJoomla($userID, $stateAmatra, $stateAnamatra, $situacaoAssociado);

                // Redirect back to the edit screen.
                $this->setRedirect(
                    JRoute::_(
                        'index.php?option=' . $this->option . '&view=' . $this->view_item
                        . $this->getRedirectToItemAppend(null, $urlVar), false
                    )
                );
                break;

            default:
                // Clear the record id and data from the session.
                $this->releaseEditId($context, $recordId);
                $app->setUserState($context . '.data', null);

                self::editUserJoomla($userID, $stateAmatra, $stateAnamatra, $situacaoAssociado);

                // Redirect to the list screen.
                $this->setRedirect(
                    JRoute::_(
                        'index.php?option=' . $this->option . '&view=' . $this->view_list
                        . $this->getRedirectToListAppend(), false
                    )
                );
                break;
        }


        // Invoke the postSave method to allow for the child class to access the model.
        $this->postSaveHook($model, $validData);

        return true;
    }

    /**
     * Método para verificar o Usuário Joomla de determinado Associado
     * Irá criar um usuário do Joomla ao salvar o form (caso atenda as condições: Situação Amatra e Anamatra = Aprovado e Situação do Associado = Ativo)
     * caso o usuário já exista, verificará as condições citadas acima e se é necessário ou não bloquear o usuário do Joomla
     *
     * @param integer $userID
     * @param integer $stateAmatra
     * @param integer $stateAnamatra
     * @param integer $situacaoAssociado
     * @return bool
     */
    public function editUserJoomla($userID, $stateAmatra, $stateAnamatra, $situacaoAssociado)
    {
        $modelAssociado = $this->getModel('associado');

        //Se o $userID for vazio, significa que não possui usuário cadastrado --> irá tentar criar usuário
        if (empty($userID)) {
            $modelAssociado->exportUsers();
            return true;
        }

        // // Se a situação da anamatra/amatra/associado for diferente de 1 (Ativo/Aprovado) irá bloquear o usuário e sair da função
        // if (!empty($userID) && ($situacaoAssociado != 1 || $stateAmatra != 1 || $stateAnamatra != 1)) {
        //     $modelAssociado->setBlock($userID, true);
        //     return false;
        // }

        // // Se a função chegar aqui, irá
        // $modelAssociado->setBlock($userID, false);
        // return false;
    }

}
