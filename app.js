//この２行はお決まりのやつ
const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));
var dayjs = require('dayjs');

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

//ホーム画面を指定したときに、「index.ejs」を表示する
app.get('/',(req,res)=>{
    const sql = "select * from datetime";
    connection.query(sql, (err, result, fields) =>{ 
        if(err)throw err
        //console.log(result);
    })
    res.render('top.ejs');
});

app.get('/index',(req,res)=>{
    res.render('index.ejs');
    //console.log(now.toFormat('M/D/YY'));
});

app.get('/start',(req,res)=>{
    var now = dayjs();
    var query = {
        text: 'insert into datetime (date, startime,finishtime,resttime,worktime) values($1, $2, $3, $4, $5)',
        values: [now.format('YYYY-MM-DD'),now.format('HH:mm:ss'),'000000','000000','000000']
    }
    connection.query(
        query,
        (err, result, fields) =>{ 
            if(err)throw err
            res.redirect('/exit');
        });
        console.log(now);
    });

app.get('/exit',(req,res)=>{
    res.render('exit.ejs');
    //console.log(now.toFormat('M/D/YY'));
});

app.get('/rest',(req,res)=>{
    res.render('rest.ejs');
    //console.log(now.toFormat('M/D/YY'));
});

app.get('/finish',(req,res)=>{
    var now = dayjs();
    var query2 = {
        text: 'update datetime set finishtime = $1 where id = (select max(id) from datetime)',
        values: [now.format('HH:mm:ss')]
    }
    connection.query(
        query2,
        (err, result, fields) =>{ 
            if(err)throw err
            res.redirect('/finish2');
        });
        console.log(now);
    });

app.get('/finish2',(req,res)=>{
    connection.query(
        "update datetime set worktime = finishtime-startime where id = (select max(id) from datetime)",
        (err, result, fields) =>{ 
            if(err)throw err
            res.redirect('/conclude');
        });
    });

app.get('/conclude',(req,res)=>{
    const sql = "select * from datetime where id = (select max(id) from datetime)";
    connection.query(sql, (err, result, fields) =>{ 
        if(err)throw err
        //console.log(result)
        res.render('conclude.ejs', {datas: result.rows})
    });
    //console.log(now.toFormat('M/D/YY'));
});

app.get('/timecard',(req,res)=>{
    const sql = "select * from datetime order by id desc";
    connection.query(sql, (err, result, fields) =>{ 
        if(err)throw err
        //console.log(result)
        res.render('timecard.ejs', {cards: result.rows})
    });
    //console.log(now.toFormat('M/D/YY'));
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