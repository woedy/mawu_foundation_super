import{j as r}from"./jsx-runtime-DF2Pcvd1.js";import{g as B,A as t}from"./api-DgUsSq44.js";import"./Button-DmdS7igb.js";import{B as C}from"./Typography-CQCX3U78.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";const R=({error:k,message:j,onDismiss:c,showDismiss:A=!1})=>{const T=j||B(k);return r.jsx("div",{className:"mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4",role:"alert","aria-live":"polite",children:r.jsxs("div",{className:"flex items-start gap-3",children:[r.jsx("div",{className:"flex-shrink-0",children:r.jsx("svg",{className:"h-5 w-5 text-amber-600",fill:"currentColor",viewBox:"0 0 20 20","aria-hidden":"true",children:r.jsx("path",{fillRule:"evenodd",d:"M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})})}),r.jsx("div",{className:"flex-1",children:r.jsx(C,{variant:"default",className:"text-sm text-amber-800",children:T})}),A&&c&&r.jsx("button",{type:"button",onClick:c,className:"flex-shrink-0 rounded-md p-1 text-amber-600 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-50","aria-label":"Dismiss",children:r.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor","aria-hidden":"true",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]})})};R.__docgenInfo={description:`ErrorBanner component for displaying inline error messages\r
when using fallback data or for non-critical errors.`,methods:[],displayName:"ErrorBanner",props:{error:{required:!0,tsType:{name:"Error"},description:""},message:{required:!1,tsType:{name:"string"},description:""},onDismiss:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},showDismiss:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const F={title:"Components/ErrorBanner",component:R,parameters:{layout:"padded"},tags:["autodocs"]},e={args:{error:new Error("Something went wrong. Please try again.")}},s={args:{error:new t("Network failed",0,"NETWORK_ERROR")}},a={args:{error:new Error("Original error"),message:"Using cached data. Some information may be outdated."}},o={args:{error:new Error("This is a dismissible error"),showDismiss:!0,onDismiss:()=>console.log("Dismissed")}},n={args:{error:new t("API unavailable",503,"SERVICE_UNAVAILABLE"),message:"Unable to load latest products. Showing cached data.",showDismiss:!0,onDismiss:()=>console.log("Dismissed")}},i={args:{error:new t("Insufficient inventory",400,"INSUFFICIENT_INVENTORY")}};var m,d,l;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    error: new Error('Something went wrong. Please try again.')
  }
}`,...(l=(d=e.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};var u,p,g;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    error: new ApiError('Network failed', 0, 'NETWORK_ERROR')
  }
}`,...(g=(p=s.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var f,h,E;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    error: new Error('Original error'),
    message: 'Using cached data. Some information may be outdated.'
  }
}`,...(E=(h=a.parameters)==null?void 0:h.docs)==null?void 0:E.source}}};var w,b,N;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    error: new Error('This is a dismissible error'),
    showDismiss: true,
    onDismiss: () => console.log('Dismissed')
  }
}`,...(N=(b=o.parameters)==null?void 0:b.docs)==null?void 0:N.source}}};var x,v,I;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    error: new ApiError('API unavailable', 503, 'SERVICE_UNAVAILABLE'),
    message: 'Unable to load latest products. Showing cached data.',
    showDismiss: true,
    onDismiss: () => console.log('Dismissed')
  }
}`,...(I=(v=n.parameters)==null?void 0:v.docs)==null?void 0:I.source}}};var D,y,S;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    error: new ApiError('Insufficient inventory', 400, 'INSUFFICIENT_INVENTORY')
  }
}`,...(S=(y=i.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};const W=["Default","NetworkError","CustomMessage","WithDismiss","FallbackDataScenario","InsufficientInventory"];export{a as CustomMessage,e as Default,n as FallbackDataScenario,i as InsufficientInventory,s as NetworkError,o as WithDismiss,W as __namedExportsOrder,F as default};
