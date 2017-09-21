CREATE TABLE `instruction_positions` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `exec_user_id` char(12) CHARACTER SET utf8 NOT NULL COMMENT 'PB账号',
 `stock_code` char(10) CHARACTER SET utf8 NOT NULL COMMENT '股票ID',
 `hold_volume` decimal(13,2) NOT NULL COMMENT '持有数量',
 `can_use_volume` decimal(13,2) NOT NULL COMMENT '可用数量',
 `fund_id` int(11) NOT NULL COMMENT 'PB产品编号',
 `combi_id` int(11) NOT NULL COMMENT 'PB单元编号',
 `today_buy_volume` decimal(13,3) NOT NULL COMMENT '当日买入数量',
 `today_sell_volume` decimal(13,3) NOT NULL COMMENT '当日卖出数量',
 `total_cost` decimal(13,3) NOT NULL COMMENT '总成本',
 `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;