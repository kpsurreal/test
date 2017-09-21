# Risk_check workflow

Before: pre_log timestamp;

risk_check_request: stock_id, product_id, buy or sell, price(limit_price or market_price), volume;


    risk_check ---push---> risk_check_task_pool;


    risk_condition_ready ---trigger---> risk_check_task_pool;

        stock_detail    ready
        product_detail  ready
        rules           ready
        position        ready


    risk_check_task_pool ---return---> risk_res;


risk_check_response: max_volume, is_request_volume_ok, msg;

After: re_check timestamp;
