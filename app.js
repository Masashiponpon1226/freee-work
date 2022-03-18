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



let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
