/*
 * 启动服务器指令
 * 1、nodemon server.js
 * 2、node server.js
 * */

const express = require('express');

const app = express();
app.use(express.static('dist', { maxAge: 1000 * 3600 }));
app.listen(3000, () => {
  console.log('192.168.11.18://3000');
});
