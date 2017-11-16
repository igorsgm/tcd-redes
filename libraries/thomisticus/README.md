Thomisticus Joomla! library
==========

Thomisticus third parth library for [Joomla!](http://joomla.org)

## Index

* 1. [Description.](#description)
* 2. [Loading your library.](#loading-library)
* 3. [Autoloading naming conventions.](#autoloading)
    * 3.1. [Non-namespaced classes.](#non-namespaced-classes)
    * 3.2. [Namespaced classes.](#namespaced-classes)
* 4. [Media folder + assets management.](#assets)
* 5. [JHtml classes.](#jhtml)
* 6. [Forms.](#forms)
    * 5.1. [Fields.](#fields)
    * 5.2. [Rules.](#rules)
* 7. [Integrating composer libraries.](#composer-libraries)
* 8. [License](#license)

## 1. <a name="description"></a>Description

This is a mainly a library bootstrap to be used as reference by 3rd part Joomla! developers. 

It includes common libraries requirements:  

* Classes autoloading (for namespaced and non-namespaced classes)
* Integrating composer libraries
* Language autoloading
* Media folder + assets management
* Form fields
* Form rules
* JHtml helpers

## 2. <a name="loading-library"></a>Loading your library.

Load your library adding this on the script you needt to use it:

```php
JLoader::import('thomisticus.library');
```

That doesn't mean that you have to add that line everywhere. You just have to add it in the entry point of your extension:  

* Components: 
    * `components/com_mycomponent/mycomponent.php` (frontend entry point)
    * `administrator/com_mycomponent/mycomponent.php` (backend entry point)
* Modules:
    * `modules/mod_mymodule/mod_mymodule.php` (module entry point)
* Plugins:
    * `plugins/system/myplugin/myplugin.php` (plugin class)

If you want to use library fields in view or module settings you have to also add the path to the fields folder to the form XML:  

```xml
<fields name="params" addfieldpath="/libraries/thomisticus/form/field">
```

Also when fields are used inside view or module settings you will need to add the loader on top of field classes like:  

```php
<?php
/**
 * @package     Thomisticus.Library
 * @subpackage  Field
 *
 * @copyright   Copyright (C) 2017-2021 Igor Moraes. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('_JEXEC') or die;

JLoader::import('thomisticus.library');

/**
 * Thomisticus list form field
 *
 * @since  1.0.0
 */
class ThomisticusFormFieldList extends JFormFieldList
{
```

## 3. <a name="autoloading"></a>Autoloading naming conventions

You can get your classes loaded in two different ways:  

### 3.1. <a name="non-namespaced-classes"></a>Non-namespaced classes. 

This is the "old way" of loading classes. There is a prefix defined in the root folder of your library (`Thomisticus` for this library). The naming convention for autoloading is that each folder becomes a new word on the class name and the file is the last word there. 

The class `ThomisticusHelperAsset` contains three parts:

* `Thomisticus` (main library prefix)
* `Helper` (folder)
* `Asset` (file)

And file resides in `libraries/thomisticus/helper/asset.php`

A model in `libraries/thomisticus/model/list.php` would use the name: `ThomisticusModelList`.  

Example class usage:

```php
JLoader::import('thomisticus.library');

$result = ThomisticusHelperNumbers::sum(array(4,3));
```

### 3.2. <a name="namespaced-classes"></a>Namespaced classes. 

The concept is the same than prefixes but instead of setting a prefix in your library root folder you are defining a namespace on X folder (`src` in this library). We will use composer for autoloading because it's more flexible than `JLoader`.  

The global namespace defined in this library is `Thomisticus`. So a class loaded like:  

```php
use Thomisticus\Monolog\PhpfileHandler;
```

Contains 3 parts:  

* `Thomisticus` (global namespace defined)
* `Monolog` (folder)
* `PhpfileHandler` (file)

And resides in:  `src/Monolog/PhpfileHandler.php`

The autoloading magic is done defining a PSR-4 prefix in our composer.json file like:

```json
    "autoload": {
        "psr-4": {
            "Thomisticus\\": "src/"
        }
    }
```

You can replace that with your own base namespace.  

Thomisticus usage of namespaced classes:  

```php
JLoader::import('thomisticus.library');

use Thomisticus\Helper\Dummy;

$dummyClass = new Dummy;

$dummyClass->foo('My message');
```

## 4. <a name="assets"></a>Media folder + asset managements.

Library provides also a base asset manager to easily load assets for your extension based on:

[https://gist.github.com/phproberto/4615320](https://gist.github.com/phproberto/4615320)

Example:

```php
JLoader::import('thomisticus.library');

/**
 * Thomisticus CSS file. It will automatically try to load overrides at template level.
 * 
 * This example will search CSS file in these paths:
 *
 * `/templates/MY_TEMPLATE/css/thomisticus/thomisticus.css`  
 * `/media/thomisticus/css/thomisticus.css`
 */
SampleHelperAsset::load('thomisticus.css', 'thomisticus');

/**
 * Thomisticus JS file. It will automatically try to load overrides at template level.
 * 
 * This example will search JS file in these paths:  
 *
 * `/templates/MY_TEMPLATE/js/thomisticus/thomisticus.js`  
 * `/media/thomisticus/js/thomisticus.js`
 */
SampleHelperAsset::load('thomisticus.js', 'thomisticus');
```

## 5. <a name="jhtml"></a>JHtml classes

Library registers the path to use for JHtml classes in `libraries/thomisticus/html` 

Example usage:

```php
JLoader::import('thomisticus.library');

// Load fontawesome from our media folder
JHtml::_('thomisticus.fontawesome');
```

## 6. <a name="forms"></a>Forms.

Library automatically registers fields + rules paths to be used anywhere.

### 6.1. <a name="fields"></a>Fields.

You can load library's fields with `prefix.field`. We use a custom prefix for our fields instead of the core fields `J` prefix. [Read why](http://phproberto.com/en/blog/26-joomla-form-fields-rules-right-way)  

Thomisticus usage:  

```XML
<?xml version="1.0" encoding="utf-8"?>
<form>
    <fieldset addfieldpath="/libraries/thomisticus/form/field" >
        <field
            name="list"
            type="thomisticus.list"
            label="COM_SAMPLE_FIELD_LIST"
            description="COM_SAMPLE_FIELD_LIST_DESC"
            default="1"
            >
        </field>
    </fieldset>
</form>
```

### 6.2. <a name="rules"></a>Rules.

You can load library's field rules with `prefix.rule``. We use a custom prefix for our rules instead of the core fields `J` prefix. [Read why](http://phproberto.com/en/blog/26-joomla-form-fields-rules-right-way)  

Thomisticus usage:

```XML
<?xml version="1.0" encoding="utf-8"?>
<form>
    <fieldset addrulepath="/libraries/thomisticus/form/rule">
        <field
            name="username"
            type="text"
            label="COM_SAMPLE_FIELD_NAME"
            description="COM_SAMPLE_FIELD_NAME_DESC"
            validate="thomisticus.login"
		/>
    </fieldset>
</form>
```

## 7. <a name="composer-libraries"></a>Integrating external composer libraries.

You can integrate any existing library available on composer/packagist (See [https://getcomposer.org/](https://getcomposer.org/)).

To install/require a new library you only need to run from command line something like:  

`composer require monolog/monolog`

To provide an example of how a third party library would be used this library includes an example [Monolog](https://github.com/Seldaek/monolog) integration. Example usage of our Monolog based logger:  

```php
JLoader::import('thomisticus.library');

use Thomisticus\App;

$logger = App::getLog();

// This should add a line on a sample.error.php file inside your logs folder
$logger->addError('This is a dummy error');
```

**Note about composer libraries and git integration:**  

This repository is not gitignoring external libraries so you can see the full extension folders tree. Please note that you should do so to avoid tracking them with git. You only need to add this to your gitignore:

```
/vendors/*
```

Remember also that your library cannot be distributed without those libraries so before packaging your library you will have to run:

```
composer install
```

## <a name="license"></a>8. License  

This library is licensed under the [GPL v2.0 license](http://www.gnu.org/licenses/gpl-2.0.html)  

Copyright (C) 2017-2021 [Igor Moraes](http://linkedin.com/in/igorsgm/) - All rights reserved.  
