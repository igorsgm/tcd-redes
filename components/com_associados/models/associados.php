<?php

/**
 * @version    CVS: 1.0.9
 * @package    Com_Associados
 * @author     Trídia Criação <atendimento@tridiacriacao.com>
 * @copyright  2016 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
defined('_JEXEC') or die;

jimport('joomla.application.component.modellist');

/**
 * Methods supporting a list of Associados records.
 *
 * @since  1.6
 */
class AssociadosModelAssociados extends JModelList
{
	/**
	 * Constructor.
	 *
	 * @param   array  $config  An optional associative array of configuration settings.
	 *
	 * @see        JController
	 * @since      1.6
	 */
	public function __construct($config = array())
	{
		if (empty($config['filter_fields']))
		{
			$config['filter_fields'] = array(
				'id', 'a.id',
				'state', 'a.state',
				'user_id', 'a.user_id',
				'state_anamatra', 'a.state_anamatra',
				'state_amatra', 'a.state_amatra',
				'amatra', 'a.amatra',
				'situacao_do_associado', 'a.situacao_do_associado',
				'tratamento', 'a.tratamento',
				'nome', 'a.nome',
				'email', 'a.email',
				'nascimento', 'a.nascimento',
				'naturalidade', 'a.naturalidade',
				'sexo', 'a.sexo',
				'cpf', 'a.cpf',
				'rg', 'a.rg',
				'orgao_expeditor', 'a.orgao_expeditor',
				'data_emissao', 'a.data_emissao',
				'dt_ingresso_magistratura', 'a.dt_ingresso_magistratura',
				'dt_filiacao_anamatra', 'a.dt_filiacao_anamatra',
				'tribunal', 'a.tribunal',
				'dirigente', 'a.dirigente',
				'cargo', 'a.cargo',
				'cargo_associado_honorario', 'a.cargo_associado_honorario',
				'estado_civil', 'a.estado_civil',
				'endereco', 'a.endereco',
				'logradouro', 'a.logradouro',
				'numero', 'a.numero',
				'complemento', 'a.complemento',
				'bairro', 'a.bairro',
				'estado', 'a.estado',
				'cidade', 'a.cidade',
				'cep', 'a.cep',
				'observacoes', 'a.observacoes',
				'email_alternativo', 'a.email_alternativo',
				'fone_residencial', 'a.fone_residencial',
				'fone_comercial', 'a.fone_comercial',
				'fone_celular', 'a.fone_celular',
				'fone_fax', 'a.fone_fax',
				'possui_dependentes', 'a.possui_dependentes',
				'dependentes', 'a.dependentes',
				'eventos_que_participou_jogos_nacionais', 'a.eventos_que_participou_jogos_nacionais',
				'eventos_que_participou_conamat', 'a.eventos_que_participou_conamat',
				'eventos_que_participou_congresso_internacional', 'a.eventos_que_participou_congresso_internacional',
				'eventos_que_participou_encontro_aposentados', 'a.eventos_que_participou_encontro_aposentados',
				'eventos_que_participou_outros', 'a.eventos_que_participou_outros',
				'eventos_que_participou_outros_descricao', 'a.eventos_que_participou_outros_descricao',
				'receber_correspondencia', 'a.receber_correspondencia',
				'receber_newsletter', 'a.receber_newsletter',
				'receber_sms', 'a.receber_sms',
				'filiado_amb', 'a.filiado_amb',
				'created_by', 'a.created_by',
				'protheus', 'a.protheus',
				);
		}

		parent::__construct($config);
	}

