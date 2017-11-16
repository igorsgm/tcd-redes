<?php
/**
 * @package     Thomisticus
 * @subpackage  Html
 *
 * @copyright   Copyright (C) 2017-2021 Igor Moraes. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

namespace Thomisticus\Utils;

use Exception;
use JResponseJson;

defined('_JEXEC') or die;


class Ajax
{

    /**
     * Check valid AJAX request
     *
     * @return  boolean
     */
    public static function isAjaxRequest()
    {
        $app = \JFactory::getApplication();

        return strtolower($app->input->server->get('HTTP_X_REQUESTED_WITH', '')) == 'xmlhttprequest';
    }

    /**
     * Retrieves Json in case of Error 500 made by model while validating $data according to the form or any other case
     *
     * @param \JModelLegacy $model
     */
    public static function throwModelFormValidationErrors($model)
    {
        $app = \JFactory::getApplication();
        echo new JResponseJson($model->getError(), 500, true);
        $app->close();
    }

    /**
     * Retrieves Json with array of errors that were issued by some controller task (eg save method)
     *
     * @param array $errors Array of errors returned by the controller task
     */
    public static function throwControllerValidationErrors($errors)
    {
        $app = \JFactory::getApplication();

        $return = array();
        foreach ($errors as $error) {
            array_push($return, ($error instanceof Exception ? $error->getMessage() : $error));
        }

        echo new JResponseJson($return, 'Component task error', true);
        $app->close();
    }
}
