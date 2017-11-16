CREATE TABLE IF NOT EXISTS `#__ouvidoria_solicitantes` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`ordering` INT(11)  NOT NULL ,
`state` TINYINT(1)  NOT NULL ,
`checked_out` INT(11)  NOT NULL ,
`checked_out_time` DATETIME NOT NULL ,
`created_by` INT(11)  NOT NULL ,
`modified_by` INT(11)  NOT NULL ,
`updated_at` DATETIME NOT NULL ,
`created_at` DATETIME NOT NULL ,
`nome` VARCHAR(255)  NOT NULL ,
`email` VARCHAR(255)  NOT NULL ,
`cpf` VARCHAR(14)  NOT NULL ,
`telefone` VARCHAR(15)  NOT NULL ,
`id_associado` INT NOT NULL ,
`id_user` INT NOT NULL ,
`is_associado` TINYINT(1)  NOT NULL ,
`amatra` TEXT NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `#__ouvidoria_solicitacoes` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`ordering` INT(11)  NOT NULL ,
`state` TINYINT(1)  NOT NULL ,
`checked_out` INT(11)  NOT NULL ,
`checked_out_time` DATETIME NOT NULL ,
`created_by` INT(11)  NOT NULL ,
`modified_by` INT(11)  NOT NULL ,
`updated_at` DATETIME NOT NULL ,
`created_at` DATETIME NOT NULL ,
`id_solicitante` INT NOT NULL ,
`id_tipo` INT NOT NULL ,
`id_diretoria_responsavel` INT NOT NULL ,
`texto` TEXT NOT NULL ,
`anexo` TEXT NOT NULL ,
`protocolo` VARCHAR(255)  NOT NULL ,
`status` INT NOT NULL ,
`id_user_responsavel_atual` INT NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `#__ouvidoria_solicitacoes_tipos` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`ordering` INT(11)  NOT NULL ,
`state` TINYINT(1)  NOT NULL ,
`created_by` INT(11)  NOT NULL ,
`modified_by` INT(11)  NOT NULL ,
`updated_at` DATETIME NOT NULL ,
`created_at` DATETIME NOT NULL ,
`nome` VARCHAR(255)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `#__ouvidoria_solicitacoes_status` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`ordering` INT(11)  NOT NULL ,
`state` TINYINT(1)  NOT NULL ,
`checked_out` INT(11)  NOT NULL ,
`checked_out_time` DATETIME NOT NULL ,
`created_by` INT(11)  NOT NULL ,
`modified_by` INT(11)  NOT NULL ,
`updated_at` DATETIME NOT NULL ,
`created_at` DATETIME NOT NULL ,
`nome` VARCHAR(255)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `#__ouvidoria_solicitacoes_interacoes` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`ordering` INT(11)  NOT NULL ,
`state` TINYINT(1)  NOT NULL ,
`checked_out` INT(11)  NOT NULL ,
`checked_out_time` DATETIME NOT NULL ,
`created_by` INT(11)  NOT NULL ,
`modified_by` INT(11)  NOT NULL ,
`updated_at` DATETIME NOT NULL ,
`created_at` DATETIME NOT NULL ,
`nome` VARCHAR(255)  NOT NULL ,
`id_status_vinculado` INT NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `#__ouvidoria_diretorias` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`ordering` INT(11)  NOT NULL ,
`state` TINYINT(1)  NOT NULL ,
`checked_out` INT(11)  NOT NULL ,
`checked_out_time` DATETIME NOT NULL ,
`created_by` INT(11)  NOT NULL ,
`modified_by` INT(11)  NOT NULL ,
`updated_at` DATETIME NOT NULL ,
`created_at` DATETIME NOT NULL ,
`nome` VARCHAR(255)  NOT NULL ,
`id_users_responsaveis` TEXT NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `#__ouvidoria_diretorias_users_responsaveis` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`id_diretoria` INT NOT NULL ,
`id_user` INT NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `#__ouvidoria_solicitacoes_logs` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`ordering` INT(11)  NOT NULL ,
`state` TINYINT(1)  NOT NULL ,
`created_by` INT(11)  NOT NULL ,
`created_by_solicitante` INT NOT NULL ,
`updated_at` DATETIME NOT NULL ,
`created_at` DATETIME NOT NULL ,
`id_solicitacao` INT NOT NULL ,
`id_interacao` INT NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `#__ouvidoria_comentarios` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,

`ordering` INT(11)  NOT NULL ,
`state` TINYINT(1)  NOT NULL ,
`checked_out` INT(11)  NOT NULL ,
`checked_out_time` DATETIME NOT NULL ,
`created_by` INT(11)  NOT NULL ,
`created_by_solicitante` INT NOT NULL ,
`id_user_consultado` VARCHAR(255)  NOT NULL ,
`modified_by` INT(11)  NOT NULL ,
`updated_at` DATETIME NOT NULL ,
`created_at` DATETIME NOT NULL ,
`id_solicitacao` INT NOT NULL ,
`anexo` TEXT NOT NULL ,
`texto` TEXT NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT COLLATE=utf8mb4_unicode_ci;


