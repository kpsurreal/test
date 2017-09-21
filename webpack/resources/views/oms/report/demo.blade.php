<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <style>
        tr {page-break-inside: avoid;}
        .water-print{
            position: absolute;
            overflow: hidden;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        .water-print:before{
            content: '';
            position: absolute;
            width: 200%;
            height: 300%;
            top: -57%;
            left: -55%;
            z-index: 10;
            background-image: url('{{$extra['background_image']}}');
            -webkit-transform: rotate(30deg);
            -moz-transform: rotate(30deg);
            -ms-transform: rotate(30deg);
            -o-transform: rotate(30deg);
            transform: rotate(30deg);
        }
    </style>
  </head>

  <body style="font-family: 'pingFang SC'; width:1024px;position: relative;">
    <script src="{{ asset('/js/jquery.min.js') }}"></script>
    <script src="{{ asset('/js/common.js') }}"></script>
    <script src="{{ asset('/js/numeral.min.js') }}"></script>
    <script src="{{ asset('/js/moment.min.js') }}"></script>
    <script>
    var url_position_trend = '/product/chart-position-trend?product_id={{$extra['id']}}';
    </script>

    @if (isset($extra['settlement']) && !empty($extra['settlement']))
    <table style="width: 100%;" cellspacing="0" cellpadding="0">
        <tr>
            <td width="256px">
                <h2 style="font-size: 12px;margin: 0; line-height: 20px; border-bottom: 1px solid #eee;font-weight: 800px;">策略信息</h2>
                <table style="font-size: 10px;line-height: 22px;width:85%;font-weight:normal;" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">单位净值：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{(!empty($extra['settlement']) && isset($extra['settlement']['net_value'])) ? $extra['settlement']['net_value'] : ''}}</td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">当日盈亏：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">
                            {{(!empty($extra['settlement']) && isset($extra['settlement']['profit_rate_of_day'])) ? sprintf('%.2f', ($extra['collect_capital'] * $extra['settlement']['profit_rate_of_day'])) : ''}}
                            {{(!empty($extra['settlement']) && isset($extra['settlement']['profit_rate_of_day'])) ? sprintf('%.2f%%', $extra['settlement']['profit_rate_of_day'] * 100) : ''}}
                        </td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">开始运行日期：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{date('Y-m-d', $extra['start_time'])}}</td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">结束运行日期：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{date('Y-m-d', $extra['stop_time'])}}</td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">收益分成比例：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{sprintf('%.2f%%', $extra['profit_sharing_ratio'] * 100)}}</td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">止损比例：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{sprintf('%.2f%%', $extra['stop_loss'] * 100)}}</td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">已提取分成：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{(!empty($extra['settlement']) && isset($extra['settlement']['confirm_performance'])) ? sprintf('%.3f', $extra['settlement']['confirm_performance']) : ''}}</td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">结算时间：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{(!empty($extra['settlement']) && isset($extra['settlement']['settlement_time'])) ? $extra['settlement']['settlement_time'] : ''}}</td>
                    </tr>
                </table>
            </td>
            <td width="256px">
                <h2 style="font-size: 12px;margin: 0; line-height: 20px; border-bottom: 1px solid #eee;font-weight: 800px;">资产信息</h2>

                <table style="font-size: 10px;line-height: 22px;width:85%;font-weight:normal;" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">证券市值：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{(!empty($extra['settlement']) && isset($extra['settlement']['security_value'])) ? sprintf('%.3f', $extra['settlement']['security_value']) : ''}}</td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">初始投资总额：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{sprintf('%.3f', $extra['collect_capital'])}}</td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">剩余现金：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{(!empty($extra['settlement']) && isset($extra['settlement']['cash_value'])) ? sprintf('%.3f', $extra['settlement']['cash_value']) : ''}}</td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">总收益率：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{(!empty($extra['settlement']) && isset($extra['settlement']['profit_rate'])) ? sprintf('%.2f%%', $extra['settlement']['profit_rate'] * 100) : ''}}</td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">收益总分成：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{(!empty($extra['settlement']) && isset($extra['settlement']['performance_fee'])) ? sprintf('%.2f%%', ($extra['settlement']['performance_fee'] + $extra['settlement']['confirm_performance']) * 100)  : ''}}</td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">资产总值：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{(!empty($extra['settlement']) && isset($extra['settlement']['net_assets'])) ? sprintf('%.3f', $extra['settlement']['net_assets']) : ''}}</td>
                    </tr>
                    <tr>
                        <td style="border-top:1pt solid #BEBEBE;">总盈亏：</td>
                        <td style="border-top:1pt solid #BEBEBE; text-align: right;">{{(!empty($extra['settlement']) && isset($extra['settlement']['profit'])) ? sprintf('%.3f', $extra['settlement']['profit']) : ''}}</td>
                    </tr>
                </table>
            </td>
            <td style="padding-top:20px;">
              <div>
                  <div class="hcharts" style="width:512px;">
                      <div class="hcharts-main">
                          {{-- <div class="hcharts-title">
                              仓位
                              <span class="right">净值</span>
                          </div> --}}
                          <div id="position-charts" style="height:262px;width:100%;"></div>
                      </div>
                  </div>
                  <script src="{{ asset('/3rd/highstock/highstock.js') }}"></script>
                  <script src="{{ asset('/js/position-history-forPDF.js') }}"></script>
                <!--<img src="https://dn-gmf-product-face.qbox.me/image/banner/banner_1_content.png" alt="test alt attribute"  border="0" />-->
              </div>

            </td>
        </tr>
    </table>
    @endif
    <div class="container-bottom">
        @foreach ($datas as $index_root => $rows)
            <h1 style="text-align: center;font-size: 20px;line-height: 26px;">
                {{$extra['title']}}
                @if ($index_root > 0)
                    (续)
                @endif
            </h1>

            <table style="border-collapse: collapse;margin: 0 auto;width: 100%;border: 1px solid #BEBEBE;font-size: 10px;line-height:16px;font-weight:normal;" cellspacing="0" border=".5" cellpadding="0" bordercolor="#BEBEBE">
                <tr style="height: 20px;background-color: #D6DFE8;">
                    @foreach ($key_names as $key_name)
                    <?php
                        list($_key_name1, $_key_name2, $_key_name3) = array_pad(explode('-', $key_name), 3, '');
                        if(empty($_key_name2)) $_key_name2 = '%s';
                        if(empty($_key_name3)) $_key_name3 = 'left';
                    ?>
                    <th style="text-align: {{$_key_name3}};padding-{{$_key_name3}}: 10px;">{{$_key_name1}}</th>
                    @endforeach
                </tr>
                @foreach ($rows as $row)
                <tr style="height: 20px;">
                    @foreach ($key_names as $index => $key_name)

                    <?php
                        list($_key1, $_key2) = array_pad(explode('-', $index), 2, '');
                        list($_key_name1, $_key_name2, $_key_name3) = array_pad(explode('-', $key_name), 3, '');
                        if(empty($_key_name2)) $_key_name2 = '%s';
                        if(empty($_key_name3)) $_key_name3 = 'left';


                    ?>

                    @if (empty($_key2))
                        <th style="text-align: {{$_key_name3}};padding-{{$_key_name3}}: 10px;">{{isset($row[$_key1]) ? sprintf($_key_name2, $_key_name2 == '%.2f%%' ? (100 * $row[$_key1]) : $row[$_key1]) : '-'}}</th>
                    @else
                        <th style="text-align: {{$_key_name3}};padding-{{$_key_name3}}: 10px;">{{isset($row[$_key1][$_key2]) ? sprintf($_key_name2, $_key_name2 == '%.2f%%' ? (100 * $row[$_key1][$_key2]) : $row[$_key1][$_key2]) : '-'}}</th>
                    @endif

                    @endforeach
                </tr>
                @endforeach
            </table>
        @endforeach
    </div>
    <div class="water-print">

    </div>
  </body>
</html>
