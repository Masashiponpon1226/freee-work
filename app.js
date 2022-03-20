//この２行はお決まりのやつ
const express = require('express');
const app = express();


app.use(express.static('public'));


//ホーム画面を指定したときに、「index.ejs」を表示する
app.get('/',(req,res)=>{
    const sql = "select * from datetime";
    connection.query(sql, (err, result, fields) =>{ 
        if(err)throw err;
        //console.log(result);
    })
    res.render('top.ejs');
});

app.get('/index',(req,res)=>{
    res.render('index.ejs');
    //console.log(now.toFormat('M/D/YY'));
});

app.get('/start',(req,res)=>{
    var now = new Date();
    connection.query(
        "insert into datetime (date, startime,finishtime,resttime,worktime) values(?,?,?,?,?)",
        [now.toFormat("YYYY-MM-DD"),now.toFormat('HH24:MI:SS'),"000000","000000","000000"],
        (err, result, fields) =>{ 
            if(err)throw err
            res.redirect('/exit');
        });
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
    
    var now = new Date();
    connection.query(
        "update datetime set finishtime = ? ORDER BY id DESC LIMIT 1",
        [now.toFormat('HH24:MI:SS')],
        (err, result, fields) =>{ 
            if(err)throw err
            res.redirect('/finish2');
        });
    });

app.get('/finish2',(req,res)=>{
    connection.query(
        "update datetime set worktime = timediff(finishtime, startime) ORDER BY id DESC LIMIT 1",
        (err, result, fields) =>{ 
            if(err)throw err
            res.redirect('/conclude');
        });
    });

app.get('/conclude',(req,res)=>{
    const sql = "select * from datetime ORDER BY id DESC LIMIT 1";
    connection.query(sql, (err, result, fields) =>{ 
        if(err)throw err
        //console.log(result)
        res.render('conclude.ejs', {datas: result})
    });
    //console.log(now.toFormat('M/D/YY'));
});

app.get('/timecard',(req,res)=>{
    const sql = "select * from datetime order by id desc";
    connection.query(sql, (err, result, fields) =>{ 
        if(err)throw err
        //console.log(result)
        res.render('timecard.ejs', {cards: result})
    });
    //console.log(now.toFormat('M/D/YY'));
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