<?php
/**
 * @version     1.0.0
 * @package     com_agenda
 * @copyright   Copyright (C) 2013. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @author      iComunicação <contato@icomunicacao.com.br> - http://www.icomunicacao.com.br
 */
// no direct access
defined('_JEXEC') or die;

JHtml::addIncludePath(JPATH_COMPONENT . '/helpers/html');
JHtml::_('behavior.tooltip');
JHtml::_('behavior.formvalidation');
JHtml::_('formbehavior.chosen', 'select');
JHtml::_('behavior.keepalive');

// Import CSS
$document = JFactory::getDocument();
$document->addStyleSheet('components/com_agenda/assets/css/agenda.css');

?>
<script type="text/javascript">
    js = jQuery.noConflict();
    js(document).ready(function() {
        
    });

    Joomla.submitbutton = function(task)
    {
        if (task == 'agenda.cancel') {
            Joomla.submitform(task, document.getElementById('agenda-form'));
        }
        else {
            
            if (task != 'agenda.cancel' && document.formvalidator.isValid(document.id('agenda-form'))) {
                
                Joomla.submitform(task, document.getElementById('agenda-form'));
            }
            else {
                alert('<?php echo $this->escape(JText::_('JGLOBAL_VALIDATION_FORM_FAILED')); ?>');
            }
        }
    }
</script>

<form action="<?php echo JRoute::_('index.php?option=com_agenda&layout=edit&id=' . (int) $this->item->id); ?>" method="post" enctype="multipart/form-data" name="adminForm" id="agenda-form" class="form-validate">

    <div class="form-horizontal">
        <?php echo JHtml::_('bootstrap.startTabSet', 'myTab', array('active' => 'general')); ?>

        <?php echo JHtml::_('bootstrap.addTab', 'myTab', 'general', JText::_('COM_AGENDA_TITLE_AGENDA', true)); ?>
        <div class="row-fluid">
            <div class="span10 form-horizontal">
            	<fieldset class="adminform">

		            <div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('id'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('id'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('state'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('state'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('created_by'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('created_by'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('categoria'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('categoria'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('nome'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('nome'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('local'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('local'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('data_inicio'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('data_inicio'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('data_fim'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('data_fim'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('hora_inicio'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('hora_inicio'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('hora_fim'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('hora_fim'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('destaque'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('destaque'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('descricao'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('descricao'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('maps'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('maps'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('imagem'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('imagem'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('file_titles'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('file_titles'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('title'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('title'); ?></div>
					</div>
					<div class="control-group">
						<div class="control-label"><?php echo $this->form->getLabel('files'); ?></div>
						<div class="controls"><?php echo $this->form->getInput('files'); ?></div>
					</div>
					<?php if (!empty($this->item->files)) : ?>
						<?php foreach ((array)$this->item->files as $key => $fileSingle) :
								if (!is_array($fileSingle)) : 
										$file = json_decode($fileSingle, true);
										?>
								<?php $nome_anexo = json_decode($this->item->file_titles);?>
								<?php foreach ($nome_anexo as $chave => $value) :?>
									
									<a href="<?php echo JRoute::_(JUri::root() . 'images/agenda/anexar' . DIRECTORY_SEPARATOR . $file['anexar' . $key]['arquivo']['name'], false);?>"><?php echo $nome_anexo->$chave->title; ?></a>
									<?php endforeach;?>  
								<?php endif;
							
							endforeach;
					endif; ?>
				<input type="hidden" name="jform[arquivo_hidden]" id="jform_arquivos_hidden" value="<?php echo implode(',', (array)$this->item->anexar_arquivos); ?>" />
                </fieldset>
            </div>
        </div>
        <?php echo JHtml::_('bootstrap.endTab'); ?>
        
        <?php if (JFactory::getUser()->authorise('core.admin','agenda')) : ?>
	<?php echo JHtml::_('bootstrap.addTab', 'myTab', 'permissions', JText::_('JGLOBAL_ACTION_PERMISSIONS_LABEL', true)); ?>
		<?php echo $this->form->getInput('rules'); ?>
	<?php echo JHtml::_('bootstrap.endTab'); ?>
<?php endif; ?>

        <?php echo JHtml::_('bootstrap.endTabSet'); ?>

        <input type="hidden" name="task" value="" />
        <?php echo JHtml::_('form.token'); ?>

    </div>
</form>