<?php

use App\Services\AvatarService;
use App\Services\ProductService;


\HTML::macro('link_weixin_login', function($style_href = ''){
    $uri = 'https://open.weixin.qq.com/connect/qrconnect';

    $params = [];
    $params['appid'] = config('platform.weixin_web.app_key');
    $params['redirect_uri'] = 'https://www.caopanman.com/3rd_login/weixin';
    $params['response_type'] = 'code';
    $params['scope'] = 'snsapi_login';
    $params['login_type'] = 'jssdk';
    $params['href'] = url($style_href);
    $params['state'] = '';

    return $uri . '?' . http_build_query($params);
});

\HTML::macro('link_weixin_bind', function($style_href = ''){
    $uri = 'https://open.weixin.qq.com/connect/qrconnect';

    $params = [];
    $params['appid'] = config('platform.weixin_web.app_key');
    $params['redirect_uri'] = 'https://www.caopanman.com/3rd_login/bind';
    $params['response_type'] = 'code';
    $params['scope'] = 'snsapi_login';
    $params['login_type'] = 'jssdk';
    $params['href'] = url($style_href);
    $params['state'] = '/user/secure';

    return $uri . '?' . http_build_query($params);
});

\HTML::macro('howmany_months', function($start, $end) {

    $n = floor(($end - $start) / 86400);
    return floor(($n + 10) / 30);

    // 保留代码
    // $start_date = new \DateTime(date('Y-m-d', $start));
    // $end_date = new \DateTime(date('Y-m-d', $end));
    // $n = $start_date->diff($end_date)->days;
    // $m_start = date('Y', $start) * 12 + date('m', $start);
    // $m_end = date('Y', $end) * 12 + date('m', $end);
    // return ($m_end - $m_start) . '个月';
});

\HTML::macro('lock_time', function($start, $end) {
    return HTML::howmany_months($start, $end) . '个月';
});

\HTML::macro('left_time', function($start, $end) {

    $left_day = floor(($end - time()) / 86400);
    $left_hour = ($end - time()) / 86400;
    if($left_hour > 0) {
        $left_hour = round('0.' . explode('.', "{$left_hour}")[1], 5) * 24;
        $left_hour = floor($left_hour);
    } else {
        $left_hour = 0;
    }

    $ret = '';
    if($left_day > 0)
        $ret .= sprintf('<span class="big-number">%s</span>天', $left_day);

    if($left_hour > 0)
        $ret .= sprintf('<span class="big-number">%s</span>小时', $left_hour);

    if(empty($ret))
        $ret = sprintf('<span class="big-number">%s</span>小时内', 1);

    return $ret;
});

\HTML::macro('left_time_v2', function($end){
    $left_day = floor(($end - time()) / 86400);
    $left_hour = ($end - time()) / 86400;
    if($left_hour > 0) {
        $left_hour = round('0.' . explode('.', "{$left_hour}")[1], 5) * 24;
        $left_hour = floor($left_hour);
    } else {
        $left_hour = 0;
    }

    $ret = '';
    if($left_day > 0)
        $ret .= sprintf('<span class="number">%s</span>天', $left_day);

    if($left_hour > 0)
        $ret .= sprintf('<span class="number">%s</span>小时', $left_hour);

    if(empty($ret))
        $ret = sprintf('<span class="number">%s</span>小时<span class="lighter">内开放投资</span>', 1);
    else
        $ret .= '<span class="lighter">后开放投资</span>';

    return $ret;
});

\HTML::macro('left_time_v3', function($end){
    $left_day = floor(($end - time()) / 86400);
    $left_hour = ($end - time()) / 86400;
    if($left_hour > 0) {
        $left_hour = round('0.' . explode('.', "{$left_hour}")[1], 5) * 24;
        $left_hour = floor($left_hour);
    } else {
        $left_hour = 0;
    }

    $ret = '';
    if($left_day > 0)
        $ret .= sprintf('<span class="number">%s</span>天', $left_day);

    if($left_hour > 0)
        $ret .= sprintf('<span class="number">%s</span>小时', $left_hour);

    if(empty($ret))
        $ret = sprintf('<span class="number">%s</span>小时内', 1);

    return $ret;
});
\HTML::macro('left_time_v4', function($end){
    $left_day = floor(($end - time()) / 86400);
    $left_hour = ($end - time()) / 86400;
    if($left_hour > 0) {
        $left_hour = round('0.' . explode('.', "{$left_hour}")[1], 5) * 24;
        $left_hour = floor($left_hour);
    } else {
        $left_hour = 0;
    }

    $ret = '';
    if($left_day > 0){
        $ret = sprintf('<span class="number">%s</span>天', $left_day);
    }else{
        $ret = sprintf('<span class="number">%s</span>天内', 1);
    }

    return $ret;
});

