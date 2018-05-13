-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.17-log - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table pidsusbangka.wp0e_pxusers
CREATE TABLE IF NOT EXISTS `wp0e_pxusers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `level` int(11) DEFAULT '0',
  `dob` date NOT NULL,
  `gender` char(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobs` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pidsusbangka.wp0e_pxusers: ~1 rows (approximately)
DELETE FROM `wp0e_pxusers`;
/*!40000 ALTER TABLE `wp0e_pxusers` DISABLE KEYS */;
INSERT INTO `wp0e_pxusers` (`id`, `display_name`, `email`, `password`, `phone_number`, `remember_token`, `created_at`, `updated_at`, `level`, `dob`, `gender`, `address`, `jobs`) VALUES
	(1, 'Administrator', 'aguspuryanto@gmail.com', 'pixel1234', '82244492100', NULL, '2018-03-25 09:35:48', '2018-03-25 09:35:53', 10, '0000-00-00', '', '', ''),
	(2, 'Agus Puryanto', '---', 'a934b292ba264490', '82140724011', '4cd6b71494a7701b', '2018-05-13 16:24:35', '2018-05-13 16:24:35', 0, '1988-05-18', 'L', 'Wiyung, Surabaya City, East Java, Indonesia', 'Swasta');
/*!40000 ALTER TABLE `wp0e_pxusers` ENABLE KEYS */;

-- Dumping structure for table pidsusbangka.wp0e_usermeta
CREATE TABLE IF NOT EXISTS `wp0e_usermeta` (
  `umeta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext,
  PRIMARY KEY (`umeta_id`),
  KEY `user_id` (`user_id`),
  KEY `meta_key` (`meta_key`(191))
) ENGINE=MyISAM AUTO_INCREMENT=138220 DEFAULT CHARSET=utf8;

-- Dumping data for table pidsusbangka.wp0e_usermeta: 0 rows
DELETE FROM `wp0e_usermeta`;
/*!40000 ALTER TABLE `wp0e_usermeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `wp0e_usermeta` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
