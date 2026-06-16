-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: web
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB

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
-- Dumping data for table `ct_danhmuc`
--

LOCK TABLES `ct_danhmuc` WRITE;
/*!40000 ALTER TABLE `ct_danhmuc` DISABLE KEYS */;
INSERT INTO `ct_danhmuc` VALUES ('1593b912-57df-466a-8484-5970b1863d72','501f1662-ef89-4fa4-9029-94279c8d4db8','Mô hình nhà','2025-04-02 01:23:01','2025-04-02 01:23:01'),('298f9ea9-3d32-45a6-8551-9e309b7943c6','a5b855c8-3b37-461e-ba18-62260bb769c8','Dụng cụ nhà tắm','2025-04-02 01:21:19','2025-04-02 01:21:19'),('36fbe4b1-77d3-4300-b7a1-ece8bd4559c9','501f1662-ef89-4fa4-9029-94279c8d4db8','Đồ chơi xếp hình','2025-04-02 01:23:01','2025-04-02 01:23:01'),('4c18bed3-988b-4be6-927b-bed5670c1072','a5b855c8-3b37-461e-ba18-62260bb769c8','Đồ gia dụng','2025-04-02 01:21:19','2025-04-02 01:21:19'),('54240ddb-0f71-454a-8f9d-cb6c7f1809a7','a1c5b2c7-8204-4de8-b22a-de9c968f5183','Hoa','2025-03-30 15:10:46','2025-03-30 15:10:46'),('598b80c1-c62d-46dc-bcd7-4b4a672c719d','afe3df66-f58b-468d-924a-2c44c1844e02','Túi du lịch','2025-04-02 01:23:45','2025-04-02 01:23:45'),('6100dfcd-6ec5-4e68-837c-d8b21907f1b5','d4d417de-9636-4095-a3b5-19b7f0e17fa6','Chăn mềm','2025-04-02 01:19:34','2025-04-02 01:19:34'),('688a182f-80e4-45bd-b863-328ae4ff02da','afe3df66-f58b-468d-924a-2c44c1844e02','Tag valy','2025-04-02 01:23:45','2025-04-02 01:23:45'),('8ac011b3-c009-4375-9f97-c3b47726991c','a1c5b2c7-8204-4de8-b22a-de9c968f5183','Phụ kiện gói quà','2025-03-30 15:10:46','2025-03-30 15:10:46'),('95be11a4-da31-4231-b34a-eacbac8a1213','d4d417de-9636-4095-a3b5-19b7f0e17fa6','Gấu bông idol','2025-04-02 01:19:34','2025-04-02 01:19:34'),('9953de54-ba91-4fc8-bf80-df3b3026216e','a1c5b2c7-8204-4de8-b22a-de9c968f5183',' Set quà yêu thương','2025-03-30 15:10:46','2025-03-30 15:10:46'),('ae82157c-617b-4c46-9398-e542a7955b42','d4d417de-9636-4095-a3b5-19b7f0e17fa6','Gấu bông khác','2025-04-02 01:19:34','2025-04-02 01:19:34'),('cc8a58b1-3404-471a-8945-c60e6eb0c324','d4d417de-9636-4095-a3b5-19b7f0e17fa6','Gấu bông cute','2025-04-02 01:19:34','2025-04-02 01:19:34'),('d25d9b8a-ca2f-491e-bbcc-58c481f5940b','a5b855c8-3b37-461e-ba18-62260bb769c8','Dụng cụ nhà bếp','2025-04-02 01:21:19','2025-04-02 01:21:19'),('edb6e775-1a6b-4768-9c85-f050417db9be','501f1662-ef89-4fa4-9029-94279c8d4db8','Tranh tô màu','2025-04-02 01:23:01','2025-04-02 01:23:01'),('f33e6960-3123-4e6c-835f-4b40e76804a7','d4d417de-9636-4095-a3b5-19b7f0e17fa6','Gối chữ U','2025-04-02 01:19:34','2025-04-02 01:19:34'),('fa1fdf03-dcb2-4f1f-876b-fec3d637249a','afe3df66-f58b-468d-924a-2c44c1844e02','Bọc hộ chiếu','2025-04-02 01:23:45','2025-04-02 01:23:45');
/*!40000 ALTER TABLE `ct_danhmuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ct_hoadonban`
--

LOCK TABLES `ct_hoadonban` WRITE;
/*!40000 ALTER TABLE `ct_hoadonban` DISABLE KEYS */;
INSERT INTO `ct_hoadonban` VALUES ('15333b97-e2dd-44c0-937e-c49b46388529','453f57c8-3564-4671-85f6-b7451942c1bc','01075179-a8fa-438a-93e1-24fba2617e96',5,170000,850000,'2025-04-02 02:36:55','2025-04-02 02:36:55'),('3f4af189-01bc-4be1-96ba-4ebb125ad508','b3641791-0c36-462b-9ba5-14cf74c8fb52','b0dc88a9-40d9-47fa-a15c-e1ab4b9d8142',5,120000,600000,'2025-04-01 06:56:04','2025-04-01 06:56:04'),('87fbd4ce-2cb4-4eed-8f82-31ac0e34421e','b3641791-0c36-462b-9ba5-14cf74c8fb52','1ec3c2a6-f1e7-4eac-bb7e-daad9484c2d7',5,200000,1000000,'2025-04-01 06:56:04','2025-04-01 06:56:04'),('fe8c6af9-416b-46f4-9ea3-9de725b22823','b3641791-0c36-462b-9ba5-14cf74c8fb52','a80d0522-000a-4ed8-bdd5-9840c297932a',5,150000,750000,'2025-04-01 06:56:04','2025-04-01 06:56:04');
/*!40000 ALTER TABLE `ct_hoadonban` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ct_hoadonnhap`
--

LOCK TABLES `ct_hoadonnhap` WRITE;
/*!40000 ALTER TABLE `ct_hoadonnhap` DISABLE KEYS */;
INSERT INTO `ct_hoadonnhap` VALUES ('0e12a4ce-7d07-4d32-beba-9a68ec0012cc','a9a5c2d5-c96f-4e6c-a715-b4cdb0ffb9bd','24eb884f-d1b6-4976-a95e-606b80bf983b',100,100000,10000000,'2025-04-02 01:45:06','2025-04-02 01:45:06'),('22a3bc97-37ba-40dd-bcfd-7e0e7b303a21','6703b2af-4c97-487c-9c0d-4281fa674382','24eb884f-d1b6-4976-a95e-606b80bf983b',100,100000,10000000,'2025-04-02 01:46:32','2025-04-02 01:46:32'),('34a2f09c-8175-4e6f-8359-30ad1300a9ff','a9a5c2d5-c96f-4e6c-a715-b4cdb0ffb9bd','ade7af2f-f9e4-431a-9920-3eea712a83e3',100,100000,10000000,'2025-04-02 01:45:06','2025-04-02 01:45:06'),('4b40d60f-cfc2-4ae1-8dda-3f0d593a3f13','6703b2af-4c97-487c-9c0d-4281fa674382','60ebfe8d-2d7f-4202-b476-d140b352b116',100,100000,10000000,'2025-04-02 01:46:32','2025-04-02 01:46:32'),('67497def-8fae-4128-84a9-1eb9fb4d7552','3a213bb2-0dcc-4a21-bda5-4604d94d8007','1ec3c2a6-f1e7-4eac-bb7e-daad9484c2d7',100,201000,20100000,'2025-03-30 15:34:22','2025-03-30 15:34:22'),('691ccf09-6eef-4e83-853d-df34e4fcafea','a9a5c2d5-c96f-4e6c-a715-b4cdb0ffb9bd','791a5c7b-a3ae-4006-b6ea-a6b096cea465',100,100000,10000000,'2025-04-02 01:45:06','2025-04-02 01:45:06'),('71437df1-d247-43df-9aa3-7a3b8ccad54a','a9a5c2d5-c96f-4e6c-a715-b4cdb0ffb9bd','60ebfe8d-2d7f-4202-b476-d140b352b116',100,100000,10000000,'2025-04-02 01:45:06','2025-04-02 01:45:06'),('738c266e-e6c1-43ce-948a-51f2b14909a3','a9a5c2d5-c96f-4e6c-a715-b4cdb0ffb9bd','261edee9-5923-44cc-b73b-f63ff7e759ed',100,100000,10000000,'2025-04-02 01:45:06','2025-04-02 01:45:06'),('87b8cdc9-8547-4a75-8743-e8c1ed6f873c','6703b2af-4c97-487c-9c0d-4281fa674382','ee42e195-bcea-42b5-b9f0-f689076a5ea5',100,100000,10000000,'2025-04-02 01:46:32','2025-04-02 01:46:32'),('903edc97-9319-4559-870c-5c53f3c229f0','3a213bb2-0dcc-4a21-bda5-4604d94d8007','a80d0522-000a-4ed8-bdd5-9840c297932a',90,100000,9000000,'2025-03-30 15:34:22','2025-03-30 15:34:22'),('9f0e48fa-db65-4820-9d51-d1984ab5ff0a','6703b2af-4c97-487c-9c0d-4281fa674382','ade7af2f-f9e4-431a-9920-3eea712a83e3',100,100000,10000000,'2025-04-02 01:46:32','2025-04-02 01:46:32'),('a3ea4b0f-686c-40cc-aff8-8a23da6bff14','6703b2af-4c97-487c-9c0d-4281fa674382','791a5c7b-a3ae-4006-b6ea-a6b096cea465',100,100000,10000000,'2025-04-02 01:46:32','2025-04-02 01:46:32'),('a7338da4-7d9f-414f-8582-3885f2083daf','9a1a4aad-c897-4ec9-80aa-ec8ecd8433c7','ade7af2f-f9e4-431a-9920-3eea712a83e3',100,100000,10000000,'2025-04-02 01:46:24','2025-04-02 01:46:24'),('b1227348-0153-4b41-91d1-748932423020','3a213bb2-0dcc-4a21-bda5-4604d94d8007','b0dc88a9-40d9-47fa-a15c-e1ab4b9d8142',80,90000,7200000,'2025-03-30 15:34:22','2025-03-30 15:34:22'),('b3cba908-bc6a-42f6-b627-bb3b01b26c40','9a1a4aad-c897-4ec9-80aa-ec8ecd8433c7','261edee9-5923-44cc-b73b-f63ff7e759ed',100,100000,10000000,'2025-04-02 01:46:24','2025-04-02 01:46:24'),('c9c13e7a-2c95-4a64-94fe-48d2840e5ef8','a9a5c2d5-c96f-4e6c-a715-b4cdb0ffb9bd','ee42e195-bcea-42b5-b9f0-f689076a5ea5',100,100000,10000000,'2025-04-02 01:45:06','2025-04-02 01:45:06'),('cf30e88c-993b-49cd-a480-956c1f38e19b','9a1a4aad-c897-4ec9-80aa-ec8ecd8433c7','791a5c7b-a3ae-4006-b6ea-a6b096cea465',100,100000,10000000,'2025-04-02 01:46:24','2025-04-02 01:46:24'),('e07a44d9-040a-4fdc-9f85-f824c9bb857c','80fd115d-a4f4-4a54-a383-88fcc34f0cf6','01075179-a8fa-438a-93e1-24fba2617e96',100,100000,10000000,'2025-04-02 02:05:56','2025-04-02 02:05:56'),('e4e2869d-c3ef-44ef-8473-ec9e6e3fe36d','9a1a4aad-c897-4ec9-80aa-ec8ecd8433c7','24eb884f-d1b6-4976-a95e-606b80bf983b',100,100000,10000000,'2025-04-02 01:46:24','2025-04-02 01:46:24'),('e8c091fd-df74-46a1-ad5e-907edd187525','6703b2af-4c97-487c-9c0d-4281fa674382','261edee9-5923-44cc-b73b-f63ff7e759ed',100,100000,10000000,'2025-04-02 01:46:32','2025-04-02 01:46:32'),('ea5da0ea-660a-4421-82f5-1bf4859e9dc7','9a1a4aad-c897-4ec9-80aa-ec8ecd8433c7','ee42e195-bcea-42b5-b9f0-f689076a5ea5',100,100000,10000000,'2025-04-02 01:46:24','2025-04-02 01:46:24'),('ec42ce84-d2b4-4fbc-bb0a-494900eef27b','9a1a4aad-c897-4ec9-80aa-ec8ecd8433c7','60ebfe8d-2d7f-4202-b476-d140b352b116',100,100000,10000000,'2025-04-02 01:46:24','2025-04-02 01:46:24');
/*!40000 ALTER TABLE `ct_hoadonnhap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `danhmuc`
--

LOCK TABLES `danhmuc` WRITE;
/*!40000 ALTER TABLE `danhmuc` DISABLE KEYS */;
INSERT INTO `danhmuc` VALUES ('0986334a-6ace-479b-87c1-8c1c75dafc4d','Văn phòng phẩm','2025-04-02 01:24:16','2025-04-02 01:24:16'),('501f1662-ef89-4fa4-9029-94279c8d4db8','Đồ chơi','2025-04-02 01:23:01','2025-04-02 01:23:01'),('a1c5b2c7-8204-4de8-b22a-de9c968f5183','Quà tặng','2025-03-30 15:10:46','2025-03-30 15:10:46'),('a5b855c8-3b37-461e-ba18-62260bb769c8','Gia dụng','2025-04-02 01:21:19','2025-04-02 01:21:19'),('afe3df66-f58b-468d-924a-2c44c1844e02','Du lịch','2025-04-02 01:23:45','2025-04-02 01:23:45'),('b0532b49-3f4f-4888-9778-c2cd4f937980','Trang điểm','2025-04-02 01:24:53','2025-04-02 01:24:53'),('b9d47b5a-a6cd-40c0-b6de-7ac1d69a71d1','Điện tử Điện thoại','2025-04-02 01:24:23','2025-04-02 01:24:23'),('d4d417de-9636-4095-a3b5-19b7f0e17fa6','Gấu bông','2025-04-02 01:19:34','2025-04-02 01:19:34'),('d7ee9b42-1987-449e-8a2b-9fd8a011fcec','Trang trí','2025-04-02 01:25:03','2025-04-02 01:25:03'),('f35f98eb-4150-4c06-a2a5-58330101f8fa','Balo Túi Ví','2025-04-02 01:24:09','2025-04-02 01:24:09');
/*!40000 ALTER TABLE `danhmuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `hoadonban`
--

LOCK TABLES `hoadonban` WRITE;
/*!40000 ALTER TABLE `hoadonban` DISABLE KEYS */;
INSERT INTO `hoadonban` VALUES ('453f57c8-3564-4671-85f6-b7451942c1bc','2025-03-30 00:00:00','Chờ duyệt',50000,800000,'Chuyển khoản','5bca7e1a-23e9-4015-97b1-d06a1e779ac0','2025-04-02 02:36:55','2025-04-02 02:36:55'),('b3641791-0c36-462b-9ba5-14cf74c8fb52','2025-03-30 00:00:00','Chờ duyệt',50000,2300000,'Chuyển khoản','5bca7e1a-23e9-4015-97b1-d06a1e779ac0','2025-04-01 06:56:04','2025-04-01 06:56:04');
/*!40000 ALTER TABLE `hoadonban` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `hoadonnhap`
--

LOCK TABLES `hoadonnhap` WRITE;
/*!40000 ALTER TABLE `hoadonnhap` DISABLE KEYS */;
INSERT INTO `hoadonnhap` VALUES ('3a213bb2-0dcc-4a21-bda5-4604d94d8007','2025-03-30 00:00:00',0,36300000,'COD','5bca7e1a-23e9-4015-97b1-d06a1e779ac0','205d9846-ca6d-4b36-9f90-484ce345d9f8','2025-03-30 15:34:22','2025-03-30 15:34:22'),('6703b2af-4c97-487c-9c0d-4281fa674382','2025-04-02 00:00:00',0,60000000,'COD','5bca7e1a-23e9-4015-97b1-d06a1e779ac0','205d9846-ca6d-4b36-9f90-484ce345d9f8','2025-04-02 01:46:32','2025-04-02 01:46:33'),('80fd115d-a4f4-4a54-a383-88fcc34f0cf6','2025-04-02 00:00:00',0,10000000,'COD','5bca7e1a-23e9-4015-97b1-d06a1e779ac0','205d9846-ca6d-4b36-9f90-484ce345d9f8','2025-04-02 02:05:56','2025-04-02 02:05:56'),('9a1a4aad-c897-4ec9-80aa-ec8ecd8433c7','2025-04-02 00:00:00',0,0,'COD','5bca7e1a-23e9-4015-97b1-d06a1e779ac0','205d9846-ca6d-4b36-9f90-484ce345d9f8','2025-04-02 01:46:24','2025-04-02 01:46:24'),('a9a5c2d5-c96f-4e6c-a715-b4cdb0ffb9bd','2025-04-02 00:00:00',0,0,'COD','5bca7e1a-23e9-4015-97b1-d06a1e779ac0','205d9846-ca6d-4b36-9f90-484ce345d9f8','2025-04-02 01:45:06','2025-04-02 01:45:06');
/*!40000 ALTER TABLE `hoadonnhap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `nguoidung`
--

LOCK TABLES `nguoidung` WRITE;
/*!40000 ALTER TABLE `nguoidung` DISABLE KEYS */;
INSERT INTO `nguoidung` VALUES ('5bca7e1a-23e9-4015-97b1-d06a1e779ac0','Thanh Bình','Nội Linh','2004-08-05','0987654321','thanhbinh@gmail.com','thanhbinh','e10adc3949ba59abbe56e057f20f883e','[\"/uploads/1743347689972.png\"]','U11','2025-03-30 15:26:36','2025-03-30 15:26:36'),('8e4e3bf6-6229-400d-b63c-e8acca24f6cf','Mai An','Phù Cừ','2004-08-05','0987654321','maian@gmail.com','maian','e10adc3949ba59abbe56e057f20f883e','[\"/uploads/1743347689973.JPG\"]','A00','2025-03-30 15:25:23','2025-03-30 15:27:10');
/*!40000 ALTER TABLE `nguoidung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `nhacungcap`
--

LOCK TABLES `nhacungcap` WRITE;
/*!40000 ALTER TABLE `nhacungcap` DISABLE KEYS */;
INSERT INTO `nhacungcap` VALUES ('205d9846-ca6d-4b36-9f90-484ce345d9f8','An Bình','Phù Cừ','0987654321','maian1@gmail.com','2025-03-30 15:27:30','2025-03-30 15:27:30');
/*!40000 ALTER TABLE `nhacungcap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sanpham`
--

LOCK TABLES `sanpham` WRITE;
/*!40000 ALTER TABLE `sanpham` DISABLE KEYS */;
INSERT INTO `sanpham` VALUES ('01075179-a8fa-438a-93e1-24fba2617e96','36fbe4b1-77d3-4300-b7a1-ece8bd4559c9','sản phẩm 7','APTX4689','hồng vàng','[\"/uploads/1741242725470.jpeg\",\"/uploads/1741245245673.jpeg\"]','sản phẩm rất đẹp nha bà con ahhhhhhhhhh',95,170000,'2025-04-02 01:35:21','2025-04-02 02:36:55'),('1ec3c2a6-f1e7-4eac-bb7e-daad9484c2d7','9953de54-ba91-4fc8-bf80-df3b3026216e','sản phẩm 3','APTX4689','hồng vàng','[\"/uploads/1741242725470.jpeg\",\"/uploads/1741245245673.jpeg\"]','sản phẩm rất đẹp nha bà con ahhhhhhhhhh',95,200000,'2025-03-30 15:13:57','2025-04-01 07:50:54'),('24eb884f-d1b6-4976-a95e-606b80bf983b','298f9ea9-3d32-45a6-8551-9e309b7943c6','sản phẩm 5','APTX4689','hồng vàng','[\"/uploads/1741242725470.jpeg\",\"/uploads/1741245245673.jpeg\"]','sản phẩm rất đẹp nha bà con ahhhhhhhhhh',300,120000,'2025-04-02 01:34:58','2025-04-02 01:46:32'),('261edee9-5923-44cc-b73b-f63ff7e759ed','36fbe4b1-77d3-4300-b7a1-ece8bd4559c9','sản phẩm 9','APTX4689','hồng vàng','[\"/uploads/1741242725470.jpeg\",\"/uploads/1741245245673.jpeg\"]','sản phẩm rất đẹp nha bà con ahhhhhhhhhh',300,270000,'2025-04-02 01:35:35','2025-04-02 01:46:32'),('60ebfe8d-2d7f-4202-b476-d140b352b116','36fbe4b1-77d3-4300-b7a1-ece8bd4559c9','sản phẩm 6','APTX4689','hồng vàng','[\"/uploads/1741242725470.jpeg\",\"/uploads/1741245245673.jpeg\"]','sản phẩm rất đẹp nha bà con ahhhhhhhhhh',300,120000,'2025-04-02 01:35:11','2025-04-02 01:46:32'),('791a5c7b-a3ae-4006-b6ea-a6b096cea465','298f9ea9-3d32-45a6-8551-9e309b7943c6','sản phẩm 4','APTX4689','hồng vàng','[\"/uploads/1741242725470.jpeg\",\"/uploads/1741245245673.jpeg\"]','sản phẩm rất đẹp nha bà con ahhhhhhhhhh',300,200000,'2025-04-02 01:34:24','2025-04-02 01:46:32'),('a80d0522-000a-4ed8-bdd5-9840c297932a','8ac011b3-c009-4375-9f97-c3b47726991c','sản phẩm 2','APTX4689','hồng đỏ','[\"/uploads/1741242725470.jpeg\",\"/uploads/1741245245673.jpeg\"]','sản phẩm rất đẹp nha bà con ahhhhhhhhhh',85,150000,'2025-03-30 15:13:05','2025-04-01 07:50:54'),('ade7af2f-f9e4-431a-9920-3eea712a83e3','36fbe4b1-77d3-4300-b7a1-ece8bd4559c9','sản phẩm 8','APTX4689','hồng vàng','[\"/uploads/1741242725470.jpeg\",\"/uploads/1741245245673.jpeg\"]','sản phẩm rất đẹp nha bà con ahhhhhhhhhh',300,270000,'2025-04-02 01:35:28','2025-04-02 01:46:32'),('b0dc88a9-40d9-47fa-a15c-e1ab4b9d8142','54240ddb-0f71-454a-8f9d-cb6c7f1809a7','sản phẩm 1','APTX4689','hồng phai','[\"/uploads/1741242725470.jpeg\",\"/uploads/1741245245673.jpeg\"]','sản phẩm rất đẹp nha bà con ahhhhhhhhhh',75,120000,'2025-03-30 15:11:57','2025-04-01 07:50:54'),('ee42e195-bcea-42b5-b9f0-f689076a5ea5','36fbe4b1-77d3-4300-b7a1-ece8bd4559c9','sản phẩm 10','APTX4689','hồng vàng','[\"/uploads/1741242725470.jpeg\",\"/uploads/1741245245673.jpeg\"]','sản phẩm rất đẹp nha bà con ahhhhhhhhhh',300,270000,'2025-04-02 01:35:40','2025-04-02 01:46:32');
/*!40000 ALTER TABLE `sanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vaitro`
--

LOCK TABLES `vaitro` WRITE;
/*!40000 ALTER TABLE `vaitro` DISABLE KEYS */;
INSERT INTO `vaitro` VALUES ('A00','admin','2025-03-30 22:24:51','2025-03-30 22:24:51'),('U11','user','2025-03-30 22:24:51','2025-03-30 22:24:51');
/*!40000 ALTER TABLE `vaitro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'web'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-02 13:19:02
