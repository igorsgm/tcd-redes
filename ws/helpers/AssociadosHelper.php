<?php

class AssociadosHelper
{
	/**
	 * Tratar os campos que precisam de customização para o envio
	 *
	 * @param $data = o array de dados para envio
	 *
	 * @return mixed|array = um array com os elementos tratados e prontos para o envio
	 */
	public static function treatSpecialFields($data)
	{
		if (!empty($data)) {
			$data['A1_NREDUZ'] = $data['A1_NOME'];
			$data['A1_MSBLQL'] = $data['state'] == 1 ? '2' : '1';

			$read = new Read();
			$read->exeRead(PREFIX . 'cidades', 'sig_estado, nm_cidade, cod_mun', " WHERE `id` = :id LIMIT :limit",
				"id={$data['A1_MUN']}" . "&limit=1");

			$data['A1_EST']     = isset($read->getResult()[0]) ? $read->getResult()[0]['sig_estado'] : "";
			$data['A1_MUN']     = isset($read->getResult()[0]) ? $read->getResult()[0]['nm_cidade'] : "";
			$data['A1_COD_MUN'] = isset($read->getResult()[0]) ? $read->getResult()[0]['cod_mun'] : "";


			// Dependentes
			if ($data['A1_XDEPEND'] !== '01' && $data['A1_XDEPEND'] !== '02') {
				$data['A1_XDEPEND'] = '02';
			}

			if (isset($data['A1_XDIRIGE']) && $data['A1_XDIRIGE'] !== '01' && $data['A1_XDIRIGE'] !== '02') {
				$data['A1_XDIRIGE'] = '02';
			}

//			if (!empty($data['dependentes'])) {
			$dependentes = !empty($data['dependentes']) ? array_values(json_decode($data['dependentes'], true)) : array();

			for ($i = 0; $i < 3; $i++) {
//					if (!empty($dependentes[$i])) {
				$data['A1_XNOMDE' . ($i == 0 ? 'P' : $i)] = !empty($dependentes[$i]) ? $dependentes[$i]['dependente_nome'] : '';
				$data['A1_XPAREN' . ($i == 0 ? 'T' : $i)] = !empty($dependentes[$i]) ? $dependentes[$i]['dependente_parentesco'] : '';
				$data['A1_XCPFDE' . ($i == 0 ? 'P' : $i)] = !empty($dependentes[$i]) ? $dependentes[$i]['dependente_cpf'] : '';
				$data['A1_XDTNAS' . ($i == 0 ? 'C' : $i)] = !empty($dependentes[$i]) ? $dependentes[$i]['dependente_nascimento'] : '';
//					}
			}
//			}

			unset($data['state'], $data['dependentes']);

			$toFormatDate = array('A1_DTNASC', 'A1_XDTEMIS', 'A1_XDTINGR', 'A1_XFILIAC');
			$data         = self::formatDates($data, $toFormatDate, 'dmY');

			// Elementos que precisam ser apenas números
			$toSanitize = array(
				'A1_PFISICA', 'A1_CGC', 'A1_FAX', 'A1_TEL', 'A1_XTELCEL', 'A1_XTELCOM', 'A1_XDTNAS1', 'A1_XDTNAS2', 'A1_CEP',
				'A1_XDTNASC', 'A1_XCPFDE1', 'A1_XCPFDE2', 'A1_XCPFDEP', 'A1_DTNASC', 'A1_XDTEMIS', 'A1_XDTINGR', 'A1_XFILIAC'
			);

			$data = self::sanitizeNumbers($data, $toSanitize);

			// Limpando os elementos que estão em branco (aceitando os que são zero) e retornando
//			return array_filter($data, 'strlen');
			return $data;
		}

		return false;
	}

	public static function formatDates($array, $elements, $format)
	{
		foreach ($elements as $element) {
			if (!empty($array[$element]) && $array[$element] != '0000-00-00') {
				$array[$element] = date($format, strtotime(str_replace('/', '-', $array[$element])));
			}
		}

		return $array;
	}

	/**
	 * Limpar os caracteres que não são números dentro de um array (apenas para os elementos selecionados)
	 *
	 * @param array $array    = array com todos os elementos
	 * @param array $elements = elementos especificos que serão sanitized
	 *
	 * @return array
	 */
	public static function sanitizeNumbers($array, $elements)
	{
		foreach ($elements as $key => $element) {
			if (!empty($array[$element])) {
				$array[$element] = preg_replace('/\D/', '', $array[$element]);
			}
		}

		return $array;
	}
}

