"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[225],{3905:(e,t,a)=>{a.d(t,{Zo:()=>s,kt:()=>m});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function p(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function d(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),o=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):p(p({},t),e)),a},s=function(e){var t=o(e.components);return n.createElement(i.Provider,{value:t},e.children)},k={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,s=d(e,["components","mdxType","originalType","parentName"]),c=o(a),m=r,u=c["".concat(i,".").concat(m)]||c[m]||k[m]||l;return a?n.createElement(u,p(p({ref:t},s),{},{components:a})):n.createElement(u,p({ref:t},s))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,p=new Array(l);p[0]=c;var d={};for(var i in t)hasOwnProperty.call(t,i)&&(d[i]=t[i]);d.originalType=e,d.mdxType="string"==typeof e?e:r,p[1]=d;for(var o=2;o<l;o++)p[o]=a[o];return n.createElement.apply(null,p)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},6140:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>i,contentTitle:()=>p,default:()=>k,frontMatter:()=>l,metadata:()=>d,toc:()=>o});var n=a(7462),r=(a(7294),a(3905));const l={sidebar_position:1},p="OkenV1AddressRegistry",d={unversionedId:"reference/address/address-registry",id:"reference/address/address-registry",title:"OkenV1AddressRegistry",description:"This contract stores the deployment addresses of Oken V1 contracts.",source:"@site/docs/reference/1-address/01-address-registry.md",sourceDirName:"reference/1-address",slug:"/reference/address/address-registry",permalink:"/docs/reference/address/address-registry",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/reference/1-address/01-address-registry.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Smart Contracts Overview",permalink:"/docs/reference/intro"},next:{title:"OkenV1TokenRegistry",permalink:"/docs/reference/address/token-registry"}},i={},o=[{value:"Address",id:"address",level:2},{value:"tokenRegistry",id:"tokenregistry",level:3},{value:"updateTokenRegistry",id:"updatetokenregistry",level:3},{value:"Factory",id:"factory",level:2},{value:"nftFactory",id:"nftfactory",level:3},{value:"updateNftFactory",id:"updatenftfactory",level:3},{value:"nftFactoryPrivate",id:"nftfactoryprivate",level:3},{value:"updateNftFactoryPrivate",id:"updatenftfactoryprivate",level:3},{value:"rentableNftFactory",id:"rentablenftfactory",level:3},{value:"updateRentableNftFactory",id:"updaterentablenftfactory",level:3},{value:"rentableNftFactoryPrivate",id:"rentablenftfactoryprivate",level:3},{value:"updateRentableNftFactoryPrivate",id:"updaterentablenftfactoryprivate",level:3},{value:"wrappedNftFactory",id:"wrappednftfactory",level:3},{value:"updateWrappedNftFactory",id:"updatewrappednftfactory",level:3},{value:"Marketplace",id:"marketplace",level:2},{value:"rentMarketplace",id:"rentmarketplace",level:3},{value:"updateRentMarketplace",id:"updaterentmarketplace",level:3},{value:"sellMarketplace",id:"sellmarketplace",level:3},{value:"updateSellMarketplace",id:"updatesellmarketplace",level:3}],s={toc:o};function k(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},s,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"okenv1addressregistry"},"OkenV1AddressRegistry"),(0,r.kt)("p",null,"This contract stores the deployment addresses of Oken V1 contracts."),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"This contract inherits OpenZeppelin's ",(0,r.kt)("inlineCode",{parentName:"em"},"Ownable")," ",(0,r.kt)("a",{parentName:"em",href:"https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol"},"contract"),".")),(0,r.kt)("h2",{id:"address"},"Address"),(0,r.kt)("h3",{id:"tokenregistry"},"tokenRegistry"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function tokenRegistry() external view returns (address)\n")),(0,r.kt)("p",null,"Returns the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1TokenRegistry")," contract."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"[0]"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of the ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1TokenRegistry")," contract")))),(0,r.kt)("h3",{id:"updatetokenregistry"},"updateTokenRegistry"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function updateTokenRegistry(address newTokenRegistry) external\n")),(0,r.kt)("p",null,"Modifies the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1TokenRegistry")," contract."),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"This function will revert if ",(0,r.kt)("inlineCode",{parentName:"em"},"msg.sender")," is not the contract owner.")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"newTokenRegistry"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of the new ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1TokenRegistry")," contract")))),(0,r.kt)("h2",{id:"factory"},"Factory"),(0,r.kt)("h3",{id:"nftfactory"},"nftFactory"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function nftFactory() external view returns (address)\n")),(0,r.kt)("p",null,"Returns the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1NftFactory")," contract."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"[0]"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of the ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1NftFactory")," contract")))),(0,r.kt)("h3",{id:"updatenftfactory"},"updateNftFactory"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function updateNftFactory(address newNftFactory) external\n")),(0,r.kt)("p",null,"Modifies the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1NftFactory")," contract."),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"This function will revert if ",(0,r.kt)("inlineCode",{parentName:"em"},"msg.sender")," is not the contract owner.")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"newNftFactory"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of the new ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1NftFactory")," contract")))),(0,r.kt)("h3",{id:"nftfactoryprivate"},"nftFactoryPrivate"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function nftFactoryPrivate() external view returns (address)\n")),(0,r.kt)("p",null,"Returns the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1NftFactoryPrivate")," contract."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"[0]"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of the ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1NftFactoryPrivate")," contract")))),(0,r.kt)("h3",{id:"updatenftfactoryprivate"},"updateNftFactoryPrivate"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function updateNftFactoryPrivate(address newNftFactoryPrivate) external\n")),(0,r.kt)("p",null,"Modifies the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1NftFactoryPrivate")," contract."),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"This function will revert if ",(0,r.kt)("inlineCode",{parentName:"em"},"msg.sender")," is not the contract owner.")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"newNftFactoryPrivate"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of the new ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1NftFactoryPrivate")," contract")))),(0,r.kt)("h3",{id:"rentablenftfactory"},"rentableNftFactory"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function rentableNftFactory() external view returns (address)\n")),(0,r.kt)("p",null,"Returns the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1RentableNftFactory")," contract."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"[0]"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of the ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1RentableNftFactory")," contract")))),(0,r.kt)("h3",{id:"updaterentablenftfactory"},"updateRentableNftFactory"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function updateRentableNftFactory(address newRentableNftFactory) external\n")),(0,r.kt)("p",null,"Modifies the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1RentableNftFactory")," contract."),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"This function will revert if ",(0,r.kt)("inlineCode",{parentName:"em"},"msg.sender")," is not the contract owner.")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"newRentableNftFactory"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of new ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1RentableNftFactory")," contract")))),(0,r.kt)("h3",{id:"rentablenftfactoryprivate"},"rentableNftFactoryPrivate"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function rentableNftFactoryPrivate() external view returns (address)\n")),(0,r.kt)("p",null,"Returns the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1RentableNftFactoryPrivate")," contract."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"[0]"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of the ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1RentableNftFactoryPrivate")," contract")))),(0,r.kt)("h3",{id:"updaterentablenftfactoryprivate"},"updateRentableNftFactoryPrivate"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function updateRentableNftFactoryPrivate(address newRentableNftFactoryPrivate) external\n")),(0,r.kt)("p",null,"Modifies the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1RentableNftFactoryPrivate")," contract."),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"This function will revert if ",(0,r.kt)("inlineCode",{parentName:"em"},"msg.sender")," is not the contract owner.")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"newRentableNftFactoryPrivate"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of new ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1RentableNftFactoryPrivate")," contract")))),(0,r.kt)("h3",{id:"wrappednftfactory"},"wrappedNftFactory"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function wrappedNftFactory() external view returns (address)\n")),(0,r.kt)("p",null,"Returns the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1WrappedNftFactory")," contract."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"[0]"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of the ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1WrappedNftFactory")," contract")))),(0,r.kt)("h3",{id:"updatewrappednftfactory"},"updateWrappedNftFactory"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function updateWrappedNftFactory(address newWrappedNftFactory) external\n")),(0,r.kt)("p",null,"Modifies the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1WrappedNftFactory")," contract."),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"This function will revert if ",(0,r.kt)("inlineCode",{parentName:"em"},"msg.sender")," is not the contract owner.")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"newWrappedNftFactory"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of new ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1WrappedNftFactory")," contract")))),(0,r.kt)("h2",{id:"marketplace"},"Marketplace"),(0,r.kt)("h3",{id:"rentmarketplace"},"rentMarketplace"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function rentMarketplace() external view returns (address)\n")),(0,r.kt)("p",null,"Returns the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1RentMarketplace")," contract."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"[0]"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1RentMarketplace")," contract")))),(0,r.kt)("h3",{id:"updaterentmarketplace"},"updateRentMarketplace"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function updateRentMarketplace(address newRentMarketplace) external\n")),(0,r.kt)("p",null,"Modifies the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1RentMarketplace")," contract."),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"This function will revert if ",(0,r.kt)("inlineCode",{parentName:"em"},"msg.sender")," is not the contract owner.")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"newRentMarketplace"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of new ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1RentMarketplace")," contract")))),(0,r.kt)("h3",{id:"sellmarketplace"},"sellMarketplace"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function sellMarketplace() external view returns (address)\n")),(0,r.kt)("p",null,"Returns the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1SellMarketplace")," contract."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"[0]"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of the ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1SellMarketplace")," contract")))),(0,r.kt)("h3",{id:"updatesellmarketplace"},"updateSellMarketplace"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-solidity"},"function updateSellMarketplace(address newSellMarketplace) external\n")),(0,r.kt)("p",null,"Modifies the address of the ",(0,r.kt)("inlineCode",{parentName:"p"},"OkenV1SellMarketplace")," contract."),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"This function will revert if ",(0,r.kt)("inlineCode",{parentName:"em"},"msg.sender")," is not the contract owner.")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"newSellMarketplace"),(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"Address of new ",(0,r.kt)("inlineCode",{parentName:"td"},"OkenV1SellMarketplace")," contract")))))}k.isMDXComponent=!0}}]);