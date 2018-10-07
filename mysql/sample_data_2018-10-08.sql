-- MySQL dump 10.13  Distrib 5.7.22, for Linux (x86_64)
--
-- Host: 172.17.0.2    Database: fundme
-- ------------------------------------------------------
-- Server version	5.7.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Challenges`
--

DROP TABLE IF EXISTS `Challenges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Challenges` (
  `challenge_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `challenge_name` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `project_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `challenge_type` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `challenge_description` varchar(4096) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `amout_pledged` decimal(13,2) DEFAULT '0.00',
  `currency_symbol` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'USD',
  UNIQUE KEY `challenge_id` (`challenge_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `Challenges_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `Projects` (`project_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Challenges`
--

LOCK TABLES `Challenges` WRITE;
/*!40000 ALTER TABLE `Challenges` DISABLE KEYS */;
INSERT INTO `Challenges` VALUES ('C-ma3zKM1o','Animated Gif when not playing','P-5XPEeHu','Feature','Add the option to have an animated gif when not playing any track',0.00,'USD'),('C-pHNgtXZm','non-sqaure images are disorted','P-5XPEeHu','Bug','if the image associated with a track is not squared, it will appear distored',0.00,'USD');
/*!40000 ALTER TABLE `Challenges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Projects`
--

DROP TABLE IF EXISTS `Projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Projects` (
  `project_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `online_repo` varchar(512) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `user_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `description` varchar(2048) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  UNIQUE KEY `project_id` (`project_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Projects`
--

LOCK TABLES `Projects` WRITE;
/*!40000 ALTER TABLE `Projects` DISABLE KEYS */;
INSERT INTO `Projects` VALUES ('P-5Elmzos','friendly','https://www.github.com/tomklino/friendly','U-0QiV1ai','program that looks for amicable numbers'),('P-5XPEeHu','CircularAudioPlayer','https://www.github.com/tomklino/CircularAudioPlayer','U-0QiV1ai',NULL),('P-Xv7dvgb','fundme','https://www.github.com/tomklino/fundme','U-0QiV1ai','Crowdfunding made for open source software');
/*!40000 ALTER TABLE `Projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `user_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `github_id` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `github_login` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `github_access_token` varchar(512) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `github_id` (`github_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('U-0QiV1ai','7678388','tomklino','54a624901d38404fc3ecf411003848217b31b834');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-08  1:30:39
