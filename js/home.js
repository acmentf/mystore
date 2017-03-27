//使用rem策略，不断更新html的fontsize
function sizeHtml(){
    window.mtSizeBase = $(window).width()/6.4;
    $("html").css("font-size",window.mtSizeBase+"px");
}
$(function(){
    sizeHtml();
    $(window).resize(function(){
        setTimeout(function(){
            sizeHtml();
        },300);
    });
});
