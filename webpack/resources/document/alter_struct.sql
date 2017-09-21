ALTER TABLE `oms_v3`.`portfolio_account` CHANGE `balance_amount` `balance_amount` DECIMAL(18,5)  NOT NULL  COMMENT '余额';
ALTER TABLE `oms_v3`.`portfolio_account` CHANGE `unfrozen_amount` `unfrozen_amount` DECIMAL(18,5)  NOT NULL  COMMENT '解冻资金';
ALTER TABLE `oms_v3`.`portfolio_account` CHANGE `frozen_amount` `frozen_amount` DECIMAL(18,5)  NOT NULL  COMMENT '冻结资金';
ALTER TABLE `oms_v3`.`portfolio_account` CHANGE `tmp_frozen_amount` `tmp_frozen_amount` DECIMAL(18,5)  NOT NULL  COMMENT '临时冻结资金';
ALTER TABLE `oms_v3`.`portfolio_account` CHANGE `manual_frozen_amount` `manual_frozen_amount` DECIMAL(18,5)  NOT NULL  COMMENT '手工冻结';

ALTER TABLE `oms_v3`.`base_account` CHANGE `balance_amount` `balance_amount` DECIMAL(18,5)  NOT NULL  COMMENT '余额';
ALTER TABLE `oms_v3`.`base_account` CHANGE `frozen_cash` `frozen_cash` DECIMAL(18,5)  NOT NULL  COMMENT '冻结资金';
ALTER TABLE `oms_v3`.`base_account` CHANGE `total_asset` `total_asset` DECIMAL(18,5)  NOT NULL  COMMENT '资产总额';

ALTER TABLE `oms_v3`.`base_deal` CHANGE `deal_value` `deal_value` DECIMAL(16,3)  NOT NULL  COMMENT '成交金额';
ALTER TABLE `oms_v3`.`base_position` CHANGE `market_value` `market_value` DECIMAL(16,3)  NOT NULL  COMMENT '持仓市值';

ALTER TABLE `oms_v3`.`instructions` CHANGE `ins_amount` `ins_amount` DECIMAL(16,3)  NOT NULL  COMMENT '指令金额';
ALTER TABLE `oms_v3`.`instructions` CHANGE `ins_volume` `ins_volume` DECIMAL(15,2)  NOT NULL  COMMENT '指令数量';

ALTER TABLE `oms_v3`.`portfolio_fund_adjustment` CHANGE `volume` `volume` DECIMAL(21,8)  NOT NULL  COMMENT '份额';
ALTER TABLE `oms_v3`.`portfolio_fund_adjustment` CHANGE `amount` `amount` DECIMAL(18,5)  NOT NULL  COMMENT '资金';


ALTER TABLE `oms_v3`.`portfolio_log` CHANGE `balance` `balance` DECIMAL(16,3)  NOT NULL  COMMENT '交易后余额';
ALTER TABLE `oms_v3`.`portfolio_log` CHANGE `trade_amount` `trade_amount` DECIMAL(16,3)  NOT NULL  COMMENT '交易金额';
ALTER TABLE `oms_v3`.`portfolio_log` CHANGE `can_use_balance` `can_use_balance` DECIMAL(16,3)  NOT NULL  COMMENT '交易后可用余额';


ALTER TABLE `oms_v3`.`portfolio_position` CHANGE `hold_cost` `hold_cost` DECIMAL(16,3)  NOT NULL  COMMENT '持仓成本';
ALTER TABLE `oms_v3`.`portfolio_position` CHANGE `hold_volume` `hold_volume` DECIMAL(15,2)  NOT NULL  COMMENT '持仓数量';
ALTER TABLE `oms_v3`.`portfolio_position` CHANGE `buy_volume` `buy_volume` DECIMAL(16,3)  NOT NULL  COMMENT '当日买入数量';
ALTER TABLE `oms_v3`.`portfolio_position` CHANGE `sell_volume` `sell_volume` DECIMAL(16,3)  NOT NULL  COMMENT '当日卖出数量';
ALTER TABLE `oms_v3`.`portfolio_position` CHANGE `total_fee` `total_fee` DECIMAL(16,5)  NOT NULL  COMMENT '总费用';
ALTER TABLE `oms_v3`.`portfolio_position` CHANGE `sell_frozen_volume` `sell_frozen_volume` DECIMAL(15,2)  NOT NULL  COMMENT '卖出冻结数量';
ALTER TABLE `oms_v3`.`portfolio_position` CHANGE `frozen_volume` `frozen_volume` DECIMAL(15,2)  NOT NULL  COMMENT '冻结可卖数量';
ALTER TABLE `oms_v3`.`portfolio_position` CHANGE `given_amount` `given_amount` DECIMAL(16,3)  NOT NULL  COMMENT '股票分红';


