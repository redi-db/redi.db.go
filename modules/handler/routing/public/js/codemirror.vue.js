! function (e) {
    "use strict";
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("../../addon/mode/overlay"), require("../xml/xml"), require("../javascript/javascript"), require("../coffeescript/coffeescript"), require("../css/css"), require("../sass/sass"), require("../stylus/stylus"), require("../pug/pug"), require("../handlebars/handlebars")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror", "../../addon/mode/overlay", "../xml/xml", "../javascript/javascript", "../coffeescript/coffeescript", "../css/css", "../sass/sass", "../stylus/stylus", "../pug/pug", "../handlebars/handlebars"], e) : e(CodeMirror)
}(function (t) {
    var s = {
        script: [
            ["lang", /coffee(script)?/, "coffeescript"],
            ["type", /^(?:text|application)\/(?:x-)?coffee(?:script)?$/, "coffeescript"],
            ["lang", /^babel$/, "javascript"],
            ["type", /^text\/babel$/, "javascript"],
            ["type", /^text\/ecmascript-\d+$/, "javascript"]
        ],
        style: [
            ["lang", /^stylus$/i, "stylus"],
            ["lang", /^sass$/i, "sass"],
            ["lang", /^less$/i, "text/x-less"],
            ["lang", /^scss$/i, "text/x-scss"],
            ["type", /^(text\/)?(x-)?styl(us)?$/i, "stylus"],
            ["type", /^text\/sass/i, "sass"],
            ["type", /^(text\/)?(x-)?scss$/i, "text/x-scss"],
            ["type", /^(text\/)?(x-)?less$/i, "text/x-less"]
        ],
        template: [
            ["lang", /^vue-template$/i, "vue"],
            ["lang", /^pug$/i, "pug"],
            ["lang", /^handlebars$/i, "handlebars"],
            ["type", /^(text\/)?(x-)?pug$/i, "pug"],
            ["type", /^text\/x-handlebars-template$/i, "handlebars"],
            [null, null, "vue-template"]
        ]
    };
    t.defineMode("vue-template", function (e, s) {
        return t.overlayMode(t.getMode(e, s.backdrop || "text/html"), {
            token: function (e) {
                if (e.match(/^\{\{.*?\}\}/)) return "meta mustache";
                for (; e.next() && !e.match("{{", !1););
                return null
            }
        })
    }), t.defineMode("vue", function (e) {
        return t.getMode(e, {
            name: "htmlmixed",
            tags: s
        })
    }, "htmlmixed", "xml", "javascript", "coffeescript", "css", "sass", "stylus", "pug", "handlebars"), t.defineMIME("script/x-vue", "vue"), t.defineMIME("text/x-vue", "vue")
});