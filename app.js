const express = require('express');
const app = express();
const mysql = require('mysql');

require('date-utils');


const connection = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"I-masashi1226",
    database:"website"
});

app.set("view engine", "ejs");

app.use(express.static('public'));

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

app.listen(3000);
