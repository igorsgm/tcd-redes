<?php
/**
 * @package
 * @subpackage
 * @copyright
 * @license
 */

// no direct access
defined('_JEXEC') or die;

require __DIR__ . '/helper_.php';
$category_alias_layout = TemplateContentArticleHelper::getTemplateByCategoryAlias($this->item);

if ($category_alias_layout !== false)
{
	$this->setLayout($category_alias_layout);
	require __DIR__ . '/' . $category_alias_layout . '.php';
}
else
{
	require __DIR__ . '/default_.php';
}

//get image
$article_attribs = json_decode($this->item->attribs);
$article_images  = json_decode($this->item->images);
$article_image   = '';
if (isset($article_attribs->spfeatured_image) && $article_attribs->spfeatured_image != '')
{
	$article_image = $article_attribs->spfeatured_image;
}
elseif (isset($article_images->image_fulltext) && !empty($article_images->image_fulltext))
{
	$article_image = $article_images->image_fulltext;
}

//opengraph
$document = JFactory::getDocument();
$config   = JFactory::getConfig();
$document->setTitle($this->item->title);
$document->addCustomTag('<meta property="og:url" content="' . JURI::current() . '" />');
$document->addCustomTag('<meta property="og:type" content="article" />');
$document->setDescription(JHtml::_('string.truncate', $this->item->introtext, 155, false, false));
$document->addCustomTag('<meta property="og:title" content="' . $this->item->title . '" />');
$document->addCustomTag('<meta property="article:author" content="' . $config->get('sitename') . '" />');
$document->addCustomTag('<meta property="og:description" content="' . JHtml::_('string.truncate', $this->item->introtext, 155, false, false) . '" />');
if ($article_image)
{
	$document->addCustomTag('<meta property="og:image" content="' . JURI::root() . $article_image . '" />');
	$document->addCustomTag('<meta property="og:image:width" content="600" />');
	$document->addCustomTag('<meta property="og:image:height" content="315" />');
}

$post_format     = $params->get('post_format', 'standard');
$has_post_format = $tpl_params->get('show_post_format');
if ($this->print) $has_post_format = false;

// uteis para debug:
// JFactory::getApplication()->getTemplate();
// $this->getLayout();
// $this->getLayoutTemplate();