TRUNCATE `gmf_bms`.`organizations`;
TRUNCATE `gmf_bms`.`product_oms`;
TRUNCATE `gmf_bms`.`users`;
TRUNCATE `gmf_bms`.`users_info`;
TRUNCATE `gmf_bms`.`user_roles`;
TRUNCATE `gmf_bms`.`product_base`;
INSERT INTO `gmf_bms`.`organizations` (`id`, `max_user`, `theme`, `version`, `created_at`, `updated_at`)
VALUES (1, 1000, '2', 1, now(), now());

INSERT INTO `gmf_bms`.`product_base` (`id`, `org_id`, `name`, `account_id`, `securities_id`, `securities_name`, `server_host`, `server_port`, `fee_mode`, `fund_id`, `asset_id`, `combi_id`, `status`, `created_at`, `updated_at`, `need_entrust`, `need_deal`)
VALUES (10000, 1, 'pbzs', '1222000', 'pb', '恒生', '10.28.140.50', 21012, 2, 232, 724, 0, 1, now(), now(), 1, 1);

INSERT INTO `gmf_bms`.`users` (`id`, `cellphone`, `password`, `account_type`, `status`, `updated_at`, `created_at`)
VALUES (10000, '', '$2y$10$m4Ifu/aZXBd9p8UJqh.zauaNt4jlFI5jwXSgfT8heP.jHBFTMwhrW', 0, 1, now(), now());


INSERT INTO `gmf_bms`.`users_info` (`user_id`, `org_id`, `nick_name`, `real_name`, `avatar_url`, `last_login_time`, `role_id`, `is_specify`, `created_at`, `updated_at`)
VALUES (10000, 1, '超级管理员', '超级管理员', 'https://dn-gmf-product-face.qbox.me/operator_default_avatar.png?imageView2/2/w/200/q/200', now(), 1, 0, now(), now());

INSERT INTO `gmf_bms`.`user_roles` (`org_id`, `user_id`, `role_id`, `status`, `created_at`, `updated_at`)
VALUES ( 1, 10000, 1, 1, now(), now());

TRUNCATE `oms_v3`.`base_account`;
TRUNCATE `oms_v3`.`base_deal`;
TRUNCATE `oms_v3`.`base_entrust`;
TRUNCATE `oms_v3`.`base_position`;

