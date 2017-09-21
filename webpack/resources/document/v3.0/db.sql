CREATE TABLE `oms_v2`.`permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(200) NOT NULL,
  `name` varchar(200) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

INSERT INTO `oms_v2`.`permissions` VALUES ('1', '策略交易', '查看', '1', '2016-10-13 03:22:41', '2016-10-11 11:17:35'), ('2', '策略交易', '指令提交', '1', '2016-10-13 03:22:42', '2016-10-11 11:18:17'), ('3', '产品管理', '查看', '1', '2016-10-13 03:22:43', '2016-10-11 11:18:17'), ('4', '产品管理', '添加产品', '1', '2016-10-13 03:22:44', '2016-10-11 11:18:17'), ('5', '产品管理', '编辑产品', '1', '2016-10-13 03:22:45', '2016-10-11 11:18:17'), ('6', '用户管理', '查看', '1', '2016-10-13 03:22:46', '2016-10-11 11:18:17'), ('7', '用户管理', '添加用户', '1', '2016-10-13 03:22:47', '2016-10-11 11:18:17'), ('8', '用户管理', '用户编辑', '1', '2016-10-13 03:22:49', '2016-10-11 11:18:17'), ('9', '用户管理', '重置密码', '1', '2016-10-13 03:22:50', '2016-10-11 11:18:17'), ('10', '用户管理', '权限管理', '1', '2016-10-13 03:22:51', '2016-10-11 11:18:17'), ('11', '用户管理', '注销用户', '1', '2016-10-13 03:22:53', '2016-10-11 11:18:17'), ('12', '成交数据', '查看', '1', '2016-10-13 03:22:54', '2016-10-11 11:18:17'), ('13', '成交数据', '操作', '1', '2016-10-13 03:22:55', '2016-10-11 11:18:17');


CREATE TABLE `oms_v2`.`func_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `func` varchar(100) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `idx_func` (`func`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

INSERT INTO `oms_v2`.`func_permission` VALUES ('1', 'OMS\\OMSPageController@multi_products', '1', '1', '2016-10-11 03:34:35', '2016-10-11 11:36:29'), ('2', 'OMS\\OMSInstructionController@getList', '1', '1', '2016-10-13 03:27:49', '0000-00-00 00:00:00'), ('3', 'OMS\\OMSInstructionController@postAddOrder', '2', '1', '2016-10-13 03:31:45', '0000-00-00 00:00:00'), ('4', 'OMS\\OMSInstructionController@postCancelOrder', '2', '1', '2016-10-13 03:32:46', '0000-00-00 00:00:00'), ('5', 'OMS\\OMSInstructionController@getHistoryList', '1', '1', '2016-10-13 03:33:36', '0000-00-00 00:00:00'), ('6', 'User\\UserController@get_user_list', '6', '1', '2016-10-13 11:38:58', '0000-00-00 00:00:00'), ('7', 'User\\UserController@createUser', '7', '1', '2016-10-13 03:46:56', '0000-00-00 00:00:00'), ('8', 'User\\UserController@postModify', '8', '1', '2016-10-13 03:47:02', '0000-00-00 00:00:00'), ('9', 'User\\UserController@resetPassword', '9', '1', '2016-10-13 03:47:06', '0000-00-00 00:00:00'), ('10', 'User\\UserController@postPermissions', '10', '1', '2016-10-13 03:47:09', '0000-00-00 00:00:00'), ('11', 'Product\\ProductController@getProductList', '3', '1', '2016-10-13 03:48:32', '0000-00-00 00:00:00'), ('12', 'Product\\ProductController@postAdd', '4', '1', '2016-10-13 03:49:14', '0000-00-00 00:00:00'), ('13', 'Product\\ProductController@postModify', '5', '1', '2016-10-13 03:49:23', '0000-00-00 00:00:00'), ('14', 'User\\UserController@unsetUser', '11', '1', '2016-10-13 03:51:56', '0000-00-00 00:00:00'), ('15', 'User\\UserController@getPermissions', '10', '1', '2016-10-13 03:53:04', '0000-00-00 00:00:00'), ('16', 'OMS\\OMSPBController@getDealList', '12', '1', '2016-10-13 11:59:53', '2016-10-13 11:59:55'), ('17', 'OMS\\OMSPBController@getDealListFile', '13', '1', '2016-10-13 04:37:43', '0000-00-00 00:00:00'), ('19', 'OMS\\OMSPageController@deal_search', '12', '1', '2016-10-14 17:56:00', '0000-00-00 00:00:00');


CREATE TABLE `oms_v2`.`user_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` mediumint(9) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;