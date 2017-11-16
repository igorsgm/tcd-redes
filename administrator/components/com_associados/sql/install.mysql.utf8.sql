CREATE TABLE IF NOT EXISTS `#__associados` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`state` TINYINT(1)  NOT NULL ,
`user_id` VARCHAR(255)  NOT NULL ,
`state_anamatra` VARCHAR(255)  NOT NULL ,
`state_amatra` VARCHAR(255)  NOT NULL ,
`amatra` INT(11)  NOT NULL ,
`situacao_do_associado` INT NOT NULL ,
`tratamento` VARCHAR(255)  NOT NULL ,
`nome` VARCHAR(255)  NOT NULL ,
`email` VARCHAR(255)  NOT NULL ,
`nascimento` DATE NOT NULL ,
`naturalidade` VARCHAR(50)  NOT NULL ,
`sexo` VARCHAR(255)  NOT NULL ,
`cpf` VARCHAR(11)  NOT NULL ,
`rg` VARCHAR(20)  NOT NULL ,
`orgao_expeditor` VARCHAR(10)  NOT NULL ,
`data_emissao` DATE NOT NULL ,
`dt_ingresso_magistratura` DATE NOT NULL ,
`dt_filiacao_anamatra` DATE NOT NULL ,
`tribunal` VARCHAR(255)  NOT NULL ,
`dirigente` TINYINT(1)  NOT NULL ,
`cargo` VARCHAR(255)  NOT NULL ,
`cargo_associado_honorario` VARCHAR(50)  NOT NULL ,
`estado_civil` VARCHAR(255)  NOT NULL ,
`endereco` VARCHAR(255)  NOT NULL ,
`logradouro` VARCHAR(255)  NOT NULL ,
`numero` VARCHAR(10)  NOT NULL ,
`complemento` VARCHAR(20)  NOT NULL ,
`bairro` VARCHAR(20)  NOT NULL ,
`estado` INT NOT NULL ,
`cidade` INT NOT NULL ,
`cep` VARCHAR(10)  NOT NULL ,
`observacoes` TEXT NOT NULL ,
`email_alternativo` VARCHAR(100)  NOT NULL ,
`fone_residencial` VARCHAR(20)  NOT NULL ,
`fone_comercial` VARCHAR(20)  NOT NULL ,
`fone_celular` VARCHAR(20)  NOT NULL ,
`fone_fax` VARCHAR(20)  NOT NULL ,
`possui_dependentes` VARCHAR(255)  NOT NULL ,
`dependentes` TEXT NOT NULL ,
`eventos_que_participou_jogos_nacionais` TEXT NOT NULL ,
`eventos_que_participou_conamat` TEXT NOT NULL ,
`eventos_que_participou_congresso_internacional` TEXT NOT NULL ,
`eventos_que_participou_encontro_aposentados` TEXT NOT NULL ,
`eventos_que_participou_outros` VARCHAR(255)  NOT NULL ,
`eventos_que_participou_outros_descricao` VARCHAR(255)  NOT NULL ,
`receber_correspondencia` VARCHAR(255)  NOT NULL ,
`receber_newsletter` VARCHAR(255)  NOT NULL ,
`receber_sms` VARCHAR(255)  NOT NULL ,
`filiado_amb` VARCHAR(255)  NOT NULL ,
`checked_out` INT(11)  NOT NULL ,
`checked_out_time` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
`created_by` INT(11)  NOT NULL ,
`protheus` VARCHAR(255)  NOT NULL ,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `#__associados_situacao` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`ordering` INT(11)  NOT NULL ,
`state` TINYINT(1)  NOT NULL ,
`checked_out` INT(11)  NOT NULL ,
`checked_out_time` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
`created_by` INT(11)  NOT NULL ,
`modified_by` INT(11)  NOT NULL ,
`situacao_nome` VARCHAR(255)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `#__associados_eventos` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`ordering` INT(11)  NOT NULL ,
`state` TINYINT(1)  NOT NULL ,
`checked_out` INT(11)  NOT NULL ,
`checked_out_time` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
`created_by` INT(11)  NOT NULL ,
`modified_by` INT(11)  NOT NULL ,
`evento_tipo` VARCHAR(255)  NOT NULL ,
`evento_ano` VARCHAR(255)  NOT NULL ,
`evento_local` VARCHAR(255)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `#__cidades` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`nm_cidade` VARCHAR(255)  NOT NULL ,
`id_estado` INT NOT NULL ,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `#__estado` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`sig_estado` VARCHAR(255)  NOT NULL ,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT COLLATE=utf8mb4_unicode_ci;


