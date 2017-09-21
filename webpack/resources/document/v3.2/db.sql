ALTER TABLE `oms_v3`.`func_permission` ADD `sys` VARCHAR(20)  NOT NULL  DEFAULT 'oms'  AFTER `id`;
UPDATE `oms_v3`.`func_permission` set sys='oms';
--插入风控系统权限初始化数据  buty
INSERT INTO `oms_v3`.`func_permission` (`id`, `func`, `sys`, `permission_id`, `check_product`, `input_param`, `get_method`, `status`, `created_at`, `updated_at`) VALUES
(NULL, 'StockPool\\IndexController@getStockList', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29'),
(NULL, 'StockPool\\IndexController@getList', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29'),
(NULL, 'StockPool\\AddController@postData', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29'),
(NULL, 'Rule\\IndexController@getList', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29'),
(NULL, 'Rule\\IndexController@getProductRiskBrief', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29'),
(NULL, 'Rule\\AddController@postData', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29'),
(NULL, 'Rule\\ModifyController@postData', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29'),
(NULL, 'Rule\\DeleteController@postData', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29'),
(NULL, 'Rule\\CopyController@postData', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29'),
(NULL, 'StockPool\\IndexController@getList', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29'),
(NULL, 'StockPool\\IndexController@getStockList', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29'),
(NULL, 'StockPool\\AddController@postData', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29'),
(NULL, 'Rule\\StatusController@getList', 'rms', 17, 0, '', '', 1, '2016-10-11 03:34:35', '2016-10-11 11:36:29');

INSERT INTO `oms_v3`.`securities_status` (`securities_id`, `status_desc`, `oms_status`, `deal_flag`, `is_cancel`, `created_at`, `updated_at`)
VALUES
	('pb', '5', 0, 2, 0, '2016-11-24 12:23:24', '0000-00-00 00:00:00'),
	('pb', '6', 0, 1, 0, '2016-11-03 06:30:02', '0000-00-00 00:00:00'),
	('pb', '7', 0, 1, 0, '2016-11-25 08:23:07', '0000-00-00 00:00:00'),
	('pb', '8', 0, 1, 1, '2016-11-24 12:23:24', '0000-00-00 00:00:00'),
	('pb', '9', 0, 1, 1, '2016-11-30 06:36:22', '0000-00-00 00:00:00');