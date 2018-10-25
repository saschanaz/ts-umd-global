const fs = require("fs");

/**
 * Rewrites .js, .js.map, .d.ts with UMD global support
 * @param {string} path Path without extension
 * @param {string} namespace Namespace to use
 */
function rewrite(path, namespace) {
    js(path, namespace);
    jsmap(path);
    dts(path, namespace);
}
rewrite.default = rewrite;
module.exports = rewrite;

/**
 * Rewrites .js with UMD global support
 * @param {string} path Path without extension
 * @param {string} namespace Namespace to use
 */
function js(path, namespace) {
    path = `${path}.js`;
    const js = fs.readFileSync(path, "utf-8");
    const injected = js
        .replace("function (factory)", "function (global, factory)")
        .replace("})(function (require, exports) {", `    else {
        global.${namespace} = global.${namespace} || {};
        var exports = global.${namespace};
        factory(global.require, exports);
    }
})(this, function (require, exports) {`);
    fs.writeFileSync(path, injected);
}

/**
 * Rewrites .js.map with UMD global support
 * @param {string} path Path without extension
 */
function jsmap(path) {
    path = `${path}.js.map`;
    const jsmap = fs.readFileSync(path, "utf-8");
    const marker = '"mappings":"';
    const index = jsmap.indexOf(marker) + marker.length;
    const injected = `${jsmap.slice(0, index)};;;;;${jsmap.slice(index)}`;
    fs.writeFileSync(path, injected);
}

/**
 * Rewrites .d.ts with UMD global support
 * @param {string} path Path without extension
 * @param {string} namespace Namespace to use
 */
function dts(path, namespace) {
    path = `${path}.d.ts`;
    const dts = fs.readFileSync(path, "utf-8");
    fs.writeFileSync(path, dts + `export as namespace ${namespace};\n`);
}
