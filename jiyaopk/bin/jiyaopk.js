#! /usr/bin/env node
//这个文件来描述如何打包
let entry = './src/index.js';//入口文件
let output = './dist/main.js';//输出文件
let fs = require('fs');
let script = fs.readFileSync(entry,'utf8');
let path = require('path');
let modules = [];
let styleLoader = function(source){//负责将结果进行更改，进行style引入
    //source代表样式文件中的内容
    return `
        let style = document.createElement('style');
        style.innerText = ${JSON.stringify(source).replace(/\\r\\n/g,'')}
        document.head.appendChild(style);
    `
}
//处理依赖关系
script = script.replace(/require\(['"](.+?)['"]\)/g,function(){
    let name = path.join('./src',arguments[1]);
    console.log(name);
    let content = fs.readFileSync(name,'utf8');
    if(/\.css$/.test(name)){
        content = styleLoader(content);
    }
    modules.push({
        name,content
    })
    return `require("${name}")`;
})
let ejs = require('ejs');



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
});`
let result = ejs.render(template,{
    entry,script,modules
});
//result为替换后的结果
fs.writeFileSync(output,result);
console.log('render is ok');