INSERT INTO `#__content_types` (`type_title`, `type_alias`, `table`, `content_history_options`)
SELECT * FROM ( SELECT 'Associado','com_associados.associado','{"special":{"dbtable":"#__associados","key":"id","type":"Associado","prefix":"AssociadosTable"}}', '{"formFile":"administrator\/components\/com_associados\/models\/forms\/associado.xml", "hideFields":["checked_out","checked_out_time","params","language" ,"dependentes"], "ignoreChanges":["modified_by", "modified", "checked_out", "checked_out_time"], "convertToInt":["publish_up", "publish_down"], "displayLookup":[{"sourceColumn":"catid","targetTable":"#__categories","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"group_id","targetTable":"#__usergroups","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"created_by","targetTable":"#__users","targetColumn":"id","displayColumn":"name"},{"sourceColumn":"access","targetTable":"#__viewlevels","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"modified_by","targetTable":"#__users","targetColumn":"id","displayColumn":"name"},{"sourceColumn":"situacao_do_associado","targetTable":"#__associados_situacao","targetColumn":"id","displayColumn":"situacao_nome"},{"sourceColumn":"estado","targetTable":"#__estado","targetColumn":"id","displayColumn":"sig_estado"},{"sourceColumn":"cidade","targetTable":"#__cidades","targetColumn":"id","displayColumn":"nm_cidade"}]}') AS tmp
WHERE NOT EXISTS (
	SELECT type_alias FROM `#__content_types` WHERE (`type_alias` = 'com_associados.associado')
) LIMIT 1;

INSERT INTO `#__content_types` (`type_title`, `type_alias`, `table`, `content_history_options`)
SELECT * FROM ( SELECT 'Situação','com_associados.situacao','{"special":{"dbtable":"#__associados_situacao","key":"id","type":"Situação","prefix":"AssociadosTable"}}', '{"formFile":"administrator\/components\/com_associados\/models\/forms\/situacao.xml", "hideFields":["checked_out","checked_out_time","params","language"], "ignoreChanges":["modified_by", "modified", "checked_out", "checked_out_time"], "convertToInt":["publish_up", "publish_down"], "displayLookup":[{"sourceColumn":"catid","targetTable":"#__categories","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"group_id","targetTable":"#__usergroups","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"created_by","targetTable":"#__users","targetColumn":"id","displayColumn":"name"},{"sourceColumn":"access","targetTable":"#__viewlevels","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"modified_by","targetTable":"#__users","targetColumn":"id","displayColumn":"name"}]}') AS tmp
WHERE NOT EXISTS (
	SELECT type_alias FROM `#__content_types` WHERE (`type_alias` = 'com_associados.situacao')
) LIMIT 1;

INSERT INTO `#__content_types` (`type_title`, `type_alias`, `table`, `content_history_options`)
SELECT * FROM ( SELECT 'Evento','com_associados.evento','{"special":{"dbtable":"#__associados_eventos","key":"id","type":"Evento","prefix":"AssociadosTable"}}', '{"formFile":"administrator\/components\/com_associados\/models\/forms\/evento.xml", "hideFields":["checked_out","checked_out_time","params","language"], "ignoreChanges":["modified_by", "modified", "checked_out", "checked_out_time"], "convertToInt":["publish_up", "publish_down"], "displayLookup":[{"sourceColumn":"catid","targetTable":"#__categories","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"group_id","targetTable":"#__usergroups","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"created_by","targetTable":"#__users","targetColumn":"id","displayColumn":"name"},{"sourceColumn":"access","targetTable":"#__viewlevels","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"modified_by","targetTable":"#__users","targetColumn":"id","displayColumn":"name"}]}') AS tmp
WHERE NOT EXISTS (
	SELECT type_alias FROM `#__content_types` WHERE (`type_alias` = 'com_associados.evento')
) LIMIT 1;

