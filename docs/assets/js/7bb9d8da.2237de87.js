"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[843],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>h});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),c=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},d="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(a),u=r,h=d["".concat(l,".").concat(u)]||d[u]||f[u]||o;return a?n.createElement(h,i(i({ref:t},p),{},{components:a})):n.createElement(h,i({ref:t},p))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,i=new Array(o);i[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:r,i[1]=s;for(var c=2;c<o;c++)i[c]=a[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},8502:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>f,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var n=a(7462),r=(a(7294),a(3905));const o={sidebar_position:5},i="Create Proposals",s={unversionedId:"create-proposals",id:"create-proposals",title:"Create Proposals",description:"The big difference from the Tezos account, or so-called single-signature account, is that",source:"@site/docs/create-proposals.md",sourceDirName:".",slug:"/create-proposals",permalink:"/tezos-community/docs/create-proposals",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/create-proposals.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Fund wallet",permalink:"/tezos-community/docs/fund-wallet"},next:{title:"Sign, Reject and Resolve Proposals",permalink:"/tezos-community/docs/sign-reject-and-resolve-proposals"}},l={},c=[{value:'Supported Transaction <a href="#a5cb9fb8-9973-4df8-8989-a4ba408d59f3" id="a5cb9fb8-9973-4df8-8989-a4ba408d59f3"></a>',id:"supported-transaction-",level:2},{value:'XTZ <strong>Transfer</strong> <a href="#1aa35605-14f1-4b72-99d8-f00991851324" id="1aa35605-14f1-4b72-99d8-f00991851324"></a>',id:"xtz-transfer-",level:3},{value:"FA1.2 Approve",id:"fa12-approve",level:3},{value:"FA1.2 Transfer",id:"fa12-transfer",level:3},{value:"<strong>FA2 Transfer</strong>",id:"fa2-transfer",level:3},{value:"<strong>Contract Execution</strong>",id:"contract-execution",level:3},{value:"<strong>Batch</strong>",id:"batch",level:3}],p={toc:c},d="wrapper";function f(e){let{components:t,...a}=e;return(0,r.kt)(d,(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"create-proposals"},"Create Proposals"),(0,r.kt)("p",null,"The big difference from the Tezos account, or so-called single-signature account, is that"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The process of creating a proposal is mandatory for every transaction made from the TzSafe wallet."),(0,r.kt)("li",{parentName:"ul"},"batch transactions are allowed in TzSafe wallet.")),(0,r.kt)("p",null,"TzSafe supports the following types of transaction at the moment, with more to be added in the near future."),(0,r.kt)("p",null,"Notice that creating a proposal without any transaction is forbidden."),(0,r.kt)("h2",{id:"supported-transaction-"},"Supported Transaction ",(0,r.kt)("a",{href:"#a5cb9fb8-9973-4df8-8989-a4ba408d59f3",id:"a5cb9fb8-9973-4df8-8989-a4ba408d59f3"})),(0,r.kt)("h3",{id:"xtz-transfer-"},"XTZ ",(0,r.kt)("strong",{parentName:"h3"},"Transfer")," ",(0,r.kt)("a",{href:"#1aa35605-14f1-4b72-99d8-f00991851324",id:"1aa35605-14f1-4b72-99d8-f00991851324"})),(0,r.kt)("p",null,"This transaction allows us to transfer XTZ to the target account, including all ",(0,r.kt)("inlineCode",{parentName:"p"},"tz")," accounts and ",(0,r.kt)("inlineCode",{parentName:"p"},"KT")," accounts, which have a ",(0,r.kt)("inlineCode",{parentName:"p"},"%defaut")," entrypoint with ",(0,r.kt)("inlineCode",{parentName:"p"},"unit")," type."),(0,r.kt)("p",null,"First, click ",(0,r.kt)("inlineCode",{parentName:"p"},"New Proposal")," on the sidebar. Then, click ",(0,r.kt)("inlineCode",{parentName:"p"},"Transfer"),". Filling in the amount and the target address on UI. Before submitting, please double-check the address and transfer amount. Finally, click ",(0,r.kt)("inlineCode",{parentName:"p"},"Submit")," to create our new proposal."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:".././img/image (42).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("p",null,"Note that TzSafe doesn\u2019t validate transferring amount is equal to or greater than the balance while the proposal is being created. The validation only happens when the proposal is executed. In other words, it's possible to fund an insufficient wallet before the proposal is executed."),(0,r.kt)("h3",{id:"fa12-approve"},"FA1.2 Approve"),(0,r.kt)("p",null,"TzSafe provides support for approvals of FA1.2 tokens, allowing users to authorize the spending of tokens."," "),(0,r.kt)("p",null,"To create a new proposal, navigate to the sidebar and click on ",(0,r.kt)("inlineCode",{parentName:"p"},"New Proposal"),". From there, select the option for ",(0,r.kt)("inlineCode",{parentName:"p"},"FA1.2 Approve"),". To grant approval, fill in the desired token and amount and the spender's address. Once the information is filled out, click the ","`","Submit","`"," button to complete the approval proposal."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:".././img/image (23).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("h3",{id:"fa12-transfer"},"FA1.2 Transfer"),(0,r.kt)("p",null,"TzSafe also offers the capability to perform transfers for FA1.2 tokens. To create a new proposal, simply access the sidebar and click on ",(0,r.kt)("inlineCode",{parentName:"p"},"New Proposal"),". Then, select the ",(0,r.kt)("inlineCode",{parentName:"p"},"FA1.2 Transfer")," option from the available choices. Select the desired token, specify the amount, and provide the transfer-to address. Finally, click ",(0,r.kt)("inlineCode",{parentName:"p"},"Submit")," to click a proposal."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:".././img/image (55).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("h3",{id:"fa2-transfer"},(0,r.kt)("strong",{parentName:"h3"},"FA2 Transfer")),(0,r.kt)("p",null,"TzSafe also provides support for transferring FA2 tokens. Currently, it allows for the transfer of multiple tokens within a single transaction, but with the restriction that all tokens must belong to the same FA2 contract. In cases where the FA2 tokens are spread across different contracts, it becomes necessary to create separate transactions for each contract involved."),(0,r.kt)("p",null,"To create a new proposal, navigate to the sidebar and click on ",(0,r.kt)("inlineCode",{parentName:"p"},"New Proposal"),". From there, select the option for ",(0,r.kt)("inlineCode",{parentName:"p"},"FA2 Transfer"),". Choose an FA2 token and specify the desired amount and the recipient's address. When adding a second token, please note that it must belong to the same FA2 contract as the first token. Finally, click the ",(0,r.kt)("inlineCode",{parentName:"p"},"Submit")," button to create your new proposal."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:".././img/image (15).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("h3",{id:"contract-execution"},(0,r.kt)("strong",{parentName:"h3"},"Contract Execution")),(0,r.kt)("p",null,"Contract execution allows us to create a proposal to execute arbitrary Tezos contracts. Besides ",(0,r.kt)("inlineCode",{parentName:"p"},"FA2 Transfer"),", we can also use ",(0,r.kt)("inlineCode",{parentName:"p"},"Contract Execution")," to perform a transfer."," "),(0,r.kt)("p",null,"Taking an FA2 contract as an example, click ",(0,r.kt)("inlineCode",{parentName:"p"},"New Proposal")," on the sidebar and select ",(0,r.kt)("inlineCode",{parentName:"p"},"Contract Execution"),". Next, fill in a target address and the amount sent to the address. In this case, we fill FA2 address, ",(0,r.kt)("inlineCode",{parentName:"p"},"KT1Gh6T9CjpxEV6WxCzgExhrATEYtcLN5Fdp"),", and amount 0."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:".././img/image (19).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("p",null,"After click ",(0,r.kt)("inlineCode",{parentName:"p"},"Continue"),", TzSafe will check if the contract of the given address exists. If so, we can see the contract parameters rendered on the page, as the following shows."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:".././img/image (25).png",alt:""}),(0,r.kt)("figcaption",null)),(0,r.kt)("p",null,"To transfer FA2 tokens, we select the entrypoint ",(0,r.kt)("inlineCode",{parentName:"p"},"transfer")," and click ",(0,r.kt)("inlineCode",{parentName:"p"},"Add item")," to fill in the details. Finally, click the ",(0,r.kt)("inlineCode",{parentName:"p"},"Submit")," button to create a new proposal. As the same as the transaction of transferring XTZ, an insufficient amount can be funded after proposal creation is done."),(0,r.kt)("h3",{id:"batch"},(0,r.kt)("strong",{parentName:"h3"},"Batch")),(0,r.kt)("p",null,"Sometimes we want to perform several transactions at the same time. In TzSafe, we can achieve it by using batch. A batch of transactions is ",(0,r.kt)("em",{parentName:"p"},"atomic"),", which means any one of the transactions in one batch fails, all transactions fail."),(0,r.kt)("p",null,"This is useful when we want to ",(0,r.kt)("em",{parentName:"p"},"exchange")," assets with others. For example, if we want to buy the NFT of Alice in 5XTZ, we will make two transactions as a batch. First, transfer 5XTZ to Alics. Second, call Alice\u2019s contract to transfer NFT. We may want to have a third transaction to ensure NFT is in your name. Therefore, we can safely make a swap."),(0,r.kt)("p",null,"The following is the figure showing a batch. Users can click any type of transaction to add it and click ",(0,r.kt)("inlineCode",{parentName:"p"},"Submit")," all transactions at once. It is important to note that the indexes indicate the order in which the transactions will be executed."),(0,r.kt)("figure",null,(0,r.kt)("img",{src:"./img/image (10).png",alt:""}),(0,r.kt)("figcaption",null)))}f.isMDXComponent=!0}}]);