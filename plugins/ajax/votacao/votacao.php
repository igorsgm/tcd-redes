<?php defined('_JEXEC') or die;

// Import library dependencies
jimport('joomla.plugin.plugin');

class plgAjaxVotacao extends JPlugin
{

	function onAjaxVotacao()
	{
		$post = JFactory::getApplication()->input;
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);

		if ($post->get('jaVotou') == 'true') {
			$query->select('COUNT(*)')
				->from($db->quoteName('#__aplicativo_respostas'))
				->where('`created_by` = ' . $db->quote($post->get('created_by'))
					. ' AND `pergunta` = ' . $db->quote($post->get('pergunta')));
			return intval($db->setQuery($query)->loadResult());
		} else {
			$query
				->select('params')
				->from($db->quoteName('#__aplicativo_perguntas'))
				->where('id = ' . $db->quote($post->get('pergunta')));

			$db->setQuery($query);

			$params = json_decode($db->loadResult(), true);

			foreach ($params as $keyParams => $param) {
				// Linha Provisória
				$val = ($post->get('voto') == 'No' ? 'Não' : ($post->get('voto') == 'Absteno' ? 'Abstenção' : 'Sim'));
				if ($param['opcoes'] == $val) {
					$params[$keyParams]['votos'] = strval(intval($params[$keyParams]['votos']) + 1);
				}
			}

			$query1 = $db->getQuery(true);
			$query1->update($db->quoteName('#__aplicativo_perguntas'))
				->set(array($db->quoteName('params') . ' = ' . $db->quote(json_encode($params))))
				->where(array($db->quoteName('id') . ' = ' . $db->quote($post->get('pergunta'))));
			$db->setQuery($query1)->execute();

			return true;
		}
	}
}