INSERT INTO `#__content_types` (`type_title`, `type_alias`, `table`, `content_history_options`)
SELECT * FROM ( SELECT 'Cidade','com_associados.cidade','{"special":{"dbtable":"#__cidades","key":"id","type":"Cidade","prefix":"AssociadosTable"}}', '{"formFile":"administrator\/components\/com_associados\/models\/forms\/cidade.xml", "hideFields":["checked_out","checked_out_time","params","language"], "ignoreChanges":["modified_by", "modified", "checked_out", "checked_out_time"], "convertToInt":["publish_up", "publish_down"], "displayLookup":[{"sourceColumn":"catid","targetTable":"#__categories","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"group_id","targetTable":"#__usergroups","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"created_by","targetTable":"#__users","targetColumn":"id","displayColumn":"name"},{"sourceColumn":"access","targetTable":"#__viewlevels","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"modified_by","targetTable":"#__users","targetColumn":"id","displayColumn":"name"},{"sourceColumn":"id_estado","targetTable":"#__estado","targetColumn":"id","displayColumn":"sig_estado"}]}') AS tmp
WHERE NOT EXISTS (
	SELECT type_alias FROM `#__content_types` WHERE (`type_alias` = 'com_associados.cidade')
) LIMIT 1;

INSERT INTO `#__content_types` (`type_title`, `type_alias`, `table`, `content_history_options`)
SELECT * FROM ( SELECT 'Estado','com_associados.estado','{"special":{"dbtable":"#__estado","key":"id","type":"Estado","prefix":"AssociadosTable"}}', '{"formFile":"administrator\/components\/com_associados\/models\/forms\/estado.xml", "hideFields":["checked_out","checked_out_time","params","language"], "ignoreChanges":["modified_by", "modified", "checked_out", "checked_out_time"], "convertToInt":["publish_up", "publish_down"], "displayLookup":[{"sourceColumn":"catid","targetTable":"#__categories","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"group_id","targetTable":"#__usergroups","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"created_by","targetTable":"#__users","targetColumn":"id","displayColumn":"name"},{"sourceColumn":"access","targetTable":"#__viewlevels","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"modified_by","targetTable":"#__users","targetColumn":"id","displayColumn":"name"}]}') AS tmp
WHERE NOT EXISTS (
	SELECT type_alias FROM `#__content_types` WHERE (`type_alias` = 'com_associados.estado')
) LIMIT 1;

INSERT INTO `#__content_types` (`type_title`, `type_alias`, `table`, `field_mappings`, `router`, `content_history_options`)
SELECT * FROM ( SELECT 'Associado Category','com_associados.category','{"special":{"dbtable":"#__categories","key":"id","type":"Category","prefix":"JTable","config":"array()"},"common":   {"dbtable":"#__ucm_content","key":"ucm_id","type":"Corecontent","prefix":"JTable","config":"array()"}}', '{"common":{"core_content_item_id":"id","core_title":"title","core_state":"published","core_alias":"alias","core_created_time":"created_time","core_modified_time":"modified_time","core_body":"description", "core_hits":"hits","core_publish_up":"null","core_publish_down":"null","core_access":"access", "core_params":"params", "core_featured":"null", "core_metadata":"metadata", "core_language":"language", "core_images":"null", "core_urls":"null", "core_version":"version", "core_ordering":"null", "core_metakey":"metakey", "core_metadesc":"metadesc", "core_catid":"parent_id", "core_xreference":"null", "asset_id":"asset_id"}, "special":{"parent_id":"parent_id","lft":"lft","rgt":"rgt","level":"level","path":"path","extension":"extension","note":"note"}}', 'Associados AnamatraRouter::getCategoryRoute', '{"formFile":"administrator\/components\/com_categories\/models\/forms\/category.xml", "hideFields":["asset_id","checked_out","checked_out_time","version","lft","rgt","level","path","extension"], "ignoreChanges":["modified_user_id", "modified_time", "checked_out", "checked_out_time", "version", "hits", "path"],"convertToInt":["publish_up", "publish_down"], "displayLookup":[{"sourceColumn":"created_user_id","targetTable":"#__users","targetColumn":"id","displayColumn":"name"},{"sourceColumn":"access","targetTable":"#__viewlevels","targetColumn":"id","displayColumn":"title"},{"sourceColumn":"modified_user_id","targetTable":"#__users","targetColumn":"id","displayColumn":"name"},{"sourceColumn":"parent_id","targetTable":"#__categories","targetColumn":"id","displayColumn":"title"}]}') AS tmp WHERE NOT EXISTS (
	SELECT type_alias FROM `#__content_types` WHERE (`type_alias` = 'com_associados.associado')
) LIMIT 1;
