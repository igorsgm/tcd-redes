-- phpMyAdmin SQL Dump
-- version 4.7.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: 31-Out-2017 às 19:21
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
-- Estrutura da tabela `anmt_smarteventos_checkin`
--

DROP TABLE IF EXISTS `anmt_smarteventos_checkin`;
CREATE TABLE `anmt_smarteventos_checkin` (
  `id` int(11) UNSIGNED NOT NULL,
  `ordering` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL,
  `checked_out` int(11) NOT NULL,
  `checked_out_time` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `modified_by` int(11) NOT NULL,
  `id_inscricao` int(11) NOT NULL,
  `pulseira` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `camiseta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `kit` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tamanhocamiseta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `observacoes` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `anmt_smarteventos_checkin`
--

INSERT INTO `anmt_smarteventos_checkin` (`id`, `ordering`, `state`, `checked_out`, `checked_out_time`, `created_by`, `modified_by`, `id_inscricao`, `pulseira`, `camiseta`, `kit`, `tamanhocamiseta`, `observacoes`) VALUES
(1, 1, 1, 343, '2017-10-31 14:50:35', 343, 343, 326, '1', '0', '1', 'P', ''),
(2, 2, 1, 0, '0000-00-00 00:00:00', 343, 343, 43, '1', '0', '1', 'EXG', ''),
(3, 3, 1, 0, '0000-00-00 00:00:00', 343, 343, 251, '1', '1', '1', 'M', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anmt_smarteventos_checkin`
--
ALTER TABLE `anmt_smarteventos_checkin`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anmt_smarteventos_checkin`
--
ALTER TABLE `anmt_smarteventos_checkin`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
