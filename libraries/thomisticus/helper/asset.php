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
abstract class ThomisticusHelperAsset extends JHtml
{
    /**
     * Includes assets from media directory, looking in the
     * template folder for a style override to include.
     *
     * @param   string $filename  Path to file.
     * @param   string $extension Current extension name. Will auto detect component name if null.
     * @param   array  $attribs   Extra attribs array
     *
     * @return  mixed  False if asset type is unsupported, nothing if a css or js file, and a string if an image
     */
    public static function load($filename, $extension = null, $attribs = array())
    {
        if (is_null($extension)) {
            $extensionParts = explode(DIRECTORY_SEPARATOR, JPATH_COMPONENT);
            $extension      = array_pop($extensionParts);
        }

        $toLoad = "$extension/$filename";

        // Discover the asset type from the file name
        $type = substr($filename, (strrpos($filename, '.') + 1));

        switch (strtoupper($type)) {
            case 'CSS':
                return self::stylesheet($toLoad, $attribs, true, false);
                break;
            case 'JS':
                return self::script($toLoad, false, true);
                break;
            case 'GIF':
            case 'JPG':
            case 'JPEG':
            case 'PNG':
            case 'BMP':
                $alt = null;

                if (isset($attribs['alt'])) {
                    $alt = $attribs['alt'];
                    unset($attribs['alt']);
                }

                return self::image($toLoad, $alt, $attribs, true);
                break;
            default:
                return false;
        }
    }

    /**
     * Manage language variables inside javascrip. This function shall be called at yout view.html.php
     * In JavaScript use: Joomla.JText._('LANGUAGE_STRING')
     *
     * @param array $languages = strings that need to be translated and used by JavaScript files
     *
     * @return bool  True if all strings ins array has been added
     */
    public static function loadJSLanguageVariables(array $languages)
    {
        if (is_array($languages)) {
            foreach ($languages as $language) {
                // This will add your string to javascript object, what you can use later.
                JText::script($language);
            }

            return true;
        }

        return false;
    }

    /**
     * Parses a javascript file looking for JText keys and then loads them ready for use.
     *
     * @param   string $jsFile Path to the javascript file.
     *
     * @return bool
     */
    public static function loadJSLanguageKeys($jsFile)
    {
        if (isset($jsFile)) {
            $jsFile = JUri::root() . $jsFile;
        } else {
            return false;
        }

        if ($jsContents = file_get_contents($jsFile)) {
            $languageKeys = array();
            preg_match_all('/Joomla\.JText\._\(\'(.*?)\'\)\)?/', $jsContents, $languageKeys);
            $languageKeys = $languageKeys[1];

            foreach ($languageKeys as $lkey) {
                JText::script($lkey);
            }

            return true;
        }

        return false;
    }

    /**
     * Add JUri basic support to view
     * Eg: <script> var base_url = Joomla.JUri.base(); </script>
     */
    public static function loadJSUriSupport()
    {
        JFactory::getDocument()->addScriptDeclaration('
				var Joomla = (Joomla || {}); 
				Joomla.JUri = { 
				    base : function(pathonly) {
				        return pathonly ? "' . JUri::base(true) . '" : "' . JUri::base() . '";
				    },
				    root : function(pathonly) {
				        return pathonly ? "' . JUri::root(true) . '" : "' . JUri::root() . '";
				    },
				    current : function() {
				        return "' . JUri::current() . '";
				    }
				}; 
		');
    }
}
