import './assets/style/index.css';
// import '@babel/polyfill'
// document.write('print by main.js');

const add = (x, y) => x + y;

console.log(add(2, 5));

const promise = new Promise(resolve => {
  console.log('new Promise at resolve');
  setTimeout(() => {
    console.log('定时器执行完了 ~');
    resolve();
  }, 0);
});
console.log(promise);
