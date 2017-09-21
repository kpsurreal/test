<section class="foot-blue-tip" style="padding-left:30px;background:#EDF7FB;position:relative;color:#5D98B3; display:none;">
    <div style="position:absolute;height:100%;width:10px;background:#9CE1EC;top:0;left:0;"></div>
    <h1 style="color:#9CE1EC;">风控状态说明</h1>
    <style media="screen">
        .risk-foot-tip-table{width:90%;}
        .risk-foot-tip-table,
        .risk-foot-tip-table tr,
        .risk-foot-tip-table tr th,
        .risk-foot-tip-table tr td
        {font-weight:600;line-height:2.5;color:#5D98B3;text-align:center;}
        .risk-foot-tip-table tr td.invisible{color:transparent;-webkit-user-select:none;user-select:none;}
        .risk-foot-tip-table tr th:first-of-type,
        .risk-foot-tip-table tr td:first-of-type
        {float:left;}
    </style>
    <table class="risk-foot-tip-table">
        <tr>
            <td></td>
            <td>止损</td> <td>即将止损</td>  <td>预警</td>  <td>即将预警</td>  <td>中度风险</td>  <td>低风险</td>  <td>正常</td>
        </tr>
        <tr>
            <td>进取型操盘乐</td>
            <td>≤0.75</td><td>(0.75,0.82]</td><td> (0.82,0.86]</td><td> (0.86,0.89]</td><td> (0.89,0.96]</td><td> (0.96,1.0]</td><td> >1.0</td>
        </tr>
        <tr>
            <td> 分红乐 </td>
            <td> ≤0.85</td><td> (0.85,0.87]</td><td> (0.87,0.91]</td><td>  (0.91,0.93]</td><td> (0.93,0.96]</td><td> (0.96,1.0]</td><td> >1.0</td>
        </tr>
    </table>
    <table class="risk-foot-tip-table">
        <tr>
            <td></td>
            <td>止损穿仓比</td><td>即将止损穿仓比（仓位降至40%）</td>
            <td class="invisible">随便填充</td><td class="invisible">随便填充</td><td class="invisible">随便填充</td><td class="invisible">随便填充</td>
        </tr>
        <tr>
            <td>无忧型操盘乐</td>
            <td>小于等于预设平仓线（默认110%）</td><td>小于等于预设警戒线（默认115%）</td>
            <td class="invisible">随便填充</td><td class="invisible">随便填充</td><td class="invisible">随便填充</td><td class="invisible">随便填充</td>
        </tr>
        <tr>
            <td>稳赢型操盘乐</td>
            <td>小于等于预设平仓线（默认110%）</td><td>小于等于预设警戒线（默认115%）</td>
            <td class="invisible">随便填充</td><td class="invisible">随便填充</td><td class="invisible">随便填充</td><td class="invisible">随便填充</td>
        </tr>
    </table>
    <p style="margin-top:20px;">
        可用资金 = 策略初始资金 - 证券冻结资金 ＋ 证券解冻资金 - 交易费 - 已购买策略金额 + 已赎回策略金额 - 已确认收益分成 - 策略管理费 - 投资资金支付通道费(退出费可以给操盘人使用)
    </p>
</section>
