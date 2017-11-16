<?php

/**
 * @package     Joomla.Plugin
 * @subpackage  Search.content
 *
 * @copyright   Copyright (C) 2005 - 2014 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

require_once JPATH_SITE . '/components/com_ouvidoria/router.php';

/**
 * Content search plugin.
 *
 * @package     Joomla.Plugin
 * @subpackage  Search.content
 * @since       1.6
 */
class PlgSearchOuvidoria extends JPlugin
{
	/**
	 * Determine areas searchable by this plugin.
	 *
	 * @return  array  An array of search areas.
	 *
	 * @since   1.6
	 */
	public function onContentSearchAreas()
	{
		static $areas = array(
			'ouvidoria' => 'Ouvidoria'
		);

		return $areas;
	}

	/**
	 * Search content (articles).
	 * The SQL must return the following fields that are used in a common display
	 * routine: href, title, section, created, text, browsernav.
	 *
	 * @param   string $text     Target search string.
	 * @param   string $phrase   Matching option (possible values: exact|any|all).  Default is "any".
	 * @param   string $ordering Ordering option (possible values: newest|oldest|popular|alpha|category).  Default is "newest".
	 * @param   mixed  $areas    An array if the search it to be restricted to areas or null to search all areas.
	 *
	 * @return  array  Search results.
	 *
	 * @since   1.6
	 */
	public function onContentSearch($text, $phrase = '', $ordering = '', $areas = null)
	{
		$db = JFactory::getDbo();

		if (is_array($areas)) {
			if (!array_intersect($areas, array_keys($this->onContentSearchAreas()))) {
				return array();
			}
		}

		$limit = $this->params->def('search_limit', 50);

		$text = trim($text);

		if ($text == '') {
			return array();
		}

		$rows = array();


//Search Solicitantes.
		if ($limit > 0) {
			switch ($phrase) {
				case 'exact':
					$text      = $db->quote('%' . $db->escape($text, true) . '%', false);
					$wheres2   = array();
					$wheres2[] = 'a.nome LIKE ' . $text;
					$wheres2[] = 'a.email LIKE ' . $text;
					$wheres2[] = 'a.cpf LIKE ' . $text;
					$where     = '(' . implode(') OR (', $wheres2) . ')';
					break;

				case 'all':
				case 'any':
				default:
					$words  = explode(' ', $text);
					$wheres = array();

					foreach ($words as $word) {
						$word      = $db->quote('%' . $db->escape($word, true) . '%', false);
						$wheres2   = array();
						$wheres2[] = 'a.nome LIKE ' . $word;
						$wheres2[] = 'a.email LIKE ' . $word;
						$wheres2[] = 'a.cpf LIKE ' . $word;
						$wheres[]  = implode(' OR ', $wheres2);
					}

					$where = '(' . implode(($phrase == 'all' ? ') AND (' : ') OR ('), $wheres) . ')';
					break;
			}

			switch ($ordering) {
				default:
					$order = 'a.id DESC';
					break;
			}

			$query = $db->getQuery(true);

			$query
				->clear()
				->select(
					array(
						'a.id',
						'a.nome AS title',
						'a.created_at AS created',
						'a.nome AS text',
						'"Solicitante" AS section',
						'1 AS browsernav'
					)
				)
				->from('#__ouvidoria_solicitantes AS a')
				->where('(' . $where . ')')
				->group('a.id')
				->order($order);

			$db->setQuery($query, 0, $limit);
			$list  = $db->loadObjectList();
			$limit -= count($list);

			if (isset($list)) {
				foreach ($list as $key => $item) {
					$list[$key]->href = JRoute::_('index.php?option=com_ouvidoria&view=solicitante&id=' . $item->id, false, 2);
				}
			}

			$rows = array_merge($list, $rows);
		}


//Search Solicitações.
		if ($limit > 0) {
			switch ($phrase) {
				case 'exact':
					$text      = $db->quote('%' . $db->escape($text, true) . '%', false);
					$wheres2   = array();
					$wheres2[] = '`ouvidoria_solicitacoes_tipos`.`nome` LIKE ' . $text;
					$wheres2[] = 'a.texto LIKE ' . $text;
					$wheres2[] = 'a.protocolo LIKE ' . $text;
					$wheres2[] = '`ouvidoria_solicitacoes_status`.`nome` LIKE ' . $text;
					$where     = '(' . implode(') OR (', $wheres2) . ')';
					break;

				case 'all':
				case 'any':
				default:
					$words  = explode(' ', $text);
					$wheres = array();

					foreach ($words as $word) {
						$word      = $db->quote('%' . $db->escape($word, true) . '%', false);
						$wheres2   = array();
						$wheres2[] = '`ouvidoria_solicitacoes_tipos`.`nome` LIKE ' . $word;
						$wheres2[] = 'a.texto LIKE ' . $word;
						$wheres2[] = 'a.protocolo LIKE ' . $word;
						$wheres2[] = '`ouvidoria_solicitacoes_status`.`nome` LIKE ' . $word;
						$wheres[]  = implode(' OR ', $wheres2);
					}

					$where = '(' . implode(($phrase == 'all' ? ') AND (' : ') OR ('), $wheres) . ')';
					break;
			}

			switch ($ordering) {
				default:
					$order = 'a.id DESC';
					break;
			}

			$query = $db->getQuery(true);

			$query
				->clear()
				->select(
					array(
						'a.id',
						'a.protocolo AS title',
						'a.created_at AS created',
						'a.protocolo AS text',
						'"Solicitação" AS section',
						'1 AS browsernav'
					)
				)
				->from('#__ouvidoria_solicitacoes AS a')
				->innerJoin('`#__ouvidoria_solicitacoes_tipos` AS ouvidoria_solicitacoes_tipos ON ouvidoria_solicitacoes_tipos.id = a.id_tipo')
				->innerJoin('`#__ouvidoria_solicitacoes_status` AS ouvidoria_solicitacoes_status ON ouvidoria_solicitacoes_status.id = a.status')
				->where('(' . $where . ')')
				->group('a.id')
				->order($order);

			$db->setQuery($query, 0, $limit);
			$list  = $db->loadObjectList();
			$limit -= count($list);

			if (isset($list)) {
				foreach ($list as $key => $item) {
					$list[$key]->href = JRoute::_('index.php?option=com_ouvidoria&view=solicitacao&id=' . $item->id, false, 2);
				}
			}

			$rows = array_merge($list, $rows);
		}


//Search Comentários.
		if ($limit > 0) {
			switch ($phrase) {
				case 'exact':
					$text      = $db->quote('%' . $db->escape($text, true) . '%', false);
					$wheres2   = array();
					$wheres2[] = 'a.id_user_consultado LIKE ' . $text;
					$wheres2[] = '`ouvidoria_solicitacoes`.`protocolo` LIKE ' . $text;
					$where     = '(' . implode(') OR (', $wheres2) . ')';
					break;

				case 'all':
				case 'any':
				default:
					$words  = explode(' ', $text);
					$wheres = array();

					foreach ($words as $word) {
						$word      = $db->quote('%' . $db->escape($word, true) . '%', false);
						$wheres2   = array();
						$wheres2[] = 'a.id_user_consultado LIKE ' . $word;
						$wheres2[] = '`ouvidoria_solicitacoes`.`protocolo` LIKE ' . $word;
						$wheres[]  = implode(' OR ', $wheres2);
					}

					$where = '(' . implode(($phrase == 'all' ? ') AND (' : ') OR ('), $wheres) . ')';
					break;
			}

			switch ($ordering) {
				default:
					$order = 'a.id DESC';
					break;
			}

			$query = $db->getQuery(true);

			$query
				->clear()
				->select(
					array(
						'a.id',
						'a.id_user_consultado AS title',
						'a.created_at AS created',
						'a.id_user_consultado AS text',
						'"Comentário" AS section',
						'1 AS browsernav'
					)
				)
				->from('#__ouvidoria_comentarios AS a')
				->innerJoin('`#__ouvidoria_solicitacoes` AS ouvidoria_solicitacoes ON ouvidoria_solicitacoes.id = a.id_solicitacao')
				->where('(' . $where . ')')
				->group('a.id')
				->order($order);

			$db->setQuery($query, 0, $limit);
			$list  = $db->loadObjectList();
			$limit -= count($list);

			if (isset($list)) {
				foreach ($list as $key => $item) {
					$list[$key]->href = JRoute::_('index.php?option=com_ouvidoria&view=comentario&id=' . $item->id, false, 2);
				}
			}

			$rows = array_merge($list, $rows);
		}

		return $rows;
	}
}
