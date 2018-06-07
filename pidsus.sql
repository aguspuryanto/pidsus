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

-- Dumping structure for table pidsusbangka.wp0e_kategori
DROP TABLE IF EXISTS `wp0e_kategori`;
CREATE TABLE IF NOT EXISTS `wp0e_kategori` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kategori` varchar(150) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table pidsusbangka.wp0e_pxlaporan
DROP TABLE IF EXISTS `wp0e_pxlaporan`;
CREATE TABLE IF NOT EXISTS `wp0e_pxlaporan` (
  `idlap` int(11) NOT NULL AUTO_INCREMENT,
  `user_pelapor` int(11) NOT NULL,
  `no_laporan` varchar(50) NOT NULL,
  `tgl_laporan` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `kat_laporan` varchar(50) NOT NULL,
  `jdl_laporan` varchar(190) NOT NULL,
  `isi_laporan` text NOT NULL,
  `file_laporan` varchar(190) NOT NULL,
  `file_laporan2` varchar(190) DEFAULT NULL,
  `file_laporan3` varchar(190) DEFAULT NULL,
  `file_laporan4` varchar(190) DEFAULT NULL,
  `file_laporan5` varchar(190) DEFAULT NULL,
  `status_laporan` varchar(50) NOT NULL,
  `tgl_response` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isi_response` text NOT NULL,
  PRIMARY KEY (`idlap`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table pidsusbangka.wp0e_pxusers
DROP TABLE IF EXISTS `wp0e_pxusers`;
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
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobs` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.
-- Dumping structure for table pidsusbangka.wp0e_upload
DROP TABLE IF EXISTS `wp0e_upload`;
CREATE TABLE IF NOT EXISTS `wp0e_upload` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fileTitle` tinytext,
  `fileDesc` tinytext,
  `fileName` varchar(50) DEFAULT NULL,
  `fileTgl` date DEFAULT '0000-00-00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