// 网页标签, 货币符号
\HTML::macro('trader_portrait', function($trader_user_id, $size) {
    switch($size) {
        case '60':
            $_avatar_type = AvatarService::AVATAR_TYPE_SMALL;
            break;
        case '200':
            $_avatar_type = AvatarService::AVATAR_TYPE_MEDDIE;
            break;
        case '240':
            $_avatar_type = AvatarService::AVATAR_TYPE_TWO_FOUR;
            break;
    }

    list(,,$ret) = AvatarService::getAvatar($trader_user_id, $_avatar_type, 1);
    return $ret;
});

// 网页标签, 货币符号
\HTML::macro('money_unit', function($market, $has_flag = true) {
    $ret = '';
    switch($market) {
        case 1:
            $ret = $has_flag ? '<span class="money_unit cn">￥</span>' : '￥';
        break;
        case 2:
            $ret = $has_flag ? '<span class="money_unit hk">HK$</span>' : 'HK$';
        break;
    }
    return $ret;
});

\HTML::macro('fund_type', function($fund_type) {
    $ret = '';
    switch($fund_type) {
        case 1: $ret = '操盘乐'; break;
        case 2: $ret = '分红乐'; break;
        case 3: $ret = '公益乐'; break;
    }
    return $ret;
});

// 产品类型
\HTML::macro('fund_class', function($fund_type){
    $ret = '';
    switch($fund_type) {
        case 1: $ret = 'caopan'; break;
        case 2: $ret = 'bonus'; break;
        case 3: $ret = 'charitable'; break;
    }
    return $ret;
});

// 网页标签, 文字形式
\HTML::macro('money_text', function($market, $has_flag = true) {
    $ret = '';
    switch($market) {
        case 1:
            $ret = $has_flag ? '<span class="money_unit cn">元</span>' : '元';
        break;
        case 2:
            $ret = $has_flag ? '<span class="money_unit hk">港币</span>' : '港币';
        break;
    }
    return $ret;
});

// 网页标签, 文字形式
\HTML::macro('market_type', function($market) {
    $ret = '';
    switch($market) {
        case 1: $ret = '<span class="money_unit cn">沪深</span>'; break;
        case 2: $ret = '<span class="money_unit hk">港股</span>'; break;
    }
    return $ret;
});

// 募集进度条
\HTML::macro('recruiting_progress_bar', function($p, $right_text = '', $left_text = '') {
    $collect_capital = $p['collect_capital'];
    $target_capital = $p['target_capital'];

    $finish_min_limit = isset($p['finish_min_limit']) ? $p['finish_min_limit'] : 0;
    $operator_invest_amount = (isset($p['operator_invest']) && isset($p['operator_invest']['amount'])) ? $p['operator_invest']['amount'] : 0;
    $can_run_capital = max($finish_min_limit, $operator_invest_amount);


    $recruiting_rate = $target_capital==0 ? 0 : $collect_capital/$target_capital;

    $recruiting_rate *= 100;
    $recruiting_rate = round($recruiting_rate, 2);
    $_recruiting_rate = $recruiting_rate;
    if($_recruiting_rate > 100) $_recruiting_rate = 100;
	$active_class = $collect_capital >= $can_run_capital ? 'enough' : '';
	$active_text = $collect_capital >= $can_run_capital ? '已达到最低可成立规模' : '尚未达到最低可成立规模';

    if(empty($left_text))
        $left_text = "已完成{$recruiting_rate}%";

    $unvisible = '';
    // 隐藏投资期剩余信息
    // if(empty($right_text) && isset($p['end_fundraising_time']) && isset($p['begin_fundraising_time'])) {
    //     $unvisible = 'unvisible';
    //     $pt = ProductService::parse_time($p['begin_fundraising_time'], $p['end_fundraising_time']);
    //     if($pt['left'] > 0)
    //         $right_text = sprintf('投资期剩余%s%s', $pt['left'], $pt['left_unit']);
    //     else
    //         $right_text = sprintf('投资期剩余%s', $pt['left_unit']);
    // }
    // 更换为投资人次
    $right_text = '投资人次 '.$p['invest_times'];

    $ret =<<<EOT
<div class="target" title="{$active_text}">
    <div class="target-box">
        <div class="target-box-inner {$active_class}" style="width: {$_recruiting_rate}%;"></div>
    </div>
    <div class="target-time"><span class="right {$unvisible}">{$right_text}</span>{$left_text}</div>
</div>
EOT;
    return $ret;
});

