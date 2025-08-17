
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  assets: {
    'index.csr.html': {size: 1164, hash: 'f41feb38e0fa0a758ac0a1758281849960e43a7675efd6478a2b0485af48e795', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1378, hash: 'bb2e540f0d3e05cdad402dbffc57dcdf8fe5e29c8e782b7f89adcaa148207081', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-IKBXNIWU.css': {size: 175, hash: 'jW64+KLNq1w', text: () => import('./assets-chunks/styles-IKBXNIWU_css.mjs').then(m => m.default)}
  },
};
