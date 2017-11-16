<?php
// Kickstart the framework
require 'lib/phpmail/PHPMailerAutoload.php';
require 'helpers/helper.php';
$f3 = require('lib/base.php');
$f3->set('DEBUG', 0);
if (( float )PCRE_VERSION < 7.9) {
	trigger_error('PCRE version is out of date');
}

// Load configuration
$f3->config('config.ini');

$f3->set('HEADER', array('Origin' => "*"));
$f3->set('CORS', array('origin' => "*"));

require '../configuration.php';
$jConfig = new JConfig();

$f3->set('DB', new DB\SQL(
	"mysql:host=" . $jConfig->host . ";port=3306;dbname=" . $jConfig->db,
	$jConfig->user,
	$jConfig->password
));

$f3->route('GET /', function ($f3) {
	echo "OK";
});

$f3->route('GET /v1/temas', function ($f3) {

	if ($user = validaToken($f3)) {
		$categories = $f3->get('DB')->exec("select id,published, title as name from anmt_categories where extension = 'com_aplicativo' and published = 1");

		$usuarios = $f3->get('DB')->exec("select user_id,group_id from anmt_user_usergroup_map where user_id = {$user['id']} AND (group_id = 7 OR group_id = 8)");

		foreach ($categories as $key => $c) {
			if ($usuarios['0']['group_id'] == '7' || $usuarios['0']['group_id'] == '8') {
				$categories[$key]['topics'] = $f3->get('DB')->exec("select id, state, title as name, description" .
					" from anmt_aplicativo_topicos" .
					// Em produção colacar devido ao horario ser diferente
					// " where category = {$c['id']} AND ({$usuarios['0']['group_id']} = 7 OR {$usuarios['0']['group_id']} = 8) AND state != -2 AND (CONVERT_TZ(NOW(), @@global.time_zone, 'America/Sao_Paulo') between publish_up and publish_down)");
					" where category = {$c['id']} AND ({$usuarios['0']['group_id']} = 7 OR {$usuarios['0']['group_id']} = 8) AND state != -2 AND (now() between publish_up and publish_down)");
			} elseif (empty($usuarios['0']['group_id'])) {
				$categories[$key]['topics'] = $f3->get('DB')->exec("select id, state, title as name, description" .
					" from anmt_aplicativo_topicos" .
					// Em produção colacar devido ao horario ser diferente
					// " where category = {$c['id']} AND state = 1 AND (CONVERT_TZ(NOW(), @@global.time_zone, 'America/Sao_Paulo') between publish_up and publish_down)");
					" where category = {$c['id']} AND state = 1 AND (now() between publish_up and publish_down)");
			}
		}

		echo json_encode(array('result' => true, 'lista' => $categories));
	}
});

$f3->route('GET /v1/noticias', function($f3, $params){
	if ($user = validaToken($f3)){

		$noticias = $f3->get('DB')->exec("select id,title,introtext,catid,publish_up,images from anmt_content where catid = 2 ORDER BY id DESC LIMIT 20");
		echo json_encode(array('result' => true, 'noticias' => $noticias));
	}
});

$f3->route('GET /v1/noticia/@id', function($f3, $params){
	if ($user = validaToken($f3)){

		$noticia = $f3->get('DB')->exec("select * from anmt_content where catid = 2 AND id = {$params['id']}")[0];
		echo json_encode(array('result' => true, 'model' => $noticia, 'ta' => true, 'forumAberto' => true));
	}
});

$f3->route('GET /v1/avisos', function ($f3, $params) {
	if ($user = validaToken($f3)) {
		$avisos = $f3->get('DB')->exec("SELECT id, publish_up, aviso FROM anmt_aplicativo_avisos WHERE NOW() >= publish_up AND state = 1 ORDER BY id DESC LIMIT 20");
		echo json_encode(array('result' => true, 'avisos' => $avisos));
	}
});

