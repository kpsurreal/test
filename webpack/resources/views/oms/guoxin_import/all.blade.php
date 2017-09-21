@extends('adminmanager_standard')

@section('asset-css')
<style media="screen">
    .guoxin_import_table td,th{text-align:center;position:relative;height:40px;}
    .guoxin_import_table td:first-child{width:3em;}
    .guoxin_import_table td:nth-of-type(2){width:6em;font-size:12px;}
    .guoxin_import_table td:nth-of-type(14){width:6em;font-size:12px;}
    select{width:100px;}
    select[disabled]{opacity:0.5;}

    /*td.dirty:before{content:'';display:block;width:10px;height:10px;background:red;border-radius:50%;position:absolute;top:15px;right:-5px;box-sizing:border-box;border:1px solid #fff;}
    td.dirty+td.dirty:before{right:initial;left:-5px;}*/

    tr.tr-hover-prev{border-bottom-color:blue;}
    tr.tr-hover td{border-left-color:transparent;border-right-color:transparent;border-top-color:transparent;}
    tr.tr-hover{border-left-color:blue;border-right-color:blue;border-top-color:transparent;border-bottom-color:transparent;}
    tr.tr-hover td:first-of-child{border-left-color:blue;}
    tr.tr-hover td:last-of-child{border-right-color:blue;}
    tr.tr-hover.tr-hover-last{border-bottom-color:inherit;border-bottom-color:blue;}
    .tr-selected{background:#ccc;}
    td[key='委托编号'],td[key='成交编号']{cursor:pointer;}
    td[key='委托编号']{background:#eee;}
    td[key='成交编号']{background:#ddd;}
    td[key='委托编号'].hover{background:#f5f5f5;}

    td.setted:before{
        content:'√';display:block;width:20px;line-height:20px;height:20px;position:absolute;
        top:7px;left:-26px;background:#3cba54;color:#fff;text-align:center;border-radius:50%;font-size:10px;
    }

    td:first-of-type a{color:#999;}

    tr.dirty td:first-of-type:before{
        content:'√';display:block;width:20px;line-height:16px;height:20px;position:absolute;
        top:7px;left:-26px;background:#db3236;color:#fff;text-align:center;border-radius:50%;font-size:10px;
    }

    .table-fixed-head:before{content:'';display:block;position:absolute;top:-60px;left:-40px;right:-40px;bottom:0;background:#fff;z-index:-1;}
    /*.table-fixed-head > *{content:'';display:block;position:absolute;top:-20px;left:-40px;right:-40px;bottom:0;background:#fff;}*/
</style>
@stop

@section('content')
<script src="{{ asset('/js/oms/vue.min.js') }}"></script>

@if($type == 'trade_record')
<h1>国信交易记录</h1>
@endif
@if($type == 'delivery_order')
<h1>国信交割单</h1>
@endif

<div class="row panel-body">
    {{-- <span class="btn btn-lg btn-default" cancelimport>取消本次导入的订单</span> --}}
    <span class="btn btn-lg btn-success pull-right" submitimport>确认导入交易记录</span>
</div>

<table id="guoxin_import_table" class="guoxin_import_table" border="1" width="100%" cellpadding="1" cellspacing="1">
    <tr>
        <th></th>
        <th>成交日期</th>
        <th>运行中的策略</th>
        <th>混合策略</th>
        @foreach($list_keys as $key)
        <th>{{$key}}</th>
        @endforeach
    </tr>
    @foreach($list as $k => $i)
    <?php if(isset($i['content']['摘要']) && $i['content']['摘要'] == '撤单成交') continue; ?>
    {{-- <tr {!! !empty($i['product_id']) ? 'style="background-color: red; color: #fff;"' : '' !!}> --}}
    <tr productid="{{ $i['product_id'] }}">
        @if (!empty($i['product_id']))
        <td class="setted"><a href="{{ config('view.path_prefix','') }}/oms/guoxin_import/{{$type}}/cancel?id={{$i['id']}}">取消</a></td>
        @else
        <td><a href="{{ config('view.path_prefix','') }}/oms/guoxin_import/{{$type}}/set_disabled?id={{$i['id']}}">设置无效</a></td>
        @endif

        <td>{{$i['completion_date']}}</td>
        <td>
            <select choice="single" class="sign_val" data-sign-id="{{$i['sign']}}" {!! !empty($i['product_id']) ? 'disabled="disabled"' : '' !!}>
                <option value="">请选择策略</option>
                @foreach($products as $p)
                    <option value="{{$p['id']}}" @if($i['product_id'] == $p['id']) selected="selected" @endif>{{$p['name']}}</option>
                @endforeach
            </select>
        </td>
        <td>
            <select choice="mix" class="product_groups" data-sign-id="{{$i['sign']}}" {!! !empty($i['product_id']) ? 'disabled="disabled"' : '' !!}>
                <option value="">选择混合策略</option>
                @foreach($product_groups as $k => $p)
                    <option value="{{$k}}" @if($i['product_id'] == $k) selected="selected" @endif>{{$p['name']}}</option>
                @endforeach
            </select>
        </td>

        @foreach($list_keys as $key)
            @if(!isset($i['content'][$key]))
                <td>{{$key}} 未设置, 行异常!!</td>
            @else
                <td key="{{$key}}" val="{{$i['content'][$key]}}">{{$i['content'][$key]}}</td>
            @endif
        @endforeach
    </tr>
    @endforeach
</table>

<div style="display:none;">
    <form style="display:none;" action="/oms/guoxin_import/{{$type}}/cancel" method="get">
        <input class="btn btn-lg btn-default" id="cancel_import_btn" type="submit" value="取消本次导入的订单">
    </form>
    <form class="form-inline" action="/oms/guoxin_import/{{$type}}/do_import" method="post" onsubmit="return do_submit(this);">
        <input class="btn btn-lg btn-success" id="submit_import_btn" type="submit" value="确认导入交易记录">
    </form>
</div>

<div class="row panel-body">
    {{-- <span class="btn btn-lg btn-default" cancelimport>取消本次导入的订单</span> --}}
    <span class="btn btn-lg btn-success pull-right" submitimport>确认导入交易记录</span>
</div>

<script type="text/html" id="total-info-msg-tpl">
    <div style="max-height:450px;overflow-y:scroll;border: 1px solid #ddd;padding:0 1em!important;margin-top: 20px;">
        <h4 class="text-success"><b v-text="modified.total.records"></b> 条记录做了修改</h4>
        <div v-for="record in modified.records">
            <p style="font-size:16px;"><b v-text="record.product_name"></b>
                增加了 <b v-text="record.records.total"></b> 条记录
                <b>【
                    <b v-if="record.records.buy"><b v-text="record.records.buy"></b>条买入</b>
                    <b v-if="record.records.sell"><b v-text="record.records.sell"></b>条卖出</b>
                    】
                </b>
            </p>
            <div style="padding-left:2em;color:#333;">
                <p style="margin-bottom:5px;" v-for="stock in record.stocks">
                    <span v-text="stock.name"></span>(<span v-text="stock.id"></span>)
                    <span v-if="stock.records.buy">
                        <span v-text="stock.records.buy"></span>条买入记录
                    </span>
                    <span v-if="stock.records.sell">
                        <span v-text="stock.records.sell"></span>条卖出记录
                    </i>
                </p>
            </div>
        </div>
        <h4 v-if="remain.records" class="text-danger"><b v-text="remain.records"></b> 条记录尚未设置策略信息</h4>
    </div>
</script>

<hr>

@foreach($product_groups as $k => $p)
<div class="">
    <h5>{{$p['name']}}</h5>
    <ul>
        @foreach($p['ratio'] as $id => $ra)
        <li>{{$id}} : {{$ra * 100}}% </li>
        @endforeach
    </ul>
</div>
@endforeach

<script type="text/javascript">
$(function(){
    //公共部分
    window.onbeforeunload = function(){
        var result;
        ($(window).data('beforeunload')||[]).forEach(function(func){
            result = result || func.apply(window);
        });
        return result;
    };
    window.onWindowBeforeunload = function(func){
        $(window).data('beforeunload', $(window).data('beforeunload')||[] ).data('beforeunload').push(func);
    };
});

$(function(){
    //提交订单按钮的协助逻辑
    var submitimport_first_btn = $('[submitimport]').first();
    var submitimport_first_btn_ghost = submitimport_first_btn.clone().hide().appendTo( $('#navbar') );

    $(window).on('scroll',function(){
        submitimport_first_btn.offset().top > $(window).scrollTop() ? submitimport_first_btn_ghost.hide() : submitimport_first_btn_ghost.show();
    });

    //防止意外关闭
    window.onWindowBeforeunload && window.onWindowBeforeunload(function(){
        if( $('td.dirty').length ){
            // return '有修改尚未提交！是否离开？';
        }
    });
});

$(function(){

    //产品信息预处理
    var PRODUCT_IDS = [];
    window.PRODUCTS = [];
    window.PRODUCT_GROUPS = [];
    var allProducts = JSON.parse('{!!json_encode($products)!!}');
    var allProductGroups = JSON.parse('{!!json_encode($product_groups)!!}');
    for(var i in allProducts){
        window.PRODUCTS.push( allProducts[i] );
        PRODUCT_IDS.push( allProducts[i]['id'] );
    }
    for(var i in allProductGroups){
        window.PRODUCT_GROUPS.push( (allProductGroups[i]['id']=i,allProductGroups[i]) );
        PRODUCT_IDS.push( i );
    }
    window.PRODUCTS = window.PRODUCTS.concat( window.PRODUCT_GROUPS );
    //为每个产品分配唯一的背景颜色
    PRODUCT_IDS.sort();
    window.PRODUCTS.forEach(function(item,index,arr){
        item.background = '#' + parseInt( 255*255*255*0.95* PRODUCT_IDS.indexOf(item.id)/PRODUCT_IDS.length ).toString(16);
    });

    //确认导入交易记录
    $('html').on('click','[submitimport]',function(){
        if( $('td.dirty').length ){
            var content = getStatistics();
            $.gmfConfirm('请确认本次修改信息',content,2).ok(function(){
                // return
                $.omsAlert('你点击了确认');
                $('#submit_import_btn').click();
            }).cancel(function(){
                return $.omsAlert('你点击了取消！',false,1500);
            });
        }else{
            $.omsAlert('没有可提交的修改！',false,2500);
        }
    });

    //取消本次导入的订单？
    $('html').on('click','[cancelimport]',function(){
        $.gmfConfirm('确认取消本次导入的订单？',null,2).ok(function(){
            $('#cancel_import_btn').click()
        });
    });

    //select 功能设计，策略和混合策略互斥，批量选取，脏值检测
    $('#guoxin_import_table select').each(function(){
        $(this).attr('originval', $(this).val());
    }).on('change',function(){
        var choice_type = $(this).attr('choice');

        if( $(this).closest('tr').hasClass('tr-selected') ){
            //多选设置
            $('.tr-selected')
                .find('select[choice='+choice_type+']:not([disabled])').val( $(this).val() )
                .end().find('select:not([choice='+choice_type+']:not([disabled]))').val('')
                .end().removeClass('tr-selected')
                .attr('productid', $(this).val() ); //传值到 rows
        }else{
            //单选设置
            $(this).closest('tr').find('select:not([choice='+choice_type+']:not([disabled]))').val('')
                   .end().attr('productid', $(this).val()); //传值到 row
        }

        //脏值检测
        $('#guoxin_import_table select:not([disabled])').each(function(){
            $(this).val() !== $(this).attr('originval') ? $(this).closest('td').addClass('dirty') : $(this).closest('td').removeClass('dirty');
        });
        $('#guoxin_import_table tr').removeClass('dirty').find('td.dirty').closest('tr').addClass('dirty');

        resetRowsBgColor();
    });

    //多选逻辑预设
    ['委托编号','成交编号'].forEach(function(field_name){
        $('#guoxin_import_table td[key='+field_name+']').hover(function(){
            $('td[key='+field_name+'][val='+ $(this).attr('val') +']').closest('tr').addClass('tr-hover').last().addClass('tr-hover-last').end().first().prev().addClass('tr-hover-prev');
        },function(){
            $('td[key='+field_name+'][val='+ $(this).attr('val') +']').closest('tr').removeClass('tr-hover').last().removeClass('tr-hover-last').end().first().prev().removeClass('tr-hover-prev');
        });

        $('#guoxin_import_table').on('click','td[key='+field_name+']',function(){
            var rows = $('td[key='+field_name+'][val='+ $(this).attr('val') +']').closest('tr');
            $(this).closest('tr').is('.tr-selected') ? rows.removeClass('tr-selected') : rows.addClass('tr-selected');
        });
    });

    //订单统计
    function getStatistics(){
        var table = $('#guoxin_import_table');
        var modifedRows = table.find('tr.dirty');

        var modified = {
            total: {
                    records: modifedRows.length,
                    entrust: modifedRows.filter(function(){
                        return $(this).find('[key=委托编号]').get(0) === modifedRows.find('[key=委托编号][val='+ $(this).find('[key=委托编号]').attr('val') +']').get(0);
                    }).length
            },
            records: Array.prototype.filter.call(modifedRows,function(item){
                        return $(item).get(0) === modifedRows.filter('[productid='+ $(item).attr('productid') +']').get(0);
                    }).map(function(row){
                        var id = $(row).attr('productid');

                        var rows = modifedRows.filter('tr[productid='+id+']');
                        var entrustRowsFirsts = rows.filter(function(){
                            return $(this).find('[key=委托编号]').get(0) === rows.find('[key=委托编号][val='+ $(this).find('[key=委托编号]').attr('val') +']').get(0);
                        });

                        var record = {
                            product_name: getProductInfoById(id)['name'],
                            records: {
                                total: rows.length,
                                buy: rows.filter(function(){
                                    return $(this).find('[key=买卖标志][val=证券买入]').length
                                }).length
                            },
                            entrust: {
                                total: entrustRowsFirsts.length,
                                buy: entrustRowsFirsts.filter(function(){
                                    return $(this).find('[key=买卖标志][val=证券买入]').length
                                }).length
                            }
                        };

                        record.records.sell = record.records.total - record.records.buy;
                        record.entrust.sell = record.entrust.total - record.entrust.buy;

                        //处理股票统计
                        var stocksRowsFirsts = rows.filter(function(){
                            var _this = this;
                            return $(this).get(0) === rows.find('[key=证券代码][val='+ $(this).find('[key=证券代码]').attr('val') +']').closest('tr').filter(function(){
                                return $(this).find('[key=交易所名称][val='+ $(_this).find('[key=交易所名称]').attr('val') +']').length;
                            }).get(0);
                        });

                        record.stocks = Array.prototype.map.call(stocksRowsFirsts,function(item){
                            var stockRows = rows.filter(function(){
                                return $(this).find( '[key=证券代码][val='+ $(item).find('[key=证券代码]').attr('val') +']' ).length
                            }).filter(function(){
                                return $(this).find( '[key=交易所名称][val='+ $(item).find('[key=交易所名称]').attr('val') +']' ).length
                            });

                            var entrustStockRowsFirsts = stockRows.filter(function(){
                                return $(this).find('[key=委托编号]').get(0) === stockRows.find('[key=委托编号][val='+ $(this).find('[key=委托编号]').attr('val') +']').get(0);
                            });

                            var stock = {
                                id: $(item).find('[key=证券代码]').attr('val'),
                                name: $(item).find('[key=证券名称]').attr('val'),
                                records: {
                                    total: stockRows.length,
                                    buy: stockRows.filter(function(){
                                        return $(this).find('[key=买卖标志][val=证券买入]').length
                                    }).length
                                },
                                entrust: {
                                    total: entrustStockRowsFirsts.length,
                                    buy: entrustStockRowsFirsts.filter(function(){
                                        return $(this).find('[key=买卖标志][val=证券买入]').length
                                    }).length
                                }
                            };

                            stock.records.sell = stock.records.total - stock.records.buy;
                            stock.entrust.sell = stock.entrust.total - stock.entrust.buy;

                            return stock;
                        });

                        return record;
                    })
        };

        var unsettedRows = table.find('[productid=""]');
        var data = {
            modified: modified,
            remain: {
                records: unsettedRows.length,
                entrust: unsettedRows.filter(function(){
                    return $(this).find('[key=委托编号]').get(0) === unsettedRows.find('[key=委托编号][val='+ $(this).find('[key=委托编号]').attr('val') +']').get(0);
                }).length
            }
        };

        var msgDiv = $( $('#total-info-msg-tpl').html() ).get(0);
        new Vue({el: msgDiv,data: data});
        return msgDiv;
    }

    //根据产品 id 获取详细信息
    var productIdToInfoCache = {};
    function getProductInfoById(product_id){
        return productIdToInfoCache[product_id] = productIdToInfoCache[product_id] || window.PRODUCTS.filter(function(item){
            return item.id == product_id;
        })[0];
    }

    function resetRowsBgColor(){
        $('#guoxin_import_table').find('tr[productid][productid!=""]').each(function(){
            var product = getProductInfoById($(this).attr('productid'));
            $(this).find('td:first').css('background', product && product['background'] );
        });
    }

    resetRowsBgColor();
});

function do_submit(dom) {
    $('select.sign_val:not([disabled])').each(function(k, v){
        var val = $(v).val();
        val && $(dom).append($('<input type="hidden" name="signs[' + $(v).data('sign-id') + ']">').val(val));
    });

    $('select.product_groups:not([disabled])').each(function(k, v){
        var val = $(v).val();
        val && $(dom).append($('<input type="hidden" name="product_groups[' + $(v).data('sign-id') + ']">').val(val));
    });

    return true;
}
</script>

@endsection
