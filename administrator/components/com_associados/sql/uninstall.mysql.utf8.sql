DROP TABLE IF EXISTS `#__associados`;
DROP TABLE IF EXISTS `#__associados_situacao`;
DROP TABLE IF EXISTS `#__associados_eventos`;
DROP TABLE IF EXISTS `#__cidades`;
DROP TABLE IF EXISTS `#__estado`;

DELETE FROM `#__content_types` WHERE (type_alias LIKE 'com_associados.%');