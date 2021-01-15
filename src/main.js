import './assets/style/index.css';

console.log('main.js 加载');
/* const add = function add(x, y) {
 return x + y;
 };

 console.log(add(2, 5));
 const promise = new Promise((resolve) => {
 console.log('new Promise at resolve');
 setTimeout(() => {
 console.log('定时器执行完了 ~');
 resolve();
 }, 0);
 });
 console.log(promise);
 */

import(
/* webpackChunkName:'math' */
  './math.js'
).then((res) => {
  console.log(res);
}).catch((e) => {
  console.log(e);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then(() => {
      console.log('sw ok');
    }).catch(() => {
      console.log('sw loss');
    });
  });
}
