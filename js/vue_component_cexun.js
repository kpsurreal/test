Vue.component("vue-input-default",{
    props:['val','ispercentage','dealmethod','showType'],
    template:`                  
                <div class="vue_input_default" v-on:click="divclick" v-if="showType==='input'">
                        <span v-show="isdeal">{{dealmethod | dealmethodFilter}}</span>
                        <input type="text"  :value="val" v-on:focus="inputfouce" v-on:blur="inputblur" >
                        <span v-show=ispercentage>％</span>
                </div>
                <div v-else class="vue-input-none">
                    - -
                </div>
            `,
    filters:{
        dealmethodFilter:function(v){
            if(v == "sell")
            return '-';
            else return '+'
        }
    },
    computed:{
        isdeal:function(){
            return !!this.dealmethod
        }
    },
    methods: {
        inputfouce:function(e){
            e.target.parentNode.style = "border:1px solid black;";
        },
        inputblur:function(e){
            e.target.parentNode.style = "border:1px solid #cccccc;";
        },
        divclick:function(e){
            $(this.$el).find('input').focus();  
        }
    }

}); //输入框