$(function() {
    require.config({
        paths: {
            echarts: 'http://echarts.baidu.com/build/dist'
        }
    });
// 使用
    require(
        ['echarts','echarts/chart/line', 'echarts/chart/bar'],
        function(ec) {
            var myChart = ec.init(document.getElementById('position-chart'));
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                calculable : true,
                legend: {
                    data:['上证300','当前净值', '仓位'],
                    y: 'bottom'
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['2015-08-01', '2015-08-02', '2015-08-03', '2015-08-04', '2015-08-05', '2015-08-06',
                            '2015-08-07', '2015-08-08', '2015-08-09', '2015-08-10', '2015-08-11', '2015-08-12']
                    }
                ],
                //xAxis : [
                //    {
                //        type : 'time',
                //        min: 0,
                //        max: 90
                //    }
                //],
                //timeline: [
                //
                //],
                yAxis : [
                    {
                        type : 'value',
                        name : '仓位',
                        axisLabel : {
                            formatter: '{value} %'
                        }
                    },
                    {
                        type : 'value',
                        name : '当前净值',
                        axisLabel : {
                            formatter: '{value}'
                        }
                    }
                ],
                series : [

                    {
                        name:'上证300',
                        yAxisIndex: 1,
                        type:'line',
                        data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                    },
                    {
                        name:'当前净值',
                        type:'line',
                        data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                    {
                        name:'仓位',
                        type:'bar',
                        data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                    }
                ]
            };
            myChart.setOption(option);
        }
    );

});

                    