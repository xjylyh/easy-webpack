#! /usr/bin/env node
//这个文件来描述如何打包
let entry = './src/index.js';//入口文件
let output = './dist/main.js';//输出文件
let fs = require('fs');
let script = fs.readFileSync(entry,'utf8');//读出入口js的内容
let path = require('path');//path模块为了处理路径
let modules = [];//储存匹配到的模块的路径和内容

//官方文档 loader->function（loader就是一个函数）
let styleLoader = function(source){//负责将结果进行更改，进行style引入
    //source代表样式文件中的内容
    return `
        let style = document.createElement('style');
        style.innerText = ${JSON.stringify(source).replace(/\\r\\n/g,'')}
        document.head.appendChild(style);
    `
}
//处理依赖关系
script = script.replace(/require\(['"](.+?)['"]\)/g,function(){//处理入口页面引入的模块（依赖）
    let name = path.join('./src',arguments[1]);//拼接依赖路径
    let content = fs.readFileSync(name,'utf8');//拿到依赖中的内容
    if(/\.css$/.test(name)){//如果匹配到css则用styleLoader处理
        content = styleLoader(content);
    }
    modules.push({//存储到模块数组中
        name,content
    })
    return `require("${name}")`;//根据模板的模块加载方法进行调用和递归调用
})
let ejs = require('ejs');//使用ejs来进行模板渲染和变量替换



let template = ` (function(modules) { 
    function require(moduleId) {

        var module = {
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, require);

        return module.exports;
    }
    return require("<%=entry%>");
})
({
"<%=entry%>": (function(module, exports, require) {

eval(\`<%-script%>\`);

})
<%for(let i=0;i<modules.length;i++){
    let module = modules[i];%>,
    "<%-module.name%>": (function(module, exports,require) {
        eval(\`<%-module.content%>\`);
    })
<%}%>
});`//↑这里循环的是所有的依赖项
let result = ejs.render(template,{
    entry,script,modules
});
//result为替换后的结果
fs.writeFileSync(output,result);
console.log('render is ok');