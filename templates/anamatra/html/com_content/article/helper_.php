<?php
/**
 * @package		
 * @subpackage	
 * @copyright	
 * @license		
 */

// no direct access
defined('_JEXEC') or die;

class TemplateContentArticleHelper {

	static function getParentCategoriesByRoute( $parent_route, $order = 'ASC' )
	{
		if(empty($parent_route))
			return array();

		if(! is_array($parent_route) )
			$routes = TemplateContentArticleHelper::getParentRoutes( $parent_route );
		else
			$routes = $parent_route;
		
		$db = JFactory::getDBO();
		$query = $db->getQuery(true);
		$query->select('id, title, alias, CONCAT(id, '.$db->Quote(':').',alias) AS catslug');
		$query->from('#__categories');

		foreach($routes as &$route)
			$route = 'path = '.$db->Quote($route);

		$query->where( '('.implode(' OR ', $routes).') AND published = 1 AND alias <> '.$db->Quote('root') );
		$query->order('level '.$order );
		
		$db->setQuery( $query );
		$result = $db->loadObjectList();		
		
		if( @is_null($result) || @empty($result) )
			return array();

		return $result;
	}

	

	static function getAliases( $route )
	{
		return explode('/', $route);
	}

	static function getTemplateByCategoryAlias( $item )
	{
		if(is_file(__DIR__.'/'.$item->category_alias.'.php'))
			return $item->category_alias;

		$aliases = TemplateContentArticleHelper::getAliases( $item->parent_route );
		$aliases = array_reverse($aliases);
		foreach ($aliases as $alias) {
			if(is_file(__DIR__.'/'.$alias.'.php'))
				return $alias;			
		}

		return false;
	}

	
}