(function(modules) { 
    function require(moduleId) {

        var module = installedModules[moduleId] = {
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, require);

        return module.exports;
    }
    return require(require.s = "./src/index.js");
})
({

"./src/a.js": (function(module, exports) {

eval("module.exports = 'this is a.js';\n\n//# sourceURL=webpack:///./src/a.js?");

}),

"./src/index.js": (function(module, exports, require) {

eval("let a = require(/*! ./a.js */ \"./src/a.js\");\r\nconsole.log('welcome to index',a);\n\n//# sourceURL=webpack:///./src/index.js?");

})

});