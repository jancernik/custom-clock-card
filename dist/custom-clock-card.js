var t,e;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(t||(t={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(e||(e={}));const s=globalThis,i=s.ShadowRoot&&(void 0===s.ShadyCSS||s.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),r=new WeakMap;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(e,t))}return t}toString(){return this.cssText}};const a=t=>new n("string"==typeof t?t:t+"",void 0,o),c=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(s,t,o)},l=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return a(e)})(t):t,{is:h,defineProperty:d,getOwnPropertyDescriptor:u,getOwnPropertyNames:p,getOwnPropertySymbols:_,getPrototypeOf:m}=Object,f=globalThis,g=f.trustedTypes,$=g?g.emptyScript:"",y=f.reactiveElementPolyfillSupport,v=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?$:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},w=(t,e)=>!h(t,e),A={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:w};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=A){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&d(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=u(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??A}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=m(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...p(t),..._(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(i)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),o=s.litNonce;void 0!==o&&e.setAttribute("nonce",o),e.textContent=i.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??w)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,y?.({ReactiveElement:x}),(f.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k=globalThis,S=t=>t,E=k.trustedTypes,C=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,M="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+P,O=`<${T}>`,U=document,N=()=>U.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,H="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,j=/>/g,D=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,B=/"/g,W=/^(?:script|style|textarea|title)$/i,q=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),V=q(1),Z=q(2),K=Symbol.for("lit-noChange"),X=Symbol.for("lit-nothing"),G=new WeakMap,J=U.createTreeWalker(U,129);function Y(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const Q=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=F;for(let e=0;e<s;e++){const s=t[e];let a,c,l=-1,h=0;for(;h<s.length&&(n.lastIndex=h,c=n.exec(s),null!==c);)h=n.lastIndex,n===F?"!--"===c[1]?n=L:void 0!==c[1]?n=j:void 0!==c[2]?(W.test(c[2])&&(o=RegExp("</"+c[2],"g")),n=D):void 0!==c[3]&&(n=D):n===D?">"===c[0]?(n=o??F,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?D:'"'===c[3]?B:I):n===B||n===I?n=D:n===L||n===j?n=F:(n=D,o=void 0);const d=n===D&&t[e+1].startsWith("/>")?" ":"";r+=n===F?s+O:l>=0?(i.push(a),s.slice(0,l)+M+s.slice(l)+P+d):s+P+(-2===l?e:d)}return[Y(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class tt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[c,l]=Q(t,e);if(this.el=tt.createElement(c,s),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=J.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(M)){const e=l[r++],s=i.getAttribute(t).split(P),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?rt:"?"===n[1]?nt:"@"===n[1]?at:ot}),i.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(W.test(i.tagName)){const t=i.textContent.split(P),e=t.length-1;if(e>0){i.textContent=E?E.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],N()),J.nextNode(),a.push({type:2,index:++o});i.append(t[e],N())}}}else if(8===i.nodeType)if(i.data===T)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(P,t+1));)a.push({type:7,index:o}),t+=P.length-1}o++}}static createElement(t,e){const s=U.createElement("template");return s.innerHTML=t,s}}function et(t,e,s=t,i){if(e===K)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=R(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=et(t,o._$AS(t,e.values),o,i)),e}class st{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??U).importNode(e,!0);J.currentNode=i;let o=J.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new it(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ct(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=J.nextNode(),r++)}return J.currentNode=U,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class it{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=X,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),R(t)?t===X||null==t||""===t?(this._$AH!==X&&this._$AR(),this._$AH=X):t!==this._$AH&&t!==K&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==X&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=tt.createElement(Y(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new st(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new tt(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new it(this.O(N()),this.O(N()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class ot{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=X,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=X}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=et(this,t,e,0),r=!R(t)||t!==this._$AH&&t!==K,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=et(this,i[s+n],e,n),a===K&&(a=this._$AH[n]),r||=!R(a)||a!==this._$AH[n],a===X?t=X:t!==X&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===X?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class rt extends ot{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===X?void 0:t}}class nt extends ot{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==X)}}class at extends ot{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??X)===K)return;const s=this._$AH,i=t===X&&s!==X||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==X&&(s===X||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ct{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}}const lt=k.litHtmlPolyfillSupport;lt?.(tt,it),(k.litHtmlVersions??=[]).push("3.3.3");const ht=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let dt=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new it(e.insertBefore(N(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}};dt._$litElement$=!0,dt.finalized=!0,ht.litElementHydrateSupport?.({LitElement:dt});const ut=ht.litElementPolyfillSupport;ut?.({LitElement:dt}),(ht.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:w},_t=(t=pt,e,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function mt(t){return(e,s)=>"object"==typeof s?_t(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ft(t){return mt({...t,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=1,$t=t=>(...e)=>({_$litDirective$:t,values:e});let yt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vt=$t(class extends yt{constructor(t){if(super(t),t.type!==gt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const s=t.element.classList;for(const t of this.st)t in e||(s.remove(t),this.st.delete(t));for(const t in e){const i=!!e[t];i===this.st.has(t)||this.nt?.has(t)||(i?(s.add(t),this.st.add(t)):(s.remove(t),this.st.delete(t)))}return K}}),bt=t=>t??X,wt="important",At=" !"+wt,xt=$t(class extends yt{constructor(t){if(super(t),t.type!==gt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,s)=>{const i=t[s];return null==i?e:e+`${s=s.includes("-")?s:s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(t,[e]){const{style:s}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?s.removeProperty(t):s[t]=null);for(const t in e){const i=e[t];if(null!=i){this.ft.add(t);const e="string"==typeof i&&i.endsWith(At);t.includes("-")||e?s.setProperty(t,e?i.slice(0,-11):i,e?wt:""):s[t]=i}}return K}}),kt=["#ffffff","#ffffff","#ffffff","#ffffff"],St={color:"#ffffff",colors:[...kt],font_family:"",font_url:"",font_weight:400,gap:0,horizontal_spacing:0,individual_colors:!1,layout:"line",natural_width:!0,no_background:!1,padding:0,scale:1,separator:":",separator_color:"#ffffff",separator_offset:0,separator_spacing:0,show_separator:!0,time_format:"",time_zone:"",vertical_spacing:0},Et={font_weight:{max:1e3,min:100},gap:{max:50,min:0},horizontal_spacing:{max:100,min:-100},padding:{max:100,min:0},scale:{max:5,min:.1},separator_offset:{max:100,min:-100},separator_spacing:{max:50,min:-50},vertical_spacing:{max:100,min:-100}},Ct=(t,e,s)=>Math.min(s,Math.max(e,t)),Mt=(t,e)=>{if("number"!=typeof e||Number.isNaN(e))return St[t];const{max:s,min:i}=Et[t];return Ct(e,i,s)},Pt=t=>[0,1,2,3].map(e=>t?.[e]||kt[e]),Tt=t=>"stacked"===t||"line"===t?t:St.layout,Ot=t=>"language"===t||"system"===t||"12"===t||"24"===t?t:St.time_format,Ut=()=>({type:"custom:custom-clock-card",...St,colors:[...St.colors]}),Nt=(t,e)=>{const s={type:t.type};for(const i of Object.keys(t))"type"!==i&&e.has(i)&&(s[i]=t[i]);return s};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Rt=Object.defineProperty,zt=(t,e,s,i)=>{for(var o,r=void 0,n=t.length-1;n>=0;n--)(o=t[n])&&(r=o(e,s,r)||r);return r&&Rt(e,s,r),r};const Ht="system-ui, sans-serif",Ft=[".woff2",".woff",".ttf",".otf"];console.info("%c CUSTOM-CLOCK-CARD %c v0.0.1 ","color: white; font-weight: bold; background: black","color: black; font-weight: bold; background: white"),window.customCards=window.customCards||[],window.customCards.push({description:"Highly customizable clock card",name:"Custom Clock Card",preview:!0,type:"custom-clock-card"});const Lt=new Set,jt=new Set,Dt=t=>`Custom Clock Font ${(t=>{let e=5381;for(let s=0;s<t.length;s++)e=33*e^t.charCodeAt(s);return(e>>>0).toString(36)})(t)}`,It=120,Bt=142,Wt="0123456789",qt={ascent:106.5,descent:.05*Bt};let Vt;const Zt=()=>(void 0===Vt&&(Vt=document.createElement("canvas").getContext("2d")),Vt),Kt=(t,e)=>`${e} 142px ${t}`,Xt=new Map,Gt=new Map,Jt=(t,e,s)=>{const i=`${Kt(t,e)}|${s}`,o=Gt.get(i);if(o)return o;const r=Zt();if(!r||!s)return s.split("").map(()=>0);r.font=Kt(t,e);const n=[];let a=0;for(let t=1;t<=s.length;t++){const e=r.measureText(s.slice(0,t)).width;n.push(e-a),a=e}return n.every(t=>t<=0)||Gt.set(i,n),n},Yt=t=>`${t.font_family}|${t.font_url}|${t.font_weight}`;let Qt=0;class te extends dt{constructor(){super(...arguments),this._config=Ut(),this._fontFamily=Ht,this._maskPrefix="custom-clock-"+ ++Qt,this._measureBudget=5,this._metricsReady=!0,this._naturalWidth=480,this._naturalX=-240,this._now=new Date,this._onFontsLoaded=()=>{Xt.clear(),Gt.clear(),this._resetMeasureBudget(),this._metricsReady||(this._metricsReady=this._isFontReady()),this.requestUpdate()},this._onResize=()=>{this._resetMeasureBudget(),this.requestUpdate()}}static get styles(){return c`
      :host {
        display: block;
      }

      ha-card {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }

      ha-card.no-background {
        background: transparent;
        box-shadow: none;
        border: 0;
        overflow: visible;
      }

      .clock {
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--clock-width);
        aspect-ratio: var(--clock-aspect);
        max-width: 100%;
        margin-inline: auto;
        overflow: visible;
      }

      .clock-svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .digit,
      .mask-digit {
        font-family: var(--digit-font, system-ui, sans-serif);
        font-size: ${a(Bt)}px;
        font-weight: var(--digit-weight);
        line-height: 1;
        dominant-baseline: alphabetic;
      }

      .mask-digit {
        fill: black;
        stroke: black;
        stroke-linejoin: round;
        paint-order: stroke fill;
      }
    `}get _customFontFamily(){const{font_family:t,font_url:e}=this._config;return t||(e?Dt(e):void 0)}static async getConfigElement(){return await Promise.resolve().then(function(){return ce}),document.createElement("custom-clock-card-editor")}static getStubConfig(){return{type:"custom:custom-clock-card"}}connectedCallback(){super.connectedCallback(),this._scheduleTick(),document.fonts.addEventListener("loadingdone",this._onFontsLoaded),document.fonts.ready.then(()=>{this.isConnected&&this._onFontsLoaded()}),this._metricsReadyTimer=window.setTimeout(()=>{this._metricsReady=!0},3e3),this._resizeObserver=new ResizeObserver(this._onResize),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._clearTimer(),document.fonts.removeEventListener("loadingdone",this._onFontsLoaded),this._metricsReadyTimer&&(clearTimeout(this._metricsReadyTimer),this._metricsReadyTimer=void 0),this._resizeObserver?.disconnect(),this._resizeObserver=void 0}getGridOptions(){return{columns:12,min_columns:3,rows:"auto"}}setConfig(t){if(!t)throw new Error("Invalid configuration");const e=Yt(this._config);this._config={color:t.color||St.color,colors:Pt(t.colors),font_family:(t.font_family??"").trim(),font_url:(t.font_url??"").trim(),font_weight:Mt("font_weight",t.font_weight),gap:Mt("gap",t.gap),horizontal_spacing:Mt("horizontal_spacing",t.horizontal_spacing),individual_colors:!0===t.individual_colors,layout:Tt(t.layout),natural_width:!1!==t.natural_width,no_background:!0===t.no_background,padding:Mt("padding",t.padding),scale:Mt("scale",t.scale),separator:t.separator??St.separator,separator_color:t.separator_color||St.separator_color,separator_offset:Mt("separator_offset",t.separator_offset),separator_spacing:Mt("separator_spacing",t.separator_spacing),show_separator:!1!==t.show_separator,time_format:Ot(t.time_format),time_zone:(t.time_zone??"").trim(),type:t.type||"custom:custom-clock-card",vertical_spacing:Mt("vertical_spacing",t.vertical_spacing)},this._resetMeasureBudget(),this._fontFamily=this._computeFontFamily(),Yt(this._config)!==e&&(this._metricsReady=this._isFontReady()),this._config.font_url&&((t=>{try{const e=new URL(t,location.origin).pathname.toLowerCase();return Ft.some(t=>e.endsWith(t))}catch{return!0}})(this._config.font_url)?((t,e)=>{const s=`${t}|${e}`;if(!Lt.has(s)){Lt.add(s);try{const i=new FontFace(t,`url("${e}")`,{weight:"100 1000"});document.fonts.add(i),i.load().catch(t=>{Lt.delete(s),console.warn(`custom-clock-card: could not load font from ${e}`,t)})}catch(t){Lt.delete(s),console.warn(`custom-clock-card: invalid font url ${e}`,t)}}})(this._config.font_family||Dt(this._config.font_url),this._config.font_url):(t=>{if(jt.has(t))return;jt.add(t);const e=document.createElement("link");e.rel="stylesheet",e.href=t,e.addEventListener("error",()=>{console.warn(`custom-clock-card: could not load font stylesheet ${t}`)}),document.head.appendChild(e)})(this._config.font_url))}render(){const t=this._config.natural_width,e=this._digits(),s="line"===this._config.layout&&this._config.show_separator?this._config.separator:"",{baseline:i,rowHeight:o}=this._rowMetrics(s),r=this._config.separator_offset,n=this._rowsHeight(o);let a,c,l;if(t)a=this._naturalWidth,c=this._naturalX,l="line"===this._config.layout?this._renderNaturalLine(e,i,r):this._renderNaturalStacked(e,n,i,o);else{const t=this._glyphs(e),s=this._layout(t,i,o,r);a=s.width,c=0,l=this._renderCells(t,s)}const h=a*this._config.scale;return V`
      <ha-card
        class=${vt({"no-background":this._config.no_background})}
        style=${`padding: ${this._config.padding}px;`}
      >
        <div
          class="clock"
          style=${xt({"--clock-aspect":`${a} / ${n}`,"--clock-width":`${h}px`,"--digit-font":this._fontFamily,"--digit-weight":`${this._config.font_weight}`,visibility:this._metricsReady?"visible":"hidden"})}
        >
          <svg
            class="clock-svg"
            viewBox=${`${c} 0 ${a} ${n}`}
            role="img"
            aria-label=${`Current time ${this._accessibleTime()}`}
          >
            ${l}
          </svg>
        </div>
      </ha-card>
    `}updated(){if(!this._config.natural_width||this._measureBudget<=0)return;const t=this.renderRoot.querySelectorAll("text.digit");if(0===t.length)return;let e=Number.POSITIVE_INFINITY,s=Number.NEGATIVE_INFINITY;for(const i of t){const t=i.getBBox();e=Math.min(e,t.x),s=Math.max(s,t.x+t.width)}const i=Math.max(s-e,1);Number.isFinite(e)&&Number.isFinite(i)&&(Math.abs(i-this._naturalWidth)>.5||Math.abs(e-this._naturalX)>.5)&&(this._measureBudget-=1,this._naturalX=e,this._naturalWidth=i)}_accessibleTime(){return new Intl.DateTimeFormat(void 0,{hour:"numeric",hourCycle:this._useAmPm()?"h12":"h23",minute:"2-digit",timeZone:this._timeZone()}).format(this._now)}_clearTimer(){this._timer&&(clearTimeout(this._timer),this._timer=void 0)}_colors(){const{color:t,colors:e,individual_colors:s}=this._config;return s?e:[t,t,t,t]}_computeFontFamily(){const t=this._customFontFamily;return t?`"${t}", ${Ht}`:Ht}_digits(){const t=new Intl.DateTimeFormat("en-US",{hour:"2-digit",hourCycle:this._useAmPm()?"h12":"h23",minute:"2-digit",timeZone:this._timeZone()}).formatToParts(this._now);return`${t.find(t=>"hour"===t.type)?.value.padStart(2,"0")||"00"}${t.find(t=>"minute"===t.type)?.value.padStart(2,"0")||"00"}`.split("")}_glyphs(t){const e=this._colors(),s=t.map((t,s)=>({char:t,color:e[s],width:It}));return"line"===this._config.layout&&this._config.show_separator&&s.splice(2,0,{char:this._config.separator,color:this._config.separator_color,separator:!0,width:60*this._config.separator.length}),s}_isFontReady(){const t=this._customFontFamily;if(!t)return!0;for(const e of document.fonts)if("loaded"===e.status&&e.family.replace(/^["']|["']$/g,"")===t)return!0;return!1}_layout(t,e,s,i){const o=this._config.horizontal_spacing;if("line"===this._config.layout){const r=this._config.separator_spacing,n=[];let a=0,c=0;return t.forEach((s,l)=>{const h=s.separator?e+i:e;n.push({x:a+s.width/2,y:h}),c=a+s.width;const d=s.separator||t[l+1]?.separator?s.width+r:s.width+o;a+=Math.max(d,8)}),{height:s,positions:n,width:c}}const r=It+o,n=s+this._config.vertical_spacing;return{height:this._rowsHeight(s),positions:[{x:60,y:e},{x:60+r,y:e},{x:60,y:e+n},{x:60+r,y:e+n}],width:r+It}}_maskId(t){return`${this._maskPrefix}-mask-${t}`}_renderCellMask(t,e,s){return Z`
      <mask
        id=${this._maskId(s)}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width=${e.width}
        height=${e.height}
        style="mask-type: luminance;"
      >
        <rect width=${e.width} height=${e.height} fill="white"></rect>
        ${t.slice(s+1).map((t,i)=>{const o=e.positions[s+i+1];return Z`
            <text
              x=${o.x}
              y=${o.y}
              text-anchor="middle"
              class="mask-digit"
              stroke-width=${2*this._config.gap}
              xml:space="preserve"
            >${t.char}</text>
          `})}
      </mask>
    `}_renderCells(t,e){const s=this._config.gap>0;return Z`
      ${s?Z`<defs>${t.map((s,i)=>this._renderCellMask(t,e,i))}</defs>`:X}
      ${t.map((t,i)=>Z`
          <text
            x=${e.positions[i].x}
            y=${e.positions[i].y}
            text-anchor="middle"
            class="digit"
            fill=${t.color}
            mask=${bt(s?`url(#${this._maskId(i)})`:void 0)}
            xml:space="preserve"
          >${t.char}</text>
        `)}
    `}_renderNaturalLine(t,e,s){const i=this._colors(),o=this._config.font_weight,r=this._config.separator_spacing,n=Math.max(0,this._config.horizontal_spacing),a=this._config.show_separator,[c,l]=Jt(this._fontFamily,o,t[0]+t[1]),[h,d]=Jt(this._fontFamily,o,t[2]+t[3]),u=a?Jt(this._fontFamily,o,this._config.separator).reduce((t,e)=>t+e,0):0,p=[];let _=0;return p.push({char:t[0],fill:i[0],x:_+c/2,y:e}),_+=c+n,p.push({char:t[1],fill:i[1],x:_+l/2,y:e}),_+=l,a?(_+=r,p.push({char:this._config.separator,fill:this._config.separator_color,x:_+u/2,y:e+s}),_+=u+r):_+=n,p.push({char:t[2],fill:i[2],x:_+h/2,y:e}),_+=h+n,p.push({char:t[3],fill:i[3],x:_+d/2,y:e}),Z`
      <text class="digit">
        ${p.map(t=>Z`
            <tspan x=${t.x} y=${t.y} text-anchor="middle" fill=${t.fill} xml:space="preserve">${t.char}</tspan>
          `)}
      </text>
    `}_renderNaturalStacked(t,e,s,i){const o=this._colors(),r=e-i+s,n=this._config.gap>0;return Z`
      ${n?Z`
            <defs>
              <mask
                id=${this._maskId(0)}
                maskUnits="userSpaceOnUse"
                x=${this._naturalX}
                y="0"
                width=${this._naturalWidth}
                height=${e}
                style="mask-type: luminance;"
              >
                <rect x=${this._naturalX} width=${this._naturalWidth} height=${e} fill="white"></rect>
                <text
                  x=${0}
                  y=${r}
                  text-anchor="middle"
                  class="mask-digit"
                  stroke-width=${2*this._config.gap}
                >${t[2]}${t[3]}</text>
              </mask>
            </defs>
          `:X}
      <text
        x=${0}
        y=${s}
        text-anchor="middle"
        class="digit"
        mask=${bt(n?`url(#${this._maskId(0)})`:void 0)}
      ><tspan fill=${o[0]}>${t[0]}</tspan><tspan fill=${o[1]}>${t[1]}</tspan></text>
      <text x=${0} y=${r} text-anchor="middle" class="digit">
        <tspan fill=${o[2]}>${t[2]}</tspan><tspan fill=${o[3]}>${t[3]}</tspan>
      </text>
    `}_resetMeasureBudget(){this._measureBudget=5}_rowMetrics(t){const e=t?Wt+t:Wt,{ascent:s,descent:i}=((t,e,s)=>{const i=`${Kt(t,e)}|${s}`,o=Xt.get(i);if(o)return o;const r=Zt();if(!r||!s)return qt;r.font=Kt(t,e);let n=0,a=0;for(const t of s){const e=r.measureText(t);n=Math.max(n,e.actualBoundingBoxAscent),a=Math.max(a,e.actualBoundingBoxDescent)}if(n<=0&&a<=0)return qt;const c={ascent:n,descent:a};return Xt.set(i,c),c})(this._fontFamily,this._config.font_weight,e);return{baseline:s,rowHeight:s+i}}_rowsHeight(t){return"stacked"===this._config.layout?2*t+this._config.vertical_spacing:t}_scheduleTick(){this._clearTimer();const t=new Date;this._now=t,this._resetMeasureBudget();const e=1e3*(60-t.getSeconds())-t.getMilliseconds();this._timer=window.setTimeout(()=>{this._scheduleTick()},Math.max(e,1e3))}_timeZone(){return this._config.time_zone||this.hass?.config?.time_zone}_useAmPm(){return((t,s)=>{if(t===e.language||t===e.system){const i=t===e.language?s:void 0;return new Date("January 1, 2023 22:00:00").toLocaleString(i).includes("10")}return t===e.am_pm})(this._config.time_format||this.hass?.locale?.time_format||e.language,this.hass?.locale?.language)}}zt([mt({attribute:!1})],te.prototype,"hass"),zt([ft()],te.prototype,"_config"),zt([ft()],te.prototype,"_metricsReady"),zt([ft()],te.prototype,"_naturalWidth"),zt([ft()],te.prototype,"_naturalX"),zt([ft()],te.prototype,"_now"),customElements.get("custom-clock-card")||customElements.define("custom-clock-card",te);var ee=Object.defineProperty,se=(t,e,s,i)=>{for(var o,r=void 0,n=t.length-1;n>=0;n--)(o=t[n])&&(r=o(e,s,r)||r);return r&&ee(e,s,r),r};const ie={color_1:"Digit 1 color",color_2:"Digit 2 color",color_3:"Digit 3 color",color_4:"Digit 4 color",color_rgb:"Digits color",font_family:"Font family",font_url:"Font URL",font_weight:"Font weight",gap:"Transparent gap",horizontal_spacing:"Horizontal spacing",individual_colors:"Use individual colors",layout:"Layout",natural_width:"Natural character widths",no_background:"No background",padding:"Card padding",scale:"Scale",separator:"Separator character",separator_offset:"Separator vertical offset",separator_rgb:"Separator color",separator_spacing:"Separator spacing",show_separator:"Show separator",time_format:"Time format",time_zone:"Time zone",vertical_spacing:"Vertical spacing"},oe=t=>ie[t.name]??t.name,re=t=>{let e=t.replace("#","");3===e.length&&(e=e.split("").map(t=>t+t).join(""));const s=Number.parseInt(e,16);return Number.isNaN(s)||6!==e.length?[255,255,255]:[s>>16&255,s>>8&255,255&s]},ne=t=>{if(!t||3!==t.length)return;return`#${t.map(t=>Ct(Math.round(t),0,255).toString(16).padStart(2,"0")).join("")}`};class ae extends dt{constructor(){super(...arguments),this._config=Ut(),this._explicitKeys=new Set}setConfig(t){this._explicitKeys=new Set(Object.keys(t)),this._config={...St,...t,colors:Pt(t.colors),type:t.type||"custom:custom-clock-card"}}render(){const[t,e,s,i]=Pt(this._config.colors).map(re),o={...this._config,color_1:t,color_2:e,color_3:s,color_4:i,color_rgb:re(this._config.color||St.color),separator_rgb:re(this._config.separator_color||St.separator_color),time_format:this._config.time_format||"default"};return V`
      <ha-form
        .hass=${this.hass}
        .data=${o}
        .schema=${(({individualColors:t,layout:e,natural:s,showSeparator:i})=>[{name:"layout",selector:{select:{mode:"dropdown",options:[{label:"Grid",value:"stacked"},{label:"Line",value:"line"}]}}},{name:"time_format",required:!0,selector:{select:{mode:"dropdown",options:[{label:"Use user settings",value:"default"},{label:"Auto (use language setting)",value:"language"},{label:"Use system locale",value:"system"},{label:"12 hours (AM/PM)",value:"12"},{label:"24 hours",value:"24"}]}}},{name:"time_zone",required:!0,selector:{timezone:{}}},{name:"no_background",selector:{boolean:{}}},..."line"===e?[{expanded:!1,flatten:!0,icon:"mdi:dots-horizontal",name:"separator_section",schema:[{name:"show_separator",selector:{boolean:{}}},...i?[{name:"separator",required:!0,selector:{text:{}}},{name:"separator_rgb",selector:{color_rgb:{}}},{name:"separator_spacing",selector:{number:{...Et.separator_spacing,mode:"slider",step:1,unit_of_measurement:"px"}}},{name:"separator_offset",selector:{number:{...Et.separator_offset,mode:"slider",step:1,unit_of_measurement:"px"}}}]:[]],title:"Separator",type:"expandable"}]:[],{expanded:!1,flatten:!0,icon:"mdi:format-font",name:"font_section",schema:[{name:"font_family",required:!0,selector:{text:{}}},{name:"font_url",required:!0,selector:{text:{}}},{name:"font_weight",selector:{number:{...Et.font_weight,mode:"slider",step:50}}}],title:"Font",type:"expandable"},{expanded:!1,flatten:!0,icon:"mdi:palette",name:"colors_section",schema:[{name:"individual_colors",selector:{boolean:{}}},...t?[{name:"",schema:[{name:"color_1",selector:{color_rgb:{}}},{name:"color_2",selector:{color_rgb:{}}},{name:"color_3",selector:{color_rgb:{}}},{name:"color_4",selector:{color_rgb:{}}}],type:"grid"}]:[{name:"color_rgb",selector:{color_rgb:{}}}]],title:"Colors",type:"expandable"},{expanded:!1,flatten:!0,icon:"mdi:arrow-expand-horizontal",name:"size_section",schema:[{name:"natural_width",selector:{boolean:{}}},...s&&"line"===e?[]:[{name:"gap",selector:{number:{...Et.gap,mode:"slider",step:1,unit_of_measurement:"px"}}}],...s&&"stacked"===e?[]:[{name:"horizontal_spacing",selector:{number:{...Et.horizontal_spacing,min:s?0:Et.horizontal_spacing.min,mode:"slider",step:1,unit_of_measurement:"px"}}}],..."stacked"===e?[{name:"vertical_spacing",selector:{number:{...Et.vertical_spacing,mode:"slider",step:1,unit_of_measurement:"px"}}}]:[],{name:"padding",selector:{number:{...Et.padding,mode:"slider",step:1,unit_of_measurement:"px"}}},{name:"scale",selector:{number:{...Et.scale,mode:"slider",step:.05,unit_of_measurement:"×"}}}],title:"Size & spacing",type:"expandable"}])({individualColors:!0===this._config.individual_colors,layout:"line"===this._config.layout?"line":"stacked",natural:!0===this._config.natural_width,showSeparator:!1!==this._config.show_separator})}
        .computeLabel=${oe}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}_valueChanged(t){t.stopPropagation();const{color_1:e,color_2:s,color_3:i,color_4:o,color_rgb:r,separator_rgb:n,...a}=t.detail.value,c=this._config,l=Pt(c.colors),h=[e,s,i,o].map((t,e)=>ne(t)??l[e]),d={...c,...a,color:ne(r)??c.color??St.color,colors:h,layout:Tt(a.layout),separator_color:ne(n)??c.separator_color??St.separator_color,time_format:Ot(a.time_format)};for(const t of Object.keys(d)){if("type"===t)continue;("colors"===t?!d.colors.every((t,e)=>t===l[e]):d[t]!==c[t])&&this._explicitKeys.add(t)}this._config=d,((t,e,s,i)=>{i=i||{},s=null==s?{}:s;const o=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});o.detail=s,t.dispatchEvent(o)})(this,"config-changed",{config:Nt(this._config,this._explicitKeys)})}}se([mt({attribute:!1})],ae.prototype,"hass"),se([ft()],ae.prototype,"_config"),customElements.get("custom-clock-card-editor")||customElements.define("custom-clock-card-editor",ae);var ce=Object.freeze({__proto__:null,CustomClockCardEditor:ae});export{te as CustomClockCard};
