-- 指令
CREATE TABLE `instructions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ps_id` int(11) NOT NULL COMMENT '父子令ID',
  `sponor_user_id` int(11) NOT NULL COMMENT '指令发起者',
  `proxy_user_id` int(11) NOT NULL COMMENT '代理转发者',
  `accept_user_id` int(11) NOT NULL COMMENT '指令接收者',
  `exec_user_id` varchar(16) NOT NULL COMMENT '指令执行者',
  `product_id` int(11) NOT NULL,
  `fund_id` int(11) NOT NULL COMMENT '产品ID',
  `combi_id` int(11) NOT NULL COMMENT '单元ID',
  `stock_code` char(10) NOT NULL COMMENT '股票ID',
  `stock_name` varchar(16) NOT NULL,
  `exchange` int(11) NOT NULL COMMENT '1:上海 2:深圳',
  `ins_price` decimal(13,4) NOT NULL COMMENT '指令价格',
  `ins_type` int(11) NOT NULL COMMENT '指令类型 1:买 2:卖',
  `ins_model` int(11) NOT NULL COMMENT '1:限价 2:市价',
  `ins_volume` decimal(13,2) NOT NULL COMMENT '指令数量',
  `ins_amount` decimal(13,3) NOT NULL COMMENT '指令金额',
  `ins_order_id` varchar(40) NOT NULL COMMENT 'PB指令ID',
  `expire_date` date NOT NULL COMMENT '指令有效期',
  `is_sub_ins` int(11) NOT NULL DEFAULT '0' COMMENT '是否为子指令',
  `sub_ins_num` int(11) NOT NULL COMMENT '子指令数量',
  `entrust_volume` decimal(13,2) NOT NULL COMMENT '已委托数量',
  `fact_price` decimal(13,4) NOT NULL COMMENT '实际价格',
  `deal_volume` decimal(13,2) NOT NULL COMMENT '成交数量',
  `deal_amount` decimal(13,3) NOT NULL COMMENT '成交金额',
  `ins_status` int(11) NOT NULL COMMENT '指令状态  0:等待更新 1:有效指令 2:全部成交 3:已撤销 4:部分撤销',
  `ins_error_msg` varchar(100) NOT NULL COMMENT '下单错误信息',
  `appr_status` int(11) NOT NULL COMMENT '审批状态 0:等待更新 1:待审批 2:审批通过 3:审批被拒',
  `is_exec_query` int(11) NOT NULL COMMENT '0:未执行查询 1:已执行查询',
  `exec_query_time` int(11) NOT NULL COMMENT '执行查询时间',
  `dispense_status` int(11) NOT NULL COMMENT '分发状态 0:等待更新 1:待分发 2:已分发',
  `issue_datetime` varchar(20) NOT NULL COMMENT '指令下发时间',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `fund_id` (`fund_id`,`combi_id`),
  KEY `sponor_user_id` (`sponor_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- 指令委托
CREATE TABLE `instruction_entrusts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entrust_no` varchar(16) NOT NULL COMMENT '委托ID',
  `product_id` int(11) NOT NULL,
  `fund_id` int(11) NOT NULL COMMENT '产品单元',
  `combi_id` int(11) NOT NULL COMMENT '产品单元ID',
  `exec_user_id` varchar(20) NOT NULL,
  `stock_code` char(10) NOT NULL COMMENT '股票ID',
  `stock_name` varchar(24) NOT NULL,
  `entrust_type` int(11) NOT NULL COMMENT '1:买入 2:卖出',
  `entrust_price` decimal(13,4) NOT NULL COMMENT '委托价格',
  `entrust_volume` decimal(13,2) NOT NULL COMMENT '委托数量',
  `entrust_amount` decimal(13,3) NOT NULL COMMENT '委托金额',
  `entrust_status` int(11) NOT NULL COMMENT '委托状态',
  `revoke_cause` varchar(100) NOT NULL,
  `entrust_datetime` char(20) NOT NULL COMMENT '委托时间',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `entrust_no` (`entrust_no`),
  KEY `fund_id` (`fund_id`,`combi_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- 指令成交
CREATE TABLE `instruction_deals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `fund_id` int(11) NOT NULL COMMENT '产品单元',
  `combi_id` int(11) NOT NULL,
  `exec_user_id` varchar(20) NOT NULL,
  `entrust_no` int(11) NOT NULL,
  `deal_no` int(11) NOT NULL,
  `stock_code` varchar(10) NOT NULL COMMENT '股票ID',
  `stock_name` varchar(20) NOT NULL,
  `deal_type` int(11) NOT NULL COMMENT '1:买入 2:卖出',
  `deal_price` decimal(13,4) NOT NULL COMMENT '成交价格',
  `deal_avg_price` decimal(13,4) NOT NULL COMMENT '成交均价',
  `deal_volume` decimal(13,2) NOT NULL COMMENT '成交数量',
  `deal_amount` decimal(13,3) NOT NULL COMMENT '成交金额',
  `deal_datetime` varchar(20) NOT NULL COMMENT '成交时间',
  `busin_class` int(11) NOT NULL COMMENT '交易类型',
  `market_no` int(11) NOT NULL COMMENT '市场',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `fund_id` (`fund_id`,`combi_id`),
  KEY `deal_no` (`deal_no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- 新增指令成交，委托状态
ALTER TABLE `instructions` ADD `entrust_status` INT NOT NULL DEFAULT '0' COMMENT '委托状态',
ADD `deal_status` INT NOT NULL DEFAULT '0' COMMENT '成交状态';

-- 新增指令下达者姓名
ALTER TABLE `instructions` ADD `sponor_username` VARCHAR( 24 ) NOT NULL COMMENT '下达者' AFTER `sponor_user_id`;



-- 撤单处理
ALTER TABLE `instructions` ADD `ins_id` VARCHAR( 40 ) NOT NULL COMMENT '指令ID',
ADD `cancel_reason` VARCHAR( 100 ) NOT NULL COMMENT '撤消原因';

-- 区分数据来源
ALTER TABLE `instructions` ADD `data_source` ENUM( 'SYS', 'PB' ) NOT NULL DEFAULT 'SYS' AFTER `cancel_reason`;






