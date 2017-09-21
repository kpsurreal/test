--- 组合帐户 buty
CREATE TABLE `oms_v2`.`portfolio_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL COMMENT '组合ID',
  `balance_amount` decimal(13,5) NOT NULL COMMENT '余额',
  `unfrozen_amount` decimal(13,5) NOT NULL COMMENT '解冻资金',
  `frozen_amount` decimal(13,5) NOT NULL COMMENT '冻结资金',
  `tmp_frozen_amount` decimal(13,5) NOT NULL COMMENT '临时冻结资金',
  `trade_fee` decimal(13,5) NOT NULL COMMENT '交易费用',
  `platform_fee` decimal(13,5) NOT NULL COMMENT '平台费用',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- 组合持仓 buty
CREATE TABLE `oms_v2`.`portfolio_position` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL COMMENT '组合ID',
  `stock_id` varchar(12) NOT NULL COMMENT '股票ID',
  `hold_cost` decimal(13,5) NOT NULL COMMENT '持仓成本',
  `hold_volume` decimal(13,2) NOT NULL COMMENT '持仓数量',
  `buy_volume` decimal(13,2) NOT NULL COMMENT '当日买入数量',
  `sell_volume` decimal(13,2) NOT NULL COMMENT '当日卖出数量',
  `total_fee` decimal(13,5) NOT NULL COMMENT '总费用',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sell_frozen_volume` decimal(13,2) NOT NULL DEFAULT '0.00' COMMENT '卖出冻结数量',
  `frozen_volume` decimal(13,2) NOT NULL DEFAULT '0.00' COMMENT '冻结可卖数量',
  `given_amount` decimal(13,5) NOT NULL DEFAULT '0.00000',
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`,`stock_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- 组合帐户统计 buty
CREATE TABLE `oms_v2`.`portfolio_stats_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL COMMENT '组合ID',
  `stats_day` char(10) NOT NULL,
  `balance_amount` decimal(13,5) NOT NULL COMMENT '余额',
  `unfrozen_amount` decimal(13,5) NOT NULL COMMENT '解冻资金',
  `frozen_amount` decimal(13,5) NOT NULL COMMENT '冻结资金',
  `tmp_frozen_amount` decimal(13,5) NOT NULL COMMENT '临时冻结资金',
  `trade_fee` decimal(13,5) NOT NULL COMMENT '交易费用',
  `platform_fee` decimal(13,5) NOT NULL COMMENT '平台费用',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`,`stats_day`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- 组合持仓统计 buty
CREATE TABLE `oms_v2`.`portfolio_stats_position` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL COMMENT '组合ID',
  `stats_day` char(10) NOT NULL,
  `stock_id` varchar(12) NOT NULL COMMENT '股票ID',
  `hold_cost` decimal(13,5) NOT NULL COMMENT '持仓成本',
  `hold_volume` decimal(13,2) NOT NULL COMMENT '持仓数量',
  `buy_volume` decimal(13,2) NOT NULL COMMENT '当日买入数量',
  `sell_volume` decimal(13,2) NOT NULL COMMENT '当日卖出数量',
  `sell_frozen_volume` decimal(13,2) NOT NULL,
  `frozen_volume` decimal(13,2) NOT NULL COMMENT '冻结可卖数量',
  `given_amount` decimal(13,5) NOT NULL DEFAULT '0.00000',
  `total_fee` decimal(13,5) NOT NULL COMMENT '总费用',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`,`stats_day`,`stock_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- 交易费标志位 buty
ALTER TABLE `oms_v2`.`stock_delivery` ADD `is_handle_fee` INT NOT NULL DEFAULT '0' COMMENT '交易费处理：0:未处理 1:已处理' AFTER `contain`;

-- 成交单处理标志位 buty
ALTER TABLE `oms_v2`.`stock_deal` ADD `is_handle` INT NOT NULL DEFAULT '0' COMMENT '0:未处理 1:已处理' AFTER `contain`;






-- Create syntax for TABLE 'user_permission'
CREATE TABLE `oms_v2`.`user_permission` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `method_name` varchar(100) NOT NULL DEFAULT '',
  `value` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `is_deleted` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`product_id`,`method_name`)
) ENGINE=InnoDB AUTO_INCREMENT=1355 DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'user_permission_log'
CREATE TABLE `oms_v2`.`user_permission_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `action_user_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `method_name` varchar(100) NOT NULL DEFAULT '',
  `new_value` int(11) NOT NULL,
  `old_value` int(11) NOT NULL,
  `created_at` varchar(24) NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` varchar(24) NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1725 DEFAULT CHARSET=utf8;


CREATE TABLE `sec_info` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `yybmc` varchar(500) NOT NULL DEFAULT '',
  `zjzh` varchar(500) NOT NULL DEFAULT '',
  `zjmm` varchar(500) NOT NULL DEFAULT '',
  `gddm_sz` varchar(500) NOT NULL DEFAULT '',
  `gddm_sh` varchar(500) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
