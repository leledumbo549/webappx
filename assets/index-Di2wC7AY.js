import{F as ft,G as ht,H as mt,J as v,P as Ot,Y as at,aB as N,V as wt,$ as St,a3 as At,W as Ct,X as Rt,Z as Lt}from"./index-CrjmnEeE.js";import{U as bt,n as _,c as gt,o as Dt,r as rt}from"./if-defined-Dr4zPP72.js";import"./index-C63O7_qW.js";import"./index-2mAFmQBU.js";import"./index-CV9ldt-_.js";import"./index-DWJTKLUb.js";var ct={exports:{}},Nt=ct.exports,Tt;function jt(){return Tt||(Tt=1,function(e,t){(function(i,o){e.exports=o()})(Nt,function(){var i=1e3,o=6e4,c=36e5,n="millisecond",l="second",p="minute",g="hour",m="day",$="week",x="month",E="quarter",I="year",C="date",F="Invalid Date",U=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,Q=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,X={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(d){var a=["th","st","nd","rd"],r=d%100;return"["+d+(a[(r-20)%10]||a[r]||a[0])+"]"}},tt=function(d,a,r){var u=String(d);return!u||u.length>=a?d:""+Array(a+1-u.length).join(r)+d},W={s:tt,z:function(d){var a=-d.utcOffset(),r=Math.abs(a),u=Math.floor(r/60),s=r%60;return(a<=0?"+":"-")+tt(u,2,"0")+":"+tt(s,2,"0")},m:function d(a,r){if(a.date()<r.date())return-d(r,a);var u=12*(r.year()-a.year())+(r.month()-a.month()),s=a.clone().add(u,x),f=r-s<0,h=a.clone().add(u+(f?-1:1),x);return+(-(u+(r-s)/(f?s-h:h-s))||0)},a:function(d){return d<0?Math.ceil(d)||0:Math.floor(d)},p:function(d){return{M:x,y:I,w:$,d:m,D:C,h:g,m:p,s:l,ms:n,Q:E}[d]||String(d||"").toLowerCase().replace(/s$/,"")},u:function(d){return d===void 0}},O="en",S={};S[O]=X;var P="$isDayjsObject",H=function(d){return d instanceof st||!(!d||!d[P])},nt=function d(a,r,u){var s;if(!a)return O;if(typeof a=="string"){var f=a.toLowerCase();S[f]&&(s=f),r&&(S[f]=r,s=f);var h=a.split("-");if(!s&&h.length>1)return d(h[0])}else{var y=a.name;S[y]=a,s=y}return!u&&s&&(O=s),s||!u&&O},D=function(d,a){if(H(d))return d.clone();var r=typeof a=="object"?a:{};return r.date=d,r.args=arguments,new st(r)},w=W;w.l=nt,w.i=H,w.w=function(d,a){return D(d,{locale:a.$L,utc:a.$u,x:a.$x,$offset:a.$offset})};var st=function(){function d(r){this.$L=nt(r.locale,null,!0),this.parse(r),this.$x=this.$x||r.x||{},this[P]=!0}var a=d.prototype;return a.parse=function(r){this.$d=function(u){var s=u.date,f=u.utc;if(s===null)return new Date(NaN);if(w.u(s))return new Date;if(s instanceof Date)return new Date(s);if(typeof s=="string"&&!/Z$/i.test(s)){var h=s.match(U);if(h){var y=h[2]-1||0,b=(h[7]||"0").substring(0,3);return f?new Date(Date.UTC(h[1],y,h[3]||1,h[4]||0,h[5]||0,h[6]||0,b)):new Date(h[1],y,h[3]||1,h[4]||0,h[5]||0,h[6]||0,b)}}return new Date(s)}(r),this.init()},a.init=function(){var r=this.$d;this.$y=r.getFullYear(),this.$M=r.getMonth(),this.$D=r.getDate(),this.$W=r.getDay(),this.$H=r.getHours(),this.$m=r.getMinutes(),this.$s=r.getSeconds(),this.$ms=r.getMilliseconds()},a.$utils=function(){return w},a.isValid=function(){return this.$d.toString()!==F},a.isSame=function(r,u){var s=D(r);return this.startOf(u)<=s&&s<=this.endOf(u)},a.isAfter=function(r,u){return D(r)<this.startOf(u)},a.isBefore=function(r,u){return this.endOf(u)<D(r)},a.$g=function(r,u,s){return w.u(r)?this[u]:this.set(s,r)},a.unix=function(){return Math.floor(this.valueOf()/1e3)},a.valueOf=function(){return this.$d.getTime()},a.startOf=function(r,u){var s=this,f=!!w.u(u)||u,h=w.p(r),y=function(q,A){var B=w.w(s.$u?Date.UTC(s.$y,A,q):new Date(s.$y,A,q),s);return f?B:B.endOf(m)},b=function(q,A){return w.w(s.toDate()[q].apply(s.toDate("s"),(f?[0,0,0,0]:[23,59,59,999]).slice(A)),s)},T=this.$W,M=this.$M,L=this.$D,G="set"+(this.$u?"UTC":"");switch(h){case I:return f?y(1,0):y(31,11);case x:return f?y(1,M):y(0,M+1);case $:var V=this.$locale().weekStart||0,et=(T<V?T+7:T)-V;return y(f?L-et:L+(6-et),M);case m:case C:return b(G+"Hours",0);case g:return b(G+"Minutes",1);case p:return b(G+"Seconds",2);case l:return b(G+"Milliseconds",3);default:return this.clone()}},a.endOf=function(r){return this.startOf(r,!1)},a.$set=function(r,u){var s,f=w.p(r),h="set"+(this.$u?"UTC":""),y=(s={},s[m]=h+"Date",s[C]=h+"Date",s[x]=h+"Month",s[I]=h+"FullYear",s[g]=h+"Hours",s[p]=h+"Minutes",s[l]=h+"Seconds",s[n]=h+"Milliseconds",s)[f],b=f===m?this.$D+(u-this.$W):u;if(f===x||f===I){var T=this.clone().set(C,1);T.$d[y](b),T.init(),this.$d=T.set(C,Math.min(this.$D,T.daysInMonth())).$d}else y&&this.$d[y](b);return this.init(),this},a.set=function(r,u){return this.clone().$set(r,u)},a.get=function(r){return this[w.p(r)]()},a.add=function(r,u){var s,f=this;r=Number(r);var h=w.p(u),y=function(M){var L=D(f);return w.w(L.date(L.date()+Math.round(M*r)),f)};if(h===x)return this.set(x,this.$M+r);if(h===I)return this.set(I,this.$y+r);if(h===m)return y(1);if(h===$)return y(7);var b=(s={},s[p]=o,s[g]=c,s[l]=i,s)[h]||1,T=this.$d.getTime()+r*b;return w.w(T,this)},a.subtract=function(r,u){return this.add(-1*r,u)},a.format=function(r){var u=this,s=this.$locale();if(!this.isValid())return s.invalidDate||F;var f=r||"YYYY-MM-DDTHH:mm:ssZ",h=w.z(this),y=this.$H,b=this.$m,T=this.$M,M=s.weekdays,L=s.months,G=s.meridiem,V=function(A,B,it,ot){return A&&(A[B]||A(u,f))||it[B].slice(0,ot)},et=function(A){return w.s(y%12||12,A,"0")},q=G||function(A,B,it){var ot=A<12?"AM":"PM";return it?ot.toLowerCase():ot};return f.replace(Q,function(A,B){return B||function(it){switch(it){case"YY":return String(u.$y).slice(-2);case"YYYY":return w.s(u.$y,4,"0");case"M":return T+1;case"MM":return w.s(T+1,2,"0");case"MMM":return V(s.monthsShort,T,L,3);case"MMMM":return V(L,T);case"D":return u.$D;case"DD":return w.s(u.$D,2,"0");case"d":return String(u.$W);case"dd":return V(s.weekdaysMin,u.$W,M,2);case"ddd":return V(s.weekdaysShort,u.$W,M,3);case"dddd":return M[u.$W];case"H":return String(y);case"HH":return w.s(y,2,"0");case"h":return et(1);case"hh":return et(2);case"a":return q(y,b,!0);case"A":return q(y,b,!1);case"m":return String(b);case"mm":return w.s(b,2,"0");case"s":return String(u.$s);case"ss":return w.s(u.$s,2,"0");case"SSS":return w.s(u.$ms,3,"0");case"Z":return h}return null}(A)||h.replace(":","")})},a.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},a.diff=function(r,u,s){var f,h=this,y=w.p(u),b=D(r),T=(b.utcOffset()-this.utcOffset())*o,M=this-b,L=function(){return w.m(h,b)};switch(y){case I:f=L()/12;break;case x:f=L();break;case E:f=L()/3;break;case $:f=(M-T)/6048e5;break;case m:f=(M-T)/864e5;break;case g:f=M/c;break;case p:f=M/o;break;case l:f=M/i;break;default:f=M}return s?f:w.a(f)},a.daysInMonth=function(){return this.endOf(x).$D},a.$locale=function(){return S[this.$L]},a.locale=function(r,u){if(!r)return this.$L;var s=this.clone(),f=nt(r,u,!0);return f&&(s.$L=f),s},a.clone=function(){return w.w(this.$d,this)},a.toDate=function(){return new Date(this.valueOf())},a.toJSON=function(){return this.isValid()?this.toISOString():null},a.toISOString=function(){return this.$d.toISOString()},a.toString=function(){return this.$d.toUTCString()},d}(),$t=st.prototype;return D.prototype=$t,[["$ms",n],["$s",l],["$m",p],["$H",g],["$W",m],["$M",x],["$y",I],["$D",C]].forEach(function(d){$t[d[1]]=function(a){return this.$g(a,d[0],d[1])}}),D.extend=function(d,a){return d.$i||(d(a,st,D),d.$i=!0),D},D.locale=nt,D.isDayjs=H,D.unix=function(d){return D(1e3*d)},D.en=S[O],D.Ls=S,D.p={},D})}(ct)),ct.exports}var Ft=jt();const K=ft(Ft);var lt={exports:{}},Yt=lt.exports,_t;function kt(){return _t||(_t=1,function(e,t){(function(i,o){e.exports=o()})(Yt,function(){return{name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(i){var o=["th","st","nd","rd"],c=i%100;return"["+i+(o[(c-20)%10]||o[c]||o[0])+"]"}}})}(lt)),lt.exports}var Bt=kt();const Et=ft(Bt);var dt={exports:{}},Ut=dt.exports,Mt;function Wt(){return Mt||(Mt=1,function(e,t){(function(i,o){e.exports=o()})(Ut,function(){return function(i,o,c){i=i||{};var n=o.prototype,l={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function p(m,$,x,E){return n.fromToBase(m,$,x,E)}c.en.relativeTime=l,n.fromToBase=function(m,$,x,E,I){for(var C,F,U,Q=x.$locale().relativeTime||l,X=i.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],tt=X.length,W=0;W<tt;W+=1){var O=X[W];O.d&&(C=E?c(m).diff(x,O.d,!0):x.diff(m,O.d,!0));var S=(i.rounding||Math.round)(Math.abs(C));if(U=C>0,S<=O.r||!O.r){S<=1&&W>0&&(O=X[W-1]);var P=Q[O.l];I&&(S=I(""+S)),F=typeof P=="string"?P.replace("%d",S):P(S,$,O.l,U);break}}if($)return F;var H=U?Q.future:Q.past;return typeof H=="function"?H(F):H.replace("%s",F)},n.to=function(m,$){return p(m,$,this,!0)},n.from=function(m,$){return p(m,$,this)};var g=function(m){return m.$u?c.utc():c()};n.toNow=function(m){return this.to(g(this),m)},n.fromNow=function(m){return this.from(g(this),m)}}})}(dt)),dt.exports}var Ht=Wt();const Vt=ft(Ht);var pt={exports:{}},qt=pt.exports,It;function zt(){return It||(It=1,function(e,t){(function(i,o){e.exports=o()})(qt,function(){return function(i,o,c){c.updateLocale=function(n,l){var p=c.Ls[n];if(p)return(l?Object.keys(l):[]).forEach(function(g){p[g]=l[g]}),p}}})}(pt)),pt.exports}var Jt=zt();const Pt=ft(Jt);K.extend(Vt);K.extend(Pt);const Gt={...Et,name:"en-web3-modal",relativeTime:{future:"in %s",past:"%s ago",s:"%d sec",m:"1 min",mm:"%d min",h:"1 hr",hh:"%d hrs",d:"1 d",dd:"%d d",M:"1 mo",MM:"%d mo",y:"1 yr",yy:"%d yr"}},Zt=["January","February","March","April","May","June","July","August","September","October","November","December"];K.locale("en-web3-modal",Gt);const yt={getMonthNameByIndex(e){return Zt[e]},getYear(e=new Date().toISOString()){return K(e).year()},getRelativeDateFromNow(e){return K(e).locale("en-web3-modal").fromNow(!0)},formatDate(e,t="DD MMM"){return K(e).format(t)}},Kt=3,Qt=["receive","deposit","borrow","claim"],Xt=["withdraw","repay","burn"],Z={getTransactionGroupTitle(e,t){const i=yt.getYear(),o=yt.getMonthNameByIndex(t);return e===i?o:`${o} ${e}`},getTransactionImages(e){const[t,i]=e,o=!!t&&e?.every(l=>!!l.nft_info),c=e?.length>1;return e?.length===2&&!o?[this.getTransactionImage(i),this.getTransactionImage(t)]:c?e.map(l=>this.getTransactionImage(l)):[this.getTransactionImage(t)]},getTransactionImage(e){return{type:Z.getTransactionTransferTokenType(e),url:Z.getTransactionImageURL(e)}},getTransactionImageURL(e){let t;const i=!!e?.nft_info,o=!!e?.fungible_info;return e&&i?t=e?.nft_info?.content?.preview?.url:e&&o&&(t=e?.fungible_info?.icon?.url),t},getTransactionTransferTokenType(e){if(e?.fungible_info)return"FUNGIBLE";if(e?.nft_info)return"NFT"},getTransactionDescriptions(e){const t=e?.metadata?.operationType,i=e?.transfers,o=e?.transfers?.length>0,c=e?.transfers?.length>1,n=o&&i?.every(x=>!!x?.fungible_info),[l,p]=i;let g=this.getTransferDescription(l),m=this.getTransferDescription(p);if(!o)return(t==="send"||t==="receive")&&n?(g=bt.getTruncateString({string:e?.metadata.sentFrom,charsStart:4,charsEnd:6,truncate:"middle"}),m=bt.getTruncateString({string:e?.metadata.sentTo,charsStart:4,charsEnd:6,truncate:"middle"}),[g,m]):[e.metadata.status];if(c)return i.map(x=>this.getTransferDescription(x)).reverse();let $="";return Qt.includes(t)?$="+":Xt.includes(t)&&($="-"),g=$.concat(g),[g]},getTransferDescription(e){let t="";return e&&(e?.nft_info?t=e?.nft_info?.name||"-":e?.fungible_info&&(t=this.getFungibleTransferDescription(e)||"-")),t},getFungibleTransferDescription(e){return e?[this.getQuantityFixedValue(e?.quantity.numeric),e?.fungible_info?.symbol].join(" ").trim():null},getQuantityFixedValue(e){return e?parseFloat(e).toFixed(Kt):null}};var xt;(function(e){e.approve="approved",e.bought="bought",e.borrow="borrowed",e.burn="burnt",e.cancel="canceled",e.claim="claimed",e.deploy="deployed",e.deposit="deposited",e.execute="executed",e.mint="minted",e.receive="received",e.repay="repaid",e.send="sent",e.sell="sold",e.stake="staked",e.trade="swapped",e.unstake="unstaked",e.withdraw="withdrawn"})(xt||(xt={}));const te=ht`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-gray-glass-005);
  }

  :host > wui-flex wui-image {
    display: block;
  }

  :host > wui-flex,
  :host > wui-flex wui-image,
  .swap-images-container,
  .swap-images-container.nft,
  wui-image.nft {
    border-top-left-radius: var(--local-left-border-radius);
    border-top-right-radius: var(--local-right-border-radius);
    border-bottom-left-radius: var(--local-left-border-radius);
    border-bottom-right-radius: var(--local-right-border-radius);
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }

  wui-icon-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
  }

  .swap-images-container {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .swap-images-container wui-image:first-child {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0%;
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-images-container wui-image:last-child {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }
`;var z=function(e,t,i,o){var c=arguments.length,n=c<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,o);else for(var p=e.length-1;p>=0;p--)(l=e[p])&&(n=(c<3?l(n):c>3?l(t,i,n):l(t,i))||n);return c>3&&n&&Object.defineProperty(t,i,n),n};let Y=class extends mt{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""}}render(){const[t,i]=this.images,o=t?.type==="NFT",c=i?.url?i.type==="NFT":o,n=o?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)",l=c?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)";return this.style.cssText=`
    --local-left-border-radius: ${n};
    --local-right-border-radius: ${l};
    `,v`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){const[t,i]=this.images,o=t?.type;return this.images.length===2&&(t?.url||i?.url)?v`<div class="swap-images-container">
        ${t?.url?v`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:null}
        ${i?.url?v`<wui-image src=${i.url} alt="Transaction image"></wui-image>`:null}
      </div>`:t?.url?v`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:o==="NFT"?v`<wui-icon size="inherit" color="fg-200" name="nftPlaceholder"></wui-icon>`:v`<wui-icon size="inherit" color="fg-200" name="coinPlaceholder"></wui-icon>`}templateIcon(){let t="accent-100",i;return i=this.getIcon(),this.status&&(t=this.getStatusColor()),i?v`
      <wui-icon-box
        size="xxs"
        iconColor=${t}
        backgroundColor=${t}
        background="opaque"
        icon=${i}
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
    `:null}getDirectionIcon(){switch(this.direction){case"in":return"arrowBottom";case"out":return"arrowTop";default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():this.type==="trade"?"swapHorizontalBold":this.type==="approve"?"checkmark":this.type==="cancel"?"close":this.getDirectionIcon()}getStatusColor(){switch(this.status){case"confirmed":return"success-100";case"failed":return"error-100";case"pending":return"inverse-100";default:return"accent-100"}}};Y.styles=[te];z([_()],Y.prototype,"type",void 0);z([_()],Y.prototype,"status",void 0);z([_()],Y.prototype,"direction",void 0);z([_({type:Boolean})],Y.prototype,"onlyDirectionIcon",void 0);z([_({type:Array})],Y.prototype,"images",void 0);z([_({type:Object})],Y.prototype,"secondImage",void 0);Y=z([gt("wui-transaction-visual")],Y);const ee=ht`
  :host > wui-flex:first-child {
    align-items: center;
    column-gap: var(--wui-spacing-s);
    padding: 6.5px var(--wui-spacing-xs) 6.5px var(--wui-spacing-xs);
    width: 100%;
  }

  :host > wui-flex:first-child wui-text:nth-child(1) {
    text-transform: capitalize;
  }

  wui-transaction-visual {
    width: 40px;
    height: 40px;
  }

  wui-flex {
    flex: 1;
  }

  :host wui-flex wui-flex {
    overflow: hidden;
  }

  :host .description-container wui-text span {
    word-break: break-all;
  }

  :host .description-container wui-text {
    overflow: hidden;
  }

  :host .description-separator-icon {
    margin: 0px 6px;
  }

  :host wui-text > span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;var j=function(e,t,i,o){var c=arguments.length,n=c<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,o);else for(var p=e.length-1;p>=0;p--)(l=e[p])&&(n=(c<3?l(n):c>3?l(t,i,n):l(t,i))||n);return c>3&&n&&Object.defineProperty(t,i,n),n};let R=class extends mt{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[],this.price=[],this.amount=[],this.symbol=[]}render(){return v`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${Dt(this.direction)}
          type=${this.type}
          onlyDirectionIcon=${Dt(this.onlyDirectionIcon)}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="3xs">
          <wui-text variant="paragraph-600" color="fg-100">
            ${xt[this.type]||this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="micro-700" color="fg-300"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){const t=this.descriptions?.[0];return t?v`
          <wui-text variant="small-500" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `:null}templateSecondDescription(){const t=this.descriptions?.[1];return t?v`
          <wui-icon class="description-separator-icon" size="xxs" name="arrowRight"></wui-icon>
          <wui-text variant="small-400" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `:null}};R.styles=[Ot,ee];j([_()],R.prototype,"type",void 0);j([_({type:Array})],R.prototype,"descriptions",void 0);j([_()],R.prototype,"date",void 0);j([_({type:Boolean})],R.prototype,"onlyDirectionIcon",void 0);j([_()],R.prototype,"status",void 0);j([_()],R.prototype,"direction",void 0);j([_({type:Array})],R.prototype,"images",void 0);j([_({type:Array})],R.prototype,"price",void 0);j([_({type:Array})],R.prototype,"amount",void 0);j([_({type:Array})],R.prototype,"symbol",void 0);R=j([gt("wui-transaction-list-item")],R);const ie=ht`
  :host > wui-flex:first-child {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`;var re=function(e,t,i,o){var c=arguments.length,n=c<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,o);else for(var p=e.length-1;p>=0;p--)(l=e[p])&&(n=(c<3?l(n):c>3?l(t,i,n):l(t,i))||n);return c>3&&n&&Object.defineProperty(t,i,n),n};let vt=class extends mt{render(){return v`
      <wui-flex alignItems="center">
        <wui-shimmer width="40px" height="40px"></wui-shimmer>
        <wui-flex flexDirection="column" gap="2xs">
          <wui-shimmer width="72px" height="16px" borderRadius="4xs"></wui-shimmer>
          <wui-shimmer width="148px" height="14px" borderRadius="4xs"></wui-shimmer>
        </wui-flex>
        <wui-shimmer width="24px" height="12px" borderRadius="5xs"></wui-shimmer>
      </wui-flex>
    `}};vt.styles=[Ot,ie];vt=re([gt("wui-transaction-list-item-loader")],vt);const ne=ht`
  :host {
    min-height: 100%;
  }

  .group-container[last-group='true'] {
    padding-bottom: var(--wui-spacing-m);
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
  }

  .contentContainer > .textContent {
    width: 65%;
  }

  .emptyContainer {
    height: 100%;
  }
`;var J=function(e,t,i,o){var c=arguments.length,n=c<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,o);else for(var p=e.length-1;p>=0;p--)(l=e[p])&&(n=(c<3?l(n):c>3?l(t,i,n):l(t,i))||n);return c>3&&n&&Object.defineProperty(t,i,n),n};const ut="last-transaction",se=7;let k=class extends mt{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page="activity",this.caipAddress=at.state.activeCaipAddress,this.transactionsByYear=N.state.transactionsByYear,this.loading=N.state.loading,this.empty=N.state.empty,this.next=N.state.next,N.clearCursor(),this.unsubscribe.push(at.subscribeKey("activeCaipAddress",t=>{t&&this.caipAddress!==t&&(N.resetTransactions(),N.fetchTransactions(t)),this.caipAddress=t}),at.subscribeKey("activeCaipNetwork",()=>{this.updateTransactionView()}),N.subscribe(t=>{this.transactionsByYear=t.transactionsByYear,this.loading=t.loading,this.empty=t.empty,this.next=t.next}))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return v` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){N.resetTransactions(),this.caipAddress&&N.fetchTransactions(wt.getPlainAddress(this.caipAddress))}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map(i=>{const o=parseInt(i,10),c=new Array(12).fill(null).map((n,l)=>{const p=Z.getTransactionGroupTitle(o,l),g=this.transactionsByYear[o]?.[l];return{groupTitle:p,transactions:g}}).filter(({transactions:n})=>n).reverse();return c.map(({groupTitle:n,transactions:l},p)=>{const g=p===c.length-1;return l?v`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${g?"true":"false"}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["xs","s","s","s"]}
            >
              <wui-text variant="paragraph-500" color="fg-200" data-testid="group-title"
                >${n}</wui-text
              >
            </wui-flex>
            <wui-flex flexDirection="column" gap="xs">
              ${this.templateTransactions(l,g)}
            </wui-flex>
          </wui-flex>
        `:null})})}templateRenderTransaction(t,i){const{date:o,descriptions:c,direction:n,isAllNFT:l,images:p,status:g,transfers:m,type:$}=this.getTransactionListItemProps(t),x=m?.length>1;return m?.length===2&&!l?v`
        <wui-transaction-list-item
          date=${o}
          .direction=${n}
          id=${i&&this.next?ut:""}
          status=${g}
          type=${$}
          .images=${p}
          .descriptions=${c}
        ></wui-transaction-list-item>
      `:x?m.map((I,C)=>{const F=Z.getTransferDescription(I),U=i&&C===m.length-1;return v` <wui-transaction-list-item
          date=${o}
          direction=${I.direction}
          id=${U&&this.next?ut:""}
          status=${g}
          type=${$}
          .onlyDirectionIcon=${!0}
          .images=${[p[C]]}
          .descriptions=${[F]}
        ></wui-transaction-list-item>`}):v`
      <wui-transaction-list-item
        date=${o}
        .direction=${n}
        id=${i&&this.next?ut:""}
        status=${g}
        type=${$}
        .images=${p}
        .descriptions=${c}
      ></wui-transaction-list-item>
    `}templateTransactions(t,i){return t.map((o,c)=>{const n=i&&c===t.length-1;return v`${this.templateRenderTransaction(o,n)}`})}emptyStateActivity(){return v`<wui-flex
      class="emptyContainer"
      flexGrow="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      .padding=${["3xl","xl","3xl","xl"]}
      gap="xl"
      data-testid="empty-activity-state"
    >
      <wui-icon-box
        backgroundColor="gray-glass-005"
        background="gray"
        iconColor="fg-200"
        icon="wallet"
        size="lg"
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
      <wui-flex flexDirection="column" alignItems="center" gap="xs">
        <wui-text align="center" variant="paragraph-500" color="fg-100"
          >No Transactions yet</wui-text
        >
        <wui-text align="center" variant="small-500" color="fg-200"
          >Start trading on dApps <br />
          to grow your wallet!</wui-text
        >
      </wui-flex>
    </wui-flex>`}emptyStateAccount(){return v`<wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="l"
      data-testid="empty-account-state"
    >
      <wui-icon-box
        icon="swapHorizontal"
        size="inherit"
        iconColor="fg-200"
        backgroundColor="fg-200"
        iconSize="lg"
      ></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="xs"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100">No activity yet</wui-text>
        <wui-text variant="small-400" align="center" color="fg-200"
          >Your next transactions will appear here</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)}>Trade</wui-link>
    </wui-flex>`}templateEmpty(){return this.page==="account"?v`${this.emptyStateAccount()}`:v`${this.emptyStateActivity()}`}templateLoading(){return this.page==="activity"?Array(se).fill(v` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(t=>t):null}onReceiveClick(){St.push("WalletReceive")}createPaginationObserver(){const{projectId:t}=At.state;this.paginationObserver=new IntersectionObserver(([i])=>{i?.isIntersecting&&!this.loading&&(N.fetchTransactions(wt.getPlainAddress(this.caipAddress)),Ct.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:wt.getPlainAddress(this.caipAddress),projectId:t,cursor:this.next,isSmartAccount:Rt(at.state.activeChain)===Lt.ACCOUNT_TYPES.SMART_ACCOUNT}}))},{}),this.setPaginationObserver()}setPaginationObserver(){this.paginationObserver?.disconnect();const t=this.shadowRoot?.querySelector(`#${ut}`);t&&this.paginationObserver?.observe(t)}getTransactionListItemProps(t){const i=yt.formatDate(t?.metadata?.minedAt),o=Z.getTransactionDescriptions(t),c=t?.transfers,n=t?.transfers?.[0],l=!!n&&t?.transfers?.every(g=>!!g.nft_info),p=Z.getTransactionImages(c);return{date:i,direction:n?.direction,descriptions:o,isAllNFT:l,images:p,status:t.metadata?.status,transfers:c,type:t.metadata?.operationType}}};k.styles=ne;J([_()],k.prototype,"page",void 0);J([rt()],k.prototype,"caipAddress",void 0);J([rt()],k.prototype,"transactionsByYear",void 0);J([rt()],k.prototype,"loading",void 0);J([rt()],k.prototype,"empty",void 0);J([rt()],k.prototype,"next",void 0);k=J([gt("w3m-activity-list")],k);
