<?php

/**
 * @version    CVS: 1.0.4
 * @package    Com_Ouvidoria
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  2017 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
defined('_JEXEC') or die;

jimport('joomla.application.component.modellist');

/**
 * Methods supporting a list of Ouvidoria records.
 *
 * @since  1.6
 */
class OuvidoriaModelComentarios extends JModelList
{

	private $solicitacao;

	private $solicitante;

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
		if (empty($config['filter_fields'])) {
			$config['filter_fields'] = array(
				'id', 'a.id',
				'ordering', 'a.ordering',
				'state', 'a.state',
				'created_by', 'a.created_by',
				'created_by_solicitante', 'a.created_by_solicitante',
				'id_user_consultado', 'a.id_user_consultado',
				'modified_by', 'a.modified_by',
				'updated_at', 'a.updated_at',
				'created_at', 'a.created_at',
				'id_solicitacao', 'a.id_solicitacao',
				'anexo', 'a.anexo',
				'texto', 'a.texto',
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
	 *
	 * @since    1.6
	 */
	protected function populateState($ordering = null, $direction = null)
	{
		$app  = JFactory::getApplication();
		$list = $app->getUserState($this->context . '.list');

		$ordering  = isset($list['filter_order']) ? $list['filter_order'] : null;
		$direction = isset($list['filter_order_Dir']) ? $list['filter_order_Dir'] : null;

		$list['limit']     = (int)JFactory::getConfig()->get('list_limit', 20);
		$list['start']     = $app->input->getInt('start', 0);
		$list['ordering']  = $ordering;
		$list['direction'] = $direction;

		$app->setUserState($this->context . '.list', $list);
		$app->input->set('list', null);

		// List state information.
		parent::populateState($ordering, $direction);

		$app = JFactory::getApplication();

		$this->setState('list.ordering', 'id');
		$this->setState('list.direction', 'ASC');

		$start = $app->getUserStateFromRequest($this->context . '.limitstart', 'limitstart', 0, 'int');
		$limit = $app->getUserStateFromRequest($this->context . '.limit', 'limit', 0, 'int');

		if ($limit == 0) {
			$limit = $app->get('list_limit', 0);
		}

		$this->setState('list.limit', $limit);
		$this->setState('list.start', $start);
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
		$app = JFactory::getApplication();

		// Create a new query object.
		$db    = $this->getDbo();
		$query = $db->getQuery(true);

		// Select the required fields from the table.
		$query
			->select(
				$this->getState(
					'list.select', 'DISTINCT logs.*'
				)
			);

		$query->from('`#__ouvidoria_solicitacoes_logs` AS logs');


		// Join over the created by field 'created_by'
		$query->join('LEFT', '#__users AS created_by ON created_by.id = logs.created_by');

		if (!JFactory::getUser()->authorise('core.edit', 'com_ouvidoria')) {
			$query->where('logs.state = 1');
		}

		if ($idSolicitacao = $app->input->get('solicitacao')) {
			$query->where('logs.id_solicitacao = ' . $idSolicitacao);
		}


		if (!$isUserOuvidoriaOrSuperUser = OuvidoriaHelpersOuvidoria::isUserOuvidoriaOrSuperUser()) {
			$query->where('logs.id_interacao NOT IN (' . implode(', ', OuvidoriaHelpersOuvidoria::$interactionsToShowOnlyToAnamatraUsers) . ')');
		}

		// Filter by search in title
		$search = $this->getState('filter.search');

		if (!empty($search)) {
			if (stripos($search, 'id:') === 0) {
				$query->where('logs.id = ' . (int)substr($search, 3));
			} else {
				$search = $db->Quote('%' . $db->escape($search, true) . '%');
				$query->where('(#__ouvidoria_solicitantes_2814552.nome LIKE ' . $search . '  OR #__ouvidoria_solicitacoes_2814550.protocolo LIKE ' . $search . '  OR #__ouvidoria_solicitacoes_interacoes_2814551.nome LIKE ' . $search . ' )');
			}
		}


		// Filtering created_by_solicitante
		$filter_created_by_solicitante = $this->state->get("filter.created_by_solicitante");

		if ($filter_created_by_solicitante) {
			$query->where("logs.`created_by_solicitante` = '" . $db->escape($filter_created_by_solicitante) . "'");
		}

		// Filtering id_solicitacao
		$filter_id_solicitacao = $this->state->get("filter.id_solicitacao");

		if ($filter_id_solicitacao) {
			$query->where("logs.`id_solicitacao` = '" . $db->escape($filter_id_solicitacao) . "'");
		}

		// Filtering id_interacao
		$filter_id_interacao = $this->state->get("filter.id_interacao");

		if ($filter_id_interacao) {
			$query->where("logs.`id_interacao` = '" . $db->escape($filter_id_interacao) . "'");
		}

		// Add the list ordering clause.
		$orderCol  = $this->state->get('list.ordering');
		$orderDirn = $this->state->get('list.direction');

		if ($orderCol && $orderDirn) {
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

		/** @var OuvidoriaModelComentario $modelComentario */
		$modelComentario = ThomisticusHelperComponent::getModel('Comentario');
		$diretorias      = OuvidoriaHelpersOuvidoria::getDiretorias();

		foreach ($items as $item) {

			if (!empty($item->created_by)) {
				$item->created_by = ThomisticusHelperModel::select('#__users', ['id', 'name'], ['id' => $item->created_by], 'Object');

				if (!empty($item->created_by->id)) {
					$idDiretorias = ThomisticusHelperModel::select('#__ouvidoria_diretorias_users_responsaveis', 'id_diretoria', ['id_user' => $item->created_by->id]);
					$idDiretorias = array_flip(array_column($idDiretorias, 'id_diretoria'));

					$diretoria = array_intersect_key($diretorias, $idDiretorias);

					$item->created_by->diretoria = !empty($diretoria) ? implode(', ', $diretoria) : '';
				}
			}

			if (!empty($item->created_by_solicitante)) {
				$item->created_by_solicitante = ThomisticusHelperModel::select('#__ouvidoria_solicitantes', ['id', 'nome'], ['id' => $item->created_by_solicitante], 'Object');
			}

			if (isset($item->id_interacao)) {
				$item->interacao = ThomisticusHelperModel::select('#__ouvidoria_solicitacoes_interacoes', ['id', 'nome', 'id_status_vinculado'], ['id' => $item->id_interacao], 'Object');
				unset($item->id_interacao);

				$item->interacao->statusChangedTo = ThomisticusHelperModel::select('#__ouvidoria_solicitacoes_status', 'nome', ['id' => $item->interacao->id_status_vinculado], 'Result');
				$item->hasChangeStatusMessage     = in_array($item->interacao->id, OuvidoriaHelpersOuvidoria::$interactionsIdsWithStatusChangeMsg);
				$item->typeClass                  = isset(OuvidoriaHelpersOuvidoria::$itemClassesByIdInteracao[$item->interacao->id]) ? OuvidoriaHelpersOuvidoria::$itemClassesByIdInteracao[$item->interacao->id] : '';
			}

			if (!empty($item->id_comentario)) {
				$item->comentario = $modelComentario->getData($item->id_comentario);
				unset($item->id_comentario);
			}

			if ($item->interacao->id == 9) {
				$comentariosConsultandoUser = ThomisticusHelperModel::select('#__ouvidoria_comentarios', ['id', 'created_by', 'id_user_consultado'], ['id_user_consultado' => $item->created_by->id], 'ObjectList');
				$lastInteracaoToAnswer      = end($comentariosConsultandoUser);

				$item->comentario->user_consultado_por_name = JFactory::getUser($lastInteracaoToAnswer->created_by)->name;
			}

			$item->isAnamatraInteraction = empty($item->created_by_solicitante);
			$item->showCommentFooter     = !empty($item->comentario->user_consultado_name) || !empty($item->comentario->anexo) || !empty($item->comentario->user_consultado_por_name);

		}

		return $items;
	}

	/**
	 * Retornar a solicitação pertencente aos comentários desta model
	 * Chamado no view.html.php da view de comentarios
	 * @return mixed
	 */
	public function getSolicitacao()
	{
		if (empty($this->solicitacao->id)) {
			$app           = JFactory::getApplication();
			$idSolicitacao = $app->input->get('solicitacao');

			/** @var OuvidoriaModelSolicitacao $model */
			$model = ThomisticusHelperComponent::getModel('Solicitacao');

			$this->solicitacao = $model->getData($idSolicitacao);
		}

		return $this->solicitacao;
	}

	/**
	 * Retornar os dados do solicitante que criou a solicitação dos comentários desta model
	 * Chamado no view.html.php da view de comentarios
	 *
	 * @return mixed
	 */
	public function getSolicitante()
	{
		if (empty($this->solicitante->id)) {
			$app           = JFactory::getApplication();
			$idSolicitacao = $app->input->get('solicitacao');
			$idSolicitante = ThomisticusHelperModel::select('#__ouvidoria_solicitacoes', 'id_solicitante', ['id' => $idSolicitacao], 'Result');

			/** @var OuvidoriaModelSolicitante $model */
			$model             = ThomisticusHelperComponent::getModel('Solicitante');
			$this->solicitante = $model->getData($idSolicitante);

			$this->solicitante->cpf = Thomisticus\Utils\Strings::mask($this->solicitante->cpf, '000.000.000-00');
		}

		return $this->solicitante;
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

		foreach ($filters as $key => $value) {
			if (strpos($key, '_dateformat') && !empty($value) && $this->isValidDate($value) == null) {
				$filters[$key]    = '';
				$error_dateformat = true;
			}
		}

		if ($error_dateformat) {
			$app->enqueueMessage(JText::_("COM_OUVIDORIA_SEARCH_FILTER_DATE_FORMAT"), "warning");
			$app->setUserState($this->context . '.filter', $filters);
		}

		return parent::loadFormData();
	}

	/**
	 * Checks if a given date is valid and in a specified format (YYYY-MM-DD)
	 *
	 * @param   string $date Date to be checked
	 *
	 * @return bool
	 */
	private function isValidDate($date)
	{
		$date = str_replace('/', '-', $date);

		return (date_create($date)) ? JFactory::getDate($date)->format("Y-m-d") : null;
	}
}
