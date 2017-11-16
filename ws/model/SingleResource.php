<?php

/**
 * Class Resource
 */
class SingleResource
{
	/** @var integer = Resource ID */
	private $id;

	/** @var string = Table with prefix that this resource represents */
	private $table;

	/** @var $string = The privileges that this resource (table) will have for those who access the webservice. */
	private $privileges;

	/** @var array = The columns that appear in JSON, for those who access the webservice (Local). */
	private $columns;

	/** @var array = The columns that appear in JSON, for those who access the webservice (External). */
	private $extColumns;

	/** @var array = Values (keys) and for what value will be converted. */
	private $fromTos;

	/**
	 * SingleResource constructor.
	 *
	 * @param int    $id
	 * @param string $table
	 * @param string $privileges
	 * @param string $modelSchema
	 */
	public function __construct($id, $table, $privileges, $modelSchema)
	{
		$this->setId($id);
		$this->setTable($table);
		$this->setPrivileges($privileges);

		$modelSchema = json_decode($modelSchema, true);
		$this->setColumns($modelSchema);
		$this->setExtColumns($modelSchema);
		$this->setFromTos($modelSchema);
	}

	/**
	 * @param $id
	 */
	private function setId($id)
	{
		$this->id = $id;
	}

	/**
	 * @return int = Resource ID
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * @return string = Table with prefix that this resource represents.
	 */
	public function getTable()
	{
		return $this->table;
	}

	/**
	 * @param $table
	 */
	private function setTable($table)
	{
		$this->table = $table;
	}

	/**
	 * @return mixed = The privileges that this resource (table) will have for those who access the webservice.
	 */
	public function getPrivileges()
	{
		return $this->privileges;
	}

	/**
	 * @param mixed $privileges = The privileges that this resource (table) will have for those who access the webservice.
	 */
	private function setPrivileges($privileges)
	{
		$this->privileges = is_array($privileges) ? $privileges : explode(",", $privileges);
	}

	/**
	 * @param boolean $assoc = If want to retrieve as string
	 *
	 * @return string = The columns that appear in JSON, for those who access the webservice (Local)
	 */
	public function getColumns($assoc = true)
	{
		return (!$assoc) ? implode(", ", $this->columns) : $this->columns;
	}

	/**
	 * @param string $modelSchema = The columns that appear in JSON, for those who access the webservice.
	 */
	private function setColumns($modelSchema)
	{
		$this->columns = array_column($modelSchema, 'local');
	}

	/**
	 * @return string = The columns that appear in JSON, for those who access the webservice (External)
	 */
	public function getExtColumns($revert = false)
	{
		return (!$revert) ? array_combine($this->columns, $this->extColumns) : array_combine($this->extColumns,
			$this->columns);
	}

	/**
	 * @param array $modelSchema
	 */
	private function setExtColumns($modelSchema)
	{
		$this->extColumns = array_column($modelSchema, 'external');
	}

	/**
	 * @return array = Array of From/Tos
	 */
	public function getFromTos()
	{
		return $this->fromTos;
	}

	/**
	 * @param $modelSchema
	 */
	private function setFromTos($modelSchema)
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
	 * Retrieves string of columns and their alias to be used in Read consults
	 * @return string = id as IDT, state as ST...
	 */
	public function getProvideColumns()
	{
		$columnsAssoc = array_combine($this->getColumns(), $this->getExtColumns());

		$provideColumns = implode(", ", array_map(function ($key, $value) {
			return ($key != $value) ? sprintf("`%s` as `%s`", $key, $value) : "`{$value}`";
		}, array_keys($columnsAssoc), $columnsAssoc
		));

		return $provideColumns;
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