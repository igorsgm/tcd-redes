<?php
/**
 * @package     Thomisticus.Library
 * @subpackage  Helper
 *
 * @copyright   Copyright (C) 2017-2021 Igor Moraes. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('_JEXEC') or die;

/**
 * Asset helper
 *
 * @package     Thomisticus.Library
 * @subpackage  Helper
 * @since       1.0
 */
abstract class ThomisticusHelperModel
{

    /**
     * Generic method to make a select in the database
     *
     * @param       string       $tableName  The table name (eg: #__content)
     * @param       array|string $columns    Column or array of columns [eg: '*' | array('id', 'state', 'column_name')]
     * @param array              $properties Array of properties to WHERE string [eg: array('id' => 1)]
     *
     * @return mixed            The array of JObjects (query result)
     */
    public static function select($tableName, $columns, array $properties, $loadType = 'AssocList')
    {
        if (!is_array($columns) && $columns !== '*') {
            $columns = array($columns);
        }

        $db = JFactory::getDbo();

        $query = $db->getQuery(true);

        $query->select($columns == '*' ? $columns : $db->quoteName($columns))
            ->from($db->quoteName($tableName));

        foreach ($properties as $property => $value) {
            $query->where($db->quoteName($property) . ' = ' . $db->quote($value));
        }

        return $db->setQuery($query)->{'load' . $loadType}();
    }


    /**
     * Generic method to delete a record in database
     *
     * @param       string $tableName  The table name (eg: #__content)
     * @param array        $conditions Array of properties to WHERE string [eg: array('id' => 1)]
     *
     * @return boolean
     */
    public static function delete($tableName, array $conditions)
    {
        $db = JFactory::getDbo();

        $query = $db->getQuery(true);

        $query->delete($db->quoteName($tableName));

        foreach ($conditions as $property => $value) {
            $query->where($db->quoteName($property) . ' = ' . $db->quote($value));
        }

        return $db->setQuery($query)->execute();
    }

    /**
     * Generic method to make an insert in the database
     *
     * @param       string       $tableName The table name (eg: #__content)
     * @param       array|string $columns   Column or array of columns [eg: '*' | array('id', 'state', 'column_name')]
     * @param array              $values    Array of values (must be ordered with columns) [eg: array(1001, $db->quote('custom.message'), $db->quote('Inserting a record using insert()'), 1)]
     *
     * @return boolean
     */
    public static function insert($tableName, $columns, $values)
    {
        if (!is_array($columns)) {
            $columns = array($columns);
        }

        $db = JFactory::getDbo();

        foreach ($values as $key => $value) {
            if (is_string($value)) {
                $values[$key] = $db->quote($value);
            }
        }

        $query = $db->getQuery(true);

        $query
            ->insert($db->quoteName($tableName))
            ->columns($db->quoteName($columns))
            ->values(implode(',', $values));

        return $db->setQuery($query)->execute();
    }

    /**
     * Generic method to make an update in the database
     *
     * @param string       $tableName  The table name (eg: #__content)
     * @param array|string $fields     Fields to set [eg: '*' | array('field' => 'value')]
     * @param array        $properties Array of properties to WHERE string [eg: array('id' => 1)]
     *
     * @return mixed
     */
    public static function update($tableName, $fields, $properties)
    {
        if (!is_array($fields)) {
            $fields = array($fields);
        }

        $db = JFactory::getDbo();

        $query = $db->getQuery(true);

        $fieldsToSet = array();
        foreach ($fields as $field => $value) {
            $fieldsToSet[] = ($db->quoteName($field) . ' = ' . $db->quote($value));
        }

        $conditions = array();
        foreach ($properties as $property => $value) {
            $conditions[] = $db->quoteName($property) . ' = ' . $db->quote($value);
        }

        $query->update($db->quoteName($tableName))->set($fieldsToSet)->where($conditions);

        return $db->setQuery($query)->execute();
    }
}
