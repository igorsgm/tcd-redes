<?php

/**
 * @version    CVS: 1.0.9
 * @package    Com_Associados
 * @author     Trídia Criação <atendimento@tridiacriacao.com>
 * @copyright  2016 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */

use Thomisticus\Utils\Arrays;

defined('_JEXEC') or die;

/**
 * Class AssociadosFrontendHelper
 *
 * @since  1.6
 */
class AssociadosHelpersAssociadosfront
{
	/**
	 * Get category name using category ID
	 *
	 * @param integer $category_id Category ID
	 *
	 * @return mixed category name if the category was found, null otherwise
	 */
	public static function getCategoryNameByCategoryId($category_id)
	{
		$db    = JFactory::getDbo();
		$query = $db->getQuery(true);

		$query
			->select('title')
			->from('#__categories')
			->where('id = ' . intval($category_id));

		$db->setQuery($query);

		return $db->loadResult();
	}

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
		if (file_exists(JPATH_SITE . '/components/com_associados/models/' . strtolower($name) . '.php')) {
			require_once JPATH_SITE . '/components/com_associados/models/' . strtolower($name) . '.php';
			$model = JModelLegacy::getInstance($name, 'AssociadosModel');
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

		if ($user->authorise('core.edit', 'com_associados_anpt')) {
			$permission = true;
		} else {
			if (isset($item->created_by)) {
				if ($user->authorise('core.edit.own', 'com_associados') && $item->created_by == $user->id) {
					$permission = true;
				}
			} else {
				$permission = true;
			}
		}

		return $permission;
	}

	/**
	 * Se for o primeiro acesso do associado (valor salvo na session pelo plugin Associado Redirect)
	 * irá redirecionar para a view de edição dos dados com mensagem enqueued + bloqueio de outros links do site
	 *
	 * PS: NECESSÁRIO possuir na view de edição dos dados a chamada deste método
	 * (AssociadosHelpersAssociadosfront::verifyFirstAccess();)
	 */
	public static function verifyFirstAccess()
	{
		if (JFactory::getSession()->get('isAssociadoFirstLogin')) {
			JFactory::getDocument()->addScriptDeclaration('
		        var js = jQuery.noConflict();
				js(document).ready(function() {
					js(".site a").removeAttr("href").css("cursor","pointer");
				});
			');
			// Limpar queue de mensagens
			JFactory::getSession()->set('application.queue', null);

			JFactory::getApplication()->enqueueMessage('Caro(a) associado(a), para continuar navegando nesta página é necessário confirmar seus dados cadastrais e clicar no botão Confirmar.',
				'notice');
		}
	}

	/**
	 * Parse JObject to string to be used in AssociadosModelAssociado
	 * (Support to multiple select form)
	 *
	 * @param $elements
	 *
	 * @return string|null
	 */
	public static function treatJOjectElement($elements)
	{
		if (is_object($elements) || is_array($elements)) {
			$elementsToReturn = array();
			foreach ($elements as $key => $element) {
				if (!empty($element)) {
					array_push($elementsToReturn, $element);
				}
			}

			return implode(",", $elementsToReturn);
		}

		return null;
	}

	/**
	 * Verifica se o usuário logado é Adnub ou pertencente a algum grupo da ouvidoria
	 * É útil para saber a forma que será exibido o formulário na view dos comentários
	 *
	 * @return bool
	 */
	public static function isUserSecretariaOrAdmin()
	{
		$anamatraUserGroups = [7, 8, 42, 53];
		$usergroups         = JFactory::getUser()->groups;

		return !empty(array_intersect($anamatraUserGroups, $usergroups));
	}

	/**
	 * Retorna a lista de amatras no formato [id => 'Nome Amatra']
	 *
	 * @param bool $withNaoInformado    true para inserir o "Não informado" como primeiro item
	 *
	 * @return array
	 */
	public static function getAmatras($withNaoInformado = false)
	{
		$db = JFactory::getDbo();

		$query = $db->getQuery(true);

		$query->select($db->quoteName(array('id', 'title')))
			->from($db->quoteName('#__categories'))
			->where($db->quoteName('extension') . ' LIKE ' . $db->quote('com_associados'))
			->order('id');

		$results = $db->setQuery($query)->loadObjectList();

		$amatras = [];
		foreach ($results as $amatra) {
			$amatras[$amatra->id] = $amatra->title;
		}

		if ($withNaoInformado) {
			$amatras = Arrays::moveToTop($amatras, 99);
		} else {
			unset($amatras[99]);
		}

		return $amatras;
	}

}
