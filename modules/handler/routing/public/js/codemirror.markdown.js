! function (t) {
    "object" == typeof exports && "object" == typeof module ? t(require("../../lib/codemirror"), require("../xml/xml"), require("../meta")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror", "../xml/xml", "../meta"], t) : t(CodeMirror)
}(function (w) {
    "use strict";
    w.defineMode("markdown", function (m, d) {
        var g = w.getMode(m, "text/html"),
            u = "null" == g.name;
        void 0 === d.highlightFormatting && (d.highlightFormatting = !1), void 0 === d.maxBlockquoteDepth && (d.maxBlockquoteDepth = 0), void 0 === d.taskLists && (d.taskLists = !1), void 0 === d.strikethrough && (d.strikethrough = !1), void 0 === d.emoji && (d.emoji = !1), void 0 === d.fencedCodeBlockHighlighting && (d.fencedCodeBlockHighlighting = !0), void 0 === d.fencedCodeBlockDefaultMode && (d.fencedCodeBlockDefaultMode = "text/plain"), void 0 === d.xml && (d.xml = !0), void 0 === d.tokenTypeOverrides && (d.tokenTypeOverrides = {});
        var t, c = {
            header: "header",
            code: "comment",
            quote: "quote",
            list1: "variable-2",
            list2: "variable-3",
            list3: "keyword",
            hr: "hr",
            image: "image",
            imageAltText: "image-alt-text",
            imageMarker: "image-marker",
            formatting: "formatting",
            linkInline: "link",
            linkEmail: "link",
            linkText: "link",
            linkHref: "string",
            em: "em",
            strong: "strong",
            strikethrough: "strikethrough",
            emoji: "builtin"
        };
        for (t in c) c.hasOwnProperty(t) && d.tokenTypeOverrides[t] && (c[t] = d.tokenTypeOverrides[t]);
        var f = /^([*\-_])(?:\s*\1){2,}\s*$/,
            k = /^(?:[*\-+]|^[0-9]+([.)]))\s+/,
            F = /^\[(x| )\](?=\s)/i,
            D = d.allowAtxHeaderWithoutSpace ? /^(#+)/ : /^(#+)(?: |$)/,
            p = /^ {0,3}(?:\={1,}|-{2,})\s*$/,
            i = /^[^#!\[\]*_\\<>` "'(~:]+/,
            E = /^(~~~+|```+)[ \t]*([\w\/+#-]*)[^\n`]*$/,
            x = /^\s*\[[^\]]+?\]:.*$/,
            A = /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/;

        function C(t, e, i) {
            return (e.f = e.inline = i)(t, e)
        }

        function S(t, e, i) {
            return (e.f = e.block = i)(t, e)
        }

        function n(t) {
            var e;
            return t.linkTitle = !1, t.linkHref = !1, t.linkText = !1, t.em = !1, t.strong = !1, t.strikethrough = !1, t.quote = 0, t.indentedCode = !1, t.f == v && (u ? u : "xml" == (e = w.innerMode(g, t.htmlState)).mode.name && null === e.state.tagStart && !e.state.context && e.state.tokenize.isInText) && (t.f = T, t.block = a, t.htmlState = null), t.trailingSpace = 0, t.trailingSpaceNewLine = !1, t.prevLine = t.thisLine, t.thisLine = {
                stream: null
            }, null
        }

        function a(t, e) {
            var i = t.column() === e.indentation,
                n = !(n = e.prevLine.stream) || !/\S/.test(n.string),
                u = e.indentedCode,
                a = e.prevLine.hr,
                r = !1 !== e.list,
                o = (e.listStack[e.listStack.length - 1] || 0) + 3,
                l = (e.indentedCode = !1, e.indentation);
            if (null === e.indentationDiff && (e.indentationDiff = e.indentation, r)) {
                for (e.list = null; l < e.listStack[e.listStack.length - 1];) e.listStack.pop(), e.listStack.length ? e.indentation = e.listStack[e.listStack.length - 1] : e.list = !1;
                !1 !== e.list && (e.indentationDiff = l - e.listStack[e.listStack.length - 1])
            }
            var h, s = !(n || a || e.prevLine.header || r && u || e.prevLine.fencedCodeEnd),
                a = (!1 === e.list || a || n) && e.indentation <= o && t.match(f),
                g = null;
            return 4 <= e.indentationDiff && (u || e.prevLine.fencedCodeEnd || e.prevLine.header || n) ? (t.skipToEnd(), e.indentedCode = !0, c.code) : t.eatSpace() ? null : i && e.indentation <= o && (g = t.match(D)) && g[1].length <= 6 ? (e.quote = 0, e.header = g[1].length, e.thisLine.header = !0, d.highlightFormatting && (e.formatting = "header"), e.f = e.inline, L(e)) : e.indentation <= o && t.eat(">") ? (e.quote = i ? 1 : e.quote + 1, d.highlightFormatting && (e.formatting = "quote"), t.eatSpace(), L(e)) : !a && !e.setext && i && e.indentation <= o && (g = t.match(k)) ? (u = g[1] ? "ol" : "ul", e.indentation = l + t.current().length, e.list = !0, e.quote = 0, e.listStack.push(e.indentation), e.em = !1, e.strong = !1, e.code = !1, e.strikethrough = !1, d.taskLists && t.match(F, !1) && (e.taskList = !0), e.f = e.inline, d.highlightFormatting && (e.formatting = ["list", "list-" + u]), L(e)) : i && e.indentation <= o && (g = t.match(E, !0)) ? (e.quote = 0, e.fencedEndRE = new RegExp(g[1] + "+ *$"), e.localMode = d.fencedCodeBlockHighlighting && (n = g[2] || d.fencedCodeBlockDefaultMode, w.findModeByName && (h = w.findModeByName(n)) && (n = h.mime || h.mimes[0]), "null" == (h = w.getMode(m, n)).name ? null : h), e.localMode && (e.localState = w.startState(e.localMode)), e.f = e.block = B, d.highlightFormatting && (e.formatting = "code-block"), e.code = -1, L(e)) : e.setext || !(s && r || e.quote || !1 !== e.list || e.code || a || x.test(t.string)) && (g = t.lookAhead(1)) && (g = g.match(p)) ? (e.setext ? (e.header = e.setext, e.setext = 0, t.skipToEnd(), d.highlightFormatting && (e.formatting = "header")) : (e.header = "=" == g[0].charAt(0) ? 1 : 2, e.setext = e.header), e.thisLine.header = !0, e.f = e.inline, L(e)) : a ? (t.skipToEnd(), e.hr = !0, e.thisLine.hr = !0, c.hr) : "[" === t.peek() ? C(t, e, b) : C(t, e, e.inline)
        }

        function v(t, e) {
            var i, n = g.token(t, e.htmlState);
            return u || ("xml" == (i = w.innerMode(g, e.htmlState)).mode.name && null === i.state.tagStart && !i.state.context && i.state.tokenize.isInText || e.md_inside && -1 < t.current().indexOf(">")) && (e.f = T, e.block = a, e.htmlState = null), n
        }

        function B(t, e) {
            var i, n = e.listStack[e.listStack.length - 1] || 0,
                u = e.indentation < n;
            return e.fencedEndRE && e.indentation <= n + 3 && (u || t.match(e.fencedEndRE)) ? (d.highlightFormatting && (e.formatting = "code-block"), u || (i = L(e)), e.localMode = e.localState = null, e.block = a, e.f = T, e.fencedEndRE = null, e.code = 0, e.thisLine.fencedCodeEnd = !0, u ? S(t, e, e.block) : i) : e.localMode ? e.localMode.token(t, e.localState) : (t.skipToEnd(), c.code)
        }

        function L(t) {
            var e, i = [];
            if (t.formatting) {
                i.push(c.formatting), "string" == typeof t.formatting && (t.formatting = [t.formatting]);
                for (var n = 0; n < t.formatting.length; n++) i.push(c.formatting + "-" + t.formatting[n]), "header" === t.formatting[n] && i.push(c.formatting + "-" + t.formatting[n] + "-" + t.header), "quote" === t.formatting[n] && (!d.maxBlockquoteDepth || d.maxBlockquoteDepth >= t.quote ? i.push(c.formatting + "-" + t.formatting[n] + "-" + t.quote) : i.push("error"))
            }
            return t.taskOpen ? i.push("meta") : t.taskClosed ? i.push("property") : (t.linkHref ? i.push(c.linkHref, "url") : (t.strong && i.push(c.strong), t.em && i.push(c.em), t.strikethrough && i.push(c.strikethrough), t.emoji && i.push(c.emoji), t.linkText && i.push(c.linkText), t.code && i.push(c.code), t.image && i.push(c.image), t.imageAltText && i.push(c.imageAltText, "link"), t.imageMarker && i.push(c.imageMarker)), t.header && i.push(c.header, c.header + "-" + t.header), t.quote && (i.push(c.quote), !d.maxBlockquoteDepth || d.maxBlockquoteDepth >= t.quote ? i.push(c.quote + "-" + t.quote) : i.push(c.quote + "-" + d.maxBlockquoteDepth)), !1 !== t.list && ((e = (t.listStack.length - 1) % 3) ? 1 == e ? i.push(c.list2) : i.push(c.list3) : i.push(c.list1)), t.trailingSpaceNewLine ? i.push("trailing-space-new-line") : t.trailingSpace && i.push("trailing-space-" + (t.trailingSpace % 2 ? "a" : "b"))), i.length ? i.join(" ") : null
        }

        function e(t, e) {
            if (t.match(i, !0)) return L(e)
        }

        function T(t, e) {
            var i = e.text(t, e);
            if (void 0 !== i) return i;
            if (e.list) return e.list = null, L(e);
            if (e.taskList) return " " === t.match(F, !0)[1] ? e.taskOpen = !0 : e.taskClosed = !0, d.highlightFormatting && (e.formatting = "task"), e.taskList = !1, L(e);
            if (e.taskOpen = !1, e.taskClosed = !1, e.header && t.match(/^#+$/, !0)) return d.highlightFormatting && (e.formatting = "header"), L(e);
            var n = t.next();
            if (e.linkTitle) {
                e.linkTitle = !1;
                var i = ((i = "(" === n ? ")" : n) + "").replace(/([.?*+^\[\]\\(){}|-])/g, "\\$1");
                if (t.match(new RegExp("^\\s*(?:[^" + i + "\\\\]+|\\\\\\\\|\\\\.)" + i), !0)) return c.linkHref
            }
            if ("`" === n) return i = e.formatting, d.highlightFormatting && (e.formatting = "code"), t.eatWhile("`"), o = t.current().length, 0 != e.code || e.quote && 1 != o ? o == e.code ? (r = L(e), e.code = 0, r) : (e.formatting = i, L(e)) : (e.code = o, L(e));
            if (e.code) return L(e);
            if ("\\" === n && (t.next(), d.highlightFormatting)) return a = L(e), i = c.formatting + "-escape", a ? a + " " + i : i;
            if ("!" === n && t.match(/\[[^\]]*\] ?(?:\(|\[)/, !1)) return e.imageMarker = !0, e.image = !0, d.highlightFormatting && (e.formatting = "image"), L(e);
            if ("[" === n && e.imageMarker && t.match(/[^\]]*\](\(.*?\)| ?\[.*?\])/, !1)) return e.imageMarker = !1, e.imageAltText = !0, d.highlightFormatting && (e.formatting = "image"), L(e);
            if ("]" === n && e.imageAltText) return d.highlightFormatting && (e.formatting = "image"), a = L(e), e.imageAltText = !1, e.image = !1, e.inline = e.f = q, a;
            if ("[" === n && !e.image) return e.linkText && t.match(/^.*?\]/) || (e.linkText = !0, d.highlightFormatting && (e.formatting = "link")), L(e);
            if ("]" === n && e.linkText) return d.highlightFormatting && (e.formatting = "link"), a = L(e), e.linkText = !1, e.inline = e.f = t.match(/\(.*?\)| ?\[.*?\]/, !1) ? q : T, a;
            if ("<" === n && t.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/, !1)) return e.f = e.inline = M, d.highlightFormatting && (e.formatting = "link"), (a = L(e)) ? a += " " : a = "", a + c.linkInline;
            if ("<" === n && t.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/, !1)) return e.f = e.inline = M, d.highlightFormatting && (e.formatting = "link"), (a = L(e)) ? a += " " : a = "", a + c.linkEmail;
            if (d.xml && "<" === n && t.match(/^(!--|\?|!\[CDATA\[|[a-z][a-z0-9-]*(?:\s+[a-z_:.\-]+(?:\s*=\s*[^>]+)?)*\s*(?:>|$))/i, !1)) return -1 != (o = t.string.indexOf(">", t.pos)) && (i = t.string.substring(t.start, o), /markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(i) && (e.md_inside = !0)), t.backUp(1), e.htmlState = w.startState(g), S(t, e, v);
            if (d.xml && "<" === n && t.match(/^\/\w*?>/)) return e.md_inside = !1, "tag";
            if ("*" === n || "_" === n) {
                for (var u = 1, a = 1 == t.pos ? " " : t.string.charAt(t.pos - 2); u < 3 && t.eat(n);) u++;
                var r, o = t.peek() || " ",
                    i = !/\s/.test(o) && (!A.test(o) || /\s/.test(a) || A.test(a)),
                    l = !/\s/.test(a) && (!A.test(a) || /\s/.test(o) || A.test(o)),
                    h = null,
                    s = null;
                if (u % 2 && (e.em || !i || "*" !== n && l && !A.test(a) ? e.em != n || !l || "*" !== n && i && !A.test(o) || (h = !1) : h = !0), 1 < u && (e.strong || !i || "*" !== n && l && !A.test(a) ? e.strong != n || !l || "*" !== n && i && !A.test(o) || (s = !1) : s = !0), null != s || null != h) return d.highlightFormatting && (e.formatting = null == h ? "strong" : null == s ? "em" : "strong em"), !0 === h && (e.em = n), !0 === s && (e.strong = n), r = L(e), !1 === h && (e.em = !1), !1 === s && (e.strong = !1), r
            } else if (" " === n && (t.eat("*") || t.eat("_"))) {
                if (" " === t.peek()) return L(e);
                t.backUp(1)
            }
            if (d.strikethrough)
                if ("~" === n && t.eatWhile(n)) {
                    if (e.strikethrough) return d.highlightFormatting && (e.formatting = "strikethrough"), r = L(e), e.strikethrough = !1, r;
                    if (t.match(/^[^\s]/, !1)) return e.strikethrough = !0, d.highlightFormatting && (e.formatting = "strikethrough"), L(e)
                } else if (" " === n && t.match("~~", !0)) {
                if (" " === t.peek()) return L(e);
                t.backUp(2)
            }
            return d.emoji && ":" === n && t.match(/^(?:[a-z_\d+][a-z_\d+-]*|\-[a-z_\d+][a-z_\d+-]*):/) ? (e.emoji = !0, d.highlightFormatting && (e.formatting = "emoji"), a = L(e), e.emoji = !1, a) : (" " === n && (t.match(/^ +$/, !1) ? e.trailingSpace++ : e.trailingSpace && (e.trailingSpaceNewLine = !0)), L(e))
        }

        function M(t, e) {
            return ">" === t.next() ? (e.f = e.inline = T, d.highlightFormatting && (e.formatting = "link"), (e = L(e)) ? e += " " : e = "", e + c.linkInline) : (t.match(/^[^>]+/, !0), c.linkInline)
        }

        function q(t, e) {
            if (t.eatSpace()) return null;
            var n, t = t.next();
            return "(" === t || "[" === t ? (e.f = e.inline = (n = "(" === t ? ")" : "]", function (t, e) {
                var i;
                return t.next() === n ? (e.f = e.inline = T, d.highlightFormatting && (e.formatting = "link-string"), i = L(e), e.linkHref = !1, i) : (t.match(r[n]), e.linkHref = !0, L(e))
            }), d.highlightFormatting && (e.formatting = "link-string"), e.linkHref = !0, L(e)) : "error"
        }
        var r = {
            ")": /^(?:[^\\\(\)]|\\.|\((?:[^\\\(\)]|\\.)*\))*?(?=\))/,
            "]": /^(?:[^\\\[\]]|\\.|\[(?:[^\\\[\]]|\\.)*\])*?(?=\])/
        };

        function b(t, e) {
            return t.match(/^([^\]\\]|\\.)*\]:/, !1) ? (e.f = o, t.next(), d.highlightFormatting && (e.formatting = "link"), e.linkText = !0, L(e)) : C(t, e, T)
        }

        function o(t, e) {
            var i;
            return t.match("]:", !0) ? (e.f = e.inline = l, d.highlightFormatting && (e.formatting = "link"), i = L(e), e.linkText = !1, i) : (t.match(/^([^\]\\]|\\.)+/, !0), c.linkText)
        }

        function l(t, e) {
            return t.eatSpace() ? null : (t.match(/^[^\s]+/, !0), void 0 === t.peek() ? e.linkTitle = !0 : t.match(/^(?:\s+(?:"(?:[^"\\]|\\.)+"|'(?:[^'\\]|\\.)+'|\((?:[^)\\]|\\.)+\)))?/, !0), e.f = e.inline = T, c.linkHref + " url")
        }
        var h = {
            startState: function () {
                return {
                    f: a,
                    prevLine: {
                        stream: null
                    },
                    thisLine: {
                        stream: null
                    },
                    block: a,
                    htmlState: null,
                    indentation: 0,
                    inline: T,
                    text: e,
                    formatting: !1,
                    linkText: !1,
                    linkHref: !1,
                    linkTitle: !1,
                    code: 0,
                    em: !1,
                    strong: !1,
                    header: 0,
                    setext: 0,
                    hr: !1,
                    taskList: !1,
                    list: !1,
                    listStack: [],
                    quote: 0,
                    trailingSpace: 0,
                    trailingSpaceNewLine: !1,
                    strikethrough: !1,
                    emoji: !1,
                    fencedEndRE: null
                }
            },
            copyState: function (t) {
                return {
                    f: t.f,
                    prevLine: t.prevLine,
                    thisLine: t.thisLine,
                    block: t.block,
                    htmlState: t.htmlState && w.copyState(g, t.htmlState),
                    indentation: t.indentation,
                    localMode: t.localMode,
                    localState: t.localMode ? w.copyState(t.localMode, t.localState) : null,
                    inline: t.inline,
                    text: t.text,
                    formatting: !1,
                    linkText: t.linkText,
                    linkTitle: t.linkTitle,
                    linkHref: t.linkHref,
                    code: t.code,
                    em: t.em,
                    strong: t.strong,
                    strikethrough: t.strikethrough,
                    emoji: t.emoji,
                    header: t.header,
                    setext: t.setext,
                    hr: t.hr,
                    taskList: t.taskList,
                    list: t.list,
                    listStack: t.listStack.slice(0),
                    quote: t.quote,
                    indentedCode: t.indentedCode,
                    trailingSpace: t.trailingSpace,
                    trailingSpaceNewLine: t.trailingSpaceNewLine,
                    md_inside: t.md_inside,
                    fencedEndRE: t.fencedEndRE
                }
            },
            token: function (t, e) {
                if (e.formatting = !1, t != e.thisLine.stream) {
                    if (e.header = 0, e.hr = !1, t.match(/^\s*$/, !0)) return n(e), null;
                    if (e.prevLine = e.thisLine, e.thisLine = {
                            stream: t
                        }, e.taskList = !1, e.trailingSpace = 0, e.trailingSpaceNewLine = !1, !e.localState && (e.f = e.block, e.f != v)) {
                        var i = t.match(/^\s*/, !0)[0].replace(/\t/g, "    ").length;
                        if (e.indentation = i, e.indentationDiff = null, 0 < i) return null
                    }
                }
                return e.f(t, e)
            },
            innerMode: function (t) {
                return t.block == v ? {
                    state: t.htmlState,
                    mode: g
                } : t.localState ? {
                    state: t.localState,
                    mode: t.localMode
                } : {
                    state: t,
                    mode: h
                }
            },
            indent: function (t, e, i) {
                return t.block == v && g.indent ? g.indent(t.htmlState, e, i) : t.localState && t.localMode.indent ? t.localMode.indent(t.localState, e, i) : w.Pass
            },
            blankLine: n,
            getType: L,
            blockCommentStart: "\x3c!--",
            blockCommentEnd: "--\x3e",
            closeBrackets: "()[]{}''\"\"``",
            fold: "markdown"
        };
        return h
    }, "xml"), w.defineMIME("text/markdown", "markdown"), w.defineMIME("text/x-markdown", "markdown")
});