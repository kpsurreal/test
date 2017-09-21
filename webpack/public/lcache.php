<?php
require '../app/Libs/BrowserUserAgent.php';

if( file_exists('/data/config/rel/app/platform.php') )
    require_once '/data/config/rel/app/platform.php';

function cache_hit() {

    // system config on/off
    $use_lcache = getenv('USE_LCACHE');
    if(!$use_lcache)
        return false;

    if(isset($_SERVER['HTTP_D_CACHE']) && $_SERVER['HTTP_D_CACHE'])
        return false;

    if(!class_exists('Redis'))
        return false;

    $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    if(empty($uri))
        return false;

    try {
        $redis = new Redis();
        $lcache_host = getenv('LCACHE_HOST');
        $lcache_port = getenv('LCACHE_PORT');
        if(empty($lcache_host) || empty($lcache_port))
            return false;

        $redis->connect($lcache_host, $lcache_port);
        $key = lcache_key();
        if(empty($key))
            return false;

        $expire = $redis->ttl($key);
        if($expire < 0)
            return false;

        header('Use-GMF-Cache: 1');
        header('Use-GMF-Cache-Expire: ' . $expire);
        return $redis->get($key);
    } catch(Exception $e) {
        return false;
    }
}

function use_cache($cache_content) {
    echo $cache_content;
    exit;
}

function lcache_key() {

    // 基础配置文件不存在, 跳过缓存
    if(!file_exists(__DIR__ . '/../config/lcache.php'))
        return false;

    // 当前有登录用户, 不适用缓存
    if(isset($_COOKIE['app_token']) && !empty($_COOKIE['app_token']))
        return false;

    $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    if(empty($uri))
        return false;

    $lcache = require __DIR__ . '/../config/lcache.php';

    if(!in_array($uri, $lcache))
        return false;

    $ua = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
    if(empty($ua))
        return false;

    $agent = new BrowserUserAgent();

    // default: pc
    $platform = 'PC';
    switch(true) {

        // is weixin
        case strpos($ua, 'MicroMessenger') !== false:
            $platform = 'WX';
        break;

        // is client
        case isset($_GET['platform']) && in_array( strtoupper($_GET['platform']), array('IOS', 'ANDROID') ):
            $platform = 'CLI';
        break;

        // is h5
        case $agent->isMobile() && !$agent->isTablet():
            $platform = 'H5';
        break;
    }

    return "lcache:{$uri}|{$platform}";
}
