import{a3 as $,an as x,V as k,Y as m,Q as I,ao as _,a2 as f,ap as W,ae as B,W as A,_ as P,U as g,$ as O,M as T,aj as H,ak as F,G,H as V,J as d,T as j,K as L,ac as K}from"./index-CrjmnEeE.js";import{o as b,r as h,c as Y}from"./if-defined-Dr4zPP72.js";import"./index-BJn5W0e4.js";import"./index-C-tBkFDr.js";import"./index-D-zxq6DA.js";import"./index-CV9ldt-_.js";import"./index-Bvg3kdD5.js";import"./index-C2S5cRQi.js";import"./index-C7VHayA7.js";import"./index-DfXjOv4G.js";import"./index-C63O7_qW.js";const r={INVALID_PAYMENT_CONFIG:"INVALID_PAYMENT_CONFIG",INVALID_RECIPIENT:"INVALID_RECIPIENT",INVALID_ASSET:"INVALID_ASSET",INVALID_AMOUNT:"INVALID_AMOUNT",UNKNOWN_ERROR:"UNKNOWN_ERROR",UNABLE_TO_INITIATE_PAYMENT:"UNABLE_TO_INITIATE_PAYMENT",INVALID_CHAIN_NAMESPACE:"INVALID_CHAIN_NAMESPACE",GENERIC_PAYMENT_ERROR:"GENERIC_PAYMENT_ERROR",UNABLE_TO_GET_EXCHANGES:"UNABLE_TO_GET_EXCHANGES",ASSET_NOT_SUPPORTED:"ASSET_NOT_SUPPORTED",UNABLE_TO_GET_PAY_URL:"UNABLE_TO_GET_PAY_URL",UNABLE_TO_GET_BUY_STATUS:"UNABLE_TO_GET_BUY_STATUS"},E={[r.INVALID_PAYMENT_CONFIG]:"Invalid payment configuration",[r.INVALID_RECIPIENT]:"Invalid recipient address",[r.INVALID_ASSET]:"Invalid asset specified",[r.INVALID_AMOUNT]:"Invalid payment amount",[r.UNKNOWN_ERROR]:"Unknown payment error occurred",[r.UNABLE_TO_INITIATE_PAYMENT]:"Unable to initiate payment",[r.INVALID_CHAIN_NAMESPACE]:"Invalid chain namespace",[r.GENERIC_PAYMENT_ERROR]:"Unable to process payment",[r.UNABLE_TO_GET_EXCHANGES]:"Unable to get exchanges",[r.ASSET_NOT_SUPPORTED]:"Asset not supported by the selected exchange",[r.UNABLE_TO_GET_PAY_URL]:"Unable to get payment URL",[r.UNABLE_TO_GET_BUY_STATUS]:"Unable to get buy status"};class c extends Error{get message(){return E[this.code]}constructor(e,a){super(E[e]),this.name="AppKitPayError",this.code=e,this.details=a,Error.captureStackTrace&&Error.captureStackTrace(this,c)}}const z="https://rpc.walletconnect.org/v1/json-rpc";class q extends Error{}function X(){const n=$.getSnapshot().projectId;return`${z}?projectId=${n}`}async function U(n,e){const a=X(),i=await(await fetch(a,{method:"POST",body:JSON.stringify({jsonrpc:"2.0",id:1,method:n,params:e}),headers:{"Content-Type":"application/json"}})).json();if(i.error)throw new q(i.error.message);return i}async function M(n){return(await U("reown_getExchanges",n)).result}async function J(n){return(await U("reown_getExchangePayUrl",n)).result}async function Q(n){return(await U("reown_getExchangeBuyStatus",n)).result}const Z=["eip155","solana"],ee={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};function v(n,e){const{chainNamespace:a,chainId:s}=x.parseCaipNetworkId(n),o=ee[a];if(!o)throw new Error(`Unsupported chain namespace for CAIP-19 formatting: ${a}`);let i=o.native.assetNamespace,l=o.native.assetReference;return e!=="native"&&(i=o.defaultTokenNamespace,l=e),`${`${a}:${s}`}/${i}:${l}`}function te(n){const{chainNamespace:e}=x.parseCaipNetworkId(n);return Z.includes(e)}async function ne(n){const{paymentAssetNetwork:e,activeCaipNetwork:a,approvedCaipNetworkIds:s,requestedCaipNetworks:o}=n,l=k.sortRequestedNetworks(s,o).find(S=>S.caipNetworkId===e);if(!l)throw new c(r.INVALID_PAYMENT_CONFIG);if(l.caipNetworkId===a.caipNetworkId)return;const p=m.getNetworkProp("supportsAllNetworks",l.chainNamespace);if(!(s?.includes(l.caipNetworkId)||p))throw new c(r.INVALID_PAYMENT_CONFIG);try{await m.switchActiveNetwork(l)}catch(S){throw new c(r.GENERIC_PAYMENT_ERROR,S)}}async function ae(n,e,a){if(e!==I.CHAIN.EVM)throw new c(r.INVALID_CHAIN_NAMESPACE);if(!a.fromAddress)throw new c(r.INVALID_PAYMENT_CONFIG,"fromAddress is required for native EVM payments.");const s=typeof a.amount=="string"?parseFloat(a.amount):a.amount;if(isNaN(s))throw new c(r.INVALID_PAYMENT_CONFIG);const o=n.metadata?.decimals??18,i=f.parseUnits(s.toString(),o);if(typeof i!="bigint")throw new c(r.GENERIC_PAYMENT_ERROR);return await f.sendTransaction({chainNamespace:e,to:a.recipient,address:a.fromAddress,value:i,data:"0x"})??void 0}async function se(n,e){if(!e.fromAddress)throw new c(r.INVALID_PAYMENT_CONFIG,"fromAddress is required for ERC20 EVM payments.");const a=n.asset,s=e.recipient,o=Number(n.metadata.decimals),i=f.parseUnits(e.amount.toString(),o);if(i===void 0)throw new c(r.GENERIC_PAYMENT_ERROR);return await f.writeContract({fromAddress:e.fromAddress,tokenAddress:a,args:[s,i],method:"transfer",abi:W.getERC20Abi(a),chainNamespace:I.CHAIN.EVM})??void 0}async function re(n,e){if(n!==I.CHAIN.SOLANA)throw new c(r.INVALID_CHAIN_NAMESPACE);if(!e.fromAddress)throw new c(r.INVALID_PAYMENT_CONFIG,"fromAddress is required for Solana payments.");const a=typeof e.amount=="string"?parseFloat(e.amount):e.amount;if(isNaN(a)||a<=0)throw new c(r.INVALID_PAYMENT_CONFIG,"Invalid payment amount.");try{if(!_.getProvider(n))throw new c(r.GENERIC_PAYMENT_ERROR,"No Solana provider available.");const o=await f.sendTransaction({chainNamespace:I.CHAIN.SOLANA,to:e.recipient,value:a,tokenMint:e.tokenMint});if(!o)throw new c(r.GENERIC_PAYMENT_ERROR,"Transaction failed.");return o}catch(s){throw s instanceof c?s:new c(r.GENERIC_PAYMENT_ERROR,`Solana payment failed: ${s}`)}}const D=0,R="unknown",t=B({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0}),u={state:t,subscribe(n){return F(t,()=>n(t))},subscribeKey(n,e){return H(t,n,e)},async handleOpenPay(n){this.resetState(),this.setPaymentConfig(n),this.subscribeEvents(),this.initializeAnalytics(),t.isConfigured=!0,A.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:t.exchanges,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount}}}),await T.open({view:"Pay"})},resetState(){t.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},t.recipient="0x0",t.amount=0,t.isConfigured=!1,t.error=null,t.isPaymentInProgress=!1,t.isLoading=!1,t.currentPayment=void 0},setPaymentConfig(n){if(!n.paymentAsset)throw new c(r.INVALID_PAYMENT_CONFIG);try{t.paymentAsset=n.paymentAsset,t.recipient=n.recipient,t.amount=n.amount,t.openInNewTab=n.openInNewTab??!0,t.redirectUrl=n.redirectUrl,t.payWithExchange=n.payWithExchange,t.error=null}catch(e){throw new c(r.INVALID_PAYMENT_CONFIG,e.message)}},getPaymentAsset(){return t.paymentAsset},getExchanges(){return t.exchanges},async fetchExchanges(){try{t.isLoading=!0;const n=await M({page:D,asset:v(t.paymentAsset.network,t.paymentAsset.asset),amount:t.amount.toString()});t.exchanges=n.exchanges.slice(0,2)}catch{throw P.showError(E.UNABLE_TO_GET_EXCHANGES),new c(r.UNABLE_TO_GET_EXCHANGES)}finally{t.isLoading=!1}},async getAvailableExchanges(n){try{const e=n?.asset&&n?.network?v(n.network,n.asset):void 0;return await M({page:n?.page??D,asset:e,amount:n?.amount?.toString()})}catch{throw new c(r.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(n,e,a=!1){try{const s=Number(e.amount),o=await J({exchangeId:n,asset:v(e.network,e.asset),amount:s.toString(),recipient:`${e.network}:${e.recipient}`});return A.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{exchange:{id:n},configuration:{network:e.network,asset:e.asset,recipient:e.recipient,amount:s},currentPayment:{type:"exchange",exchangeId:n},headless:a}}),a&&(this.initiatePayment(),A.sendEvent({type:"track",event:"PAY_INITIATED",properties:{paymentId:t.paymentId||R,configuration:{network:e.network,asset:e.asset,recipient:e.recipient,amount:s},currentPayment:{type:"exchange",exchangeId:n}}})),o}catch(s){throw s instanceof Error&&s.message.includes("is not supported")?new c(r.ASSET_NOT_SUPPORTED):new Error(s.message)}},async openPayUrl(n,e,a=!1){try{const s=await this.getPayUrl(n.exchangeId,e,a);if(!s)throw new c(r.UNABLE_TO_GET_PAY_URL);const i=n.openInNewTab??!0?"_blank":"_self";return k.openHref(s.url,i),s}catch(s){throw s instanceof c?t.error=s.message:t.error=E.GENERIC_PAYMENT_ERROR,new c(r.UNABLE_TO_GET_PAY_URL)}},subscribeEvents(){t.isConfigured||(_.subscribeProviders(async n=>{_.getProvider(m.state.activeChain)&&await this.handlePayment()}),g.subscribeKey("caipAddress",async n=>{n&&await this.handlePayment()}))},async handlePayment(){t.currentPayment={type:"wallet",status:"IN_PROGRESS"};const n=g.state.caipAddress;if(!n)return;const{chainId:e,address:a}=x.parseCaipAddress(n),s=m.state.activeChain;if(!a||!e||!s||!_.getProvider(s))return;const i=m.state.activeCaipNetwork;if(i&&!t.isPaymentInProgress)try{this.initiatePayment();const l=m.getAllRequestedCaipNetworks(),p=m.getAllApprovedCaipNetworkIds();switch(await ne({paymentAssetNetwork:t.paymentAsset.network,activeCaipNetwork:i,approvedCaipNetworkIds:p,requestedCaipNetworks:l}),await T.open({view:"PayLoading"}),s){case I.CHAIN.EVM:t.paymentAsset.asset==="native"&&(t.currentPayment.result=await ae(t.paymentAsset,s,{recipient:t.recipient,amount:t.amount,fromAddress:a})),t.paymentAsset.asset.startsWith("0x")&&(t.currentPayment.result=await se(t.paymentAsset,{recipient:t.recipient,amount:t.amount,fromAddress:a})),t.currentPayment.status="SUCCESS";break;case I.CHAIN.SOLANA:t.currentPayment.result=await re(s,{recipient:t.recipient,amount:t.amount,fromAddress:a,tokenMint:t.paymentAsset.asset==="native"?void 0:t.paymentAsset.asset}),t.currentPayment.status="SUCCESS";break;default:throw new c(r.INVALID_CHAIN_NAMESPACE)}}catch(l){l instanceof c?t.error=l.message:t.error=E.GENERIC_PAYMENT_ERROR,t.currentPayment.status="FAILED",P.showError(t.error)}finally{t.isPaymentInProgress=!1}},getExchangeById(n){return t.exchanges.find(e=>e.id===n)},validatePayConfig(n){const{paymentAsset:e,recipient:a,amount:s}=n;if(!e)throw new c(r.INVALID_PAYMENT_CONFIG);if(!a)throw new c(r.INVALID_RECIPIENT);if(!e.asset)throw new c(r.INVALID_ASSET);if(s==null||s<=0)throw new c(r.INVALID_AMOUNT)},handlePayWithWallet(){const n=g.state.caipAddress;if(!n){O.push("Connect");return}const{chainId:e,address:a}=x.parseCaipAddress(n),s=m.state.activeChain;if(!a||!e||!s){O.push("Connect");return}this.handlePayment()},async handlePayWithExchange(n){try{t.currentPayment={type:"exchange",exchangeId:n};const{network:e,asset:a}=t.paymentAsset,s={network:e,asset:a,amount:t.amount,recipient:t.recipient},o=await this.getPayUrl(n,s);if(!o)throw new c(r.UNABLE_TO_INITIATE_PAYMENT);return t.currentPayment.sessionId=o.sessionId,t.currentPayment.status="IN_PROGRESS",t.currentPayment.exchangeId=n,this.initiatePayment(),{url:o.url,openInNewTab:t.openInNewTab}}catch(e){return e instanceof c?t.error=e.message:t.error=E.GENERIC_PAYMENT_ERROR,t.isPaymentInProgress=!1,P.showError(t.error),null}},async getBuyStatus(n,e){try{const a=await Q({sessionId:e,exchangeId:n});return(a.status==="SUCCESS"||a.status==="FAILED")&&A.sendEvent({type:"track",event:a.status==="SUCCESS"?"PAY_SUCCESS":"PAY_ERROR",properties:{paymentId:t.paymentId||R,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount},currentPayment:{type:"exchange",exchangeId:t.currentPayment?.exchangeId,sessionId:t.currentPayment?.sessionId,result:a.txHash}}}),a}catch{throw new c(r.UNABLE_TO_GET_BUY_STATUS)}},async updateBuyStatus(n,e){try{const a=await this.getBuyStatus(n,e);t.currentPayment&&(t.currentPayment.status=a.status,t.currentPayment.result=a.txHash),(a.status==="SUCCESS"||a.status==="FAILED")&&(t.isPaymentInProgress=!1)}catch{throw new c(r.UNABLE_TO_GET_BUY_STATUS)}},initiatePayment(){t.isPaymentInProgress=!0,t.paymentId=crypto.randomUUID()},initializeAnalytics(){t.analyticsSet||(t.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",n=>{if(t.currentPayment?.status&&t.currentPayment.status!=="UNKNOWN"){const e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[t.currentPayment.status];A.sendEvent({type:"track",event:e,properties:{paymentId:t.paymentId||R,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount},currentPayment:{type:t.currentPayment.type,exchangeId:t.currentPayment.exchangeId,sessionId:t.currentPayment.sessionId,result:t.currentPayment.result}}})}}))}},ie=G`
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }

  .token-display {
    padding: var(--wui-spacing-s) var(--wui-spacing-m);
    border-radius: var(--wui-border-radius-s);
    background-color: var(--wui-color-bg-125);
    margin-top: var(--wui-spacing-s);
    margin-bottom: var(--wui-spacing-s);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--wui-spacing-xs);
  }
