'use strict';

Vue.component("vue-input-default", {
    props: ['val', 'ispercentage', 'dealmethod', 'showType'],
    template: '                  \n                <div class="vue_input_default" v-on:click="divclick" v-if="showType===\'input\'">\n                        <span v-show="isdeal">{{dealmethod | dealmethodFilter}}</span>\n                        <input type="text"  :value="val" v-on:focus="inputfouce" v-on:blur="inputblur" >\n                        <span v-show=ispercentage>\uFF05</span>\n                </div>\n                <div v-else class="vue-input-none">\n                    - -\n                </div>\n            ',
    filters: {
        dealmethodFilter: function dealmethodFilter(v) {
            if (v == "sell") return '-';else return '+';
        }
    },
    computed: {
        isdeal: function isdeal() {
            return !!this.dealmethod;
        }
    },
    methods: {
        inputfouce: function inputfouce(e) {
            e.target.parentNode.style = "border:1px solid black;";
        },
        inputblur: function inputblur(e) {
            e.target.parentNode.style = "border:1px solid #cccccc;";
        },
        divclick: function divclick(e) {
            $(this.$el).find('input').focus();
        }
    }

}); //输入框
//# sourceMappingURL=vue.component.commone.js.map
