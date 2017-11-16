<?php

/**
 * @version    CVS: 1.0.9
 * @package    Com_Associados
 * @author     Trídia Criação <atendimento@tridiacriacao.com>
 * @copyright  2016 Trídia Criação
 * @license    GNU General Public License versão 2 ou posterior; consulte o arquivo License. txt
 */
class AssociadosHelpersDates
{
	/**
	 * Retornar o array de informações do associado com o tratamento de datas
	 *
	 * @param array|object|JObject $data
	 * @param string               $dateFormat = date format
	 *                                         [eg: 'Y-m-d' is used to save in database, 'd/m/Y' to be displayed]
	 *
	 * @return array|object|JObject com as datas manipuladas de acordo com o $dateFormat
	 */
	public static function treatFormDates($data, $dateFormat)
	{
		$isObject = is_object($data);

		if ($isObject)
		{
			$data = Joomla\Utilities\ArrayHelper::fromObject($data);
		}

		$dates = array(
			'nascimento'               => $data['nascimento'],
			'data_emissao'             => $data['data_emissao'],
			'dt_ingresso_magistratura' => $data['dt_ingresso_magistratura'],
			'dt_filiacao_anamatra'     => $data['dt_filiacao_anamatra']
		);

		foreach ($dates as $key => $date)
		{
			$data[$key] = self::formatDate($date, $dateFormat);
		}

		return $isObject ? Joomla\Utilities\ArrayHelper::toObject($data) : $data;
	}

	/**
	 * @param $date
	 * @param $format
	 *
	 * @return false|string
	 *
	 * @since version
	 */
	public static function formatDate($date, $format)
	{
		return date($format, strtotime(str_replace('/', '-', $date)));
	}
}