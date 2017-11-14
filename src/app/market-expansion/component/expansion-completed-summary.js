/**
 * 处理模版文件
 * 1.将 template 标签内的内容返回
 * 2.将 style 标签添加到 head
 * @param {String} tplStr 
 */
function getTemplate(tplStr) {
    var tempDom = document.createElement('div');
    tempDom.innerHTML = tplStr;
    var templateNode = tempDom.getElementsByTagName('template')[0];
    var styleNode = tempDom.getElementsByTagName('style')[0];
    if(styleNode) {
        // 样式添加到 head 内
        var afterDealStyleNode = document.createElement('style');
        less.render(styleNode.innerText, function(err, output){
            if(err) {
                console.error('tpl: ', styleNode.innerText, err);
            } else {
                afterDealStyleNode.innerHTML = String(output.css);
            }
        })
        lf.ready(function(){
            document.getElementsByTagName('head')[0].appendChild(afterDealStyleNode);
        });
    }
    if(!templateNode) {
        console.error('文件模版最外层缺少 template 标签');
    }
    if(!templateNode.innerHTML) {
        console.warn('文件模版template内，内容为空');
    }
    tempDom = null;
    return templateNode.innerHTML;
}
Vue.component('expansionCompletedSummary', function(resolve, reject){
    // iso 模拟机上，初次启动时不加载，修改文件liveReload时加载，问题尚未定位，有待解决 
    var pageUrl = './component/expansion-completed-summary.tpl';
    
    lf.get(pageUrl, function(res) {
        resolve({
            template: getTemplate(res),
            props: ['item'],
            data: function() {
                return {
                    age: 222,
                    aa: 11
                }
            },
            computed: {
                afterV: function() {
                    return this.age - this.aa; 
                }
            },
            methods: {
                itemTap: function() {
                    this.$emit('detail-click');
                    document.getElementById("message").innerHTML = 222;
    
                },
                valueChange: function() {
                }
            },
            mounted: function() {
            }
        })
    })
});