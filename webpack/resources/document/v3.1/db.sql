-- 新增最近一次分发时间
ALTER TABLE `oms_v2`.`workflow_entrust` ADD `last_dispatch_time` INT NOT NULL DEFAULT '0' COMMENT '最近一次分发时间' AFTER `batch_no`;
-- 重复撤单次数
ALTER TABLE `oms_v2`.`workflow_entrust` ADD `repeat_cancel_times` INT NOT NULL DEFAULT '0' COMMENT '重复撤单次数' AFTER `last_dispatch_time`;


-- 新增订单状态, 委托状态，成交状态
ALTER TABLE `oms_v2`.`workflow_entrust` ADD `ins_status` INT NOT NULL COMMENT '指令状态' AFTER `repeat_cancel_times`, ADD `entrust_status` INT NOT NULL COMMENT '委托状态' AFTER `ins_status`, ADD `deal_status` INT NOT NULL COMMENT '成交状态' AFTER `entrust_status`;


-- 新增订单是否已处理标识, 撤单数量
ALTER TABLE `oms_v2`.`workflow_entrust` ADD `cancel_volume` INT NOT NULL COMMENT '撤单数量' AFTER `deal_status`, ADD `is_handle` INT NOT NULL COMMENT '是否已处理 0:未处理 1:已处理' AFTER `cancel_volume`;


-- 帐户日志
CREATE TABLE `oms_v2`.`portfolio_log` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `user_id` int(11) NOT NULL COMMENT '操作者ID',
 `product_id` int(11) NOT NULL COMMENT '组合ID',
 `action_type` int(11) NOT NULL COMMENT '动作类型 1:下买单, 2:下买单成交, 3:下买单撤单 4:下买单废单 5:下卖单 6:下卖单成交 7:下卖单撤单 8:下卖单废单',
 `trade_amount` decimal(13,3) NOT NULL COMMENT '交易金额',
 `balance` decimal(13,3) NOT NULL COMMENT '交易后余额',
 `can_use_balance` decimal(13,3) NOT NULL COMMENT '交易后可用余额',
 `stock_id` char(10) CHARACTER SET latin1 NOT NULL COMMENT '股票代码',
 `trade_volume` decimal(13,2) NOT NULL COMMENT '交易份额',
 `hold_volume` decimal(13,2) NOT NULL COMMENT '交易后持仓数量',
 `can_sell_volume` decimal(13,2) NOT NULL COMMENT '交易后可卖数量',
 `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- 用户相关配置表
CREATE TABLE IF NOT EXISTS `stock_user_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `type` varchar(6) CHARACTER SET utf8 NOT NULL COMMENT '配置类型',
  `config_val` varchar(12) CHARACTER SET utf8 NOT NULL COMMENT '值',
  `config_desc` varchar(100) CHARACTER SET utf8 NOT NULL COMMENT '描述',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

