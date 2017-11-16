<?php
/**
 * @package     Thomisticus
 * @subpackage  Library
 *
 * @copyright   Copyright (C) 2017-2021 Igor Moraes. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('_JEXEC') or die;

// Ensure that autoloaders are set
JLoader::setup();

// Global libraries autoloader
JLoader::registerPrefix('Thomisticus', dirname(__FILE__));

$composerAutoload = __DIR__ . '/vendor/autoload.php';

if (file_exists($composerAutoload)) {
    $loader = require_once $composerAutoload;
}

// Common fields
JFormHelper::addFieldPath(dirname(__FILE__) . '/form/field');

// Common form rules
JFormHelper::addRulePath(dirname(__FILE__) . '/form/rule');

// Common HTML helpers
JHtml::addIncludePath(dirname(__FILE__) . '/html');

// Load library language
$lang = JFactory::getLanguage();
$lang->load('lib_thomisticus', JPATH_SITE);
