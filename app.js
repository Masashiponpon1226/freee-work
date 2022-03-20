//この２行はお決まりのやつ
const express = require('express');
const app = express();

app.use(express.static('public'));


//ルーティング
//「http://localhost:3000/」を指定したときに、「index.ejs」を表示する
app.get('/', (req, res) => {
    //PostreSQL接続
    connection.query(
        'SELECT * FROM datetime', //発行するクエリ
        (error,result) => {
          if(error) throw error;
          res.render('a.ejs',{items:result.rows}); //クエリ結果をitemsとしてindex.ejsに渡す
        }
      );
});

// -----------------------------------------------
//      postgresql設定
// -----------------------------------------------
const { Client } = require('pg');
require('dotenv').config({debug:true});

const connection = new Client({
  connectionString: process.env.DATABASE_URL,
  //SSLを設定
  ssl: {
    sslmode:'require',
    rejectUnauthorized:false
  }
  
});

console.log(process.env.DATABASE_URL);

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

// -----------------------------------------------
//      port
// -----------------------------------------------
//LocalとHeroku接続先によってPORTを切り替える
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);