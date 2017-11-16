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
require_once(JPATH_ADMINISTRATOR . '/components/com_associados/helpers/associados_users.php');

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
	 * @param   array $config An optional associative array of configuration settings.
	 *
	 * @see        JController
	 * @since      1.6
	 */
	public function __construct($config = array())
	{
		if (empty($config['filter_fields']))
		{
			$config['filter_fields'] = array(
				'id', 'a.`id`',
				'state', 'a.`state`',
				'user_id', 'a.`user_id`',
				'state_anamatra', 'a.`state_anamatra`',
				'state_amatra', 'a.`state_amatra`',
				'amatra', 'a.`amatra`',
				'situacao_do_associado', 'a.`situacao_do_associado`',
				'tratamento', 'a.`tratamento`',
				'nome', 'a.`nome`',
				'email', 'a.`email`',
				'nascimento', 'a.`nascimento`',
				'naturalidade', 'a.`naturalidade`',
				'sexo', 'a.`sexo`',
				'cpf', 'a.`cpf`',
				'rg', 'a.`rg`',
				'orgao_expeditor', 'a.`orgao_expeditor`',
				'data_emissao', 'a.`data_emissao`',
				'dt_ingresso_magistratura', 'a.`dt_ingresso_magistratura`',
				'dt_filiacao_anamatra', 'a.`dt_filiacao_anamatra`',
				'tribunal', 'a.`tribunal`',
				'dirigente', 'a.`dirigente`',
				'cargo', 'a.`cargo`',
				'cargo_associado_honorario', 'a.`cargo_associado_honorario`',
				'estado_civil', 'a.`estado_civil`',
				'endereco', 'a.`endereco`',
				'logradouro', 'a.`logradouro`',
				'numero', 'a.`numero`',
				'complemento', 'a.`complemento`',
				'bairro', 'a.`bairro`',
				'estado', 'a.`estado`',
				'cidade', 'a.`cidade`',
				'cep', 'a.`cep`',
				'observacoes', 'a.`observacoes`',
				'email_alternativo', 'a.`email_alternativo`',
				'fone_residencial', 'a.`fone_residencial`',
				'fone_comercial', 'a.`fone_comercial`',
				'fone_celular', 'a.`fone_celular`',
				'fone_fax', 'a.`fone_fax`',
				'possui_dependentes', 'a.`possui_dependentes`',
				'dependentes', 'a.`dependentes`',
				'eventos_que_participou_jogos_nacionais', 'a.`eventos_que_participou_jogos_nacionais`',
				'eventos_que_participou_conamat', 'a.`eventos_que_participou_conamat`',
				'eventos_que_participou_congresso_internacional', 'a.`eventos_que_participou_congresso_internacional`',
				'eventos_que_participou_encontro_aposentados', 'a.`eventos_que_participou_encontro_aposentados`',
				'eventos_que_participou_outros', 'a.`eventos_que_participou_outros`',
				'eventos_que_participou_outros_descricao', 'a.`eventos_que_participou_outros_descricao`',
				'receber_correspondencia', 'a.`receber_correspondencia`',
				'receber_newsletter', 'a.`receber_newsletter`',
				'receber_sms', 'a.`receber_sms`',
				'filiado_amb', 'a.`filiado_amb`',
				'created_by', 'a.`created_by`',
				'protheus', 'a.`protheus`',
			);
		}

		parent::__construct($config);
	}

	/**
	 * Method to auto-populate the model state.
	 *
	 * Note. Calling getState in this method will result in recursion.
	 *
	 * @param   string $ordering  Elements order
	 * @param   string $direction Order direction
	 *
	 * @return void
	 *
	 * @throws Exception
	 */
	protected function populateState($ordering = null, $direction = null)
	{
		// Initialise variables.
		$app = JFactory::getApplication('administrator');

		// Load the filter state.
		$search = $app->getUserStateFromRequest($this->context . '.filter.search', 'filter_search');
		$this->setState('filter.search', $search);

		$published = $app->getUserStateFromRequest($this->context . '.filter.state', 'filter_published', '', 'string');
		$this->setState('filter.state', $published);
		// Filtering state_anamatra
		$this->setState('filter.state_anamatra', $app->getUserStateFromRequest($this->context . '.filter.state_anamatra', 'filter_state_anamatra', '', 'string'));

		// Filtering state_amatra
		$this->setState('filter.state_amatra', $app->getUserStateFromRequest($this->context . '.filter.state_amatra', 'filter_state_amatra', '', 'string'));

		// Filtering amatra
		$this->setState('filter.amatra', $app->getUserStateFromRequest($this->context . '.filter.amatra', 'filter_amatra', '', 'string'));

		// Filtering receber_newsletter
		$this->setState('filter.receber_newsletter', $app->getUserStateFromRequest($this->context . '.filter.receber_newsletter', 'filter_receber_newsletter', '', 'string'));

		// Filtering receber_sms
		$this->setState('filter.receber_sms', $app->getUserStateFromRequest($this->context . '.filter.receber_sms', 'filter_receber_sms', '', 'string'));

		// Filtering forma_associacao
		$this->setState('filter.forma_associacao', $app->getUserStateFromRequest($this->context . '.filter.forma_associacao', 'filter_forma_associacao', '', 'string'));

		// Filtering situacao_do_associado
		$this->setState('filter.situacao_do_associado',
			$app->getUserStateFromRequest($this->context . '.filter.situacao_do_associado',
				'filter_situacao_do_associado', '', 'string'));


		// Load the parameters.
		$params = JComponentHelper::getParams('com_associados');
		$this->setState('params', $params);

		// List state information.
		parent::populateState('a.id', 'asc');
	}

	/**
	 * Method to get a store id based on model configuration state.
	 *
	 * This is necessary because the model is used by the component and
	 * different modules that might need different sets of data or different
	 * ordering requirements.
	 *
	 * @param   string $id A prefix for the store id.
	 *
	 * @return   string A store id.
	 *
	 * @since    1.6
	 */
	protected function getStoreId($id = '')
	{
		// Compile the store id.
		$id .= ':' . $this->getState('filter.search');
		$id .= ':' . $this->getState('filter.state');

		return parent::getStoreId($id);
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
		// Create a new query object.
		$db    = $this->getDbo();
		$query = $db->getQuery(true);

		// Select the required fields from the table.
		$query->select(
			$this->getState(
				'list.select', 'DISTINCT a.*'
			)
		);
		$query->from('`#__associados` AS a');

		// Join over the users for the checked out user
		$query->select("uc.name AS editor");
		$query->join("LEFT", "#__users AS uc ON uc.id=a.checked_out");
		// Join over the usergroups 'amatra'
		$query->select('`amatra`.title AS `amatra`');
		$query->join('LEFT', '#__categories AS `amatra` ON `amatra`.id = a.`amatra`');
		// Join over the foreign key 'situacao_do_associado'
		$query->select('`#__associados_situacao_2481055`.`situacao_nome` AS situacoes_fk_value_2481055');
		$query->join('LEFT', '#__associados_situacao AS #__associados_situacao_2481055 ON #__associados_situacao_2481055.`id` = a.`situacao_do_associado`');
		// Join over the foreign key 'estado'
		$query->select('`#__estado_2481041`.`sig_estado` AS estados_fk_value_2481041');
		$query->join('LEFT', '#__estado AS #__estado_2481041 ON #__estado_2481041.`id` = a.`estado`');
		// Join over the foreign key 'cidade'
		$query->select('`#__cidades_2481040`.`nm_cidade` AS cidades_fk_value_2481040');
		$query->join('LEFT', '#__cidades AS #__cidades_2481040 ON #__cidades_2481040.`id` = a.`cidade`');

		// Join over the user field 'created_by'
		$query->select('`created_by`.name AS `created_by`');
		$query->join('LEFT', '#__users AS `created_by` ON `created_by`.id = a.`created_by`');

		// Filter by published state
		$published = $this->getState('filter.state');

		if (is_numeric($published))
		{
			$query->where('a.state = ' . (int) $published);
		}
		elseif ($published === '')
		{
			$query->where('(a.state IN (0, 1))');
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


		//Filtering state_anamatra
		$filter_state_anamatra = $this->state->get("filter.state_anamatra");
		if ($filter_state_anamatra || $filter_state_anamatra == '0')
		{
			$query->where("a.`state_anamatra` = '" . $db->escape($filter_state_anamatra) . "'");
		}

		//Filtering state_amatra
		$filter_state_amatra = $this->state->get("filter.state_amatra");
		if ($filter_state_amatra || $filter_state_amatra == '0')
		{
			$query->where("a.`state_amatra` = '" . $db->escape($filter_state_amatra) . "'");
		}

		//Filtering amatra
		$filter_amatra = $this->state->get("filter.amatra");
		if ($filter_amatra)
		{
			$query->where("a.`amatra` = '" . $db->escape($filter_amatra) . "'");
		}

		//Filtering receber_newsletter
		$filter_receber_newsletter = $this->state->get("filter.receber_newsletter");
		if ($filter_receber_newsletter || $filter_receber_newsletter == '0')
		{
			$query->where("a.`receber_newsletter` = '" . $db->escape($filter_receber_newsletter) . "'");
		}

		//Filtering receber_sms
		$filter_receber_sms = $this->state->get("filter.receber_sms");
		if ($filter_receber_sms || $filter_receber_sms == '0')
		{
			$query->where("a.`receber_sms` = '" . $db->escape($filter_receber_sms) . "'");
		}

		//Filtering forma_associacao
		$filter_forma_associacao = $this->state->get("filter.forma_associacao");
		if (($filter_forma_associacao || $filter_forma_associacao == '0') && $filter_forma_associacao != '2')
		{
			$query->where("a.`forma_associacao` = '" . $db->escape($filter_forma_associacao) . "'");
		}

		//Filtering forma_associacao
		if ($filter_forma_associacao == '2')
		{
			$query->where("a.`forma_associacao` = ''");
		}

		//Filtering situacao_do_associado
		$filter_situacao_do_associado = $this->state->get("filter.situacao_do_associado");
		if ($filter_situacao_do_associado || $filter_situacao_do_associado == '0')
		{
			$query->where("a.`situacao_do_associado` = '" . $db->escape($filter_situacao_do_associado) . "'");
		}

		// Add the list ordering clause.
		$orderCol  = $this->state->get('list.ordering');
		$orderDirn = $this->state->get('list.direction');

		if ($orderCol && $orderDirn)
		{
			$query->order($db->escape($orderCol . ' ' . $orderDirn));
		}

		return $query;
	}

	/**
	 * Get an array of data items
	 *
	 * @return mixed Array of data items on success, false on failure.
	 */
	public function getItems()
	{
		$items = parent::getItems();

		foreach ($items as $oneItem)
		{
			$oneItem->state_anamatra = JText::_('COM_ASSOCIADOS_ASSOCIADOS_STATE_ANAMATRA_OPTION_' . strtoupper($oneItem->state_anamatra));
			$oneItem->state_amatra   = JText::_('COM_ASSOCIADOS_ASSOCIADOS_STATE_AMATRA_OPTION_' . strtoupper($oneItem->state_amatra));

			if (isset($oneItem->situacao_do_associado))
			{
				$values = explode(',', $oneItem->situacao_do_associado);

				$textValue = array();
				foreach ($values as $value)
				{
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__associados_situacao_2481055`.`situacao_nome`')
						->from($db->quoteName('#__associados_situacao', '#__associados_situacao_2481055'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));
					$db->setQuery($query);
					$results = $db->loadObject();
					if ($results)
					{
						$textValue[] = $results->situacao_nome;
					}
				}

				$oneItem->situacao_do_associado = !empty($textValue) ? implode(', ', $textValue) : $oneItem->situacao_do_associado;

			}
			$oneItem->tratamento   = JText::_('COM_ASSOCIADOS_ASSOCIADOS_TRATAMENTO_OPTION_' . strtoupper($oneItem->tratamento));
			$oneItem->sexo         = JText::_('COM_ASSOCIADOS_ASSOCIADOS_SEXO_OPTION_' . strtoupper($oneItem->sexo));
			$oneItem->tribunal     = JText::_('COM_ASSOCIADOS_ASSOCIADOS_TRIBUNAL_OPTION_' . strtoupper($oneItem->tribunal));
			$oneItem->cargo        = JText::_('COM_ASSOCIADOS_ASSOCIADOS_CARGO_OPTION_' . strtoupper($oneItem->cargo));
			$oneItem->estado_civil = JText::_('COM_ASSOCIADOS_ASSOCIADOS_ESTADO_CIVIL_OPTION_' . strtoupper($oneItem->estado_civil));
			$oneItem->logradouro   = JText::_('COM_ASSOCIADOS_ASSOCIADOS_LOGRADOURO_OPTION_' . strtoupper($oneItem->logradouro));

			if (isset($oneItem->estado))
			{
				$values = explode(',', $oneItem->estado);

				$textValue = array();
				foreach ($values as $value)
				{
					$db    = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query
						->select('`#__estado_2481041`.`sig_estado`')
						->from($db->quoteName('#__estado', '#__estado_2481041'))
						->where($db->quoteName('id') . ' = ' . $db->quote($db->escape($value)));
					$db->setQuery($query);
					$results = $db->loadObject();
					if ($results)
					{
						$textValue[] = $results->sig_estado;
					}
				}

				$oneItem->estado = !empty($textValue) ? implode(', ', $textValue) : $oneItem->estado;

			}

			if (isset($oneItem->cidade))
			{
				$values = explode(',', $oneItem->cidade);

				$textValue = array();
				foreach ($values as $value)
				{
					$db    = JFactory::getDbo();
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

				$oneItem->cidade = !empty($textValue) ? implode(', ', $textValue) : $oneItem->cidade;

			}
			$oneItem->possui_dependentes = JText::_('COM_ASSOCIADOS_ASSOCIADOS_POSSUI_DEPENDENTES_OPTION_' . strtoupper($oneItem->possui_dependentes));

			if (isset($oneItem->eventos_que_participou_jogos_nacionais))
			{
				$values = explode(',', $oneItem->eventos_que_participou_jogos_nacionais);

				$textValue = array();
				foreach ($values as $value)
				{
					if (!empty($value))
					{
						$db    = JFactory::getDbo();
						$query = "SELECT * FROM `anmt_associados_eventos` WHERE `state` = 1 AND `evento_tipo` LIKE 'jogos' HAVING id LIKE '" . $value . "'";
						$db->setQuery($query);
						$results = $db->loadObject();
						if ($results)
						{
							$textValue[] = $results->evento_ano;
						}
					}
				}

				$oneItem->eventos_que_participou_jogos_nacionais = !empty($textValue) ? implode(', ', $textValue) : $oneItem->eventos_que_participou_jogos_nacionais;

			}

			if (isset($oneItem->eventos_que_participou_conamat))
			{
				$values = explode(',', $oneItem->eventos_que_participou_conamat);

				$textValue = array();
				foreach ($values as $value)
				{
					if (!empty($value))
					{
						$db    = JFactory::getDbo();
						$query = "SELECT * FROM `anmt_associados_eventos` WHERE `state` = 1 AND `evento_tipo` LIKE 'conamat' HAVING id LIKE '" . $value . "'";
						$db->setQuery($query);
						$results = $db->loadObject();
						if ($results)
						{
							$textValue[] = $results->evento_ano;
						}
					}
				}

				$oneItem->eventos_que_participou_conamat = !empty($textValue) ? implode(', ', $textValue) : $oneItem->eventos_que_participou_conamat;

			}

			if (isset($oneItem->eventos_que_participou_congresso_internacional))
			{
				$values = explode(',', $oneItem->eventos_que_participou_congresso_internacional);

				$textValue = array();
				foreach ($values as $value)
				{
					if (!empty($value))
					{
						$db    = JFactory::getDbo();
						$query = "SELECT * FROM `anmt_associados_eventos` WHERE `state` = 1 AND `evento_tipo` LIKE 'internacional' HAVING id LIKE '" . $value . "'";
						$db->setQuery($query);
						$results = $db->loadObject();
						if ($results)
						{
							$textValue[] = $results->evento_ano;
						}
					}
				}

				$oneItem->eventos_que_participou_congresso_internacional = !empty($textValue) ? implode(', ', $textValue) : $oneItem->eventos_que_participou_congresso_internacional;

			}

			if (isset($oneItem->eventos_que_participou_encontro_aposentados))
			{
				$values = explode(',', $oneItem->eventos_que_participou_encontro_aposentados);

				$textValue = array();
				foreach ($values as $value)
				{
					if (!empty($value))
					{
						$db    = JFactory::getDbo();
						$query = "SELECT * FROM `anmt_associados_eventos` WHERE `state` = 1 AND `evento_tipo` LIKE 'aposentados' HAVING id LIKE '" . $value . "'";
						$db->setQuery($query);
						$results = $db->loadObject();
						if ($results)
						{
							$textValue[] = $results->evento_ano;
						}
					}
				}

				$oneItem->eventos_que_participou_encontro_aposentados = !empty($textValue) ? implode(', ', $textValue) : $oneItem->eventos_que_participou_encontro_aposentados;

			}

			$oneItem->eventos_que_participou_outros = JText::_('COM_ASSOCIADOS_ASSOCIADOS_EVENTOS_QUE_PARTICIPOU_OUTROS_OPTION_' . strtoupper($oneItem->eventos_que_participou_outros));
			$oneItem->receber_correspondencia       = JText::_('COM_ASSOCIADOS_ASSOCIADOS_RECEBER_CORRESPONDENCIA_OPTION_' . strtoupper($oneItem->receber_correspondencia));
			$oneItem->receber_newsletter            = JText::_('COM_ASSOCIADOS_ASSOCIADOS_RECEBER_NEWSLETTER_OPTION_' . strtoupper($oneItem->receber_newsletter));
			$oneItem->receber_sms                   = JText::_('COM_ASSOCIADOS_ASSOCIADOS_RECEBER_SMS_OPTION_' . strtoupper($oneItem->receber_sms));
			$oneItem->filiado_amb                   = JText::_('COM_ASSOCIADOS_ASSOCIADOS_FILIADO_AMB_OPTION_' . strtoupper($oneItem->filiado_amb));

			$lastVisitDate = JFactory::getUser($oneItem->user_id)->lastvisitDate;
			// Se já logou na extranet:
			$oneItem->jaLogou = !is_null($lastVisitDate) && $lastVisitDate != '0000-00-00 00:00:00';
		}

		$app = JFactory::getApplication();
		$app->setUserState('com_associados.qtdJaLogaram', $this->getCountJaLogaram());
		$app->setUserState('com_associados.qtdJaLogaramAfterReset', $this->getCountJaLogaram(true));

		return $items;
	}

	/**
	 * Retorna a quantidade de associados que já logaram, baseado no lastvisitDate do seu user
	 *
	 * @param bool $afterReset = true caso seja para verificar apenas aqueles que já tiveram a senha redefinida e reenviada
	 *
	 * @return integer
	 */
	public function getCountJaLogaram($afterReset = false)
	{
		$db = JFactory::getDbo();

		$query = $db->getQuery(true);
		$query->select('COUNT(`u`.`id`)')->from('`#__users` AS `u`')
			->join('INNER', '`#__associados` AS `a` ON `a`.`user_id` = `u`.`id`')
			->where("`u`.`lastvisitDate` != '0000-00-00 00:00:00' AND `u`.`lastvisitDate` IS NOT NULL AND `a`.`user_id` != ''");

		if ($afterReset)
		{
			$query->where("`a`.`lastPasswordRedefineByAnamatra` != '0000-00-00 00:00:00' AND `a`.`lastPasswordRedefineByAnamatra` IS NOT NULL");
		}

		return $db->setQuery($query)->loadResult();
	}

	public function getExcel()
	{


		$dados = $this->getItems();

		require_once JPATH_COMPONENT . '/assets/Classes/PHPExcel.php';

		//Instanciando a classe
		$objPHPExcel = new PHPExcel();

		//estilo da fonte
		$objPHPExcel->getActiveSheet()->getStyle('A1')->getFont()->setBold(true);

		$objPHPExcel->getActiveSheet()->getStyle('A1:G1')->applyFromArray(
			array('fill' => array(
				'type'  => PHPExcel_Style_Fill::FILL_SOLID,
				'color' => array('rgb' => 'D5D5D5')
			),
			)
		);


		// Criamos as colunas
		$objPHPExcel->setActiveSheetIndex(0)
			->setCellValue('A1', 'Lista de Associados ANAMATRA')
			->setCellValue('A3', JText::_('NOME'))
			->setCellValue("B3", JText::_('CPF'))
			->setCellValue("C3", JText::_('E-MAIL'))
			->setCellValue("D3", JText::_('AMATRA'))
			->setCellValue("E3", JText::_('ESTADO'))
			->setCellValue("F3", JText::_('CIDADE'))
			->setCellValue("G3", JText::_('ID'));


		// configurando padrao de largura paras as colunas
		$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(50);
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
		$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(5);
		$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(30);
		$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(45);
		$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(15);


		$row = 4;
		$col = 1;
		foreach ($dados as $key => $item)
		{

			$objPHPExcel->getActiveSheet()
				->setCellValue("A" . $row, $item->nome)
				->setCellValue("B" . $row, $item->cpf)
				->setCellValue("C" . $row, $item->email)
				->setCellValue("D" . $row, $item->amatra)
				->setCellValue("E" . $row, $item->estado)
				->setCellValue("F" . $row, $item->cidade)
				->setCellValue("G" . $row, $item->id);

			$row++;
			$col++;

		}

		// nome das planilha atual
		$objPHPExcel->getActiveSheet()->setTitle('Lista de Associados');

		// Cabeçalho do arquivo que vai ser baixado
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment;filename="listagem_associados.xls"');
		header('Cache-Control: max-age=0');
		// Se for o IE9, isso talvez seja necessário
		header('Cache-Control: max-age=1');

		// Acessamos o 'Writer' para poder salvar o arquivo
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');

		// Salva diretamente no output na tela
		$objWriter->save('php://output');


		JFactory::getApplication()->close();

		exit;
	}

	/**
	 * Task para criar usuários Joomla dos Associados selecionados na lista
	 *
	 * @param string $associadosIds = ids dos associados que terão usuários cadastrados (ex: 1,2,3,4)
	 */
	public function exportUsers($associadosIds)
	{
		$db = JFactory::getDbo();

		$query = $db->getQuery(true);
		$query->select('id, state, user_id, nome, email, cpf, amatra, state, situacao_do_associado, forma_associacao')->from('#__associados')
			->where("id IN ({$associadosIds}) AND email != '' AND cpf != '' AND user_id = '' 
						AND situacao_do_associado IN(2, 4, 5, 6) AND forma_associacao = 1");

		$associados = $db->setQuery($query)->loadObjectList();

		return AssocUsersAcy::createUsers($associados);

	}

}
