-- 增加手工冻结字段
ALTER TABLE `oms_v3`.`portfolio_account` ADD `manual_frozen_amount` DECIMAL( 13, 5 ) NOT NULL COMMENT '手工冻结' AFTER `tmp_frozen_amount`;

-- 增加手工冻结字段
ALTER TABLE `oms_v3`.`portfolio_stats_account` ADD `manual_frozen_amount` DECIMAL( 13, 5 ) NOT NULL COMMENT '手工冻结' AFTER `tmp_frozen_amount`;

CREATE TABLE `oms_v3`.`base_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `base_id` int(11) NOT NULL COMMENT '组合ID',
  `balance_amount` decimal(11,2) NOT NULL COMMENT '余额',
  `frozen_cash` decimal(11,2) NOT NULL COMMENT '冻结资金',
  `total_asset` decimal(11,2) NOT NULL COMMENT '资产总额',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `base_id` (`base_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `oms_v3`.`base_deal` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` int(11) NOT NULL COMMENT '底层账户',
  `date` int(11) NOT NULL COMMENT '日期',
  `entrust_id` int(11) NOT NULL COMMENT '委托编号',
  `stock_id` varchar(100) NOT NULL DEFAULT '',
  `stock_name` varchar(100) NOT NULL DEFAULT '',
  `deal_id` varchar(100) NOT NULL DEFAULT '' COMMENT '成交编号',
  `deal_type` int(11) NOT NULL COMMENT '成交方向, 买入/卖出',
  `deal_price` decimal(8,3) NOT NULL COMMENT '价格',
  `deal_amount` int(11) NOT NULL COMMENT '数量',
  `deal_value` decimal(12,3) NOT NULL COMMENT '成交金额',
  `deal_at` time NOT NULL COMMENT ' 成交时间',
  `status_desc` varchar(30) NOT NULL COMMENT '状态描述',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `base_id` (`base_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `oms_v3`.`base_entrust` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` int(11) NOT NULL COMMENT '底层账户',
  `date` int(11) NOT NULL COMMENT '日期',
  `entrust_id` int(11) NOT NULL COMMENT '委托编号',
  `stock_id` varchar(100) NOT NULL DEFAULT '',
  `stock_name` varchar(100) NOT NULL DEFAULT '',
  `entrust_price` decimal(7,3) NOT NULL COMMENT '委托价格',
  `entrust_model` int(11) NOT NULL COMMENT '委托方式, 限价/市价',
  `entrust_amount` int(11) NOT NULL COMMENT '委托数量',
  `deal_amount` int(11) NOT NULL COMMENT '委托数量',
  `cancel_amount` int(11) NOT NULL COMMENT '撤单数量',
  `entrust_type` int(11) NOT NULL COMMENT '委托方向, 买/卖',
  `status_desc` varchar(30) NOT NULL DEFAULT '' COMMENT '状态',
  `entrust_at` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `oms_v3`.`base_position` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `base_id` int(11) NOT NULL COMMENT '组合ID',
  `stock_id` varchar(12) NOT NULL COMMENT '股票ID',
  `hold_amount` int(11) NOT NULL COMMENT '持仓数量',
  `enable_sell` int(11) NOT NULL,
  `cost_price` decimal(11,3) NOT NULL COMMENT '持仓成本',
  `market_value` decimal(11,2) NOT NULL COMMENT '持仓成本',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `base_id` (`base_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `oms_v3`.`permissions` (`id`, `theme`, `category`, `name`, `status`, `created_at`, `updated_at`)
