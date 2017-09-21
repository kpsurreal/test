<section  cid="frozen_fund-detail">
	<div class="popup-wrap mod-popup mfp-hide oms-popup popup-order-detail frozen-fund" popup >
        <header class="popup-hd">
            <h2 data-src="name"></h2>
        </header>
        <div class="popup-bd">
            <div class="content-bd">
                <table class="oms-table loading-loading nothing-nothing">
                    <tr class="hd">
                        <th>冻结资金</th>
                        <th>证券市值</th>
                        <th>生效日</th>
                        <th>更新</th>
                    </tr>
                    <tr row-new>
                        <td>
                            <input type="number" step="any" data-src="frozen" pattern="^(\-|\+)?\d*\.?\d*$" placeholder="冻结资金">
                        </td>
                        <td>
                            <input type="number" step="any" data-src="unfrozen" pattern="^\d*\.?\d*$" placeholder="解冻资金">
                        </td>
                        <td>
                            <input type="date" data-src="actived_at|sqlTimeDay" pattern="^\d{4}\-\d{2}\-\d{2}$" placeholder="生效日期">
                        </td>
                        <td>
                            <span class="oms-btn sm blue">新增</span>
                        </td>
                    </tr>
                    <tbody class="loading-hide" rows-body></tbody>
                    <script type="text/html" row-tpl>
                        <tr>
                            <td>
                                <input type="number" step="any" data-src="frozen" pattern="^(\-|\+)?\d*\.?\d*$" placeholder="冻结资金">
                            </td>
                            <td>
                                <input type="number" step="any" data-src="unfrozen" pattern="^\d*\.?\d*$" placeholder="解冻资金">
                            </td>
                            <td>
                                <input type="date" data-src="actived_at|subString:0:10" pattern="^\d{4}\-\d{2}\-\d{2}$" placeholder="生效日期">
                            </td>
                            <td>
                                <span class="oms-btn sm">更新</span>
                            </td>
                        </tr>
                    </script>
                </table>

            </div>
        </div>
    </div>
    <script>
    (function(){
        var me = $(this);
        me = me.find('[popup]');

        var product_id = '';

        $(window).on('open_frozen_fund_detail',function(event){
            me.find('.popup-hd').render(event.frozen_fund);
            product_id = event.frozen_fund.id;
            openHandOrderById(event.frozen_fund.id);
        });

        me.on('click','table tr .oms-btn',function(){
            var row = $(this).closest('tr');

            row.find('input').each(function(){ validateInput(this); });
            if( row.find('input.stuck').length ){
                $.omsAlert( row.find('input.stuck:first').focus().attr('placeholder')+'不正确',false );
                return;
            }

            var data = {
                id: product_id,
                frozen: row.find('input[data-src=frozen]').val(),
                unfrozen: row.find('input[data-src=unfrozen]').val(),
                actived_at: row.find('input[data-src*=actived_at]').val()
            }

            if(!data.frozen && !data.unfrozen){return $.omsAlert('冻结或解冻至少填写一项！',false);}

            if(row.is('.loading')){return false;}

            row.addClass('loading');
            var url = (window.REQUEST_PREFIX||'')+'/oms/advanced/exec_frozen_fund_update';
            $.post( url, data ).done(function(res){
                if(res.code==0){
                    $.magnificPopup.close();
                    $(window).trigger({type:'advanced:exec_frozen_fund_update:success'});
                    $.omsAlert('更新成功');
                }else{
                    $.failNotice(url,res);
                }
            }).fail( $.failNotice.bind(null,url) ).always(function(){
                row.removeClass('loading');
            });

            return false;
        });

        function openHandOrderById(id){
            var url = (window.REQUEST_PREFIX||'')+'/oms/advanced/get_frozen_fund_detail?id='+id;
            $.get(url).done(function(res){
                res.code==0 ? openHandOrder(res.data) : $.failNotice(url,res);
            });
        }

        function openHandOrder(frozen_fund){
            me.renderTable(frozen_fund);

            $.magnificPopup.open({
                items: {
                    src: me,
                    type: "inline",
                    midClick: true
                },
                callbacks: {
                    open: function() {
                        $(window).trigger({type:'frozen_fund_detail_opened',frozen_fund:frozen_fund});
                        me.find('[row-new]').render({});
                    }
                }
            });

            function render(frozen_fund){

            }
        }

        function getProductById(id){
            return PRODUCTS.filter(function(x){
                return x.id == id;
            })[0];
        }

        function validateInput(input){
            input = $(input);
            var patternStr = $(input).attr('pattern');
            var reg = new RegExp(patternStr);
            var value = $(input).val().trim();
            reg.test(value)
                ?   $(input).removeClass('stuck').addClass('pass').trigger({type:'pattern_pass'})
                :   $(input).removeClass('pass').addClass('stuck').trigger({type:'pattern_stuck'});

            return input;
        };

    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
