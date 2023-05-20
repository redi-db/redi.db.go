! function (t) {
    "object" == typeof exports && "object" == typeof module ? t(require("../../lib/codemirror"), require("../xml/xml"), require("../javascript/javascript"), require("../css/css")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror", "../xml/xml", "../javascript/javascript", "../css/css"], t) : t(CodeMirror)
}(function (m) {
    "use strict";
    var l = {
        script: [
            ["lang", /(javascript|babel)/i, "javascript"],
            ["type", /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i, "javascript"],
            ["type", /./, "text/plain"],
            [null, null, "javascript"]
        ],
        style: [
            ["lang", /^css$/i, "css"],
            ["type", /^(text\/)?(x-)?(stylesheet|css)$/i, "css"],
            ["type", /./, "text/plain"],
            [null, null, "css"]
        ]
    };
    var a = {};

    function d(t, e) {
        e = t.match(a[t = e] || (a[t] = new RegExp("\\s+" + t + "\\s*=\\s*('|\")?([^'\"]+)('|\")?\\s*")));
        return e ? /^\s*(.*?)\s*$/.exec(e[2])[1] : ""
    }

    function g(t, e) {
        return new RegExp((e ? "^" : "") + "</\\s*" + t + "\\s*>", "i")
    }

    function o(t, e) {
        for (var a in t)
            for (var n = e[a] || (e[a] = []), l = t[a], o = l.length - 1; 0 <= o; o--) n.unshift(l[o])
    }
    m.defineMode("htmlmixed", function (i, t) {
        var c = m.getMode(i, {
                name: "xml",
                htmlMode: !0,
                multilineTagIndentFactor: t.multilineTagIndentFactor,
                multilineTagIndentPastTag: t.multilineTagIndentPastTag,
                allowMissingTagName: t.allowMissingTagName
            }),
            s = {},
            e = t && t.tags,
            a = t && t.scriptTypes;
        if (o(l, s), e && o(e, s), a)
            for (var n = a.length - 1; 0 <= n; n--) s.script.unshift(["type", a[n].matches, a[n].mode]);

        function u(t, e) {
            var a, o, r, n = c.token(t, e.htmlState),
                l = /\btag\b/.test(n);
            return l && !/[<>\s\/]/.test(t.current()) && (a = e.htmlState.tagName && e.htmlState.tagName.toLowerCase()) && s.hasOwnProperty(a) ? e.inTag = a + " " : e.inTag && l && />$/.test(t.current()) ? (a = /^([\S]+) (.*)/.exec(e.inTag), e.inTag = null, l = ">" == t.current() && function (t, e) {
                for (var a = 0; a < t.length; a++) {
                    var n = t[a];
                    if (!n[0] || n[1].test(d(e, n[0]))) return n[2]
                }
            }(s[a[1]], a[2]), l = m.getMode(i, l), o = g(a[1], !0), r = g(a[1], !1), e.token = function (t, e) {
                return t.match(o, !1) ? (e.token = u, e.localState = e.localMode = null) : (a = t, n = r, t = e.localMode.token(t, e.localState), e = a.current(), -1 < (l = e.search(n)) ? a.backUp(e.length - l) : e.match(/<\/?$/) && (a.backUp(e.length), a.match(n, !1) || a.match(e)), t);
                var a, n, l
            }, e.localMode = l, e.localState = m.startState(l, c.indent(e.htmlState, "", ""))) : e.inTag && (e.inTag += t.current(), t.eol() && (e.inTag += " ")), n
        }
        return {
            startState: function () {
                return {
                    token: u,
                    inTag: null,
                    localMode: null,
                    localState: null,
                    htmlState: m.startState(c)
                }
            },
            copyState: function (t) {
                var e;
                return t.localState && (e = m.copyState(t.localMode, t.localState)), {
                    token: t.token,
                    inTag: t.inTag,
                    localMode: t.localMode,
                    localState: e,
                    htmlState: m.copyState(c, t.htmlState)
                }
            },
            token: function (t, e) {
                return e.token(t, e)
            },
            indent: function (t, e, a) {
                return !t.localMode || /^\s*<\//.test(e) ? c.indent(t.htmlState, e, a) : t.localMode.indent ? t.localMode.indent(t.localState, e, a) : m.Pass
            },
            innerMode: function (t) {
                return {
                    state: t.localState || t.htmlState,
                    mode: t.localMode || c
                }
            }
        }
    }, "xml", "javascript", "css"), m.defineMIME("text/html", "htmlmixed")
});