-- 用户相关配置表初始化
INSERT INTO `stock_user_config` (`id`, `user_id`, `type`, `config_val`, `config_desc`, `created_at`, `updated_at`) VALUES
(2, 0, '2', '8', 'SH', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 0, '2', '3', 'SZ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 0, 'SZ', '3', '对手方最优价格', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 0, 'SZ', '4', '本方最优价格 ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, 0, 'SH', '8', '最优五档即时成交剩余转限', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- 券商状态配置表
CREATE TABLE `oms_v2`.`securities_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `securities_id` varchar(20) CHARACTER SET utf8 NOT NULL,
  `status_desc` varchar(100) NOT NULL,
  `oms_status` smallint(6) NOT NULL,
  `deal_flag` smallint(6) NOT NULL,
  `is_cancel` smallint(6) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `securities_status` VALUES ('1', 'gx', '撤单废单', '0', '2', '1', '2016-11-02 08:51:47', '2016-11-02 16:53:17'), ('2', 'gx', '废单', '0', '2', '0', '2016-11-03 05:22:48', '0000-00-00 00:00:00'), ('3', 'gx', '内部撤单', '0', '1', '1', '2016-11-03 05:23:12', '0000-00-00 00:00:00'), ('4', 'gx', '普通成交', '0', '1', '0', '2016-11-03 05:23:43', '0000-00-00 00:00:00'), ('5', 'gx', '撤单成交', '0', '1', '1', '2016-11-11 03:07:59', '0000-00-00 00:00:00'), ('6', 'ht', '废单', '0', '2', '0', '2016-11-03 05:25:37', '0000-00-00 00:00:00'), ('7', 'ht', '部撤', '0', '1', '1', '2016-11-03 06:53:38', '0000-00-00 00:00:00'), ('8', 'ht', '已撤', '0', '1', '1', '2016-11-03 06:53:14', '0000-00-00 00:00:00'), ('9', 'ht', '已成', '0', '1', '0', '2016-11-03 06:30:02', '0000-00-00 00:00:00'), ('10', 'ht', '成交', '0', '1', '0', '2016-11-03 06:30:02', '0000-00-00 00:00:00');

-- TB serve 信息对应表
CREATE TABLE `oms_v2`.`roboter_info` (
  `roboter_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `securities_id` varchar(20) NOT NULL,
  `server_host` varchar(50) NOT NULL,
  `server_port` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`roboter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into `oms_v2`.`roboter_info` ( `securities_id`, `created_at`, `roboter_id`, `updated_at`, `server_port`, `name`, `server_host`) values ( 'gx', '2016-11-01 07:39:26', '10027', '2016-10-29 10:54:41', '8000', 'gx01', '10.172.20.202');
insert into `oms_v2`.`roboter_info` ( `securities_id`, `created_at`, `roboter_id`, `updated_at`, `server_port`, `name`, `server_host`) values ( 'gx', '2016-10-29 02:54:26', '10026', '2016-10-29 10:55:08', '8010', 'gx02', '10.172.20.202');
insert into `oms_v2`.`roboter_info` ( `securities_id`, `created_at`, `roboter_id`, `updated_at`, `server_port`, `name`, `server_host`) values ( 'ht', '2016-10-29 02:55:21', '15885', '2016-10-29 10:58:27', '7900', 'ht01', '10.172.20.202');
insert into `oms_v2`.`roboter_info` ( `securities_id`, `created_at`, `roboter_id`, `updated_at`, `server_port`, `name`, `server_host`) values ( 'ht', '2016-10-29 02:55:19', '213196', '2016-10-29 10:58:24', '7910', 'ht02', '10.172.20.202');
-- 函数权限表
CREATE TABLE `func_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `func` varchar(100) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `check_product` tinyint(4) NOT NULL,
  `input_param` varchar(20) NOT NULL,
  `get_method` varchar(100) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `idx_func` (`func`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `func_permission` VALUES ('1', 'OMS\\OMSPageController@multi_products', '1', '0', '', '', '0', '2016-10-11 03:34:35', '2016-10-11 11:36:29'), ('2', 'OMS\\OMSInstructionController@getList', '1', '0', '', '', '0', '2016-10-13 03:27:49', '0000-00-00 00:00:00'), ('3', 'OMS\\OMSInstructionController@postAddOrder', '2', '0', '', '', '0', '2016-10-13 03:31:45', '0000-00-00 00:00:00'), ('4', 'OMS\\OMSInstructionController@postCancelOrder', '2', '0', '', '', '0', '2016-10-13 03:32:46', '0000-00-00 00:00:00'), ('5', 'OMS\\OMSInstructionController@getHistoryList', '1', '0', '', '', '0', '2016-10-13 03:33:36', '0000-00-00 00:00:00'), ('6', 'User\\UserController@get_user_list', '6', '0', '', '', '0', '2016-10-13 11:38:58', '0000-00-00 00:00:00'), ('7', 'User\\UserController@createUser', '7', '0', '', '', '0', '2016-10-13 03:46:56', '0000-00-00 00:00:00'), ('8', 'User\\UserController@postModify', '8', '0', '', '', '0', '2016-10-13 03:47:02', '0000-00-00 00:00:00'), ('9', 'User\\UserController@resetPassword', '9', '0', '', '', '0', '2016-10-13 03:47:06', '0000-00-00 00:00:00'), ('10', 'User\\UserController@postPermissions', '10', '0', '', '', '0', '2016-10-13 03:47:09', '0000-00-00 00:00:00'), ('11', 'Product\\ProductController@getProductList', '3', '0', '', '', '0', '2016-10-13 03:48:32', '0000-00-00 00:00:00'), ('12', 'Product\\ProductController@postAdd', '4', '0', '', '', '0', '2016-10-13 03:49:14', '0000-00-00 00:00:00'), ('13', 'Product\\ProductController@postModify', '5', '0', '', '', '0', '2016-10-13 03:49:23', '0000-00-00 00:00:00'), ('14', 'User\\UserController@unsetUser', '11', '0', '', '', '0', '2016-10-13 03:51:56', '0000-00-00 00:00:00'), ('15', 'User\\UserController@getPermissions', '10', '0', '', '', '0', '2016-10-13 03:53:04', '0000-00-00 00:00:00'), ('16', 'OMS\\OMSPBController@getDealList', '12', '0', '', '', '0', '2016-10-13 11:59:53', '2016-10-13 11:59:55'), ('17', 'OMS\\OMSPBController@getDealListFile', '13', '0', '', '', '0', '2016-10-13 04:37:43', '0000-00-00 00:00:00'), ('19', 'OMS\\OMSPageController@deal_search', '12', '0', '', '', '0', '2016-10-14 17:56:00', '0000-00-00 00:00:00'), ('20', 'OMS\\OMSApiController@get_settlement_info', '19', '1', 'product_id', '', '1', '2016-10-18 15:15:56', '2016-10-18 15:15:58'), ('21', 'OMS\\OMSApiController@get_multi_settlement_info', '19', '1', 'product_id', '', '1', '2016-10-18 07:55:26', '0000-00-00 00:00:00'), ('22', 'OMS\\OMSApiController@multi_position_realtime', '19', '1', 'product_id', '', '1', '2016-10-18 07:55:38', '0000-00-00 00:00:00'), ('23', 'OMS\\OMSApiFullStopController@set', '20', '1', 'product_id', '', '1', '2016-10-18 07:56:22', '0000-00-00 00:00:00'), ('24', 'OMS\\OMSController@get_frozen_fund_detail', '23', '1', 'id', '', '1', '2016-10-18 08:02:50', '0000-00-00 00:00:00'), ('25', 'OMS\\OMSController@exec_frozen_fund_update', '23', '1', 'id', '', '1', '2016-10-18 08:02:58', '0000-00-00 00:00:00'), ('26', 'OMS\\OMSController@get_hand_order_detail', '23', '1', 'id', '', '1', '2016-10-18 08:06:02', '0000-00-00 00:00:00'), ('27', 'OMS\\OMSController@get_hand_order_logs', '23', '1', 'id', 'App\\Services\\OMS\\OMSOrderService::get_product_id_by_delivery', '1', '2016-10-18 08:06:35', '0000-00-00 00:00:00'), ('28', 'OMS\\OMSController@exec_hand_order_update', '23', '1', 'delivery_id', 'App\\Services\\OMS\\OMSOrderService::get_product_id_by_delivery', '1', '2016-10-18 08:06:51', '0000-00-00 00:00:00'), ('29', 'OMS\\OMSController@get_gaosongzhuan_detail', '23', '1', 'id', 'App\\Services\\OMS\\OMSGaosongzhuanService::get_product_id_by_id', '1', '2016-10-18 08:09:05', '0000-00-00 00:00:00'), ('30', 'OMS\\OMSController@get_gaosongzhuan_logs', '23', '1', 'id', 'App\\Services\\OMS\\OMSGaosongzhuanService::get_product_id_by_id', '1', '2016-10-18 08:09:40', '0000-00-00 00:00:00'), ('31', 'OMS\\OMSController@exec_gaosongzhuan', '23', '1', 'gaosongzhuan_id', 'App\\Services\\OMS\\OMSGaosongzhuanService::get_product_id_by_id', '1', '2016-10-18 08:09:41', '0000-00-00 00:00:00'), ('32', 'OMS\\OMSController@exec_set_allocation', '21', '1', 'executor_id', 'App\\Services\\OMS\\OMSWorkflowEntrustService::get_product_id_by_entrust_id', '1', '2016-10-18 08:11:49', '0000-00-00 00:00:00'), ('33', 'OMS\\OMSHelperController@risk_position', '19', '1', 'product_id', '', '1', '2016-10-18 08:16:21', '0000-00-00 00:00:00'), ('34', 'OMS\\OMSHelperController@risk_settlement', '19', '1', 'product_id', '', '1', '2016-10-18 08:16:35', '0000-00-00 00:00:00'), ('35', 'OMS\\OMSPageController@detail', '19', '1', 'product_id', 'uri', '1', '2016-10-18 08:17:02', '0000-00-00 00:00:00'), ('36', 'OMS\\OMSReportController@output', '19', '1', 'product_id', 'uri', '1', '2016-10-18 08:17:38', '0000-00-00 00:00:00'), ('37', 'OMS\\OMSWorkflowController@add_hand_order', '20', '1', 'product_id', 'uri', '1', '2016-10-18 08:18:00', '0000-00-00 00:00:00'), ('38', 'OMS\\OMSWorkflowController@add_multi_hand_order', '20', '1', 'product_id', 'uri', '1', '2016-10-18 08:19:04', '0000-00-00 00:00:00'), ('39', 'OMS\\OMSWorkflowController@deal', '22', '1', 'product_id', 'uri', '1', '2016-10-18 08:19:44', '0000-00-00 00:00:00'), ('40', 'OMS\\OMSReportController@report_page', '19', '1', 'product_id', 'uri', '1', '2016-10-18 08:38:14', '0000-00-00 00:00:00'), ('41', 'OMS\\OMSPageController@gather', '15', '0', '', '', '1', '2016-10-18 08:48:03', '0000-00-00 00:00:00'), ('42', 'OMS\\OMSPageController@allocation', '14', '0', '', '', '1', '2016-10-18 08:48:10', '0000-00-00 00:00:00'), ('43', 'OMS\\OMSPageController@trader_gather', '16', '0', '', '', '1', '2016-10-18 08:48:19', '0000-00-00 00:00:00'), ('44', 'OMS\\OMSPageController@entrust_created', '16', '0', '', '', '1', '2016-10-18 08:48:31', '0000-00-00 00:00:00'), ('45', 'OMS\\OMSPageController@gaosongzhuan', '18', '0', '', '', '1', '2016-10-18 08:48:39', '0000-00-00 00:00:00'), ('46', 'OMS\\OMSPageController@hand_order', '18', '0', '', '', '1', '2016-10-18 08:48:46', '0000-00-00 00:00:00'), ('47', 'OMS\\OMSPageController@frozen_fund', '18', '0', '', '', '1', '2016-10-18 08:48:49', '0000-00-00 00:00:00'), ('48', 'OMS\\OMSPageController@portfolio', '18', '0', '', '', '1', '2016-10-18 08:48:56', '0000-00-00 00:00:00'), ('49', 'RISK\\RISKController@index', '17', '0', '', '', '1', '2016-10-18 08:49:07', '0000-00-00 00:00:00'), ('50', 'RISK\\RISKController@risky_list', '17', '0', '', '', '1', '2016-10-18 08:49:14', '0000-00-00 00:00:00');

-- 权限表
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `theme` varchar(20) NOT NULL,
  `category` varchar(200) NOT NULL,
  `name` varchar(200) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `permissions` VALUES ('1', 'gaoyi', '策略交易', '查看', '1', '2016-10-18 06:26:18', '2016-10-11 11:17:35'), ('2', 'gaoyi', '策略交易', '指令提交', '1', '2016-10-18 06:26:19', '2016-10-11 11:18:17'), ('3', 'gaoyi', '产品管理', '查看', '1', '2016-10-18 06:26:19', '2016-10-11 11:18:17'), ('4', 'gaoyi', '产品管理', '添加产品', '1', '2016-10-18 06:26:20', '2016-10-11 11:18:17'), ('5', 'gaoyi', '产品管理', '编辑产品', '1', '2016-10-18 06:26:21', '2016-10-11 11:18:17'), ('6', 'gaoyi', '用户管理', '查看', '1', '2016-10-18 06:26:21', '2016-10-11 11:18:17'), ('7', 'gaoyi', '用户管理', '添加用户', '1', '2016-10-18 06:26:22', '2016-10-11 11:18:17'), ('8', 'gaoyi', '用户管理', '用户编辑', '1', '2016-10-18 06:26:23', '2016-10-11 11:18:17'), ('9', 'gaoyi', '用户管理', '重置密码', '1', '2016-10-18 06:26:23', '2016-10-11 11:18:17'), ('10', 'gaoyi', '用户管理', '权限管理', '1', '2016-10-18 06:26:24', '2016-10-11 11:18:17'), ('11', 'gaoyi', '用户管理', '注销用户', '1', '2016-10-18 06:26:24', '2016-10-11 11:18:17'), ('12', 'gaoyi', '成交数据', '查看', '1', '2016-10-18 06:26:25', '2016-10-11 11:18:17'), ('13', 'gaoyi', '成交数据', '操作', '1', '2016-10-18 06:26:26', '2016-10-11 11:18:17'), ('14', 'gmf', '', '策略审核', '1', '2016-10-18 14:32:32', '2016-10-18 14:32:34'), ('15', 'gmf', '', '策略执行', '1', '2016-10-18 14:32:32', '2016-10-18 14:32:34'), ('16', 'gmf', '', '策略管理', '1', '2016-10-18 14:32:32', '2016-10-18 14:32:34'), ('17', 'gmf', '', '查看风控汇总', '1', '2016-10-18 14:32:32', '2016-10-18 14:32:34'), ('18', 'gmf', '', '高级任务管理', '1', '2016-10-18 14:32:32', '2016-10-18 14:32:34'), ('19', 'gmf', '', '查看组合', '1', '2016-10-18 14:32:32', '2016-10-18 14:32:34'), ('20', 'gmf', '', '策略下发', '1', '2016-10-18 14:32:32', '2016-10-18 14:32:34'), ('21', 'gmf', '', '策略审核', '1', '2016-10-18 14:32:32', '2016-10-18 14:32:34'), ('22', 'gmf', '', '策略执行', '1', '2016-10-18 14:32:32', '2016-10-18 14:32:34'), ('23', 'gmf', '', '高级管理', '1', '2016-10-18 14:32:32', '2016-10-18 14:32:34');

-- 用户权限表
CREATE TABLE `user_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` mediumint(9) NOT NULL,
  `product_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;