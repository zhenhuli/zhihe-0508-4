(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const p of document.querySelectorAll('link[rel="modulepreload"]'))s(p);new MutationObserver(p=>{for(const u of p)if(u.type==="childList")for(const o of u.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function i(p){const u={};return p.integrity&&(u.integrity=p.integrity),p.referrerPolicy&&(u.referrerPolicy=p.referrerPolicy),p.crossOrigin==="use-credentials"?u.credentials="include":p.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function s(p){if(p.ep)return;p.ep=!0;const u=i(p);fetch(p.href,u)}})();function ct(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function Me(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(t=>{const i=e[t],s=typeof i;(s==="object"||s==="function")&&!Object.isFrozen(i)&&Me(i)}),e}class ve{constructor(t){t.data===void 0&&(t.data={}),this.data=t.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function Oe(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function C(e,...t){const i=Object.create(null);for(const s in e)i[s]=e[s];return t.forEach(function(s){for(const p in s)i[p]=s[p]}),i}const dt="</span>",ye=e=>!!e.scope,pt=(e,{prefix:t})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){const i=e.split(".");return[`${t}${i.shift()}`,...i.map((s,p)=>`${s}${"_".repeat(p+1)}`)].join(" ")}return`${t}${e}`};class ut{constructor(t,i){this.buffer="",this.classPrefix=i.classPrefix,t.walk(this)}addText(t){this.buffer+=Oe(t)}openNode(t){if(!ye(t))return;const i=pt(t.scope,{prefix:this.classPrefix});this.span(i)}closeNode(t){ye(t)&&(this.buffer+=dt)}value(){return this.buffer}span(t){this.buffer+=`<span class="${t}">`}}const we=(e={})=>{const t={children:[]};return Object.assign(t,e),t};class re{constructor(){this.rootNode=we(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(t){this.top.children.push(t)}openNode(t){const i=we({scope:t});this.add(i),this.stack.push(i)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(t){return this.constructor._walk(t,this.rootNode)}static _walk(t,i){return typeof i=="string"?t.addText(i):i.children&&(t.openNode(i),i.children.forEach(s=>this._walk(t,s)),t.closeNode(i)),t}static _collapse(t){typeof t!="string"&&t.children&&(t.children.every(i=>typeof i=="string")?t.children=[t.children.join("")]:t.children.forEach(i=>{re._collapse(i)}))}}class ft extends re{constructor(t){super(),this.options=t}addText(t){t!==""&&this.add(t)}startScope(t){this.openNode(t)}endScope(){this.closeNode()}__addSublanguage(t,i){const s=t.root;i&&(s.scope=`language:${i}`),this.add(s)}toHTML(){return new ut(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function j(e){return e?typeof e=="string"?e:e.source:null}function Te(e){return D("(?=",e,")")}function ht(e){return D("(?:",e,")*")}function gt(e){return D("(?:",e,")?")}function D(...e){return e.map(i=>j(i)).join("")}function bt(e){const t=e[e.length-1];return typeof t=="object"&&t.constructor===Object?(e.splice(e.length-1,1),t):{}}function ae(...e){return"("+(bt(e).capture?"":"?:")+e.map(s=>j(s)).join("|")+")"}function Ne(e){return new RegExp(e.toString()+"|").exec("").length-1}function mt(e,t){const i=e&&e.exec(t);return i&&i.index===0}const xt=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function se(e,{joinWith:t}){let i=0;return e.map(s=>{i+=1;const p=i;let u=j(s),o="";for(;u.length>0;){const a=xt.exec(u);if(!a){o+=u;break}o+=u.substring(0,a.index),u=u.substring(a.index+a[0].length),a[0][0]==="\\"&&a[1]?o+="\\"+String(Number(a[1])+p):(o+=a[0],a[0]==="("&&i++)}return o}).map(s=>`(${s})`).join(t)}const vt=/\b\B/,Re="[a-zA-Z]\\w*",le="[a-zA-Z_]\\w*",Ce="\\b\\d+(\\.\\d+)?",Ae="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",Le="\\b(0b[01]+)",yt="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",wt=(e={})=>{const t=/^#![ ]*\//;return e.binary&&(e.begin=D(t,/.*\b/,e.binary,/\b.*/)),C({scope:"meta",begin:t,end:/$/,relevance:0,"on:begin":(i,s)=>{i.index!==0&&s.ignoreMatch()}},e)},F={begin:"\\\\[\\s\\S]",relevance:0},kt={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[F]},Et={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[F]},_t={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},Z=function(e,t,i={}){const s=C({scope:"comment",begin:e,end:t,contains:[]},i);s.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const p=ae("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return s.contains.push({begin:D(/[ ]+/,"(",p,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),s},St=Z("//","$"),Mt=Z("/\\*","\\*/"),Ot=Z("#","$"),Tt={scope:"number",begin:Ce,relevance:0},Nt={scope:"number",begin:Ae,relevance:0},Rt={scope:"number",begin:Le,relevance:0},Ct={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[F,{begin:/\[/,end:/\]/,relevance:0,contains:[F]}]},At={scope:"title",begin:Re,relevance:0},Lt={scope:"title",begin:le,relevance:0},It={begin:"\\.\\s*"+le,relevance:0},Dt=function(e){return Object.assign(e,{"on:begin":(t,i)=>{i.data._beginMatch=t[1]},"on:end":(t,i)=>{i.data._beginMatch!==t[1]&&i.ignoreMatch()}})};var q=Object.freeze({__proto__:null,APOS_STRING_MODE:kt,BACKSLASH_ESCAPE:F,BINARY_NUMBER_MODE:Rt,BINARY_NUMBER_RE:Le,COMMENT:Z,C_BLOCK_COMMENT_MODE:Mt,C_LINE_COMMENT_MODE:St,C_NUMBER_MODE:Nt,C_NUMBER_RE:Ae,END_SAME_AS_BEGIN:Dt,HASH_COMMENT_MODE:Ot,IDENT_RE:Re,MATCH_NOTHING_RE:vt,METHOD_GUARD:It,NUMBER_MODE:Tt,NUMBER_RE:Ce,PHRASAL_WORDS_MODE:_t,QUOTE_STRING_MODE:Et,REGEXP_MODE:Ct,RE_STARTERS_RE:yt,SHEBANG:wt,TITLE_MODE:At,UNDERSCORE_IDENT_RE:le,UNDERSCORE_TITLE_MODE:Lt});function Bt(e,t){e.input[e.index-1]==="."&&t.ignoreMatch()}function Pt(e,t){e.className!==void 0&&(e.scope=e.className,delete e.className)}function zt(e,t){t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=Bt,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function Ht(e,t){Array.isArray(e.illegal)&&(e.illegal=ae(...e.illegal))}function jt(e,t){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function Ft(e,t){e.relevance===void 0&&(e.relevance=1)}const Ut=(e,t)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");const i=Object.assign({},e);Object.keys(e).forEach(s=>{delete e[s]}),e.keywords=i.keywords,e.begin=D(i.beforeMatch,Te(i.begin)),e.starts={relevance:0,contains:[Object.assign(i,{endsParent:!0})]},e.relevance=0,delete i.beforeMatch},Xt=["of","and","for","in","not","or","if","then","parent","list","value"],Gt="keyword";function Ie(e,t,i=Gt){const s=Object.create(null);return typeof e=="string"?p(i,e.split(" ")):Array.isArray(e)?p(i,e):Object.keys(e).forEach(function(u){Object.assign(s,Ie(e[u],t,u))}),s;function p(u,o){t&&(o=o.map(a=>a.toLowerCase())),o.forEach(function(a){const d=a.split("|");s[d[0]]=[u,$t(d[0],d[1])]})}}function $t(e,t){return t?Number(t):Wt(e)?0:1}function Wt(e){return Xt.includes(e.toLowerCase())}const ke={},L=e=>{console.error(e)},Ee=(e,...t)=>{console.log(`WARN: ${e}`,...t)},B=(e,t)=>{ke[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),ke[`${e}/${t}`]=!0)},Y=new Error;function De(e,t,{key:i}){let s=0;const p=e[i],u={},o={};for(let a=1;a<=t.length;a++)o[a+s]=p[a],u[a+s]=!0,s+=Ne(t[a-1]);e[i]=o,e[i]._emit=u,e[i]._multi=!0}function qt(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw L("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Y;if(typeof e.beginScope!="object"||e.beginScope===null)throw L("beginScope must be object"),Y;De(e,e.begin,{key:"beginScope"}),e.begin=se(e.begin,{joinWith:""})}}function Kt(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw L("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Y;if(typeof e.endScope!="object"||e.endScope===null)throw L("endScope must be object"),Y;De(e,e.end,{key:"endScope"}),e.end=se(e.end,{joinWith:""})}}function Yt(e){e.scope&&typeof e.scope=="object"&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function Zt(e){Yt(e),typeof e.beginScope=="string"&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope=="string"&&(e.endScope={_wrap:e.endScope}),qt(e),Kt(e)}function Vt(e){function t(o,a){return new RegExp(j(o),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(a?"g":""))}class i{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(a,d){d.position=this.position++,this.matchIndexes[this.matchAt]=d,this.regexes.push([d,a]),this.matchAt+=Ne(a)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const a=this.regexes.map(d=>d[1]);this.matcherRe=t(se(a,{joinWith:"|"}),!0),this.lastIndex=0}exec(a){this.matcherRe.lastIndex=this.lastIndex;const d=this.matcherRe.exec(a);if(!d)return null;const v=d.findIndex((z,V)=>V>0&&z!==void 0),y=this.matchIndexes[v];return d.splice(0,v),Object.assign(d,y)}}class s{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(a){if(this.multiRegexes[a])return this.multiRegexes[a];const d=new i;return this.rules.slice(a).forEach(([v,y])=>d.addRule(v,y)),d.compile(),this.multiRegexes[a]=d,d}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(a,d){this.rules.push([a,d]),d.type==="begin"&&this.count++}exec(a){const d=this.getMatcher(this.regexIndex);d.lastIndex=this.lastIndex;let v=d.exec(a);if(this.resumingScanAtSamePosition()&&!(v&&v.index===this.lastIndex)){const y=this.getMatcher(0);y.lastIndex=this.lastIndex+1,v=y.exec(a)}return v&&(this.regexIndex+=v.position+1,this.regexIndex===this.count&&this.considerAll()),v}}function p(o){const a=new s;return o.contains.forEach(d=>a.addRule(d.begin,{rule:d,type:"begin"})),o.terminatorEnd&&a.addRule(o.terminatorEnd,{type:"end"}),o.illegal&&a.addRule(o.illegal,{type:"illegal"}),a}function u(o,a){const d=o;if(o.isCompiled)return d;[Pt,jt,Zt,Ut].forEach(y=>y(o,a)),e.compilerExtensions.forEach(y=>y(o,a)),o.__beforeBegin=null,[zt,Ht,Ft].forEach(y=>y(o,a)),o.isCompiled=!0;let v=null;return typeof o.keywords=="object"&&o.keywords.$pattern&&(o.keywords=Object.assign({},o.keywords),v=o.keywords.$pattern,delete o.keywords.$pattern),v=v||/\w+/,o.keywords&&(o.keywords=Ie(o.keywords,e.case_insensitive)),d.keywordPatternRe=t(v,!0),a&&(o.begin||(o.begin=/\B|\b/),d.beginRe=t(d.begin),!o.end&&!o.endsWithParent&&(o.end=/\B|\b/),o.end&&(d.endRe=t(d.end)),d.terminatorEnd=j(d.end)||"",o.endsWithParent&&a.terminatorEnd&&(d.terminatorEnd+=(o.end?"|":"")+a.terminatorEnd)),o.illegal&&(d.illegalRe=t(o.illegal)),o.contains||(o.contains=[]),o.contains=[].concat(...o.contains.map(function(y){return Qt(y==="self"?o:y)})),o.contains.forEach(function(y){u(y,d)}),o.starts&&u(o.starts,a),d.matcher=p(d),d}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=C(e.classNameAliases||{}),u(e)}function Be(e){return e?e.endsWithParent||Be(e.starts):!1}function Qt(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(t){return C(e,{variants:null},t)})),e.cachedVariants?e.cachedVariants:Be(e)?C(e,{starts:e.starts?C(e.starts):null}):Object.isFrozen(e)?C(e):e}var Jt="11.11.1";class ei extends Error{constructor(t,i){super(t),this.name="HTMLInjectionError",this.html=i}}const ne=Oe,_e=C,Se=Symbol("nomatch"),ti=7,Pe=function(e){const t=Object.create(null),i=Object.create(null),s=[];let p=!0;const u="Could not find the language '{}', did you forget to load/include a language module?",o={disableAutodetect:!0,name:"Plain text",contains:[]};let a={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:ft};function d(n){return a.noHighlightRe.test(n)}function v(n){let c=n.className+" ";c+=n.parentNode?n.parentNode.className:"";const g=a.languageDetectRe.exec(c);if(g){const m=N(g[1]);return m||(Ee(u.replace("{}",g[1])),Ee("Falling back to no-highlight mode for this block.",n)),m?g[1]:"no-highlight"}return c.split(/\s+/).find(m=>d(m)||N(m))}function y(n,c,g){let m="",w="";typeof c=="object"?(m=n,g=c.ignoreIllegals,w=c.language):(B("10.7.0","highlight(lang, code, ...args) has been deprecated."),B("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),w=n,m=c),g===void 0&&(g=!0);const S={code:m,language:w};X("before:highlight",S);const R=S.result?S.result:z(S.language,S.code,g);return R.code=S.code,X("after:highlight",R),R}function z(n,c,g,m){const w=Object.create(null);function S(r,l){return r.keywords[l]}function R(){if(!f.keywords){k.addText(x);return}let r=0;f.keywordPatternRe.lastIndex=0;let l=f.keywordPatternRe.exec(x),h="";for(;l;){h+=x.substring(r,l.index);const b=O.case_insensitive?l[0].toLowerCase():l[0],E=S(f,b);if(E){const[T,st]=E;if(k.addText(h),h="",w[b]=(w[b]||0)+1,w[b]<=ti&&(W+=st),T.startsWith("_"))h+=l[0];else{const lt=O.classNameAliases[T]||T;M(l[0],lt)}}else h+=l[0];r=f.keywordPatternRe.lastIndex,l=f.keywordPatternRe.exec(x)}h+=x.substring(r),k.addText(h)}function G(){if(x==="")return;let r=null;if(typeof f.subLanguage=="string"){if(!t[f.subLanguage]){k.addText(x);return}r=z(f.subLanguage,x,!0,xe[f.subLanguage]),xe[f.subLanguage]=r._top}else r=Q(x,f.subLanguage.length?f.subLanguage:null);f.relevance>0&&(W+=r.relevance),k.__addSublanguage(r._emitter,r.language)}function _(){f.subLanguage!=null?G():R(),x=""}function M(r,l){r!==""&&(k.startScope(l),k.addText(r),k.endScope())}function he(r,l){let h=1;const b=l.length-1;for(;h<=b;){if(!r._emit[h]){h++;continue}const E=O.classNameAliases[r[h]]||r[h],T=l[h];E?M(T,E):(x=T,R(),x=""),h++}}function ge(r,l){return r.scope&&typeof r.scope=="string"&&k.openNode(O.classNameAliases[r.scope]||r.scope),r.beginScope&&(r.beginScope._wrap?(M(x,O.classNameAliases[r.beginScope._wrap]||r.beginScope._wrap),x=""):r.beginScope._multi&&(he(r.beginScope,l),x="")),f=Object.create(r,{parent:{value:f}}),f}function be(r,l,h){let b=mt(r.endRe,h);if(b){if(r["on:end"]){const E=new ve(r);r["on:end"](l,E),E.isMatchIgnored&&(b=!1)}if(b){for(;r.endsParent&&r.parent;)r=r.parent;return r}}if(r.endsWithParent)return be(r.parent,l,h)}function it(r){return f.matcher.regexIndex===0?(x+=r[0],1):(ie=!0,0)}function nt(r){const l=r[0],h=r.rule,b=new ve(h),E=[h.__beforeBegin,h["on:begin"]];for(const T of E)if(T&&(T(r,b),b.isMatchIgnored))return it(l);return h.skip?x+=l:(h.excludeBegin&&(x+=l),_(),!h.returnBegin&&!h.excludeBegin&&(x=l)),ge(h,r),h.returnBegin?0:l.length}function ot(r){const l=r[0],h=c.substring(r.index),b=be(f,r,h);if(!b)return Se;const E=f;f.endScope&&f.endScope._wrap?(_(),M(l,f.endScope._wrap)):f.endScope&&f.endScope._multi?(_(),he(f.endScope,r)):E.skip?x+=l:(E.returnEnd||E.excludeEnd||(x+=l),_(),E.excludeEnd&&(x=l));do f.scope&&k.closeNode(),!f.skip&&!f.subLanguage&&(W+=f.relevance),f=f.parent;while(f!==b.parent);return b.starts&&ge(b.starts,r),E.returnEnd?0:l.length}function rt(){const r=[];for(let l=f;l!==O;l=l.parent)l.scope&&r.unshift(l.scope);r.forEach(l=>k.openNode(l))}let $={};function me(r,l){const h=l&&l[0];if(x+=r,h==null)return _(),0;if($.type==="begin"&&l.type==="end"&&$.index===l.index&&h===""){if(x+=c.slice(l.index,l.index+1),!p){const b=new Error(`0 width match regex (${n})`);throw b.languageName=n,b.badRule=$.rule,b}return 1}if($=l,l.type==="begin")return nt(l);if(l.type==="illegal"&&!g){const b=new Error('Illegal lexeme "'+h+'" for mode "'+(f.scope||"<unnamed>")+'"');throw b.mode=f,b}else if(l.type==="end"){const b=ot(l);if(b!==Se)return b}if(l.type==="illegal"&&h==="")return x+=`
`,1;if(te>1e5&&te>l.index*3)throw new Error("potential infinite loop, way more iterations than matches");return x+=h,h.length}const O=N(n);if(!O)throw L(u.replace("{}",n)),new Error('Unknown language: "'+n+'"');const at=Vt(O);let ee="",f=m||at;const xe={},k=new a.__emitter(a);rt();let x="",W=0,A=0,te=0,ie=!1;try{if(O.__emitTokens)O.__emitTokens(c,k);else{for(f.matcher.considerAll();;){te++,ie?ie=!1:f.matcher.considerAll(),f.matcher.lastIndex=A;const r=f.matcher.exec(c);if(!r)break;const l=c.substring(A,r.index),h=me(l,r);A=r.index+h}me(c.substring(A))}return k.finalize(),ee=k.toHTML(),{language:n,value:ee,relevance:W,illegal:!1,_emitter:k,_top:f}}catch(r){if(r.message&&r.message.includes("Illegal"))return{language:n,value:ne(c),illegal:!0,relevance:0,_illegalBy:{message:r.message,index:A,context:c.slice(A-100,A+100),mode:r.mode,resultSoFar:ee},_emitter:k};if(p)return{language:n,value:ne(c),illegal:!1,relevance:0,errorRaised:r,_emitter:k,_top:f};throw r}}function V(n){const c={value:ne(n),illegal:!1,relevance:0,_top:o,_emitter:new a.__emitter(a)};return c._emitter.addText(n),c}function Q(n,c){c=c||a.languages||Object.keys(t);const g=V(n),m=c.filter(N).filter(fe).map(_=>z(_,n,!1));m.unshift(g);const w=m.sort((_,M)=>{if(_.relevance!==M.relevance)return M.relevance-_.relevance;if(_.language&&M.language){if(N(_.language).supersetOf===M.language)return 1;if(N(M.language).supersetOf===_.language)return-1}return 0}),[S,R]=w,G=S;return G.secondBest=R,G}function $e(n,c,g){const m=c&&i[c]||g;n.classList.add("hljs"),n.classList.add(`language-${m}`)}function J(n){let c=null;const g=v(n);if(d(g))return;if(X("before:highlightElement",{el:n,language:g}),n.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",n);return}if(n.children.length>0&&(a.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(n)),a.throwUnescapedHTML))throw new ei("One of your code blocks includes unescaped HTML.",n.innerHTML);c=n;const m=c.textContent,w=g?y(m,{language:g,ignoreIllegals:!0}):Q(m);n.innerHTML=w.value,n.dataset.highlighted="yes",$e(n,g,w.language),n.result={language:w.language,re:w.relevance,relevance:w.relevance},w.secondBest&&(n.secondBest={language:w.secondBest.language,relevance:w.secondBest.relevance}),X("after:highlightElement",{el:n,result:w,text:m})}function We(n){a=_e(a,n)}const qe=()=>{U(),B("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function Ke(){U(),B("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let pe=!1;function U(){function n(){U()}if(document.readyState==="loading"){pe||window.addEventListener("DOMContentLoaded",n,!1),pe=!0;return}document.querySelectorAll(a.cssSelector).forEach(J)}function Ye(n,c){let g=null;try{g=c(e)}catch(m){if(L("Language definition for '{}' could not be registered.".replace("{}",n)),p)L(m);else throw m;g=o}g.name||(g.name=n),t[n]=g,g.rawDefinition=c.bind(null,e),g.aliases&&ue(g.aliases,{languageName:n})}function Ze(n){delete t[n];for(const c of Object.keys(i))i[c]===n&&delete i[c]}function Ve(){return Object.keys(t)}function N(n){return n=(n||"").toLowerCase(),t[n]||t[i[n]]}function ue(n,{languageName:c}){typeof n=="string"&&(n=[n]),n.forEach(g=>{i[g.toLowerCase()]=c})}function fe(n){const c=N(n);return c&&!c.disableAutodetect}function Qe(n){n["before:highlightBlock"]&&!n["before:highlightElement"]&&(n["before:highlightElement"]=c=>{n["before:highlightBlock"](Object.assign({block:c.el},c))}),n["after:highlightBlock"]&&!n["after:highlightElement"]&&(n["after:highlightElement"]=c=>{n["after:highlightBlock"](Object.assign({block:c.el},c))})}function Je(n){Qe(n),s.push(n)}function et(n){const c=s.indexOf(n);c!==-1&&s.splice(c,1)}function X(n,c){const g=n;s.forEach(function(m){m[g]&&m[g](c)})}function tt(n){return B("10.7.0","highlightBlock will be removed entirely in v12.0"),B("10.7.0","Please use highlightElement now."),J(n)}Object.assign(e,{highlight:y,highlightAuto:Q,highlightAll:U,highlightElement:J,highlightBlock:tt,configure:We,initHighlighting:qe,initHighlightingOnLoad:Ke,registerLanguage:Ye,unregisterLanguage:Ze,listLanguages:Ve,getLanguage:N,registerAliases:ue,autoDetection:fe,inherit:_e,addPlugin:Je,removePlugin:et}),e.debugMode=function(){p=!1},e.safeMode=function(){p=!0},e.versionString=Jt,e.regex={concat:D,lookahead:Te,either:ae,optional:gt,anyNumberOfTimes:ht};for(const n in q)typeof q[n]=="object"&&Me(q[n]);return Object.assign(e,q),e},P=Pe({});P.newInstance=()=>Pe({});var ii=P;P.HighlightJS=P;P.default=P;const ce=ct(ii),ni=e=>({IMPORTANT:{scope:"meta",begin:"!important"},BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{scope:"number",begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/},FUNCTION_DISPATCH:{className:"built_in",begin:/[\w-]+(?=\()/},ATTRIBUTE_SELECTOR_MODE:{scope:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{scope:"number",begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z_][A-Za-z0-9_-]*/}}),oi=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","optgroup","option","p","picture","q","quote","samp","section","select","source","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video"],ri=["defs","g","marker","mask","pattern","svg","switch","symbol","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","linearGradient","radialGradient","stop","circle","ellipse","image","line","path","polygon","polyline","rect","text","use","textPath","tspan","foreignObject","clipPath"],ai=[...oi,...ri],si=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"].sort().reverse(),li=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"].sort().reverse(),ci=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"].sort().reverse(),di=["accent-color","align-content","align-items","align-self","alignment-baseline","all","anchor-name","animation","animation-composition","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-range","animation-range-end","animation-range-start","animation-timeline","animation-timing-function","appearance","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-align","box-decoration-break","box-direction","box-flex","box-flex-group","box-lines","box-ordinal-group","box-orient","box-pack","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","contain-intrinsic-block-size","contain-intrinsic-height","contain-intrinsic-inline-size","contain-intrinsic-size","contain-intrinsic-width","container","container-name","container-type","content","content-visibility","counter-increment","counter-reset","counter-set","cue","cue-after","cue-before","cursor","cx","cy","direction","display","dominant-baseline","empty-cells","enable-background","field-sizing","fill","fill-opacity","fill-rule","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flood-color","flood-opacity","flow","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-palette","font-size","font-size-adjust","font-smooth","font-smoothing","font-stretch","font-style","font-synthesis","font-synthesis-position","font-synthesis-small-caps","font-synthesis-style","font-synthesis-weight","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-emoji","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","glyph-orientation-horizontal","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphenate-character","hyphenate-limit-chars","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","initial-letter","initial-letter-align","inline-size","inset","inset-area","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","kerning","left","letter-spacing","lighting-color","line-break","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marker","marker-end","marker-mid","marker-start","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-depth","math-shift","math-style","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overlay","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","paint-order","pause","pause-after","pause-before","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","position-anchor","position-visibility","print-color-adjust","quotes","r","resize","rest","rest-after","rest-before","right","rotate","row-gap","ruby-align","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scroll-timeline","scroll-timeline-axis","scroll-timeline-name","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","shape-rendering","speak","speak-as","src","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","table-layout","text-align","text-align-all","text-align-last","text-anchor","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","text-wrap","text-wrap-mode","text-wrap-style","timeline-scope","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-behavior","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","user-modify","user-select","vector-effect","vertical-align","view-timeline","view-timeline-axis","view-timeline-inset","view-timeline-name","view-transition-name","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","white-space-collapse","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index","zoom"].sort().reverse();function pi(e){const t=e.regex,i=ni(e),s={begin:/-(webkit|moz|ms|o)-(?=[a-z])/},p="and or not only",u=/@-?\w[\w]*(-\w+)*/,o="[a-zA-Z-][a-zA-Z0-9_-]*",a=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE];return{name:"CSS",case_insensitive:!0,illegal:/[=|'\$]/,keywords:{keyframePosition:"from to"},classNameAliases:{keyframePosition:"selector-tag"},contains:[i.BLOCK_COMMENT,s,i.CSS_NUMBER_MODE,{className:"selector-id",begin:/#[A-Za-z0-9_-]+/,relevance:0},{className:"selector-class",begin:"\\."+o,relevance:0},i.ATTRIBUTE_SELECTOR_MODE,{className:"selector-pseudo",variants:[{begin:":("+li.join("|")+")"},{begin:":(:)?("+ci.join("|")+")"}]},i.CSS_VARIABLE,{className:"attribute",begin:"\\b("+di.join("|")+")\\b"},{begin:/:/,end:/[;}{]/,contains:[i.BLOCK_COMMENT,i.HEXCOLOR,i.IMPORTANT,i.CSS_NUMBER_MODE,...a,{begin:/(url|data-uri)\(/,end:/\)/,relevance:0,keywords:{built_in:"url data-uri"},contains:[...a,{className:"string",begin:/[^)]/,endsWithParent:!0,excludeEnd:!0}]},i.FUNCTION_DISPATCH]},{begin:t.lookahead(/@/),end:"[{;]",relevance:0,illegal:/:/,contains:[{className:"keyword",begin:u},{begin:/\s/,endsWithParent:!0,excludeEnd:!0,relevance:0,keywords:{$pattern:/[a-z-]+/,keyword:p,attribute:si.join(" ")},contains:[{begin:/[a-z-]+(?=:)/,className:"attribute"},...a,i.CSS_NUMBER_MODE]}]},{className:"selector-tag",begin:"\\b("+ai.join("|")+")\\b"}]}}function ui(e){const t=e.regex,i=t.concat(/[\p{L}_]/u,t.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),s=/[\p{L}0-9._:-]+/u,p={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},u={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},o=e.inherit(u,{begin:/\(/,end:/\)/}),a=e.inherit(e.APOS_STRING_MODE,{className:"string"}),d=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),v={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:s,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[p]},{begin:/'/,end:/'/,contains:[p]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[u,d,a,o,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[u,o,d,a]}]}]},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},p,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[d]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[v],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[v],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:t.concat(/</,t.lookahead(t.concat(i,t.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:i,relevance:0,starts:v}]},{className:"tag",begin:t.concat(/<\//,t.lookahead(t.concat(i,/>/))),contains:[{className:"name",begin:i,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}ce.registerLanguage("css",pi);ce.registerLanguage("xml",ui);const ze={sunny:`/* ============================================
   晴天图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon sunny">
  <div class="sun"></div>
  <div class="sun-rays"></div>
</div>

/* CSS 样式 */
.sun {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 60px rgba(255, 165, 0, 0.6);
  animation: sunPulse 3s ease-in-out infinite;
}

.sun-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  animation: sunRotate 12s linear infinite;
}

.sun-rays::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 30px;
  background: linear-gradient(90deg, #ffd700, #ffa500);
  border-radius: 6px;
  box-shadow: 
    120px 0 #ffd700,
    -120px 0 #ffd700,
    0 120px #ffd700,
    0 -120px #ffd700,
    85px 85px #ffd700,
    -85px 85px #ffd700,
    85px -85px #ffd700,
    -85px -85px #ffd700;
}

@keyframes sunPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 60px rgba(255, 165, 0, 0.6);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 80px rgba(255, 165, 0, 0.8);
  }
}

@keyframes sunRotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}`,cloudy:`/* ============================================
   多云图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon cloudy">
  <div class="cloud"></div>
  <div class="cloud"></div>
</div>

/* CSS 样式 */
.cloud {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
  border-radius: 20px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: cloudFloat 6s ease-in-out infinite;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.cloud::after {
  width: 60px;
  height: 60px;
  top: -35px;
  left: 45px;
}

/* 第二层云 */
.cloud:nth-child(2) {
  position: absolute;
  top: 30px;
  left: -20px;
  opacity: 0.7;
  transform: scale(0.7);
  animation-delay: -3s;
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}`,"partly-cloudy":`/* ============================================
   阴转晴图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon partly-cloudy">
  <div class="sun"></div>
  <div class="cloud"></div>
</div>

/* CSS 样式 */
.partly-cloudy .sun {
  position: absolute;
  top: -30px;
  right: -20px;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  border-radius: 50%;
  box-shadow: 0 0 60px rgba(255, 165, 0, 0.6);
  animation: sunPulse 3s ease-in-out infinite;
}

.partly-cloudy .cloud {
  width: 90px;
  height: 36px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
  border-radius: 18px;
  position: relative;
  z-index: 2;
  animation: cloudFloat 5s ease-in-out infinite;
}

.partly-cloudy .cloud::before,
.partly-cloudy .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.partly-cloudy .cloud::before {
  width: 45px;
  height: 45px;
  top: -22px;
  left: 12px;
}

.partly-cloudy .cloud::after {
  width: 54px;
  height: 54px;
  top: -32px;
  left: 40px;
}

@keyframes sunPulse {
  0%, 100% {
    box-shadow: 0 0 60px rgba(255, 165, 0, 0.6);
  }
  50% {
    box-shadow: 0 0 80px rgba(255, 165, 0, 0.8);
  }
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}`,rainy:`/* ============================================
   下雨图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon rainy">
  <div class="cloud"></div>
  <div class="rain-drops">
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
  </div>
</div>

/* CSS 样式 */
.rainy .cloud {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #4a5568, #718096);
  border-radius: 20px;
  position: relative;
  animation: cloudFloat 4s ease-in-out infinite;
}

.rainy .cloud::before,
.rainy .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.rainy .cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.rainy .cloud::after {
  width: 60px;
  height: 60px;
  top: -35px;
  left: 45px;
}

.rain-drops {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 80px;
  overflow: hidden;
}

.rain-drop {
  position: absolute;
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, transparent, #63b3ed);
  border-radius: 1.5px;
  animation: rainFall 1s linear infinite;
}

.rain-drop:nth-child(1) {
  left: 15%;
  animation-delay: 0s;
}

.rain-drop:nth-child(2) {
  left: 35%;
  animation-delay: 0.2s;
}

.rain-drop:nth-child(3) {
  left: 55%;
  animation-delay: 0.4s;
}

.rain-drop:nth-child(4) {
  left: 75%;
  animation-delay: 0.6s;
}

.rain-drop:nth-child(5) {
  left: 25%;
  animation-delay: 0.3s;
  animation-duration: 1.2s;
}

.rain-drop:nth-child(6) {
  left: 65%;
  animation-delay: 0.7s;
  animation-duration: 1.1s;
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}

@keyframes rainFall {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(60px);
    opacity: 0;
  }
}`,thunderstorm:`/* ============================================
   雷阵雨图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon thunderstorm">
  <div class="cloud"></div>
  <div class="lightning"></div>
  <div class="rain-drops">
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
  </div>
</div>

/* CSS 样式 */
.thunderstorm .cloud {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #2d3748, #4a5568);
  border-radius: 20px;
  position: relative;
  animation: cloudFloat 3s ease-in-out infinite;
}

.thunderstorm .cloud::before,
.thunderstorm .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.thunderstorm .cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.thunderstorm .cloud::after {
  width: 60px;
  height: 60px;
  top: -35px;
  left: 45px;
}

.lightning {
  position: absolute;
  top: 20px;
  left: 60px;
  width: 30px;
  height: 40px;
  animation: lightningFlash 2s ease-in-out infinite;
}

.lightning::before,
.lightning::after {
  content: '';
  position: absolute;
  background: #ffd700;
}

.lightning::before {
  width: 8px;
  height: 25px;
  transform: skewX(-20deg);
  left: 10px;
}

.lightning::after {
  width: 8px;
  height: 20px;
  transform: skewX(-20deg);
  top: 20px;
  left: 5px;
}

.thunderstorm .rain-drops {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 80px;
  overflow: hidden;
}

.thunderstorm .rain-drop {
  position: absolute;
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, transparent, #63b3ed);
  border-radius: 1.5px;
  animation: rainFall 0.8s linear infinite;
}

.thunderstorm .rain-drop:nth-child(1) {
  left: 15%;
  animation-delay: 0s;
}

.thunderstorm .rain-drop:nth-child(2) {
  left: 35%;
  animation-delay: 0.15s;
}

.thunderstorm .rain-drop:nth-child(3) {
  left: 55%;
  animation-delay: 0.3s;
}

.thunderstorm .rain-drop:nth-child(4) {
  left: 75%;
  animation-delay: 0.45s;
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}

@keyframes lightningFlash {
  0%, 90%, 100% {
    opacity: 0;
    filter: drop-shadow(0 0 0 transparent);
  }
  92% {
    opacity: 1;
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
  }
  94% {
    opacity: 0.5;
  }
  96% {
    opacity: 1;
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1));
  }
}

@keyframes rainFall {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(60px);
    opacity: 0;
  }
}`,snowy:`/* ============================================
   下雪图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon snowy">
  <div class="cloud"></div>
  <div class="snowflakes">
    <div class="snowflake">❄</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❄</div>
  </div>
</div>

/* CSS 样式 */
.snowy .cloud {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
  border-radius: 20px;
  position: relative;
  animation: cloudFloat 5s ease-in-out infinite;
}

.snowy .cloud::before,
.snowy .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.snowy .cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.snowy .cloud::after {
  width: 60px;
  height: 60px;
  top: -35px;
  left: 45px;
}

.snowflakes {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 100px;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  color: #fff;
  font-size: 16px;
  animation: snowFall 3s ease-in-out infinite;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.snowflake:nth-child(1) {
  left: 10%;
  animation-delay: 0s;
}

.snowflake:nth-child(2) {
  left: 25%;
  animation-delay: 0.5s;
  animation-duration: 3.5s;
}

.snowflake:nth-child(3) {
  left: 45%;
  animation-delay: 1s;
  animation-duration: 2.8s;
}

.snowflake:nth-child(4) {
  left: 65%;
  animation-delay: 1.5s;
  animation-duration: 3.2s;
}

.snowflake:nth-child(5) {
  left: 80%;
  animation-delay: 0.8s;
  animation-duration: 3.8s;
}

.snowflake:nth-child(6) {
  left: 35%;
  animation-delay: 2s;
  animation-duration: 3s;
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}

@keyframes snowFall {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  50% {
    transform: translateY(40px) rotate(180deg);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(80px) rotate(360deg);
    opacity: 0;
  }
}`,foggy:`/* ============================================
   雾天图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon foggy">
  <div class="fog">
    <div class="fog-layer"></div>
    <div class="fog-layer"></div>
    <div class="fog-layer"></div>
  </div>
</div>

/* CSS 样式 */
.fog {
  position: relative;
  width: 160px;
  height: 80px;
}

.fog-layer {
  position: absolute;
  height: 20px;
  background: linear-gradient(90deg, transparent, rgba(226, 232, 240, 0.8), transparent);
  border-radius: 10px;
  animation: fogMove 6s ease-in-out infinite;
}

.fog-layer:nth-child(1) {
  top: 0;
  left: 0;
  width: 140px;
}

.fog-layer:nth-child(2) {
  top: 30px;
  left: 20px;
  width: 120px;
  animation-delay: -2s;
  animation-direction: reverse;
}

.fog-layer:nth-child(3) {
  top: 60px;
  left: 0;
  width: 100px;
  animation-delay: -4s;
}

@keyframes fogMove {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.6;
  }
  50% {
    transform: translateX(20px);
    opacity: 0.9;
  }
}`,windy:`/* ============================================
   大风图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon windy">
  <div class="wind-container">
    <div class="wind-line"></div>
    <div class="wind-line"></div>
    <div class="wind-line"></div>
    <div class="wind-curve"></div>
    <div class="wind-curve"></div>
    <div class="wind-curve"></div>
  </div>
</div>

/* CSS 样式 */
.wind-container {
  position: relative;
  width: 160px;
  height: 120px;
}

.wind-line {
  position: absolute;
  height: 4px;
  background: linear-gradient(90deg, transparent, #a0aec0, transparent);
  border-radius: 2px;
  animation: windBlow 2s ease-in-out infinite;
}

.wind-line:nth-child(1) {
  top: 20px;
  left: 0;
  width: 120px;
  animation-delay: 0s;
}

.wind-line:nth-child(2) {
  top: 50px;
  left: 20px;
  width: 100px;
  animation-delay: 0.3s;
}

.wind-line:nth-child(3) {
  top: 80px;
  left: 0;
  width: 140px;
  animation-delay: 0.6s;
}

.wind-curve {
  position: absolute;
  width: 40px;
  height: 20px;
  border: 4px solid transparent;
  border-top: 4px solid #a0aec0;
  border-right: 4px solid #a0aec0;
  border-radius: 0 20px 0 0;
  animation: windCurve 2s ease-in-out infinite;
}

.wind-curve:nth-child(4) {
  top: 15px;
  left: 110px;
  animation-delay: 0.2s;
}

.wind-curve:nth-child(5) {
  top: 45px;
  left: 100px;
  animation-delay: 0.5s;
}

.wind-curve:nth-child(6) {
  top: 75px;
  left: 130px;
  animation-delay: 0.8s;
}

@keyframes windBlow {
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(60px);
    opacity: 0;
  }
}

@keyframes windCurve {
  0% {
    transform: translateX(-10px) scale(0.5);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translateX(40px) scale(1);
    opacity: 0;
  }
}`,hail:`/* ============================================
   冰雹图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon hail">
  <div class="cloud"></div>
  <div class="hail-stones">
    <div class="hail-stone"></div>
    <div class="hail-stone"></div>
    <div class="hail-stone"></div>
    <div class="hail-stone"></div>
    <div class="hail-stone"></div>
    <div class="hail-stone"></div>
  </div>
</div>

/* CSS 样式 */
.hail .cloud {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #4a5568, #718096);
  border-radius: 20px;
  position: relative;
  animation: cloudFloat 4s ease-in-out infinite;
}

.hail .cloud::before,
.hail .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.hail .cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.hail .cloud::after {
  width: 60px;
  height: 60px;
  top: -35px;
  left: 45px;
}

.hail-stones {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 80px;
  overflow: hidden;
}

.hail-stone {
  position: absolute;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #e2e8f0, #a0aec0);
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  animation: hailFall 1.2s ease-in-out infinite;
}

.hail-stone:nth-child(1) {
  left: 15%;
  animation-delay: 0s;
}

.hail-stone:nth-child(2) {
  left: 35%;
  animation-delay: 0.2s;
  width: 10px;
  height: 10px;
}

.hail-stone:nth-child(3) {
  left: 55%;
  animation-delay: 0.4s;
}

.hail-stone:nth-child(4) {
  left: 75%;
  animation-delay: 0.6s;
  width: 12px;
  height: 12px;
}

.hail-stone:nth-child(5) {
  left: 25%;
  animation-delay: 0.3s;
  width: 9px;
  height: 9px;
}

.hail-stone:nth-child(6) {
  left: 65%;
  animation-delay: 0.7s;
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}

@keyframes hailFall {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(60px) rotate(180deg);
    opacity: 0;
  }
}`,"night-clear":`/* ============================================
   晴夜图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon night-clear">
  <div class="stars">
    <div class="star">✦</div>
    <div class="star">✦</div>
    <div class="star">✦</div>
    <div class="star">✦</div>
    <div class="star">✦</div>
    <div class="star">✦</div>
  </div>
  <div class="moon"></div>
</div>

/* CSS 样式 */
.moon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f7fafc, #e2e8f0);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.4);
  animation: moonGlow 4s ease-in-out infinite;
}

.moon::after {
  content: '';
  position: absolute;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #1a202c, #2d3748);
  border-radius: 50%;
  top: -5px;
  right: -15px;
}

.stars {
  position: absolute;
  top: -40px;
  left: -60px;
  width: 220px;
  height: 220px;
}

.star {
  position: absolute;
  color: #ffd700;
  animation: starTwinkle 2s ease-in-out infinite;
}

.star:nth-child(1) {
  top: 20px;
  left: 30px;
  font-size: 8px;
  animation-delay: 0s;
}

.star:nth-child(2) {
  top: 60px;
  left: 20px;
  font-size: 6px;
  animation-delay: 0.5s;
}

.star:nth-child(3) {
  top: 10px;
  right: 40px;
  font-size: 10px;
  animation-delay: 1s;
}

.star:nth-child(4) {
  top: 50px;
  right: 20px;
  font-size: 7px;
  animation-delay: 1.5s;
}

.star:nth-child(5) {
  bottom: 40px;
  left: 10px;
  font-size: 6px;
  animation-delay: 0.3s;
}

.star:nth-child(6) {
  bottom: 20px;
  right: 50px;
  font-size: 9px;
  animation-delay: 0.8s;
}

@keyframes moonGlow {
  0%, 100% {
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 60px rgba(255, 255, 255, 0.6);
  }
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}`,"night-cloudy":`/* ============================================
   多云夜图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon night-cloudy">
  <div class="stars">
    <div class="star">✦</div>
    <div class="star">✦</div>
  </div>
  <div class="moon"></div>
  <div class="cloud"></div>
</div>

/* CSS 样式 */
.night-cloudy .moon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f7fafc, #e2e8f0);
  border-radius: 50%;
  position: absolute;
  top: -25px;
  right: -15px;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.4);
  animation: moonGlow 4s ease-in-out infinite;
}