	/**
	 * Method to auto-populate the model state.
	 *
	 * Note. Calling getState in this method will result in recursion.
	 *
	 * @param   string  $ordering   Elements order
	 * @param   string  $direction  Order direction
	 *
	 * @return void
	 *
	 * @throws Exception
	 *
	 * @since    1.6
	 */
	protected function populateState($ordering = null, $direction = null)
	{
		// Initialise variables.
		$app = JFactory::getApplication();

		$list = $app->getUserState($this->context . '.list');


		$ordering = isset($list['filter_order']) ? $list['filter_order'] : null;
		$direction = isset($list['filter_order_Dir']) ? $list['filter_order_Dir'] : null;



		$list['limit'] = $app->getUserStateFromRequest('global.list.limit', 'limit', $app->getCfg('list_limit'), 'uint');
		$list['start'] = $app->input->getInt('start', 0);
		$list['ordering'] = $ordering;
		$list['direction'] = $direction;

		$app->setUserState($this->context . '.list', $list);
		$limit = $app->input->getInt('limit', $app->get('list_limit'));
		$app->input->set('list', null);

		// List state information
		$limit = $app->getUserStateFromRequest('global.list.limit', 'limit', $app->getCfg('list_limit'),
			'uint');
		$this->setState('list.limit', $limit);

		$limitstart = JRequest::getUInt('limitstart', 0);
		$this->setState('list.start', $limitstart);

		if (isset($list['ordering']))
		{
			$this->setState('list.ordering', $list['ordering']);
		}

		if (isset($list['direction']))
		{
			$this->setState('list.direction', $list['direction']);
		}

		// List state information.
		parent::populateState($ordering, $direction);
	}

	/**
	 * Build an SQL query to load the list data.
	 *
	 * @return   JDatabaseQuery
	 *
	 * @since    1.6
	 */
	protected function getListQuery()
	{
		$user = JFactory::getUser();

		// Create a new query object.
		$db    = $this->getDbo();
		$query = $db->getQuery(true);

		// Select the required fields from the table.
		$query
		->select(
			$this->getState(
				'list.select', 'DISTINCT a.*'
				)
			);

		$query->from('`#__associados` AS a');

		// Join over the users for the checked out user.
		$query->select('uc.name AS editor');
		$query->join('LEFT', '#__users AS uc ON uc.id=a.checked_out');
		// Join over the category 'amatra'
		$query->select('categories_2483198.title AS amatra');
		$query->join('LEFT', '#__categories AS categories_2483198 ON categories_2483198.id = a.amatra');
		// Join over the foreign key 'situacao_do_associado'
		$query->select('`#__associados_situacao_2481055`.`situacao_nome` AS situacoes_fk_value_2481055');
		$query->join('LEFT', '#__associados_situacao AS #__associados_situacao_2481055 ON #__associados_situacao_2481055.`id` = a.`situacao_do_associado`');
		// Join over the foreign key 'estado'
		$query->select('`#__estado_2481041`.`sig_estado` AS estados_fk_value_2481041');
		$query->join('LEFT', '#__estado AS #__estado_2481041 ON #__estado_2481041.`id` = a.`estado`');
		// Join over the foreign key 'cidade'
		$query->select('`#__cidades_2481040`.`nm_cidade` AS cidades_fk_value_2481040');
		$query->join('LEFT', '#__cidades AS #__cidades_2481040 ON #__cidades_2481040.`id` = a.`cidade`');

		// Join over the created by field 'created_by'
		$query->join('LEFT', '#__users AS created_by ON created_by.id = a.created_by');

		$query->select('b.group_id');
		$query->join('INNER', '#__user_usergroup_map AS b ON b.user_id = a.user_id');

		// Se o user for do grupo de usuário da secretaria das amatras
		if (in_array('42', $user->groups)){

			$db->setQuery($query);
			$groups = $db->loadObjectList();
			$userGroup = array_column($groups, 'group_id');
			$group = implode(", ", $user->groups);
			foreach ($user->groups as $key => $values) {
				if (in_array($values, $userGroup)) {
					$query->where("b.group_id IN (".$group.")");
					$query->order("a.nome");
				}
			}
		}

		if (!JFactory::getUser()->authorise('core.edit', 'com_associados'))
		{
			$query->where('a.state = 1');
		}

		// Filter by search in title
		$search = $this->getState('filter.search');

		if (!empty($search))
		{
			if (stripos($search, 'id:') === 0)
			{
				$query->where('a.id = ' . (int) substr($search, 3));
			}
			else
			{
				$search = $db->Quote('%' . $db->escape($search, true) . '%');
				$query->where('( a.id LIKE ' . $search . '  OR  a.nome LIKE ' . $search . '  OR  a.cpf LIKE ' . $search . '  OR  a.user_id LIKE ' . $search . ' )');
			}
		}


		// Filtering state_anamatra
		$filter_state_anamatra = $this->state->get("filter.state_anamatra");
		if ($filter_state_anamatra != '') {
			$query->where("a.state_anamatra = '".$db->escape($filter_state_anamatra)."'");
		}

		// Filtering state_amatra
		$filter_state_amatra = $this->state->get("filter.state_amatra");
		if ($filter_state_amatra != '') {
			$query->where("a.state_amatra = '".$db->escape($filter_state_amatra)."'");
		}

		// Filtering amatra
		$filter_amatra = $this->state->get("filter.amatra");
		if ($filter_amatra)
		{
			$query->where("a.amatra = '".$db->escape($filter_amatra)."'");
		}

		// Filtering receber_newsletter
		$filter_receber_newsletter = $this->state->get("filter.receber_newsletter");
		if ($filter_receber_newsletter != '') {
			$query->where("a.receber_newsletter = '".$db->escape($filter_receber_newsletter)."'");
		}

		// Filtering receber_sms
		$filter_receber_sms = $this->state->get("filter.receber_sms");
		if ($filter_receber_sms != '') {
			$query->where("a.receber_sms = '".$db->escape($filter_receber_sms)."'");
		}

		// Add the list ordering clause.
		$orderCol  = $this->state->get('list.ordering');
		$orderDirn = $this->state->get('list.direction');

		$query->group('a.nome');
		if ($orderCol && $orderDirn)
		{
			$query->order($db->escape($orderCol . ' ' . $orderDirn));
		}

		return $query;
	}

