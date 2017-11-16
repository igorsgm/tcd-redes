<?php

class TreaterHelper
{

	/**
	 * Transforma plain text em HTML, tratando caracteres especiais e
	 * convertendo URLs em links clicáveis.
	 *
	 * @param string $text = string que poderá conter as urls
	 * @return string = string com as urls entre as tags <a> do html
	 */
	public static function parseUrlsAndEscapeHtml($text)
	{
		$rgxProtocolo   = 'https?://|ftp://';
		$rgxDominio     = '(?:[-a-zA-Z0-9\x7f-\xff]{1,63}\.)+[a-zA-Z\x7f-\xff][-a-zA-Z0-9\x7f-\xff]{1,62}';
		$rgxIP          = '(?:[1-9][0-9]{0,2}\.|0\.){3}(?:[1-9][0-9]{0,2}|0)';
		$rgxPorta       = '(:[0-9]{1,5})?';
		$rgxPath        = '(/[!$-/0-9:;=@_\':;!a-zA-Z\x7f-\xff]*?)?';
		$rgxQuery       = '(\?[!$-/0-9:;=@_\':;!a-zA-Z\x7f-\xff]+?)?';
		$rgxFragment    = '(#[!$-/0-9?:;=@_\':;!a-zA-Z\x7f-\xff]+?)?';
		$rgxUsername    = '[^]\\\\\x00-\x20\"(),:-<>[\x7f-\xff]{1,64}';
		$rgxPassword    = $rgxUsername; // Permitir os mesmos caracteres do username

		$rgxUrl         = "($rgxProtocolo)?(?:($rgxUsername)(:$rgxPassword)?@)?($rgxDominio|$rgxIP)($rgxPorta$rgxPath$rgxQuery$rgxFragment)";

		$rgxTrail           = "[)'?.!,;:]"; // Caracteres válidos da URL que não são parte da URL se eles aparecerem no final da palavra
		$rgxInvalidosNaURL  = "[^-_#$+.!*%'(),;/?:@=&a-zA-Z0-9\x7f-\xff]"; // Caracteres que nunca devem aparecer na URL

		$rexUrlLinker   = "{\\b$rgxUrl(?=$rgxTrail*($rgxInvalidosNaURL|$))}i";

		$tlds = array_fill_keys(array('.com', '.br', '.org', '.gov' ,'.net', '.edu', '.int', '.mil'), true);

		$html     = '';
		$position = 0;
		$match    = array();

		while (preg_match($rexUrlLinker, $text, $match, PREG_OFFSET_CAPTURE, $position)) {
			list($url, $urlPosition) = $match[0];

			// Adicionar o texto que antecede a URL
			$html .= htmlspecialchars(substr($text, $position, $urlPosition - $position));

			$protocol     = $match[1][0];
			$username     = $match[2][0];
			$password     = $match[3][0];
			$domain       = $match[4][0];
			$afterDomain  = $match[5][0]; // Tudo após o domínio
			$port         = $match[6][0];
			$path         = $match[7][0];

			// Verificar se o TLD é válido ou se o domínio é um endereço de IP
			$tld = strtolower(strrchr($domain, '.'));

			if (preg_match('{^\.[0-9]{1,3}$}', $tld) || isset($tlds[$tld])) {

				// Não permitir protocolo implícito caso o password tenha sido fornecido (evitar erros)
				if (!$protocol && $password) {
					$html .= htmlspecialchars($username);

					// Continuar a análise no ':' após o username.
					$position = $urlPosition + strlen($username);

					continue;
				}

				if (!$protocol && $username && !$password && !$afterDomain) {
					// Probabilidade de ser um endereço de e-mail
					$urlCompleta = "mailto:$url";
					$linkText = $url;
				} else {
					// Adicionar http:// se o protocolo não for especificado
					$urlCompleta = $protocol ? $url : "http://$url";
					$linkText = "{$domain}{$port}{$path}";
				}

				// Criar o hyperlink
				$hyperLink = sprintf('<a href="%s">%s</a>', htmlspecialchars($urlCompleta), htmlspecialchars($linkText));

				// Obfuscation básica para enganar os bots coletores de e-mail mais simples
				$html .= str_replace('@', '&#64;', $hyperLink);
			} else {
				// URL que não é válida
				$html .= htmlspecialchars($url);
			}

			// Continuar a análise do texto após URL
			$position = $urlPosition + strlen($url);
		}

		// Adicionar o restante do texto
		$html .= htmlspecialchars(substr($text, $position));

		return $html;
	}


}
