<?php
/**
 * @package     Joomla.Plugin
 * @subpackage  Content.joomla
 */

defined('_JEXEC') or die;

class PlgContentThumbnail extends JPlugin
{
	/**
	 * Article is passed by reference
	 * Method is called right before the content is saved
	 *
	 * @param   string   $context  The context of the content passed to the plugin (added in 1.6)
	 * @param   object   $article  A JTableContent object
	 * @param   boolean  $isNew    If the content is just about to be created
	 *
	 * @return  boolean   true if function not enabled, is in front-end or is new. Else true or
	 *                    false depending on success of save function.
	 *
	 * @since   1.6
	 */
	public function onContentBeforeSave($context, $article, $isNew)
	{
	
		// Check this is a new article.
		if (!$isNew)
		{
			//return true;
		}
		
		$images     = json_decode($article->images);
		$categories = $this->params->get('categories');

		jimport('joomla.filesystem.file');
			jimport( 'joomla.image.image' );
			
		if (!class_exists('JFolder')){
			jimport('joomla.filesystem.folder');
		}
			
		if (in_array($article->catid, $categories) || $categories[0] == 0) {
			
			//Let's check that we have an intro image set & that it actually exists
			if( !empty($images->image_intro) && file_exists(JPATH_SITE.'/'.$images->image_intro) ){
			
				
				if ($this->params->get('th_width', '200') && $this->params->get('th_height', '200')) {
					//Set the paths for the photo directories
					$asset_dir = JPath::clean( JPATH_SITE.'/images/thumbnails/image_intro/' );
					
					//Create the gallery folder
					if( !JFolder::exists( $asset_dir ) ){
						JFolder::create( $asset_dir );
						JFile::copy( JPATH_SITE.'/images/index.html', $asset_dir.'index.html');
					}
					
					//Get the native file properties
					$native_dest = JPATH_SITE.'/'.$images->image_intro;	
					$nativeProps = Jimage::getImageFileProperties( $native_dest );
					$thumbnail_intro = JPATH_SITE.'/images/thumbnails/image_intro/'.JFile::getName($native_dest);
				}
				
				if ($this->params->get('image_fulltext_width', '200') && $this->params->get('image_fulltext_width', '200')) {
					//Set the paths for the photo directories
					$asset_dir = JPath::clean( JPATH_SITE.'/images/thumbnails/image_artigo/' );
					
					//Create the gallery folder
					if( !JFolder::exists( $asset_dir ) ){
						JFolder::create( $asset_dir );
						JFile::copy( JPATH_SITE.'/images/index.html', $asset_dir.'index.html');
					}
					
					//Get the native file properties
					$native_dest = JPATH_SITE.'/'.$images->image_intro;	
					$nativeProps = Jimage::getImageFileProperties( $native_dest );
					$thumbnail_artigo = JPATH_SITE.'/images/thumbnails/image_artigo/'.JFile::getName($native_dest);
				}

				if(!file_exists($thumbnail_intro) && !file_exists($thumbnail_artigo)){
					
					//Generate thumbnail
					$jimage	= new JImage();
					$jimage->loadFile( $native_dest );
					
					$thumbnail = $jimage->resize( $this->params->get('th_width', '200'), $this->params->get('th_height', '200'), true, JImage::SCALE_OUTSIDE );
					$thumbnail->toFile( $thumbnail_intro, $nativeProps->type );					

					
					$thumbnail = $jimage->resize( $this->params->get('image_fulltext_width', '200'), $this->params->get('image_fulltext_height', '200'), true, JImage::SCALE_OUTSIDE );
					$thumbnail->toFile( $thumbnail_artigo, $nativeProps->type );	
				}

				//Set the thumbnail as the image_intro
				$images->image_intro = 'images/thumbnails/image_intro/'.JFile::getName($native_dest);
				
				if (empty($images->image_fulltext) || $images->image_fulltext == 'images/thumbnails/image_artigo/' ) {
					
					//Set the thumbnail as the image_fulltext
					$images->image_fulltext = 'images/thumbnails/image_artigo/'.JFile::getName($native_dest);
				
				}else{

					//Set the paths for the photo directories
					$asset_dir = JPath::clean( JPATH_SITE.'/images/thumbnails/image_fulltext/' );
					
					//Create the gallery folder
					if( !JFolder::exists( $asset_dir ) ){
						JFolder::create( $asset_dir );
						JFile::copy( JPATH_SITE.'/images/index.html', $asset_dir.'index.html');
					}
					
					//Get the native file properties
					$native_dest = JPATH_SITE.'/'.$images->image_fulltext;	
					$nativeProps = Jimage::getImageFileProperties( $native_dest );
					$thumbnail_fulltext = JPATH_SITE.'/images/thumbnails/image_fulltext/'.JFile::getName($native_dest);
			
					if(!file_exists($thumbnail_fulltext)){
						
						//Generate thumbnail
						$jimage	= new JImage();
						$jimage->loadFile( $native_dest );
						
						$thumbnail = $jimage->resize( $this->params->get('th_width', '200'), $this->params->get('th_height', '200'), true, JImage::SCALE_OUTSIDE );
						$thumbnail->toFile( $thumbnail_fulltext, $nativeProps->type );					

						
						$thumbnail = $jimage->resize( $this->params->get('image_fulltext_width', '200'), $this->params->get('image_fulltext_height', '200'), true, JImage::SCALE_OUTSIDE );
						$thumbnail->toFile( $thumbnail_fulltext, $nativeProps->type );	
					}

					//Set the thumbnail as the image_intro
					$images->image_fulltext = 'images/thumbnails/image_fulltext/'.JFile::getName($native_dest);

				}
		
				//Set the new $images object for the article
				$article->images = json_encode($images);
				
			}
		}	
		return true;
	}

}