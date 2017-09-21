// 定制化文件
// 依赖于jquery.validate.js
(function(){
    /*
     * 函数定义
     **/
    // 手机号校验
    function checkCellphoneValidate(cellphone) {
        // return cellphone.match(/^(((1[3|4|5|7|8]{1}[0-9]{1}))+\d{8})$/);
        //在原来的正则基础上额外支持110和123开头的手机号，同时允许手机号为空字符串
        return (cellphone.match(/^(((1[3|4|5|7|8]{1}[0-9]{1})|(110)|(123))+\d{8})$/)||''==cellphone);
    }

    //中文校验
    function checkChineseValidate(str) {
        return str.match(/^[\u4e00-\u9fa5]*$/);
    }

    //中英文校验
    function checkChineseAndAlphaValidate(str) {
        return str.match(/^([\u4e00-\u9fa5]|[a-zA-Z])*$/);
    }

    //中英文数字校验
    function checkChineseAlphaNumberValidate(str){
        return str.match(/^([\u4e00-\u9fa5]|[a-zA-Z0-9])*$/);
    }

    //密码校验
    function checkPasswordValidate(password) {
        return password.match(/^([a-zA-Z0-9])*$/)
    }

    // 两位小数校验
    function checkNumberTwoPadValidate(str){
        return str.match(/^\d+(\.\d{1,2})?$/) || str == '';
    }

    /**
     * 添加自定义方法
     */
    $.validator.addMethod('checkphone', function(value, element) {
        return checkCellphoneValidate(value);
    });
    $.validator.addMethod('checkChinese', function(value, element) {
        return checkChineseValidate(value);
    });
    $.validator.addMethod('checkPassword', function(value, element) {
        return checkPasswordValidate(value);
    });
    $.validator.addMethod('checkChineseAndAlpha', function(value, element) {
        return checkChineseAndAlphaValidate(value);
    });
    $.validator.addMethod('checkChineseAlphaNumber', function(value, element) {
        return checkChineseAlphaNumberValidate(value);
    });
    $.validator.addMethod('checkNumberTwoPad', function(value, element) {
        return checkNumberTwoPadValidate(value);
    });

})();
