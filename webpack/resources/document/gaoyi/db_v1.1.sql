-- 撤消状态
ALTER TABLE `instructions` ADD `cancel_status` char( 2 ) NOT NULL COMMENT '0:无撤消 1:等待撤消 2:正在撤消 3:pb撤消完成 4:内部撤消完成';

-- 状态字段改为char
ALTER TABLE `instructions` CHANGE `ins_status` `ins_status` CHAR( 2 ) NOT NULL COMMENT '指令状态  0:等待更新 1:有效指令 2:全部成交 3:已撤销 4:部分撤销',
CHANGE `appr_status` `appr_status` CHAR( 2 ) NOT NULL COMMENT '审批状态 0:等待更新 1:待审批 2:审批通过 3:审批被拒',
CHANGE `dispense_status` `dispense_status` CHAR( 2 ) NOT NULL COMMENT '分发状态 0:等待更新 1:待分发 2:已分发',
CHANGE `entrust_status` `entrust_status` CHAR( 2 ) NOT NULL DEFAULT '0' COMMENT '委托状态',
CHANGE `deal_status` `deal_status` CHAR( 2 ) NOT NULL DEFAULT '0' COMMENT '成交状态',
CHANGE `cancel_status` `cancel_status` CHAR( 2 ) NOT NULL DEFAULT '0' COMMENT '0:无撤消 1:等待撤消 2:正在撤消 3:pb撤消完成 4:内部撤消完成';


-- 指令列表新增结束日期和时间
ALTER TABLE `instructions` ADD `end_time` VARCHAR( 10 ) NOT NULL COMMENT '结束时间';

-- pb系统参数
CREATE TABLE `pb_sys_params` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `dic_no` int(11) NOT NULL COMMENT '字典编号',
 `lemma_item` varchar(20) NOT NULL COMMENT '词目',
 `item_name` varchar(24) NOT NULL COMMENT '名称',
 `opposite_no` varchar(11) NOT NULL,
 `opposite_item` varchar(20) NOT NULL,
 `virtual_key` varchar(20) NOT NULL,
 `ts_string` varchar(18) NOT NULL COMMENT '时间字符串',
 `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 PRIMARY KEY (`id`),
 KEY `dic_no` (`dic_no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- pb系统用户
CREATE TABLE `pb_sys_users` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `l_no` varchar(16) NOT NULL,
 `exec_user_id` varchar(16) NOT NULL COMMENT '执行者ID',
 `name` varchar(24) NOT NULL,
 `status` int(11) NOT NULL,
 `m_rights` varchar(100) NOT NULL,
 `stockcode_type` varchar(4) NOT NULL,
 `org_id` int(11) NOT NULL,
 `combi_asset_rights` varchar(100) NOT NULL,
 `is_admin` int(11) NOT NULL,
 `vc_no` varchar(16) NOT NULL,
 `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 PRIMARY KEY (`id`),
 KEY `l_no` (`l_no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;