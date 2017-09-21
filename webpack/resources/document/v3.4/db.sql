-- 委托表加入委托成本价，用于冻结解冻  buty
ALTER TABLE `oms_v3`.`workflow_entrust` ADD `entrust_cost_price` DECIMAL( 9, 5 ) NOT NULL COMMENT '委托成本价' AFTER `entrust_price`;
ALTER TABLE `oms_v3`.`portfolio_template` ADD `org_id` INT(11) NOT NULL COMMENT '机构ID' AFTER `tpl_type`;

INSERT INTO `oms_v3`.`func_permission`(`sys`,`func`,`permission_id`,`status`,`created_at`) VALUES("bms","User\UserController@cancel_user",34,1,now());
INSERT INTO `oms_v3`.`func_permission`(`sys`,`func`,`permission_id`,`status`,`created_at`) VALUES("bms","User\UserController@modify_password",33,1,now());
INSERT INTO `oms_v3`.`func_permission`(`sys`,`func`,`permission_id`,`status`,`created_at`) values("bms","User\UserController@register",32,1,now());
INSERT INTO `oms_v3`.`func_permission`(`sys`,`func`,`permission_id`,`status`,`created_at`) VALUES("bms","User\UserController@modify",32,1,now());
