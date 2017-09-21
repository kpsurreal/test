//分红乐计算器
function toThousands(num,decimal_places) {
    var numStr = (parseFloat(num) || 0).toFixed(decimal_places || 0);
    var numArr = numStr.split('.');
    return numArr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + (numArr[1]?'.'+numArr[1]:'');
}

//分红乐计算器
$(function(){
  var ratio = 10;
  var months = 3;
  var money = 5000;

  $("#bonus_range_ratio").ionRangeSlider({
    min: 5,
    max: 16,
    from: ratio,
    postfix: '%',
    step: 1,
    onChange: valueChange
  });

  $("#bonus_range_months").ionRangeSlider({
    min: 1,
    max: 6,
    from: months,
    grid: true,
    grid_num: 5,
    postfix: '个月',
    step: 1,
    onChange: valueChange
  });

  var money_values = [0,1000,2000,3000,4000,5000,10000,20000,30000,40000,50000,100000,200000,300000,400000,500000,1000000];

  $("#bonus_range_money").ionRangeSlider({
    values: money_values,
    from: money_values.indexOf(money),
    postfix: '元',
    onChange: valueChange
  });

  function valueChange(){
    resetValues();
    setTimeout(resetValues,100);
    setTimeout(resetValues,500);
    setTimeout(resetValues,1000);
  }

  function resetValues(){
    var ratio_new_value = $("#bonus_range_ratio").ionRangeSlider().data().ionRangeSlider.result.from;
    var months_new_value = $("#bonus_range_months").ionRangeSlider().data().ionRangeSlider.result.from;
    var money_new_value = $("#bonus_range_money").ionRangeSlider().data().ionRangeSlider.result.from_value;

    if( ratio_new_value == ratio && months_new_value == months && money_new_value == money ){
      return;
    }

    (months_new_value != months) && resetGrid('#bonus_range_months');

    ratio = ratio_new_value;
    months = months_new_value;
    money = money_new_value;
    calculate();
  }

  function calculate(){
    $("#bonus_ratio_value").text(ratio+'%');
    $("#bonus_months_value").text(months+'个月');
    $("#bonus_money_value").text(toThousands(money)+'元');

    var profit = money*months*(ratio/100)/12;
    var result = money + profit;

    var baby = money*months*(3.1/100)/12;
    var bank = money*months*(1.1/100)/12;
    var max = Math.max(profit,baby,bank) || 100000000;

    $("#bonus_gmf_profit").text(toThousands(profit,2)+'元').next().find('i').css('width',(Math.max(profit,0)/max)*100 + '%');
    $("#bonus_baby_profit").text(toThousands(baby,2)+'元').next().find('i').css('width',(Math.max(baby,0)/max)*100 + '%');
    $("#bonus_bank_profit").text(toThousands(bank,2)+'元').next().find('i').css('width',(Math.max(bank,0)/max)*100 + '%');
    $("#bonus_result").text(toThousands(result,2));
  }
  calculate();
});

//操盘乐计算器
$(function(){
  var ratio = 25;
  var months = 3;
  var money = 5000;

  $("#caopan_range_ratio").ionRangeSlider({
    min: -25,
    max: 100,
    from: ratio,
    postfix: '%',
    step: 1,
    onChange: valueChange
  });

  $("#caopan_range_months").ionRangeSlider({
    min: 1,
    max: 6,
    from: months,
    grid: true,
    grid_num: 5,
    postfix: '个月',
    step: 1,
    onChange: valueChange
  });

  var money_values = [0,1000,2000,3000,4000,5000,10000,20000,30000,40000,50000,100000,200000,300000,400000,500000,1000000];

  $("#caopan_range_money").ionRangeSlider({
    values: money_values,
    from: money_values.indexOf(money),
    postfix: '元',
    onChange: valueChange
  });

  function valueChange(){
    resetValues();
    setTimeout(resetValues,100);
    setTimeout(resetValues,500);
    setTimeout(resetValues,1000);
  }

  function resetValues(){
    var ratio_new_value = $("#caopan_range_ratio").ionRangeSlider().data().ionRangeSlider.result.from;
    var months_new_value = $("#caopan_range_months").ionRangeSlider().data().ionRangeSlider.result.from;
    var money_new_value = $("#caopan_range_money").ionRangeSlider().data().ionRangeSlider.result.from_value;

    if( ratio_new_value == ratio && months_new_value == months && money_new_value == money ){
      return;
    }

    (months_new_value != months) && resetGrid('#caopan_range_months');

    ratio = ratio_new_value;
    months = months_new_value;
    money = money_new_value;
    calculate();
  }

  function calculate(){
    $("#caopan_ratio_value").text(ratio+'%');
    $("#caopan_months_value").text(months+'个月');
    $("#caopan_money_value").text(toThousands(money)+'元');

    var profit = ratio > 0 ? money*(ratio/100)*.8 : money*(ratio/100);
    var result = money + profit;

    var baby = money*months*(3.1/100)/12;
    var bank = money*months*(1.1/100)/12;

    var max = Math.max(profit,baby,bank) || 100000000;

    $("#caopan_gmf_profit").text(toThousands(profit,2)+'元').next().find('i').css('width',(Math.max(profit,0)/max)*100 + '%');
    $("#caopan_baby_profit").text(toThousands(baby,2)+'元').next().find('i').css('width',(Math.max(baby,0)/max)*100 + '%');
    $("#caopan_bank_profit").text(toThousands(bank,2)+'元').next().find('i').css('width',(Math.max(bank,0)/max)*100 + '%');
    $("#caopan_result").text(toThousands(result,2));
  }

  calculate();

  $(window).on('message',function(event){
    event.originalEvent.data == 'pageStateChanged' && resetAllGrid();
  });

  resetAllGrid();
});

function resetAllGrid(){
    setTimeout(function(){
      resetGrid('#caopan_range_months');
      resetGrid('#bonus_range_months');
    },300);
}

function resetGrid(dom_id){
  var data = $(dom_id).ionRangeSlider().data().ionRangeSlider.result;
  var percent = data.from_percent;
  $(data.slider).find('span').removeClass('active').each(function(){
    parseFloat( $(this).css('left') )/parseFloat( $(this).parent().css('width') )*100 <= percent && $(this).addClass('active');
  });
}
