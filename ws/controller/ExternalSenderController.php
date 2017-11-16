<?php
require_once(JPATH_ROOT . '/ws/assets/httpful.phar');
require_once(JPATH_ROOT . '/ws/helpers/AssociadosHelper.php');
require_once(JPATH_ROOT . '/ws/Config.inc.php');
require_once(JPATH_ROOT . '/ws/database/Update.php');
require_once(JPATH_ROOT . '/ws/database/Read.php');
require_once(JPATH_ROOT . '/ws/treater/ExternalSenderTreater.php');

class ExternalSenderController
{
	/** @var  SingleExternalSender */
	private $extSender;

	/** @var  array */
	private $treatedElements;

	private $METHODMAP = ['INSERT' => 'post', 'UPDATE' => 'put', 'DELETE' => 'delete'];

	/**
	 * Send multiples Http Request to another server
	 *
	 * @param $logItems = Items to be sent trough http request
	 * @param $result   = number of rows at log table
	 *
	 * @return int|string $result = The result is returned to Ajax function
	 */
	public function sendMultipleRequests($logItems, $result)
	{
		foreach ($logItems as $key => $logItem) {
			$this->treatRequestSubmission($logItem);

			$this->treatedElements = ($logItem['method'] == 'DELETE' ?
				AssociadosHelper::sanitizeNumbers($this->treatedElements, array('A1_CGC')) :
				AssociadosHelper::treatSpecialFields($this->treatedElements)
			);

			if (!empty($this->treatedElements) && !is_bool($this->treatedElements)) {
				$json = str_replace('null', '""',
					json_encode($this->treatedElements, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

				$this->sendRequest($this->extSender->getUrl(), $json, $this->METHODMAP[$logItem['method']]);

				$this->updateRequestSentLog($logItem['id']);
			}
		}

		return $result;
	}

	/**
	 * Send multiples Http Request to another server by Backend
	 *
	 * @param array $items = Items to be sent trough http request
	 *                     [ex: multidimensional array with: array('id_resource_element' => '1', 'resource' => 'foo', 'method' => INSERT)]
	 *
	 * @return bool|mixed $response of the request
	 */
	public function sendRequestByComponent($item)
	{
		$this->treatRequestSubmission($item);
		$this->treatedElements = AssociadosHelper::treatSpecialFields($this->treatedElements);

		if (!empty($this->treatedElements) && !is_bool($this->treatedElements)) {
			$json = str_replace('null', '""',
				json_encode($this->treatedElements, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

			return $this->sendRequest($this->extSender->getUrl(), $json, $this->METHODMAP[$item['method']]);
		}

		return false;
	}

	public function treatRequestSubmission($logItem)
	{
		$extTreater = new ExternalSenderTreater();

		if ($extTreater->treatExternalSender($logItem['resource'])) {
			$this->extSender = $extTreater->getExtSender();

			$extTreater->treatElementKeys($logItem['method'] == 'DELETE' ? array('cpf' => $logItem['id_resource_element']) :
				$this->getItem($logItem, $this->extSender->getColumns())
			);

			$this->treatedElements = $extTreater->treatFromTos($extTreater->getTreatedElements());
		}
	}

	/**
	 * @param string       $url    = URL to send the request
	 * @param string|mixed $json   = Request Body
	 * @param string       $method = Request method (post, put)
	 *
	 * @return mixed|object = Resultado da Request (Httpful object)
	 */
	public function sendRequest($url, $json, $method)
	{
		$response = \Httpful\Request::$method($url)->sendsJson()->body($json)->send();

		return $response;
	}

	/**
	 * This method get information of updated/inserted/deleted element on triggered table
	 * based on resource and id_resource_element from log table
	 *
	 * @param $logItem = element in log table
	 *
	 * @return mixed|string = json to Http Request (body)
	 */
	public function getItem($logItem, $columns)
	{
		$read = new Read();

		$read->exeRead($logItem['resource'], implode(', ', $columns),
			" WHERE `id` = :id", "id=" . $logItem['id_resource_element']);

		$element = !empty($read->getResult()) ? $read->getResult()[0] : '';

		if ($logItem['method'] != 'UPDATE' && !empty($element)) {
			unset($element['id']);
		}

		return $element;
	}

	/**
	 * Method to update Log Database, saying that specific request has already been sent to external url
	 *
	 * @param $id = primary key's row of log database
	 */
	public function updateRequestSentLog($id)
	{
		$update = new Update();

		$update->exeUpdate(PREFIX . 'restful_extsender_logs', array('request_sent' => 1), "id={$id}");
		$update->getResult();
	}
}
