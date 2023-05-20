! function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.defineMode("yaml", function () {
        var n = new RegExp("\\b((" + ["true", "false", "on", "off", "yes", "no"].join(")|(") + "))$", "i");
        return {
            token: function (e, i) {
                var t = e.peek(),
                    r = i.escaped;
                if (i.escaped = !1, "#" == t && (0 == e.pos || /\s/.test(e.string.charAt(e.pos - 1)))) return e.skipToEnd(), "comment";
                if (e.match(/^('([^']|\\.)*'?|"([^"]|\\.)*"?)/)) return "string";
                if (i.literal && e.indentation() > i.keyCol) return e.skipToEnd(), "string";
                if (i.literal && (i.literal = !1), e.sol()) {
                    if (i.keyCol = 0, i.pair = !1, i.pairStart = !1, e.match("---")) return "def";
                    if (e.match("...")) return "def";
                    if (e.match(/\s*-\s+/)) return "meta"
                }
                if (e.match(/^(\{|\}|\[|\])/)) return "{" == t ? i.inlinePairs++ : "}" == t ? i.inlinePairs-- : "[" == t ? i.inlineList++ : i.inlineList--, "meta";
                if (0 < i.inlineList && !r && "," == t) return e.next(), "meta";
                if (0 < i.inlinePairs && !r && "," == t) return i.keyCol = 0, i.pair = !1, i.pairStart = !1, e.next(), "meta";
                if (i.pairStart) {
                    if (e.match(/^\s*(\||\>)\s*/)) return i.literal = !0, "meta";
                    if (e.match(/^\s*(\&|\*)[a-z0-9\._-]+\b/i)) return "variable-2";
                    if (0 == i.inlinePairs && e.match(/^\s*-?[0-9\.\,]+\s?$/)) return "number";
                    if (0 < i.inlinePairs && e.match(/^\s*-?[0-9\.\,]+\s?(?=(,|}))/)) return "number";
                    if (e.match(n)) return "keyword"
                }
                return !i.pair && e.match(/^\s*(?:[,\[\]{}&*!|>'"%@`][^\s'":]|[^,\[\]{}#&*!|>'"%@`])[^#]*?(?=\s*:($|\s))/) ? (i.pair = !0, i.keyCol = e.indentation(), "atom") : i.pair && e.match(/^:\s*/) ? (i.pairStart = !0, "meta") : (i.pairStart = !1, i.escaped = "\\" == t, e.next(), null)
            },
            startState: function () {
                return {
                    pair: !1,
                    pairStart: !1,
                    keyCol: 0,
                    inlinePairs: 0,
                    inlineList: 0,
                    literal: !1,
                    escaped: !1
                }
            },
            lineComment: "#",
            fold: "indent"
        }
    }), e.defineMIME("text/x-yaml", "yaml"), e.defineMIME("text/yaml", "yaml")
});