`;var y=function(n,e,a,s){var o=arguments.length,i=o<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,a):s,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,a,s);else for(var p=n.length-1;p>=0;p--)(l=n[p])&&(i=(o<3?l(i):o>3?l(e,a,i):l(e,a))||i);return o>3&&i&&Object.defineProperty(e,a,i),i};let w=class extends V{constructor(){super(),this.unsubscribe=[],this.amount="",this.tokenSymbol="",this.networkName="",this.exchanges=u.state.exchanges,this.isLoading=u.state.isLoading,this.loadingExchangeId=null,this.connectedWalletInfo=g.state.connectedWalletInfo,this.initializePaymentDetails(),this.unsubscribe.push(u.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(u.subscribeKey("isLoading",e=>this.isLoading=e)),this.unsubscribe.push(g.subscribe(e=>this.connectedWalletInfo=e.connectedWalletInfo)),u.fetchExchanges()}get isWalletConnected(){return g.state.status==="connected"}render(){return d`
      <wui-flex flexDirection="column">
        <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="s">
          ${this.renderPaymentHeader()}

          <wui-flex flexDirection="column" gap="s">
            ${this.renderPayWithWallet()} ${this.renderExchangeOptions()}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}initializePaymentDetails(){const e=u.getPaymentAsset();this.networkName=e.network,this.tokenSymbol=e.metadata.symbol,this.amount=u.state.amount.toString()}renderPayWithWallet(){return te(this.networkName)?d`<wui-flex flexDirection="column" gap="s">
        ${this.isWalletConnected?this.renderConnectedView():this.renderDisconnectedView()}
      </wui-flex>
      <wui-separator text="or"></wui-separator>`:d``}renderPaymentHeader(){let e=this.networkName;if(this.networkName){const s=m.getAllRequestedCaipNetworks().find(o=>o.caipNetworkId===this.networkName);s&&(e=s.name)}return d`
      <wui-flex flexDirection="column" alignItems="center">
        <wui-flex alignItems="center" gap="xs">
          <wui-text variant="large-700" color="fg-100">${this.amount||"0.0000"}</wui-text>
          <wui-flex class="token-display" alignItems="center" gap="xxs">
            <wui-text variant="paragraph-600" color="fg-100">
              ${this.tokenSymbol||"Unknown Asset"}
            </wui-text>
            ${e?d`
                  <wui-text variant="small-500" color="fg-200"> on ${e} </wui-text>
                `:""}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderConnectedView(){const e=this.connectedWalletInfo?.name||"connected wallet";return d`
      <wui-list-item
        @click=${this.onWalletPayment}
        ?chevron=${!0}
        data-testid="wallet-payment-option"
      >
        <wui-flex alignItems="center" gap="s">
          <wui-wallet-image
            size="sm"
            imageSrc=${b(this.connectedWalletInfo?.icon)}
            name=${b(this.connectedWalletInfo?.name)}
          ></wui-wallet-image>
          <wui-text variant="paragraph-500" color="inherit">Pay with ${e}</wui-text>
        </wui-flex>
      </wui-list-item>

      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="disconnect"
        @click=${this.onDisconnect}
        data-testid="disconnect-button"
        ?chevron=${!1}
      >
        <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
      </wui-list-item>
    `}renderDisconnectedView(){return d`<wui-list-item
      variant="icon"
      iconVariant="overlay"
      icon="walletPlaceholder"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="paragraph-500" color="inherit">Pay from wallet</wui-text>
    </wui-list-item>`}renderExchangeOptions(){return this.isLoading?d`<wui-flex justifyContent="center" alignItems="center">
        <wui-spinner size="md"></wui-spinner>
      </wui-flex>`:this.exchanges.length===0?d`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="paragraph-500" color="fg-100">No exchanges available</wui-text>
      </wui-flex>`:this.exchanges.map(e=>d`
        <wui-list-item
          @click=${()=>this.onExchangePayment(e.id)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          ?disabled=${this.loadingExchangeId!==null}
        >
          <wui-flex alignItems="center" gap="s">
            ${this.loadingExchangeId===e.id?d`<wui-loading-spinner color="accent-100" size="md"></wui-loading-spinner>`:d`<wui-wallet-image
                  size="sm"
                  imageSrc=${b(e.imageUrl)}
                  name=${e.name}
                ></wui-wallet-image>`}
            <wui-text flexGrow="1" variant="paragraph-500" color="inherit"
              >Pay with ${e.name} <wui-spinner size="sm" color="fg-200"></wui-spinner
            ></wui-text>
          </wui-flex>
        </wui-list-item>
      `)}onWalletPayment(){u.handlePayWithWallet()}async onExchangePayment(e){try{this.loadingExchangeId=e;const a=await u.handlePayWithExchange(e);a&&(await T.open({view:"PayLoading"}),k.openHref(a.url,a.openInNewTab?"_blank":"_self"))}catch(a){console.error("Failed to pay with exchange",a),P.showError("Failed to pay with exchange")}finally{this.loadingExchangeId=null}}async onDisconnect(e){e.stopPropagation();try{await f.disconnect()}catch{console.error("Failed to disconnect"),P.showError("Failed to disconnect")}}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}};w.styles=ie;y([h()],w.prototype,"amount",void 0);y([h()],w.prototype,"tokenSymbol",void 0);y([h()],w.prototype,"networkName",void 0);y([h()],w.prototype,"exchanges",void 0);y([h()],w.prototype,"isLoading",void 0);y([h()],w.prototype,"loadingExchangeId",void 0);y([h()],w.prototype,"connectedWalletInfo",void 0);w=y([Y("w3m-pay-view")],w);const oe=G`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }
`;var C=function(n,e,a,s){var o=arguments.length,i=o<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,a):s,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,a,s);else for(var p=n.length-1;p>=0;p--)(l=n[p])&&(i=(o<3?l(i):o>3?l(e,a,i):l(e,a))||i);return o>3&&i&&Object.defineProperty(e,a,i),i};const ce=4e3;let N=class extends V{constructor(){super(),this.loadingMessage="",this.subMessage="",this.paymentState="in-progress",this.paymentState=u.state.isPaymentInProgress?"in-progress":"completed",this.updateMessages(),this.setupSubscription(),this.setupExchangeSubscription()}disconnectedCallback(){clearInterval(this.exchangeSubscription)}render(){return d`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center"> ${this.getStateIcon()} </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100">
            ${this.loadingMessage}
          </wui-text>
          <wui-text align="center" variant="small-400" color="fg-200">
            ${this.subMessage}
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}updateMessages(){switch(this.paymentState){case"completed":this.loadingMessage="Payment completed",this.subMessage="Your transaction has been successfully processed";break;case"error":this.loadingMessage="Payment failed",this.subMessage="There was an error processing your transaction";break;case"in-progress":default:u.state.currentPayment?.type==="exchange"?(this.loadingMessage="Payment initiated",this.subMessage="Please complete the payment on the exchange"):(this.loadingMessage="Awaiting payment confirmation",this.subMessage="Please confirm the payment transaction in your wallet");break}}getStateIcon(){switch(this.paymentState){case"completed":return this.successTemplate();case"error":return this.errorTemplate();case"in-progress":default:return this.loaderTemplate()}}setupExchangeSubscription(){u.state.currentPayment?.type==="exchange"&&(this.exchangeSubscription=setInterval(async()=>{const e=u.state.currentPayment?.exchangeId,a=u.state.currentPayment?.sessionId;e&&a&&(await u.updateBuyStatus(e,a),u.state.currentPayment?.status==="SUCCESS"&&clearInterval(this.exchangeSubscription))},ce))}setupSubscription(){u.subscribeKey("isPaymentInProgress",e=>{!e&&this.paymentState==="in-progress"&&(u.state.error||!u.state.currentPayment?.result?this.paymentState="error":this.paymentState="completed",this.updateMessages(),setTimeout(()=>{f.state.status!=="disconnected"&&T.close()},3e3))}),u.subscribeKey("error",e=>{e&&this.paymentState==="in-progress"&&(this.paymentState="error",this.updateMessages())})}loaderTemplate(){const e=j.state.themeVariables["--w3m-border-radius-master"],a=e?parseInt(e.replace("px",""),10):4,s=this.getPaymentIcon();return d`
      <wui-flex justifyContent="center" alignItems="center" style="position: relative;">
        ${s?d`<wui-wallet-image size="lg" imageSrc=${s}></wui-wallet-image>`:null}
        <wui-loading-thumbnail radius=${a*9}></wui-loading-thumbnail>
      </wui-flex>
    `}getPaymentIcon(){const e=u.state.currentPayment;if(e){if(e.type==="exchange"){const a=e.exchangeId;if(a)return u.getExchangeById(a)?.imageUrl}if(e.type==="wallet"){const a=g.state.connectedWalletInfo?.icon;if(a)return a;const s=m.state.activeChain;if(!s)return;const o=L.getConnectorId(s);if(!o)return;const i=L.getConnectorById(o);return i?K.getConnectorImage(i):void 0}}}successTemplate(){return d`<wui-icon size="xl" color="success-100" name="checkmark"></wui-icon>`}errorTemplate(){return d`<wui-icon size="xl" color="error-100" name="close"></wui-icon>`}};N.styles=oe;C([h()],N.prototype,"loadingMessage",void 0);C([h()],N.prototype,"subMessage",void 0);C([h()],N.prototype,"paymentState",void 0);N=C([Y("w3m-pay-loading-view")],N);async function Pe(n){return u.handleOpenPay(n)}function _e(){return u.getExchanges()}function xe(){return u.state.currentPayment?.result}function Te(){return u.state.error}function Ce(){return u.state.isPaymentInProgress}const Se={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},be={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},ve={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}};export{N as W3mPayLoadingView,w as W3mPayView,Se as baseETH,ve as baseSepoliaETH,be as baseUSDC,_e as getExchanges,Ce as getIsPaymentInProgress,Te as getPayError,xe as getPayResult,Pe as openPay};
