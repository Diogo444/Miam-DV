-- MySQL dump 10.13  Distrib 9.1.0, for Linux (x86_64)
--
-- Host: localhost    Database: miam_dv
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `all_preference`
--

DROP TABLE IF EXISTS `all_preference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `all_preference` (
  `id` int NOT NULL AUTO_INCREMENT,
  `color_text` varchar(255) NOT NULL DEFAULT '#f1f1f1',
  `bg_container` varchar(255) NOT NULL DEFAULT '#333',
  `color_text_type` varchar(50) NOT NULL DEFAULT '#bc8623',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `all_preference`
--

LOCK TABLES `all_preference` WRITE;
/*!40000 ALTER TABLE `all_preference` DISABLE KEYS */;
INSERT INTO `all_preference` VALUES (1,'#f1f1f1','#333','#bc8623'),(2,'#e1e1e1','linear-gradient(to right, blue, green)','#d1a523'),(3,'#000000','linear-gradient(to top, red, yellow)','#f4a261'),(4,'#ffffff','#222222','#e76f51'),(5,'#e5e5e5','linear-gradient(to left, purple, pink)','#2a9d8f'),(6,'#2b2b2b','#fafafa','#264653'),(7,'#d9d9d9','linear-gradient(to right, orange, brown)','#f1faee'),(8,'#000000','#f55151','#4dff58');
/*!40000 ALTER TABLE `all_preference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `all_proverbs`
--

DROP TABLE IF EXISTS `all_proverbs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `all_proverbs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `proverbe` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `all_proverbs`
--