VALUES
	(19, 'oms', '委托提交', '账户查看', 1, '2016-10-18 14:32:32', '2016-10-18 14:32:34'),
	(20, 'oms', '委托提交', '委托提交', 1, '2016-10-18 14:32:32', '2016-10-18 14:32:34'),
	(21, 'oms', '委托执行', '委托分配', 1, '2016-10-18 14:32:32', '2016-10-18 14:32:34'),
	(22, 'oms', '委托执行', '委托执行', 1, '2016-10-18 14:32:32', '2016-10-18 14:32:34'),
	(23, 'oms', '委托执行', '转送派息处理', 1, '2016-10-18 14:32:32', '2016-10-18 14:32:34'),
	(24, 'oms', '风险监控', '风控管理', 1, '2016-10-18 14:32:32', '2016-10-18 14:32:34'),
	(25, 'oms', '委托执行', '异常单处理', 1, '2016-12-08 07:38:24', '2016-12-08 07:37:38'),
	(26, 'oms', '账户管理', '风控设置', 1, '2016-12-08 07:38:25', '2016-12-08 07:37:38'),
	(27, 'oms', '账户管理', '拆分账户', 1, '2016-12-08 07:38:25', '2016-12-08 07:37:38'),
	(28, 'oms', '账户管理', '基础设置', 1, '2016-12-08 07:38:25', '2016-12-08 07:37:38'),
	(29, 'oms', '账户管理', '人员设置', 1, '2016-12-08 07:38:25', '2016-12-08 07:37:38'),
	(30, 'oms', '账户管理', '费用设置', 1, '2016-12-08 07:38:25', '2016-12-08 07:37:38'),
	(31, 'oms', '账户管理', '资金设置', 1, '2016-12-08 07:38:25', '2016-12-08 07:37:38'),
	(32, 'oms', '用户管理', '创建编辑', 1, '2016-12-08 07:38:25', '2016-12-08 07:37:38'),
	(33, 'oms', '用户管理', '重置密码', 1, '2016-12-08 07:53:18', '2016-12-08 07:53:19'),
	(34, 'oms', '用户管理', '注销用户', 1, '2016-12-08 07:53:19', '2016-12-08 07:53:19'),
	(35, 'oms', '数据查询', '指令查询', 1, '2016-12-08 07:54:33', '2016-12-08 07:53:19'),
	(36, 'oms', '数据查询', '委托查询', 1, '2016-12-08 07:54:33', '2016-12-08 07:53:19'),
	(37, 'oms', '数据查询', '成交查询', 1, '2016-12-08 07:54:33', '2016-12-08 07:53:19'),
	(38, 'oms', '数据查询', '持仓查询', 1, '2016-12-08 07:54:33', '2016-12-08 07:53:19'),
	(39, 'oms', '数据查询', '清算查询', 1, '2016-12-08 07:54:33', '2016-12-08 07:53:19'),
	(40, 'oms', '数据查询', '资金查询', 1, '2016-12-08 07:54:33', '2016-12-08 07:53:19'),
	(41, 'oms', '数据监控', '数据监控核对', 1, '2016-12-08 07:56:36', '2016-12-08 07:53:19'),
	(42, 'oms', '指令提交', '指令提交', 1, '2016-12-21 06:23:33', '2016-12-08 07:53:19')
	ON DUPLICATE KEY UPDATE `theme`=VALUES(theme),`category`=VALUES(category),`name`=VALUES(name),`status`=VALUES(status);

