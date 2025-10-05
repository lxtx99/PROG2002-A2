-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `event_name` varchar(100) NOT NULL,
  `event_date` date NOT NULL,
  `event_location` varchar(100) NOT NULL,
  `event_description` text NOT NULL,
  `ticket_price` decimal(10,2) NOT NULL,
  `charity_goal` decimal(12,2) NOT NULL,
  `current_progress` decimal(12,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `org_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`event_id`),
  KEY `org_id` (`org_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`) ON DELETE CASCADE,
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'City Fun Run 2025','2025-09-15','Central Park','A 5km fun run to raise funds for children\'s education. All participants get a free T-shirt.',25.00,50000.00,32000.00,1,1,1),(2,'Charity Gala Dinner','2025-09-20','Grand Hotel Ballroom','A formal gala with dinner, live music, and speeches. All proceeds go to homeless shelters.',150.00,100000.00,65000.00,1,1,2),(3,'Green Concert','2025-09-22','City Music Hall','A concert featuring local artists to raise funds for reforestation.',40.00,30000.00,18000.00,1,2,4),(4,'Silent Auction 2025','2025-08-20','Art Gallery','A silent auction with artworks donated by local artists. Funds go to animal shelters.',0.00,20000.00,25000.00,1,1,3),(5,'Summer Concert','2025-08-10','Park Amphitheater','A free concert to raise awareness for environmental protection.',0.00,15000.00,12000.00,1,2,4),(6,'Invalid Event','2025-09-10','Unknown Location','This event violates policy and is hidden.',50.00,10000.00,0.00,0,1,1),(7,'Autumn Fun Run','2025-09-25','West Park','A 3km fun run for senior citizens. Funds go to elderly care.',15.00,20000.00,8000.00,1,1,1),(8,'Charity Auction Night','2025-09-18','City Convention Center','A live auction with luxury items. Proceeds support medical aid.',100.00,80000.00,45000.00,1,1,3),(9,'Eco-Gala Dinner','2025-09-28','Eco Hotel','A green-themed gala to promote sustainable living.',120.00,60000.00,30000.00,1,2,2),(10,'Children\'s Concert','2025-09-12','Children\'s Palace','A concert for kids to raise funds for children\'s hospitals.',30.00,40000.00,22000.00,1,1,4);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-05 19:13:12