$f3->route('GET /v1/topico/@id', function ($f3, $params) {
	if ($user = validaToken($f3)) {
		$topico = $f3->get('DB')->
		exec("select distinct t.id, t.title as name, t.state, t.description, t.audio, t.video,t.forum_ativo, t.resultados_parciais as exibir_resultados_parciais, t.forum_ativo, (r.id is not null) as jaVotou, (now() between publish_up and publish_down) as topicoAberto, (now() between voto_up and voto_down) as votacaoAberta, " .
			"DATE_FORMAT( voto_up,  '%d/%m/%Y' ) as data_inicio_votacao, DATE_FORMAT( voto_down,  '%d/%m/%Y' ) as data_fim_votacao, " .
			"DATE_FORMAT( publish_up,  '%d/%m/%Y' ) as data_inicio_topico, DATE_FORMAT( publish_down,  '%d/%m/%Y' ) as data_fim_topico " .
			"from anmt_aplicativo_topicos t " .
			"left join anmt_aplicativo_perguntas p on p.topico = t.id " .
			"left join anmt_aplicativo_respostas r on r.pergunta = p.id and r.created_by = {$user[id]} " .
			"where t.id = {$params['id']}")[0];

		$topico = convertBoolean($topico, array('jaVotou', 'topicoAberto', 'votacaoAberta'));

		$usuarios = $f3->get('DB')->exec("select user_id,group_id from anmt_user_usergroup_map where user_id = {$user['id']} AND group_id = 7");
		if ($usuarios['0']['group_id'] == '7') {
			$topico['perguntas'] = $f3->get('DB')->exec("select id, state, titulo, multiplas, params from anmt_aplicativo_perguntas where topico = {$topico['id']} and state != -2");
		} elseif (empty($usuarios['0']['group_id'])) {
			$topico['perguntas'] = $f3->get('DB')->exec("select id, state, titulo, multiplas, params from anmt_aplicativo_perguntas where topico = {$topico['id']} and state =1");
		}
		foreach ($topico['perguntas'] as $key => $value) {
			$topico['perguntas'][$key] = convertBoolean($value, array('multiplas'));
			$ps = json_decode($topico['perguntas'][$key]['params']);
			foreach ($ps as $k => $p) {
				$p->id = md5($p->opcoes);
				$ps->$k = $p;
			}
			$topico['perguntas'][$key]['params'] = json_encode($ps);
		}

		$topico['posts'] = $f3->get('DB')->
		exec("select c.id, c.state, c.comentario as description, u.name as author, DATE_FORMAT(c.date_created, '%d/%m/%Y') as date, " .
			"{$params['id']} as topico_id, t.title as topico_name, " .
			"u.id = {$user['id']} as isAuthor, true as isTopic, (CURRENT_TIMESTAMP between voto_up and voto_down) as votacaoAberta, " . ($topico['jaVotou'] ? 'true' : 'false') . " as jaVotou " .
			"from anmt_aplicativo_comentarios as c " .
			"inner join anmt_users as u on u.id = c.created_by " .
			"inner join anmt_aplicativo_topicos as t on t.id = c.topico " .
			"where c.topico = {$params['id']} and c.state = 1");

		foreach ($topico['posts'] as $key => $value) {
			$topico['posts'][$key] = convertBoolean($value, array('isAuthor', 'isTopic', 'votacaoAberta', 'jaVotou'));
		}

		echo json_encode(array('result' => true, 'model' => $topico, 'ta' => true, 'forumAberto' => true));
	}
});

