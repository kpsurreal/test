<?php

class XHprofHelper{
	public static function start_watch(){
		$xhprof_root = "/data/map/xhprof";
		include_once $xhprof_root."/xhprof_lib/utils/xhprof_lib.php";
		include_once $xhprof_root."/xhprof_lib/utils/xhprof_runs.php";
		xhprof_enable(XHPROF_FLAGS_CPU+XHPROF_FLAGS_MEMORY);
	}

	public static function end_watch_and_save(){
		$xhprof_data = xhprof_disable();
		$xhprof_runs = new XHprofRuns_Default();
		$run_id = $xhprof_runs->save_run($xhprof_data, "goldmf");
	}
}