TRUNCATE `oms_v3`.`func_permission`;
INSERT INTO `oms_v3`.`func_permission` (`sys`, `func`, `permission_id`, `check_product`, `get_method`, `status`, `created_at`, `updated_at`)
VALUES
	('oms', 'OMS\\OMSApiController@get_multi_settlement_info', 20, 1, 'product_id', '', 1, now(), now()),
	('oms', 'OMS\\OMSApiController@multi_position_realtime', 20, 1, 'product_id', '', 1, now(), now()),
	('oms', 'OMS\\OMSApiFullStopController@set', 20, 1, 'product_id', '', 1, now(), now()),
	('oms', 'OMS\\OMSController@get_frozen_fund_detail', 23, 1, 'id', '', 1, now(), now()),
	('oms', 'OMS\\OMSController@exec_frozen_fund_update', 23, 1, 'id', '', 1, now(), now()),
	('oms', 'OMS\\OMSController@get_hand_order_detail', 23, 1, 'id', '', 1, now(), now()),
	('oms', 'OMS\\OMSController@get_hand_order_logs', 23, 1, 'id', 'App\\Services\\OMS\\OMSOrderService::get_product_id_by_delivery', 1, now(), now()),
	('oms', 'OMS\\OMSController@exec_hand_order_update', 23, 1, 'delivery_id', 'App\\Services\\OMS\\OMSOrderService::get_product_id_by_delivery', 1, now(), now()),
	('oms', 'OMS\\OMSController@get_gaosongzhuan_detail', 23, 1, 'id', 'App\\Services\\OMS\\OMSGaosongzhuanService::get_product_id_by_id', 1, now(), now()),
	('oms', 'OMS\\OMSController@get_gaosongzhuan_logs', 23, 1, 'id', 'App\\Services\\OMS\\OMSGaosongzhuanService::get_product_id_by_id', 1, now(), now()),
	('oms', 'OMS\\OMSController@exec_gaosongzhuan', 23, 1, 'gaosongzhuan_id', 'App\\Services\\OMS\\OMSGaosongzhuanService::get_product_id_by_id', 1, now(), now()),
	('oms', 'OMS\\OMSController@exec_set_allocation', 21, 1, 'executor_id', 'App\\Services\\OMS\\OMSWorkflowEntrustService::get_product_id_by_entrust_id', 1, now(), now()),
	('oms', 'OMS\\OMSHelperController@risk_position', 20, 1, 'product_id', '', 1, now(), now()),
	('oms', 'OMS\\OMSHelperController@risk_settlement', 20, 1, 'product_id', '', 1, now(), now()),
	('oms', 'OMS\\OMSPageController@detail', 20, 1, 'product_id', 'uri', 1, now(), now()),
	('oms', 'OMS\\OMSReportController@output', 20, 1, 'product_id', 'uri', 1, now(), now()),
	('oms', 'OMS\\OMSWorkflowController@add_hand_order', 20, 1, 'product_id', 'uri', 1, now(), now()),
	('oms', 'OMS\\OMSWorkflowController@add_multi_hand_order', 20, 1, 'product_id', 'uri', 1, now(), now()),
	('oms', 'OMS\\OMSWorkflowController@deal', 22, 1, 'product_id', 'uri', 1, now(), now()),
	('oms', 'OMS\\OMSReportController@report_page', 20, 1, 'product_id', 'uri', 1, now(), now()),
	('oms', 'OMS\\OMSPageController@trader_gather', 22, 0, '', '', 1, now(), now()),
	('oms', 'OMS\\OMSPageController@entrust_created', 23, 0, '', '', 1, now(), now()),
	('oms', 'OMS\\OMSPageController@gaosongzhuan', 23, 0, '', '', 1, now(), now()),
	('oms', 'OMS\\OMSPageController@hand_order', 23, 0, '', '', 1, now(), now()),
	('oms', 'OMS\\OMSPageController@frozen_fund', 23, 0, '', '', 1, now(), now()),
	('oms', 'OMS\\OMSPageController@portfolio', 23, 0, '', '', 1, now(), now()),
	('oms', 'RISK\\RISKController@index', 24, 0, '', '', 1, now(), now()),
	('oms', 'RISK\\RISKController@risky_list', 24, 0, '', '', 1, now(), now()),
	('rms', 'StockPool\\IndexController@getStockList', 24, 0, '', '', 1, now(), now()),
	('rms', 'StockPool\\IndexController@getList', 24, 0, '', '', 1, now(), now()),
	('rms', 'StockPool\\AddController@postData', 24, 0, '', '', 1, now(), now()),
	('rms', 'Rule\\IndexController@getList', 24, 0, '', '', 1, now(), now()),
	('rms', 'Rule\\IndexController@getProductRiskBrief', 24, 0, '', '', 1, now(), now()),
	('rms', 'Rule\\AddController@postData', 24, 0, '', '', 1, now(), now()),
	('rms', 'Rule\\ModifyController@postData', 24, 0, '', '', 1, now(), now()),
	('rms', 'Rule\\DeleteController@postData', 24, 0, '', '', 1, now(), now()),
	('rms', 'Rule\\CopyController@postData', 24, 0, '', '', 1, now(), now()),
	('rms', 'StockPool\\IndexController@getList', 24, 0, '', '', 1, now(), now()),
	('rms', 'StockPool\\IndexController@getStockList', 24, 0, '', '', 1, now(), now()),
	('rms', 'StockPool\\AddController@postData', 24, 0, '', '', 1, now(), now()),
	('rms', 'Rule\\StatusController@getList', 24, 0, '', '', 1, now(), now()),
	('oms', 'Product\\ProductController@getRiskCompare', 41, 0, '', '', 1, now(), now()),
	('oms', 'OMS\\OMSReportController@get_monitor_data', 41, 0, '', '', 1, now(), now()),
	('oms', 'OMS\\OMSReportController@download_monitor_list', 41, 0, '', '', 1, now(), now()),
	('oms', 'OMS\\OMSReportController@get_monitor_list', 41, 0, '', '', 1, now(), now()),
	('oms', 'Product\\ProductController@addChild', 27, 0, '', '', 1, now(), now()),
	('oms', 'Product\\ProductController@delUser', 29, 1, 'product_id', '', 1, now(), now()),
	('oms', 'Product\\ProductController@postAddChild', 27, 0, '', '', 1, now(), now()),
	('oms', 'Product\\ProductController@riskSetting', 24, 1, 'product_id', '', 1, now(), now()),
	('oms', 'Product\\ProductController@riskAdd', 24, 0, '', '', 1, now(), now()),
	('oms', 'Product\\ProductController@feeSetting', 30, 1, 'product_id', '', 1, now(), now()),
	('oms', 'Product\\ProductController@cashSetting', 31, 1, 'product_id', '', 1, now(), now()),
	('oms', 'Product\\ProductController@baseSetting', 28, 1, 'product_id', '', 1, now(), now()),
	('oms', 'Product\\ProductController@userSetting', 29, 1, 'product_id', '', 1, now(), now()),
	('oms', 'OMSWorkflowV2\\AddHandleOrderController@postOne', 20, 1, 'product_id', 'uri', 1, now(), now()),
	('oms', 'OMSWorkflowV2\\AddHandleOrderController@add_multi_hand_order', 20, 0, '', '', 1, now(), now()),
	('bms', 'User\\UserController@cancel_user', 34, 0, '', '', 1, now(), now()),
	('bms', 'User\\UserController@register', 32, 0, '', '', 1, now(), now()),
	('bms', 'User\\UserController@modify_password', 33, 0, '', '', 1, now(), now()),
	('bms', 'User\\UserController@modify', 32, 0, '', '', 1, now(), now()),
	('oms', 'OMS\\OMSPageController@gather', 22, 0, '', '', 1, now(), now()),
	('oms', 'OMS\\OMSPageController@allocation', 21, 0, '', '', 1, now(), now());


