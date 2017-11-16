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


class Numbers
{
    /**
     * Nice formatting for computer sizes (Bytes).
     *
     * @param   integer|string $bytes    The number in bytes to format
     * @param   integer        $decimals The number of decimal points to include
     *
     * @return  string
     */
    public static function formatBytes($bytes, $decimals = 2)
    {
        $units = array('B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y');

        $bytes = max($bytes, 0);
        $pow   = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow   = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, $decimals) . $units[$pow];
    }

    /**
     * Convert computer format to bytes
     *
     * @param string $from The value to convert to bytes, with metric prefix - according IS (eg: 2M, 1G)
     *
     * @read https://en.wikipedia.org/wiki/Metric_prefix
     * @return bool|string
     */
    public static function convertToBytes($from)
    {
        $number = substr($from, 0, -1);
        $unit   = strtoupper(substr($from, -1));

        $expByUnit = array('K' => 1, 'M' => 2, 'G' => 3, 'T' => 4, 'P' => 5, 'E' => 6, 'Z' => 7, 'Y' => 8);

        if (!isset($expByUnit[$unit])) {
            return false;
        }

        return $number * pow(1024, $expByUnit[$unit]);
    }


    /**
     * Retreves the sum of an array of strings of BRL currency
     *
     * @param array $values        array of reais string to be summed
     * @param bool  $returnAsReais true to return as a formatted string in the Brazilian currency
     *
     * @return float|int|string
     */
    public static function sumReais(array $values, $returnAsReais = false)
    {
        $total = 0;
        foreach ($values as $value) {
            // remove everything except a digit "0-9", a comma ",", and a dot "."
            $value = preg_replace('/[^\d,\.]/', '', $value);

            $value = str_replace('.', '', $value);
            $total += (float)str_replace(',', '.', $value);
        }

        return !$returnAsReais ? $total : Strings::toReais($total);
    }
}
