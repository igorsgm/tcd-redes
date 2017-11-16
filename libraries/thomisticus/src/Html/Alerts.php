<?php
/**
 * @package     Thomisticus
 * @subpackage  Html
 *
 * @copyright   Copyright (C) 2017-2021 Igor Moraes. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

namespace Thomisticus\Html;

defined('_JEXEC') or die;

/**
 * Alert Class
 *
 * @package     Thomisticus\Html
 */
class Alerts
{

    /**
     * Returns the html of a system-message-container to be added in the desired location
     *
     * @param string $content =
     * @param bool   $title   = Optional title (will be highlighted)
     * @param string $type    = Type of alert ['info' => blue, 'warning' => yellow, 'error' => red, 'success' => green]
     *                        or else a custom class "alert- {class}
     * @param bool   $dismiss = Close alert button
     *
     * @return string
     */
    public static function message($content, $title = false, $type = 'info', $dismiss = false, $customClass = null)
    {
        $html = '<div id="system-message-container" class="' . $customClass . '">
					<div id="system-message">
					<div class="no-margin alert alert-' . $type . '">';

        if ($dismiss) {
            $html .= '<a class="close" data-dismiss="alert">×</a>';
        }

        if ($title) {
            $html .= '<h4 class="alert-heading">' . $title . '</h4>';
        }

        $html .= '<div><p>' . $content . '</p></div></div></div></div>';

        return $html;
    }
}

?>