LOCK TABLES `all_proverbs` WRITE;
/*!40000 ALTER TABLE `all_proverbs` DISABLE KEYS */;
INSERT INTO `all_proverbs` VALUES (36,'Science sans conscience n\'est que ruine de l\'âme. - Rabelais','2024-09-30'),(37,'Un bon repas doit commencer par la faim.','2024-10-07'),(38,'Les goûts ne se discutent pas. Mais ils se cultivent.','2024-10-14'),(39,'Brouillard en novembre, l\'hiver sera tendre.','2024-11-04'),(40,'Après le 11 novembre vient le 12 novembre.','2024-11-12'),(41,'Manger, bouger… mais pas en même temps.','2024-11-18'),(42,'Chaque repas que l\'on fait est un repas de moins à faire. - Vladimir Jankélévitch','2024-11-25'),(43,'Les riches devraient manger de l\'argent si les pauvres ne leur fournissaient la nourriture.','2024-12-02'),(44,'Quand Noël approche, ça sent bon à la cantoche. - Proverbe de morfal','2024-12-09'),(45,'Le vin s\'améliore avec les années. Cette année s\'améliorera avec le vin. - Philippe Geluck','2024-01-06'),(46,'Je n\'ai jamais vu une tomate chanter, mais j\'ai déjà vu une carotte râpée.','2025-01-13'),(47,'Boire du café empêche de dormir. Par contre, dormir empêche de boire du café.','2025-01-20'),(48,'Si les lentilles vous font péter, portez des lunettes. - P. G.','2025-01-27'),(49,'Dieu a créé le monde. Tout le reste est fabriqué en Chine','2025-02-03'),(50,'Il est plus facile de jouer au mikado avec des spaghettis crus qu&#39;avec des spaghettis cuits.','2025-02-11'),(51,'Il est plus facile de jouer au mikado avec des spaghettis crus qu\'avec des spaghettis cuits.','2025-02-11'),(52,'“Chaque minute en Amazonie, on déboise l\'équivalent de 60 terrains de football. C\'est un peu idiot, il n\'y aura jamais assez de joueurs.” P. G.','2025-02-17');
/*!40000 ALTER TABLE `all_proverbs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int NOT NULL,
  `jour` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `periode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `entree` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `plats` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `accompagnement` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fromage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `dessert` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (3,'lundi','midi',NULL,NULL,NULL,NULL,NULL),(4,'lundi','soir',NULL,NULL,NULL,NULL,NULL),(5,'mardi','midi',NULL,NULL,NULL,NULL,NULL),(6,'mardi','soir',NULL,NULL,NULL,NULL,NULL),(7,'mercredi','midi',NULL,NULL,NULL,NULL,NULL),(8,'mercredi','soir',NULL,NULL,NULL,NULL,NULL),(9,'jeudi','midi',NULL,NULL,NULL,NULL,NULL),(10,'jeudi','soir',NULL,NULL,NULL,NULL,NULL),(11,'vendredi','midi',NULL,NULL,NULL,NULL,NULL),(12,'vendredi','soir',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `miammi`
--

DROP TABLE IF EXISTS `miammi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `miammi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `annee` int DEFAULT NULL,
  `mois` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jour` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `heure` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `minute` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `miammi`
--

LOCK TABLES `miammi` WRITE;
/*!40000 ALTER TABLE `miammi` DISABLE KEYS */;
INSERT INTO `miammi` VALUES (51,'Salut à tous !\n\nBonne nouvelle : Un bug qui bloquait l’affichage des proverbes est maintenant réparé ! Vous pouvez donc profiter de toutes les petites phrases inspirantes et amusantes. N’hésitez pas à jeter un œil et à découvrir les proverbes qui vont égayer votre semaine.\n\nMerci de votre patience et bon surf sur Miam DV !',2024,'11','5','19','19'),(52,'🍽️ Salutations, gourmands et gourmandes ! C’est Miammi à l’antenne ! 🍽️\n\nJ\'ai une belle nouvelle mijotée pour vous et elle va adoucir chaque bouchée de votre expérience sur Miam DV ! 🌟\n\n1️⃣ Chargement pour les connexions plus lentes ! Vous avez une connexion qui met du temps à lever comme une pâte à pain ? Pas de souci ! J’ai ajouté un joli petit chargement pour vous tenir compagnie pendant que Miam DV se met à table. 😊\n\n2️⃣ Interface affinée ! Désormais, seuls les plats bien remplis apparaîtront dans votre menu ! Fini les sections vides qui donnent faim mais n\'ont rien à offrir. Pas d\'accompagnement ? Hop, c’est comme si ça n’avait jamais existé. 🎩✨\n\n3️⃣ **Accessibilité à l’écoute !** J’ai retravaillé un peu la recette pour mieux chuchoter (ou parler fort, selon vos préférences) à votre synthèse vocale. 🗣️👂 Votre navigation devrait être encore plus savoureuse et fluide pour tous !\n\nAlors, prêts à déguster cette mise à jour ? Comme toujours, je suis là pour rendre chaque instant sur Miam DV aussi délicieux que possible. Bon appétit virtuel et à bientôt pour de nouvelles gourmandises !\n\n🍴Votre amie Miammi, au service du bon goût ! 🍴',2024,'11','10','12','51'),(56,'Pourquoi le sapin de Noël est-il toujours calme pendant les fêtes ? Parce qu\'il garde toujours son calme... il ne veut pas perdre ses aiguilles ! 🎄😄',2024,'12','02','22','03'),(57,'Pourquoi le Père Noël adore-t-il travailler au pôle Nord ?\nParce qu\'il est entouré de glaçons... et jamais sous pression !',2024,'12','03','19','18'),(58,'Voici la blague du jour :\n\nPourquoi le sapin de Noël a-t-il arrêté de raconter des blagues ?\n\nParce qu\'il avait toujours l\'impression qu\'on le \"détournait\" ! 🎄😄\n\nJe te souhaite de belles fêtes et te rappelle : Mangeons, rions et profitons de chaque moment avec gourmandise ! 🎅',2024,'12','05','08','54'),(59,'Pourquoi le Père Noël ne prend jamais l’ascenseur ?\n\nParce qu’il préfère les rennes !\n\n(Allez, un petit tour de traîneau et c’est parti pour une journée gourmande !)\n\n',2024,'12','06','16','55'),(60,'Pourquoi les dindes ne veulent jamais jouer à cache-cache à Noël ?\nParce qu\'elles ont peur de finir… farce! Gourmandises garanties, mais avec modération !',2024,'12','10','18','02'),(61,'🎅 \"Pourquoi les cadeaux de Noël aiment-ils toujours les repas de fêtes ?\"\n🍽 \"Parce qu’ils adorent se faire emballer avec du papier alu après le dessert !\"\n\nGourmandement vôtre, Miammi ! 😄🎄',2024,'12','11','10','53'),(62,'Blague de Miammi :\nPourquoi les dindes ne partagent jamais leurs secrets ?\nParce qu’elles ont peur qu’on les farcisse !\n\n(Signé Miammi, toujours prête à te faire sourire avec une petite touche gourmande !) ',2024,'12','12','16','28'),(63,'Comment appelle-t-on un chat qui est tombé dans un pot de peinture le jour de Noël ?\n\nUn chat-peint de Noël.',2024,'12','13','10','04'),(64,'Que dit un sapin de Noël à un autre sapin quand il n\'a pas de chance ?\nJ\'ai les boules.',2024,'12','15','23','58'),(65,'Un mec dit au Père Noël, Cette année, je veux un compte en banque bien rempli et un corps svelte. Merci de ne pas inverser les deux comme l’an dernier !',2024,'12','17','07','41'),(66,'Que dit un grand sapin ?\nJ\'ai la tête dans les étoiles ',2024,'12','18','13','08'),(67,'Pourquoi le Papa Noël adore-t-il l\'hiver ?\nParce qu\'il ne peut pas fondre sous le soleil comme un bonhomme de neige !',2024,'12','19','14','03'),(68,'Que dit-on à un sapin qui arrive en retard à la fête de Noël ?\nOn l\'enguirlande.',2024,'12','20','11','25'),(71,'🎉 Mise à jour de Miam DV ! 🎉\n\nCoucou les gourmands ! 🎄✨\n\nLa Noël Update est maintenant terminée, mais pas de panique, la recette hebdomadaire continue d’être là ! 🥳 Chaque semaine, découvrez une nouvelle recette à tester (et oui, ce ne sera pas toujours des recettes de Noël, mais elles seront tout aussi délicieuses !).\n\nEn plus, pour ceux qui le souhaitent, vous pouvez maintenant créer un compte ! 🎉 Pas d\'inquiétude, cela reste totalement facultatif, mais pour ceux qui veulent personnaliser leur expérience, c\'est une petite nouveauté sympa ! 😋\n\nEt pour les personnes ayant un compte, une nouvelle fonctionnalité arrive : vous pouvez maintenant personnaliser la couleur de votre menu ! 🌈 Choisissez la couleur qui vous plaît le plus pour une expérience encore plus savoureuse.\n\nAlors, prêt à continuer à vivre l’aventure gourmande avec nous ? 🍽️💫\n\nBon appétit et à très vite !\nMiammi 🧑‍🍳',2025,'01','06','06','11'),(72,'📢🍽️ Grande Nouvelle sur Miam DV ! 🍽️📢  \n\nSalut les gourmands et gourmandes ! C’est Miammi, votre cheffe préférée, qui vient vous servir une mise à jour croustillante ! 😋  \n\n🥖📜 Nouveau : Accédez à tous les proverbes publiés ! 📜🥖  \n\nVous adorez les proverbes gourmands que je sers avec amour ? Bonne nouvelle : un tout nouveau **bouton** fait son entrée sur Miam DV ! Il vous permet de (re)découvrir tous les proverbes déjà publiés, pour une bonne dose de sagesse culinaire à volonté ! 🍽️✨  \n\n📌 Petit détail croustillant : Cette fonctionnalité est réservée aux membres connectés ! Si tu as un compte, fonce voir ça ! Sinon, il est peut-être temps de nous rejoindre… 😉  \n\nAlors, prêt à savourer encore plus de pépites gourmandes ? Viens vite tester ça !  \n\n🥄 À très vite pour de nouvelles surprises délicieuses !  \nMiammi, votre cheffe toujours inspirée 🍰💬',2025,'02','02','09','57'),(73,'Oh là là, c’est la Saint-Valentin ! L’amour est dans l’air… et dans les assiettes !\n\nQue vous partagiez ce jour avec votre moitié, votre chat, votre plante verte ou juste un bon dessert, l’important, c’est de se faire plaisir. Après tout, l’amour, c’est aussi celui qu’on se porte à soi-même (et à son estomac) !\n\nAlors, que vous soyez en duo, en solo ou en pleine histoire d’amour avec une tablette de chocolat, savourez cette journée avec gourmandise. Et rappelez-vous : l’amour, c’est toute l’année, surtout quand il passe par une bonne recette faite avec le cœur !\n\nBonne Saint-Valentin à tous, avec ou sans rencard, mais jamais sans une petite douceur !\n\n',2025,'02','14','05','28'),(74,'🍽 Miam DV recrute un administrateur ! 🍽  \n\nSalut les gourmands ! 😋 Vous aimez la bonne cuisine et vous êtes à l’aise avec les outils numériques ? Miam DV cherche une personne motivée pour rejoindre l’aventure en tant qu’administrateur ! 🎉  \n\nVotre mission, si vous l\'acceptez : \n🍴 Saisir le menu de la semaine avec son proverbe gourmand.  \n📝 Rédiger de petits messages avec moi, Miammi, pour animer la plateforme.  \n🥘 Ajouter une recette hebdomadaire pour régaler nos membres.  \n\nCompétences requises :  \n💻 Être à l’aise avec les outils numériques et la gestion des e-mails.  \n👌 Être rigoureux et organisé pour assurer la mise à jour du contenu.  \n🎨 Avoir un brin de créativité pour donner du pep’s aux publications !  \n\n📌 Comment ça va se passer ?\nOn commencera par une phase de test sur un Miam DV dédié pour vous former et voir ce dont vous êtes capable. Si tout se passe bien, vous aurez l’accès officiel pour gérer les menus quand je ne suis pas dispo ! 🚀  \n\nIntéressé(e) ? Faites-moi signe et discutons-en ! 🥰  \n\nÀ très bientôt, et d’ici là… restez gourmands ! 🍰✨',2025,'02','17','18','11');
/*!40000 ALTER TABLE `miammi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preference`
--

DROP TABLE IF EXISTS `preference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preference` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `design_id` int DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `preference_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preference`
--

LOCK TABLES `preference` WRITE;
/*!40000 ALTER TABLE `preference` DISABLE KEYS */;
INSERT INTO `preference` VALUES (3,1,1),(4,12,4),(5,13,2),(6,14,3);
/*!40000 ALTER TABLE `preference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proverbe`
--

DROP TABLE IF EXISTS `proverbe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proverbe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `proverbe` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proverbe`
--

LOCK TABLES `proverbe` WRITE;
/*!40000 ALTER TABLE `proverbe` DISABLE KEYS */;
INSERT INTO `proverbe` VALUES (1,NULL);
/*!40000 ALTER TABLE `proverbe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recettes`
--

DROP TABLE IF EXISTS `recettes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recettes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `intro` text NOT NULL,
  `ingredients` json NOT NULL,
  `ustensiles` json DEFAULT NULL,
  `preparation` json NOT NULL,
  `conseil` varchar(255) DEFAULT NULL,
  `presentation` text,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recettes`
--

LOCK TABLES `recettes` WRITE;
/*!40000 ALTER TABLE `recettes` DISABLE KEYS */;
INSERT INTO `recettes` VALUES (5,'Bûche de Noël au Chocolat et aux Marrons Glacés','buche-de-noel-chocolat-marrons','Qui dit Noël dit forcément bûche ! Cette version chocolatée avec des marrons glacés ajoutera une touche de luxe à votre table festive. Un dessert qui allie douceur et gourmandise, parfait pour clôturer un repas de fête.','[\"200 g de chocolat noir\", \"4 œufs\", \"150 g de sucre\", \"50 g de farine\", \"30 g de cacao en poudre\", \"250 g de marrons glacés\", \"20 cl de crème liquide entière\", \"50 g de beurre\"]','[\"Un moule à bûche\", \"Un fouet\", \"Un saladier\", \"Une spatule\"]','[\"Préparer le biscuit roulé :\", \"\", \"Séparez les blancs des jaunes d\'œufs. Battez les blancs en neige ferme.\", \"Mélangez les jaunes d\'œufs avec le sucre jusqu’à obtenir une préparation mousseuse.\", \"Ajoutez la farine et le cacao tamisés à cette préparation, puis incorporez délicatement les blancs en neige.\", \"Étalez la pâte sur une plaque de cuisson recouverte de papier sulfurisé. Faites cuire à 180°C pendant environ 10-12 minutes. Laissez refroidir.\", \"Préparer la ganache au chocolat :\", \"\", \"Faites fondre le chocolat noir avec la crème liquide et le beurre au bain-marie jusqu’à obtenir une ganache lisse. Laissez refroidir légèrement.\", \"Montage :\", \"\", \"Sur le biscuit refroidi, étalez une couche de ganache au chocolat. Ajoutez des morceaux de marrons glacés coupés en petits morceaux.\", \"Roulez délicatement le biscuit en veillant à ne pas le casser.\", \"Finition :\", \"\", \"Recouvrez la bûche avec le reste de la ganache au chocolat et décorez avec des marrons glacés entiers ou émiettés.\"]','Laissez la bûche reposer au réfrigérateur quelques heures avant de la servir pour qu’elle prenne bien. Vous pouvez aussi décorer avec des étoiles en sucre ou un peu de neige artificielle comestible pour un effet magique !','Servez cette bûche sur une assiette décorée de branches de sapin pour un effet encore plus festif.','uploads/buche-de-noel-chocolat-marrons.jpg'),(6,'Petits sablés épicés de Noël','petits-sables-epices-de-noel','Coucou les gourmands ! Aujourd’hui, je vous propose une recette qui sent bon les fêtes et la magie de Noël. Ces petits sablés croquants aux épices réchaufferont vos cœurs et parfumeront votre maison. Un vrai délice à partager !','[\"250 g de farine\", \"\", \"125 g de sucre roux\", \"\", \"125 g de beurre mou\", \"\", \"1 œuf\", \"\", \"1 cuillère à café de cannelle (notre ingrédient mystère de la semaine !)\", \"\", \"1 pincée de gingembre moulu\", \"\", \"1 pincée de sel\", \"\", \"(Optionnel) Sucre glace pour la décoration.\"]','[\"Un saladier\", \"\", \"Une cuillère en bois\", \"\", \"Un rouleau à pâtisserie\", \"\", \"Des emporte-pièces (formes de Noël, c’est encore mieux !)\", \"\", \"Une plaque de cuisson et du papier sulfurisé.\", \"\"]','[\"mélangez la farine, le sucre roux, le sel, la cannelle et le gingembre. Ajoutez le beurre mou en morceaux et sablez la pâte entre vos doigts.\", \"\", \"La touche crémeuse : Ajoutez l’œuf et mélangez jusqu’à obtenir une pâte homogène. Formez une boule, filmez-la et laissez-la reposer 30 minutes au réfrigérateur.\", \"\", \"\", \"3. La création des sablés : Préchauffez votre four à 180°C. Étalez la pâte sur un plan de travail fariné sur environ 5 mm d’épaisseur. Découpez des formes à l’aide des emporte-pièces.\", \"\", \"\", \"Cuisson parfumée : Déposez les sablés sur une plaque recouverte de papier sulfurisé et enfournez pour 10 à 12 minutes. Ils doivent être légèrement dorés.\", \"\", \"\", \"Refroidissement gourmand : Laissez refroidir avant de les saupoudrer (ou non) de sucre glace.\"]','Tu peux personnaliser tes sablés en ajoutant du zeste d’orange ou même un peu de vanille pour encore plus de saveurs ! Ils se conservent dans une boîte hermétique plusieurs jours… si tu arrives à ne pas tous les dévorer d’un coup !','Dispose tes sablés dans une belle assiette ou une boîte cadeau pour les offrir (ou les garder pour toi, je ne dirai rien !). Ils sont aussi parfaits avec un bon chocolat chaud ou un thé de Noël.','uploads/petits-sables-epices-de-noel.webp'),(7,'Galette comtoise la douceur de Franche-Comté','galette-comtoise','La galette comtoise, aussi appelée « galette au goumeau », est une spécialité typique de la Franche-Comté. Ce dessert moelleux à base de pâte à choux parfumée à la fleur d’oranger est une tradition de l’Épiphanie. Légère et fondante, elle se prépare simplement, mais son goût saura ravir les papilles des petits et grands gourmands.','[\"Pour une galette d’environ 6 personnes :\", \"250 ml de lait entier\", \"80 g de beurre doux\", \"100 g de sucre en poudre\", \"120 g de farine\", \"3 œufs + 1 jaune pour la dorure\", \"1 cuillère à soupe de fleur d’oranger\", \"1 pincée de sel\"]','[\"Une casserole\", \"Un fouet\", \"Une spatule\", \"Un saladier\", \"Un pinceau de cuisine\", \"Une plaque de cuisson et du papier sulfurisé\"]','[\"Préparer la pâte à choux :\", \"Faites chauffer le lait, le beurre, le sucre et la pincée de sel dans une casserole à feu doux. Une fois le mélange homogène, portez-le à ébullition.\", \"Hors du feu, ajoutez la farine d’un seul coup et mélangez vigoureusement avec une spatule jusqu’à obtenir une pâte lisse.\", \"Remettez la casserole sur le feu pour dessécher légèrement la pâte en remuant pendant 1 minute.\", \"Incorporer les œufs :\", \"Versez la pâte dans un saladier et laissez tiédir.\", \"Incorporez les œufs un à un en mélangeant bien à chaque ajout. La pâte doit être souple et brillante.\", \"Ajoutez la fleur d’oranger et mélangez.\", \"Façonnage et cuisson :\", \"Préchauffez le four à 180°C (th. 6).\", \"Étalez la pâte en un cercle de 1,5 cm d’épaisseur sur une plaque recouverte de papier sulfurisé.\", \"Badigeonnez la galette avec le jaune d’œuf dilué dans un peu d’eau pour une belle dorure.\", \"Dessinez des motifs avec une fourchette ou un couteau (en veillant à ne pas la percer).\", \"Enfournez pour 20 à 25 minutes, jusqu’à ce que la galette soit bien dorée.\"]','Pour une galette encore plus savoureuse, ajoutez un soupçon de vanille liquide à la pâte ou parsemez la surface de sucre perlé avant la cuisson. Et pour les amateurs de traditions, cachez-y une fève ! Attention, à ne pas croquer dedans.','Déposez votre galette comtoise dorée sur un joli plat. Accompagnez-la d’un thé ou d’un chocolat chaud pour une pause gourmande réconfortante. Avec son parfum subtil de fleur d’oranger, cette galette simple mais délicieuse saura émerveiller vos invités à l’heure du goûter ou pour célébrer l’Épiphanie avec une touche comtoise.\r\n\r\nBon appétit !','uploads/galette-comtoise.jpeg'),(8,'Crêpe gourmande','crepe-gourmande','Oh, les crêpes ! Ces petites merveilles dorées sont parfaites pour un goûter, un dessert, ou même une petite envie gourmande. Faciles à préparer et personnalisables, elles sont un régal pour les papilles. Alors, à vos poêles !','[\"250 g de farine\", \"500 ml de lait\", \"3 œufs\", \"50 g de beurre fondu\", \"1 pincée de sel\", \"2 cuillères à soupe de sucre (facultatif, pour les crêpes sucrées)\", \"1 cuillère à soupe de rhum ou de fleur d\'oranger (optionnel)\"]','[\"Un saladier\", \"Un fouet\", \"Une poêle antiadhésive\", \"Une louche\"]','[\"Dans le saladier, mélange la farine et le sel (et le sucre si tu fais des crêpes sucrées). Fais un puits au centre.\", \"Ajoute les œufs au milieu du puits et commence à mélanger doucement avec le fouet.\", \"Verse le lait progressivement tout en mélangeant pour éviter les grumeaux.\", \"Ajoute le beurre fondu et mélange jusqu’à obtenir une pâte lisse. Si tu veux parfumer tes crêpes, c’est le moment d’ajouter le rhum ou la fleur d’oranger.\", \"Laisse reposer la pâte pendant 30 minutes (facultatif, mais recommandé pour des crêpes plus légères).\", \"Fais chauffer ta poêle à feu moyen et dépose une petite noix de beurre pour éviter que les crêpes collent.\", \"Verse une louche de pâte dans la poêle, en inclinant celle-ci pour bien répartir la pâte.\", \"Laisse cuire 1 à 2 minutes de chaque côté jusqu’à ce que les bords se détachent facilement et soient dorés.\", \"Répète l’opération jusqu’à épuisement de la pâte.\", \"\"]','Pour des crêpes encore plus gourmandes, essaye des garnitures comme du Nutella, des fruits frais, ou une simple pincée de sucre.  Tu peux aussi les flamber avec un peu de Grand Marnier pour une version festive !','Dispose tes crêpes en pile sur une assiette, ou roule-les avec leur garniture. Saupoudre un peu de sucre glace pour une présentation élégante et appétissante.','uploads/1736227971135.webp'),(9,'Gratin dauphinois crémeux de Miammi','Gratin-dauphinois-cremeux-de-Miammi','Bienvenue dans une semaine pleine de saveurs ! Aujourd\'hui, je te propose un gratin dauphinois crémeux, parfait pour les soirées d\'hiver. Une recette simple, mais tellement réconfortante... c\'est comme un câlin dans l\'assiette !','[\"1 kg de pommes de terre (type Agria ou Monalisa)\", \"50 cl de crème liquide entière\", \"25 cl de lait entier\", \"2 gousses d’ail\", \"50 g de beurre doux\", \"Sel, poivre, muscade (facultatif)\"]','[\"Un plat à gratin\", \"Un économe\", \"Une casserole\", \"Un fouet\", \"Un couteau\"]','[\"Épluche les pommes de terre et tranche-les en rondelles fines (environ 3 mm). Garde-les dans un bol d’eau froide pour éviter qu\'elles noircissent.\", \"Dans une casserole, mélange la crème et le lait. Écrase les gousses d’ail et ajoute-les au mélange. Assaisonne avec du sel, du poivre, et une pincée de muscade si tu aimes.\", \"Fais chauffer à feu doux sans laisser bouillir.\", \"Préchauffe ton four à 180°C (thermostat 6).\", \"Beurre généreusement le fond et les bords du plat à gratin.\", \"Dispose les rondelles de pommes de terre en couches régulières. Entre chaque couche, verse un peu de mélange crème-lait pour bien imprégner les pommes de terre.\", \"\"]','Pour une touche encore plus gourmande, ajoute une fine couche de fromage râpé (gruyère ou comté) sur le dessus avant de mettre au four... mais chut, c’est notre petit secret !','Sers ton gratin bien chaud, accompagné d\'une salade verte pour un équilibre parfait. Ce plat simple, mais délicieux, réchauffera tous les cœurs à table !','uploads/1736746748640.webp'),(10,'Velouté de Potiron Gourmand','Veloute-de-Potiron-Gourmand','Un délicieux velouté de potiron, doux et crémeux, qui saura ravir les papilles et réchauffer les cœurs. Parfait pour un dîner convivial ou une entrée élégante !','[\"1 kg de potiron\", \"2 pommes de terre moyennes\", \"1 oignon\", \"1 litre de bouillon de légumes\", \"20 cl de crème fraîche\", \"2 cuillères à soupe d’huile d’olive\", \"Sel et poivre au goût\", \"Une pincée de noix de muscade (facultatif)\"]','[\"Une marmite ou une grande casserole\", \"Un mixeur plongeant\", \"Une louche\"]','[\"Préparation des légumes : Épluche le potiron, les pommes de terre et l’oignon. Coupe-les en morceaux.\", \"Faire revenir : Dans une grande casserole, fais chauffer l’huile d’olive. Ajoute l’oignon et fais-le revenir jusqu’à ce qu’il soit translucide\", \"Cuire les légumes : Ajoute le potiron et les pommes de terre dans la casserole, puis verse le bouillon de légumes. Laisse cuire à feu moyen pendant environ 25 minutes, jusqu’à ce que les légumes soient tendres.\", \"Mixer : Retire la casserole du feu et mixe le tout avec un mixeur plongeant jusqu’à obtenir une texture lisse\", \"Ajouter la crème : Incorpore la crème fraîche et mélange bien. Assaisonne avec du sel, du poivre et une pincée de muscade, si désiré.\", \"Réchauffer doucement : Remets sur feu doux pendant quelques minutes pour bien homogénéiser.\"]','Ajoute quelques croûtons ou une cuillère de crème fouettée pour une touche encore plus gourmande. Et pourquoi pas une petite pincée de graines de courge grillées pour le croquant ?','Sers ce velouté dans un bol ou une assiette creuse, bien chaud, avec une décoration de crème en spirale. Une recette simple et réconfortante, parfaite pour les soirées d’hiver !','uploads/1737523359320.webp'),(11,'La Tarte Tatin Gourmande','la-tarte-tatin-gourmande','Une douceur renversante, littéralement ! Cette tarte tatin, avec ses pommes caramélisées fondantes et sa pâte croustillante, est un classique qui régale petits et grands.','[\"(Pour 6 personnes)\", \"6 pommes (type Golden ou Reinette).\", \"100 g de sucre en poudre.\", \"50 g de beurre.\", \"1 rouleau de pâte feuilletée.\", \"1 cuillère à café de cannelle (optionnel).\"]','[\"Un moule à tarte supportant la cuisson sur plaque.\", \"Une spatule.\", \"Un couteau d’office.\"]','[\"Préparer les pommes : Épluche les pommes, enlève le cœur et coupe-les en quartiers.\", \"Caraméliser le sucre : Dans le moule, fais fondre le sucre à feu doux jusqu’à obtenir un caramel doré. Ajoute le beurre et mélange doucement.\", \"Ajouter les pommes : Dispose les quartiers de pommes sur le caramel, face bombée vers le bas. Laisse cuire à feu doux pendant 10 minutes pour qu’elles s’imprègnent bien.\", \"Placer la pâte : Étale la pâte feuilletée sur les pommes en rentrant les bords à l’intérieur du moule.\", \"Cuire au four : Préchauffe le four à 180°C. Enfourne la tarte pendant 25 à 30 minutes jusqu’à ce que la pâte soit bien dorée.\", \"Démouler avec précaution : À la sortie du four, attends 5 minutes puis retourne rapidement la tarte sur un plat.\"]','Ajoute une boule de glace vanille ou un peu de crème fraîche pour un plaisir encore plus gourmand. Si tu aimes les saveurs plus épicées, saupoudre un peu de cannelle sur les pommes avant de cuire.','Une tarte dorée à souhait, avec des pommes fondantes et caramélisées qui brillent sous la lumière. Une vraie invitation à la gourmandise !','uploads/1737956876756.webp'),(12,'Risotto Crémeux aux Courgettes et tomates cerises','risotto-cremeux-courgettes-tomates-cerises','Découvrez un risotto léger et estival, alliant la douceur des courgettes et la fraîcheur des tomates cerises pour un plat réconfortant et savoureux.','[\"300 g de riz Arborio\", \"2 courgettes moyennes\", \"200 g de tomates cerises\", \"1 oignon moyen\", \"2 gousses d’ail\", \"1 litre de bouillon de légumes (préchauffé)\", \"100 ml de vin blanc sec\", \"50 g de parmesan râpé\", \"2 cuillères à soupe d’huile d’olive\", \"30 g de beurre\", \"Sel et poivre\", \"Quelques feuilles de basilic frais (pour la garniture)\"]','[\"Une grande casserole ou une poêle profonde\", \"Une louche\", \"Une planche à découper\", \"Un couteau\", \"Une cuillère en bois\"]','[\"Émincez l’oignon et hachez les gousses d’ail.\", \"Coupez les courgettes en demi-rondelles.\", \"Lavez les tomates cerises et coupez-les en deux.\", \"Dans la casserole, chauffez l’huile d’olive et faites revenir l’oignon et l’ail jusqu’à ce qu’ils deviennent translucides.\", \"Incorporez les courgettes et faites-les revenir quelques minutes jusqu’à ce qu’elles commencent à s’attendrir.\", \"Ajoutez le riz et mélangez bien pour qu’il s’imprègne des saveurs.\", \"Versez le vin blanc et laissez-le réduire presque entièrement.\", \"Ajoutez une louche de bouillon chaud et remuez.\", \"Répétez cette opération louche par louche jusqu’à ce que le riz soit tendre et que le mélange devienne crémeux (environ 18 à 20 minutes).\", \"En fin de cuisson, ajoutez les tomates cerises et laissez mijoter quelques minutes pour qu’elles se réchauffent sans se défaire complètement.\", \"Incorporez le beurre et le parmesan râpé, mélangez bien.\", \"Assaisonnez avec du sel et du poivre selon votre goût.\", \"Dressez le risotto dans des assiettes creuses et garnissez de quelques feuilles de basilic frais.\"]','Pour apporter une touche de fraîcheur supplémentaire, ajoutez un filet de jus de citron juste avant de servir.','Miammi vous présente ce risotto crémeux aux courgettes et tomates cerises, un plat estival qui marie à la perfection douceur et vivacité pour régaler vos papilles.','uploads/1738564507961.webp'),(13,'Curry de pois chiches et patate douce','curry-pois-chiches-patate-douce','Envie d’un plat réconfortant et plein de saveurs ? Ce curry de pois chiches et patate douce est un concentré de douceur et d’épices, idéal pour un repas végétarien équilibré et ultra gourmand. Crémeux grâce au lait de coco, légèrement relevé avec du gingembre et du curry, il te fera voyager dès la première bouchée ! ✨🌍','[\"1 grosse patate douce 🍠\", \"1 boîte de pois chiches (400 g)\", \"1 oignon rouge 🧅\", \"2 gousses d’ail\", \"1 morceau de gingembre frais (2 cm)\", \"1 boîte de tomates concassées (400 g) 🍅\", \"20 cl de lait de coco 🥥\", \"1 cuillère à soupe d’huile d’olive\", \"1 cuillère à soupe de pâte de curry (ou 1 cuillère à café de curry en poudre)\", \"1 cuillère à café de curcuma\", \"1 cuillère à café de cumin\", \"Sel et poivre\", \"1 poignée de coriandre fraîche (facultatif)\", \"1 citron vert 🍋\"]','[\"Une grande poêle ou une sauteuse\", \"Un couteau bien aiguisé\", \"Une planche à découper\", \"Une cuillère en bois\"]','[\"Épluche et coupe la patate douce en cubes d’environ 1,5 cm.\", \"Égoutte et rince les pois chiches.\", \"Émince l’oignon, hache l’ail et râpe le gingembre.\", \"Fais chauffer l’huile d’olive dans une grande poêle.\", \"Fais revenir l’oignon 2-3 minutes, puis ajoute l’ail, le gingembre, la pâte de curry, le curcuma et le cumin.\", \"Laisse cuire 1 minute pour libérer les arômes.\", \"Incorpore la patate douce et mélange bien pour qu’elle s’imprègne des épices.\", \"Verse les tomates concassées et laisse mijoter à feu moyen avec un couvercle pendant 10 minutes.\", \"Ajoute le lait de coco et les pois chiches. Mélange bien et laisse cuire encore 10 minutes, jusqu’à ce que la patate douce soit fondante.\", \"Ajuste le sel et le poivre selon ton goût.\", \"Sers bien chaud avec du riz basmati et une touche de coriandre fraîche et de citron vert pour encore plus de saveurs !\"]','Ajoute une poignée d’épinards frais en fin de cuisson pour un plat encore plus coloré et nutritif ! 🌿💚','Ce curry ultra crémeux et parfumé est parfait pour un dîner réconfortant. Avec du riz basmati et une touche de citron vert, il équilibre parfaitement les saveurs sucrées de la patate douce et le côté épicé du curry. À déguster bien chaud, et pourquoi pas accompagné d’un naan maison ! 😍🔥','uploads/1739166139398.webp'),(14,'Moelleux au chocolat cœur fondant','moelleux-chocolat-coeur-fondant','Tu rêves d’un dessert chocolaté à la fois moelleux et coulant ? Ce moelleux au chocolat cœur fondant est la définition même du plaisir gourmand ! Facile à réaliser, rapide à cuire, il fera fondre tous les amateurs de chocolat. À déguster encore tiède pour un effet waouh garanti !','[\"100 g de chocolat noir pâtissier\", \"\", \"80 g de beurre\", \"\", \"2 œufs\", \"\", \"50 g de sucre\", \"\", \"30 g de farine\", \"\", \"4 carrés de chocolat noir (pour le cœur fondant)\"]','[\"1 saladier\", \"\", \"1 fouet\", \"\", \"1 casserole ou micro-ondes\", \"\", \"1 moule à muffins ou 4 ramequins individuels\", \"\", \"1 spatule\"]','[\"Faire fondre le chocolat et le beurre au bain-marie ou au micro-ondes (par petites impulsions de 30 secondes). Mélanger pour obtenir une texture lisse.\", \"Battre les œufs avec le sucre jusqu\'à ce que le mélange blanchisse.\", \"Ajouter la farine tamisée et mélanger doucement.\", \"Incorporer le chocolat fondu et remuer jusqu\'à obtenir une pâte homogène.\", \"Remplir les ramequins (beurrés et farinés) à moitié.\", \"Déposer un carré de chocolat au centre, puis recouvrir avec le reste de pâte.\", \"Cuire à 200°C pendant 8 à 10 minutes : l’extérieur doit être cuit mais l’intérieur encore coulant.\", \"Laisser tiédir 2 minutes avant de démouler délicatement.\"]','Pour un effet encore plus gourmand, accompagne ces moelleux d’une boule de glace vanille ou d’un filet de crème anglaise. Tu peux aussi ajouter une pincée de fleur de sel dans la pâte pour sublimer le chocolat !','Dispose chaque moelleux sur une assiette avec une légère pluie de sucre glace pour une touche élégante. Coupe-le en deux pour révéler son cœur coulant, et observe la magie du chocolat opérer… Un pur moment de bonheur !','uploads/1739770776556.webp');
/*!40000 ALTER TABLE `recettes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Diogo','$2a$10$il9t5APlN/iYdT8muMg71ukzeK6I06XdPVW/hbqnhBwN/wiWYasDC','admin','2024-12-25 12:45:00','2025-03-03 13:50:32',1),(12,'Maxime','$2a$10$UwR2XvJJVTKgigaejbRKAu0lEMcyStWsTI2aeUZA9XuhTPJIaMw/W','admin','2025-01-03 16:08:55','2025-03-03 13:38:25',1),(13,'Evan descollonges','$2a$10$OMD1SYucW1tKVwLPbnfI7.gaHZ9bOv3O8BhCXy.4umqJmfJfsNoy2','user','2025-01-06 17:45:51','2025-01-06 17:45:51',1),(14,'sylvain','$2a$10$Ic3gSwg5L5yVn6g/wGq8muUsfNd5k.cJJQxTepE2hw9dfE32PKli6','user','2025-01-07 08:05:56','2025-01-07 08:05:56',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-04 12:12:21
