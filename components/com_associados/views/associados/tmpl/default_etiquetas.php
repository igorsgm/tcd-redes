<?php
defined('JPATH_BASE') or die;

JHtml::_('jquery.framework');
JHtml::_('bootstrap.framework');

use Thomisticus\Utils\Strings;


?>
<style type="text/css">
	* {
		text-shadow:none !important;
		filter:none !important;
		-ms-filter:none !important;
	}
	body {
		font-family: Arial, Helvetica, sans-serif;
		font-size: 7pt;
		margin:0;
		padding:0;
		line-height: 1.3em;
	}
	.linha {
		clear: both;
	}
	.linha .etiqueta {
		height: 25.4mm;
		width: 66.7mm;
		margin-left: 3.9mm;
		outline: 1px solid #ccc;
		display: inline-block;
		float: left;
		overflow: hidden;
	}
	.linha .etiqueta .conteudo {
		padding: 1.5mm 3mm 1.5mm 3mm;
	}
	.linha .etiqueta strong{
		text-transform: uppercase;
	}
	.linha .etiqueta small {
		font-size: 5pt;
	}
	.linha .etiqueta:first-child {
		margin-left: 0;
	}
	@media screen {
		.linha {
			margin-left: auto;
		    margin-right: auto;
		    width: 787px;
		}
	}
@media print {
	@page {
		size: letter;
		margin: 0;
	}
	html {
		background: #fff;
		margin: 0;
	}
	body {
		margin: 0 3.7mm;
	}
	.no-print {
		display: none;
	}
	.linha .etiqueta {
		outline: none;	
	}
	.inicio, .quebra {
		margin-top: 12.7mm;
	}
	.quebra {
		page-break-before: always;
	}
}
</style>
<div class="no-print well">
<h2 class="text-center">
Impressão de Etiquetas
</h2>
<div class="btn-group pull-right">
<button type="button" class="btn btn-danger btn-lg" data-toggle="modal" data-target="#ajuda">
  <i class="icon-info"></i> Instruções para impressão
</button>
<a class="btn btn-lg btn-primary " href="javascript:print()">Imprimir</a>
</div>
</div>
<?php 
	$count = 1;
 ?>
<div class="linha linha-<?php echo $count; ?> inicio">
<?php foreach ($this->items as $key => $item): ?>

<div class="etiqueta">
	<div class="conteudo">
		<small><?//php echo $item->tratamento; ?>Exmo.(a) Sr.(a)</small> <br/>
		<strong> <?php echo $item->nome; ?></strong> <br/>
		<?php 
		$logradouro = !empty($item->logradouro) && $item->logradouro != 'COM_ASSOCIADOS_ASSOCIADOS_LOGRADOURO_OPTION_' ? strtoupper($item->logradouro) : '';

		$endereco = strtoupper($item->endereco);

		// Se o logradouro for igual à primeira palavra do endereco, irá remover o logradouro para não ficar, eg: 'Rua Rua'
		if ($logradouro == Strings::getWord($endereco, 0)) {
			$logradouro = '';
		}

		?>

		<b>END:</b> <?php echo $logradouro; ?> <?php echo $endereco; ?>, <b>Nº:</b> <?php echo $item->numero; ?>, <?php echo strtoupper($item->complemento); ?>, 
		<?php echo $item->bairro; ?>, <?php echo $item->cidade; ?>-<?php echo strtoupper($item->estado); ?>, <b>CEP:</b> <?php echo $item->cep; ?>
	</div>
</div>
<?php 				
	$quantidade = ($key+1)%3;
	$valor = ($key+1);

	
	if(($quantidade == 0) && ($valor < (count($this->items))))
	{
		$count = ($count+1);
		$qtd = ($count+1)%12;
		$linha = " ";
		if($qtd == 0){
			$linha = "quebra";
			$count = 1;
		}
		echo '</div>';
		echo '<div class="linha linha-'. $count .' '. $linha .'">';
	}
	endforeach; 
?>

<div class="modal fade no-print" id="ajuda" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">ATENÇÃO! <em>Siga atentamente as instruções a seguir:</em></h4>
      </div>
      <div class="modal-body">
      	<ol>
      	<li><b>Filtre a lista de associados na página anterior (usando a pesquisa e/ou o botão Filtros + Número de páginas que fica no rodapé da lista), pois as etiquetas são geradas a partir do que é exibido nessa página;</b></li>
        <li>Utilize o navegador <b>Google Chrome</b> para impressão das etiquetas (caso não tenha instalado na sua máquina, <a href="https://www.google.com.br/chrome/browser/desktop/">BAIXE AQUI</a>);</li>
        <li>Utilize somente etiquetas padrão <b>PIMACO 6180 / 6080</b> (Formato Carta, tamanho real 25,4x66,7mm);</li>
        <li>Antes de imprimir, certifique-se que a impressora está ligada e que as folhas da etiqueta supracitada estejam devidamente encaixadas na bandeja principal da impressora com o lado imprimível na posição correta (varia de acordo com o modelo da impressora);</li>
        <li>Ao clicar no botão <b>Imprimir</b>, verifique se a impressora está devidamente selecionada no campo <b>Destino</b>. Caso contrário, clique no botão <b>Alterar</b> e selecione a impressora correta. Já no campo <b>Páginas</b>, marque <b>Tudo</b> <output></output> digite um intervalo na caixa de texto. Defina quantas cópias no campo seguinte;</li>
        <li><h6>Importante! Clique em <em>Mais definições</em> e selecione o tamanho do papel compatível com <em>Carta/Letter (279,4mm x 215,9mm ou 8.5 x 11in)</em> e em <em>Margens marque Nenhum</em>;</h6></li>
        <li>Verifique na imagem de previsualização se está de acordo com o layout da etiqueta (3 colunas x 10 linhas para cada página). Caso contrário, procure outro tamanho de papel compatível com o Carta/Letter. Se estiver tudo certo, clique em <b>Imprimir.</b></li>
        </ol>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
      </div>
    </div>
  </div>
</div>