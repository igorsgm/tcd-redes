<?php

/**
 * @version    CVS: 1.0.0
 * @package    Com_Dispositivos
 * @author     Igor Moraes <igor.sgm@gmail.com>
 * @copyright  2017 Igor Moraes
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
// No direct access
defined('_JEXEC') or die;

/**
 * Content Component Category Tree
 *
 * @since  1.6
 */
class DispositivosCategories extends JCategories
{
	/**
	 * Class constructor
	 *
	 * @param   array $options Array of options
	 *
	 * @since   11.1
	 */
	public function __construct($options = array())
	{
		$options['table']     = '#__dispositivos';
		$options['extension'] = 'com_dispositivos';

		parent::__construct($options);
	}
}
