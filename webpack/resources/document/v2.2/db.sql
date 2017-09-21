-- 机器人对应组合列表
CREATE TABLE `roboter_list` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `roboter_id` int(11) NOT NULL COMMENT '机器人ID',
 `product_id` int(11) NOT NULL COMMENT '组合ID',
 `broker_id` varchar(24) NOT NULL,
 `status` int(11) NOT NULL DEFAULT '0' COMMENT '状态 0:正常 1:停用',
 `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 PRIMARY KEY (`id`),
 KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