TRUNCATE `oms_v3`.`instructions`;
TRUNCATE `oms_v3`.`permissions`;

INSERT INTO `oms_v3`.`permissions` (`id`, `theme`, `category`, `name`, `status`, `created_at`, `updated_at`)
VALUES
	(20, 'oms', '委托提交', '投资建议提交', 1, now(), now()),
	(21, 'oms', '委托执行', '投资建议分配', 1, now(), now()),
	(22, 'oms', '委托执行', '投资建议执行', 1, now(), now()),
	(23, 'oms', '委托执行', '转送派息处理', 1, now(), now()),
	(24, 'oms', '风险监控', '风控管理', 1, now(), now()),
	(25, 'oms', '委托执行', '异常单处理', 1, now(), now()),
	(26, 'oms', '账户管理', '风控设置', 1, now(), now()),
	(27, 'oms', '账户管理', '新建策略', 1, now(), now()),
	(28, 'oms', '账户管理', '基础设置', 1, now(), now()),
	(29, 'oms', '账户管理', '人员设置', 1, now(), now()),
	(30, 'oms', '账户管理', '费用设置', 1, now(), now()),
	(31, 'oms', '账户管理', '资金设置', 1, now(), now()),
	(32, 'oms', '用户管理', '创建编辑', 1, now(), now()),
	(33, 'oms', '用户管理', '重置密码', 1, now(), now()),
	(34, 'oms', '用户管理', '注销用户', 1, now(), now()),
	(35, 'oms', '数据查询', '指令查询', 1, now(), now()),
	(36, 'oms', '数据查询', '委托查询', 1, now(), now()),
	(37, 'oms', '数据查询', '成交查询', 1, now(), now()),
	(38, 'oms', '数据查询', '持仓查询', 1, now(), now()),
	(39, 'oms', '数据查询', '清算查询', 1, now(), now()),
	(40, 'oms', '数据查询', '资金查询', 1, now(), now()),
	(41, 'oms', '数据监控', '数据监控核对', 1, now(), now()),
	(42, 'oms', '指令提交', '指令提交', 1, now(), now());



