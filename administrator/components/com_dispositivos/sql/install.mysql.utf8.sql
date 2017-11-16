CREATE TABLE IF NOT EXISTS `#__dispositivos` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`ordering` INT(11)  NOT NULL ,
`state` TINYINT(1)  NOT NULL ,
`checked_out` INT(11)  NOT NULL ,
`checked_out_time` DATETIME NOT NULL ,
`created_by` INT(11)  NOT NULL ,
`modified_by` INT(11)  NOT NULL ,
`identificador_aparelho` VARCHAR(255)  NOT NULL ,
`tipo` TEXT NOT NULL ,
`modelo` VARCHAR(255)  NOT NULL ,
`sistema_operacional` VARCHAR(255)  NOT NULL ,
`nome_propiertario` VARCHAR(255)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8mb4_unicode_ci;

