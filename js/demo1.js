/*密码输入框*/
Vue.component('password-field',{
		template :'#tel',
		data(){
			return {
				nums:[
					 {n1:'1',stand:'',img:''},
					 {n1:'2',stand:'ABC',img:""},
					 {n1:"3",stand:'DEF',img:""},
					 {n1:"4",stand:'GHI',img:""},
					 {n1:"5",stand:'JLK',img:""},
					 {n1:"6",stand:'MNO',img:""},
					 {n1:"7",stand:'PQLS',img:""},
					 {n1:"8",stand:'TUV',img:""},
					 {n1:"9",stand:'WXYZ',img:""},
					 {n1:'',stand:'确认',img:""},
					 {n1:'0',stand:'',img:""},
					 {n1:'',stand:'',img:"images/delete.png"}
					],
				inputContent:[],
				str:1,
				errortext:false,
				dialogShow:false,
				content:''
			}
		},
		/*点击事件*/
		methods:{
			sent:function(index){
				
				if(index==11){
					this.inputContent.splice(this.inputContent.length-1,1);
				}else if(index==9){
					if(this.inputContent.length==6){
						var resulte=this.inputContent.join(' ');
						this.errortext=false;
						this.inputContent=[];
						this.dialogShow=true;
						this.content="输入的密码为："+resulte;
					}else{
						this.errortext=true
						return false;
					}
					
				}else{
					var password = this.nums[index].n1;
					if(this.inputContent.length<6&& password!=' '){
							this.inputContent.push(password);
						}
				}
				
			}
		},
		watch:{
			dialogShow:function(){
				var _this = this;
				setTimeout(function(){_this.dialogShow=false},1500)
			}
		}
	});

