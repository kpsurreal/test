



<?php
    $param = [ 'to_buy'=>true,'to_sell'=>false];



?>


	 <div style="min-height:172px;">
	    @include('oms.multi.product.order_create.multi_order.table',$param)
	    @include('oms.multi.product.order_create.multi_order.add_stock',$param)
	</div>
	@include('oms.multi.product.order_create.multi_order.foot',$param) 




