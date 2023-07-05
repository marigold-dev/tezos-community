"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[567],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>f});var o=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function n(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,o)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?n(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,o,r=function(e,t){if(null==e)return{};var a,o,r={},n=Object.keys(e);for(o=0;o<n.length;o++)a=n[o],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(o=0;o<n.length;o++)a=n[o],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=o.createContext({}),p=function(e){var t=o.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},c=function(e){var t=p(e.components);return o.createElement(l.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},g=o.forwardRef((function(e,t){var a=e.components,r=e.mdxType,n=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=p(a),g=r,f=d["".concat(l,".").concat(g)]||d[g]||u[g]||n;return a?o.createElement(f,s(s({ref:t},c),{},{components:a})):o.createElement(f,s({ref:t},c))}));function f(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var n=a.length,s=new Array(n);s[0]=g;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[d]="string"==typeof e?e:r,s[1]=i;for(var p=2;p<n;p++)s[p]=a[p];return o.createElement.apply(null,s)}return o.createElement.apply(null,a)}g.displayName="MDXCreateElement"},560:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>n,metadata:()=>i,toc:()=>p});var o=a(7462),r=(a(7294),a(3905));const n={sidebar_position:6},s="Sign, Reject and Resolve Proposals",i={unversionedId:"sign-reject-and-resolve-proposals",id:"sign-reject-and-resolve-proposals",title:"Sign, Reject and Resolve Proposals",description:"After proposals have been created, their state will represent it on the proposals page sorting by creating time, as the figure shows. Users can click them to see more details.&#x20;",source:"@site/docs/sign-reject-and-resolve-proposals.md",sourceDirName:".",slug:"/sign-reject-and-resolve-proposals",permalink:"/tezos-community/docs/sign-reject-and-resolve-proposals",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/sign-reject-and-resolve-proposals.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"Create Proposals",permalink:"/tezos-community/docs/create-proposals"},next:{title:"Setting",permalink:"/tezos-community/docs/setting"}},l={},p=[{value:'Case: Sign and Resolve Proposal 1 <a href="#4aa78d07-9469-4fbe-9ad8-ca0556852e43" id="4aa78d07-9469-4fbe-9ad8-ca0556852e43"></a>',id:"case-sign-and-resolve-proposal-1-",level:3},{value:'Case: Sign and Resolve Proposal 2 <a href="#abeceeda-381c-46e0-980b-eb8a0323a014" id="abeceeda-381c-46e0-980b-eb8a0323a014"></a>',id:"case-sign-and-resolve-proposal-2-",level:3},{value:'Case: Fail to Resolve Proposal <a href="#544a2e9e-4625-4305-ad56-39bc95ac8f94" id="544a2e9e-4625-4305-ad56-39bc95ac8f94"></a>',id:"case-fail-to-resolve-proposal-",level:3},{value:'Case: Resolve Expired Proposal <a href="#c19b6f64-f1b9-40e8-aadd-088b9eb8883b" id="c19b6f64-f1b9-40e8-aadd-088b9eb8883b"></a>',id:"case-resolve-expired-proposal-",level:3}],c={toc:p},d="wrapper";function u(e){let{components:t,...a}=e;return(0,r.kt)(d,(0,o.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"sign-reject-and-resolve-proposals"},"Sign, Reject and Resolve Proposals"),(0,r.kt)("p",null,"After proposals have been created, their state will represent it on the proposals page sorting by creating time, as the figure shows. Users can click them to see more details."," "),(0,r.kt)("figure",null,(0,r.kt)("img",{src:"../../img/image (59).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("p",null,"We can also interact with the proposals by signing, rejecting, or resolving them based on the conditions of the proposals."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Signing proposals means owners give their approvals"),(0,r.kt)("li",{parentName:"ul"},"Rejecting proposals means owners disagree with the proposals."),(0,r.kt)("li",{parentName:"ul"},"Resolving proposals means owners can",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"execute and archive the proposals if acquiring sufficient approvals."),(0,r.kt)("li",{parentName:"ul"},"archive the proposals if the proposals exceed their duration"),(0,r.kt)("li",{parentName:"ul"},"archive the proposals if the proposals are rejected by most of the owners so they can\u2019t pass the threshold to execute.")))),(0,r.kt)("p",null,"It\u2019s possible to sign (or reject) and resolve at the same time If some conditions are satisfied. After proposals are resolved successfully, they will be archived and presented on the history page. Notice that only the owners of the wallet are permitted to interact with it."),(0,r.kt)("p",null,"The following is using a 2-of-2 TzSafe wallet as an example."),(0,r.kt)("h3",{id:"case-sign-and-resolve-proposal-1-"},"Case: Sign and Resolve Proposal 1 ",(0,r.kt)("a",{href:"#4aa78d07-9469-4fbe-9ad8-ca0556852e43",id:"4aa78d07-9469-4fbe-9ad8-ca0556852e43"})),(0,r.kt)("p",null,"For the whole new proposal, we shall see two buttons for rejecting and signing as above picture. When clicking either button, we shall see a pop-up window for confirming the action as below figure. Clicking Confirm will process the sign action in this case."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:"../../img/image (58).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("p",null,"The stats of the proposal will change to ",(0,r.kt)("inlineCode",{parentName:"p"},"Waiting for signers"),", which means it is pending another owner\u2019s action."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:"../../img/image (21).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("p",null,"Once the proposal accumulates sufficient approvals, we may see a resolve button there. By clicking it, the window will pop up and ask for confirmation."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:"../../img/image (34).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("p",null,"We can double-check the proposal and then click ",(0,r.kt)("inlineCode",{parentName:"p"},"Confirm"),". The proposal should be resolved, executed, and archived on the history page."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:"../../img/image (46).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("h3",{id:"case-sign-and-resolve-proposal-2-"},"Case: Sign and Resolve Proposal 2 ",(0,r.kt)("a",{href:"#abeceeda-381c-46e0-980b-eb8a0323a014",id:"abeceeda-381c-46e0-980b-eb8a0323a014"})),(0,r.kt)("p",null,"The below figure is another example, if looking at the details of proposal 2, another approval is already there. In this case, we can try to sign and resolve the proposal at the same time. First, we click ",(0,r.kt)("inlineCode",{parentName:"p"},"Sign"),"."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:"../../img/image (8).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("p",null,"We should see the trying to resolve option represented on the popped-up windows. We select \u201cyes\u201d and click ",(0,r.kt)("inlineCode",{parentName:"p"},"Confirm")," to resolve the proposal."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:"../../img/image (28).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("h3",{id:"case-fail-to-resolve-proposal-"},"Case: Fail to Resolve Proposal ",(0,r.kt)("a",{href:"#544a2e9e-4625-4305-ad56-39bc95ac8f94",id:"544a2e9e-4625-4305-ad56-39bc95ac8f94"})),(0,r.kt)("p",null,"Sometimes, proposals may be not successfully resolved. For example, the following proposal proposes to transfer an amount that is more than the wallet has. Therefore, if we are trying to resolve the proposal, which can\u2019t be actually resolved, the failed message will be present after clicking ",(0,r.kt)("inlineCode",{parentName:"p"},"Confirm"),"."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:"../../img/image (31).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("figure",null,(0,r.kt)("img",{src:"../../img/image (27).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("p",null,"The error will show as above. We can see more detail there. In this case, the error results from insufficient balance. Either owner can fund more money into the wallet, or reject the proposal."),(0,r.kt)("h3",{id:"case-resolve-expired-proposal-"},"Case: Resolve Expired Proposal ",(0,r.kt)("a",{href:"#c19b6f64-f1b9-40e8-aadd-088b9eb8883b",id:"c19b6f64-f1b9-40e8-aadd-088b9eb8883b"})),(0,r.kt)("p",null,"If none of the owners resolve proposals within the proposal duration, the state of the proposals will become expired. Any owners can click resolved to archive the proposals."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:"../../img/image (20).png",alt:""}),(0,r.kt)("figcaption",null)))}u.isMDXComponent=!0}}]);