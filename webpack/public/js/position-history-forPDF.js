/**
 * Created by buty on 15/8/17.
 */

$(function() {
    window.top.postMessage('highChartsLoading','*');
    $.getJSON(url_position_trend, function(res){
        window.top.postMessage('highChartsLoaded','*');

        if(res.code != 0) return ;
        data_history = res.data;
        if(data_history['date_time'].length <= 0) {
            $('#position-detail-empty').show(0);
            window.top.postMessage('highChartsNoData','*');
            return;
        }

        window.top.postMessage('highChartsReady','*');

        $('#position-charts').show(0);

        datetimes = {};
        categories = [];
        $(data_history['date_time']).each(function(k,v){
            categories.push(moment(v*1000).format('YYYY-MM-DD'));
            datetimes[k] = v * 1000;
        });

        var positions = [];
        var portfolio = [];
        var composite = [];
        for(k in datetimes) {
            window.IS_SHOW_POSITION && positions.push(data_history['position_index'][k] == 0 ? null : data_history['position_index'][k] * 100);
            portfolio.push(data_history['portfolio'][k] == 0 ? null : data_history['portfolio'][k]);
            composite.push(data_history['composite_index'][k] == 0 ? null : data_history['composite_index'][k]);
        }

        $('#position-charts').highcharts({
            title: {text: ' '},
            // Begin added by liuzeyafzy for https://github.com/highcharts/highcharts/issues/1850
            chart: {
                alignTicks: false
            },
            // End added by liuzeyafzy for https://github.com/highcharts/highcharts/issues/1850
            xAxis: {
                categories: categories,
                crosshair: true,
                labels: {
                    formatter:  function () {
                        var v = this.value.split('-');
                        return [v[1], v[2]].join('-');
                    },
                    style: {
                        fontSize:'8px'
                    }
                }
            },
            yAxis: [{ // Primary
                labels: {
                    format: '{value:,.0f} %',
                    style: {
                        fontSize:'8px',
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: /Mobile/.test(navigator.userAgent) ? false : {text: '仓位',style: {color: Highcharts.getOptions().colors[1],fontSize:'8px'}},
                min:0,
                max:100,

                tickInterval: 25,
                tickAmount: 5,
            }, { // Secondary
                labels: {
                    format: '{value:,.3f}',
                    style: {
                        fontSize:'8px',
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                title: /Mobile/.test(navigator.userAgent) ? false : {text: '净值',style: {color: Highcharts.getOptions().colors[0],fontSize:'8px'}},
                gridLineColor: '#F2F2F2',
                lineColor: 'transparent',
                opposite: true,
                // Begin modified by liuzeyafzy for https://github.com/highcharts/highcharts/issues/1850
                // tickAmount: 5,
                gridLineWidth: 0
                // End modified by liuzeyafzy for https://github.com/highcharts/highcharts/issues/1850
            }],
            tooltip: {
                formatter: function(){
                    var s = moment(this.x).format('YYYY-MM-DD');
                    $.each(this.points, function () {
                        s += '<br/>' + this.series.name + ': ';
                        switch(this.series.name) {
                            case '仓位':
                                this.y = numeral(this.y).format('0.00') + '%';
                            break;
                            case '净值':
                                this.y = JsMathBugFixedRound(this.y,2);
                            break;
                            case '沪深300':
                                this.y = numeral(data_history['composite_org'][this.x]).format('0.00');
                            break;

                        }
                        s += this.y;
                    });

                    return s;
                },
                shared: true
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                layout: 'horizontal',
                itemStyle: {'font-size': '8px'},
                // x: 0,
                // y: 20,
                enabled: true
            },
            series: [{
                name: '仓位',
                type: 'column',
                data: positions,
                tooltip: {
                    valueSuffix: ' %'
                },
                color: 'rgb(213,232,246)',
                states: {
                    hover: { enabled: false }
                },
            },{
                name: '净值',
                type: 'spline',
                yAxis: 1,
                data: portfolio,
                format: '{value:,.3f}',
                color: 'rgb(215,93,65)'
            },{
                name: '沪深300',
                type: 'spline',
                yAxis: 1,
                format: '{value:,.3f}',
                data: composite,
                color: 'rgb(54,164,215)',
            }],
            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    },
                    enableMouseTracking: false
                }
            }
        });
    });

    function JsMathBugFixedRound(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }
});