\HTML::macro('position_progress_bar', function($p) {
    $position = number_format($p['position'] * 100, 2, '.', '');
    if($position > 100)
        $position = '100.00';

    $pt = ProductService::parse_time($p['start_time'], $p['stop_time']);
    $right_text = '';
    if($pt['left'] > 0)
        $right_text = sprintf('已运行%s%s，剩余%s%s',
                                $pt['runned'], $pt['runned_unit'],
                                $pt['left'], $pt['left_unit']);
    else
        $right_text = sprintf('已运行%s，剩余%s',
                                $pt['runned_unit'],
                                $pt['left_unit']);

    $ret =<<<EOT
<div class="target">
    <div class="target-box">
        <div class="target-box-inner" style="width: {$position}%;"></div>
    </div>
    <div class="target-time">
        <span class="right">{$right_text}</span>
        仓位：{$position}%
    </div>
</div>
EOT;
    return $ret;
});

\HTML::macro('clac_left_time', function($start_time, $stop_time) {
    $pt = ProductService::parse_time($start_time, $stop_time);
    $right_text = '';
    if($pt['left'] > 0)
        $right_text = sprintf('%s%s', $pt['left'], $pt['left_unit']);
    else
        $right_text = sprintf('%s', $pt['left_unit']);
    return $right_text;
});

// 数字格式化(与版本3的区别在于，此版本还对位数进行了智能处理，超过一定位数则显示“万”)
\HTML::macro('number_formatAll', function($num, $has_flag = true, $dig = 2, $smart_show = true, $smart_limit = 100) {
    $num_flag = '';
    switch(true) {
        case $num > 0: $num_flag = '+'; break;
        // case $num == 0: $num_flag = ''; break;
        case $num < 0:
            if (substr($num, 0, 1) != '-')
                $num_flag = '-';
            break;
    }
    if($smart_show && $num >= $smart_limit * 10000) {
        $num = sprintf('%s万', number_format($num / 10000, $dig, '.', ','));
    } else {
        $num = sprintf('%s', number_format($num, $dig, '.', ','));
    }

    $ret = $has_flag ? "{$num_flag}{$num}" : "{$num}";
    return $ret;
});

// 百分比数字格式化(与版本5的区别在于正数不显示加号。主要用于仓位显示)
\HTML::macro('number_format6', function($num, $use_num_flag = true, $with_span = true) {
    if(!is_numeric($num)) $num = 0;

	$num_flag = '';
	$class = '';
	switch(true) {
		case $num > 0: $num_flag = ''; $class = 'win'; break;
// 		case $num == 0: $num_flag = ''; $class = ''; break;
		case $num < 0:
			$class = 'lose';
			if (substr($num, 0, 1) != '-')
				$num_flag = '-';
		break;
	}
	$num = number_format($num, 2, '.', ',');
    $num = round($num, 2);

    if(!$use_num_flag)
        $num_flag = '';

	return $with_span ? "<span class='{$class}'>{$num_flag}{$num}%</span>" : "{$num_flag}{$num}%";
});

// 百分比数字格式化(与版本2的区别在于省略了小数点后可以省略的零)
\HTML::macro('number_format5', function($num, $use_num_flag = true, $with_span = true) {
    if(!is_numeric($num)) $num = 0;

	$num_flag = '';
	$class = '';
	switch(true) {
		case $num > 0: $num_flag = '+'; $class = 'win'; break;
// 		case $num == 0: $num_flag = ''; $class = ''; break;
		case $num < 0:
			$class = 'lose';
			if (substr($num, 0, 1) != '-')
				$num_flag = '-';
		break;
	}
	$num = number_format($num, 2, '.', ',');
    $num = round($num, 2);

    if(!$use_num_flag)
        $num_flag = '';

	return $with_span ? "<span class='{$class}'>{$num_flag}{$num}%</span>" : "{$num_flag}{$num}%";
});

