$.extend({
    randomNo: function(prefix,max_length){
        var str = (prefix?(prefix+'-'):'') + (new Date().valueOf()+''+Math.random()).replace('0.','-');
        return max_length ? str.substr(0,max_length) : str;
    },
    randomId: function(prefix){
        return ( prefix || '' ) + ( new Date().valueOf().toString(36)+Math.random().toString(36) ).split('0.').join('_').toUpperCase();
    },
    multiline: function(fn){
        //https://github.com/sindresorhus/multiline
        var reCommentContents = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)[ \t]*\*\//;
        if(typeof fn !== 'function'){throw new TypeError('Expected a function');}
        var match = reCommentContents.exec(fn.toString());
        if(!match){throw new TypeError('Multiline comment missing.');}
        return match[1];
    },
    pullValue: function(obj,key,default_value){
        var keys_arr = key.toString().split('.');
        var subobj = obj;
        try{
            while(keys_arr.length)
                subobj = subobj[ keys_arr.shift() ];
            return !/Null|Undefined/.test(Object.prototype.toString.call(subobj)) ? subobj : default_value;
        }catch(e){
            return default_value;
        }
    },
    pushValue: function(obj,key,value){
        var subkey,
            subobj = obj,
            keys_arr = key.split('.');

        while(keys_arr.length>1)(
            subkey = keys_arr.shift(),
            subobj = subobj[subkey] = (
                !/Number|String|Null|Undefined/.test(Object.prototype.toString.call(subobj[subkey]))
                ? subobj[subkey]
                : {}
            )
        )

        subobj[ keys_arr.shift() ] = value;
    },
    dirtyCheck: function(key,value){
        return !$.cacheUnchangedCheck(key,value);
    },
    cacheUnchangedCheck: function(){
        var cache = {};

        return function(key,new_value){
            var result = true;
            var old_value = $.pullValue(cache,key);
            $.pushValue(cache,key,new_value);

            if( /Number|String|Null|Undefined/.test( Object.prototype.toString.call(new_value) ) ){
                result = result && old_value === new_value;
                return result;
            }else{
                for(var k in new_value){
                    if( new_value.hasOwnProperty(k) ){
                        result = result && $.pullValue(new_value,k) === $.pullValue(old_value,k);
                        if(!result){
                            return result;
                        }
                    }
                }
            }

            if( /Number|String|Null|Undefined/.test( Object.prototype.toString.call(old_value) ) ){
                result = result && old_value === new_value;
                return result;
            }else{
                for(var k in old_value){
                    if( old_value.hasOwnProperty(k) ){
                        result = result && $.pullValue(new_value,k) === $.pullValue(old_value,k);
                        if(!result){
                            return result;
                        }
                    }
                }
            }

            return result;
        }
    }(),
    omsSaveLocalJsonData: function(name,obj){
        var prefix = 'oms_';
        localStorage[prefix+name] = JSON.stringify(obj);
    },
    omsGetLocalJsonData: function(name,key,default_value){
        var prefix = 'oms_';
        try{
            var result = JSON.parse(localStorage[prefix+name]);
            return key ? $.pullValue(result,key.toString(),default_value) : result;
        }catch(e){
            return default_value;
        }
    },
    omsUpdateLocalJsonData: function(name,key,value){
        var info_cache = $.omsGetLocalJsonData(name) || {};
        if( /Null|Undefined/.test(Object.prototype.toString.call(value)) ){
            delete info_cache[key];
        }else{
            info_cache[key] = value;
        }
        $.omsSaveLocalJsonData(name,info_cache);
    },
    omsCacheLocalJsonData: function(name,key,value){
        if( /Null|Undefined/.test(Object.prototype.toString.call(value)) ){
            return $.omsGetLocalJsonData(name,key);
        }else{
            $.omsUpdateLocalJsonData(name,key,value);
            return value;
        }
    }
});

//includes polifill
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

//2, '.', ','
Number.prototype.formatMoney = function(c, d, t){
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
