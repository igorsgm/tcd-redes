<?php

/**
 * @version    CVS: 1.0.9
 * @package    Com_Associados
 * @author     Trídia Criação <atendimento@tridiacriacao.com>
 * @copyright  2016 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */

// No direct access
use Thomisticus\Utils\Ajax;

defined('_JEXEC') or die;

/**
 * Associado controller class.
 *
 * @since  1.6
 */
class AssociadosControllerAssociado extends JControllerLegacy
{
	/**
	 * Application object
	 *
	 * @var    JApplicationCms
	 */
	private $app;

	/**
	 * Input object
	 *
	 * @var     JInput
	 */
	private $jinput;

	/**
	 * @var AssociadosModelAssociadoForm
	 */
	private $model;

	/**
	 * Ajax Request handler
	 */
	public function ajaxHandler()
	{
		$this->app    = JFactory::getApplication();
		$this->jinput = $this->app->input;
		$this->model  = $this->getModel('AssociadoForm', 'AssociadosModel');

		if (Ajax::isAjaxRequest() && $this->jinput->get('format') == 'json')
		{
			JFactory::getDocument()->setMimeEncoding('application/json');

			$this->{$this->jinput->get('method')}();

			$this->app->close();
		}
	}

	public function getAssociadoByCpf()
	{
		if (!empty($this->jinput->get('cpf'))) {
			$cpf         = Thomisticus\Utils\Strings::onlyNumbers($this->jinput->get('cpf'));
			$idAssociado = ThomisticusHelperModel::select('#__associados', 'id', array('cpf' => $cpf, 'state' => 1), 'Result');

			if (empty($idAssociado)) {
				echo new JResponseJson(null, 'Associado não encontrado', true);
				$this->app->close();
			}

			$associado = $this->model->getData($idAssociado);

			$modalidades            = ThomisticusHelperModel::select('#__jogosanamatra_mod_insc', 'id_modalidade', array('id_associado' => $idAssociado));
			$associado->modalidades = array_column($modalidades, 'id_modalidade');

			echo new JResponseJson($associado, null, empty($associado));
		}
	}
}