$f3->route('GET /v1/resultado/topico/@id', function ($f3, $params) {
	if ($user = validaToken($f3)) {

		// Mensagem padrão para exibir na view de resultados do app caso resultados parciais nao serao exibido e nao tenha mensagem pesonalizada.
		$mensagem = array('aviso_resultado' => 'Os Resultados serão divulgados em breve.');

		$perguntas = $f3->get('DB')->
		exec("select p.id, p.titulo, p.params " .
			"from anmt_aplicativo_perguntas as p " .
			"where p.topico = {$params['id']} ");

		foreach ($perguntas as $key => $value) {

			$votos = $f3->get('DB')->
			exec("select params AS opcoes, COUNT(*) as votos ".
				"from anmt_aplicativo_respostas ".
				"where pergunta = {$value['id']} ".
				"group by opcoes ".
				"order by votos DESC ");

			$perguntas[$key]['params'] = $votos;
		}

		$avisos = $f3->get('DB')->
		exec("select aviso_resultado, resultados_parciais " .
			"from anmt_aplicativo_topicos " .
			"where id = {$params['id']} ");

		if (!empty($_GET['filtro_id'])) {
			$resps = array();
			foreach ($perguntas as $key => $p) {

				$respostas = $f3->get('DB')->
				exec("SELECT params, state FROM anmt_aplicativo_respostas as r " .
					"inner join anmt_user_usergroup_map as ugm on ugm.user_id = r.created_by " .
					"WHERE ugm.group_id = {$_GET['filtro_id']} and r.pergunta = {$p['id']} and r.state = 1");
				foreach ($respostas as $ra) {
					foreach (explode('|', $ra['params']) as $r) {
						$resps[$r] = isset($resps[$r]) ? $resps[$r]++ : 1;
					}
				}
				$p['params'] = json_decode($p['params']);

				foreach ($p['params'] as $k1 => $metadata) {
					$r = $metadata->opcoes;
					$metadata->votos = isset($resps[$r]) ? $resps[$r] : 0;

					$p['params']->$k1 = $metadata;
				}
				$perguntas[$key]['params'] = json_encode($p['params']);
			}

		}

		$filtro = array(array('id' => '', 'name' => 'Nacional'));

		$filtro = array_merge($filtro, $f3->get('DB')->
		exec("SELECT distinct ug.id, ug.title as 'name' FROM anmt_usergroups as ug " .
			"inner join anmt_user_usergroup_map as ugm on ugm.group_id = ug.id " .
			"inner join anmt_aplicativo_respostas as r on r.created_by = ugm.user_id " .
			"inner join anmt_aplicativo_perguntas as p on r.pergunta = p.id " .
			"where p.topico = {$params['id']} and ug.title like '%Amatra%'" .
			"order by ug.id asc"));

		if ($avisos['0']['resultados_parciais'] == 1) {
			echo json_encode(array('result' => true, 'model' => (array)$perguntas, 'filtro' => $filtro));
		}elseif($avisos['0']['resultados_parciais'] == 0 && empty($avisos['0']['aviso_resultado'])){
			echo json_encode(array('result' => true, 'avisos' => $mensagem, 'filtro' => $filtro));
		}else{
			echo json_encode(array('result' => true, 'avisos' => $avisos['0'], 'filtro' => $filtro));
		}
	}
});

$f3->route('POST /v1/comentar/topico/@id', function ($f3, $params) {
	if ($user = validaToken($f3)) {
		$comentario = TreaterHelper::parseUrlsAndEscapeHtml($_POST['comentario']);

		// Chamada da funcao para verificar se exiti alguma palavra censurada, se tiver substitui por ****
		$comentario = censoredWord($comentario, $f3);

		$sql_query = " INSERT INTO anmt_aplicativo_comentarios(ordering, date_created, created_by, state, topico, comentario) " .
			" VALUES (1,now(),{$user['id']},1,{$params['id']}, '" . $comentario . "')";
		$f3->get('DB')->exec($sql_query);
		echo json_encode(array('result' => true, 'ta' => true));
	}
});

$f3->route('DELETE /v1/comentar/topico/@id', function ($f3, $params) {
	if ($user = validaToken($f3)) {

		parse_str($f3->get('BODY'), $comentario);

		$sql_query = " DELETE FROM anmt_aplicativo_comentarios WHERE id = {$comentario['id']}";
		$f3->get('DB')->exec($sql_query);

		echo json_encode(array('result' => true, 'ta' => true));
	}
});

