# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 192.168.0.22 (MySQL 5.5.43-0ubuntu0.14.04.1-log)
# Database: oms_v2
# Generation Time: 2016-05-30 02:47:13 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table guoxin_imported
# ------------------------------------------------------------

DROP TABLE IF EXISTS `oms_v2`.`guoxin_imported`;

CREATE TABLE `oms_v2`.`guoxin_imported` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `source` int(11) NOT NULL COMMENT '0:人工录入\n1:交易记录\n2:交割单',
  `status` int(11) NOT NULL COMMENT '0: 无效单, 1有效单',
  `completion_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '成交日期',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sign` varchar(32) NOT NULL DEFAULT '' COMMENT '单条订单唯一标识',
  `product_id` varchar(200) NOT NULL DEFAULT '' COMMENT '绑定的组合id, 未绑定时为空',
  `content` text NOT NULL COMMENT '单条记录内容',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table stock_equity_change
# ------------------------------------------------------------

DROP TABLE IF EXISTS `oms_v2`.`stock_equity_change`;

CREATE TABLE `oms_v2`.`stock_equity_change` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `gaosongzhuan_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `active` int(11) NOT NULL,
  `frozen_today` int(11) NOT NULL,
  `stock_id` varchar(100) NOT NULL DEFAULT '',
  `amount` varchar(100) NOT NULL DEFAULT '',
  `unforzen_cash` varchar(100) NOT NULL DEFAULT '',
  `msg` varchar(500) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `activied_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `contain` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table stock_order_list
# ------------------------------------------------------------

DROP TABLE IF EXISTS `oms_v2`.`stock_order_list`;

CREATE TABLE `oms_v2`.`stock_order_list` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` varchar(200) DEFAULT '' COMMENT '应用订单ID',
  `stock_id` varchar(200) DEFAULT '' COMMENT '股票id',
  `stock_code` varchar(200) DEFAULT '' COMMENT '股票代码',
  `stock_name` varchar(1000) DEFAULT '' COMMENT '股票名称',
  `entrust_price` decimal(20,6) DEFAULT '0.000000' COMMENT '股票单价',
  `entrust_amount` decimal(20,6) NOT NULL,
  `entrust_total` decimal(20,6) DEFAULT '0.000000' COMMENT 'entrust_price * entrust_amount',
  `order_type` tinyint(4) DEFAULT '1' COMMENT '下单类型，1:buy; 2:sell',
  `security_exchange` tinyint(4) DEFAULT '1' COMMENT '1:SZ-A; 2:SS-A; 3:HK; 4:SZ-B; 5:SS-B',
  `ext_order_id` varchar(500) DEFAULT '' COMMENT '第三方交易订单ID',
  `ext_order_src` tinyint(11) DEFAULT '1' COMMENT '第三方交易服务商， 1:GKI; 2:DGZQ',
  `business_price` decimal(20,6) DEFAULT '0.000000' COMMENT '成交单价',
  `business_amount` decimal(20,6) NOT NULL,
  `business_total` decimal(20,6) DEFAULT '0.000000' COMMENT 'business_price * business_amount',
  `business_time` timestamp NULL DEFAULT '0000-00-00 00:00:00' COMMENT '成交时间',
  `status` tinyint(4) DEFAULT '1' COMMENT '1:new-pending2:new-queu;\n3:new-pending-cancel;4:new-canceled; \n5:new-pending-replace; 6:new-replaced; \n7:partially-filled;\n8:partiallyfilled-pending-cancel;\n9:partiallyfilled-canceled;\n10:partiallyfilled-pending-replace;\n11:partiallyfilled-replaced;\n12:filled; \n13:rejected; \n14:closed',
  `product_id` varchar(200) DEFAULT '' COMMENT '产品号',
  `product_name` varchar(1000) DEFAULT '' COMMENT '产品名称',
  `user_id` varchar(200) DEFAULT '' COMMENT '用户ID',
  `trade_account` varchar(200) DEFAULT '' COMMENT '公司交易帐号',
  `created_at` timestamp NULL DEFAULT '0000-00-00 00:00:00' COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT '0000-00-00 00:00:00' COMMENT '更新时间',
  `business_fee` decimal(20,6) DEFAULT '0.000000',
  `order_status` int(11) NOT NULL,
  `order_model` int(11) NOT NULL,
  `active` int(11) NOT NULL,
  `source` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `product_user` (`product_id`,`user_id`),
  KEY `ext_order_id` (`ext_order_id`(255)),
  KEY `created_at` (`created_at`),
  KEY `product_id` (`product_id`),
  KEY `active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table workflow_entrust
