<?php
/**
 * @package     Thomisticus.Library
 * @subpackage  Helper
 *
 * @copyright   Copyright (C) 2017-2021 Igor Moraes. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

use Thomisticus\Utils\Numbers;

defined('_JEXEC') or die;

/**
 * File helper
 *
 * @package     Thomisticus.Library
 * @subpackage  Helper
 * @since       1.0
 */
abstract class ThomisticusHelperFile
{

    /**
     * Check file server errors, such as file size and partial upload errors
     * Called before uploading files from a form
     *
     * @param array $file Form file to be checked
     *
     * @return bool   Enqueue a message if any error has been found
     */
    public static function checkServerFileErrors($file)
    {
        if (!isset($file['error'])) {
            return false;
        }

        if (in_array($file['error'], array(1, 2, 3))) {
            $errorMessageByCode = array(
                1 => JText::_('LIB_THOMISTICUS_FILE_SIZE_EXCEEDS_ALLOWED_BY_SERVER'),
                2 => JText::_('LIB_THOMISTICUS_FILE_SIZE_EXCEEDS_ALLOWED_BY_HTML_FORM'),
                3 => JText::_('LIB_THOMISTICUS_FILE_PARTIAL_UPLOAD_ERROR')
            );

            $app = JFactory::getApplication();
            $app->enqueueMessage($errorMessageByCode[$file['error']], 'warning');

            return true;
        }

        return false;
    }

    /**
     * Validate file size and allowed mime types
     *
     * @param array  $file        Form file to be validated
     * @param string $maxFileSize Max file size allowed (eg: '2K', '2M') -> it will be automatically
     *                            converted to bytes
     * @param string $okMIMETypes Allowed MIME Types separated by comma (eg: 'image/jpg,image/jpeg,image/png')
     *
     * @return bool     true if is a valid file
     */
    public static function validateFile($file, $maxFileSize, $okMIMETypes)
    {
        $app = JFactory::getApplication();

        // Check for filesize
        if ($file['size'] > Numbers::convertToBytes($maxFileSize)) {
            $app->enqueueMessage(JText::_('LIB_THOMISTICUS_FILE_FILE_BIGGER_THAN') . ' ' . $maxFileSize, 'warning');

            return false;
        }

        $validMIMEArray = explode(',', $okMIMETypes);
        $fileMime       = $file['type'];

        if (!in_array($fileMime, $validMIMEArray)) {
            $app->enqueueMessage(JText::_('LIB_THOMISTICUS_FILE_FILETYPE_NOT_ALLOWED'), 'warning');

            return false;
        }

        return true;
    }

    /**
     * Replace any special characters in the filename and create unique name
     *
     * @param array $file File that will have the name treated
     *
     * @return string   treated name
     */
    public static function treatFileName($file)
    {
        $fileName  = \Thomisticus\Utils\Date::getDate() . '-' . JFile::stripExt($file['name']);
        $fileName  = preg_replace("/[^A-Za-z0-9]/i", "-", $fileName);
        $extension = JFile::getExt($file['name']);

        return $fileName . '.' . $extension;
    }

    /**
     * Moves an uploaded file to a destination folder
     * Enqueue a warning message if occur any errors while uploading
     *
     * @param string $uploadPath The name of the php (temporary) uploaded file
     * @param string $fileTemp   The path (including filename) to move the uploaded file to
     *
     * @return bool     true if file has been successfully uploaded
     */
    public static function uploadFile($uploadPath, $fileTemp)
    {
        $app = JFactory::getApplication();

        if (!JFile::exists($uploadPath)) {
            if (!JFile::upload($fileTemp, $uploadPath)) {
                $app->enqueueMessage(JText::_('LIB_THOMISTICUS_FILE_ERROR_MOVING_FILE'), 'warning');

                return false;
            }
        }

        return true;
    }

    /**
     * Retrieves names (or full path) of the folders that are within a certain $path
     *
     * @param string $path          address of certain folder (not the url)
     * @param bool   $completePaths rue if it is to return the array with full folder's path , false to return only name
     *
     * @return array
     */
    public static function getFolders($path, $completePaths = false)
    {
        $lastChar = substr($path, 0, 1);
        $path     = $lastChar == '/' ? $path . '*' : ($lastChar == '*' ? $path : $path . '/*');

        $folders = glob($path, GLOB_ONLYDIR);

        if (!$completePaths) {
            foreach ($folders as $key => $folder) {
                $folders[$key] = substr($folder, strrpos($folder, '/') + 1);
            }
        }

        return $folders;
    }

}
