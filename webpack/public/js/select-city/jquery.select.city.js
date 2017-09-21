(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery"], factory );
	} else {
		factory( jQuery );
	}
} (function($) {
	$.extend($.fn, {
		selectDist: function(options) {
			var selectDistor = $.data( this, "selectDistor" );
			if ( selectDistor ) {
				return selectDistor;
			}
			selectDistor = new $.selectDistor( options, this );
			$.data( this, "selectDistor", selectDistor );
			
			return selectDistor;
		}
	});

	$.selectDistor = function( options, el ) {
		this.settings = $.extend( true, {}, $.selectDistor.defaults, options );
		this.currentBlock = el;
		this.init();
	};

	$.extend( $.selectDistor, {
		defaults: {
			wrapBlock: {},
			provinceObj: {},
			cityObj: {},
			province : '#province',
			city : '#city',
			dataUrl : './dis_common_district.json',
			selectedInfo: {},
			valueType : 'text',
			cityOrigin: '',
		},
		prototype: {
			init: function() {
				this.settings.provinceObj = $(this.settings.province);
				this.settings.cityObj = $(this.settings.city);
				this.settings.cityOrigin = this.settings.cityObj.html();
				this.getData(this.settings.dataUrl);
			},
			getData: function(url) {
				var obj = this;
				$.getJSON(url, {}, function(data) {
					distData = obj.parseData(data);
					obj.bindData(distData);
				});
			},
			parseData: function(data) {
				var distData = [];
				distData['province_list'] = [];
				distData['city_list'] = [];
				for (var i in data) {
					if(data[i][2] == 1)
						distData['province_list'].push(data[i]);
					if(data[i][2] == 2) {
						distData['city_list'].push(data[i]);
					}
				}

				return distData;
			},
			bindData: function(data) {
				this.bindProvinceData(data);
			},
			bindProvinceData: function(data) {
				var obj = this;
				province_list = data['province_list'];
				city_list = data['city_list'];
				if(province_list) {
					var province_str = '';
					for(var i in province_list) {
						var selected = this.checkSelected(province_list[i], this.settings.selectedInfo.province);
						var val = this.selectedVal(province_list[i]);
						province_str += '<option pid-id="'+province_list[i][0]+'" value="'+val+'" '+selected+'>'+province_list[i][1]+'</option>';
					}

					this.settings.provinceObj.append(province_str);

					if(relation_id = this.settings.provinceObj.find("option:selected").attr('pid-id')) {
						obj.bindCityData(city_list, relation_id);
					}
					
					this.settings.provinceObj.change(function() {
						var relation_id = $(this).find("option:selected").attr('pid-id');
						obj.bindCityData(city_list, relation_id);
					});
				}
			},
			bindCityData: function(city_list, relation_id) {
				if(relation_id && city_list) {
					var city_str = '';
					for(var i in city_list) {
						if(city_list[i][3] == relation_id) {
							var selected = this.checkSelected(city_list[i], this.settings.selectedInfo.city);
							var val = this.selectedVal(city_list[i]);
							city_str += '<option value="'+val+'"'+selected+'>'+city_list[i][1]+'</option>';
						}
					}

					this.settings.cityObj.html(city_str);
				} else {
					this.settings.cityObj.html(this.settings.cityOrigin);
				}
			},
			selectedVal: function(dataInfo) {
				var return_val = '';
				var value_type = this.settings.valueType;
				if(value_type == 'text') {
					return_val = dataInfo['1'];
				} else if(value_type == 'id') {
					return_val = dataInfo['0'];
				}

				return return_val;
			},
			checkSelected: function(dataInfo, equalInfo) {
				var selected = '';
				if(equalInfo) {
					var checkFactor = equalInfo.factor;
					if(checkFactor == 'text') { //检测text
						if(dataInfo[1] == equalInfo.val) {
							selected = 'selected';
						}
					} else if(checkFactor == 'id') {
						if(dataInfo[0] == equalInfo.val) {
							selected = 'selected';
						}
					}
				}
				
				return selected;
			}
		}
	});

}));


