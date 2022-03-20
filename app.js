//この２行はお決まりのやつ
const express = require('express');
const app = express();


// -----------------------------------------------
//      postgresql設定
// -----------------------------------------------
const { Client } = require('pg');
require('dotenv').config({debug:true});

const connection = new Client({
  connectionString: process.env.DATABASE_URL,
  //SSLを設定
  ssl: {
    sslmode=require,
    rejectUnauthorized:false
  }
});

// --------  接続  -----------
connection.connect((err) => {
    //エラー時の処理
    if(err){
        console.log('error connecting:' + err.stack);
        return;
    }
    //接続成功時の処理
    console.log('success');
  });

//ルーティング
//「http://localhost:3000/」を指定したときに、「index.ejs」を表示する
app.get('/', (req, res) => {
    //PostreSQL接続
    connection.query(
        'SELECT * FROM testtb', //発行するクエリ
        (error,result) => {
          if(error) throw error;
          res.render('a.ejs',{items:result}); //クエリ結果をitemsとしてindex.ejsに渡す
        }
      );
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
