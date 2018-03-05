 (function(modules) { 
    function require(moduleId) {

        var module = {
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, require);

        return module.exports;
    }
    return require("./src/index.js");
})
({
"./src/index.js": (function(module, exports, require) {

eval(`let a = require("src\a.js");
require("src\index.css");
console.log('welcome to index',a);`);

})
,
    "src\a.js": (function(module, exports,require) {
        eval(`module.exports = 'this is a.js';`);
    })
,
    "src\index.css": (function(module, exports,require) {
        eval(`
        let style = document.createElement('style');
        style.innerText = "body{    background-color:red;}"
        document.head.appendChild(style);
    `);
    })

});