ALTER TABLE `oms_v3`.`portfolio_settlement` CHANGE `total_assets` `total_assets` DECIMAL(18,5)  NOT NULL  COMMENT '资产总值';
ALTER TABLE `oms_v3`.`portfolio_settlement` CHANGE `yesterday_total_assets` `yesterday_total_assets` DECIMAL(18,5)  NOT NULL  COMMENT '昨日资产总值';
ALTER TABLE `oms_v3`.`portfolio_settlement` CHANGE `balance_assets` `balance_assets` DECIMAL(18,5)  NOT NULL  COMMENT '资产余额';
ALTER TABLE `oms_v3`.`portfolio_settlement` CHANGE `net_assets` `net_assets` DECIMAL(18,5)  NOT NULL  COMMENT '净资产';
ALTER TABLE `oms_v3`.`portfolio_settlement` CHANGE `security_assets` `security_assets` DECIMAL(18,5)  NOT NULL  COMMENT '证券资产';
ALTER TABLE `oms_v3`.`portfolio_settlement` CHANGE `usable_cash` `usable_cash` DECIMAL(18,5)  NOT NULL  COMMENT '可用资金';
ALTER TABLE `oms_v3`.`portfolio_settlement` CHANGE `net_profit` `net_profit` DECIMAL(18,5)  NOT NULL  COMMENT '净收益';
ALTER TABLE `oms_v3`.`portfolio_settlement` CHANGE `day_profit` `day_profit` DECIMAL(18,5)  NOT NULL  COMMENT '当日收益';
ALTER TABLE `oms_v3`.`portfolio_settlement` CHANGE `tmp_frozen_assets` `tmp_frozen_assets` DECIMAL(18,5)  NOT NULL  COMMENT '临时冻结资金';
ALTER TABLE `oms_v3`.`portfolio_settlement` CHANGE `net_balance_assets` `net_balance_assets` DECIMAL(18,5)  NOT NULL  COMMENT '净余额';
ALTER TABLE `oms_v3`.`portfolio_settlement` CHANGE `today_fund_in` `today_fund_in` DECIMAL(18,5)  NOT NULL  COMMENT '当日入金';
ALTER TABLE `oms_v3`.`portfolio_settlement` CHANGE `today_fund_out` `today_fund_out` DECIMAL(18,5)  NOT NULL  COMMENT '当日出金';


ALTER TABLE `oms_v3`.`portfolio_stats_account` CHANGE `balance_amount` `balance_amount` DECIMAL(18,5)  NOT NULL  COMMENT '余额';
ALTER TABLE `oms_v3`.`portfolio_stats_account` CHANGE `unfrozen_amount` `unfrozen_amount` DECIMAL(18,5)  NOT NULL  COMMENT '解冻资金';
ALTER TABLE `oms_v3`.`portfolio_stats_account` CHANGE `frozen_amount` `frozen_amount` DECIMAL(18,5)  NOT NULL  COMMENT '冻结资金';
ALTER TABLE `oms_v3`.`portfolio_stats_account` CHANGE `tmp_frozen_amount` `tmp_frozen_amount` DECIMAL(18,5)  NOT NULL  COMMENT '临时冻结资金';
ALTER TABLE `oms_v3`.`portfolio_stats_account` CHANGE `manual_frozen_amount` `manual_frozen_amount` DECIMAL(18,5)  NOT NULL  COMMENT '手工冻结';


ALTER TABLE `oms_v3`.`portfolio_stats_position` CHANGE `hold_cost` `hold_cost` DECIMAL(16,3)  NOT NULL  COMMENT '持仓成本';
ALTER TABLE `oms_v3`.`portfolio_stats_position` CHANGE `hold_volume` `hold_volume` DECIMAL(15,2)  NOT NULL  COMMENT '持仓数量';
ALTER TABLE `oms_v3`.`portfolio_stats_position` CHANGE `buy_volume` `buy_volume` DECIMAL(16,3)  NOT NULL  COMMENT '当日买入数量';
ALTER TABLE `oms_v3`.`portfolio_stats_position` CHANGE `sell_volume` `sell_volume` DECIMAL(16,3)  NOT NULL  COMMENT '当日卖出数量';
ALTER TABLE `oms_v3`.`portfolio_stats_position` CHANGE `total_fee` `total_fee` DECIMAL(16,5)  NOT NULL  COMMENT '总费用';
ALTER TABLE `oms_v3`.`portfolio_stats_position` CHANGE `sell_frozen_volume` `sell_frozen_volume` DECIMAL(15,2)  NOT NULL  COMMENT '卖出冻结数量';
ALTER TABLE `oms_v3`.`portfolio_stats_position` CHANGE `frozen_volume` `frozen_volume` DECIMAL(15,2)  NOT NULL  COMMENT '冻结可卖数量';
ALTER TABLE `oms_v3`.`portfolio_stats_position` CHANGE `given_amount` `given_amount` DECIMAL(16,3)  NOT NULL  COMMENT '股票分红';


ALTER TABLE `gmf_bms`.`product_oms` CHANGE `volume` `volume` DECIMAL(21,8)  NOT NULL;
ALTER TABLE `gmf_bms`.`product_oms` CHANGE `collect_capital` `collect_capital` DECIMAL(16,3)  NOT NULL;
ALTER TABLE `gmf_bms`.`product_oms` CHANGE `begin_capital` `begin_capital` DECIMAL(16,3)  NOT NULL;