# ------------------------------------------------------------

DROP TABLE IF EXISTS `oms_v2`.`workflow_entrust`;

CREATE TABLE `oms_v2`.`workflow_entrust` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_id` int(11) NOT NULL COMMENT '创建人 uid',
  `order_id` varchar(32) NOT NULL DEFAULT '' COMMENT '订单 id, 与 stock order 中对应',
  `product_id` int(11) NOT NULL COMMENT '订单所属组合 id, 冗余数据, 方便查询',
  `entrust_stock_code` varchar(100) NOT NULL DEFAULT '',
  `entrust_price` decimal(20,6) NOT NULL COMMENT '委托价格',
  `entrust_amount` decimal(20,6) NOT NULL COMMENT '委托数量',
  `entrust_model` int(11) NOT NULL COMMENT '委托方式, 限价/市价',
  `entrust_type` int(11) NOT NULL COMMENT '委托方向, 买/卖',
  `entrust_state` int(11) NOT NULL COMMENT '操盘手委托声明, 下单/改单/撤单',
  `executor_uid` int(11) NOT NULL COMMENT '执行员 id',
  `status` int(11) NOT NULL COMMENT '执行员 执行状态',
  `msg` varchar(2000) NOT NULL DEFAULT '' COMMENT '拒绝 / 删除原因',
  `is_open` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table workflow_gaosongzhuan
# ------------------------------------------------------------

DROP TABLE IF EXISTS `oms_v2`.`workflow_gaosongzhuan`;

CREATE TABLE `oms_v2`.`workflow_gaosongzhuan` (
  `gaosongzhuan_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `status` int(11) NOT NULL,
  `creator_uid` int(11) NOT NULL,
  `execute_uid` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `position_amount` int(11) NOT NULL,
  `last_price` varchar(11) NOT NULL,
  `stock_id` varchar(11) NOT NULL DEFAULT '',
  `per_share_div_ratio` varchar(11) NOT NULL DEFAULT '',
  `per_share_trans_ratio` varchar(11) NOT NULL DEFAULT '',
  `per_cash_div` varchar(11) NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `ex_div_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `pay_cash_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `bonus_share_list_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `record_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`gaosongzhuan_id`),
  UNIQUE KEY `product_id` (`product_id`,`stock_id`,`publish_date`,`ex_div_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table workflow_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `oms_v2`.`workflow_log`;

CREATE TABLE `oms_v2`.`workflow_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `original_ploy_id` int(11) NOT NULL,
  `workflow_id` int(11) NOT NULL,
  `handler_uid` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `contain` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `original_ploy_id` (`original_ploy_id`),
  KEY `workflow_id` (`workflow_id`),
  KEY `handler_uid` (`handler_uid`),
  KEY `type` (`type`),
  KEY `created_at` (`created_at`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table workflow_original_ploy
# ------------------------------------------------------------

DROP TABLE IF EXISTS `oms_v2`.`workflow_original_ploy`;

CREATE TABLE `oms_v2`.`workflow_original_ploy` (
  `original_ploy_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `workflow_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `creator_uid` int(11) NOT NULL,
  `executor_uid` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `stock_id` varchar(100) NOT NULL,
  `contain` text NOT NULL,
  PRIMARY KEY (`original_ploy_id`),
  KEY `product_id` (`product_id`),
  KEY `workflow_id` (`workflow_id`),
  KEY `status` (`status`),
  KEY `stock_id` (`stock_id`),
  KEY `creator_uid` (`creator_uid`),
  KEY `executor_uid` (`executor_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table zhongxin_imported
# ------------------------------------------------------------

DROP TABLE IF EXISTS `oms_v2`.`zhongxin_imported`;

CREATE TABLE `oms_v2`.`zhongxin_imported` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `source` int(11) NOT NULL COMMENT '0:人工录入\n1:交易记录\n2:交割单',
  `status` int(11) NOT NULL COMMENT '0: 无效单, 1有效单',
  `completion_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '成交日期',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sign` varchar(32) NOT NULL DEFAULT '' COMMENT '单条订单唯一标识',
  `product_id` varchar(200) NOT NULL DEFAULT '' COMMENT '绑定的组合id, 未绑定时为空',
  `content` text NOT NULL COMMENT '单条记录内容',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
