import{j as r}from"./jsx-runtime-DF2Pcvd1.js";import{g as _,A as i}from"./api-DgUsSq44.js";import{B as O}from"./Button-DmdS7igb.js";import{S as I,H as V,B as C}from"./Typography-CQCX3U78.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";const S=({error:j,onRetry:c,title:P="Unable to Load Content",showRetry:b=!0})=>{const L=_(j);return r.jsx(I,{background:"default",padding:"lg",children:r.jsxs("div",{className:"mx-auto max-w-md text-center space-y-6",children:[r.jsx("div",{className:"mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100",children:r.jsx("svg",{className:"h-8 w-8 text-red-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor","aria-hidden":"true",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"})})}),r.jsx(V,{level:2,className:"text-2xl",children:P}),r.jsx(C,{variant:"muted",className:"text-base",children:L}),b&&c&&r.jsx("div",{className:"pt-2",children:r.jsx(O,{onClick:c,variant:"primary",size:"md",children:"Try Again"})})]})})};S.__docgenInfo={description:`ErrorState component for displaying API errors with user-friendly messages\r
and optional retry functionality.`,methods:[],displayName:"ErrorState",props:{error:{required:!0,tsType:{name:"Error"},description:""},onRetry:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Unable to Load Content'",computed:!1}},showRetry:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}}}};const U={title:"Components/ErrorState",component:S,parameters:{layout:"fullscreen"},tags:["autodocs"]},e={args:{error:new Error("Something went wrong. Please try again."),onRetry:()=>console.log("Retry clicked")}},o={args:{error:new i("Network failed",0,"NETWORK_ERROR"),onRetry:()=>console.log("Retry clicked")}},t={args:{error:new i("Validation failed",400,"VALIDATION_ERROR"),onRetry:()=>console.log("Retry clicked")}},a={args:{error:new Error("Failed to load products"),title:"Products Unavailable",onRetry:()=>console.log("Retry clicked")}},s={args:{error:new Error("This error cannot be retried"),showRetry:!1}},n={args:{error:new i("Payment processing failed",402,"PAYMENT_FAILED"),title:"Payment Failed",onRetry:()=>console.log("Retry clicked")}};var l,d,m;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    error: new Error('Something went wrong. Please try again.'),
    onRetry: () => console.log('Retry clicked')
  }
}`,...(m=(d=e.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var u,p,g;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    error: new ApiError('Network failed', 0, 'NETWORK_ERROR'),
    onRetry: () => console.log('Retry clicked')
  }
}`,...(g=(p=o.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var y,R,E;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    error: new ApiError('Validation failed', 400, 'VALIDATION_ERROR'),
    onRetry: () => console.log('Retry clicked')
  }
}`,...(E=(R=t.parameters)==null?void 0:R.docs)==null?void 0:E.source}}};var f,w,h;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    error: new Error('Failed to load products'),
    title: 'Products Unavailable',
    onRetry: () => console.log('Retry clicked')
  }
}`,...(h=(w=a.parameters)==null?void 0:w.docs)==null?void 0:h.source}}};var x,k,N;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    error: new Error('This error cannot be retried'),
    showRetry: false
  }
}`,...(N=(k=s.parameters)==null?void 0:k.docs)==null?void 0:N.source}}};var v,A,T;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    error: new ApiError('Payment processing failed', 402, 'PAYMENT_FAILED'),
    title: 'Payment Failed',
    onRetry: () => console.log('Retry clicked')
  }
}`,...(T=(A=n.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};const z=["Default","NetworkError","ValidationError","CustomTitle","WithoutRetry","PaymentError"];export{a as CustomTitle,e as Default,o as NetworkError,n as PaymentError,t as ValidationError,s as WithoutRetry,z as __namedExportsOrder,U as default};
