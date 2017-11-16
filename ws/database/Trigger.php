<?php
include_once('DBConnector.php');

class Trigger extends DBConnector
{
	/** @var string = Table that trigger is associated */
	private $table;

	/** @var string Trigger name (unique) */
	private $triggerName;

	/** @var string The trigger event; that is, the type of operation that activates the trigger */
	private $method;

	/** @var boolean = query result */
	private $result;

	/** @var PDOStatement */
	private $trigger;

	/** @var PDO To get the PDO Connection */
	private $connection;


	/**
	 * @param $table       = Table that trigger is associated
	 * @param $triggerName = Trigger name (unique)
	 * @param $method      = The trigger event; that is, the type of operation that activates the trigger
	 */
	public function create($table, $triggerName, $method)
	{
		$this->table       = $table;
		$this->triggerName = $triggerName;
		$this->method      = $method;
		$this->drop($this->triggerName);
		$this->getSyntax();
		$this->execute();
	}

	/**
	 * Create query syntax to Prepared Statements
	 */
	private function getSyntax()
	{
		$element       = $this->method != 'DELETE' ? "NEW.id" : "OLD.cpf";
		$this->trigger = "
			CREATE TRIGGER {$this->triggerName}
			AFTER {$this->method} ON {$this->table}
				FOR EACH ROW
					IF ((SELECT `state` FROM " . PREFIX . "restful_external_senders WHERE `table` = '{$this->table}') = 1) THEN
						INSERT INTO " . PREFIX . "restful_extsender_logs (resource, id_resource_element, change_time, method, request_sent)
							VALUES ('{$this->table}', {$element}, NOW(), '{$this->method}', 0);
					END IF;";
	}

	/**
	 * Get connection and syntax and executes query
	 */
	private function execute()
	{
		$this->connect();
		try {
			$this->trigger->execute();
			$this->result = true;
		} catch (PDOException $e) {
			$this->result = null;
			Erro("<b>Erro ao criar a Trigger:</b> {$e->getMessage()}", $e->getCode());
		}

	}

	/**
	 * Get PDO and prepare query
	 */
	private function connect()
	{
		$this->connection = parent::getConnection();
		$this->trigger    = $this->connection->prepare($this->trigger);
	}

	/**
	 * ****************************************
	 * *********** PRIVATE METHODS ************
	 * ****************************************
	 */

	/**
	 * Drop a trigger if it exists
	 *
	 * @param $triggerName
	 */
	public function drop($triggerName)
	{
		$this->trigger = "DROP TRIGGER IF EXISTS {$triggerName}";
		$this->execute();
	}

	/**
	 * @param $method = The trigger event; that is, the type of operation that activates the trigger
	 * @param $table
	 *
	 * @return string = name of the Trigger (ex: 'onUPDATEtable1')
	 */
	public function generateName($method, $table)
	{
		return "on{$method}{$table}";
	}

	/**
	 * <b>Get result:</b> Retrieves TRUE if no errors occur, or false otherwise.
	 * Even without changing the data, if a query was successful the return is TRUE.
	 * @return bool $var = true or false
	 */
	public function getResult()
	{
		return $this->result;
	}
}