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

jimport('joomla.application.component.modeladmin');
require_once(JPATH_COMPONENT_SITE . '/helpers/dates.php');

/**
 * Associados model.
 *
 * @since  1.6
 */
class AssociadosModelAssociado extends JModelAdmin
{
    /**
     * @var      string    The prefix to use with controller messages.
     * @since    1.6
     */
    protected $text_prefix = 'COM_ASSOCIADOS';

    /**
     * @var    string    Alias to manage history control
     * @since   3.2
     */
    public $typeAlias = 'com_associados.associado';

    /**
     * @var null  Item data
     * @since  1.6
     */
    protected $item = null;

    /**
     * Returns a reference to the a Table object, always creating it.
     *
     * @param   string $type The table type to instantiate
     * @param   string $prefix A prefix for the table class name. Optional.
     * @param   array $config Configuration array for model. Optional.
     *
     * @return    JTable    A database object
     *
     * @since    1.6
     */
    public function getTable($type = 'Associado', $prefix = 'AssociadosTable', $config = array())
    {
        return JTable::getInstance($type, $prefix, $config);
    }

    /**
     * Method to get the record form.
     *
     * @param   array $data An optional array of data for the form to interogate.
     * @param   boolean $loadData True if the form is to load its own data (default case), false if not.
     *
     * @return  JForm  A JForm object on success, false on failure
     *
     * @since    1.6
     */
    public function getForm($data = array(), $loadData = true)
    {
        // Initialise variables.
        $app = JFactory::getApplication();

        // Get the form.
        $form = $this->loadForm(
            'com_associados.associado', 'associado',
            array(
                'control' => 'jform',
                'load_data' => $loadData
            )
        );

        if (empty($form)) {
            return false;
        }

        return $form;
    }

    /**
     * Method to get the data that should be injected in the form.
     *
     * @return   mixed  The data for the form.
     *
     * @since    1.6
     */
    protected function loadFormData()
    {
        // Check the session for previously entered form data.
        $data = JFactory::getApplication()->getUserState('com_associados.edit.associado.data', array());

        if (empty($data)) {
            if ($this->item === null) {
                $this->item = $this->getItem();
            }

            $data = $this->item;

            // Support for multiple or not foreign key field: eventos_que_participou_jogos_nacionais
            $array = array();
            foreach ((array)$data->eventos_que_participou_jogos_nacionais as $value):
                if (!is_array($value)):
                    $array[] = $value;
                endif;
            endforeach;
            $data->eventos_que_participou_jogos_nacionais = implode(',', $array);

            // Support for multiple or not foreign key field: eventos_que_participou_conamat
            $array = array();
            foreach ((array)$data->eventos_que_participou_conamat as $value):
                if (!is_array($value)):
                    $array[] = $value;
                endif;
            endforeach;
            $data->eventos_que_participou_conamat = implode(',', $array);

            // Support for multiple or not foreign key field: eventos_que_participou_congresso_internacional
            $array = array();
            foreach ((array)$data->eventos_que_participou_congresso_internacional as $value):
                if (!is_array($value)):
                    $array[] = $value;
                endif;
            endforeach;
            $data->eventos_que_participou_congresso_internacional = implode(',', $array);

            // Support for multiple or not foreign key field: eventos_que_participou_encontro_aposentados
            $array = array();
            foreach ((array)$data->eventos_que_participou_encontro_aposentados as $value):
                if (!is_array($value)):
                    $array[] = $value;
                endif;
            endforeach;
            $data->eventos_que_participou_encontro_aposentados = implode(',', $array);
        }

        return $data;
    }

    /**
     * Method to get a single record.
     *
     * @param   integer $pk The id of the primary key.
     *
     * @return  mixed    Object on success, false on failure.
     *
     * @since    1.6
     */
    public function getItem($pk = null)
    {
        if ($item = parent::getItem($pk)) {
            // Do any procesing on fields here if needed
        }

        // Tratamento das datas para o formato d/m/Y
	    $item = AssociadosHelpersDates::treatFormDates($item, 'd/m/Y');

        return $item;
    }

    /**
     * Method to duplicate an Associado
     *
     * @param   array &$pks An array of primary key IDs.
     *
     * @return  boolean  True if successful.
     *
     * @throws  Exception
     */
    public function duplicate(&$pks)
    {
        $user = JFactory::getUser();

        // Access checks.
        if (!$user->authorise('core.create', 'com_associados')) {
            throw new Exception(JText::_('JERROR_CORE_CREATE_NOT_PERMITTED'));
        }

        $dispatcher = JEventDispatcher::getInstance();
        $context = $this->option . '.' . $this->name;

        // Include the plugins for the save events.
        JPluginHelper::importPlugin($this->events_map['save']);

        $table = $this->getTable();

        foreach ($pks as $pk) {
            if ($table->load($pk, true)) {
                // Reset the id to create a new record.
                $table->id = 0;

                if (!$table->check()) {
                    throw new Exception($table->getError());
                }

                if (!empty($table->situacao_do_associado)) {
                    if (is_array($table->situacao_do_associado)) {
                        $table->situacao_do_associado = implode(',', $table->situacao_do_associado);
                    }
                } else {
                    $table->situacao_do_associado = '';
                }

                if (!empty($table->estado)) {
                    if (is_array($table->estado)) {
                        $table->estado = implode(',', $table->estado);
                    }
                } else {
                    $table->estado = '';
                }

                if (!empty($table->cidade)) {
                    if (is_array($table->cidade)) {
                        $table->cidade = implode(',', $table->cidade);
                    }
                } else {
                    $table->cidade = '';
                }


                // Trigger the before save event.
                $result = $dispatcher->trigger($this->event_before_save, array($context, &$table, true));

                if (in_array(false, $result, true) || !$table->store()) {
                    throw new Exception($table->getError());
                }

                // Trigger the after save event.
                $dispatcher->trigger($this->event_after_save, array($context, &$table, true));
            } else {
                throw new Exception($table->getError());
            }
        }

        // Clean cache
        $this->cleanCache();

        return true;
    }

