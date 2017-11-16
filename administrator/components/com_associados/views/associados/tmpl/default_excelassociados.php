<?php
defined('_JEXEC') or die('Restricted Access');
//funçao para limpar os caracteres na visualização do número
function jsonToString($json, $name)
{
	$array = array_values(json_decode($json, true));
	return implode(', ', array_column($array, $name));
}

$arquivo = 'associados.xls';
$table = '';
$table .= '<table><tr style="background-color: #373a3c; color: #FFFFFF;">';
$table .= '<th>' . JText::_('#') . '</th>';
$table .= '<th>' . JText::_('NOME') . '</th>';
$table .= '<th>' . JText::_('CPF') . '</th>';
$table .= '<th>' . JText::_('AMATRA') . '</th>';
$table .= '<th>' . JText::_('DATA NASCIMENTO') . '</th>';
$table .= '<th>' . JText::_('CARGO') . '</th>';
$table .= '<th>' . JText::_('EMAIL') . '</th>';
$table .= '<th>' . JText::_('SITUACAO DO ASSOCIADO') . '</th>';
$table .= '<th>' . JText::_('CELULAR') . '</th>';
$table .= '<th>' . JText::_('RG') . '</th>';
$table .= '<th>' . JText::_('ESTADO CIVIL') . '</th>';
$table .= '<th>' . JText::_('DATA DE NASCIMENTO') . '</th>';
$table .= '<th>' . JText::_('SEXO') . '</th>';
$table .= '<th>' . JText::_('NATURALIDADE') . '</th>';
$table .= '<th>' . JText::_('ENDERECO') . '</th>';
$table .= '<th>' . JText::_('LOGRADOURO') . '</th>';
$table .= '<th>' . JText::_('NUMERO') . '</th>';
$table .= '<th>' . JText::_('COMPLEMENTO') . '</th>';
$table .= '<th>' . JText::_('BAIRRO') . '</th>';
$table .= '<th>' . JText::_('ESTADO') . '</th>';
$table .= '<th>' . JText::_('CIDADE') . '</th>';
$table .= '<th>' . JText::_('CEP') . '</th>';
$table .= '<th>' . JText::_('EMAIL ALTERNATIVO') . '</th>';
$table .= '<th>' . JText::_('TELEFONE RESIDENCIAL') . '</th>';
$table .= '<th>' . JText::_('TELEFONE COMERCIAL') . '</th>';
$table .= '<th>' . JText::_('DEPENDENTES') . '</th>';
$table .= '<th>' . JText::_('DATA DE INGRESSO NA MAGISTRATURA') . '</th>';
$table .= '<th>' . JText::_('DATA DE FILIACAO NA ANAMATRA') . '</th>';
$table .= '<th>' . JText::_('TRIBUNAL') . '</th>';
$table .= '<th>' . JText::_('DIRIGENTE') . '</th>';
$table .= '<th>' . JText::_('APOSENTADO') . '</th>';
$table .= '<th>' . JText::_('FILIADO A AMB') . '</th>';
$table .= '</tr>';

foreach ($this->items as $key => $item) {

	$bgcolor = ($key % 2 == 0) ? 'background-color: #eceeef' : '';
	$table .= '<tr style="' . $bgcolor . '">';
	$table .= '<td>' . utf8_decode($key + 1) . '</td>';
	$table .= '<td>' . utf8_decode($item->nome) . '</td>';
	$table .= '<td>' . utf8_decode($item->cpf) . '</td>';
	$table .= '<td>' . utf8_decode($item->amatra) . '</td>';
	$table .= '<td>' . utf8_decode($item->nascimento) . '</td>';
	$table .= '<td>' . utf8_decode($item->cargo) . '</td>';
	$table .= '<td>' . utf8_decode($item->email) . '</td>';
	$table .= '<td>' . utf8_decode($item->situacao_do_associado) . '</td>';
	$table .= '<td>' . utf8_decode($item->fone_celular) . '</td>';
	$table .= '<td>' . utf8_decode($item->rg) . '</td>';
	$table .= '<td>' . utf8_decode($item->estado_civil) . '</td>';
	$table .= '<td>' . utf8_decode($item->data_nascimento) . '</td>';
	$table .= '<td>' . utf8_decode($item->sexo) . '</td>';
	$table .= '<td>' . utf8_decode($item->naturalidade) . '</td>';
	$table .= '<td>' . utf8_decode($item->endereco) . '</td>';
	$table .= '<td>' . utf8_decode($item->logradouro) . '</td>';
	$table .= '<td>' . utf8_decode($item->numero) . '</td>';
	$table .= '<td>' . utf8_decode($item->complemento) . '</td>';
	$table .= '<td>' . utf8_decode($item->bairro) . '</td>';
	$table .= '<td>' . utf8_decode($item->estado) . '</td>';
	$table .= '<td>' . utf8_decode($item->cidade) . '</td>';
	$table .= '<td>' . utf8_decode($item->cep) . '</td>';
	$table .= '<td>' . utf8_decode($item->email_alternativo) . '</td>';
	$table .= '<td>' . utf8_decode($item->fone_residencial) . '</td>';
	$table .= '<td>' . utf8_decode($item->fone_comercial) . '</td>';
	$table .= '<td>' . utf8_decode((!empty($item->dependentes)) ? jsonToString($item->dependentes,
			'dependente_nome') : '') . '</td>';
	$table .= '<td>' . utf8_decode($item->dt_ingresso_magistratura) . '</td>';
	$table .= '<td>' . utf8_decode($item->dt_filiacao_anamatra) . '</td>';
	$table .= '<td>' . utf8_decode($item->tribunal) . '</td>';
	$table .= '<td>' . utf8_encode($item->dirigente == 0 ? 'Nao' : 'Sim') . '</td>';
	$table .= '<td>' . utf8_encode($item->aposentado == 0 ? 'Nao' : 'Sim') . '</td>';
	$table .= '<td>' . utf8_encode($item->filiado_amb == 0 ? 'Nao' : 'Sim') . '</td>';
	
}

$table .= '</td></tr>';
$table .= ' </table > ';

header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
header("Content-type: application/x-msexcel");
header("Content-Disposition: attachment; filename=\"{$arquivo}\"");
header("Content-Description: PHP Generated Data");

echo $table;
exit;