	/**
	 * Method to get an array of data items
	 *
	 * @return  mixed An array of data on success, false on failure.
	 */
	public function getItems()
	{
		$items = parent::getItems();

		foreach ($items as $item)
		{

			$item->state_anamatra = JText::_('COM_ASSOCIADOS_ASSOCIADOS_STATE_ANAMATRA_OPTION_' . strtoupper($item->state_anamatra));
			$item->state_amatra = JText::_('COM_ASSOCIADOS_ASSOCIADOS_STATE_AMATRA_OPTION_' . strtoupper($item->state_amatra));

			if (isset($item->amatra))
			{

				// Get the title of that particular template
				$title = AssociadosHelpersAssociadosfront::getCategoryNameByCategoryId($item->amatra);

					// Finally replace the data object with proper information
				$item->amatra = !empty($title) ? $title : $item->amatra;
			}			if (isset($item->situacao_do_associado) && $item->situacao_do_associado != '')
			{
				if (is_object($item->situacao_do_associado))
				{
					$item->situacao_do_associado = \Joomla\Utilities\ArrayHelper::fromObject($item->situacao_do_associado);
				}

				$values = (is_array($item->situacao_do_associado)) ? $item->situacao_do_associado : explode(',', $item->situacao_do_associado);
				$textValue = array();

				foreach ($values as $value)
				{
					$db = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
					->select('`#__cidades_2481040`.`situacao_nome`')
					->from($db->quoteName('#__associados_situacao', '#__cidades_2481040'))
					->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));
					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results)
					{
						$textValue[] = $results->situacao_nome;
					}
				}

