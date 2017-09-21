-- 处理不同pb的系统参数
ALTER TABLE `oms_v2`.`pb_sys_params` ADD `exec_user_id` CHAR( 12 ) NOT NULL AFTER `ts_string`;