TRUNCATE `oms_v3`.`portfolio_fee_params`;
TRUNCATE `oms_v3`.`portfolio_fund_adjustment`;
TRUNCATE `oms_v3`.`portfolio_log`;
TRUNCATE `oms_v3`.`portfolio_position`;
TRUNCATE `oms_v3`.`portfolio_role`;
TRUNCATE `oms_v3`.`portfolio_settlement`;
TRUNCATE `oms_v3`.`portfolio_stats_account`;
TRUNCATE `oms_v3`.`portfolio_stats_position`;
TRUNCATE `oms_v3`.`portfolio_template`;
INSERT INTO `oms_v3`.`portfolio_template` (`tpl_type`, `org_id`, `tpl_cont`, `status`, `created_at`, `updated_at`)
VALUES (1, 1, '[{\"fee_type\":\"1\",\"fee_rate\":\"1.000000\",\"fee_upper_limit\":\"0.00000\",\"fee_lower_limit\":\"0.00000\",\"status\":\"0\",\"market\":\"1\"},{\"fee_type\":\"2\",\"fee_rate\":\"0.020000\",\"fee_upper_limit\":\"1.00000\",\"fee_lower_limit\":\"0.00000\",\"status\":\"0\",\"market\":\"1\"},{\"fee_type\":\"3\",\"fee_rate\":\"0.069600\",\"fee_upper_limit\":\"0.00000\",\"fee_lower_limit\":\"0.00000\",\"status\":\"0\",\"market\":\"1\"},{\"fee_type\":\"4\",\"fee_rate\":\"0.200000\",\"fee_upper_limit\":\"0.00000\",\"fee_lower_limit\":\"0.00000\",\"status\":\"0\",\"market\":\"1\"},{\"fee_type\":\"5\",\"fee_rate\":\"0.300000\",\"fee_upper_limit\":\"0.00000\",\"fee_lower_limit\":\"5.00000\",\"status\":\"0\",\"market\":\"1\"},{\"fee_type\":\"6\",\"fee_rate\":\"20.000000\",\"fee_upper_limit\":\"0.00000\",\"fee_lower_limit\":\"0.00000\",\"status\":\"0\",\"market\":\"0\"},{\"fee_type\":\"7\",\"fee_rate\":\"10.000000\",\"fee_upper_limit\":\"0.00000\",\"fee_lower_limit\":\"0.00000\",\"status\":\"0\",\"market\":\"0\"},{\"fee_type\":\"3\",\"fee_rate\":\"0.004500\",\"fee_upper_limit\":\"0.00000\",\"fee_lower_limit\":\"0.00000\",\"status\":\"0\",\"market\":\"2\"},{\"fee_type\":\"5\",\"fee_rate\":\"0.300000\",\"fee_upper_limit\":\"0.00000\",\"fee_lower_limit\":\"5.00000\",\"status\":\"0\",\"market\":\"2\"}]', 0, now(), now());

TRUNCATE `oms_v3`.`roboter_info`;
TRUNCATE `oms_v3`.`roboter_list`;

TRUNCATE `oms_v3`.`role_permissions`;
INSERT INTO `oms_v3`.`role_permissions` (`org_id`, `role_id`, `permission_id`, `created_at`, `updated_at`)
VALUES
	(1, 11, 20, now(), now()),
	(1, 11, 35, now(), now()),
	(1, 11, 36, now(), now()),
	(1, 11, 37, now(), now()),
	(1, 11, 38, now(), now()),
	(1, 11, 39, now(), now()),
	(1, 11, 40, now(), now()),
	(1, 12, 21, now(), now()),
	(1, 12, 22, now(), now()),
	(1, 12, 25, now(), now()),
	(1, 12, 41, now(), now()),
	(1, 12, 23, now(), now()),
	(1, 12, 35, now(), now()),
	(1, 12, 36, now(), now()),
	(1, 12, 37, now(), now()),
	(1, 12, 38, now(), now()),
	(1, 12, 39, now(), now()),
	(1, 12, 40, now(), now()),
	(1, 13, 26, now(), now()),
	(1, 13, 24, now(), now()),
	(1, 1, 20, now(), now()),
  (1, 1, 21, now(), now()),
  (1, 1, 22, now(), now()),
  (1, 1, 23, now(), now()),
  (1, 1, 24, now(), now()),
  (1, 1, 26, now(), now()),
  (1, 1, 27, now(), now()),
  (1, 1, 28, now(), now()),
  (1, 1, 29, now(), now()),
  (1, 1, 30, now(), now()),
  (1, 1, 31, now(), now()),
  (1, 1, 32, now(), now()),
  (1, 1, 33, now(), now()),
  (1, 1, 34, now(), now()),
  (1, 1, 35, now(), now()),
  (1, 1, 36, now(), now()),
  (1, 1, 37, now(), now()),
  (1, 1, 38, now(), now()),
  (1, 1, 39, now(), now()),
  (1, 1, 40, now(), now()),
  (1, 1, 41, now(), now());

