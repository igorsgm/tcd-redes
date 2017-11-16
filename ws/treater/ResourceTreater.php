<?php

class ResourceTreater
{
	/** @var SingleResource */
	private static $resource;

	/** @var  array */
	private static $treatedElements;

	/** @var string */
	private static $limit;

	/**
	 * Checks if the request is valid by checking if the method and columns are all available
	 * Based on real column name (local database) and how is it provided (external).
	 *
	 * @param Request $request
	 * @param string  $method = Request method
	 *
	 * @return bool = true if the request is valid, false otherwise (Before treat the Resource and Request Elements)
	 */
	public static function validateRequest($request, $method)
	{
		$elements = $request->{($method == 'read' ? 'getParams' : 'getBody')}();

		if (!empty($elements['limit'])) {
			self::$limit = $elements['limit'];
			unset($elements['limit']);
		}

		self::treatResource($request->getResource());

		if (!self::validateElements($elements)) {
			return false;
		}

		self::treatElements($elements);

		return (self::validateElements(self::$treatedElements) && !empty(self::$resource))
			? in_array($method, self::$resource->getPrivileges()) : false;

	}

	/**
	 * Sets resource properties to attribute according to getResourceInfo's return.
	 *
	 * @param string $resourceName = the table name without prefix
	 */
	private static function treatResource($resourceName)
	{
		$resourceInfo = self::getResourceInfo($resourceName);

		if (!is_null($resourceInfo)) {
			self::$resource = new SingleResource($resourceInfo['id'], $resourceInfo['table'],
				$resourceInfo['privileges'], $resourceInfo['model_schema']);
		}
	}

	/**
	 * Executes a database consult and retrieves an array with resource information (id, state, privileges, columns)
	 *
	 * @param string $resourceName
	 *
	 * @return array|null = an array if resource exists and is not empty, null otherwise
	 */
	private static function getResourceInfo($resourceName)
	{
		$read = new Read();
		$read->exeRead(PREFIX . "restful_resources", "*", " WHERE `table` = :table AND `state` = :state LIMIT :limit",
			"table=" . PREFIX . $resourceName . "&state=1&limit=1");

		return !empty($read->getResult()) ? $read->getResult()[0] : null;
	}

	/**
	 * Checks if parameters sent by URL or as Request Body are all available
	 *
	 * @param array $elements = array of parameters from Request [usually received by $request->getParams()]
	 *
	 * @return bool = true if all parameters are available or any parameter has been sent (to show all rows)
	 */
	private static function validateElements($elements)
	{
		return (!empty($elements)) ? count(array_intersect(array_keys($elements),
				array_keys(self::$resource->getMergedColumns()))) == count($elements) : true;
	}

	/**
	 * Parse element keys that accepts another name (Provide As) to the database value
	 * To be used for CRUD methods
	 *
	 * @param $elements
	 */
	private static function treatElements($elements)
	{
		$map = self::$resource->getMergedColumns();

		$treatedElements = array();
		foreach ($elements as $key => $element) {
			$treatedElements[$map[$key]] = $element;
		}

		self::$treatedElements = $treatedElements;
	}

	/**
	 * Parse array values based on From/To
	 *
	 * @param array $results = Array of results of SQL Query
	 *
	 * @return array = Parsed/treated values
	 */
	public static function treatFromTos($results)
	{
		$fromTos = self::$resource->getFromTos();

		$treatedFromTos = array();
		foreach ($results as $key1 => $arrayResult) {
			foreach ($arrayResult as $key2 => $result) {
				if (in_array($key2, array_keys($fromTos))) {
					$result = (in_array($result, $fromTos[$key2]) ? array_search($result, $fromTos[$key2]) : $result);
				}
				$treatedFromTos[$key1][$key2] = $result;
			}
		}

		return $treatedFromTos;
	}

	/**
	 * @return SingleResource
	 */
	public static function getResource()
	{
		return self::$resource;
	}

	/**
	 * @return array
	 */
	public static function getTreatedElements()
	{
		if (!empty(self::$limit)) {
			self::$treatedElements['limit'] = self::$limit;
		}

		return self::$treatedElements;
	}

}
