<?php

class SingleExternalSender
{
	/** @var integer = External sender ID */
	private $id;

	/** @var string = URL to send the request */
	private $url;

	/** @var string = Table with prefix that this external sender is monitoring */
	private $table;

	/** @var array = The columns that appear in JSON, for those who access the webservice (Local). */
	private $columns;

	/** @var array = The columns that appear in JSON, for those who will receive the request (External). */
	private $extColumns;

	/** @var array = Values (keys) and for what value will be converted. */
	private $fromTos;


	/**
	 * SingleExternalSender constructor.
	 *
	 * @param int          $id
	 * @param string       $url
	 * @param string       $table
	 * @param string|array $modelSchema
	 */
	public function __construct($id, $url, $table, $modelSchema)
	{
		$this->setId($id);
		$this->setUrl($url);
		$this->setTable($table);

		$modelSchema = json_decode($modelSchema, true);
		$this->setColumns($modelSchema);
		$this->setExtColumns($modelSchema);
		$this->setFromTos($modelSchema);
	}


	/**
	 * @return int
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * @param int $id
	 */
	public function setId($id)
	{
		$this->id = $id;
	}

	/**
	 * @return string
	 */
	public function getUrl()
	{
		return $this->url;
	}

	/**
	 * @param string $url
	 */
	public function setUrl($url)
	{
		$this->url = $url;
	}

	/**
	 * @return string
	 */
	public function getTable()
	{
		return $this->table;
	}

	/**
	 * @param string $table
	 */
	public function setTable($table)
	{
		$this->table = $table;
	}

	/**
	 * @param boolean $assoc = if want to retrieve as string
	 *
	 * @return array|string
	 */
	public function getColumns($assoc = true)
	{
		return (!$assoc) ? implode(", ", $this->columns) : $this->columns;
	}

	/**
	 * @param array $modelSchema
	 */
	public function setColumns($modelSchema)
	{
		$this->columns = array_column($modelSchema, 'local');
	}

	/**
	 * @param boolean $revert = If want to retrieve an array reverse ordered
	 *
	 * @return array
	 */
	public function getExtColumns($revert = false)
	{
		return (!$revert) ? array_combine($this->columns, $this->extColumns) : array_combine($this->extColumns,
			$this->columns);
	}

	/**
	 * @param array $modelSchema
	 */
	public function setExtColumns($modelSchema)
	{
		$this->extColumns = array_column($modelSchema, 'external');
	}

	/**
	 * @return array
	 */
	public function getFromTos()
	{
		return $this->fromTos;
	}

	/**
	 * @param array $fromTos
	 */
	public function setFromTos($modelSchema)
	{
		$fromTos = array();
		foreach ($modelSchema as $key => $ms) {
			if (!empty($ms['fromTo'])) {
				parse_str($ms['fromTo'], $fromTos[$ms['local']]);
				$fromTos[$ms['local']] = array_flip($fromTos[$ms['local']]);
				parse_str($ms['fromTo'], $fromTos[$ms['external']]);
				$fromTos[$ms['external']] = array_flip($fromTos[$ms['external']]);
			}
		}

		$this->fromTos = $fromTos;
	}

	/**
	 * Retrieves a merge of Local Columns array and External Columns array
	 * @return array
	 */
	public function getMergedColumns()
	{
		return array_merge($this->getExtColumns(true), array_combine($this->getColumns(), $this->getColumns()));
	}

}