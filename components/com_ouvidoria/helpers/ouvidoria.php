<?php

/**
 * @version    CVS: 1.0.3
 * @package    Com_Ouvidoria
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  2017 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */

use Thomisticus\Utils\Arrays;
use Thomisticus\Utils\Strings;

defined('_JEXEC') or die;

JLoader::register('OuvidoriaHelper', JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components' . DIRECTORY_SEPARATOR . 'com_ouvidoria' . DIRECTORY_SEPARATOR . 'helpers' . DIRECTORY_SEPARATOR . 'ouvidoria.php');

/**
 * Class OuvidoriaFrontendHelper
 *
 * @since  1.6
 */
class OuvidoriaHelpersOuvidoria
{
	/**
	 * Ids das interações que serão exibidas apenas para os usuários da Anamatra na lista de comentários
	 * [Transferir o chamado, Consulta Interna, Responder consulta]
	 *
	 * @var array $interactionsToShowOnlyToAnamatraUsers
	 */
	public static $interactionsToShowOnlyToAnamatraUsers = [2, 7, 9];

	/**
	 * Ids das interações que possuem alteração de status
	 * [Analisar chamado, Aguardar solicitante, Devolver ao solicitante, Arquivar chamado, Resolver chamado]
	 * @var array $interactionsIdsWithStatusChangeMsg
	 */
	public static $interactionsIdsWithStatusChangeMsg = [1, 3, 4, 5, 6];

	/**
	 * Classes CSS que definirão o tipo de exibição do balão do comentário na lista de comentários
	 *
	 * @var array $itemClassesByIdInteracao = no formato [idInteracao => 'CSS-class']
	 */
	public static $itemClassesByIdInteracao = [
		3 => 'user-item',
		4 => 'user-item',
		5 => 'user-item',
		6 => 'user-item',
		7 => 'user-item consulta',
		9 => 'consulta'
	];

	/**
	 * Get an instance of the named model
	 *
	 * @param   string $name Model name
	 *
	 * @return null|object
	 */
	public static function getModel($name)
	{
		$model = null;

		// If the file exists, let's
		if (file_exists(JPATH_SITE . '/components/com_ouvidoria/models/' . strtolower($name) . '.php')) {
			require_once JPATH_SITE . '/components/com_ouvidoria/models/' . strtolower($name) . '.php';
			$model = JModelLegacy::getInstance($name, 'OuvidoriaModel');
		}

		return $model;
	}

	/**
	 * Gets the files attached to an item
	 *
	 * @param   int    $pk    The item's id
	 *
	 * @param   string $table The table's name
	 *
	 * @param   string $field The field's name
	 *
	 * @return  array  The files
	 */
	public static function getFiles($pk, $table, $field)
	{
		$db    = JFactory::getDbo();
		$query = $db->getQuery(true);

		$query
			->select($field)
			->from($table)
			->where('id = ' . (int)$pk);

		$db->setQuery($query);

		return explode(',', $db->loadResult());
	}

	/**
	 * Gets the edit permission for an user
	 *
	 * @param   mixed $item The item
	 *
	 * @return  bool
	 */
	public static function canUserEdit($item)
	{
		$permission = false;
		$user       = JFactory::getUser();

		if ($user->authorise('core.edit', 'com_ouvidoria')) {
			$permission = true;
		} else {
			if (isset($item->created_by)) {
				if ($user->authorise('core.edit.own', 'com_ouvidoria') && $item->created_by == $user->id) {
					$permission = true;
				}
			} else {
				$permission = true;
			}
		}

		return $permission;
	}


	/**
	 * Verifica se o usuário logado possui o usergroup 54 (Ouvidoria) e 55 (Ouvidoria - Geral)
	 * É útil para saber se será exibido todas as solicitações na listagem, ou apenas os da diretoria dele
	 *
	 * @return bool
	 */
	public static function isUserOuvidoriaGeral()
	{
		$usergroups = JFactory::getUser()->groups;

		return Arrays::insideAnother($usergroups, [54, 55]);
	}

	/**
	 * Verifica se o usuário logado é Super User ou pertencente a algum grupo da ouvidoria
	 * É útil para saber a forma que será exibido o formulário na view dos comentários
	 *
	 * @return bool
	 */
	public static function isUserOuvidoriaOrSuperUser()
	{
		$anamatraUserGroups = [8, 54, 55, 56];
		$usergroups         = JFactory::getUser()->groups;

		return !empty(array_intersect($anamatraUserGroups, $usergroups));
	}

	/**
	 * Gets data of an associado
	 *
	 * @param array $data
	 *
	 * @return bool|Object
	 */
	public static function getAssociado(array $data)
	{
		$id = !empty($data['id']) ? $data['id'] : ThomisticusHelperModel::select('#__associados', ['id'], $data, 'Result');

		/** @var AssociadosModelAssociadoForm $model */
		$model = ThomisticusHelperComponent::getModel('AssociadoForm', 'com_associados');

		return $model->getData($id);
	}

	/**
	 * Verifica se é associado, se for retorna o seu id.
	 * Usado no método Bind da table dos solicitantes
	 *
	 * @param array $data
	 *
	 * @return integer|bool    associado primary key or false if is not associado
	 */
	public static function isAssociado(array $data)
	{
		$idAssociado = ThomisticusHelperModel::select('#__associados', 'id', $data, 'Result');

		return $idAssociado ?: false;
	}

	/**
	 * Procura uma solicitação que o criador possua o $cpf e possua o $protocolo
	 *
	 * @param string|integer $cpf
	 * @param string|integer $protocolo
	 *
	 * @return mixed|integer    id da solicitação
	 */
	public static function getIdSolicitacaoByCpfAndProtocolo($cpf, $protocolo)
	{
		$cpf       = Strings::onlyNumbers($cpf);
		$protocolo = Strings::onlyNumbers($protocolo);

		$db = JFactory::getDbo();

		$query = $db->getQuery(true);

		$query
			->select(array('solicitacao.id'))
			->from($db->quoteName('#__ouvidoria_solicitacoes', 'solicitacao'))
			->join('', $db->quoteName('#__ouvidoria_solicitantes', 'solicitante') . ' ON (' . $db->quoteName('solicitacao.id_solicitante') . ' = ' . $db->quoteName('solicitante.id') . ')')
			->where($db->quoteName('solicitante.cpf') . ' = ' . $cpf)
			->where($db->quoteName('solicitacao.protocolo') . ' = ' . $protocolo);

		return $db->setQuery($query)->loadResult();
	}

	/**
	 * Retorna as interações possíveis da tabela solicitacoes_interacoes
	 * Chamada na view dos comentários, para criar o select das interações
	 *
	 * @param bool $hasUserToAnswer Se possuir
	 *
	 * @return array
	 */
	public static function getInteracoes($hasUserToAnswer = false)
	{
		$result = ThomisticusHelperModel::select('#__ouvidoria_solicitacoes_interacoes', ['id', 'nome'], ['state' => 1]);

		$isUserOuvidoriaOrSuperUser = self::isUserOuvidoriaOrSuperUser();

		$interacoes = [];
		foreach ($result as $interacao) {
			$interacoes[$interacao['id']] = $interacao['nome'];
		}

		$interacoes = Arrays::remove($interacoes, ($isUserOuvidoriaOrSuperUser ? [8] : [1, 2, 3, 4, 5, 6, 7]));

		if (!$hasUserToAnswer) {
			$interacoes = Arrays::remove($interacoes, [9]);
		} else {
			$interacoes = Arrays::remove($interacoes, [1, 2, 3, 4, 5, 6, 7, 8]);
		}

		return $interacoes;
	}

	/**
	 * Retorna os usuários que podem ser consultados nas solicitacões,
	 * junto aos usuários que sempre podem ser consultados (das configurações do componente).
	 * Chamado na view dos comentários para montar o select dos usuários consultáveis.
	 *
	 * @param integer $idDiretoria O id da diretoria (opcional)
	 *
	 * @return array|null   Array de usuários no formato [userid => username]
	 */
	public static function getUsersConsultaveis($idDiretoria = null)
	{
		// Usuários que sempre podem ser consultados, que estão nos parâmetros do componente
		$extraUsersCanBeConsulted = JComponentHelper::getParams('com_ouvidoria')->get('id_users_can_consultar');

		$db = JFactory::getDbo();

		$query = $db->getQuery(true);

		$query
			->select(array('users.id', 'users.name'))
			->from($db->quoteName('#__users', 'users'))
			->join('LEFT', $db->quoteName('#__ouvidoria_diretorias_users_responsaveis', 'usersResp') . ' ON (' . $db->quoteName('usersResp.id_user') . ' = ' . $db->quoteName('users.id') . ')')
			->where($db->quoteName('usersResp.id_diretoria') . ($idDiretoria ? (' = ' . $idDiretoria) : (' IS NOT NULL ')) . ' OR ' . $db->quoteName('users.id') . ' IN(' . implode(',', $extraUsersCanBeConsulted) . ')')
			->order($db->quoteName('users.name') . ' DESC');

		$users = $db->setQuery($query)->loadAssocList();

		$loggedIndUserId   = JFactory::getUser()->id;
		$usersConsultaveis = [];
		foreach ($users as $user) {
			if ($user['id'] != $loggedIndUserId) {
				$usersConsultaveis[$user['id']] = $user['name'];
			}
		}

		return $usersConsultaveis;
	}


	/**
	 * Retorna os emails dos usuários que podem ser consultados nas solicitacões de determinada diretoria.
	 * Chamado no controller OuvidoriaControllerComentarioForm (after save) para executar as ações das interacões
	 *
	 * @param integer $idDiretoria O id da diretoria
	 *
	 * @return array|null   Array de usuários no formato [userid => email]
	 */
	public static function getEmailsUsersConsultaveis($idDiretoria)
	{
		$db = JFactory::getDbo();

		$query = $db->getQuery(true);

		$query
			->select(array('users.id', 'users.email'))
			->from($db->quoteName('#__users', 'users'))
			->join('LEFT', $db->quoteName('#__ouvidoria_diretorias_users_responsaveis', 'usersResp') . ' ON (' . $db->quoteName('usersResp.id_user') . ' = ' . $db->quoteName('users.id') . ')')
			->where($db->quoteName('usersResp.id_diretoria') . ' = ' . $idDiretoria)
			->order($db->quoteName('users.id') . ' DESC');

		$users = $db->setQuery($query)->loadAssocList();

		$usersConsultaveis = [];
		foreach ($users as $user) {
			$usersConsultaveis[$user['id']] = $user['email'];
		}

		return $usersConsultaveis;
	}

	/**
	 * Retorna o array com as diretorias cadastradas na tabela #__ouvidoria_diretorias
	 * Chamada na view dos comentários para fazer o select do "Transferir para"
	 *
	 * @return array    Array das diretorias no formato ['id' => 'nome']
	 */
	public static function getDiretorias()
	{
		$results = ThomisticusHelperModel::select('#__ouvidoria_diretorias', ['id', 'nome'], ['state' => 1]);

		$diretorias = [];
		foreach ($results as $diretoria) {
			$diretorias[$diretoria['id']] = $diretoria['nome'];
		}

		return $diretorias;
	}

	/**
	 * Retornar os dados de uma interação para os métodos postSave dos comentários
	 *
	 * @param string|integer $idInteracao
	 *
	 * @return mixed|JObject com id e nome do status + id e nome da solicitacao
	 */
	public static function getPostSaveInteracao($idInteracao)
	{
		$db = JFactory::getDbo();

		$query = $db->getQuery(true);

		$query
			->select('`interacao`.`id` AS id, `interacao`.`nome` AS nome, `status`.`id` AS id_status, `status`.`nome` AS nome_status')
			->from($db->quoteName('#__ouvidoria_solicitacoes_interacoes', 'interacao'))
			->join('LEFT', $db->quoteName('#__ouvidoria_solicitacoes_status', 'status') . ' ON (' . $db->quoteName('interacao.id_status_vinculado') . ' = ' . $db->quoteName('status.id') . ')')
			->where($db->quoteName('interacao.id') . ' = ' . $idInteracao);

		return $db->setQuery($query)->loadObject();
	}

	public static function getUserCommentToAnswer($idSolicitacao)
	{
		$comentarios = ThomisticusHelperModel::select('#__ouvidoria_comentarios', ['id', 'created_by'], ['id_solicitacao' => $idSolicitacao, 'id_user_consultado' => JFactory::getUser()->id, 'respondido' => 0], 'ObjectList');

		if (empty($comentarios)) {
			return null;
		}

		$lastCommentToAnswer = end($comentarios);

		return $lastCommentToAnswer;
	}

	/**
	 * Verificar se a solicitação deve estar desabilitada ou não
	 *
	 * @param integer $idSolicitacao
	 *
	 * @return bool     true se for de status Devolvido, Arquivado, Finalizado ou Resolvido
	 */
	public static function isSolicitacaoDisabled($idSolicitacao)
	{
		$statusSolicitacao = ThomisticusHelperModel::select('#__ouvidoria_solicitacoes', 'status', ['id' => $idSolicitacao], 'Result');

		// Devolvido, Arquivado, Finalizado
		$idStatusDisabled = [3, 4, 6];

		return in_array($statusSolicitacao, $idStatusDisabled);
	}

}
