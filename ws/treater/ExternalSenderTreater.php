<?php
require_once(JPATH_ROOT . '/ws/model/SingleExternalSender.php');

class ExternalSenderTreater
{
	/** @var  SingleExternalSender */
	private $extSender;

	/** @var  array */
	private $treatedElements;


	public function treatExternalSender($tableName)
	{
		$extSenderInfo = $this->getExtSenderInfo($tableName);

		if (!is_null($extSenderInfo)) {
			$this->extSender = new SingleExternalSender($extSenderInfo['id'], $extSenderInfo['url'],
				$extSenderInfo['table'], $extSenderInfo['model_schema']);

			return true;
		}

		return false;
	}


	/**
	 * Executes a database consult and retrieves an array with external sender information (id, state, url, model_schema)
	 *
	 * @param string $tableName
	 *
	 * @return array|null = an array if external sender exists and is not empty, null otherwise
	 */
	private function getExtSenderInfo($tableName)
	{
		$read = new Read();
		$read->exeRead(PREFIX . "restful_external_senders", "*",
			" WHERE `table` = :table AND `state` = :state LIMIT :limit", "table={$tableName}" . "&state=1&limit=1");

		return !empty($read->getResult()) ? $read->getResult()[0] : null;
	}

	/**
	 * Parse element keys that accepts another name (Provide As) to the database value
	 * To be used for CRUD methods
	 *
	 * @param $elements
	 */
	public function treatElementKeys($elements)
	{
		if (!empty($elements)) {
			$map = $this->extSender->getExtColumns();

			$treatedElements = array();
			foreach ($elements as $key => $element) {
				$treatedElements[$map[$key]] = $element;
			}

			$this->treatedElements = $treatedElements;
		}
	}

	/**
	 * Parse array values based on From/To
	 *
	 * @param array $results = Array of results of SQL Query
	 *
	 * @return bool|array = Parsed/treated values
	 */
	public function treatFromTos($results)
	{
		if (!empty($results)) {
			$fromTos = $this->extSender->getFromTos();

			$treatedFromTos = array();
			foreach ($results as $key => $result) {
				if (in_array($key, array_keys($fromTos))) {
					$result = (in_array($result, $fromTos[$key]) ? strval(array_search($result, $fromTos[$key])) : $result);
				}
				$treatedFromTos[$key] = $result;
			}

			return $treatedFromTos;
		}

		return false;
	}

	/**
	 * @return SingleExternalSender
	 */
	public function getExtSender()
	{
		return $this->extSender;
	}

	/**
	 * @return array
	 */
	public function getTreatedElements()
	{
		return $this->treatedElements;
	}
}
