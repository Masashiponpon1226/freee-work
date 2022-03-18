const express = require('express');
const app = express();


require('date-utils');



app.set("view engine", "ejs");

app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.render('top.ejs');
});
let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
