<?php
/**
 * @package     Thomisticus
 * @subpackage  Html
 *
 * @copyright   Copyright (C) 2017-2021 Igor Moraes. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

namespace Thomisticus\Utils;

defined('_JEXEC') or die;


class Objects
{
	/**
	 * Replaces the name of an array of attributes belonging to an object.
	 * Where the array key is the old name of the attribute and the value of the new name to be assigned
	 *
	 * @param object|\JObject|mixed $item           The object to be treated
	 * @param array                 $fromTosColumns The array with old names (key) and new names (value)
	 *                                              eg: array('oldAttrName' => 'newAttrName')
	 *
	 * @return object|\JObject|mixed
	 */
	public static function treatFromToColumns($item, $fromTosColumns)
	{
		foreach ($fromTosColumns as $key => $value) {
			if (self::propertyExists($item, array($value, $key))) {
				$item->$value = $item->$key;
				unset($item->$key);
			}
		}

		return $item;
	}

	/**
	 * Check if multiple properties exists in an object (even if it's null)
	 *
	 * @param \stdClass    $object     Object to be verified
	 * @param array|string $properties String array of properties or a single property
	 *
	 * @return bool true if all properties belongs to the object
	 */
	public static function propertyExists($object, $properties)
	{
		if (!is_array($properties)) {
			return property_exists($object, $properties);
		}

		$allPropertiesExists = false;
		foreach ($properties as $property) {
			$allPropertiesExists = property_exists($object, $property);
		}

		return $allPropertiesExists;
	}

	/**
	 * Replaces the values of an attribute belonging to an object, by the values present in an multidimensional array
	 * where key is the old value and the new value to be assigned
	 *
	 * @param \JObject|object|mixed $item          The object to be treated
	 * @param array                 $fromTosValues The multidimensional array with column and old/new values
	 *                                             eg: array('name' => array('Augustine' => 'Thomas'));
	 *
	 * @return \JObject|object|mixed
	 */
	public static function treatFromToValues($item, $fromTosValues)
	{
		foreach ($fromTosValues as $column => $values) {
			foreach ($values as $oldValue => $newValue) {
				if ($item->$column == $oldValue) {
					$item->$column = $newValue;
				}
			}
		}

		return $item;
	}

	/**
	 * Remove multiple properties in an object
	 *
	 * @param \JObject|object|mixed $object             Object that will have the elements removed
	 * @param array                 $propertiesToRemove Array with element keys to be removed
	 *
	 * @return \JObject|object|mixed $object
	 */
	public static function remove($object, array $propertiesToRemove)
	{
		if (!empty($propertiesToRemove) && !empty($object)) {
			foreach ($object as $property => $data) {
				if (in_array($property, $propertiesToRemove)) {
					unset($object->$property);
				}
			}
		}

		return $object;
	}
}
