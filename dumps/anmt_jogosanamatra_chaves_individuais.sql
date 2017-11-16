-- phpMyAdmin SQL Dump
-- version 4.7.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: 30-Out-2017 às 20:58
-- Versão do servidor: 5.7.18
-- PHP Version: 7.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `anamatra`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `anmt_jogosanamatra_chaves_individuais`
--

DROP TABLE IF EXISTS `anmt_jogosanamatra_chaves_individuais`;
CREATE TABLE `anmt_jogosanamatra_chaves_individuais` (
  `id` int(11) NOT NULL,
  `ordering` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL,
  `created_by` int(11) NOT NULL,
  `modified_by` int(11) NOT NULL,
  `modalidades` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `etapas` int(11) NOT NULL,
  `id_atleta_1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_atleta_2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_atleta_3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dia` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hora` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_atleta_1_resultado` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_atleta_2_resultado` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_atleta_1_resultado_extra` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_atleta_2_resultado_extra` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resultados` text COLLATE utf8mb4_unicode_ci,
  `sumula` longtext COLLATE utf8mb4_unicode_ci,
  `modelo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observacoes` varchar(2550) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `anmt_jogosanamatra_chaves_individuais`
--

INSERT INTO `anmt_jogosanamatra_chaves_individuais` (`id`, `ordering`, `state`, `created_by`, `modified_by`, `modalidades`, `etapas`, `id_atleta_1`, `id_atleta_2`, `id_atleta_3`, `dia`, `hora`, `id_atleta_1_resultado`, `id_atleta_2_resultado`, `id_atleta_1_resultado_extra`, `id_atleta_2_resultado_extra`, `resultados`, `sumula`, `modelo`, `observacoes`) VALUES
(1, 1, 1, 16012, 16012, '42', 39, '', '', '{\"0\":\"10\",\"1\":\"18\",\"2\":\"44\",\"3\":\"69\",\"4\":\"70\",\"5\":\"98\",\"6\":\"111\",\"7\":\"169\",\"8\":\"192\",\"9\":\"214\",\"10\":\"216\",\"11\":\"236\",\"12\":\"238\",\"13\":\"270\"}', '02/11/2017', '06:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 2, 1, 343, 343, '46', 43, '11', '34', '', '01/11/2017', '14:00', '', '', '', '', NULL, NULL, NULL, NULL),
(3, 3, 1, 343, 343, '36', 33, '', '', '{\"0\":\"59\",\"1\":\"60\",\"2\":\"102\",\"3\":\"144\",\"4\":\"237\",\"5\":\"245\",\"6\":\"256\",\"7\":\"258\",\"8\":\"295\",\"9\":\"297\",\"10\":\"315\"}', '01/11/2017', '12:00', '', '', '', '', NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anmt_jogosanamatra_chaves_individuais`
--
ALTER TABLE `anmt_jogosanamatra_chaves_individuais`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ordering` (`ordering`),
  ADD KEY `state` (`state`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `modified_by` (`modified_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anmt_jogosanamatra_chaves_individuais`
--
ALTER TABLE `anmt_jogosanamatra_chaves_individuais`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