$f3->route('PUT /v1/comentar/topico/@id', function ($f3, $params) {
	if ($user = validaToken($f3)) {

		parse_str($f3->get('BODY'), $comentario);

		// Se for denúncia
		if (!empty($comentario['denunciar'])) {
			$sql_query = " UPDATE anmt_aplicativo_comentarios SET moderacao = '4' WHERE id = {$comentario['id']}";
		} else { // Se for edição de comentário

			// Chamada da funcao para verificar se exiti alguma palavra censurada, se tiver substitui por ****.
			$comentario['text'] = censoredWord($comentario['text'], $f3);

			$sql_query = " UPDATE anmt_aplicativo_comentarios SET comentario = '{$comentario['text']}', moderacao = '2' WHERE id = {$comentario['id']}";
		}
		$f3->get('DB')->exec($sql_query);

		echo json_encode(array('result' => true, 'ta' => true));
	}
});

$f3->route('POST /v1/contato', function ($f3, $params) {
	if ($user = validaToken($f3)) {

		$email = $_POST['email'];
		$dados = $f3->get('DB')->exec("SELECT a.`fone_celular`, a.`cpf`, b.`title` FROM anmt_associados as a " .
					"inner join anmt_categories as b on b.`id` = a.`amatra` " .
					"WHERE a.`email` = '$email' ")[0];

		$sql_query = "INSERT INTO anmt_suporte(nome, telefone, cpf, email, amatra, meuproblema, observacao, status, data_chamado) " . "VALUES ('".$_POST["nome"]."','".$dados["fone_celular"]."','".$dados["cpf"]."','".$email."','".$dados["title"]."','5', '".$_POST["mensagem"]."','95',now())";
			$f3->get('DB')->exec($sql_query);
		echo json_encode(array('result' => true, 'ta' => true));
	}
});

$f3->route('POST /v1/votar', function ($f3, $params) {
	if ($user = validaToken($f3)) {
		$perguntas = json_decode($_POST['perguntas']);

		foreach ($perguntas as $key => $pergunta) {
			$semRes = sem_get(intVal($pergunta->id), 1, 0666, 0); // get the resource for the semaphore

			$respostas = array();

			if (sem_acquire($semRes)) { // try to acquire the semaphore. this function will block until the sem will be available
				// do the work
				$opcoes = $f3->get('DB')->
				exec("select params from anmt_aplicativo_perguntas where id = {$pergunta->id}")[0];

				$opcoes = json_decode($opcoes['params']);
				foreach ($opcoes as $key => $o) {
					if (in_array(md5($o->opcoes), $pergunta->respostas)) {
						$opcoes->$key->votos = strval(intval($o->votos) + 1);
						$respostas[] = $o->opcoes;
					}
				}
				// $opcoes = json_encode($opcoes, JSON_UNESCAPED_UNICODE);
				// $f3->get('DB')->
				// exec("update anmt_aplicativo_perguntas set params = '$opcoes' where id = {$pergunta->id}");

				sem_release($semRes); // release the semaphore so other process can use it
			}

			// $respostas = implode(',', $pergunta->respostas);
			$respostas = implode('|', $respostas);
			$sql_query = "INSERT INTO anmt_aplicativo_respostas(ordering, state, checked_out_time, created_by, meio_votacao, pergunta, params) " .
				"VALUES (1,1,(NOW() + INTERVAL 1 HOUR),{$user['id']}, 'aplicativo', {$pergunta->id},'$respostas')";
			$f3->get('DB')->exec($sql_query);
		}

		echo json_encode(array('result' => true));
	}
});