.night-cloudy .moon::after {
  content: '';
  position: absolute;
  width: 55px;
  height: 55px;
  background: linear-gradient(135deg, #1a202c, #2d3748);
  border-radius: 50%;
  top: -5px;
  right: -12px;
}

.night-cloudy .stars {
  position: absolute;
  top: -50px;
  left: -70px;
  width: 220px;
  height: 220px;
}

.night-cloudy .star {
  position: absolute;
  color: #ffd700;
  animation: starTwinkle 2s ease-in-out infinite;
}

.night-cloudy .star:nth-child(1) {
  top: 30px;
  left: 40px;
  font-size: 8px;
  animation-delay: 0s;
}

.night-cloudy .star:nth-child(2) {
  top: 20px;
  right: 60px;
  font-size: 6px;
  animation-delay: 0.7s;
}

.night-cloudy .cloud {
  width: 90px;
  height: 36px;
  background: linear-gradient(135deg, #4a5568, #718096);
  border-radius: 18px;
  position: relative;
  z-index: 2;
  animation: cloudFloat 5s ease-in-out infinite;
}

.night-cloudy .cloud::before,
.night-cloudy .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.night-cloudy .cloud::before {
  width: 45px;
  height: 45px;
  top: -22px;
  left: 12px;
}

.night-cloudy .cloud::after {
  width: 54px;
  height: 54px;
  top: -32px;
  left: 40px;
}

@keyframes moonGlow {
  0%, 100% {
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 50px rgba(255, 255, 255, 0.6);
  }
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}`,tornado:`/* ============================================
   龙卷风图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon tornado">
  <div class="tornado-container">
    <div class="cloud"></div>
    <div class="twister"></div>
  </div>
</div>

/* CSS 样式 */
.tornado-container {
  position: relative;
  width: 160px;
  height: 160px;
}

.tornado .cloud {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 40px;
  background: linear-gradient(135deg, #4a5568, #718096);
  border-radius: 20px;
  animation: cloudFloat 4s ease-in-out infinite;
}

.tornado .cloud::before,
.tornado .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.tornado .cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.tornado .cloud::after {
  width: 60px;
  height: 60px;
  top: -35px;
  left: 55px;
}

.twister {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 100px;
  border: 3px solid rgba(113, 128, 150, 0.6);
  border-radius: 50%;
  border-top-color: transparent;
  border-bottom-color: transparent;
  animation: tornadoSpin 1s linear infinite;
}

.twister::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 5px;
  width: 40px;
  height: 75px;
  border: 2px solid rgba(113, 128, 150, 0.4);
  border-radius: 50%;
  border-top-color: transparent;
  border-bottom-color: transparent;
  animation: tornadoSpin 1.5s linear infinite reverse;
}

.twister::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 10px;
  width: 30px;
  height: 55px;
  border: 2px solid rgba(113, 128, 150, 0.3);
  border-radius: 50%;
  border-top-color: transparent;
  border-bottom-color: transparent;
  animation: tornadoSpin 1.2s linear infinite;
}

@keyframes tornadoSpin {
  from {
    transform: translateX(-50%) rotate(0deg);
  }
  to {
    transform: translateX(-50%) rotate(360deg);
  }
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(-50%);
  }
  50% {
    transform: translateX(-35%);
  }
}`},He={sunny:{name:"晴天",description:"阳光明媚，适合外出",render:()=>`
      <div class="sun"></div>
      <div class="sun-rays"></div>
    `},cloudy:{name:"多云",description:"云层较多，气温适宜",render:()=>`
      <div class="cloud"></div>
      <div class="cloud"></div>
    `},"partly-cloudy":{name:"阴转晴",description:"部分多云，偶见阳光",render:()=>`
      <div class="sun"></div>
      <div class="cloud"></div>
    `},rainy:{name:"下雨",description:"记得带伞，注意保暖",render:()=>`
      <div class="cloud"></div>
      <div class="rain-drops">
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
      </div>
    `},thunderstorm:{name:"雷阵雨",description:"雷雨天气，注意安全",render:()=>`
      <div class="cloud"></div>
      <div class="lightning"></div>
      <div class="rain-drops">
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
      </div>
    `},snowy:{name:"下雪",description:"银装素裹，注意保暖",render:()=>`
      <div class="cloud"></div>
      <div class="snowflakes">
        <div class="snowflake">❄</div>
        <div class="snowflake">❄</div>
        <div class="snowflake">❄</div>
        <div class="snowflake">❄</div>
        <div class="snowflake">❄</div>
        <div class="snowflake">❄</div>
      </div>
    `},foggy:{name:"雾天",description:"能见度低，注意安全",render:()=>`
      <div class="fog">
        <div class="fog-layer"></div>
        <div class="fog-layer"></div>
        <div class="fog-layer"></div>
      </div>
    `},windy:{name:"大风",description:"风力强劲，注意防风",render:()=>`
      <div class="wind-container">
        <div class="wind-line"></div>
        <div class="wind-line"></div>
        <div class="wind-line"></div>
        <div class="wind-curve"></div>
        <div class="wind-curve"></div>
        <div class="wind-curve"></div>
      </div>
    `},hail:{name:"冰雹",description:"冰雹天气，注意防护",render:()=>`
      <div class="cloud"></div>
      <div class="hail-stones">
        <div class="hail-stone"></div>
        <div class="hail-stone"></div>
        <div class="hail-stone"></div>
        <div class="hail-stone"></div>
        <div class="hail-stone"></div>
        <div class="hail-stone"></div>
      </div>
    `},"night-clear":{name:"晴夜",description:"月色皎洁，星光闪烁",render:()=>`
      <div class="stars">
        <div class="star">✦</div>
        <div class="star">✦</div>
        <div class="star">✦</div>
        <div class="star">✦</div>
        <div class="star">✦</div>
        <div class="star">✦</div>
      </div>
      <div class="moon"></div>
    `},"night-cloudy":{name:"多云夜",description:"月色朦胧，云层较厚",render:()=>`
      <div class="stars">
        <div class="star">✦</div>
        <div class="star">✦</div>
      </div>
      <div class="moon"></div>
      <div class="cloud"></div>
    `},tornado:{name:"龙卷风",description:"极端天气，请躲避",render:()=>`
      <div class="tornado-container">
        <div class="cloud"></div>
        <div class="twister"></div>
      </div>
    `}};let I="sunny",K="light";const H=document.getElementById("weatherIconContainer"),fi=document.getElementById("weatherName"),hi=document.getElementById("weatherDescription"),gi=document.getElementById("themeToggle"),je=document.querySelectorAll(".weather-btn"),bi=document.querySelectorAll(".quick-copy-btn"),oe=document.getElementById("codeContent"),de=document.getElementById("copyCodeBtn");function Fe(e){const t=He[e],i=document.createElement("div");return i.className=`weather-icon ${e}`,i.innerHTML=t.render(),i}function Ue(e){const t=He[e];fi.textContent=t.name,hi.textContent=t.description}function Xe(e){const t=ze[e];oe.textContent=t,ce.highlightElement(oe),oe.scrollTop=0}function mi(e){if(e===I)return;je.forEach(s=>{s.dataset.weather===I&&s.classList.remove("active"),s.dataset.weather===e&&s.classList.add("active")});const t=H.querySelector(".weather-icon");t&&(t.classList.add("exit"),t.classList.remove("active"),setTimeout(()=>{t.parentNode===H&&H.removeChild(t)},500));const i=Fe(e);H.appendChild(i),requestAnimationFrame(()=>{i.classList.add("active")}),Ue(e),Xe(e),I=e}function xi(){const e=Fe(I);H.appendChild(e),setTimeout(()=>{e.classList.add("active")},100),Ue(I),Xe(I)}function vi(){const e=document.documentElement,t=document.querySelector(".theme-icon");K==="light"?(e.setAttribute("data-theme","dark"),K="dark",t.textContent="☀️",localStorage.setItem("weather-theme","dark")):(e.removeAttribute("data-theme"),K="light",t.textContent="🌙",localStorage.setItem("weather-theme","light"))}function yi(){localStorage.getItem("weather-theme")==="dark"&&(document.documentElement.setAttribute("data-theme","dark"),K="dark",document.querySelector(".theme-icon").textContent="☀️")}async function Ge(e,t){const i=ze[e],s=t===de;try{if(await navigator.clipboard.writeText(i),s){t.classList.add("copied");const p=t.querySelector(".copy-text").textContent;t.querySelector(".copy-text").textContent="已复制!",t.querySelector(".copy-icon").textContent="✅",setTimeout(()=>{t.classList.remove("copied"),t.querySelector(".copy-text").textContent=p,t.querySelector(".copy-icon").textContent="📋"},2e3)}else{const p=t.textContent;t.classList.add("copied"),t.textContent="✅",setTimeout(()=>{t.classList.remove("copied"),t.textContent=p},2e3)}}catch(p){console.error("复制失败:",p);const u=document.createElement("textarea");if(u.value=i,u.style.position="fixed",u.style.left="-999999px",document.body.appendChild(u),u.select(),document.execCommand("copy"),document.body.removeChild(u),s){t.classList.add("copied");const o=t.querySelector(".copy-text").textContent;t.querySelector(".copy-text").textContent="已复制!",t.querySelector(".copy-icon").textContent="✅",setTimeout(()=>{t.classList.remove("copied"),t.querySelector(".copy-text").textContent=o,t.querySelector(".copy-icon").textContent="📋"},2e3)}else{const o=t.textContent;t.classList.add("copied"),t.textContent="✅",setTimeout(()=>{t.classList.remove("copied"),t.textContent=o},2e3)}}}function wi(){Ge(I,de)}function ki(){je.forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.weather;mi(t)})}),bi.forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const i=e.dataset.weather;Ge(i,e)})}),gi.addEventListener("click",vi),de.addEventListener("click",wi)}document.addEventListener("DOMContentLoaded",()=>{yi(),xi(),ki()});
