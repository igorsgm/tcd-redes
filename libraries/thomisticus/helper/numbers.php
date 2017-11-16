<?php
/**
 * @package     Thomisticus.Library
 * @subpackage  Helper
 *
 * @copyright   Copyright (C) 2017-2021 Igor Moraes. All rights reserved
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('_JEXEC') or die;

/**
 * Thomisticus class with number functions
 *
 * @package     Thomisticus.Library
 * @subpackage  Helper
 * @since       1.0
 */
abstract class ThomisticusHelperNumbers
{
    /**
     * Convert associative array into attributes.
     *
     * @param   mixed $numbers Number or array of numbers to sum up
     *
     * @return  string
     */
    public static function sum($numbers)
    {
        return array_sum((array)$numbers);
    }
}
