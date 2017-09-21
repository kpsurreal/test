<?php
    $param=['to_buy'=>false,'to_sell'=>true];


    use App\Services\UserService;
	$org_info = UserService::getOrgInfo();
?>






	 <div style="min-height:172px;">
	    @include('oms.multi.product.order_create.multi_order.table',$param)
	</div>
	@include('oms.multi.product.order_create.multi_order.foot',$param) 





