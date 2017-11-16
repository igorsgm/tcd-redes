<?php

/**
 * Content Plugin for Joomla! - Add credits to images
 *
 * @author     Trídia Criação <producao@tridiacriacao.com>
 * @copyright  Copyright 2017 Trídia Criação
 * @license    GNU Public License version 3 or later
 * @link       http://www.tridiacriacao.com/
 */

defined('_JEXEC') or die;
use Joomla\Registry\Registry;

// Importing Thomisticus Library to all component pages
JLoader::import('thomisticus.library');

jimport('joomla.plugin.plugin');

/**
 * @package imagescredits
 *
 * @since February 2017
 */
class PlgContentImagesCredits extends JPlugin
{
	/**
	 * Constructor
	 *
	 * @param   object &$subject Instance of JEventDispatcher
	 * @param   array $config Configuration
	 */
	public function __construct(& $subject, $config)
	{
		parent::__construct($subject, $config);

		$this->loadLanguage();
	}

	/**
	 * Event method that runs on content preparation
	 *
	 * @param   JForm $form The form object
	 * @param   integer $data The form data
	 *
	 * @return bool
	 */
	public function onContentPrepareForm($form, $data)
	{
		if (!($form instanceof JForm)) {
			$this->_subject->setError('JERROR_NOT_A_FORM');
			return false;
		}

		// Check if it's article edit form
		if (!in_array($form->getName(), array('com_content.article'))) {
			return true;
		}

		// Load the XML file and add its contents to the current form
		JForm::addFormPath(__DIR__ . '/form');
		$form->reset(true);
		$form->loadFile('article');



		// Codigo do Helix3 adicinionado
		$doc = JFactory::getDocument();
        $plg_path = JURI::root(true).'/plugins/system/helix3';
        
        // import do JS para o plugin imagescredits
        $filePath = JURI::root(true).'/plugins/content/imagescredits';
        $doc->addScript($filePath.'/assets/imageFile.js');
        
        JForm::addFormPath(JPATH_PLUGINS.'/system/helix3/params');

        if ($form->getName()=='com_menus.item') { //Add Helix menu params to the menu item

            JHtml::_('jquery.framework');

            if($data['id'] && $data['parent_id'] == 1) {

                JHtml::_('jquery.ui', array('core', 'more', 'sortable'));

                $doc->addScript($plg_path.'/assets/js/jquery-ui.draggable.min.js');
                $doc->addStyleSheet($plg_path.'/assets/css/bootstrap.css');
                $doc->addStyleSheet($plg_path.'/assets/css/font-awesome.min.css');
                $doc->addStyleSheet($plg_path.'/assets/css/modal.css');
                $doc->addStyleSheet($plg_path.'/assets/css/menu.generator.css');
                $doc->addScript($plg_path.'/assets/js/modal.js');
                $doc->addScript( $plg_path. '/assets/js/menu.generator.js' );
                $form->loadFile('menu-parent', false);

            } else {
                $form->loadFile('menu-child', false);
            }

            $form->loadFile('page-title', false);

        }

        //Article Post format
        if ($form->getName()=='com_content.article') {
            JHtml::_('jquery.framework');
            $doc->addStyleSheet($plg_path.'/assets/css/font-awesome.min.css');
            $doc->addScript($plg_path.'/assets/js/post-formats.js');

            $tpl_path = JPATH_ROOT . '/templates/' . $this->getTemplateName();

            if(JFile::exists( $tpl_path . '/post-formats-override.xml' )) {
                JForm::addFormPath($tpl_path);
            } else {
                JForm::addFormPath(JPATH_PLUGINS . '/system/helix3/params');
            }

            $form->loadFile('post-formats-override', false);
        }

		return true;
	}

	/**
	 * Metodo do Helix3
	 *
	 * @return template
	 */	
	private function getTemplateName()
    {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        $query->select($db->quoteName(array('template')));
        $query->from($db->quoteName('#__template_styles'));
        $query->where($db->quoteName('client_id') . ' = 0');
        $query->where($db->quoteName('home') . ' = 1');
        $db->setQuery($query);

        return $db->loadObject()->template;
    }


