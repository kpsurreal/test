<?php
    $param=['to_buy'=>true,'to_sell'=>false];
?>
@include('oms.product.order_create.multi_order.table',$param)
@include('oms.product.order_create.multi_order.add_stock',$param)
@include('oms.product.order_create.multi_order.foot',$param)
