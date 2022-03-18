//この２行はお決まりのやつ
const express = require('express');
const app = express();

//ルーティング
//「http://localhost:3000/」を指定したときに、「index.ejs」を表示する
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// -----------------------------------------------
//      port
// -----------------------------------------------
//LocalとHeroku接続先によってPORTを切り替える
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);