CREATE TABLE `oms_v3`.`role_permissions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `org_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `oms_v3`.`role_permissions` (`org_id`, `role_id`, `permission_id`, `created_at`, `updated_at`)
VALUES
	(1, 11, 20, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 11, 35, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 11, 36, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 11, 37, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 11, 38, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 11, 39, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 11, 40, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 12, 21, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 12, 22, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 12, 25, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 12, 41, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 12, 23, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 12, 35, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 12, 36, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 12, 37, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 12, 38, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 12, 39, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 12, 40, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 13, 26, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
	(1, 13, 24, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- 组合费用设置 buty
CREATE TABLE `oms_v3`.`portfolio_fee_params` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `product_id` int(11) NOT NULL COMMENT '组合ID',
 `market` int(11) NOT NULL COMMENT '1:股票 2:基金',
 `fee_type` int(11) NOT NULL COMMENT '费用类型',
 `fee_rate` decimal(10,6) NOT NULL COMMENT '费率',
 `fee_upper_limit` decimal(10,5) NOT NULL COMMENT '最低费用',
 `fee_lower_limit` decimal(10,5) NOT NULL COMMENT '最高费用',
 `status` int(11) NOT NULL COMMENT '0:启用 1:禁用',
 `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 PRIMARY KEY (`id`),
 KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- 组合费用模板 buty
CREATE TABLE `oms_v3`.`portfolio_template` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `tpl_type` int(11) NOT NULL COMMENT '模板类型',
 `tpl_cont` varchar(2000) NOT NULL COMMENT '模板内容',
 `status` int(11) NOT NULL COMMENT '0:正常 1:删除',
 `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 PRIMARY KEY (`id`,`tpl_type`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- 组合出入金调整 buty
CREATE TABLE `oms_v3`.`portfolio_fund_adjustment` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `product_id` int(11) NOT NULL COMMENT '组合ID',
 `user_id` int(11) NOT NULL COMMENT '操作人员ID',
 `amount` decimal(13,5) NOT NULL COMMENT '资金',
 `volume` decimal(16,8) NOT NULL COMMENT '份额',
 `op_type` int(11) NOT NULL COMMENT '1:入金 2:出金 3:冻结 4:解冻',
 `remark` varchar(250) NOT NULL COMMENT '备注',
 `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 PRIMARY KEY (`id`),
 KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- 组合结算单
CREATE TABLE `oms_v3`.`portfolio_settlement` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `product_id` int(11) NOT NULL COMMENT '组合ID',
 `settle_date` date NOT NULL COMMENT '结算日期',
 `total_assets` decimal(13,5) NOT NULL COMMENT '资产总值',
 `yesterday_total_assets` decimal(13,5) NOT NULL COMMENT '昨日资产总值',
 `balance_assets` decimal(13,5) NOT NULL COMMENT '资产余额',
 `net_assets` decimal(13,5) NOT NULL COMMENT '净资产',
 `security_assets` decimal(13,5) NOT NULL COMMENT '证券资产',
 `usable_cash` decimal(13,5) NOT NULL COMMENT '可用资金',
 `net_value` decimal(10,8) NOT NULL COMMENT '净值',
 `net_profit` decimal(13,5) NOT NULL COMMENT '净收益',
 `net_profit_rate` decimal(6,5) NOT NULL COMMENT '净收益率',
 `day_profit` decimal(13,5) NOT NULL COMMENT '当日收益',
 `day_profit_rate` decimal(6,5) NOT NULL COMMENT '当日收益率',
 `tmp_frozen_assets` decimal(13,5) NOT NULL COMMENT '临时冻结资产',
 `trade_fee` decimal(13,5) NOT NULL COMMENT '交易费',
 `manage_fee` decimal(13,5) NOT NULL COMMENT '管理费',
 `redeem_fee` decimal(13,5) NOT NULL COMMENT '退出费',
 `position` decimal(7,5) NOT NULL COMMENT '仓位',
 `net_balance_assets` decimal(13,5) NOT NULL COMMENT '净余额',
 `today_fund_in` decimal(13,5) NOT NULL COMMENT '当日入金',
 `today_fund_out` decimal(13,5) NOT NULL COMMENT '当日出金',
 `status` int(11) NOT NULL COMMENT '状态 0:正常 1:删除',
 `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 PRIMARY KEY (`id`),
 KEY `product_id` (`product_id`,`settle_date`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- 组合费用模板数据
INSERT INTO `oms_v3`.`portfolio_template` (`id`, `tpl_type`, `tpl_cont`, `status`, `created_at`, `updated_at`) VALUES
(9, 1, '[{"fee_type":"1","fee_rate":"1.000000","fee_upper_limit":"0.00000","fee_lower_limit":"0.00000","status":"0","market":"1"},{"fee_type":"2","fee_rate":"0.020000","fee_upper_limit":"1.00000","fee_lower_limit":"0.00000","status":"0","market":"1"},{"fee_type":"3","fee_rate":"0.069600","fee_upper_limit":"0.00000","fee_lower_limit":"0.00000","status":"0","market":"1"},{"fee_type":"4","fee_rate":"0.200000","fee_upper_limit":"0.00000","fee_lower_limit":"0.00000","status":"0","market":"1"},{"fee_type":"5","fee_rate":"0.300000","fee_upper_limit":"0.00000","fee_lower_limit":"5.00000","status":"0","market":"1"},{"fee_type":"6","fee_rate":"20.000000","fee_upper_limit":"0.00000","fee_lower_limit":"0.00000","status":"0","market":"0"},{"fee_type":"7","fee_rate":"10.000000","fee_upper_limit":"0.00000","fee_lower_limit":"0.00000","status":"0","market":"0"},{"fee_type":"3","fee_rate":"0.004500","fee_upper_limit":"0.00000","fee_lower_limit":"0.00000","status":"0","market":"2"},{"fee_type":"5","fee_rate":"0.300000","fee_upper_limit":"0.00000","fee_lower_limit":"5.00000","status":"0","market":"2"}]', 0, '2016-12-17 11:15:01', '2016-12-29 13:29:59');


CREATE TABLE `oms_v3`.`portfolio_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `product_id` int(11) NOT NULL COMMENT '组合ID',
  `role_id` tinyint(4) NOT NULL COMMENT '角色ID',
  `status` tinyint(4) NOT NULL COMMENT '状态',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
