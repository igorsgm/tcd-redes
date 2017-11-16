<?php

/**
 * Class ResourceController
 */
class ResourceController
{
	private $METHODMAP = ['POST' => 'create', 'GET' => 'read', 'PUT' => 'update', 'DELETE' => 'delete'];

	/** @var SingleResource */
	private $resource;

	/**
	 * Calling a function by string, according to which METHODMAP's array key
	 *
	 * @param Request $request
	 *
	 * @return mixed|null = a json if the request is successful, treated PHP error otherwise.
	 */
	public function treatRequest($request)
	{
		$method = $this->METHODMAP[$request->getMethod()];

		// Evitar erro de acentuação ao receber o body
//		$request->setBody((array_map("utf8_decode", $request->getBody())));

		if (ResourceTreater::validateRequest($request, $method)) {
			$this->resource = ResourceTreater::getResource();

			return $this->{$method}(ResourceTreater::getTreatedElements());
		}

		Erro("<b>Error:</b> This resource is not available or you do not have permission to access it", 403);
		die;
	}

	/**
	 * ****************************************
	 * *********** PRIVATE METHODS ************
	 * ****************************************
	 */

	/**
	 * Execute an Insert in Database from body request
	 *
	 * @param Request $request
	 */
	private function create($treatedElements)
	{
		$create = new Create();
		$create->exeCreate($this->resource->getTable(), $treatedElements);

		return $create->getResult();
	}

	/**
	 * Create SQL query SELECT
	 *
	 * @param Request $request
	 *
	 * @return string
	 */
	private function read($treatedElements)
	{
		$read = new Read();
		$read->exeRead($this->resource->getTable(), $this->resource->getProvideColumns(),
			$read->getConditions($treatedElements), $treatedElements);

		return ResourceTreater::treatFromTos($read->getResult());
	}

	/**
	 * Execute an Update in Database
	 * The primary key must be the first element in array, to be used as query criteria
	 *
	 * @param Request $request
	 */
	private function update($treatedElements)
	{
		$body = $treatedElements;

		$update = new Update();

		// The first key of array, which must be the primary key, for prepared statement. Ex: id = :id
		$term = key($body);

		//String to replacement when query is prepared by PDO. Ex: id = 5
		$criteria = "{$term} = " . reset($body);

		$update->exeUpdate($this->resource->getTable(), $body, "{$term} = :{$term}", $criteria);

		return $update->getResult();
	}

	/**
	 * Execute an Update in Database
	 * Request body must have at least one column=value to be used as query criteria (preferably primary key at array beginning)
	 *
	 * @param Request $request
	 */
	private function delete($treatedElements)
	{
		$delete = new Delete();
		$delete->exeDelete($this->resource->getTable(), $delete->getConditions($treatedElements),
			http_build_query($treatedElements));

		return $delete->getResult();
	}
}
