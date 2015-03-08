/*
MySQL Data Transfer
Source Host: localhost
Source Database: treetry1
Target Host: localhost
Target Database: treetry1
Date: 30-Jun-08 19:46:48
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `parent` int(11) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for nested_category
-- ----------------------------
DROP TABLE IF EXISTS `nested_category`;
CREATE TABLE `nested_category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `lft` int(11) NOT NULL,
  `rgt` int(11) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for treetable
-- ----------------------------
DROP TABLE IF EXISTS `treetable`;
CREATE TABLE `treetable` (
  `nodeid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parentid` int(10) unsigned NOT NULL,
  `name` varchar(45) NOT NULL,
  `depth` int(10) unsigned NOT NULL DEFAULT '0',
  `lineage` varchar(45) NOT NULL DEFAULT 'lineage',
  `isdirectory` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`nodeid`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records 
-- ----------------------------
INSERT INTO `category` VALUES ('1', 'ELECTRONICS', null);
INSERT INTO `category` VALUES ('2', 'TELEVISIONS', '1');
INSERT INTO `category` VALUES ('3', 'TUBE', '2');
INSERT INTO `category` VALUES ('4', 'LCD', '2');
INSERT INTO `category` VALUES ('5', 'PLASMA', '2');
INSERT INTO `category` VALUES ('6', 'PORTABLE ELECTRONICS', '1');
INSERT INTO `category` VALUES ('7', 'MP3 PLAYERS', '6');
INSERT INTO `category` VALUES ('8', 'FLASH', '7');
INSERT INTO `category` VALUES ('9', 'CD PLAYERS', '6');
INSERT INTO `category` VALUES ('10', '2 WAY RADIOS', '6');
INSERT INTO `nested_category` VALUES ('1', 'ELECTRONICS', '1', '20');
INSERT INTO `nested_category` VALUES ('2', 'TELEVISIONS', '2', '9');
INSERT INTO `nested_category` VALUES ('3', 'TUBE', '3', '4');
INSERT INTO `nested_category` VALUES ('4', 'LCD', '5', '6');
INSERT INTO `nested_category` VALUES ('5', 'PLASMA', '7', '8');
INSERT INTO `nested_category` VALUES ('6', 'PORTABLE ELECTRONICS', '10', '19');
INSERT INTO `nested_category` VALUES ('7', 'MP3 PLAYERS', '11', '14');
INSERT INTO `nested_category` VALUES ('8', 'FLASH', '12', '13');
INSERT INTO `nested_category` VALUES ('9', 'CD PLAYERS', '15', '16');
INSERT INTO `nested_category` VALUES ('10', '2 WAY RADIOS', '17', '18');
INSERT INTO `treetable` VALUES ('1', '0', 'Root', '0', '/1/', '1');
INSERT INTO `treetable` VALUES ('2', '1', 'A', '1', '/1/2/', '1');
INSERT INTO `treetable` VALUES ('20', '2', 'ChildC', '2', '/1/2/20/', '0');
INSERT INTO `treetable` VALUES ('21', '1', 'B', '1', '/1/21/', '1');
INSERT INTO `treetable` VALUES ('50', '1', 'ChildY', '1', '/1/50/', '1');
INSERT INTO `treetable` VALUES ('65', '69', 'childC', '3', '/1/50/69/65/', '0');
INSERT INTO `treetable` VALUES ('69', '50', 'ChildE', '2', '/1/50/69/', '1');
INSERT INTO `treetable` VALUES ('70', '69', 'ChildF', '3', '/1/50/69/70/', '0');
INSERT INTO `treetable` VALUES ('71', '69', 'ChildG', '3', '/1/50/69/71/', '0');
INSERT INTO `treetable` VALUES ('73', '50', 'ChildH', '2', '/1/50/73/', '0');
INSERT INTO `treetable` VALUES ('74', '50', 'ChildY', '2', '/1/50/74/', '0');
INSERT INTO `treetable` VALUES ('81', '84', 'newfile', '3', '/1/50/84/81/', '0');
INSERT INTO `treetable` VALUES ('84', '50', 'ChildTBP', '2', '/1/50/84/', '1');
INSERT INTO `treetable` VALUES ('85', '50', 'ChildD', '2', '/1/50/85/', '1');
INSERT INTO `treetable` VALUES ('86', '85', 'FileD', '3', '/1/50/85/86/', '0');
