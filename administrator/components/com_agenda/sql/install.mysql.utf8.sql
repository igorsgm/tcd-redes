CREATE TABLE IF NOT EXISTS `#__com_agenda` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`asset_id` INT(10) UNSIGNED NOT NULL DEFAULT '0',

`ordering` INT(11)  NOT NULL ,
`state` TINYINT(1)  NOT NULL ,
`checked_out` INT(11)  NOT NULL ,
`checked_out_time` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
`created_by` INT(11)  NOT NULL ,
`categoria` INT(11)  NOT NULL ,
`nome` VARCHAR(255)  NOT NULL ,
`local` VARCHAR(255)  NOT NULL ,
`data_inicio` DATE NOT NULL ,
`data_fim` DATE NOT NULL ,
`hora_inicio` VARCHAR(255)  NOT NULL ,
`hora_fim` VARCHAR(255)  NOT NULL ,
`descricao` TEXT NOT NULL ,
`maps` TEXT NOT NULL ,
`imagem` VARCHAR(255)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8_general_ci;