// 数字格式化.(与版本3的区别在于正数不显示正号，同时省略了小数点后可以省略的零)
\HTML::macro('number_format4', function($num, $has_flag = true, $dig = 2) {
    $num_flag = '';
    $class = '';
    switch(true) {
        case $num > 0: $num_flag = ''; $class = 'win'; break;
        case $num < 0:
            $class = 'lose';
            if (substr($num, 0, 1) != '-')
                $num_flag = '-';
            break;
    }
    $num = number_format($num, $dig, '.', ',');
    $num = round($num, 2);

    $ret = $has_flag ? "<span class='{$class}'>{$num_flag}{$num}</span>" : "{$num_flag}{$num}";
    return $ret;
});

// 数字格式化
\HTML::macro('number_format3', function($num, $has_flag = true, $dig = 2) {
	$num_flag = '';
	$class = '';
	switch(true) {
		case $num > 0: $num_flag = '+'; $class = 'win'; break;
// 		case $num == 0: $num_flag = ''; $class = ''; break;
		case $num < 0:
			$class = 'lose';
			if (substr($num, 0, 1) != '-')
				$num_flag = '-';
		break;
	}
	$num = number_format($num, $dig, '.', ',');

    $ret = $has_flag ? "<span class='{$class}'>{$num_flag}{$num}</span>" : "{$num_flag}{$num}";
    return $ret;
});

// 百分比数字格式化
\HTML::macro('number_format2', function($num, $use_num_flag = true, $with_span = true) {
    if(!is_numeric($num)) $num = 0;

	$num_flag = '';
	$class = '';
	switch(true) {
		case $num > 0: $num_flag = '+'; $class = 'win'; break;
// 		case $num == 0: $num_flag = ''; $class = ''; break;
		case $num < 0:
			$class = 'lose';
			if (substr($num, 0, 1) != '-')
				$num_flag = '-';
		break;
	}
	$num = number_format($num, 2, '.', ',');

    if(!$use_num_flag)
        $num_flag = '';

	return $with_span ? "<span class='{$class}'>{$num_flag}{$num}%</span>" : "{$num_flag}{$num}%";
});

// 一般数字格式化
\HTML::macro('number_format1', function($num, $dig = 2, $smart_show = true, $smart_limit = 10) {
    if(!is_numeric($num)) $num = 0;

    if($smart_show && $num >= $smart_limit * 10000) {
        $num = sprintf('%s 万', number_format($num / 10000, $dig, '.', ','));
    } else {
        $num = sprintf('%s ', number_format($num, $dig, '.', ','));
    }

	return $num;
});

// 一般数字格式化，由number_format1修改而来，省略小数
\HTML::macro('number_format0', function($num, $dig = 2, $smart_show = true, $smart_limit = 10) {
    if(!is_numeric($num)) $num = 0;

    if($smart_show && $num >= $smart_limit * 10000) {
        $num = sprintf('%s 万', number_format($num / 10000, $dig, '.', ','));
    } else {
        $num = sprintf('%s ', number_format($num, 0, '.', ','));
    }

    return $num;
});

// 产品进度条信息
\HTML::macro('product_process_status', function($status, $status_arr, $msg, $rule = Null) {
    if(!is_array($status_arr)) $status_arr = array($status_arr);
    $class = '';
    if(in_array($status, $status_arr)) {
        if(!is_null($rule)) {
            if($rule)
                $class = 'finished';
        } else {
            $class = 'finished';
        }
    }
    // $_ = var_export($status_arr); // , $status, $_
    $ret =<<<EOT
<li class="{$class}">{$msg}</li>
EOT;
    return $ret;
});

\HTML::macro('check_ex_params', function($v, $index) {
    if(!isset($v['ex_params']) or !isset($v['ex_params'][$index])) return true;

    return $v['ex_params'][$index] == true;
});

// 产品类型
\HTML::macro('card_class', function($fund_type){
    $card_class = '';
    switch($fund_type) {
        case Products::FUND_TYPE_A:
            $card_class = 'caopan';
        break;
        case Products::FUND_TYPE_BONUS:
            $card_class = 'bonus';
        break;
        case Products::FUND_TYPE_CHARITABLE:
            $card_class = 'charitable';
        break;
    }
    return $card_class;
});