				$item->situacao_do_associado = !empty($textValue) ? implode(', ', $textValue) : $item->situacao_do_associado;
			}

			$item->tratamento = JText::_('COM_ASSOCIADOS_ASSOCIADOS_TRATAMENTO_OPTION_' . strtoupper($item->tratamento));
			$item->sexo = JText::_('COM_ASSOCIADOS_ASSOCIADOS_SEXO_OPTION_' . strtoupper($item->sexo));
			$item->tribunal = JText::_('COM_ASSOCIADOS_ASSOCIADOS_TRIBUNAL_OPTION_' . strtoupper($item->tribunal));
			$item->cargo = JText::_('COM_ASSOCIADOS_ASSOCIADOS_CARGO_OPTION_' . strtoupper($item->cargo));
			$item->estado_civil = JText::_('COM_ASSOCIADOS_ASSOCIADOS_ESTADO_CIVIL_OPTION_' . strtoupper($item->estado_civil));
			$item->logradouro = JText::_('COM_ASSOCIADOS_ASSOCIADOS_LOGRADOURO_OPTION_' . strtoupper($item->logradouro));			
			if (isset($item->estado) && $item->estado != '') 
			{
				if (is_object($item->estado))
				{
					$item->estado = \Joomla\Utilities\ArrayHelper::fromObject($item->estado);
				}

				$values = (is_array($item->estado)) ? $item->estado : explode(',', $item->estado);
				$textValue = array();

				foreach ($values as $value)
				{
					$db = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
					->select('`#__cidades_2481040`.`sig_estado`')
					->from($db->quoteName('#__estado', '#__cidades_2481040'))
					->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));
					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results)
					{
						$textValue[] = $results->sig_estado;
					}
				}

				$item->estado = !empty($textValue) ? implode(', ', $textValue) : $item->estado;
			}
			if (isset($item->cidade) && $item->cidade != '')
			{
				if (is_object($item->cidade))
				{
					$item->cidade = \Joomla\Utilities\ArrayHelper::fromObject($item->cidade);
				}

				$values = (is_array($item->cidade)) ? $item->cidade : explode(',', $item->cidade);
				$textValue = array();

				foreach ($values as $value)
				{
					$db = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
					->select('`#__cidades_2481040`.`nm_cidade`')
					->from($db->quoteName('#__cidades', '#__cidades_2481040'))
					->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));
					$db->setQuery($query);
					$results = $db->loadObject();

					if ($results)
					{
						$textValue[] = $results->nm_cidade;
					}
				}

				$item->cidade = !empty($textValue) ? implode(', ', $textValue) : $item->cidade;
			}

			$item->possui_dependentes = JText::_('COM_ASSOCIADOS_ASSOCIADOS_POSSUI_DEPENDENTES_OPTION_' . strtoupper($item->possui_dependentes));

			if (isset($item->eventos_que_participou_jogos_nacionais))
			{
				$values = explode(',', $item->eventos_que_participou_jogos_nacionais);

				$textValue = array();
				foreach ($values as $value)
				{
					if (!empty($value))
					{
						$db = JFactory::getDbo();
						$query = "SELECT * FROM `anmt_associados_eventos` WHERE `state` = 1 AND `evento_tipo` LIKE 'jogos' HAVING id LIKE '" . $value . "'";
						$db->setQuery($query);
						$results = $db->loadObject();
						if ($results)
						{
							$textValue[] = $results->evento_ano;
						}
					}
				}

				$item->eventos_que_participou_jogos_nacionais = !empty($textValue) ? implode(', ', $textValue) : $item->eventos_que_participou_jogos_nacionais;

			}

			if (isset($item->eventos_que_participou_conamat))
			{
				$values = explode(',', $item->eventos_que_participou_conamat);

				$textValue = array();
				foreach ($values as $value)
				{
					if (!empty($value))
					{
						$db = JFactory::getDbo();
						$query = "SELECT * FROM `anmt_associados_eventos` WHERE `state` = 1 AND `evento_tipo` LIKE 'conamat' HAVING id LIKE '" . $value . "'";
						$db->setQuery($query);
						$results = $db->loadObject();
						if ($results)
						{
							$textValue[] = $results->evento_ano;
						}
					}
				}

				$item->eventos_que_participou_conamat = !empty($textValue) ? implode(', ', $textValue) : $item->eventos_que_participou_conamat;

			}

			if (isset($item->eventos_que_participou_congresso_internacional))
			{
				$values = explode(',', $item->eventos_que_participou_congresso_internacional);

				$textValue = array();
				foreach ($values as $value)
				{
					if (!empty($value))
					{
						$db = JFactory::getDbo();
						$query = "SELECT * FROM `anmt_associados_eventos` WHERE `state` = 1 AND `evento_tipo` LIKE 'internacional' HAVING id LIKE '" . $value . "'";
						$db->setQuery($query);
						$results = $db->loadObject();
						if ($results)
						{
							$textValue[] = $results->evento_ano;
						}
					}
				}

				$item->eventos_que_participou_congresso_internacional = !empty($textValue) ? implode(', ', $textValue) : $item->eventos_que_participou_congresso_internacional;

			}

			if (isset($item->eventos_que_participou_encontro_aposentados))
			{
				$values = explode(',', $item->eventos_que_participou_encontro_aposentados);

				$textValue = array();
				foreach ($values as $value)
				{
					if (!empty($value))
					{
						$db = JFactory::getDbo();
						$query = "SELECT * FROM `anmt_associados_eventos` WHERE `state` = 1 AND `evento_tipo` LIKE 'aposentados' HAVING id LIKE '" . $value . "'";
						$db->setQuery($query);
						$results = $db->loadObject();
						if ($results)
						{
							$textValue[] = $results->evento_ano;
						}
					}
				}

				$item->eventos_que_participou_encontro_aposentados = !empty($textValue) ? implode(', ', $textValue) : $item->eventos_que_participou_encontro_aposentados;

			}
			$item->eventos_que_participou_outros = JText::_('COM_ASSOCIADOS_ASSOCIADOS_EVENTOS_QUE_PARTICIPOU_OUTROS_OPTION_' . strtoupper($item->eventos_que_participou_outros));
			$item->receber_correspondencia = JText::_('COM_ASSOCIADOS_ASSOCIADOS_RECEBER_CORRESPONDENCIA_OPTION_' . strtoupper($item->receber_correspondencia));
			$item->receber_newsletter = JText::_('COM_ASSOCIADOS_ASSOCIADOS_RECEBER_NEWSLETTER_OPTION_' . strtoupper($item->receber_newsletter));
			$item->receber_sms = JText::_('COM_ASSOCIADOS_ASSOCIADOS_RECEBER_SMS_OPTION_' . strtoupper($item->receber_sms));
			$item->filiado_amb = JText::_('COM_ASSOCIADOS_ASSOCIADOS_FILIADO_AMB_OPTION_' . strtoupper($item->filiado_amb));
		}

		return $items;
	}

	/**
	 * Overrides the default function to check Date fields format, identified by
	 * "_dateformat" suffix, and erases the field if it's not correct.
	 *
	 * @return void
	 */
	protected function loadFormData()
	{
		$app              = JFactory::getApplication();
		$filters          = $app->getUserState($this->context . '.filter', array());
		$error_dateformat = false;

		foreach ($filters as $key => $value)
		{
			if (strpos($key, '_dateformat') && !empty($value) && $this->isValidDate($value) == null)
			{
				$filters[$key]    = '';
				$error_dateformat = true;
			}
		}

		if ($error_dateformat)
		{
			$app->enqueueMessage(JText::_("COM_ASSOCIADOS_SEARCH_FILTER_DATE_FORMAT"), "warning");
			$app->setUserState($this->context . '.filter', $filters);
		}

		return parent::loadFormData();
	}

	/**
	 * Checks if a given date is valid and in a specified format (YYYY-MM-DD)
	 *
	 * @param   string  $date  Date to be checked
	 *
	 * @return bool
	 */
	private function isValidDate($date)
	{
		$date = str_replace('/', '-', $date);
		return (date_create($date)) ? JFactory::getDate($date)->format("Y-m-d") : null;
	}
}
