(function(modules) { 
    function require(moduleId) {//moduleId代表的就是文件名

        var module = {
            exports: {}
        };

        modules[moduleId].call(module.exports, module, module.exports, require);
        return module.exports;
    }
    return require("./src/index.js");
})

({

"./src/index.js": (function(module, exports) {

 eval("console.log('indexxxxxxx)");

})

});