	/**
	 * Método para salvar o crédito e legenda da image caso os campos de imagem do artigo estejam vazio
	 *
	 * @param   $article: valor do form
	 * @param   $context: nome do component e da view
	 * @param   $isnew: valor booleano
	 *
	 * @return bool
	 */
	public function onContentBeforeSave($context, $article, $isNew)
	{
		if ($context == 'com_content.article') {

			$img = json_decode($article->images);

			if (!empty($img->image_intro)) {
				
				$article->images = json_decode($article->images);
				
				if (empty($article->images->image_fulltext_credit) && !empty($article->images->image_intro)) {
					$article->images->image_fulltext_credit = $article->images->image_intro_credit;
				}

				if (empty($article->images->image_fulltext_caption) && !empty($article->images->image_intro)) {
					$article->images->image_fulltext_caption = $article->images->image_intro_caption;	
				}

				if (empty($article->images->image_fulltext_alt) && !empty($article->images->image_intro)) {
					$article->images->image_fulltext_alt = $article->images->image_intro_alt;
				}
				
				if (!$isNew && !empty($article->images->image_intro)) {
					
					$registry = new Registry;
					$registry->loadArray($article->images);
					$article->images = (string) $registry;
					$db = JFactory::getDbo();
					$query = $db->getQuery(true);
					$query->update('#__content')->set("images = '" . $article->images ."'")->where('id = ' . $article->id);
					$db->setQuery($query)->execute();
				}
			}

			$article->attribs = json_decode($article->attribs);

			$okMIMETypes = 'audio/mp3, audio/midi, audio/mpeg, audio/webm, audio/ogg, audio/wav';
			$article->attribs->audio = $this->uploadFiles('attribs', 'images/audios/', '30M', $okMIMETypes, $article->id, $article->attribs->excluir_audio);
			
			if (empty($article->attribs->audio) && !$article->attribs->excluir_audio) {
				$attribs = $this->selectContent($article->id);
				$article->attribs->audio = $attribs->audio;
			}

			$article->attribs = json_encode($article->attribs);
		
			return $article;
		}	
	}


	/**
	 * Upload multiple or single file of JForm and retrieves file name
	 *
	 * @param string $inputName   File input name (eg: if input form name is jform[image], enter "image")
	 * @param string $folderPath  Directory path that will store files - without URL! (eg: 'media/com_myextension/images/')
	 * @param string $maxFileSize Max file size allowed (eg: '2K', '2M') -> it will be automatically converted to bytes
	 * @param string $okMIMETypes Allowed MIME Types separated by comma (eg: 'image/jpg,image/jpeg,image/png')
	 *
	 * @return string
	 */
	protected function uploadFiles($inputName, $folderPath, $maxFileSize, $okMIMETypes, $contentId, $deleteAudio)
	{
		$app = JFactory::getApplication();
		jimport('joomla.filesystem.file');

		$files        = $app->input->files->get('jform', array(), 'ARRAY');
		$file         = $files[$inputName]['audio'];
		$array        = $app->input->get('jform', array(), 'ARRAY');
		$files_hidden = $array[$inputName . '_hidden'];

		$sound = $this->selectContent($contentId);
		$oldFile = JPATH_ROOT . '/images/audios/' . $sound->audio;

		
		if ($deleteAudio) {
			unlink($oldFile);	
		}

		$filesString = '';
		if ($file['size'] > 0) {

			$fileName = '';

			// Checking errors
			if (isset($file['error']) && $file['error'] == 4) {
				$fileName = $array[$inputName];
			}
			elseif (ThomisticusHelperFile::checkServerFileErrors($file)) {
				return false;
			}

			// Check for filetype and size
			if (ThomisticusHelperFile::validateFile($file, $maxFileSize, $okMIMETypes)) {
				$fileName = ThomisticusHelperFile::treatFileName($file);
				
				$uploadPath = JPATH_SITE.'/'.$folderPath . $fileName;
				$fileTemp   = $file['tmp_name'];

				ThomisticusHelperFile::uploadFile($uploadPath, $fileTemp);
			}

			if (!empty($fileName)) {
				$filesString .= !empty($filesString) ? "," : "";
				$filesString .= $fileName;
			}
		
			if (!empty($file['name'])) {	
				unlink($oldFile);	
			}

		}elseif (isset($files_hidden)) {
			$filesString = $files_hidden;
		}

		return $filesString;
	}

	/**
	* Método para fazer um select na tabela 
	* 
	* @param $contentId: id do conteúdo
	*
	* @return $content Retorna as coluna atributo da tabela content
	**/
	protected function selectContent($contentId)
	{
		$content = ThomisticusHelperModel::select('#__content', 'attribs', array('id' => $contentId), 'Object');
        $content = json_decode($content->attribs);

        return $content;		
	}
}