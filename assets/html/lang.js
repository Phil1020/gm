var LANGUAGE_CODE = "zh"; //标识语言

function loadProperties(type) {
    jQuery.i18n.properties({
        name: 'lang', // 资源文件名称
        path: 'lang/', // 资源文件所在目录路径
        mode: 'map', // 模式：变量或 Map 
        language: type, // 对应的语言
        cache: false,
        encoding: 'UTF-8',
        callback: function () { // 回调方法    
            $("[data-lang]").each(function(){
                console.log($(this).data("lang"))
                $(this).html($.i18n.prop($(this).data("lang")));
            });
        }
    });
}

function changeLand() {
    LANGUAGE_CODE = LANGUAGE_CODE == 'zh' ? 'en' : 'zh';
    loadProperties(LANGUAGE_CODE);
}

loadProperties(LANGUAGE_CODE)
// $(document).ready(function () {
//     LANGUAGE_CODE = jQuery.i18n.normaliseLanguageCode({}); //获取浏览器的语言     
//     loadProperties(LANGUAGE_CODE);
// })
