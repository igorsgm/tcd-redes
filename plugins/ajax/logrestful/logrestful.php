<?php defined('_JEXEC') or die;

// Import library dependencies
jimport('joomla.plugin.plugin');

include_once(JPATH_ROOT . '/ws/controller/ExternalSenderController.php');
require_once(JPATH_ADMINISTRATOR . '/components/com_associados/helpers/associados_users.php');

class plgAjaxLogrestful extends JPlugin
{
	/**
	 * @var integer Number of rows in Log table
	 */
	private $logsCount;

	/**
	 * Get row's number of Log Table
	 * @return int
	 */
	public function onAjaxLogrestful()
	{
		$db = JFactory::getDbo();

		$query = $db->getQuery(true);
		$query->select('COUNT(*)')->from('#__restful_extsender_logs');

		$result = $db->setQuery($query)->loadResult();

		if ($result != $this->logsCount) {
			$this->logsCount = $result;

			$noSentRequests = $this->getNoSentRequests();

			$newAssociadosIds = $this->eventCases($noSentRequests, 'INSERT');
			if (!empty($newAssociadosIds)) {
				AssocUsersAcy::createUsers(AssocUsersAcy::getAssociadosInfoByIds($newAssociadosIds));
			}

			$updatedAssociados = $this->eventCases($noSentRequests, 'UPDATE');
			if (!empty($updatedAssociados)) {
				AssocUsersAcy::verifyUsersToUpdate(AssocUsersAcy::getAssociadosInfoByIds($updatedAssociados));
			}

			(new ExternalSenderController())->sendMultipleRequests($noSentRequests, $result);
		}

		return $result;
	}

	/**
	 * Get array of elements that must and have not been sent yet
	 * @return mixed|array = request that have not been sent yet
	 */
	private function getNoSentRequests()
	{
		$db = JFactory::getDbo();

		$query = $db->getQuery(true);
		$query->select('id, resource, id_resource_element, method')->from('#__restful_extsender_logs')
			->where('request_sent = 0');

		return $db->setQuery($query)->loadAssocList();
	}

	/**
	 * @param $logs = Novas linhas inseridas nos logs
	 * @param $method = 'INSERT', 'UPDATE', 'DELETE'
	 * @return array = array com os ids dos logs de um método específico
	 */
	private function eventCases($logs, $method)
	{
		$eventCases = array();
		foreach ($logs as $key => $log) {
			if ($log['method'] == $method) {
				$eventCases[$key] = $log['id_resource_element'];
			}
		}

		return $eventCases;
	}

}
