Vue.component('section-box',{
	template:`<section class="warp">
				<div class="search-section clearfix">
					<input type="text" name="search" class="fl" @click="showToggle=!showToggle" :value="conent">
					<input type="button" name="submit" :value="text" class="fl" :class="color">
					<span></span>
				</div>
				<options-ul v-show="showToggle" :list="list" v-on:send="addValue" :toggle="showToggle"></options-ul>
			</section>`,
	props:['text','color','list'],
	data(){
		return{
			showToggle:false,
			conent:''
		}
		
	},
	methods:{
		addValue(item){
			this.conent=item.text
		}
	},
	watch:{
		conent:function(){
			this.showToggle=false
		}
	},
	components:{
		'options-ul':{
			template:`
					<ul class="options" v-show="toggle">
						<li v-for="item in list" @click="send(item)">{{item.text}}</li>
					</ul>`,
			props:['toggle','list'],
			methods:{
				send:function(item){
					this.toggle=false;
					this.$emit('send',item);
				}
			}
		}
	}

});
var list ={
	list1:[
		{text:'html+css'},
		{text:'html5+css'},
		{text:'javaScript'}
	],
	list2:[
		{text:"北京"},
		{text:"上海"},
		{text:"长沙"}
	]
}
const vm = new Vue({
	el:'#app',
	data:list
})