    /**
     * Prepare and sanitise the table prior to saving.
     *
     * @param   JTable $table Table Object
     *
     * @return void
     *
     * @since    1.6
     */
    protected function prepareTable($table)
    {
        jimport('joomla.filter.output');

        if (empty($table->id)) {
            // Set ordering to the last item if not set
            if (@$table->ordering === '') {
                $db = JFactory::getDbo();
                $db->setQuery('SELECT MAX(ordering) FROM #__associados');
                $max = $db->loadResult();
                $table->ordering = $max + 1;
            }
        }
    }


    public function exportUsers()
    {

        $mainframe = JFactory::getApplication();

        //Pegando o id do associado da url
        $cid = $mainframe->input->get(id);

        // Create a new query object.
        $db = $this->getDbo();
        $query = $db->getQuery(true);

        // Select the required fields from the table.
        $query->select(
            $this->getState(
                'list.select', 'a.*'
            )
        );

        $query->from('`#__associados` AS a');
        // $query->where('a.state_anamatra = 1');
        // $query->where('a.state_amatra = 1');
        $query->where('(a.id IN (' . $cid . '))');

        // Join over the categorie 'amatra'
        $query->select('`ass`.state_anamatra as fi_amatra, `ass`.state_amatra');
        $query->join('LEFT', '#__associados AS `ass` ON (`ass`.id IN (' . $cid . '))');


        // Join over the categorie 'amatra'
        $query->select('`catamatra`.title, `catamatra`.id AS catamatraid');
        $query->join('LEFT', '#__categories AS `catamatra` ON `catamatra`.id = a.`amatra`');

        // Join over the usergroups 'amatra'
        $query->select('`amatra`.title AS `amatratitle`, `amatra`.id as iduseramatra');
        $query->join('LEFT', '#__usergroups AS `amatra` ON `amatra`.title = `catamatra`.title');

        $db->setQuery($query);


        $associados = $db->loadObjectList();


        $Uparams = JComponentHelper::getParams('com_users');

        foreach ($associados as $key => $associado) {

            if ($associado->state_amatra == 1 && $associado->state_anamatra == 1 && $associado->situacao_do_associado == 1) {

                $defaultUserGroup = $associado->iduseramatra;

                $pass = $associado->cpf;

                // Initialise the table with JUser.
                $user = new JUser;

                $data['name'] = $associado->nome;
                //cria user name
                $dominio = strstr($associado->email, '@');
                $data['username'] = str_replace($dominio, '', $associado->email);
                $data['email1'] = $associado->email;
                $data['password'] = $pass;
                $data['password1'] = $pass;
                $data['groups'] = array($defaultUserGroup);

                // Prepare the data for the user object.
                $data['email'] = JStringPunycode::emailToPunycode($data['email1']);
                $data['password'] = $data['password1'];
                $useractivation = $Uparams->get('useractivation');
                $sendpassword = $Uparams->get('sendpassword', 1);

                JFactory::getApplication()->enqueueMessage('Usuário(s) Registrado(s) com sucesso!');

                // Check if the user needs to activate their account.
                if (($useractivation == 1) || ($useractivation == 2)) {
                    $data['activation'] = 0;
                    $data['block'] = 0;
                }

                // Bind the data.
                if (!$user->bind($data)) {
                    $this->setError(JText::sprintf('COM_USERS_REGISTRATION_BIND_FAILED', $user->getError()));
                    return false;
                }

                // Load the users plugin group.
                JPluginHelper::importPlugin('user');

                // Store the data.
                if (!$user->save()) {
                    $this->setError($user->getError());
                    return false;
                }

                // Atualizando a coluna user_id do associado com o valor do seu usuário criado
                $query2 = $db->getQuery(true);
                $query2
                    ->update('#__associados')
                    ->set('user_id = ' . $user->id)
                    ->where('id = ' . $associado->id);
                $db->setQuery($query2);
                $db->execute();

            } else {

                JError::raiseWarning(100,
                    'Impossível criar login e senha. Usuário não aprovado por Amatra e/ou Anamatra');
            }
        }

        return true;

    }

	/**
	 * Atualizar o lastPasswordRedefine do associado (data e hora que algum administrador redefiniu a senha deste user)
	 * @param integer $pk = ID do associado
	 * @param null|string $dateTime = Data e hora
	 *
	 * @since version
	 */
    public function setLastPasswordRedefineByAnamatra($pk, $dateTime = null)
    {
    	if (is_null($dateTime)) {
    		$dateTime = JFactory::getDate('now', JFactory::getConfig()->get('offset'))->toSql(true);
	    }

	    $db = JFactory::getDbo();
		$query = $db->getQuery(true);
		$query->update('#__associados')->set('lastPasswordRedefineByAnamatra = ' . $db->quote($dateTime))->where('id = ' . $pk);
	    $db->setQuery($query)->execute();
    }
}
