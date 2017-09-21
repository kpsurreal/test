ALTER TABLE `oms_v2`.`workflow_entrust` ADD `batch_no` VARCHAR(40) NOT NULL COMMENT '所属批量订单号' AFTER `alloced_at`;

CREATE TABLE `portfolio_fee_conf` (
  `product_id` int(11) NOT NULL,
  `fee_stamp_duty` decimal(4,2) NOT NULL COMMENT '印花税 ',
  `fee_formalities` decimal(4,2) NOT NULL COMMENT '手续费',
  `fee_transfer` decimal(4,2) NOT NULL COMMENT '过户费',
  `fee_transaction` decimal(4,2) NOT NULL COMMENT '证管费',
  `fee_collection` decimal(5,3) NOT NULL COMMENT '经手费',
  `national_formalities` decimal(4,2) NOT NULL,
  `etf_formalities` decimal(5,3) NOT NULL,
  `etf_collection` decimal(4,2) NOT NULL,
  `fee_formalities_min` decimal(4,2) NOT NULL COMMENT '交易费最低值',
  `fee_spare` decimal(4,2) NOT NULL COMMENT '备用字段(其他费用)',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `portfolio_fee_conf` VALUES ('1', '10.00', '3.00', '0.20', '0.20', '0.696', '0.10', '3.000', '0.49', '5.00', '0.00', '2016-08-29 19:08:57', '2016-08-29 19:09:02');
