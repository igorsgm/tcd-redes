<?php

/**
 * @version     1.0.0
 * @package     com_agenda
 * @copyright   Copyright (C) 2013. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @author      iComunicação <contato@icomunicacao.com.br> - http://www.icomunicacao.com.br
 */
// No direct access
defined('_JEXEC') or die;

/**
 * Agenda helper.
 */
class AgendaHelper {

    /**
     * Configure the Linkbar.
     */
    public static function addSubmenu($vName = '') {
        		JHtmlSidebar::addEntry(
			JText::_('COM_AGENDA_TITLE_AGENDAS'),
			'index.php?option=com_agenda&view=agendas',
			$vName == 'agendas'
		);
		JHtmlSidebar::addEntry(
			JText::_('JCATEGORIES') . ' (' . JText::_('COM_AGENDA_TITLE_AGENDAS') . ')',
			"index.php?option=com_categories&extension=com_agenda",
			$vName == 'categories'
		);
		if ($vName=='categories') {
			JToolBarHelper::title('Agenda: JCATEGORIES (COM_AGENDA_TITLE_AGENDAS)');
		}

    }

    /**
     * Gets a list of the actions that can be performed.
     *
     * @return	JObject
     * @since	1.6
     */
    public static function getActions() {
        $user = JFactory::getUser();
        $result = new JObject;

        $assetName = 'com_agenda';

        $actions = array(
            'core.admin', 'core.manage', 'core.create', 'core.edit', 'core.edit.own', 'core.edit.state', 'core.delete'
        );

        foreach ($actions as $action) {
            $result->set($action, $user->authorise($action, $assetName));
        }

        return $result;
    }


}
