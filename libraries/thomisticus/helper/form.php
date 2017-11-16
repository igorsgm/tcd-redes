<?php
/**
 * @package     Thomisticus.Library
 * @subpackage  Helper
 *
 * @copyright   Copyright (C) 2017-2021 Igor Moraes. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

jimport('joomla.form.form');

use Thomisticus\Utils\Arrays;

defined('_JEXEC') or die;

/**
 * Form helper
 *
 * @package     Thomisticus.Library
 * @subpackage  Helper
 * @since       1.0
 */
abstract class ThomisticusHelperForm
{
    /**
     * Upload multiple or single file of JForm and retrieves file name
     *
     * @param string $inputName   File input name (eg: if input form name is jform[image], enter "image")
     * @param string $folderPath  Directory path that will store files - without URL! (eg: 'media/com_myextension/images/')
     * @param string $maxFileSize Max file size allowed (eg: '2K', '2M') -> it will be automatically converted to bytes
     * @param string $okMIMETypes Allowed MIME Types separated by comma (eg: 'image/jpg,image/jpeg,image/png')
     *
     * @return string
     */
    public static function uploadFiles($inputName, $folderPath, $maxFileSize, $okMIMETypes)
    {
        $app = JFactory::getApplication();
        jimport('joomla.filesystem.file');

        $files        = $app->input->files->get('jform', array(), 'raw');
        $files        = $files[$inputName];
        $array        = $app->input->get('jform', array(), 'ARRAY');
        $files_hidden = $array[$inputName . '_hidden'];


        if (!Arrays::isMultiDimensional($files)) {
            $singleFile = $files;
            unset($files);
            $files[0] = $singleFile;
        }

        $filesString = '';
        if ($files[0]['size'] > 0) {
            $oldFiles = explode(',', $files_hidden);

            //Delete existing files
            foreach ($oldFiles as $f) {
                JFile::delete($folderPath . $f);
            }

            foreach ($files as $file) {
                $fileName = '';

                // Checking errors
                if (isset($file['error']) && $file['error'] == 4) {
                    $fileName = $array[$inputName];
                } elseif (ThomisticusHelperFile::checkServerFileErrors($file)) {
                    return false;
                }

                // Check for filetype and size
                if (ThomisticusHelperFile::validateFile($file, $maxFileSize, $okMIMETypes)) {
                    $fileName = ThomisticusHelperFile::treatFileName($file);

                    $uploadPath = $folderPath . $fileName;
                    $fileTemp   = $file['tmp_name'];

                    ThomisticusHelperFile::uploadFile($uploadPath, $fileTemp);
                }

                if (!empty($fileName)) {
                    $filesString .= !empty($filesString) ? "," : "";
                    $filesString .= $fileName;
                }
            }
        } elseif (isset($files_hidden)) {
            $filesString = $files_hidden;
        }

        return $filesString;
    }


    /**
     * Method to get an instance of a form.
     *
     * @param string $componentName The name of the component
     * @param string $viewName      The name of the view
     * @param string $client        The client ('administrator' or 'site')
     *
     * @return  JForm  JForm instance.
     */
    public static function getForm($componentName = '', $viewName = '', $client = '')
    {
        $app = JFactory::getApplication();

        if (empty($componentName)) {
            $componentName = $app->input->get('option');
        }

        if (empty($viewName)) {
            $viewName = $app->input->get('view');
        }

        if (empty($client)) {
            $mainPath = $app->isClient('site') ? JPATH_SITE : JPATH_ADMINISTRATOR;
        } else {
            $mainPath = $client == 'administrator' ? JPATH_ADMINISTRATOR : JPATH_SITE;
        }

        JForm::addFormPath($mainPath . '/components/' . $componentName . '/models/forms');

        return JForm::getInstance($componentName . '.' . $viewName, $viewName);
    }


    /**
     * Method to get attributes from a JForm
     *
     * @param  JForm $form The form XML object
     *
     * @return array
     */
    public static function getFormAttributes($form)
    {
        $attributes = array();

        foreach ($form->getXml()->fieldset->children() as $element) {
            $attributes[] = (string)$element->attributes()->name;
        }

        return $attributes;
    }


}