TRUNCATE `oms_v3`.`securities_status`;
INSERT INTO `oms_v3`.`securities_status` (`id`, `securities_id`, `status_desc`, `oms_status`, `deal_flag`, `is_cancel`, `created_at`, `updated_at`)
VALUES
	(1, 'gx', '撤单废单', 0, 2, 1, now(), now()),
	(2, 'gx', '废单', 0, 2, 0, now(), now()),
	(3, 'gx', '内部撤单', 0, 1, 1, now(), now()),
	(4, 'gx', '普通成交', 0, 1, 0, now(), now()),
	(5, 'gx', '撤单成交', 0, 1, 1, now(), now()),
	(6, 'ht', '废单', 0, 2, 0, now(), now()),
	(7, 'ht', '部撤', 0, 1, 1, now(), now()),
	(8, 'ht', '已撤', 0, 1, 1, now(), now()),
	(9, 'ht', '已成', 0, 1, 0, now(), now()),
	(10, 'ht', '成交', 0, 1, 0, now(), now()),
	(11, 'pb', '6', 0, 1, 0, now(), now()),
	(12, 'pb', '8', 0, 1, 1, now(), now()),
	(13, 'pb', '5', 0, 2, 0, now(), now()),
	(14, 'pb', '7', 0, 1, 0, now(), now()),
	(16, 'pb', '9', 0, 1, 1, now(), now()),
  (17, 'jz', '0', 0, 1, 0, now(), now()),
  (18, 'jz', '1', 0, 1, 1, now(), now()),
  (19, 'jz', '2', 0, 2, 0, now(), now()),
  (20, 'jz', 'R', 0, 2, 1, now(), now()),
	(21, 'jiuz', '废单', 0, 2, 0, now(), now()),
	(22, 'jiuz', '部撤', 0, 1, 1, now(), now()),
	(23, 'jiuz', '已撤', 0, 1, 1, now(), now()),
	(24, 'jiuz', '已成', 0, 1, 0, now(), now()),
	(25, 'jiuz', '成交', 0, 1, 0, now(), now());

TRUNCATE `oms_v3`.`stock_deal`;
TRUNCATE `oms_v3`.`stock_delivery`;
TRUNCATE `oms_v3`.`stock_equity_change`;
TRUNCATE `oms_v3`.`stock_follow`;
TRUNCATE `oms_v3`.`stock_frozen_fund`;
TRUNCATE `oms_v3`.`stock_order_list`;
TRUNCATE `oms_v3`.`stock_user_config`;
INSERT INTO `oms_v3`.`stock_user_config` (`id`, `user_id`, `type`, `config_val`, `config_desc`, `created_at`, `updated_at`)
VALUES
	(1, 0, 'SH', '8', '最优五档即时成交剩余转限', now(), now()),
	(2, 0, '2', '8', 'SH', now(), now()),
	(3, 0, '2', '3', 'SZ', now(), now()),
	(4, 0, 'SZ', '3', '对手方最优价格', now(), now()),
	(5, 0, 'SZ', '4', '本方最优价格 ', now(), now());

TRUNCATE `oms_v3`.`user_permission`;
TRUNCATE `oms_v3`.`user_permission_log`;
TRUNCATE `oms_v3`.`user_permissions`;
TRUNCATE `oms_v3`.`user_products`;
TRUNCATE `oms_v3`.`users`;
TRUNCATE `oms_v3`.`workflow_entrust`;
TRUNCATE `oms_v3`.`workflow_gaosongzhuan`;
TRUNCATE `oms_v3`.`workflow_log`;
TRUNCATE `oms_v3`.`workflow_original_ploy`;
TRUNCATE `oms_v3`.`zhongxin_imported`;


TRUNCATE `risk_management`.`order_list`;
TRUNCATE `risk_management`.`password_resets`;
TRUNCATE `risk_management`.`product_extend`;
TRUNCATE `risk_management`.`risk_rules`;
TRUNCATE `risk_management`.`stock_pools`;
TRUNCATE `risk_management`.`stock_pools_content`;
TRUNCATE `risk_management`.`users`;
TRUNCATE `risk_management`.`risk_tpl`;
INSERT INTO `risk_management`.`risk_tpl` (`rule_id`, `org_id`, `risk_type`, `pre_val_0`, `pre_val_1`, `pre_val_2`, `pre_val_3`, `pre_val_4`, `pre_val_5`, `limit_val_0`, `limit_val_1`, `limit_val_2`, `limit_val_3`, `limit_val_4`, `limit_val_5`, `limit_action`, `status`, `created_at`, `updated_at`)
VALUES
	(1, 1, 3, '-1', '0', '0', '0', '0', '0', '50', '0', '0', '0', '0', '0', 1, 0, now(), now()),
	(2, 1, 1, '-2', '0', '0', '0', '0', '0', '-1', '0', '0', '0', '0', '0', 1, 0, now(), now()),
	(3, 1, 3, '-3', '0', '0', '0', '0', '0', '30', '0', '0', '0', '0', '0', 1, 0, now(), now()),
	(4, 1, 2, '1', '0', '0', '0', '0', '0', '40', '0', '0', '0', '0', '0', 1, 0, now(), now()),
	(5, 1, 2, '0.8', '', '', '', '', '', '10', '', '', '', '', '', 1, 0, now(), now()),
	(6, 1, 2, '0.725', '', '', '', '', '', '0', '', '', '', '', '', 1, 0, now(), now());




