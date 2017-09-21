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
				this.settings.provinceObj = $(this.settings.province).selectize()[0].selectize;
				this.settings.cityObj = $(this.settings.city).selectize()[0].selectize;
				this.settings.cityOrigin = $(this.settings.city).html();
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
					this.settings.provinceObj.clearOptions();
					this.settings.provinceObj.load(function(callback) {
						var result = [];
						for(var i in province_list) {
							result[i] = {'text':province_list[i][1], 'value':province_list[i][1]};
						}
						callback(result);
					});
					
					this.settings.provinceObj.on('change', function(value) {
						if (!value.length) return;
						var pid = obj.getIdByName(province_list, value);
						obj.bindCityData(city_list, pid);
					})
					if(this.settings.selectedInfo.province) {
						this.settings.provinceObj.setValue(this.settings.selectedInfo.province);
					}
				}
			},
			bindCityData: function(city_list, relation_id) {
				if(relation_id && city_list) {
					this.settings.cityObj.clearOptions();
					this.settings.cityObj.load(function(callback) {
						var result = [];
						for(var i in city_list) {
							if(city_list[i][3] == relation_id){
								result.push({'text':city_list[i][1], 'value':city_list[i][1]});
							}
						}
						
						callback(result);
					});

					if(this.settings.selectedInfo.city) {
						this.settings.cityObj.setValue(this.settings.selectedInfo.city);
					}
				} else {
					this.settings.cityObj.clearOptions();
					this.settings.cityObj.setValue(this.settings.cityOrigin);
				}
			},
			getIdByName: function(data_list, name) {
				var data_id = 0;
				for(var i in data_list) {
					if(data_list[i][1] == name) {
						data_id = data_list[i][0];
					}
				}

				return data_id;
			}
		}
	});

}));


