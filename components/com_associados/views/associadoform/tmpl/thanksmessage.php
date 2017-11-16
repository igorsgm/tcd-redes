<?php
/**
 * @version    CVS: 1.0.9
 * @package    Com_Associados
 * @author     Trídia Criação <atendimento@tridiacriacao.com>
 * @copyright  2016 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
// No direct access
defined('_JEXEC') or die;

JHtml::_('behavior.keepalive');
JHtml::_('behavior.tooltip');
JHtml::_('behavior.formvalidation');
JHtml::_('formbehavior.chosen', 'select');

// Load admin language file
$lang = JFactory::getLanguage();
$lang->load('com_associados', JPATH_SITE);
$doc = JFactory::getDocument();

//Import JS
$doc->addScript(JUri::base() . 'media/com_associados/js/form.js');
$doc->addScript(JUri::base() . 'media/com_associados/js/script.js');
$doc->addScript(JUri::base() . 'media/com_associados/js/jquery.inputmask.bundle.min.js');

$associadoId = JFactory::getApplication()->input->get('id');
?>


<div class="aviso-participar-preparatorios">
	<div class="alert alert-info alert-dismissible" role="alert">
		<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span
					aria-hidden="true">&times;</span></button>
		<h4><strong>Atualização dos dados realizada com sucesso.</strong></h4>
		Suas informações foram salvas em nossa base de dados. Navegue livremente.
	</div>
</div>

<div class="text-right">
	<a class="btn btn-primary" href="<?php echo JRoute::_(JUri::root() . 'index.php/extranet'); ?>">Página Inicial</a>
</div>
