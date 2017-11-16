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


class Arrays
{
	/**
	 * Checking if all array's item are empty
	 * array_filter will remove all values from array which are equal to null, 0, '' or false
	 *
	 * @param array $array Array that will be checked
	 * @read https://stackoverflow.com/questions/8328983/check-whether-an-array-is-empty
	 *
	 * @return boolean
	 */
	public static function isNull($array)
	{
		return !array_filter($array);
	}

	/**
	 * Remove multiple elements in an array by value
	 *
	 * @param array        $array    Array that will have the element removed
	 * @param array|string $toRemove Array with elements to be removed or single string (value) to be removed
	 *
	 * @return array
	 */
	public static function removeByValues($array, $toRemove)
	{
		if (is_array($toRemove)) {
			$keysToRemove = array();
			foreach ($toRemove as $element) {
				if (($key = array_search($element, $array)) !== false) {
					array_push($keysToRemove, $key);
				}
			}

			$array = self::remove($array, $keysToRemove);
		} else {
			if (($key = array_search($toRemove, $array)) !== false) {
				unset($array[$key]);
			}
		}

		return $array;
	}

	/**
	 * Remove multiple elements in an array
	 *
	 * @param array $array            Array that will have the elements removed
	 * @param array $elementsToRemove Array with element keys to be removed
	 *
	 * @return array
	 */
	public static function remove($array, $elementsToRemove)
	{
		return array_diff_key($array, array_flip($elementsToRemove));
	}

	/**
	 * Returns the first element in an array.
	 *
	 * @param  array $array
	 *
	 * @return mixed
	 */
	public static function first(array $array)
	{
		return reset($array);
	}

	/**
	 * Check if an array contains all elements from another array
	 *
	 * @param array $haystack array that supposedly contains all elements
	 * @param array $target   array to be searched
	 *
	 * @return bool true if all elements|keys of $subArray are an element|key of $array
	 */
	public static function insideAnother($haystack, $target)
	{
		return count(array_intersect($target, $haystack)) == count($target);
	}

	/**
	 * To verify that at least one value in $target is also in $haystack
	 *
	 * @param array $haystack array that supposedly contains the elements
	 * @param array $target   array with values to be searched
	 *
	 * @return bool true if any value of $target is inside $haystack
	 */
	public static function containsSomeValue($haystack, $target)
	{
		return count(array_intersect($haystack, $target)) > 0;
	}

	/**
	 * Checks if multiple keys exist in an array
	 *
	 * @param array        $array
	 * @param array|string $keys
	 *
	 * @read https://wpscholar.com/blog/check-multiple-array-keys-exist-php/
	 * @return bool
	 */
	public static function arrayKeysExist($array, $keys)
	{
		$count = 0;
		if (!is_array($keys)) {
			$keys = func_get_args();
			array_shift($keys);
		}
		foreach ($keys as $key) {
			if (array_key_exists($key, $array)) {
				$count++;
			}
		}

		return count($keys) === $count;
	}

	/**
	 * Checks if an array is multidimensional or not
	 *
	 * @param array $array
	 *
	 * @read https://pageconfig.com/post/checking-multidimensional-arrays-in-php
	 * @return bool
	 */
	public static function isMultiDimensional($array)
	{
		rsort($array);

		return isset($array[0]) && is_array($array[0]);
	}

	/**
	 * Replaces the name of an array of attributes belonging to a given array.
	 * Where the array key is the old name of the key and the value of the new name to be assigned
	 *
	 * @param array $item           The array to be treated
	 * @param array $fromTosColumns The array with old names (key) and new names (value)
	 *                              eg: array('oldAttrName' => 'newAttrName')
	 *
	 * @return array
	 */
	public static function treatFromToColumns($item, $fromTosColumns)
	{
		foreach ($fromTosColumns as $key => $value) {
			if (isset($item[$key])) {
				$item[$value] = $item[$key];
				unset($item[$key]);
			}
		}

		return $item;
	}


	/**
	 * Replaces the values of an attribute belonging to a given array, by the values present in an multidimensional array
	 * where key is the old value and the new value to be assigned
	 *
	 * @param array $item          The array to be treated
	 * @param array $fromTosValues The multidimensional array with column and old/new values
	 *                             eg: array('name' => array('Augustine' => 'Thomas'));
	 *
	 * @return array
	 */
	public static function treatFromToValues($item, $fromTosValues)
	{
		foreach ($fromTosValues as $column => $values) {
			foreach ($values as $oldValue => $newValue) {
				if ($item[$column] == $oldValue) {
					$item[$column] = $newValue;
				}
			}
		}

		return $item;
	}

	/**
	 * Extract a slice of the array based on needed keys
	 *
	 * @param array $array Array with values
	 * @param array $keys  Array with needed keys
	 *
	 * @return array
	 */
	public static function sliceByKeys($array, $keys)
	{
		return array_intersect_key($array, array_flip($keys));
	}

	/**
	 * Move an element to very first array's position
	 *
	 * @param array          $array Array with values
	 * @param string|integer $key   key that will go to the first position
	 *
	 * @return array
	 */
	public static function moveToTop($array, $key)
	{
		$temp = array($key => $array[$key]);
		unset($array[$key]);

		return $temp + $array;
	}

	/**
	 * Move an element to last array's position
	 *
	 * @param array          $array Array with values
	 * @param string|integer $key   key that will go to the last position
	 *
	 * @return array
	 */
	public static function moveToBottom($array, $key)
	{
		$value = $array[$key];
		unset($array[$key]);
		$array[$key] = $value;

		return $array;
	}

	/**
	 * Remove all null/empty/false values from the given array.
	 * Alias for array_filter
	 *
	 * @param array $array Array that will be cleaned
	 *
	 * @return array
	 */
	public static function clean($array)
	{
		return array_filter($array);
	}

	/**
	 * Orders a multidimensional array by specific key value
	 *
	 * @param array  $array Array to be ordered
	 * @param string $key   Array key to be considered as ordenation's parameter
	 * @param bool   $desc  true to descending order
	 *
	 * @see https://stackoverflow.com/questions/2699086/sort-multi-dimensional-array-by-value
	 *
	 * @return mixed
	 */
	public static function orderByValue($array, $key, $desc = false)
	{
		uasort($array, function ($a, $b) use ($key, $desc) {
			return $desc ? ($b[$key] - $a[$key]) : ($a[$key] - $b[$key]);
		});

		return $array;
	}
}
