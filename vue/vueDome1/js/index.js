/*存取localStorage中的数据*/
var store = {
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value))
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key))
	}
}
// var list = [
// 			{text:"javaScript权威指南",checked:false},
// 			{text:"锋利的Jquery",checked:false},
// 			{text:"java实战",checked:true}
// 		];
var list = store.fetch('vue-data')||[];
var vm = new Vue({
	el:'#app',
	data:{
		list:list,
		todoList:"",
		edit:'',
		beforeEdit:'',
		visibitily:"all"
	},
	watch:{
		/*list:function(){
			store.save('vue-data',this.list)
		}*/
		list:{
			handler(){
				store.save('vue-data',this.list)
			},
			deep:true
		}
	},
	methods:{
		addTodo(){
			this.todoList? this.list.push({text:this.todoList,checked:false}) : false
			this.todoList=''
		},
		removeList(todo){
			var index = this.list.indexOf(todo);
			this.list.splice(index,1)
		},
		editTodo(todo){
			this.beforeEdit = todo.text
			this.edit = todo;
			console.log(this.edit);
		},
		edited(todo){
			this.edit = '';
		},
		cancelEdit(todo){
			todo.text = this.beforeEdit;
			this.edit = ''
		}
	},
	computed:{
		counts(){
			return this.list.filter(function(item){
				return item.checked==false
			}).length
		},
		filterenList(){
			var filter = {
				all(list){
					return list
				},
				uncomplie(list){
					return list.filter(function(item){
						return !item.checked;
					})
				},
				complied(list){
					return list.filter(function(item){
						return item.checked;
					})
				}
			}
			return filter[this.visibitily](list)
		}
		
	},
	directives:{
		'focus':{
			update(el,binding){
				if(binding.value){
					el.focus()
				}
				
			}
		}
	}
})
/*hash映射*/
function watchHashChange(){
	var hash = window.location.hash.slice(1);
	vm.visibitily = hash;
}
watchHashChange();
window.addEventListener('hashchange',watchHashChange)