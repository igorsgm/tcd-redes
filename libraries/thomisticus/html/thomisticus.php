<?php
/**
 * @package     Thomisticus.Library
 * @subpackage  Html
 *
 * @copyright   Copyright (C) 2017-2021 Igor Moraes. All rights reserved.
 * @license     GNU General Public License version 2 or later, see LICENSE.
 */

defined('_JEXEC') or die;

/**
 * Html css class.
 *
 * @package     Thomisticus.Library
 * @subpackage  Html
 * @since       1.0
 */
abstract class JHtmlThomisticus
{
	/**
	 * Extension name to use in the asset calls
	 * Basically the media/com_namecomponent folder to use
	 */
	const EXTENSION = 'thomisticus';

	/**
	 * Array containing information for loaded files
	 *
	 * @var  array
	 */
	protected static $loaded = array();


	/**
	 * Load Thomisticus Assets.
	 *
	 * @return  void
	 */
	public static function assets()
	{
		if (!empty(static::$loaded[__METHOD__])) {
			return;
		}

		ThomisticusHelperAsset::loadJSUriSupport();
		ThomisticusHelperAsset::load('vendor/phpJs/phpJs.min.js', self::EXTENSION);
		ThomisticusHelperAsset::load('thomisticus.min.js', self::EXTENSION);
		ThomisticusHelperAsset::load('thomisticus.min.css', self::EXTENSION);

		//		For when languages are added in thomisticus.js
		ThomisticusHelperAsset::loadJSLanguageKeys(DIRECTORY_SEPARATOR . 'media' . DIRECTORY_SEPARATOR . self::EXTENSION
			. DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . self::EXTENSION . '.js');

		static::$loaded[__METHOD__] = true;
	}


	/**
	 * Load fontawesome 4.
	 *
	 * @return  void
	 */
	public static function fontawesome()
	{
		if (!empty(static::$loaded[__METHOD__])) {
			return;
		}

		ThomisticusHelperAsset::load('vendor/font-awesome/font-awesome.min.css', self::EXTENSION);

		static::$loaded[__METHOD__] = true;
	}

	/**
	 * Load BootstrapWizard
	 *
	 * @return  void
	 */
	public static function bootstrapWizard()
	{
		if (!empty(static::$loaded[__METHOD__])) {
			return;
		}

		ThomisticusHelperAsset::load('vendor/bootstrapWizard/jquery.bootstrap.wizard.min.js', self::EXTENSION);

		static::$loaded[__METHOD__] = true;
	}

	/**
	 * Load bootstrapTable
	 * @read http://bootstrap-table.wenzhixin.net.cn/documentation/
	 *
	 * @return void
	 */
	public static function bootstrapTable()
	{
		if (!empty(static::$loaded[__METHOD__])) {
			return;
		}

		ThomisticusHelperAsset::load('vendor/bootstrapTable/bootstrap-table.min.css', self::EXTENSION);
		ThomisticusHelperAsset::load('vendor/bootstrapTable/bootstrap-table.min.js', self::EXTENSION);
		ThomisticusHelperAsset::load('vendor/bootstrapTable/bootstrap-table-pt-BR.min.js', self::EXTENSION);

		static::$loaded[__METHOD__] = true;
	}

	/**
	 * Load BootstrapWizard
	 *
	 * @return  void
	 */
	public static function formValidation()
	{
		if (!empty(static::$loaded[__METHOD__])) {
			return;
		}

		ThomisticusHelperAsset::load('vendor/formValidation/formValidation.min.css', self::EXTENSION);
		ThomisticusHelperAsset::load('vendor/formValidation/formValidation.min.js', self::EXTENSION);
		ThomisticusHelperAsset::load('vendor/formValidation/framework/bootstrap.min.js', self::EXTENSION);
		ThomisticusHelperAsset::load('vendor/formValidation/language/pt_BR.js', self::EXTENSION);

		static::$loaded[__METHOD__] = true;
	}

	/**
	 * Load jQuery Mask
	 *
	 * @return void
	 * @read https://igorescobar.github.io/jQuery-Mask-Plugin/
	 */
	public static function mask()
	{
		if (!empty(static::$loaded[__METHOD__])) {
			return;
		}

		ThomisticusHelperAsset::load('vendor/mask/jquery.mask.min.js', self::EXTENSION);

		static::$loaded[__METHOD__] = true;
	}

	/**
	 * Load jQuery InputMask
	 *
	 * @return void
	 * @read https://github.com/RobinHerbots/Inputmask
	 */
	public static function inputMask()
	{
		if (!empty(static::$loaded[__METHOD__])) {
			return;
		}

		ThomisticusHelperAsset::load('vendor/inputMask/jquery.inputmask.bundle.min.js', self::EXTENSION);

		static::$loaded[__METHOD__] = true;
	}


	/**
	 * Load jQuery Mask
	 *
	 * @return void
	 */
	public static function phpJs()
	{
		if (!empty(static::$loaded[__METHOD__])) {
			return;
		}

		ThomisticusHelperAsset::load('vendor/phpJs/phpJs.min.js', self::EXTENSION);

		static::$loaded[__METHOD__] = true;
	}

	/**
	 * Load SweetAlert2
	 *
	 * @return void
	 */
	public static function sweetAlert2()
	{
		if (!empty(static::$loaded[__METHOD__])) {
			return;
		}

		ThomisticusHelperAsset::load('vendor/sweetalert2/sweetalert2.min.js', self::EXTENSION);
		ThomisticusHelperAsset::load('vendor/sweetalert2/sweetalert2.min.css', self::EXTENSION);

		static::$loaded[__METHOD__] = true;
	}
}