$f3->route('POST /v1/auth', function ($f3) {

	$data = $_POST['signin'];
	if (!defined('PASSWORD_DEFAULT')) {
		// Always make sure that the password hashing API has been defined.
		require_once __DIR__ . '/../libraries/vendor/ircmaxell/password-compat/lib/password.php';
	}

	$user = $f3->get('DB')->
	exec("select id, username, password, name, email from anmt_users where username = '{$data['username']}'");

	$user_id = false;
	if (count($user) == 1) {
		$model = $user[0];
		if (password_verify($data['password'], $model['password'])) {
			unset($model['password']);
			$user_id = $model['id'];
		}
	} else {

		$curl = curl_init();

		$fields = array(
			'signin[username]' => $data['username'],
			'signin[password]' => $data['password'],
		);

		$fields_string = "";
		foreach ($fields as $key => $value) {
			$fields_string .= $key . '=' . urlencode($value) . '&';
		}
		$fields_string = rtrim($fields_string, '&');

		curl_setopt_array($curl, array(
			CURLOPT_URL => "https://extranet.anamatra.org.br/+/api/auth",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_POST => count($fields),
			CURLOPT_POSTFIELDS => $fields_string,
		));

		$response = curl_exec($curl);
		$err = curl_error($curl);

		curl_close($curl);

		if ($err) {
			die("cURL Error #:" . $err);
		} else {
			$response = json_decode($response);
			$password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
			if ($response->result) {
				$model = $response->model;
				$currentDate = date('Y/m/d H:i:s');
				$f3->get('DB')->
				exec("insert into anmt_users (id, username, password, name, email, registerDate) VALUES ('{$model->id}','{$model->username}', '$password_hash', '{$model->nome}','{$model->email}', '$currentDate')");
				// $user_id = $f3->get('DB')->lastInsertId();
				$user_id = $model->id;

				$f3->get('DB')->
				exec("INSERT INTO anmt_user_usergroup_map (user_id, group_id) SELECT user_id, amatra_id FROM anmt_user_amatra WHERE user_id =  $user_id");
				$model = (array)$model;
				$model['id'] = $user_id;
			}
		}

	}

	if ($user_id) {
		$token = GUID();
		$sql_query = " insert into anmt_user_tokens (token,created_at,updated_at,user,status) " .
			" values ('" . $token . "',now(),now(),'" . $model['id'] . "',1)";
		$f3->get('DB')->exec($sql_query);

		$f3->get('DB')->exec("UPDATE anmt_users SET lastvisitDate = now() WHERE id = {$user_id}");
		$f3->get('DB')->exec("UPDATE anmt_user_tokens SET lastvisitDate = now() WHERE user = {$user_id}");

		$group_ids = $f3->get('DB')->exec("SELECT group_id FROM anmt_user_usergroup_map WHERE user_id = {$user_id}");
		$model['group_ids'] = array_column($group_ids, 'group_id');

		echo json_encode(array('result' => true, 'token' => $token, 'model' => $model));
	} else {
		echo json_encode(array('result' => false));
	}

});

function convertBoolean($arr, $fields = array())
{
	foreach ($arr as $key => $value) {
		if (!in_array($key, $fields)) {
			continue;
		}
		$arr[$key] = $value == '1';
	}
	return $arr;
}

function validaToken($f3)
{
	$user = $f3->get('DB')->
	exec("select u.id as id, u.username, u.name, u.email from anmt_users u " .
		"inner join anmt_user_tokens t on u.id = t.user " .
		"where t.token = '{$_GET['t']}'");
	if (count($user) != 1) {
		echo json_encode(array('result' => false, 'model' => 'Invalid auth.'));
		return false;
	}
	return $user[0];
}

function GUID()
{
	if (function_exists('com_create_guid') === true) {
		return trim(com_create_guid(), '{}');
	}
	return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535),
		mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
}

/**
* Função para verificar se exitir no comentario alguma palavra censurada.
* Caso exista alguma palavra censurada ela é substituida por **** no texto.
*/
function censoredWord($comentario, $f3){

    $word = $f3->get('DB')->exec("SELECT params FROM anmt_extensions WHERE name = 'com_aplicativo'");
    $word = json_decode($word['0']['params'], true);
	$word = explode(",", $word['palavras_censuradas']);

	$comentario = str_replace($word, " **** ", $comentario);

    return $comentario;
}

if (!function_exists('sem_get')) {
	function sem_get($key)
	{
		return fopen(__FILE__ . '.sem.' . $key, 'w+');
	}

	function sem_acquire($sem_id)
	{
		return flock($sem_id, LOCK_EX);
	}

	function sem_release($sem_id)
	{
		return flock($sem_id, LOCK_UN);
	}
}

$f3->run();
